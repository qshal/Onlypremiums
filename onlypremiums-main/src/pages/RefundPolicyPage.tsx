import { Clock, Shield, AlertCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const refundScenarios = [
  {
    icon: CheckCircle2,
    title: 'Full Refund Available',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    scenarios: [
      'Order cancelled before processing and approval',
      'License key not delivered within 72 hours of approval',
      'License key is invalid or non-functional upon delivery',
      'Duplicate order placed by mistake (within 24 hours)',
      'Technical error on our platform during checkout'
    ]
  },
  {
    icon: RefreshCw,
    title: 'Replacement or Partial Refund',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    scenarios: [
      'License key stops working within 7 days of activation',
      'Wrong subscription type delivered (we\'ll provide correct one)',
      'Account access issues due to our error',
      'Service interruption lasting more than 48 hours'
    ]
  },
  {
    icon: XCircle,
    title: 'No Refund Available',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    scenarios: [
      'License key successfully activated and working',
      'More than 7 days since license activation',
      'Violation of software provider\'s terms of service',
      'Account suspension by software provider due to user actions',
      'Change of mind after successful delivery and activation'
    ]
  }
];

const refundProcess = [
  {
    step: 1,
    title: 'Submit Request',
    description: 'Contact our support team with your order details and reason for refund',
    timeframe: 'Within 7 days of purchase'
  },
  {
    step: 2,
    title: 'Review Process',
    description: 'Our team reviews your request and verifies eligibility',
    timeframe: '1-2 business days'
  },
  {
    step: 3,
    title: 'Decision Notification',
    description: 'You\'ll receive an email with our decision and next steps',
    timeframe: 'Within 24 hours of review'
  },
  {
    step: 4,
    title: 'Refund Processing',
    description: 'If approved, refund is processed to your original payment method',
    timeframe: '3-5 business days'
  }
];

export function RefundPolicyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Refund Policy</h1>
          <p className="text-xl text-muted-foreground">
            Clear and fair refund terms for all OnlyPremiums purchases
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 11, 2024
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Due to the digital nature of our products, all refund requests 
            must be submitted within 7 days of purchase. Please read this policy carefully before making a purchase.
          </AlertDescription>
        </Alert>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              Refund Policy Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At OnlyPremiums, we strive to provide high-quality digital products and excellent customer service. 
              Our refund policy is designed to be fair to both our customers and our business, taking into account 
              the digital nature of our products and the licensing agreements with software providers.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">7-Day Window</p>
                <p className="text-sm text-muted-foreground">Refund requests must be made within 7 days</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Fair Assessment</p>
                <p className="text-sm text-muted-foreground">Each case reviewed individually</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Quick Processing</p>
                <p className="text-sm text-muted-foreground">Refunds processed within 3-5 business days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Scenarios */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Refund Eligibility</h2>
          {refundScenarios.map((scenario, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${scenario.bgColor} flex items-center justify-center`}>
                    <scenario.icon className={`h-5 w-5 ${scenario.color}`} />
                  </div>
                  {scenario.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scenario.scenarios.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Refund Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Refund Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {refundProcess.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </div>
                    {index < refundProcess.length - 1 && (
                      <div className="w-px h-12 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{step.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {step.timeframe}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Special Circumstances */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Special Circumstances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Bulk Orders</h4>
                <p className="text-sm text-muted-foreground">
                  Bulk orders (10+ licenses) may have different refund terms. Please contact our sales team 
                  for specific terms and conditions related to volume purchases.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Promotional Purchases</h4>
                <p className="text-sm text-muted-foreground">
                  Items purchased during promotional periods or with discount codes may have modified 
                  refund terms. Specific terms will be clearly stated during checkout.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Third-Party Issues</h4>
                <p className="text-sm text-muted-foreground">
                  If issues arise due to changes in the software provider's policies or service 
                  discontinuation, we will work with customers to find suitable solutions or provide refunds.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need to Request a Refund?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To request a refund, please contact our support team with the following information:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm">Order ID and purchase date</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm">Detailed reason for refund request</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm">Screenshots or evidence (if applicable)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm">Preferred resolution (refund, replacement, etc.)</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/support" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Support
              </Link>
              <Link 
                to="/faq" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                View FAQ
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}