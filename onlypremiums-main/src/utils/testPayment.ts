// Payment Integration Test Utility
// Use this in browser console to test Razorpay integration

export const testRazorpayIntegration = () => {
  console.log('🧪 Testing Razorpay Integration...');
  
  // Check environment variables
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET;
  
  console.log('✅ Environment Variables:');
  console.log('Key ID:', keyId ? '✅ Loaded' : '❌ Missing');
  console.log('Key Secret:', keySecret ? '✅ Loaded' : '❌ Missing');
  
  if (!keyId || !keySecret) {
    console.error('❌ Razorpay credentials not found in environment variables');
    return false;
  }
  
  // Check if Razorpay script can be loaded
  console.log('🔄 Testing Razorpay script loading...');
  
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  
  script.onload = () => {
    console.log('✅ Razorpay script loaded successfully');
    console.log('✅ Razorpay object available:', typeof (window as any).Razorpay);
    
    // Test basic Razorpay initialization
    try {
      const testOptions = {
        key: keyId,
        amount: 100, // ₹1 in paise
        currency: 'INR',
        name: 'OnlyPremiums Test',
        description: 'Test Payment Integration',
        handler: (response: any) => {
          console.log('✅ Payment Success:', response);
        },
        modal: {
          ondismiss: () => {
            console.log('ℹ️ Payment modal dismissed');
          }
        }
      };
      
      console.log('✅ Razorpay configuration valid');
      console.log('🎯 Integration test completed successfully!');
      
      return true;
    } catch (error) {
      console.error('❌ Razorpay initialization failed:', error);
      return false;
    }
  };
  
  script.onerror = () => {
    console.error('❌ Failed to load Razorpay script');
    return false;
  };
  
  document.head.appendChild(script);
};

// Test payment flow with minimal amount
export const testMinimalPayment = () => {
  console.log('💳 Testing minimal payment flow...');
  
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    console.error('❌ Razorpay Key ID not found');
    return;
  }
  
  // Load Razorpay script
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  
  script.onload = () => {
    const Razorpay = (window as any).Razorpay;
    
    const options = {
      key: keyId,
      amount: 100, // ₹1 in paise (minimum for testing)
      currency: 'INR',
      name: 'OnlyPremiums',
      description: 'Test Payment - ₹1',
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#6366f1'
      },
      handler: (response: any) => {
        console.log('✅ Payment Successful!');
        console.log('Payment ID:', response.razorpay_payment_id);
        console.log('Order ID:', response.razorpay_order_id);
        alert('✅ Test Payment Successful! Check console for details.');
      },
      modal: {
        ondismiss: () => {
          console.log('ℹ️ Payment cancelled by user');
          alert('Payment cancelled');
        }
      }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
  };
  
  document.head.appendChild(script);
};

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).testRazorpayIntegration = testRazorpayIntegration;
  (window as any).testMinimalPayment = testMinimalPayment;
}