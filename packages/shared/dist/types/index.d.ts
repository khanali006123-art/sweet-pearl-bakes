export type ProductCategory = 'Bakery Item' | 'Bread / Loaf' | 'Designer Cake' | 'Kids Theme' | 'Theme Cake' | 'Custom Cake' | 'Drip Cake' | 'Standard Cream' | 'Fudge / Premium' | 'Cream Cake' | 'Premium Cake' | 'Crunch Cake' | string;
export type CakeFlavor = 'Chocolate' | 'Vanilla' | 'Red Velvet' | 'Black Forest' | 'Strawberry';
export type PriceMode = 'fixed' | 'from' | 'quote';
export type OrderStatus = 'Received' | 'Payment Verified' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Easypaisa' | 'JazzCash';
export type PaymentStatus = 'Pending' | 'Verified' | 'Rejected';
export interface PriceOption {
    label: string;
    amountPKR: number;
}
export interface ProductImage {
    url: string;
    alt: string;
}
export interface IProduct {
    _id?: string;
    name: string;
    slug: string;
    category: ProductCategory;
    description: string;
    images: ProductImage[];
    priceOptions: PriceOption[];
    priceMode: PriceMode;
    flavors: string[];
    minNoticeDays: number;
    isActive: boolean;
    sortOrder: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
export interface OrderItem {
    productId?: string;
    productName: string;
    flavor: string;
    sizeLabel: string;
    quantity: number;
    unitPricePKR: number;
}
export interface CustomerDetails {
    name: string;
    phone: string;
    email?: string;
}
export interface StatusHistoryEntry {
    status: OrderStatus;
    at: string | Date;
    by: string;
    note?: string;
}
export interface OrderPayment {
    method: PaymentMethod;
    proofUrl?: string;
    status: PaymentStatus;
    verifiedAt?: string | Date;
    referenceNumber?: string;
}
export interface IOrder {
    _id?: string;
    orderNumber: string;
    customer: CustomerDetails;
    deliveryAddress: string;
    items: OrderItem[];
    deliveryDate: string;
    instructions?: string;
    designImageUrl?: string;
    deliveryFeePKR?: number;
    totalPKR?: number;
    payment: OrderPayment;
    status: OrderStatus;
    statusHistory: StatusHistoryEntry[];
    source: 'web' | 'whatsapp';
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
export interface IContactMessage {
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
    message: string;
    status: 'New' | 'Read' | 'Replied';
    createdAt?: string | Date;
}
export interface ISubscriber {
    _id?: string;
    email: string;
    subscribedAt?: string | Date;
    unsubscribed?: boolean;
}
export interface PaymentAccount {
    method: PaymentMethod;
    number: string;
    title: string;
    instructions?: string;
}
export interface ISettings {
    _id?: string;
    businessHours: string;
    deliveryNote: string;
    paymentAccounts: PaymentAccount[];
    announcementText: string;
    whatsappNumber: string;
    minNoticeDaysSimple: number;
    minNoticeDaysCustom: number;
}
export interface IAuditLog {
    _id?: string;
    userId: string;
    userEmail?: string;
    action: string;
    entity: string;
    entityId: string;
    details?: string;
    at: string | Date;
}
