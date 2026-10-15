"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsUpdateSchema = exports.ProductCreateUpdateSchema = exports.ProductImageSchema = exports.ProductPriceOptionSchema = exports.AdminLoginSchema = exports.SubscriberSchema = exports.ContactMessageSchema = exports.OrderTrackSchema = exports.OrderCreateSchema = exports.OrderPaymentSchema = exports.OrderItemSchema = exports.CustomerSchema = exports.PhoneRegex = void 0;
const zod_1 = require("zod");
exports.PhoneRegex = /^((\+92)?(0)?3[0-9]{2}[0-9]{7})$/;
exports.CustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(80),
    phone: zod_1.z
        .string()
        .min(10, 'Valid Pakistani phone number required')
        .max(15)
        .regex(/^[0-9+\-\s()]+$/, 'Invalid characters in phone number'),
    email: zod_1.z.string().email('Invalid email address').optional().or(zod_1.z.literal('')),
});
exports.OrderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().optional(),
    productName: zod_1.z.string().min(1, 'Product name is required'),
    flavor: zod_1.z.string().min(1, 'Flavor is required'),
    sizeLabel: zod_1.z.string().min(1, 'Size/weight is required'),
    quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1').default(1),
    unitPricePKR: zod_1.z.number().nonnegative('Price cannot be negative').default(0),
});
exports.OrderPaymentSchema = zod_1.z.object({
    method: zod_1.z.enum(['Easypaisa', 'JazzCash']),
    proofUrl: zod_1.z.string().optional(),
    status: zod_1.z.enum(['Pending', 'Verified', 'Rejected']).default('Pending'),
    referenceNumber: zod_1.z.string().optional(),
});
exports.OrderCreateSchema = zod_1.z.object({
    customer: exports.CustomerSchema,
    deliveryAddress: zod_1.z.string().min(5, 'Delivery address in Dera Ismail Khan is required').max(300),
    items: zod_1.z.array(exports.OrderItemSchema).min(1, 'At least one item is required'),
    deliveryDate: zod_1.z.string().min(10, 'Delivery date is required'),
    instructions: zod_1.z.string().max(500, 'Instructions max 500 characters').optional(),
    designImageUrl: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.enum(['Easypaisa', 'JazzCash']),
    paymentProofUrl: zod_1.z.string().optional(),
    source: zod_1.z.enum(['web', 'whatsapp']).default('web'),
});
exports.OrderTrackSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().min(4, 'Valid Order Number required (e.g. SPB-1001)'),
    phone: zod_1.z.string().min(8, 'Phone number used during order is required'),
});
exports.ContactMessageSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(80),
    email: zod_1.z.string().email('Invalid email').optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().min(8, 'Valid phone number required').optional().or(zod_1.z.literal('')),
    message: zod_1.z.string().min(5, 'Message must be at least 5 characters').max(2000),
});
exports.SubscriberSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address').toLowerCase(),
});
exports.AdminLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Valid email is required').toLowerCase(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.ProductPriceOptionSchema = zod_1.z.object({
    label: zod_1.z.string().min(1, 'Label is required'),
    amountPKR: zod_1.z.number().nonnegative('Amount must be non-negative'),
});
exports.ProductImageSchema = zod_1.z.object({
    url: zod_1.z.string().min(1, 'Image URL is required'),
    alt: zod_1.z.string().default('Sweet Pearl Bakes creation'),
});
exports.ProductCreateUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Product name required').max(120),
    slug: zod_1.z.string().min(2, 'Slug required').max(120),
    category: zod_1.z.string().min(1, 'Category is required'),
    description: zod_1.z.string().min(5, 'Description required').max(1500),
    images: zod_1.z.array(exports.ProductImageSchema).min(1, 'At least one image is required'),
    priceOptions: zod_1.z.array(exports.ProductPriceOptionSchema).min(1, 'At least one price option is required'),
    priceMode: zod_1.z.enum(['fixed', 'from', 'quote']).default('from'),
    flavors: zod_1.z.array(zod_1.z.string()).default([]),
    minNoticeDays: zod_1.z.number().int().min(1).default(1),
    isActive: zod_1.z.boolean().default(true),
    sortOrder: zod_1.z.number().int().default(0),
});
exports.SettingsUpdateSchema = zod_1.z.object({
    businessHours: zod_1.z.string().optional(),
    deliveryNote: zod_1.z.string().optional(),
    announcementText: zod_1.z.string().optional(),
    whatsappNumber: zod_1.z.string().optional(),
    minNoticeDaysSimple: zod_1.z.number().int().min(1).optional(),
    minNoticeDaysCustom: zod_1.z.number().int().min(1).optional(),
    paymentAccounts: zod_1.z
        .array(zod_1.z.object({
        method: zod_1.z.enum(['Easypaisa', 'JazzCash']),
        number: zod_1.z.string().min(8),
        title: zod_1.z.string().min(2),
        instructions: zod_1.z.string().optional(),
    }))
        .optional(),
});
