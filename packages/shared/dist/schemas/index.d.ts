import { z } from 'zod';
export declare const PhoneRegex: RegExp;
export declare const CustomerSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    email?: string | undefined;
}, {
    name: string;
    phone: string;
    email?: string | undefined;
}>;
export declare const OrderItemSchema: z.ZodObject<{
    productId: z.ZodOptional<z.ZodString>;
    productName: z.ZodString;
    flavor: z.ZodString;
    sizeLabel: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
    unitPricePKR: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    productName: string;
    flavor: string;
    sizeLabel: string;
    quantity: number;
    unitPricePKR: number;
    productId?: string | undefined;
}, {
    productName: string;
    flavor: string;
    sizeLabel: string;
    productId?: string | undefined;
    quantity?: number | undefined;
    unitPricePKR?: number | undefined;
}>;
export declare const OrderPaymentSchema: z.ZodObject<{
    method: z.ZodEnum<["Easypaisa", "JazzCash"]>;
    proofUrl: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["Pending", "Verified", "Rejected"]>>;
    referenceNumber: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "Pending" | "Verified" | "Rejected";
    method: "Easypaisa" | "JazzCash";
    proofUrl: string;
    referenceNumber?: string | undefined;
}, {
    method: "Easypaisa" | "JazzCash";
    proofUrl: string;
    status?: "Pending" | "Verified" | "Rejected" | undefined;
    referenceNumber?: string | undefined;
}>;
export declare const OrderCreateSchema: z.ZodObject<{
    customer: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
        email?: string | undefined;
    }, {
        name: string;
        phone: string;
        email?: string | undefined;
    }>;
    deliveryAddress: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodOptional<z.ZodString>;
        productName: z.ZodString;
        flavor: z.ZodString;
        sizeLabel: z.ZodString;
        quantity: z.ZodDefault<z.ZodNumber>;
        unitPricePKR: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        productName: string;
        flavor: string;
        sizeLabel: string;
        quantity: number;
        unitPricePKR: number;
        productId?: string | undefined;
    }, {
        productName: string;
        flavor: string;
        sizeLabel: string;
        productId?: string | undefined;
        quantity?: number | undefined;
        unitPricePKR?: number | undefined;
    }>, "many">;
    deliveryDate: z.ZodString;
    instructions: z.ZodOptional<z.ZodString>;
    designImageUrl: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodEnum<["Easypaisa", "JazzCash"]>;
    paymentProofUrl: z.ZodString;
    source: z.ZodDefault<z.ZodEnum<["web", "whatsapp"]>>;
}, "strip", z.ZodTypeAny, {
    customer: {
        name: string;
        phone: string;
        email?: string | undefined;
    };
    deliveryAddress: string;
    items: {
        productName: string;
        flavor: string;
        sizeLabel: string;
        quantity: number;
        unitPricePKR: number;
        productId?: string | undefined;
    }[];
    deliveryDate: string;
    paymentMethod: "Easypaisa" | "JazzCash";
    paymentProofUrl: string;
    source: "web" | "whatsapp";
    instructions?: string | undefined;
    designImageUrl?: string | undefined;
}, {
    customer: {
        name: string;
        phone: string;
        email?: string | undefined;
    };
    deliveryAddress: string;
    items: {
        productName: string;
        flavor: string;
        sizeLabel: string;
        productId?: string | undefined;
        quantity?: number | undefined;
        unitPricePKR?: number | undefined;
    }[];
    deliveryDate: string;
    paymentMethod: "Easypaisa" | "JazzCash";
    paymentProofUrl: string;
    instructions?: string | undefined;
    designImageUrl?: string | undefined;
    source?: "web" | "whatsapp" | undefined;
}>;
export declare const OrderTrackSchema: z.ZodObject<{
    orderNumber: z.ZodString;
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
    orderNumber: string;
}, {
    phone: string;
    orderNumber: string;
}>;
export declare const ContactMessageSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    message: string;
    phone?: string | undefined;
    email?: string | undefined;
}, {
    name: string;
    message: string;
    phone?: string | undefined;
    email?: string | undefined;
}>;
export declare const SubscriberSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const AdminLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const ProductPriceOptionSchema: z.ZodObject<{
    label: z.ZodString;
    amountPKR: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    label: string;
    amountPKR: number;
}, {
    label: string;
    amountPKR: number;
}>;
export declare const ProductImageSchema: z.ZodObject<{
    url: z.ZodString;
    alt: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    alt: string;
}, {
    url: string;
    alt?: string | undefined;
}>;
export declare const ProductCreateUpdateSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    images: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
    }, {
        url: string;
        alt?: string | undefined;
    }>, "many">;
    priceOptions: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        amountPKR: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        amountPKR: number;
    }, {
        label: string;
        amountPKR: number;
    }>, "many">;
    priceMode: z.ZodDefault<z.ZodEnum<["fixed", "from", "quote"]>>;
    flavors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    minNoticeDays: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    category: string;
    description: string;
    images: {
        url: string;
        alt: string;
    }[];
    priceOptions: {
        label: string;
        amountPKR: number;
    }[];
    priceMode: "fixed" | "from" | "quote";
    flavors: string[];
    minNoticeDays: number;
    isActive: boolean;
    sortOrder: number;
}, {
    name: string;
    slug: string;
    category: string;
    description: string;
    images: {
        url: string;
        alt?: string | undefined;
    }[];
    priceOptions: {
        label: string;
        amountPKR: number;
    }[];
    priceMode?: "fixed" | "from" | "quote" | undefined;
    flavors?: string[] | undefined;
    minNoticeDays?: number | undefined;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
}>;
export declare const SettingsUpdateSchema: z.ZodObject<{
    businessHours: z.ZodOptional<z.ZodString>;
    deliveryNote: z.ZodOptional<z.ZodString>;
    announcementText: z.ZodOptional<z.ZodString>;
    whatsappNumber: z.ZodOptional<z.ZodString>;
    minNoticeDaysSimple: z.ZodOptional<z.ZodNumber>;
    minNoticeDaysCustom: z.ZodOptional<z.ZodNumber>;
    paymentAccounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        method: z.ZodEnum<["Easypaisa", "JazzCash"]>;
        number: z.ZodString;
        title: z.ZodString;
        instructions: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        number: string;
        method: "Easypaisa" | "JazzCash";
        title: string;
        instructions?: string | undefined;
    }, {
        number: string;
        method: "Easypaisa" | "JazzCash";
        title: string;
        instructions?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    businessHours?: string | undefined;
    deliveryNote?: string | undefined;
    announcementText?: string | undefined;
    whatsappNumber?: string | undefined;
    minNoticeDaysSimple?: number | undefined;
    minNoticeDaysCustom?: number | undefined;
    paymentAccounts?: {
        number: string;
        method: "Easypaisa" | "JazzCash";
        title: string;
        instructions?: string | undefined;
    }[] | undefined;
}, {
    businessHours?: string | undefined;
    deliveryNote?: string | undefined;
    announcementText?: string | undefined;
    whatsappNumber?: string | undefined;
    minNoticeDaysSimple?: number | undefined;
    minNoticeDaysCustom?: number | undefined;
    paymentAccounts?: {
        number: string;
        method: "Easypaisa" | "JazzCash";
        title: string;
        instructions?: string | undefined;
    }[] | undefined;
}>;
