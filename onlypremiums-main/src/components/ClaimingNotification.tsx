import { useState, useEffect } from 'react';
import { FileText, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { ClaimingInstructionsModal } from './ClaimingInstructionsModal';

export function ClaimingNotification() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);

  useEffect(() => {
    if (user) {
      const orders = getUserOrders(user.id);
      // Check if user has recent orders (within last 24 hours)
      const recentOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 24; // Show notification for orders within 24 hours
      });

      if (recentOrders.length > 0) {
        setRecentOrder(recentOrders[0]); // Get most recent order
        setShowNotification(true);
      }
    }
  }, [user, getUserOrders]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  if (!showNotification || !user) {
    return null;
  }

  return (
    <>
      {/* Pinned Notification */}
      <div className="fixed top-20 right-4 z-40 max-w-sm">
        <div className="glass-neuro rounded-2xl p-4 border border-green-500/30 shadow-lg animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white mb-1">
                  Claiming Instructions Ready
                </p>
                <p className="text-xs text-white/60 mb-2">
                  Learn how to activate your recent purchase
                </p>
                <button
                  onClick={handleOpenModal}
                  className="text-xs bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 px-3 py-1 rounded-lg font-medium transition-all"
                >
                  View Instructions
                </button>
              </div>
            </div>
            <button
              onClick={handleCloseNotification}
              className="glass rounded-lg p-1 text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Claiming Instructions Modal */}
      <ClaimingInstructionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recentOrder={recentOrder}
      />
    </>
  );
}