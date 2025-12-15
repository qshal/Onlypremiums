import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { CartItem, CartContextType, Plan } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from database when user logs in
  const loadCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      logger.log('Loading cart for user:', user.email);

      // Get cart items with plan details
      const { data: cartData, error } = await (supabase as any)
        .from('cart_items')
        .select(`
          id,
          quantity,
          plans!inner (
            id,
            product_id,
            name,
            description,
            duration,
            price,
            original_price,
            discount_percentage,
            features,
            activation_method,
            instructions_text,
            popular,
            active
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        logger.error('Error loading cart:', error);
        return;
      }

      if (cartData) {
        const cartItems: CartItem[] = cartData.map((item: any) => ({
          plan: {
            id: item.plans.id,
            productId: item.plans.product_id,
            name: item.plans.name,
            description: item.plans.description,
            duration: item.plans.duration,
            price: item.plans.price,
            originalPrice: item.plans.original_price,
            discountPercentage: item.plans.discount_percentage || 0,
            features: item.plans.features || [],
            activationMethod: item.plans.activation_method,
            instructionsText: item.plans.instructions_text,
            popular: item.plans.popular || false,
            active: item.plans.active || true,
            createdAt: new Date(),
          },
          quantity: item.quantity,
        }));
        
        setItems(cartItems);
        logger.log(`Loaded ${cartItems.length} cart items`);
      }
    } catch (error) {
      logger.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load cart when user changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(async (plan: Plan) => {
    if (!user) {
      logger.error('Cannot add item to cart: user not logged in');
      return;
    }

    try {
      const existing = items.find((item) => item.plan.id === plan.id);
      
      if (existing) {
        // Update existing item quantity
        const newQuantity = existing.quantity + 1;
        const { error } = await (supabase as any)
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('user_id', user.id)
          .eq('plan_id', plan.id);

        if (error) throw error;

        setItems((prev) =>
          prev.map((item) =>
            item.plan.id === plan.id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        // Add new item
        const cartItemId = `cart-${user.id}-${plan.id}-${Date.now()}`;
        const { error } = await (supabase as any)
          .from('cart_items')
          .insert({
            id: cartItemId,
            user_id: user.id,
            plan_id: plan.id,
            quantity: 1,
          });

        if (error) throw error;

        setItems((prev) => [...prev, { plan, quantity: 1 }]);
      }
      
      logger.log('Added item to cart:', plan.name);
    } catch (error) {
      logger.error('Error adding item to cart:', error);
    }
  }, [user, items]);

  const removeItem = useCallback(async (planId: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('plan_id', planId);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.plan.id !== planId));
      logger.log('Removed item from cart:', planId);
    } catch (error) {
      logger.error('Error removing item from cart:', error);
    }
  }, [user]);

  const updateQuantity = useCallback(async (planId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeItem(planId);
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('plan_id', planId);

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) =>
          item.plan.id === planId ? { ...item, quantity } : item
        )
      );
      logger.log('Updated cart item quantity:', planId, quantity);
    } catch (error) {
      logger.error('Error updating cart item quantity:', error);
    }
  }, [user, removeItem]);

  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
      logger.log('Cleared cart for user:', user.email);
    } catch (error) {
      logger.error('Error clearing cart:', error);
    }
  }, [user]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.plan.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        total, 
        itemCount,
        isLoading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
