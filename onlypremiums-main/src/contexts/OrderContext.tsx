import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Order, CartItem, OrderStatus } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { logger } from '@/lib/logger';

interface OrderContextType {
  orders: Order[];
  createOrder: (userId: string, items: CartItem[], total: number) => Promise<Order>;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];

  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Generate a random license key
const generateLicenseKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  const key = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    key.push(segment);
  }
  return key.join('-');
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  // Load orders from Supabase
  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      let query = supabase.from('orders').select('*');
      
      // If user is not admin, only get their orders
      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id);
      }

      logger.log(`Fetching orders for user: ${user.email}, role: ${user.role}`);
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        logger.error('Error loading orders:', error);
        logger.error('Error details:', error);
        return;
      }

      logger.log('Order data loaded:', data?.length || 0, 'orders');

      if (data) {
        const mappedOrders: Order[] = data.map((order: any) => ({
          id: order.id,
          userId: order.user_id,
          items: order.items as CartItem[],
          totalAmount: order.total_amount,
          status: order.status as OrderStatus,
          createdAt: new Date(order.created_at),
          updatedAt: new Date(order.updated_at),
        }));
        setOrders(mappedOrders);
        logger.log(`Successfully loaded ${mappedOrders.length} orders`);
      } else {
        logger.log('No order data returned from Supabase');
        setOrders([]);
      }
    } catch (error) {
      logger.error('Error loading orders:', error);
    }
  }, [user]);

  // Load orders when user changes
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    
    refreshOrders();
  }, [user, refreshOrders]);

  const createOrder = useCallback(async (userId: string, items: CartItem[], total: number): Promise<Order> => {
    const orderId = `ORD-${Date.now()}`;
    const licenseKey = generateLicenseKey();
    
    const { data, error } = await (supabase as any)
      .from('orders')
      .insert({
        id: orderId,
        user_id: userId,
        items: items as any,
        total_amount: total,
        status: 'completed',
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from order creation');

    const newOrder: Order = {
      id: (data as any).id,
      userId: (data as any).user_id,
      items: (data as any).items as CartItem[],
      totalAmount: (data as any).total_amount,
      status: (data as any).status as OrderStatus,
      createdAt: new Date((data as any).created_at),
      updatedAt: new Date((data as any).updated_at),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const getUserOrders = useCallback(
    (userId: string) => orders.filter((order) => order.userId === userId),
    [orders]
  );

  const getAllOrders = useCallback(() => orders, [orders]);



  return (
    <OrderContext.Provider
      value={{ orders, createOrder, getUserOrders, getAllOrders, refreshOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}