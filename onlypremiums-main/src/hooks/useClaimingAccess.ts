import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { supabase } from '@/lib/supabase';

interface ClaimingInstruction {
  id: string;
  planId: string;
  methodTitle: string;
  instructions: string;
  contactInfo?: string;
  estimatedTime?: string;
  linkUrl?: string;
}

interface UserPurchasedPlan {
  planId: string;
  planName: string;
  purchaseDate: Date;
  orderId: string;
}

export function useClaimingAccess() {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const [purchasedPlans, setPurchasedPlans] = useState<UserPurchasedPlan[]>([]);
  const [availableInstructions, setAvailableInstructions] = useState<ClaimingInstruction[]>([]);
  const [loading, setLoading] = useState(false);

  // Get all plans the user has purchased
  useEffect(() => {
    if (user) {
      const orders = getUserOrders(user.id);
      const purchased: UserPurchasedPlan[] = [];

      orders.forEach(order => {
        if (order.status === 'completed') {
          order.items.forEach(item => {
            purchased.push({
              planId: item.plan.id,
              planName: item.plan.name || `${item.plan.productId} ${item.plan.duration}`,
              purchaseDate: new Date(order.createdAt),
              orderId: order.id
            });
          });
        }
      });

      setPurchasedPlans(purchased);
    }
  }, [user, getUserOrders]);

  // Fetch claiming instructions for purchased plans only
  const fetchClaimingInstructions = async () => {
    if (purchasedPlans.length === 0) {
      setAvailableInstructions([]);
      return;
    }

    try {
      setLoading(true);
      
      const planIds = purchasedPlans.map(p => p.planId);
      
      const { data, error } = await supabase
        .from('claiming_instructions')
        .select('*')
        .in('plan_id', planIds);

      if (error) {
        console.error('Error fetching claiming instructions:', error);
        return;
      }

      if (data) {
        const mappedInstructions: ClaimingInstruction[] = data.map((item: any) => ({
          id: item.id,
          planId: item.plan_id,
          methodTitle: item.method_title,
          instructions: item.instructions,
          contactInfo: item.contact_info,
          estimatedTime: item.estimated_time,
          linkUrl: item.link_url,
        }));
        setAvailableInstructions(mappedInstructions);
      }
    } catch (error) {
      console.error('Error fetching claiming instructions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimingInstructions();
  }, [purchasedPlans]);

  // Check if user has access to claiming instructions
  const hasClaimingAccess = availableInstructions.length > 0;

  // Get most recent purchase with claiming instructions
  const getMostRecentOrderWithClaiming = () => {
    if (!hasClaimingAccess) return null;

    const ordersWithClaiming = purchasedPlans.filter(plan => 
      availableInstructions.some(instruction => instruction.planId === plan.planId)
    );

    if (ordersWithClaiming.length === 0) return null;

    // Sort by purchase date and get most recent
    const sortedOrders = ordersWithClaiming.sort((a, b) => 
      b.purchaseDate.getTime() - a.purchaseDate.getTime()
    );

    // Find the actual order object
    const orders = getUserOrders(user?.id || '');
    return orders.find(order => order.id === sortedOrders[0].orderId) || null;
  };

  return {
    purchasedPlans,
    availableInstructions,
    hasClaimingAccess,
    loading,
    getMostRecentOrderWithClaiming,
    refetchInstructions: fetchClaimingInstructions
  };
}