import { Truck, Clock, Globe, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const deliveryMethods = [
  {
    icon: Clock,
    title: 'Instant Digital Delivery',
    description: 'License keys and activation codes delivered immediately after payment confirmation',
    timeframe: 'Within 5-15 minutes',
    type: 'Automated',
    badge: 'Most Common',
  },
  {
    icon: Shield,
    title: 'Manual Account Setup',
    description: 'Our team manually configures your account for premium services',
    timeframe: 'Within 24 hours',
    type: 'Manual Process',
    badge: 'Premium Services',
  },
  {
    icon: Globe,
    title: 'Account Upgrade',
    description: 'We upgrade your existing account with premium features',
    timeframe: 'Within 12-24 hours',
    type: 'Account Management',
    badge: 'Existing Accounts',
  },
];

const deliverySteps = [
  {
    step: 1,
    title: 'Order Confirmation',
    description: 'You receive an order confirmation email immediately after payment',
  },
  {
    step: 2,
    title: 'Processing',
    description: 'Our system processes your order and prepares your digital products',
  },
  {
    step: 3,
    title: 'Delivery',
    description: 'License keys, login credentials, or setup instructions are delivered via email',
  },
  {
    step: 4,
    title: 'Support',
    description: 'Our support team is available to help with activation and setup',
  },
];

export function ShippingPolicyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Shipping & Delivery Policy</h1>
          <p className="text-xl text-muted-foreground">
            Learn how we deliver your digital software subscriptions and services
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 12, 2024
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Digital Products Only</h3>
                <p className="text-blue-800">
                  OnlyPremiums exclusively sells digital software subscriptions and services. 
                  We do not ship physical products. All deliveries are made electronically via email.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Methods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Delivery Methods</h2>
          <div className="grid gap-6">
            {deliveryMethods.map((method, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <method.icon className="h-5 w-5 text-primary" />
                      </div>
                      {method.title}
                    </CardTitle>
                    <Badge variant="secondary">{method.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Delivery Time:</span>
                      <span className="ml-2 text-green-600">{method.timeframe}</span>
                    </div>
                    <div>
                      <span className="font-medium">Process Type:</span>
                      <span className="ml-2">{method.type}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Delivery Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliverySteps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 font-bold">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                What You'll Receive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>License keys or activation codes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Step-by-step activation instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Account login credentials (when applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Download links and software access</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>Support contact information</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Delivery Timeframes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span>Automated Products:</span>
                  <Badge variant="outline" className="text-green-600">5-15 minutes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Manual Setup:</span>
                  <Badge variant="outline" className="text-blue-600">Within 24 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Account Upgrades:</span>
                  <Badge variant="outline" className="text-orange-600">12-24 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Business Hours:</span>
                  <span className="text-muted-foreground">9 AM - 6 PM IST</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Important Delivery Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✓ What We Guarantee</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Delivery within stated timeframes</li>
                  <li>• Valid and working license keys</li>
                  <li>• Full activation support</li>
                  <li>• Replacement if keys don't work</li>
                  <li>• Email delivery confirmation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">⚠ Important Reminders</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Check your spam/junk folder</li>
                  <li>• Ensure correct email address</li>
                  <li>• Manual orders may take longer on weekends</li>
                  <li>• Contact support if no delivery within timeframe</li>
                  <li>• Keep your order confirmation safe</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Issues */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Delivery Issues & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">If You Don't Receive Your Order:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li>Check your spam/junk email folder</li>
                  <li>Verify the email address used during checkout</li>
                  <li>Wait for the full delivery timeframe to pass</li>
                  <li>Contact our support team with your order number</li>
                </ol>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Contact Support:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Email:</strong> support@onlypremiums.com</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                  <p><strong>Business Hours:</strong> Monday - Saturday, 9 AM - 6 PM IST</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our digital delivery service is available worldwide. Since we deliver digital products via email, 
              there are no geographic restrictions or additional shipping costs.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-700">Global Coverage</div>
                <div className="text-green-600">Available Worldwide</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-700">No Shipping Costs</div>
                <div className="text-blue-600">Digital Delivery Only</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-700">24/7 Delivery</div>
                <div className="text-purple-600">Automated System</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}