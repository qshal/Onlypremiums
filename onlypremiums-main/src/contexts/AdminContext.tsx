import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

// Types for admin features
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



interface AdminContextType {
  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'currentUses' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  toggleCouponActive: (id: string) => Promise<void>;
  
  // Refresh functions
  refreshCoupons: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Load coupons from database
  const refreshCoupons = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('coupons')
        .select('*')
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
        setCoupons(mappedCoupons);
        logger.log(`Loaded ${mappedCoupons.length} coupons`);
      }
    } catch (error) {
      logger.error('Error loading coupons:', error);
    }
  }, []);



  // Load data on mount
  useEffect(() => {
    refreshCoupons();
  }, [refreshCoupons]);

  // Coupon operations
  const addCoupon = useCallback(async (coupon: Omit<Coupon, 'id' | 'currentUses' | 'createdAt' | 'updatedAt'>) => {
    const id = `coupon-${Date.now()}`;
    
    const { error } = await (supabase as any).from('coupons').insert({
      id,
      code: coupon.code,
      discount_percentage: coupon.discountPercentage,
      applicable_products: coupon.applicableProducts,
      max_uses: coupon.maxUses,
      current_uses: 0,
      valid_from: coupon.validFrom.toISOString(),
      valid_until: coupon.validUntil?.toISOString(),
      active: coupon.active,
    });

    if (error) throw error;
    await refreshCoupons();
  }, [refreshCoupons]);

  const updateCoupon = useCallback(async (id: string, updates: Partial<Coupon>) => {
    const updateData: any = {};
    if (updates.code) updateData.code = updates.code;
    if (updates.discountPercentage !== undefined) updateData.discount_percentage = updates.discountPercentage;
    if (updates.applicableProducts) updateData.applicable_products = updates.applicableProducts;
    if (updates.maxUses !== undefined) updateData.max_uses = updates.maxUses;
    if (updates.validFrom) updateData.valid_from = updates.validFrom.toISOString();
    if (updates.validUntil) updateData.valid_until = updates.validUntil.toISOString();
    if (updates.active !== undefined) updateData.active = updates.active;

    const { error } = await (supabase as any)
      .from('coupons')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    await refreshCoupons();
  }, [refreshCoupons]);

  const deleteCoupon = useCallback(async (id: string) => {
    const { error } = await (supabase as any)
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await refreshCoupons();
  }, [refreshCoupons]);

  const toggleCouponActive = useCallback(async (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;

    const { error } = await (supabase as any)
      .from('coupons')
      .update({ active: !coupon.active })
      .eq('id', id);

    if (error) throw error;
    await refreshCoupons();
  }, [coupons, refreshCoupons]);



  return (
    <AdminContext.Provider
      value={{
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,
        refreshCoupons,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}