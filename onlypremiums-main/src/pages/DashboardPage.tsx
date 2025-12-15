import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Package, CheckCircle2, Key, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useProducts } from '@/contexts/ProductContext';
import { ProductIcon } from '@/components/ProductIcon';
import { ClaimingInstructionsModal } from '@/components/ClaimingInstructionsModal';
import { Order, ProductInfo } from '@/types';

const statusConfig = {
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    variant: 'default' as const,
    color: 'text-green-600',
  },
};

function OrderCard({ order, getProductInfo }: { order: Order; getProductInfo: (product: string) => ProductInfo }) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="card-apple p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-sm text-gray-600">{order.id}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="bg-green-100 border border-green-200 rounded-full px-3 py-1 flex items-center gap-1 text-green-700">
          <StatusIcon className="h-3 w-3" />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {order.items.map((item) => {
          const info = getProductInfo(item.plan.productId);
          return (
            <div key={item.plan.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                <ProductIcon productId={item.plan.productId} productName={info.name} size="sm" fallbackEmoji={info.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-black">{item.plan.name || `${item.plan.productId} ${item.plan.duration}`}</p>
                <p className="text-xs text-gray-600 capitalize">
                  {item.plan.duration} × {item.quantity}
                </p>
              </div>
              <p className="font-medium text-sm text-black">
                ₹{((item.plan.price * item.quantity) / 100).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="font-semibold text-black">Total: ₹{(order.totalAmount / 100).toFixed(2)}</span>
        <div className="flex items-center gap-2 text-sm">
          <Key className="h-4 w-4 text-purple-600" />
          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">LIC-{order.id.slice(-8)}</code>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const { getProductInfo } = useProducts();
  const location = useLocation();
  
  const [showClaimingModal, setShowClaimingModal] = useState(false);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  if (!user) {
    return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;
  }

  const orders = getUserOrders(user.id);

  // Check if user came from successful payment (no auto-popup, just clear state)
  useEffect(() => {
    const state = location.state as { fromPayment?: boolean; orderId?: string };
    
    if (state?.fromPayment && state?.orderId) {
      // Clear the state to prevent showing modal on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      {/* Gradient Hero Section */}
      <section className="bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">Dashboard</h1>
              <p className="text-xl md:text-2xl text-white/90 font-light">Welcome back, {user.name}</p>
            </div>
            <Link to="/plans" className="btn-apple-primary px-6 py-3 inline-flex items-center">
              Browse Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-apple p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{orders.length}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="card-apple p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{orders.length}</p>
                  <p className="text-sm text-gray-600">Completed Orders</p>
                </div>
              </div>
            </div>
            <div className="card-apple p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <Key className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">{orders.length}</p>
                  <p className="text-sm text-gray-600">Active Licenses</p>
                </div>
              </div>
            </div>
            <div className="card-apple p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">
                    ₹{(orders.reduce((sum, o) => sum + o.totalAmount, 0) / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders */}
      <section className="section-apple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-apple p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Your Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold mb-2 text-black">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by browsing our available plans
                </p>
                <Link to="/plans" className="btn-apple-primary">
                  Browse Plans
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} getProductInfo={getProductInfo} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Active Subscriptions */}
      {orders.length > 0 && (
        <section className="section-apple bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-apple p-8">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Active Subscriptions
              </h2>
              <div className="space-y-4">
                {orders.flatMap((order) =>
                  order.items.map((item) => {
                    const info = getProductInfo(item.plan.productId);
                    const expiryDate = new Date(order.createdAt);
                    expiryDate.setMonth(
                      expiryDate.getMonth() + (item.plan.duration === 'yearly' ? 12 : 1)
                    );

                    return (
                      <div
                        key={`${order.id}-${item.plan.id}`}
                        className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
                            <ProductIcon productId={item.plan.productId} productName={info.name} size="md" fallbackEmoji={info.icon} />
                          </div>
                          <div>
                            <p className="font-medium text-black">{item.plan.name || `${item.plan.productId} ${item.plan.duration}`}</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {item.plan.duration} Plan
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-black">
                            Expires: {expiryDate.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            License: <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">LIC-{order.id.slice(-8)}</code>
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Claiming Instructions Modal */}
      <ClaimingInstructionsModal
        isOpen={showClaimingModal}
        onClose={() => setShowClaimingModal(false)}
        recentOrder={recentOrder}
      />
    </div>
  );
}
