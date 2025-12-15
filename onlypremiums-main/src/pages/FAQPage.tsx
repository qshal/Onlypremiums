import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    title: 'Getting Started',
    icon: HelpCircle,
    faqs: [
      {
        question: 'What is OnlyPremiums?',
        answer: 'OnlyPremiums is a trusted platform that provides legitimate premium software subscriptions at discounted prices. We offer subscriptions for popular productivity tools at up to 70% off regular pricing through our verified reseller program.'
      },
      {
        question: 'How does OnlyPremiums work?',
        answer: 'We partner with authorized resellers and use volume licensing to offer premium subscriptions at reduced costs. When you purchase from us, you receive a legitimate license key that works exactly like a direct purchase from the software provider.'
      },
      {
        question: 'Are the subscriptions legitimate?',
        answer: 'Yes, absolutely! All our subscriptions are sourced from authorized channels and come with full warranty. We are verified resellers for all the products we offer, ensuring you receive genuine licenses.'
      },
      {
        question: 'How do I get started?',
        answer: 'Simply browse our available plans, select the subscription you want, add it to your cart, and complete the checkout process. After your order is approved, you\'ll receive your license key via email within 24 hours.'
      }
    ]
  },
  {
    title: 'Orders & Delivery',
    icon: Clock,
    faqs: [
      {
        question: 'How long does it take to receive my license key?',
        answer: 'Most orders are processed and approved within 24 hours. During peak times, it may take up to 48 hours. You\'ll receive email notifications about your order status and your license key once approved.'
      },
      {
        question: 'Why do orders need approval?',
        answer: 'We manually review each order to ensure security and prevent fraud. This process helps us maintain the quality and legitimacy of our service while protecting both our customers and partners.'
      },
      {
        question: 'What happens after I place an order?',
        answer: 'After placing an order, you\'ll receive a confirmation email. Our team will review and approve your order within 24-48 hours. Once approved, you\'ll receive your license key and activation instructions via email.'
      },
      {
        question: 'Can I track my order status?',
        answer: 'Yes! You can track your order status by logging into your account and visiting the dashboard. You\'ll see all your orders with their current status (pending, approved, or rejected).'
      },
      {
        question: 'What if my order is rejected?',
        answer: 'If your order is rejected, you\'ll receive an email with the reason. Common reasons include payment issues or verification requirements. You can contact our support team to resolve any issues and resubmit your order.'
      }
    ]
  },
  {
    title: 'Licenses & Activation',
    icon: Shield,
    faqs: [
      {
        question: 'How do I activate my license?',
        answer: 'Once you receive your license key, follow the activation instructions provided in your email. Generally, you\'ll need to log into the software provider\'s website, go to your account settings, and enter the license key in the subscription or billing section.'
      },
      {
        question: 'What if my license key doesn\'t work?',
        answer: 'If you encounter any issues with your license key, please contact our support team immediately. We provide full replacement guarantee for any non-working keys and will resolve the issue within 24 hours.'
      },
      {
        question: 'How long are the licenses valid?',
        answer: 'License validity depends on the subscription type you purchase. Monthly subscriptions are valid for 30 days, and yearly subscriptions are valid for 365 days from the activation date. You\'ll receive renewal reminders before expiration.'
      },
      {
        question: 'Can I use the license on multiple devices?',
        answer: 'License usage depends on the software provider\'s terms. Most subscriptions allow usage on multiple devices under the same account. Check the specific software\'s terms of service for device limitations.'
      },
      {
        question: 'What happens when my license expires?',
        answer: 'When your license expires, you\'ll lose access to premium features. You can renew by purchasing a new subscription from us. We\'ll send you renewal reminders before your license expires.'
      }
    ]
  },
  {
    title: 'Payment & Billing',
    icon: MessageCircle,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and digital payment methods. All payments are processed securely through our encrypted payment gateway.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and PCI-compliant payment processors to ensure your payment information is completely secure. We never store your payment details on our servers.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer refunds for orders that haven\'t been processed yet. Once a license key is delivered and verified working, refunds are subject to our refund policy. Please review our refund policy for detailed terms.'
      },
      {
        question: 'Can I get an invoice for my purchase?',
        answer: 'Yes, you\'ll receive a digital invoice via email after your payment is processed. You can also download invoices from your account dashboard at any time.'
      },
      {
        question: 'Do you offer bulk pricing?',
        answer: 'Yes, we offer special pricing for bulk orders (10+ licenses). Please contact our sales team with your requirements for custom pricing and volume discounts.'
      }
    ]
  }
];

export function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our services, orders, and licenses
          </p>
        </div>

        {/* Quick Links */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Need more help?</p>
                  <Link to="/support" className="text-sm text-primary hover:underline">
                    Contact our support team
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Response time</p>
                  <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemId = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems.includes(itemId);
                    
                    return (
                      <div key={faqIndex} className="border rounded-lg">
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-4 h-auto text-left"
                          onClick={() => toggleItem(itemId)}
                        >
                          <span className="font-medium">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                          )}
                        </Button>
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/support">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}