// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: Date;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  color: string;
  textColor: string;
  bgLight: string;
  icon: string;
  category: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
}

export interface ProductInfo {
  name: string;
  color: string;
  textColor: string;
  bgLight: string;
  icon: string;
  category: string;
}

// Category types for dynamic category management
export interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Plan types
export type PlanDuration = 'monthly' | 'yearly' | 'lifetime';
export type ActivationMethod = 'coupon_code' | 'license_key' | 'account_upgrade' | 'manual_setup';

export interface Plan {
  id: string;
  productId: string;
  name: string;
  description: string;
  duration: PlanDuration;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  features: string[];
  activationMethod: ActivationMethod;
  instructionsPdfUrl?: string;
  instructionsText?: string;
  imageUrl?: string;
  popular: boolean;
  active: boolean;
  createdAt: Date;
}

// Cart types
export interface CartItem {
  plan: Plan;
  quantity: number;
}

export interface CartItemDB {
  id: string;
  userId: string;
  planId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment types
export type PaymentGateway = 'razorpay';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  paymentGateway: PaymentGateway;
  gatewayPaymentId: string;
  gatewayOrderId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Order types
export type OrderStatus = 'pending' | 'payment_pending' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  paymentId?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// License types
export type LicenseType = 'coupon_code' | 'license_key' | 'account_credentials' | 'manual_setup';
export type LicenseStatus = 'active' | 'used' | 'expired' | 'revoked';

export interface License {
  id: string;
  orderId: string;
  planId: string;
  userId: string;
  licenseType: LicenseType;
  licenseValue: string;
  activationInstructions?: string;
  expiresAt?: Date;
  status: LicenseStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Email notification types
export type EmailType = 'order_confirmation' | 'license_delivery' | 'renewal_reminder' | 'upsell' | 'support';
export type EmailStatus = 'pending' | 'sent' | 'failed';

export interface EmailNotification {
  id: string;
  userId: string;
  type: EmailType;
  subject: string;
  content: string;
  status: EmailStatus;
  scheduledAt: Date;
  sentAt?: Date;
  createdAt: Date;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Cart context types
export interface CartContextType {
  items: CartItem[];
  addItem: (plan: Plan) => Promise<void>;
  removeItem: (planId: string) => Promise<void>;
  updateQuantity: (planId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isLoading?: boolean;
}
