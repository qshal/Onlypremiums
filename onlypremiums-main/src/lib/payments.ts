import { PaymentGateway, CartItem } from '@/types';

// Payment gateway configurations
export const PAYMENT_CONFIG = {
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
    keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
  },
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    clientSecret: import.meta.env.VITE_PAYPAL_CLIENT_SECRET,
  },
};

export interface PaymentOptions {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  gatewayOrderId?: string;
  error?: string;
  gatewayResponse?: any;
}

// Razorpay integration
export const initializeRazorpay = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      resolve((window as any).Razorpay);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        resolve((window as any).Razorpay);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve((window as any).Razorpay);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };
    document.head.appendChild(script);
  });
};

export const processRazorpayPayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  try {
    // Validate required options
    if (!options.amount || options.amount < 100) {
      throw new Error('Invalid amount. Minimum amount is ₹1 (100 paise)');
    }
    
    if (!options.customerEmail || !options.customerName) {
      throw new Error('Customer details are required');
    }

    const Razorpay = await initializeRazorpay();
    
    return new Promise((resolve) => {
      const razorpayOptions = {
        key: PAYMENT_CONFIG.razorpay.keyId,
        amount: options.amount, // amount in paise
        currency: options.currency,
        name: 'OnlyPremiums',
        description: `Purchase of ${options.items.length} item(s)`,
        // Auto-capture payment immediately after authorization
        auto_capture: true,
        prefill: {
          name: options.customerName,
          email: options.customerEmail,
          contact: options.customerPhone,
        },
        theme: {
          color: '#6366f1',
        },
        notes: {
          order_id: options.orderId,
          customer_email: options.customerEmail,
          items_count: options.items.length.toString(),
        },
        handler: (response: any) => {
          // Payment successful and automatically captured
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            gatewayOrderId: response.razorpay_order_id,
            gatewayResponse: response,
          });
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      };

      const razorpayInstance = new Razorpay(razorpayOptions);
      razorpayInstance.open();
    });
  } catch (error) {
    return {
      success: false,
      error: 'Failed to initialize Razorpay',
    };
  }
};



// Main payment processor
export const processPayment = async (
  gateway: PaymentGateway,
  options: PaymentOptions
): Promise<PaymentResult> => {
  switch (gateway) {
    case 'razorpay':
      return processRazorpayPayment(options);
    default:
      return {
        success: false,
        error: 'Unsupported payment gateway',
      };
  }
};

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });
  
  return formatter.format(amount / 100); // Convert from paise to rupees
};

export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.plan.price * item.quantity), 0);
};

export const calculateSavings = (items: CartItem[]): number => {
  return items.reduce((savings, item) => {
    const itemSavings = (item.plan.originalPrice - item.plan.price) * item.quantity;
    return savings + itemSavings;
  }, 0);
};

// Manual payment capture function (for existing authorized payments)
export const captureRazorpayPayment = async (paymentId: string, amount?: number): Promise<any> => {
  try {
    // This would typically be done on the backend with Razorpay API
    // For now, we'll provide instructions for manual capture
    console.log(`To capture payment ${paymentId}:`);
    console.log('1. Go to Razorpay Dashboard');
    console.log('2. Navigate to Payments > All Payments');
    console.log(`3. Find payment ID: ${paymentId}`);
    console.log('4. Click "Capture" button');
    console.log(`5. Enter amount: ${amount ? (amount / 100).toFixed(2) : 'full amount'}`);
    
    return {
      success: true,
      message: 'Payment capture instructions logged to console',
      paymentId,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to capture payment',
    };
  }
};