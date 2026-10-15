import { Request, Response, NextFunction } from 'express';
import { localStore } from '../config/store';
import { OrderCreateSchema, OrderTrackSchema, IOrder, OrderStatus } from '@sweetpearl/shared';
import { AuthRequest } from '../middleware/authMiddleware';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = OrderCreateSchema.parse(req.body);

    // Calculate total
    const itemsTotal = validated.items.reduce((acc, item) => acc + (item.unitPricePKR * item.quantity), 0);
    const totalPKR = itemsTotal; // delivery fee is quoted separately by owner

    const orderNumber = localStore.getNextOrderNumber();

    const newOrder: IOrder = {
      _id: `ord_${Date.now()}`,
      orderNumber,
      customer: {
        name: validated.customer.name,
        phone: validated.customer.phone,
        email: validated.customer.email || undefined
      },
      deliveryAddress: validated.deliveryAddress,
      items: validated.items,
      deliveryDate: validated.deliveryDate,
      instructions: validated.instructions,
      designImageUrl: validated.designImageUrl,
      totalPKR,
      payment: {
        method: validated.paymentMethod,
        proofUrl: validated.paymentProofUrl,
        status: validated.paymentProofUrl ? 'Pending' : 'Pending'
      },
      status: 'Received',
      statusHistory: [
        {
          status: 'Received',
          at: new Date(),
          by: 'Customer (Online Form)',
          note: `Order placed via ${validated.source}`
        }
      ],
      source: validated.source,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    localStore.getData().orders.unshift(newOrder);
    localStore.save();

    // Prepare WhatsApp message URL for customer convenience
    const settings = localStore.getData().settings;
    const itemsSummary = newOrder.items.map(i => `${i.quantity}x ${i.productName} (${i.sizeLabel}, ${i.flavor})`).join(', ');
    const waText = encodeURIComponent(
      `Assalam-o-Alaikum Sweet Pearl Bakes! I just placed Order #${newOrder.orderNumber}.\n\nItems: ${itemsSummary}\nDelivery Date: ${newOrder.deliveryDate}\nName: ${newOrder.customer.name}\nTotal: Rs. ${newOrder.totalPKR}\nPayment via: ${newOrder.payment.method}`
    );
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${waText}`;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderNumber: newOrder.orderNumber,
        totalPKR: newOrder.totalPKR,
        deliveryDate: newOrder.deliveryDate,
        status: newOrder.status,
        whatsappUrl
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function trackOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderNumber, phone } = OrderTrackSchema.parse(req.body);

    const cleanInputPhone = phone.replace(/[^0-9]/g, '');
    const cleanOrderNumber = orderNumber.trim().toUpperCase();

    const order = localStore.getData().orders.find(o => {
      const matchNum = o.orderNumber.toUpperCase() === cleanOrderNumber;
      const cleanOrderPhone = o.customer.phone.replace(/[^0-9]/g, '');
      const matchPhone = cleanOrderPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanOrderPhone);
      return matchNum && matchPhone;
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'No matching order found. Please verify your Order Number (e.g. SPB-1001) and the phone number provided at checkout.'
      });
      return;
    }

    // PRIVACY ENFORCEMENT: Never expose customer delivery address or sensitive payment details in public tracking response
    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customer.name.split(' ')[0] + ' ***', // masked
        deliveryDate: order.deliveryDate,
        status: order.status,
        statusHistory: order.statusHistory,
        paymentStatus: order.payment.status,
        items: order.items.map(i => ({
          productName: i.productName,
          flavor: i.flavor,
          sizeLabel: i.sizeLabel,
          quantity: i.quantity
        })),
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function adminGetOrders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, search } = req.query;
    let orders = [...localStore.getData().orders];

    if (status && status !== 'All') {
      orders = orders.filter(o => o.status === status);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }

    orders.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function adminGetOrderById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const order = localStore.getData().orders.find(o => o._id === id || o.orderNumber === id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses: OrderStatus[] = [
      'Received',
      'Payment Verified',
      'Preparing',
      'Ready',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid order status transition' });
      return;
    }

    const index = localStore.getData().orders.findIndex(o => o._id === id || o.orderNumber === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const order = localStore.getData().orders[index];
    order.status = status;
    order.statusHistory.push({
      status,
      at: new Date(),
      by: req.user?.name || 'Admin',
      note: note || undefined
    });
    order.updatedAt = new Date();

    localStore.save();

    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateOrderPayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, referenceNumber } = req.body;

    if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid payment status' });
      return;
    }

    const index = localStore.getData().orders.findIndex(o => o._id === id || o.orderNumber === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const order = localStore.getData().orders[index];
    order.payment.status = status;
    if (referenceNumber) order.payment.referenceNumber = referenceNumber;
    if (status === 'Verified') {
      order.payment.verifiedAt = new Date();
      if (order.status === 'Received') {
        order.status = 'Payment Verified';
        order.statusHistory.push({
          status: 'Payment Verified',
          at: new Date(),
          by: req.user?.name || 'Admin',
          note: 'Payment verified via manual screenshot audit'
        });
      }
    }
    order.updatedAt = new Date();

    localStore.save();

    res.json({ success: true, message: `Payment marked as ${status}`, data: order });
  } catch (err) {
    next(err);
  }
}

export async function adminExportOrdersCsv(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const orders = localStore.getData().orders;
    const headers = [
      'OrderNumber',
      'CustomerName',
      'Phone',
      'DeliveryDate',
      'Address',
      'Items',
      'TotalPKR',
      'PaymentMethod',
      'PaymentStatus',
      'OrderStatus',
      'CreatedDate'
    ];

    const rows = orders.map(o => [
      o.orderNumber,
      `"${o.customer.name.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      o.deliveryDate,
      `"${o.deliveryAddress.replace(/"/g, '""')}"`,
      `"${o.items.map(i => `${i.quantity}x ${i.productName}`).join('; ')}"`,
      o.totalPKR || 0,
      o.payment.method,
      o.payment.status,
      o.status,
      new Date(o.createdAt!).toISOString().split('T')[0]
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=SweetPearlBakes_Orders_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}
