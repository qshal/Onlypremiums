import { useLocation, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Mail, ArrowRight, Package, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/payments';
import { ClaimingInstructionsModal } from '@/components/ClaimingInstructionsModal';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { useClaimingAccess } from '@/hooks/useClaimingAccess';

export function OrderSuccessPage() {
  const location = useLocation();
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const [showClaimingModal, setShowClaimingModal] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);
  
  // Use claiming access hook to check if instructions are available
  const { hasClaimingAccess, getMostRecentOrderWithClaiming, refetchInstructions } = useClaimingAccess();
  
  const state = location.state as { 
    orderId?: string; 
    paymentId?: string; 
    totalAmount?: number; 
    itemsCount?: number; 
  };
  
  const { orderId, paymentId, totalAmount, itemsCount } = state || {};

  // Auto-open claiming instructions modal after 2 seconds if instructions are available
  useEffect(() => {
    if (orderId && user) {
      const timer = setTimeout(() => {
        // Refetch instructions to get latest data
        refetchInstructions().then(() => {
          const order = getMostRecentOrderWithClaiming();
          if (order && hasClaimingAccess) {
            setRecentOrder(order);
            setShowClaimingModal(true);
          }
        });
      }, 2000); // 2 second delay for better UX

      return () => clearTimeout(timer);
    }
  }, [orderId, user, hasClaimingAccess, getMostRecentOrderWithClaiming, refetchInstructions]);

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

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
        {totalAmount && (
          <p className="text-green-400 font-semibold mb-8">
            Amount Paid: {formatCurrency(totalAmount)}
          </p>
        )}

        <div className="glass-neuro rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
              <span className="text-sm text-white/60">Order ID:</span>
              <p className="font-mono font-semibold text-white">{orderId}</p>
            </div>
            {paymentId && (
              <div className="text-center">
                <span className="text-sm text-white/60">Payment ID:</span>
                <p className="font-mono text-sm text-white/80">{paymentId}</p>
              </div>
            )}
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
                  {itemsCount ? `${itemsCount} item${itemsCount > 1 ? 's' : ''}` : 'Items'} ready in dashboard
                </p>
              </div>
            </div>
          </div>
          
          {/* Claiming Instructions Preview - Only show if user has access */}
          {hasClaimingAccess && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">Claiming Instructions Available</p>
                  <p className="text-xs text-green-300">Learn how to activate your subscription</p>
                </div>
              </div>
              <button
                onClick={() => setShowClaimingModal(true)}
                className="w-full mt-2 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-sm font-medium transition-all"
              >
                View Activation Instructions
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn-glass px-6 py-3 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all">
            <Link 
              to="/dashboard" 
              state={{ fromPayment: true, orderId: orderId }}
              className="flex items-center"
            >
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
      </div>

      {/* Claiming Instructions Modal */}
      <ClaimingInstructionsModal
        isOpen={showClaimingModal}
        onClose={() => setShowClaimingModal(false)}
        recentOrder={getMostRecentOrderWithClaiming()}
      />
    </div>
  );
}
