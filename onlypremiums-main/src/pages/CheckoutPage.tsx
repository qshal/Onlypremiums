import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle2, Smartphone, Tag, X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useCoupons } from '@/contexts/CouponContext';
import { supabase } from '@/lib/supabase';
import { processPayment, formatCurrency, calculateTotal, calculateSavings } from '@/lib/payments';
import { PaymentGateway } from '@/types';

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { availableCoupons, appliedCoupon, applyCoupon, removeCoupon, calculateDiscount } = useCoupons();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('razorpay');
  const [customerPhone, setCustomerPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!user) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/plans" replace />;
  }

  const subtotal = calculateTotal(items);
  const savings = calculateSavings(items);
  const couponDiscount = calculateDiscount(subtotal);
  const total = subtotal - couponDiscount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponMessage('');
    
    try {
      const result = await applyCoupon(couponCode.trim());
      setCouponMessage(result.message);
      
      if (result.success) {
        setCouponCode('');
      }
    } catch (error) {
      setCouponMessage('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage('');
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Step 1: Create order in database
      const order = await createOrder(user.id, items, total);
      
      // Step 2: Process payment
      const paymentResult = await processPayment(selectedGateway, {
        amount: total,
        currency: 'INR',
        orderId: order.id,
        customerEmail: user.email,
        customerName: user.name,
        customerPhone: customerPhone,
        items: items,
      });

      if (paymentResult.success) {
        // Step 3: Update coupon usage if coupon was applied
        if (appliedCoupon) {
          try {
            await (supabase as any)
              .from('coupons')
              .update({ 
                current_uses: appliedCoupon.currentUses + 1 
              })
              .eq('id', appliedCoupon.id);
          } catch (error) {
            console.warn('Failed to update coupon usage:', error);
          }
        }

        // Step 4: Payment successful - redirect to success page
        await clearCart();
        removeCoupon(); // Clear applied coupon
        navigate('/order-success', { 
          state: { 
            orderSuccess: true, 
            orderId: order.id,
            paymentId: paymentResult.paymentId,
            totalAmount: total,
            itemsCount: items.length
          } 
        });
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(`Checkout failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentGateways = [
    {
      id: 'razorpay' as PaymentGateway,
      name: 'Razorpay',
      description: 'UPI, Cards, Net Banking, Wallets',
      icon: <Smartphone className="h-5 w-5" />,
      recommended: true,
    },
  ];

  return (
    <div className="container py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="glass-neuro rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <button 
              className="glass rounded-2xl p-3 text-white hover:bg-white/20 transition-all"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="glass-neuro rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.plan.id} className="flex justify-between items-start py-4 border-b border-white/20">
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.plan.name || `${item.plan.productId} ${item.plan.duration}`}</p>
                    <p className="text-sm text-white/60 capitalize">
                      {item.plan.duration} subscription × {item.quantity}
                    </p>
                    <p className="text-xs text-green-400 mt-1">
                      Activation: {item.plan.activationMethod?.replace('_', ' ') || 'license key'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">{formatCurrency(item.plan.price * item.quantity)}</p>
                    {item.plan.originalPrice > item.plan.price && (
                      <p className="text-xs text-white/50 line-through">
                        {formatCurrency(item.plan.originalPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {savings > 0 && (
                <div className="flex justify-between items-center py-3 text-green-400">
                  <span className="font-medium">You Save</span>
                  <span className="font-bold">-{formatCurrency(savings)}</span>
                </div>
              )}

              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-white">Subtotal</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center py-2 text-green-400">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">Coupon ({appliedCoupon.code})</span>
                    </div>
                    <span className="font-bold">-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 text-xl font-bold border-t border-white/20 text-white">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="glass-neuro rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Customer Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="input-glass"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    value={user.name} 
                    disabled 
                    className="input-glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white font-medium">Phone Number (Optional)</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+91 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="input-glass"
                  />
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="glass-neuro rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Gift className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Discount Code</h2>
              </div>
              
              {!appliedCoupon ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="input-glass flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <Button 
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || isApplyingCoupon}
                      className="btn-glass px-6"
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                  
                  {couponMessage && (
                    <p className={`text-sm ${couponMessage.includes('applied') ? 'text-green-400' : 'text-red-400'}`}>
                      {couponMessage}
                    </p>
                  )}

                  {availableCoupons.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-white/60 mb-3">Available coupons:</p>
                      <div className="flex flex-wrap gap-2">
                        {availableCoupons.slice(0, 3).map((coupon) => (
                          <button
                            key={coupon.id}
                            onClick={() => setCouponCode(coupon.code)}
                            className="glass rounded-lg px-3 py-2 text-sm text-white hover:bg-white/20 transition-all border-white/30"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="h-3 w-3" />
                              <span className="font-mono">{coupon.code}</span>
                              <Badge variant="secondary" className="text-xs">
                                {coupon.discountPercentage}% OFF
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card-glass rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Coupon Applied</p>
                      <p className="text-sm text-white/60">
                        {appliedCoupon.code} - {appliedCoupon.discountPercentage}% discount
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleRemoveCoupon}
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="glass-neuro rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
              <RadioGroup value={selectedGateway} onValueChange={(value) => setSelectedGateway(value as PaymentGateway)}>
                {paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="card-glass rounded-2xl p-4 hover:bg-white/15 transition-all">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={gateway.id} id={gateway.id} className="border-white/30 text-white" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-white">{gateway.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={gateway.id} className="font-medium cursor-pointer text-white">
                              {gateway.name}
                            </Label>
                            {gateway.recommended && (
                              <span className="text-xs bg-green-500/80 text-white px-2 py-1 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/60">{gateway.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Security Notice */}
            <div className="card-glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl glass-neuro flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-white">Secure & Instant Payment</p>
                <p className="text-white/60 text-sm">Your payment is encrypted, secure, and processed instantly</p>
              </div>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout} 
              disabled={isProcessing}
              className="w-full btn-glass rounded-2xl py-4 text-white font-semibold text-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                'Processing Payment...'
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Pay {formatCurrency(total)} Securely
                </>
              )}
            </button>

            <p className="text-xs text-white/60 text-center">
              By completing your order, you agree to our{' '}
              <a href="/terms" className="underline text-white/80 hover:text-white">Terms of Service</a> and{' '}
              <a href="/privacy" className="underline text-white/80 hover:text-white">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}