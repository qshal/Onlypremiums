import { Tag, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCoupons } from '@/contexts/CouponContext';

export function AvailableCoupons() {
  const { availableCoupons } = useCoupons();

  if (availableCoupons.length === 0) {
    return null;
  }

  return (
    <div className="glass-neuro rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl glass-neuro flex items-center justify-center">
          <Gift className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Available Discounts</h3>
          <p className="text-sm text-white/60">Save more with these active coupon codes</p>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableCoupons.slice(0, 6).map((coupon) => (
          <div
            key={coupon.id}
            className="card-glass rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group"
            onClick={() => navigator.clipboard.writeText(coupon.code)}
            title="Click to copy code"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-yellow-400" />
                <code className="font-mono text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {coupon.code}
                </code>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                {coupon.discountPercentage}% OFF
              </Badge>
            </div>
            
            <p className="text-xs text-white/60">
              {coupon.applicableProducts.length === 0 
                ? 'Valid on all products' 
                : `Valid on ${coupon.applicableProducts.length} product(s)`}
            </p>
            
            {coupon.validUntil && (
              <p className="text-xs text-white/50 mt-1">
                Expires: {coupon.validUntil.toLocaleDateString()}
              </p>
            )}
            
            {coupon.maxUses && (
              <p className="text-xs text-white/50">
                {coupon.maxUses - coupon.currentUses} uses left
              </p>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-white/50 text-center mt-4">
        💡 Tip: Click any coupon code to copy it, then apply at checkout
      </p>
    </div>
  );
}