import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Plan, ProductInfo, ActivationMethod } from '@/types';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface ProductContextType {
  plans: Plan[];
  products: Record<string, ProductInfo>;
  addPlan: (plan: Omit<Plan, 'id'>) => Promise<void>;
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  togglePlanActive: (id: string) => Promise<void>;
  addProduct: (key: string, info: ProductInfo) => Promise<void>;
  updateProduct: (key: string, info: Partial<ProductInfo>) => Promise<void>;
  deleteProduct: (key: string) => Promise<void>;
  getProductInfo: (product: string) => ProductInfo;
  refreshPlans: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);



export function ProductProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Record<string, ProductInfo>>({});

  // Load plans from Supabase
  const refreshPlans = useCallback(async () => {
    try {
      logger.log('Loading plans from database...');
      const { data, error } = await (supabase as any)
        .from('plans')
        .select('id, name, description, product_id, duration, price, original_price, discount_percentage, features, activation_method, image_url, popular, active, created_at')
        .order('product_id', { ascending: true });

      if (error) {
        logger.error('Database error loading plans:', error);
        throw error;
      }

      if (data) {
        logger.log(`Found ${data.length} plans in database`);
        const mappedPlans: Plan[] = data.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          productId: plan.product_id,
          duration: plan.duration as 'monthly' | 'yearly' | 'lifetime',
          price: plan.price,
          originalPrice: plan.original_price,
          discountPercentage: plan.discount_percentage || Math.round(((plan.original_price - plan.price) / plan.original_price) * 100),
          features: plan.features as string[],
          activationMethod: plan.activation_method as ActivationMethod,
          imageUrl: plan.image_url || undefined,
          popular: plan.popular || false,
          active: plan.active !== false,
          createdAt: new Date(plan.created_at),
        }));
        setPlans(mappedPlans);
        logger.log(`Successfully loaded ${mappedPlans.length} plans`);
      } else {
        logger.log('No plans data returned from database');
        setPlans([]);
      }
    } catch (error) {
      logger.error('Error loading plans:', error);
    }
  }, []);

  // Load plans on mount - database required
  useEffect(() => {
    refreshPlans();
  }, [refreshPlans]);

  const refreshProducts = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any).from('products').select('*').order('name', { ascending: true });

      if (error) {
        logger.error('Error loading products:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        logger.log('No products found in database');
        setProducts({});
        return;
      }

      const mappedProducts: Record<string, ProductInfo> = {};
      data.forEach((product: any) => {
        mappedProducts[product.id] = {
          name: product.name,
          color: product.color,
          textColor: product.text_color,
          bgLight: product.bg_light,
          icon: product.icon,
          category: product.category || 'productivity',
        };
      });
      setProducts(mappedProducts);
      logger.log(`Loaded ${data.length} products from database`);
    } catch (error) {
      logger.error('Failed to load products:', error);
      setProducts({});
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const addPlan = useCallback(async (plan: Omit<Plan, 'id'>) => {
    const id = `${plan.productId}-${plan.duration}-${Date.now()}`;
    
    const { error } = await (supabase as any).from('plans').insert({
      id,
      name: plan.name,
      description: plan.description,
      product_id: plan.productId,
      duration: plan.duration,
      price: plan.price,
      original_price: plan.originalPrice,
      discount_percentage: plan.discountPercentage || Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100),
      features: plan.features as any,
      activation_method: plan.activationMethod || 'coupon_code',
      image_url: plan.imageUrl || null,
      popular: plan.popular || false,
      active: plan.active !== false,
    });

    if (error) throw error;
    await refreshPlans();
  }, [refreshPlans]);

  const updatePlan = useCallback(async (id: string, updates: Partial<Plan>) => {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.productId) updateData.product_id = updates.productId;
    if (updates.duration) updateData.duration = updates.duration;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice;
    if (updates.discountPercentage !== undefined) updateData.discount_percentage = updates.discountPercentage;
    if (updates.features) updateData.features = updates.features;
    if (updates.activationMethod) updateData.activation_method = updates.activationMethod;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl || null;
    if (updates.popular !== undefined) updateData.popular = updates.popular;
    if (updates.active !== undefined) updateData.active = updates.active;

    const { error } = await (supabase as any)
      .from('plans')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    await refreshPlans();
  }, [refreshPlans]);

  const deletePlan = useCallback(async (id: string) => {
    const { error } = await (supabase as any)
      .from('plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await refreshPlans();
  }, [refreshPlans]);

  const togglePlanActive = useCallback(async (id: string) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;

    const { error } = await (supabase as any)
      .from('plans')
      .update({ active: !plan.active })
      .eq('id', id);

    if (error) throw error;
    await refreshPlans();
  }, [plans, refreshPlans]);

  const addProduct = useCallback(async (key: string, info: ProductInfo) => {
    const { error } = await (supabase as any).from('products').insert({
      id: key,
      name: info.name,
      description: `Premium ${info.name} subscription`,
      color: info.color,
      text_color: info.textColor,
      bg_light: info.bgLight,
      icon: info.icon,
      category: info.category || 'productivity',
      featured: false,
      active: true,
    });

    if (error) throw error;
    await refreshProducts();
  }, [refreshProducts]);

  const updateProduct = useCallback(async (key: string, info: Partial<ProductInfo>) => {
    const updateData: any = {};
    if (info.name) updateData.name = info.name;
    if (info.color) updateData.color = info.color;
    if (info.textColor) updateData.text_color = info.textColor;
    if (info.bgLight) updateData.bg_light = info.bgLight;
    if (info.icon) updateData.icon = info.icon;
    if (info.category) updateData.category = info.category;

    const { error } = await (supabase as any).from('products').update(updateData).eq('id', key);
    if (error) throw error;
    await refreshProducts();
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (key: string) => {
    const { error } = await (supabase as any).from('products').delete().eq('id', key);
    if (error) throw error;
    await refreshProducts();
  }, [refreshProducts]);

  const getProductInfo = useCallback(
    (product: string): ProductInfo => {
      return (
        products[product] || {
          name: product,
          color: 'bg-gradient-to-br from-gray-500 to-gray-600',
          textColor: 'text-gray-600',
          bgLight: 'bg-gray-50',
          icon: '📦',
          category: 'productivity',
        }
      );
    },
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        plans,
        products,
        addPlan,
        updatePlan,
        deletePlan,
        togglePlanActive,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductInfo,
        refreshPlans,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}