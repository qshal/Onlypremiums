import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Package, CheckCircle2, DollarSign, Plus, Pencil, Trash2, 
  Eye, EyeOff, Star, Box, Users, TrendingUp, Calendar,
  MessageSquare, Gift, Zap, BarChart3, Clock, AlertCircle
} from 'lucide-react';
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
import { Order, Plan, ProductInfo, ActivationMethod } from '@/types';

// Enhanced Admin Dashboard with Business Workflow Features
export function EnhancedAdminPage() {
  const { user } = useAuth();
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

  // State for different admin workflows
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);


  // Product management state
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



  // Coupon management state
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'SAVE40', discount: 40, tool: 'ChatGPT Plus', uses: 25, maxUses: 100, active: true },
    { id: 2, code: 'STUDENT30', discount: 30, tool: 'All Tools', uses: 15, maxUses: 50, active: true },
    { id: 3, code: 'WELCOME20', discount: 20, tool: 'All Tools', uses: 45, maxUses: 200, active: true },
  ]);

  // Support tickets state
  const [supportTickets, setSupportTickets] = useState([
    { id: 1, user: 'john@example.com', subject: 'ChatGPT activation issue', status: 'open', priority: 'high', created: '2024-12-10' },
    { id: 2, user: 'sarah@example.com', subject: 'Refund request', status: 'pending', priority: 'medium', created: '2024-12-09' },
    { id: 3, user: 'mike@example.com', subject: 'License activation issue', status: 'resolved', priority: 'low', created: '2024-12-08' },
  ]);

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
  const completedOrders = orders.filter(o => o.status === 'completed');

  // Analytics calculations
  const monthlyRevenue = orders
    .filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const topProducts = Object.entries(
    orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const productName = getProductInfo(item.plan.productId).name;
        acc[productName] = (acc[productName] || 0) + item.quantity;
      });
      return acc;
    }, {} as Record<string, number>)
  ).sort(([,a], [,b]) => b - a).slice(0, 5);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your OnlyPremiums business</p>
        </div>
        <div className="flex gap-2">

          <Button onClick={() => setCouponDialogOpen(true)} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(totalRevenue / 100).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayOrders.length}</div>
                <p className="text-xs text-muted-foreground">
                  ₹{(todayOrders.reduce((sum, o) => sum + o.totalAmount, 0) / 100).toLocaleString()} revenue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders.length}</div>
                <p className="text-xs text-muted-foreground">
                  Require manual activation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coupons.filter(c => c.active).length}</div>
                <p className="text-xs text-muted-foreground">
                  Active discount coupons
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProducts.map(([product, sales], index) => (
                    <div key={product} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm">{product}</span>
                      </div>
                      <Badge variant="secondary">{sales} sold</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Recent Support Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportTickets.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.user}</p>
                      </div>
                      <Badge 
                        variant={ticket.status === 'open' ? 'destructive' : 
                                ticket.status === 'pending' ? 'default' : 'secondary'}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Management */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Order Management</h2>
            <div className="flex gap-2">
              <Badge variant="outline">{orders.length} Total Orders</Badge>
              <Badge variant="destructive">{pendingOrders.length} Pending</Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {orders.slice(0, 10).map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-sm font-semibold">{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        User ID: {order.userId} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={order.status === 'completed' ? 'default' : 
                              order.status === 'pending' ? 'destructive' : 'secondary'}
                    >
                      {order.status}
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
                    <span className="font-semibold text-lg">
                      Total: ₹{(order.totalAmount / 100).toFixed(2)}
                    </span>
                    {order.status === 'pending' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve & Activate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Products Management */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Product Management</h2>
            <Button onClick={() => setProductDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Tool
            </Button>
          </div>

          <div className="grid gap-6">
            {Object.entries(products).map(([key, product]) => (
              <Card key={key}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg ${product.color} flex items-center justify-center`}>
                        <span className="text-xl">{product.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plans.filter(p => p.productId === key).length} plans available
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>



        {/* Coupons Management */}
        <TabsContent value="coupons" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Coupon Management</h2>
            <Button onClick={() => setCouponDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </div>

          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {coupon.code}
                        </code>
                        <Badge variant="outline">{coupon.discount}% OFF</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {coupon.tool} • {coupon.uses}/{coupon.maxUses} uses
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={coupon.active ? 'default' : 'secondary'}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch checked={coupon.active} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Management */}
        <TabsContent value="support" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Support Tickets</h2>
            <Badge variant="destructive">
              {supportTickets.filter(t => t.status === 'open').length} Open Tickets
            </Badge>
          </div>

          <div className="grid gap-4">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{ticket.subject}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.user} • {ticket.created} • Priority: {ticket.priority}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={ticket.status === 'open' ? 'destructive' : 
                                ticket.status === 'pending' ? 'default' : 'secondary'}
                      >
                        {ticket.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}