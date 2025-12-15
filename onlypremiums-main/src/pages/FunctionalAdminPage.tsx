import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Package, CheckCircle2, DollarSign, Plus, Pencil, Trash2, 
  Zap, Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useProducts } from '@/contexts/ProductContext';
import { useAdmin } from '@/contexts/AdminContext';

import { Plan, ProductInfo } from '@/types';
import { CATEGORY_OPTIONS, getCategoryInfo } from '@/constants/categories';

export function FunctionalAdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getAllOrders } = useOrders();
  const { 
    plans, 
    products, 
    addPlan, 
    updatePlan, 
    deletePlan, 
    togglePlanActive, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getProductInfo 
  } = useProducts();
  const {
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponActive,
  } = useAdmin();


  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Product dialog state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductInfo & { key: string }>({
    key: '',
    name: '',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    icon: '📦',
    category: 'productivity',
  });

  // Plan dialog state
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<Omit<Plan, 'id'>>({
    name: '',
    description: '',
    productId: '',
    duration: 'monthly',
    price: 0,
    originalPrice: 0,
    discountPercentage: 0,
    features: [],
    activationMethod: 'coupon_code',
    imageUrl: '',
    popular: false,
    active: true,
    createdAt: new Date(),
  });
  const [featuresInput, setFeaturesInput] = useState('');

  // Coupon dialog state
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercentage: 10,
    applicableProducts: [] as string[],
    maxUses: 100,
    validUntil: '',
    active: true,
  });

  // Claiming instructions state
  const [claimingInstructions, setClaimingInstructions] = useState<any[]>([]);
  const [claimingDialogOpen, setClaimingDialogOpen] = useState(false);
  const [editingClaiming, setEditingClaiming] = useState<any | null>(null);
  const [claimingForm, setClaimingForm] = useState({
    planId: '',
    methodTitle: '',
    instructions: '',
    contactInfo: '',
    estimatedTime: '',
    linkUrl: ''
  });
  const [loadingClaiming, setLoadingClaiming] = useState(false);





  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const orders = getAllOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const todayOrders = orders.filter(o => 
    new Date(o.createdAt).toDateString() === new Date().toDateString()
  );
  const pendingOrders = orders.filter(o => o.status === 'pending');

  // Load claiming instructions from database
  useEffect(() => {
    fetchClaimingInstructions();
  }, []);

  const fetchClaimingInstructions = async () => {
    try {
      setLoadingClaiming(true);
      const { data, error } = await (supabase as any)
        .from('claiming_instructions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching claiming instructions:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to load claiming instructions',
          variant: 'destructive' 
        });
        return;
      }

      if (data) {
        const mappedInstructions = data.map((item: any) => ({
          id: item.id,
          planId: item.plan_id,
          methodTitle: item.method_title,
          instructions: item.instructions,
          contactInfo: item.contact_info,
          estimatedTime: item.estimated_time,
          linkUrl: item.link_url,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        setClaimingInstructions(mappedInstructions);
      }
    } catch (error) {
      console.error('Error fetching claiming instructions:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load claiming instructions',
        variant: 'destructive' 
      });
    } finally {
      setLoadingClaiming(false);
    }
  };

  // Product handlers
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      key: '',
      name: '',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      icon: '📦',
      category: 'productivity',
    });
    setProductDialogOpen(true);
  };

  const openEditProduct = (key: string) => {
    const product = products[key];
    setEditingProduct(key);
    setProductForm({ key, ...product });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct, {
          name: productForm.name,
          color: productForm.color,
          textColor: productForm.textColor,
          bgLight: productForm.bgLight,
          icon: productForm.icon,
          category: productForm.category,
        });
        toast({ title: 'Success', description: 'Product updated successfully!' });
      } else {
        await addProduct(productForm.key, {
          name: productForm.name,
          color: productForm.color,
          textColor: productForm.textColor,
          bgLight: productForm.bgLight,
          icon: productForm.icon,
          category: productForm.category,
        });
        toast({ title: 'Success', description: 'Product added successfully!' });
      }
      setProductDialogOpen(false);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save product. Please try again.',
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteProduct = async (key: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(key);
        toast({ title: 'Success', description: 'Product deleted successfully!' });
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: 'Failed to delete product.',
          variant: 'destructive' 
        });
      }
    }
  };

  // Plan handlers
  const openAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      description: '',
      productId: Object.keys(products)[0] || '',
      duration: 'monthly',
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      features: [],
      activationMethod: 'coupon_code',
      imageUrl: '',
      popular: false,
      active: true,
      createdAt: new Date(),
    });
    setFeaturesInput('');
    setPlanDialogOpen(true);
  };

  const openEditPlan = (plan: Plan) => {
    setEditingPlan(plan.id);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      productId: plan.productId,
      duration: plan.duration,
      price: plan.price,
      originalPrice: plan.originalPrice,
      discountPercentage: plan.discountPercentage,
      features: plan.features,
      activationMethod: plan.activationMethod,
      imageUrl: plan.imageUrl || '',
      popular: plan.popular || false,
      active: plan.active !== false,
      createdAt: plan.createdAt,
    });
    setFeaturesInput(plan.features.join('\n'));
    setPlanDialogOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      // Validation
      if (!planForm.name.trim()) {
        toast({ title: 'Error', description: 'Plan name is required', variant: 'destructive' });
        return;
      }
      if (!planForm.description.trim()) {
        toast({ title: 'Error', description: 'Plan description is required', variant: 'destructive' });
        return;
      }
      if (!planForm.productId) {
        toast({ title: 'Error', description: 'Please select a product', variant: 'destructive' });
        return;
      }
      if (planForm.price <= 0) {
        toast({ title: 'Error', description: 'Price must be greater than 0', variant: 'destructive' });
        return;
      }
      if (planForm.originalPrice <= 0) {
        toast({ title: 'Error', description: 'Original price must be greater than 0', variant: 'destructive' });
        return;
      }

      const features = featuresInput.split('\n').filter((f) => f.trim());
      
      // Calculate discount percentage if not already set
      const discountPercentage = planForm.originalPrice > 0 
        ? Math.round(((planForm.originalPrice - planForm.price) / planForm.originalPrice) * 100)
        : 0;
      
      const planData = {
        ...planForm,
        features,
        discountPercentage,
      };
      
      if (editingPlan) {
        await updatePlan(editingPlan, planData);
        toast({ title: 'Success', description: 'Plan updated successfully!' });
      } else {
        await addPlan(planData);
        toast({ title: 'Success', description: 'Plan added successfully!' });
      }
      setPlanDialogOpen(false);
    } catch (error) {
      console.error('Plan save error:', error);
      toast({ 
        title: 'Error', 
        description: `Failed to save plan: ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: 'destructive' 
      });
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan(id);
        toast({ title: 'Success', description: 'Plan deleted successfully!' });
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: 'Failed to delete plan.',
          variant: 'destructive' 
        });
      }
    }
  };



  // Coupon handlers
  const handleSaveCoupon = async () => {
    try {
      // Validation
      if (!couponForm.code.trim()) {
        toast({ title: 'Error', description: 'Coupon code is required', variant: 'destructive' });
        return;
      }
      if (couponForm.discountPercentage <= 0 || couponForm.discountPercentage > 100) {
        toast({ title: 'Error', description: 'Discount percentage must be between 1 and 100', variant: 'destructive' });
        return;
      }
      if (couponForm.maxUses <= 0) {
        toast({ title: 'Error', description: 'Max uses must be greater than 0', variant: 'destructive' });
        return;
      }

      // Validate expiry date if provided
      let validUntilDate: Date | undefined;
      if (couponForm.validUntil) {
        validUntilDate = new Date(couponForm.validUntil);
        if (isNaN(validUntilDate.getTime())) {
          toast({ title: 'Error', description: 'Please enter a valid expiry date', variant: 'destructive' });
          return;
        }
        if (validUntilDate <= new Date()) {
          toast({ title: 'Error', description: 'Expiry date must be in the future', variant: 'destructive' });
          return;
        }
      }

      await addCoupon({
        code: couponForm.code.toUpperCase(),
        discountPercentage: couponForm.discountPercentage,
        applicableProducts: couponForm.applicableProducts,
        maxUses: couponForm.maxUses,
        validFrom: new Date(),
        validUntil: validUntilDate,
        active: couponForm.active,
      });
      toast({ title: 'Success', description: 'Coupon created successfully!' });
      setCouponDialogOpen(false);
      setCouponForm({
        code: '',
        discountPercentage: 10,
        applicableProducts: [],
        maxUses: 100,
        validUntil: '',
        active: true,
      });
    } catch (error) {
      console.error('Coupon save error:', error);
      toast({ 
        title: 'Error', 
        description: `Failed to create coupon: ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: 'destructive' 
      });
    }
  };

  // Claiming instructions handlers
  const handleSaveClaiming = async () => {
    try {
      // Validation
      if (!claimingForm.planId || !claimingForm.methodTitle || !claimingForm.instructions) {
        toast({ 
          title: 'Error', 
          description: 'Please fill in all required fields',
          variant: 'destructive' 
        });
        return;
      }

      const claimingData = {
        plan_id: claimingForm.planId,
        method_title: claimingForm.methodTitle,
        instructions: claimingForm.instructions,
        contact_info: claimingForm.contactInfo || null,
        estimated_time: claimingForm.estimatedTime || null,
        link_url: claimingForm.linkUrl || null,
      };

      if (editingClaiming) {
        // Update existing instruction
        const { error } = await (supabase as any)
          .from('claiming_instructions')
          .update(claimingData)
          .eq('id', editingClaiming.id);

        if (error) {
          console.error('Update error:', error);
          throw new Error(`Update failed: ${error.message}`);
        }

        toast({ title: 'Success', description: 'Claiming instructions updated successfully!' });
      } else {
        // Create new instruction
        const { error } = await (supabase as any)
          .from('claiming_instructions')
          .insert([claimingData]);

        if (error) {
          console.error('Insert error:', error);
          throw new Error(`Insert failed: ${error.message}`);
        }

        toast({ title: 'Success', description: 'Claiming instructions added successfully!' });
      }

      // Refresh the list
      await fetchClaimingInstructions();

      // Reset form
      setClaimingDialogOpen(false);
      setClaimingForm({
        planId: '',
        methodTitle: '',
        instructions: '',
        contactInfo: '',
        estimatedTime: '',
        linkUrl: ''
      });
      setEditingClaiming(null);
    } catch (error) {
      console.error('Claiming instructions save error:', error);
      toast({ 
        title: 'Error', 
        description: `Failed to save claiming instructions: ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: 'destructive' 
      });
    }
  };

  const handleDeleteClaiming = async (id: string) => {
    if (confirm('Are you sure you want to delete these claiming instructions?')) {
      try {
        const { error } = await (supabase as any)
          .from('claiming_instructions')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        toast({ title: 'Success', description: 'Claiming instructions deleted successfully!' });
        
        // Refresh the list
        await fetchClaimingInstructions();
      } catch (error) {
        console.error('Delete claiming instructions error:', error);
        toast({ 
          title: 'Error', 
          description: `Failed to delete claiming instructions: ${error instanceof Error ? error.message : 'Please try again.'}`,
          variant: 'destructive' 
        });
      }
    }
  };

  return (
    <div className="container py-8 min-h-screen">
      <div className="glass-neuro rounded-2xl p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70">Manage your OnlyPremiums business</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCouponDialogOpen(true)} className="btn-glass text-white border-white/30">
              <Zap className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="glass-neuro rounded-2xl p-2">
          <TabsList className="grid w-full grid-cols-5 bg-transparent">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Orders</TabsTrigger>
            <TabsTrigger value="products" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Products</TabsTrigger>
            <TabsTrigger value="coupons" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Coupons</TabsTrigger>
            <TabsTrigger value="claiming" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Claiming</TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-glass rounded-2xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white">Total Revenue</h3>
                <DollarSign className="h-4 w-4 text-white/60" />
              </div>
              <div className="text-2xl font-bold text-white">₹{(totalRevenue / 100).toLocaleString()}</div>
              <p className="text-xs text-white/60">All time revenue</p>
            </div>

            <div className="card-glass rounded-2xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white">Today's Orders</h3>
                <Package className="h-4 w-4 text-white/60" />
              </div>
              <div className="text-2xl font-bold text-white">{todayOrders.length}</div>
              <p className="text-xs text-white/60">
                ₹{(todayOrders.reduce((sum, o) => sum + o.totalAmount, 0) / 100).toLocaleString()} revenue
              </p>
            </div>

            <div className="card-glass rounded-2xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white">Pending Orders</h3>
                <Clock className="h-4 w-4 text-white/60" />
              </div>
              <div className="text-2xl font-bold text-white">{pendingOrders.length}</div>
              <p className="text-xs text-white/60">Require manual activation</p>
            </div>

            <div className="card-glass rounded-2xl p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-white">Active Coupons</h3>
                <Zap className="h-4 w-4 text-white/60" />
              </div>
              <div className="text-2xl font-bold text-white">{coupons.filter(c => c.active).length}</div>
              <p className="text-xs text-white/60">Discount coupons available</p>
            </div>
          </div>
        </TabsContent>

        {/* Orders Management */}
        <TabsContent value="orders" className="space-y-6">
          <div className="glass-neuro rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Order Management</h2>
              <div className="flex gap-2">
                <Badge className="glass border-white/30 text-white">{orders.length} Total Orders</Badge>
                <Badge className="bg-red-500/80 text-white">{pendingOrders.length} Pending</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {orders.slice(0, 10).map((order) => (
              <div key={order.id} className="card-glass rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-sm font-semibold text-white">{order.id}</p>
                      <p className="text-xs text-white/60 mt-1">
                        User ID: {order.userId} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      className={order.status === 'completed' ? 'bg-green-500/80 text-white' : 
                              order.status === 'pending' ? 'bg-red-500/80 text-white' : 'glass border-white/30 text-white'}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => {
                      const info = getProductInfo(item.plan.productId);
                      return (
                        <div key={item.plan.id} className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${info.color} flex items-center justify-center shrink-0 overflow-hidden`}>
                            {info.icon.startsWith('data:image/') || info.icon.startsWith('http') || info.icon.startsWith('/') ? (
                              <img 
                                src={info.icon} 
                                alt={info.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-lg">{info.icon}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-white">{item.plan.name}</p>
                            <p className="text-xs text-white/60 capitalize">
                              {item.plan.duration} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-sm text-white">
                            ₹{((item.plan.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="font-semibold text-lg text-white">
                      Total: ₹{(order.totalAmount / 100).toFixed(2)}
                    </span>
                    {order.status === 'pending' && (
                      <Button size="sm" className="bg-green-600/80 hover:bg-green-700/80 text-white">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve & Activate
                      </Button>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </TabsContent>

        {/* Products Management */}
        <TabsContent value="products" className="space-y-6">
          <div className="glass-neuro rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Product Management</h2>
              <button onClick={openAddProduct} className="btn-glass px-4 py-2 rounded-xl text-white border-white/30 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Tool
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {Object.entries(products).map(([key, product]) => (
              <div key={key} className="card-glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${product.color} flex items-center justify-center overflow-hidden`}>
                      {product.icon.startsWith('data:image/') || product.icon.startsWith('http') || product.icon.startsWith('/') ? (
                        <img 
                          src={product.icon} 
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xl">{product.icon}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-white/60">
                        {plans.filter(p => p.productId === key).length} plans available
                      </p>
                      <p className="text-xs text-white/50">
                        {getCategoryInfo(product.category).icon} {getCategoryInfo(product.category).name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditProduct(key)}
                      className="glass rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all border-white/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(key)}
                      className="glass rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all border-white/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Plans for each product */}
          <div className="space-y-6">
            <div className="glass-neuro rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Plans Management</h3>
                <button onClick={openAddPlan} className="btn-glass px-4 py-2 rounded-xl text-white border-white/30 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Plan
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => {
                const productInfo = getProductInfo(plan.productId);
                return (
                  <div key={plan.id} className={`card-glass rounded-2xl p-6 ${plan.active === false ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-2xl ${productInfo.color} flex items-center justify-center shrink-0 overflow-hidden`}>
                          {productInfo.icon.startsWith('data:image/') || productInfo.icon.startsWith('http') || productInfo.icon.startsWith('/') ? (
                            <img 
                              src={productInfo.icon} 
                              alt={productInfo.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-lg">{productInfo.icon}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-white">{plan.name}</h4>
                            {plan.popular && (
                              <span className="glass rounded-full px-2 py-1 text-xs font-medium text-white border-white/30">
                                Popular
                              </span>
                            )}
                            <span className={`glass rounded-full px-2 py-1 text-xs font-medium border-white/30 ${
                              plan.active ? 'text-green-400 border-green-400/30' : 'text-white/60'
                            }`}>
                              {plan.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 mb-3">{plan.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-white">₹{(plan.price / 100).toFixed(2)}</span>
                            <span className="text-white/50 line-through">
                              ₹{(plan.originalPrice / 100).toFixed(2)}
                            </span>
                            <span className="glass rounded-full px-2 py-1 text-xs text-green-400 border-green-400/30">
                              {plan.discountPercentage}% OFF
                            </span>
                            <span className="glass rounded-full px-2 py-1 text-xs text-white/80 border-white/30 capitalize">
                              {plan.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60">Active</span>
                            <Switch 
                              checked={plan.active} 
                              onCheckedChange={() => togglePlanActive(plan.id)}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60">Popular</span>
                            <Switch 
                              checked={plan.popular || false} 
                              onCheckedChange={async () => {
                                try {
                                  await updatePlan(plan.id, { ...plan, popular: !plan.popular });
                                  toast({ title: 'Success', description: 'Plan popularity updated!' });
                                } catch (error) {
                                  toast({ title: 'Error', description: 'Failed to update plan', variant: 'destructive' });
                                }
                              }}
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => openEditPlan(plan)}
                          className="glass rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all border-white/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePlan(plan.id)}
                          className="glass rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all border-white/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>



        {/* Coupons Management */}
        <TabsContent value="coupons" className="space-y-6">
          <div className="glass-neuro rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Coupon Management</h2>
              <button onClick={() => setCouponDialogOpen(true)} className="btn-glass px-4 py-2 rounded-xl text-white border-white/30 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Coupon
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="card-glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="glass px-3 py-1 rounded-xl text-sm font-mono text-white border-white/30">
                        {coupon.code}
                      </code>
                      <span className="glass rounded-full px-2 py-1 text-xs text-green-400 border-green-400/30">
                        {coupon.discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mb-1">
                      {coupon.applicableProducts.length > 0 
                        ? `Applies to: ${coupon.applicableProducts.join(', ')}`
                        : 'Applies to all products'
                      }
                    </p>
                    <p className="text-sm text-white/60">
                      {coupon.currentUses}/{coupon.maxUses || '∞'} uses
                      {coupon.validUntil && ` • Expires ${new Date(coupon.validUntil).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`glass rounded-full px-2 py-1 text-xs font-medium border-white/30 ${
                      coupon.active ? 'text-green-400 border-green-400/30' : 'text-white/60'
                    }`}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                    <Switch 
                      checked={coupon.active} 
                      onCheckedChange={() => toggleCouponActive(coupon.id)}
                    />
                    <button 
                      onClick={() => deleteCoupon(coupon.id)}
                      className="glass rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all border-white/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Claiming Instructions Management */}
        <TabsContent value="claiming" className="space-y-6">
          <div className="glass-neuro rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Claiming Instructions</h2>
                <p className="text-white/70">Manage how users claim their subscriptions</p>
              </div>
              <Button 
                onClick={() => {
                  setClaimingForm({
                    planId: '',
                    methodTitle: '',
                    instructions: '',
                    contactInfo: '',
                    estimatedTime: '',
                    linkUrl: ''
                  });
                  setEditingClaiming(null);
                  setClaimingDialogOpen(true);
                }}
                className="btn-glass text-white hover:bg-white/20"
              >
                Add Instructions
              </Button>
            </div>

            <div className="space-y-4">
              {loadingClaiming ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"></div>
                  <p className="text-white/60">Loading claiming instructions...</p>
                </div>
              ) : claimingInstructions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-neuro flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-white">No claiming instructions</h3>
                  <p className="text-white/60 mb-4">
                    Add instructions to help users claim their subscriptions
                  </p>
                </div>
              ) : (
                claimingInstructions.map((instruction) => {
                  const plan = plans.find(p => p.id === instruction.planId);
                  return (
                    <div key={instruction.id} className="card-glass rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white">{instruction.methodTitle}</h3>
                            {plan && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                {plan.name}
                              </span>
                            )}
                          </div>
                          <p className="text-white/60 text-sm mb-2 line-clamp-2">
                            {instruction.instructions.split('\n')[0]}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-white/50">
                            {instruction.estimatedTime && (
                              <span>⏱️ {instruction.estimatedTime}</span>
                            )}
                            {instruction.contactInfo && (
                              <span>📧 Support available</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setClaimingForm({
                                planId: instruction.planId,
                                methodTitle: instruction.methodTitle,
                                instructions: instruction.instructions,
                                contactInfo: instruction.contactInfo || '',
                                estimatedTime: instruction.estimatedTime || '',
                                linkUrl: instruction.linkUrl || ''
                              });
                              setEditingClaiming(instruction);
                              setClaimingDialogOpen(true);
                            }}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClaiming(instruction.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>

      </Tabs>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass-neuro border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription className="text-white/70">
              {editingProduct ? 'Update product information' : 'Add a new tool to your catalog'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-key" className="text-right text-white">Key</Label>
              <Input
                id="product-key"
                value={productForm.key}
                onChange={(e) => setProductForm({ ...productForm, key: e.target.value })}
                className="col-span-3 input-glass"
                placeholder="e.g., perplexity"
                disabled={!!editingProduct}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-name" className="text-right text-white">Name</Label>
              <Input
                id="product-name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="col-span-3 input-glass"
                placeholder="e.g., Perplexity AI"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-category" className="text-right text-white">Category</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) => setProductForm({ ...productForm, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="product-icon" className="text-right text-white pt-2">Icon</Label>
              <div className="col-span-3">
                <ImageUpload
                  value={productForm.icon}
                  onChange={(url) => setProductForm({ ...productForm, icon: url })}
                  placeholder="Upload product logo or enter emoji"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={handleSaveProduct} className="btn-glass px-6 py-2 rounded-xl text-white border-white/30">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
            <DialogDescription>
              {editingPlan ? 'Update plan information' : 'Create a new pricing plan'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-name" className="text-right">Name</Label>
              <Input
                id="plan-name"
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., Perplexity AI Pro Monthly"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-product" className="text-right">Product</Label>
              <Select
                value={planForm.productId}
                onValueChange={(value) => setPlanForm({ ...planForm, productId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(products).map(([key, product]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {product.icon.startsWith('data:image/') || product.icon.startsWith('http') || product.icon.startsWith('/') ? (
                          <img 
                            src={product.icon} 
                            alt={product.name}
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <span>{product.icon}</span>
                        )}
                        {product.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-duration" className="text-right">Duration</Label>
              <Select
                value={planForm.duration}
                onValueChange={(value: any) => setPlanForm({ ...planForm, duration: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-price" className="text-right">Price (₹)</Label>
              <Input
                id="plan-price"
                type="number"
                step="0.01"
                min="0"
                value={planForm.price / 100}
                onChange={(e) => setPlanForm({ ...planForm, price: Math.round((parseFloat(e.target.value) || 0) * 100) })}
                className="col-span-3"
                placeholder="999.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-original-price" className="text-right">Original Price (₹)</Label>
              <Input
                id="plan-original-price"
                type="number"
                step="0.01"
                min="0"
                value={planForm.originalPrice / 100}
                onChange={(e) => setPlanForm({ ...planForm, originalPrice: Math.round((parseFloat(e.target.value) || 0) * 100) })}
                className="col-span-3"
                placeholder="1499.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-description" className="text-right">Description</Label>
              <Textarea
                id="plan-description"
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                className="col-span-3"
                placeholder="Plan description..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-image" className="text-right">Image URL</Label>
              <Input
                id="plan-image"
                value={planForm.imageUrl || ''}
                onChange={(e) => setPlanForm({ ...planForm, imageUrl: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan-features" className="text-right">Features</Label>
              <Textarea
                id="plan-features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="col-span-3"
                placeholder="One feature per line..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSavePlan}>
              {editingPlan ? 'Update Plan' : 'Add Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coupon Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
            <DialogDescription>Add a new discount coupon for your customers</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coupon-code" className="text-right">Code</Label>
              <Input
                id="coupon-code"
                value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                className="col-span-3"
                placeholder="SAVE20"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coupon-discount" className="text-right">Discount %</Label>
              <Input
                id="coupon-discount"
                type="number"
                value={couponForm.discountPercentage}
                onChange={(e) => setCouponForm({ ...couponForm, discountPercentage: parseInt(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="20"
                min="1"
                max="100"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coupon-max-uses" className="text-right">Max Uses</Label>
              <Input
                id="coupon-max-uses"
                type="number"
                value={couponForm.maxUses}
                onChange={(e) => setCouponForm({ ...couponForm, maxUses: parseInt(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="100"
                min="1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coupon-valid-until" className="text-right">Valid Until</Label>
              <Input
                id="coupon-valid-until"
                type="date"
                value={couponForm.validUntil}
                onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveCoupon}>Create Coupon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Claiming Instructions Dialog */}
      <Dialog open={claimingDialogOpen} onOpenChange={setClaimingDialogOpen}>
        <DialogContent className="sm:max-w-[600px] glass-neuro border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingClaiming ? 'Edit Claiming Instructions' : 'Add Claiming Instructions'}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Create step-by-step instructions for users to claim their subscriptions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claiming-plan" className="text-right text-white">Plan</Label>
              <Select 
                value={claimingForm.planId} 
                onValueChange={(value) => setClaimingForm({ ...claimingForm, planId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claiming-method-title" className="text-right text-white">Method Title</Label>
              <Input
                id="claiming-method-title"
                value={claimingForm.methodTitle}
                onChange={(e) => setClaimingForm({ ...claimingForm, methodTitle: e.target.value })}
                className="col-span-3"
                placeholder="e.g., License Key Activation"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="claiming-instructions" className="text-right text-white pt-2">Instructions</Label>
              <Textarea
                id="claiming-instructions"
                value={claimingForm.instructions}
                onChange={(e) => setClaimingForm({ ...claimingForm, instructions: e.target.value })}
                className="col-span-3 min-h-[120px]"
                placeholder="Step-by-step instructions..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claiming-contact" className="text-right text-white">Contact Info</Label>
              <Input
                id="claiming-contact"
                value={claimingForm.contactInfo}
                onChange={(e) => setClaimingForm({ ...claimingForm, contactInfo: e.target.value })}
                className="col-span-3"
                placeholder="support@onlypremiums.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claiming-time" className="text-right text-white">Estimated Time</Label>
              <Input
                id="claiming-time"
                value={claimingForm.estimatedTime}
                onChange={(e) => setClaimingForm({ ...claimingForm, estimatedTime: e.target.value })}
                className="col-span-3"
                placeholder="5-10 minutes"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claiming-link" className="text-right text-white">Link URL</Label>
              <Input
                id="claiming-link"
                type="url"
                value={claimingForm.linkUrl}
                onChange={(e) => setClaimingForm({ ...claimingForm, linkUrl: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com/activate (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveClaiming} className="btn-glass text-white">
              {editingClaiming ? 'Update Instructions' : 'Add Instructions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}