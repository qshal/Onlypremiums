import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingCart, Shield, Clock, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { ProductIcon } from '@/components/ProductIcon';

export function PlanDetailPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { plans, getProductInfo } = useProducts();

  const plan = plans.find((p) => p.id === planId);

  if (!plan) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
        <Button asChild>
          <Link to="/plans">Browse All Plans</Link>
        </Button>
      </div>
    );
  }

  const info = getProductInfo(plan.productId);
  const savings = Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);
  const relatedPlans = plans.filter((p) => p.productId === plan.productId && p.id !== plan.id && p.active !== false);

  const handleAddToCart = async () => {
    try {
      await addItem(plan);
      toast({
        title: 'Added to cart',
        description: `${plan.name} (${plan.duration}) has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(plan);
      navigate('/cart');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container py-12">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plans
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Product Header */}
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-xl ${info.color} flex items-center justify-center shrink-0 overflow-hidden`}>
              <ProductIcon productId={plan.productId} productName={info.name} size="lg" fallbackEmoji={info.icon} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{plan.name}</h1>
                {plan.popular && <Badge>Most Popular</Badge>}
              </div>
              <p className="text-muted-foreground capitalize">{plan.duration} Subscription</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About This Plan</h2>
            <p className="text-muted-foreground">{plan.description}</p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold mb-4">What's Included</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">100% Legitimate</p>
                  <p className="text-xs text-muted-foreground">Verified licenses</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">Within 24 hours</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Headphones className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">24/7 Support</p>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar - Purchase Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                <span className="text-lg text-muted-foreground line-through">₹{plan.originalPrice}</span>
              </div>
              <Badge variant="secondary" className="mb-4">
                Save {savings}% ({plan.duration === 'yearly' ? 'Best Value' : 'Flexible'})
              </Badge>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium capitalize">{plan.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{info.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">Within 24 hours</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleBuyNow}>
                  Buy Now
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout • Money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Plans */}
      {relatedPlans.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other {info.name} Plans</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPlans.map((relatedPlan) => {
              const relatedSavings = Math.round(
                ((relatedPlan.originalPrice - relatedPlan.price) / relatedPlan.originalPrice) * 100
              );
              return (
                <Card key={relatedPlan.id} className="flex items-center p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{relatedPlan.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{relatedPlan.duration} Plan</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xl font-bold">₹{relatedPlan.price}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{relatedPlan.originalPrice}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Save {relatedSavings}%
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to={`/plans/${relatedPlan.id}`}>View</Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
