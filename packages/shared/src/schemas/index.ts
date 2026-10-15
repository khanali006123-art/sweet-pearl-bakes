import { z } from 'zod';

export const PhoneRegex = /^((\+92)?(0)?3[0-9]{2}[0-9]{7})$/;

export const CustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  phone: z
    .string()
    .min(10, 'Valid Pakistani phone number required')
    .max(15)
    .regex(/^[0-9+\-\s()]+$/, 'Invalid characters in phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export const OrderItemSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().min(1, 'Product name is required'),
  flavor: z.string().min(1, 'Flavor is required'),
  sizeLabel: z.string().min(1, 'Size/weight is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  unitPricePKR: z.number().nonnegative('Price cannot be negative').default(0),
});

export const OrderPaymentSchema = z.object({
  method: z.enum(['Easypaisa', 'JazzCash']),
  proofUrl: z.string().optional(),
  status: z.enum(['Pending', 'Verified', 'Rejected']).default('Pending'),
  referenceNumber: z.string().optional(),
});

export const OrderCreateSchema = z.object({
  customer: CustomerSchema,
  deliveryAddress: z.string().min(5, 'Delivery address in Dera Ismail Khan is required').max(300),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  deliveryDate: z.string().min(10, 'Delivery date is required'),
  instructions: z.string().max(500, 'Instructions max 500 characters').optional(),
  designImageUrl: z.string().optional(),
  paymentMethod: z.enum(['Easypaisa', 'JazzCash']),
  paymentProofUrl: z.string().optional(),
  source: z.enum(['web', 'whatsapp']).default('web'),
});

export const OrderTrackSchema = z.object({
  orderNumber: z.string().min(4, 'Valid Order Number required (e.g. SPB-1001)'),
  phone: z.string().min(8, 'Phone number used during order is required'),
});

export const ContactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(8, 'Valid phone number required').optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
});

export const SubscriberSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email('Valid email is required').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ProductPriceOptionSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  amountPKR: z.number().nonnegative('Amount must be non-negative'),
});

export const ProductImageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  alt: z.string().default('Sweet Pearl Bakes creation'),
});

export const ProductCreateUpdateSchema = z.object({
  name: z.string().min(2, 'Product name required').max(120),
  slug: z.string().min(2, 'Slug required').max(120),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(5, 'Description required').max(1500),
  images: z.array(ProductImageSchema).min(1, 'At least one image is required'),
  priceOptions: z.array(ProductPriceOptionSchema).min(1, 'At least one price option is required'),
  priceMode: z.enum(['fixed', 'from', 'quote']).default('from'),
  flavors: z.array(z.string()).default([]),
  minNoticeDays: z.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const SettingsUpdateSchema = z.object({
  businessHours: z.string().optional(),
  deliveryNote: z.string().optional(),
  announcementText: z.string().optional(),
  whatsappNumber: z.string().optional(),
  minNoticeDaysSimple: z.number().int().min(1).optional(),
  minNoticeDaysCustom: z.number().int().min(1).optional(),
  paymentAccounts: z
    .array(
      z.object({
        method: z.enum(['Easypaisa', 'JazzCash']),
        number: z.string().min(8),
        title: z.string().min(2),
        instructions: z.string().optional(),
      })
    )
    .optional(),
});
