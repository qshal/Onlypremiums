import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, Mail, ArrowRight, Package, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/payments';

export function OrderSuccessTestPage() {
  // Sample data for testing the success page
  const sampleData = {
    orderId: 'ORD-1734123456789',
    paymentId: 'pay_NXjsHfSzBvEOuM',
    totalAmount: 19900, // ₹199 in paise
    itemsCount: 2
  };

  const { orderId, paymentId, totalAmount, itemsCount } = sampleData;

  return (
    <div className="container py-12 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full glass-neuro flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-white">Payment Successful!</h1>
        <p className="text-white/70 mb-2">
          Thank you for your purchase. Your order has been processed instantly.
        </p>
        <p className="text-green-400 font-semibold mb-8">
          Amount Paid: {formatCurrency(totalAmount)}
        </p>

        <div className="glass-neuro rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <span className="text-sm text-white/60">Order ID:</span>
              <p className="font-mono font-semibold text-white">{orderId}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-white/60">Payment ID:</span>
              <p className="font-mono text-sm text-white/80">{paymentId}</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <div className="flex items-start gap-3 p-4 rounded-lg glass">
              <Zap className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-white">Instantly Processed</p>
                <p className="text-xs text-white/60">
                  Your order was completed immediately
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg glass">
              <CreditCard className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-white">Payment Captured</p>
                <p className="text-xs text-white/60">
                  Payment processed and captured successfully
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg glass">
              <Package className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-white">Ready for Delivery</p>
                <p className="text-xs text-white/60">
                  {itemsCount} item{itemsCount > 1 ? 's' : ''} ready in dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn-glass px-6 py-3 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all">
            <Link to="/dashboard" className="flex items-center">
              View Your Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </button>
          <button className="glass border-white/20 px-6 py-3 rounded-2xl text-white/80 hover:text-white font-medium hover:bg-white/10 transition-all">
            <Link to="/plans">Continue Shopping</Link>
          </button>
        </div>
        
        <div className="mt-8 p-4 glass rounded-2xl">
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Order confirmation sent to your email</span>
          </div>
        </div>

        {/* Test Info */}
        <div className="mt-8 p-4 glass rounded-2xl border border-yellow-400/30">
          <div className="text-yellow-400 text-sm">
            <p className="font-semibold mb-2">🧪 Test Page</p>
            <p>This is a test version of the success page with sample data.</p>
            <p>Real success page is accessed after completing a payment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}