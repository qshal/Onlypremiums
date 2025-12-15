import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  applicableProducts: string[];
  maxUses?: number;
  currentUses: number;
  validFrom: Date;
  validUntil?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CouponContextType {
  availableCoupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  removeCoupon: () => void;
  calculateDiscount: (total: number) => number;
  refreshCoupons: () => Promise<void>;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: ReactNode }) {
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Load active coupons from database
  const refreshCoupons = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('coupons')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error loading coupons:', error);
        return;
      }

      if (data) {
        const mappedCoupons: Coupon[] = data.map((coupon: any) => ({
          id: coupon.id,
          code: coupon.code,
          discountPercentage: coupon.discount_percentage,
          applicableProducts: coupon.applicable_products || [],
          maxUses: coupon.max_uses,
          currentUses: coupon.current_uses || 0,
          validFrom: new Date(coupon.valid_from),
          validUntil: coupon.valid_until ? new Date(coupon.valid_until) : undefined,
          active: coupon.active,
          createdAt: new Date(coupon.created_at),
          updatedAt: new Date(coupon.updated_at),
        }));

        // Filter valid coupons
        const now = new Date();
        const validCoupons = mappedCoupons.filter(coupon => {
          // Check if coupon is within valid date range
          const isAfterValidFrom = now >= coupon.validFrom;
          const isBeforeValidUntil = !coupon.validUntil || now <= coupon.validUntil;
          const hasUsesLeft = !coupon.maxUses || coupon.currentUses < coupon.maxUses;
          
          return isAfterValidFrom && isBeforeValidUntil && hasUsesLeft;
        });

        setAvailableCoupons(validCoupons);
        logger.log(`Loaded ${validCoupons.length} valid coupons`);
      }
    } catch (error) {
      logger.error('Error loading coupons:', error);
    }
  }, []);

  // Load coupons on mount
  useEffect(() => {
    refreshCoupons();
  }, [refreshCoupons]);

  // Apply coupon by code
  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; message: string; discount?: number }> => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    const now = new Date();
    
    // Check if coupon is still valid
    if (now < coupon.validFrom) {
      return { success: false, message: 'Coupon is not yet active' };
    }
    
    if (coupon.validUntil && now > coupon.validUntil) {
      return { success: false, message: 'Coupon has expired' };
    }
    
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { success: false, message: 'Coupon usage limit reached' };
    }

    setAppliedCoupon(coupon);
    return { 
      success: true, 
      message: `Coupon applied! ${coupon.discountPercentage}% discount`,
      discount: coupon.discountPercentage
    };
  }, [availableCoupons]);

  // Remove applied coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Calculate discount amount
  const calculateDiscount = useCallback((total: number): number => {
    if (!appliedCoupon) return 0;
    return Math.round((total * appliedCoupon.discountPercentage) / 100);
  }, [appliedCoupon]);

  return (
    <CouponContext.Provider
      value={{
        availableCoupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        calculateDiscount,
        refreshCoupons,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupons() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
}