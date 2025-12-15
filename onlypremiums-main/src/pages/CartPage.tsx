import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { ProductIcon } from '@/components/ProductIcon';

export function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getProductInfo } = useProducts();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-12 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <div className="glass-neuro rounded-3xl p-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl glass-neuro flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-white/60" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h1>
            <p className="text-white/70 mb-6">
              Looks like you haven't added any plans to your cart yet.
            </p>
            <Link to="/plans">
              <div className="btn-glass px-6 py-3 rounded-2xl text-white font-semibold inline-flex items-center hover:bg-white/20 transition-all">
                Browse Plans
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 min-h-screen">
      <div className="glass-neuro rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const info = getProductInfo(item.plan.productId);
            return (
              <div key={item.plan.id} className="card-glass rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center shrink-0 overflow-hidden`}>
                    {info.icon && (info.icon.startsWith('data:image/') || info.icon.startsWith('http') || info.icon.startsWith('/')) ? (
                      <img 
                        src={info.icon} 
                        alt={info.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl">{info.icon || '🤖'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">
                          {(item.plan.name && item.plan.name.length < 50) ? item.plan.name : `${info.name} Pro ${item.plan.duration.charAt(0).toUpperCase() + item.plan.duration.slice(1)}`}
                        </h3>
                        <p className="text-sm text-white/60 capitalize">
                          {item.plan.duration} Plan
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">₹{((item.plan.price * item.quantity) / 100).toFixed(2)}</p>
                        <p className="text-sm text-white/60">
                          ₹{(item.plan.price / 100).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="glass rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all border-white/20"
                          onClick={() => updateQuantity(item.plan.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                        <button
                          className="glass rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all border-white/20"
                          onClick={() => updateQuantity(item.plan.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        className="glass rounded-xl px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 transition-all border-red-400/30 text-sm flex items-center gap-1"
                        onClick={() => removeItem(item.plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-4">
            <Link to="/plans">
              <div className="glass rounded-2xl px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all border-white/30">
                Continue Shopping
              </div>
            </Link>
            <button 
              onClick={() => clearCart()}
              className="glass rounded-2xl px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all border-white/30"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-neuro rounded-2xl p-8 sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.plan.id} className="flex justify-between text-sm">
                  <span className="text-white/60">
                    {(item.plan.name && item.plan.name.length < 50) ? item.plan.name : `${item.plan.productId} Pro`} ({item.plan.duration}) × {item.quantity}
                  </span>
                  <span className="text-white">₹{((item.plan.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-white">₹{(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full btn-glass rounded-2xl py-4 text-white font-semibold text-lg hover:bg-white/20 transition-all mt-6 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
