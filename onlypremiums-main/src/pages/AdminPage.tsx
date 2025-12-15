import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, XCircle, DollarSign, TrendingUp, Plus, Pencil, Trash2, Eye, EyeOff, Star, Box } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useProducts } from '@/contexts/ProductContext';
import { Order, Plan, ProductInfo } from '@/types';

function AdminOrderCard({
  order,
  getProductInfo,
}: {
  order: Order;
  getProductInfo: (product: string) => ProductInfo;
}) {

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-mono text-sm font-semibold">{order.id}</p>
            <p className="text-xs text-muted-foreground mt-1">
              User ID: {order.userId} •{' '}
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item) => {
            const info = getProductInfo(item.plan.productId);
            return (
              <div key={item.plan.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${info.color} flex items-center justify-center shrink-0`}>
                  <span className="text-lg">{info.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.plan.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.plan.duration} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-sm">
                  ₹{((item.plan.price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="font-semibold text-lg">Total: ₹{(order.totalAmount / 100).toFixed(2)}</span>
          <div className="text-xs text-muted-foreground">Order #{order.id}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminPage() {
  const { user } = useAuth();
  const { getAllOrders } = useOrders();
  const { plans, products, addPlan, updatePlan, deletePlan, togglePlanActive, addProduct, updateProduct, deleteProduct, getProductInfo, refreshPlans, refreshProducts } = useProducts();
  
  // Product management state
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductInfo & { key: string }>({
    key: '',
    name: '',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    icon: '📦',
  });
  
  // Plan management state
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
    popular: false,
    active: true,
    createdAt: new Date(),
  });
  const [featuresInput, setFeaturesInput] = useState('');

  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const orders = getAllOrders();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

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
      if (!productForm.name.trim()) {
        alert('Product name is required');
        return;
      }
      
      if (!editingProduct && !productForm.key.trim()) {
        alert('Product key is required');
        return;
      }

      const colorMap: Record<string, { textColor: string; bgLight: string }> = {
        'bg-gradient-to-br from-blue-500 to-blue-600': { textColor: 'text-blue-600', bgLight: 'bg-blue-50' },
        'bg-gradient-to-br from-violet-500 to-purple-600': { textColor: 'text-violet-600', bgLight: 'bg-violet-50' },
        'bg-gradient-to-br from-emerald-500 to-green-600': { textColor: 'text-emerald-600', bgLight: 'bg-emerald-50' },
        'bg-gradient-to-br from-orange-500 to-red-600': { textColor: 'text-orange-600', bgLight: 'bg-orange-50' },
        'bg-gradient-to-br from-pink-500 to-rose-600': { textColor: 'text-pink-600', bgLight: 'bg-pink-50' },
        'bg-gradient-to-br from-cyan-500 to-teal-600': { textColor: 'text-cyan-600', bgLight: 'bg-cyan-50' },
        'bg-gradient-to-br from-gray-800 to-gray-900': { textColor: 'text-gray-800', bgLight: 'bg-gray-50' },
      };

      const colorInfo = colorMap[productForm.color] || { textColor: 'text-blue-600', bgLight: 'bg-blue-50' };

      const productData = {
        name: productForm.name.trim(),
        color: productForm.color,
        textColor: colorInfo.textColor,
        bgLight: colorInfo.bgLight,
        icon: productForm.icon || '📦',
      };

      console.log('Saving product:', productData);

      if (editingProduct) {
        await updateProduct(editingProduct, productData);
        console.log('Product updated successfully');
      } else {
        const key = productForm.key.toLowerCase().replace(/\s+/g, '-').trim();
        await addProduct(key, productData);
        console.log('Product added successfully');
      }
      
      // Force refresh products after successful save
      await refreshProducts();
      
      setProductDialogOpen(false);
      
      // Show success message
      alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
      console.error('Product save error:', error);
      alert('Failed to save product: ' + (error as Error).message);
    }
  };

  const handleDeleteProduct = async (key: string) => {
    const product = products[key];
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      try {
        console.log('Deleting product:', key);
        await deleteProduct(key);
        console.log('Product deleted successfully');
        
        // Force refresh products after successful delete
        await refreshProducts();
        
        // Show success message
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Product delete error:', error);
        alert('Failed to delete product: ' + (error as Error).message);
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
      popular: plan.popular || false,
      active: plan.active !== false,
      createdAt: plan.createdAt,
    });
    setFeaturesInput(plan.features.join('\n'));
    setPlanDialogOpen(true);
  };

  const handleSavePlan = async () => {
    try {
      const features = featuresInput.split('\n').filter((f) => f.trim());
      
      console.log('Saving plan:', { ...planForm, features });
      
      if (editingPlan) {
        await updatePlan(editingPlan, { ...planForm, features });
        console.log('Plan updated successfully');
      } else {
        await addPlan({ ...planForm, features });
        console.log('Plan added successfully');
      }
      
      // Force refresh plans after successful save
      await refreshPlans();
      
      setPlanDialogOpen(false);
      
      // Show success message
      alert(editingPlan ? 'Plan updated successfully!' : 'Plan added successfully!');
    } catch (error) {
      console.error('Plan save error:', error);
      alert('Failed to save plan: ' + (error as Error).message);
    }
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage orders, products, and track platform performance</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{plans.length}</p>
                <p className="text-sm text-muted-foreground">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(totalRevenue / 100).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Box className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(products).length}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    Orders will appear here when customers make purchases
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <AdminOrderCard
                      key={order.id}
                      order={order}
                      getProductInfo={getProductInfo}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Management</CardTitle>
              <Button onClick={openAddProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(products).map(([key, product]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-lg ${product.color} flex items-center justify-center`}>
                          <span className="text-2xl">{product.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">Key: {key}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditProduct(key)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteProduct(key)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {Object.keys(products).length === 0 && (
                <div className="text-center py-12">
                  <Box className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first product to get started</p>
                  <Button onClick={openAddProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Plan Management</CardTitle>
              <Button onClick={openAddPlan}>
                <Plus className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => {
                  const productInfo = getProductInfo(plan.productId);
                  return (
                    <Card key={plan.id} className={plan.active === false ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${productInfo.color} flex items-center justify-center`}>
                              <span className="text-lg">{productInfo.icon}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{plan.name}</h3>
                                {plan.popular && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                                {plan.active === false && (
                                  <Badge variant="outline" className="text-xs">Inactive</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground capitalize">
                                {plan.duration} • ₹{(plan.price / 100).toFixed(2)} (was ₹{(plan.originalPrice / 100).toFixed(2)})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePlanActive(plan.id)}
                              title={plan.active !== false ? 'Deactivate' : 'Activate'}
                            >
                              {plan.active !== false ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openEditPlan(plan)}>
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() => deletePlan(plan.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {plans.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No plans yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first plan to get started</p>
                  <Button onClick={openAddPlan}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>



      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the product details below.' : 'Fill in the details for the new product.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!editingProduct && (
              <div className="space-y-2">
                <Label htmlFor="productKey">Product Key</Label>
                <Input
                  id="productKey"
                  placeholder="e.g., perplexity, chatgpt"
                  value={productForm.key}
                  onChange={(e) => setProductForm({ ...productForm, key: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., Perplexity AI Pro"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productIcon">Icon (Emoji)</Label>
              <Input
                id="productIcon"
                placeholder="e.g., 🎵"
                value={productForm.icon}
                onChange={(e) => setProductForm({ ...productForm, icon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productColor">Gradient Color Class</Label>
              <Select
                value={productForm.color}
                onValueChange={(value) => setProductForm({ ...productForm, color: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-gradient-to-br from-blue-500 to-blue-600">Blue</SelectItem>
                  <SelectItem value="bg-gradient-to-br from-violet-500 to-purple-600">Purple</SelectItem>
                  <SelectItem value="bg-gradient-to-br from-emerald-500 to-green-600">Green</SelectItem>
                  <SelectItem value="bg-gradient-to-br from-orange-500 to-red-600">Orange/Red</SelectItem>
                  <SelectItem value="bg-gradient-to-br from-pink-500 to-rose-600">Pink</SelectItem>
                  <SelectItem value="bg-gradient-to-br from-cyan-500 to-teal-600">Cyan/Teal</SelectItem>
                  <SelectItem value="bg-gradient-to-br from-gray-800 to-gray-900">Dark Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add Plan'}</DialogTitle>
            <DialogDescription>
              {editingPlan ? 'Update the plan details below.' : 'Fill in the details for the new plan.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="e.g., Perplexity AI Pro Monthly"
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planProduct">Product</Label>
              <Select
                value={planForm.productId}
                onValueChange={(value) => setPlanForm({ ...planForm, productId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(products).map(([key, product]) => (
                    <SelectItem key={key} value={key}>
                      {product.icon} {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="planDescription">Description</Label>
              <Input
                id="planDescription"
                placeholder="Brief description of the plan"
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planDuration">Duration</Label>
              <Select
                value={planForm.duration}
                onValueChange={(value: 'monthly' | 'yearly') => setPlanForm({ ...planForm, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="planPrice">Price (₹)</Label>
              <Input
                id="planPrice"
                type="number"
                step="1"
                min="0"
                placeholder="e.g., 199"
                value={(planForm.price / 100).toFixed(0)}
                onChange={(e) => setPlanForm({ ...planForm, price: Math.round((parseFloat(e.target.value) || 0) * 100) })}
              />
              <p className="text-xs text-muted-foreground">Enter whole rupees (e.g., 199 for ₹199)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="planOriginalPrice">Original Price (₹)</Label>
              <Input
                id="planOriginalPrice"
                type="number"
                step="1"
                min="0"
                placeholder="e.g., 299"
                value={(planForm.originalPrice / 100).toFixed(0)}
                onChange={(e) => setPlanForm({ ...planForm, originalPrice: Math.round((parseFloat(e.target.value) || 0) * 100) })}
              />
              <p className="text-xs text-muted-foreground">Enter whole rupees (e.g., 299 for ₹299)</p>
            </div>
            <div className="space-y-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="planPopular"
                  checked={planForm.popular}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, popular: checked })}
                />
                <Label htmlFor="planPopular">Popular</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="planActive"
                  checked={planForm.active}
                  onCheckedChange={(checked) => setPlanForm({ ...planForm, active: checked })}
                />
                <Label htmlFor="planActive">Active</Label>
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="planFeatures">Features (one per line)</Label>
              <Textarea
                id="planFeatures"
                placeholder="Enter features, one per line..."
                rows={5}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>
              {editingPlan ? 'Update Plan' : 'Add Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
