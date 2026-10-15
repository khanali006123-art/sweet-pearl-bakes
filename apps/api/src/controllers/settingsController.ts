import { Request, Response, NextFunction } from 'express';
import { localStore } from '../config/store';
import { SettingsUpdateSchema } from '@sweetpearl/shared';
import { AuthRequest } from '../middleware/authMiddleware';

export async function getPublicSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = localStore.getData().settings;
    res.json({
      success: true,
      data: {
        businessHours: settings.businessHours,
        deliveryNote: settings.deliveryNote,
        announcementText: settings.announcementText,
        whatsappNumber: settings.whatsappNumber,
        minNoticeDaysSimple: settings.minNoticeDaysSimple,
        minNoticeDaysCustom: settings.minNoticeDaysCustom,
        paymentAccounts: settings.paymentAccounts
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateSettings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const validated = SettingsUpdateSchema.parse(req.body);
    const current = localStore.getData().settings;

    const updated = {
      ...current,
      ...validated
    };

    localStore.getData().settings = updated;
    localStore.save();

    res.json({ success: true, message: 'Settings updated successfully', data: updated });
  } catch (err) {
    next(err);
  }
}

export async function adminGetStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const orders = localStore.getData().orders;
    const products = localStore.getData().products;
    const messages = localStore.getData().messages;
    const subscribers = localStore.getData().subscribers;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Received' || o.payment.status === 'Pending').length;
    const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;

    const totalRevenue = orders
      .filter(o => o.payment.status === 'Verified')
      .reduce((sum, o) => sum + (o.totalPKR || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const ordersToday = orders.filter(o => {
      const orderDate = new Date(o.createdAt!).toISOString().split('T')[0];
      return orderDate === todayStr;
    }).length;

    const newMessages = messages.filter(m => m.status === 'New').length;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        activeOrders,
        completedOrders,
        totalRevenuePKR: totalRevenue,
        ordersToday,
        activeProducts: products.filter(p => p.isActive).length,
        totalSubscribers: subscribers.length,
        newMessages
      }
    });
  } catch (err) {
    next(err);
  }
}
