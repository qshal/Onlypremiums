import { Scale, Shield, AlertTriangle, Users, FileText, Globe, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using OnlyPremiums ("the Service"), you accept and agree to be bound by these Terms of Service.',
      'If you do not agree to these terms, please do not use our service.',
      'We reserve the right to modify these terms at any time with notice to users.',
      'Your continued use of the service after changes constitutes acceptance of the new terms.'
    ]
  },
  {
    icon: Users,
    title: 'User Accounts',
    content: [
      'You must create an account to use our services and provide accurate information.',
      'You are responsible for maintaining the security of your account credentials.',
      'You must not share your account with others or use multiple accounts.',
      'We reserve the right to suspend or terminate accounts that violate our terms.',
      'Users must be at least 18 years old or have parental consent to use our services.'
    ]
  },
  {
    icon: Shield,
    title: 'Service Description',
    content: [
      'OnlyPremiums provides legitimate premium software subscriptions at discounted prices.',
      'We act as an authorized reseller for various software providers.',
      'All licenses provided are genuine and sourced through legitimate channels.',
      'Service availability may vary based on software provider policies.',
      'We do not guarantee continuous availability of specific products or pricing.'
    ]
  },
  {
    icon: Scale,
    title: 'User Responsibilities',
    content: [
      'Users must comply with all applicable laws and software provider terms of service.',
      'You may not resell, redistribute, or share licenses obtained through our service.',
      'Users are responsible for proper activation and use of purchased licenses.',
      'Any misuse of licenses may result in account termination and legal action.',
      'Users must report any issues with licenses promptly to our support team.'
    ]
  },
  {
    icon: AlertTriangle,
    title: 'Prohibited Activities',
    content: [
      'Creating multiple accounts to circumvent purchase limits or policies.',
      'Using our service for any illegal or unauthorized purposes.',
      'Attempting to reverse engineer, hack, or compromise our systems.',
      'Sharing or reselling licenses obtained through our platform.',
      'Providing false information during registration or purchase processes.',
      'Using automated tools or bots to interact with our service.'
    ]
  },
  {
    icon: Globe,
    title: 'Intellectual Property',
    content: [
      'All content on our website is protected by copyright and trademark laws.',
      'Users may not copy, reproduce, or distribute our content without permission.',
      'Software licenses remain the property of their respective providers.',
      'Our platform and branding are proprietary to OnlyPremiums.',
      'Users grant us limited rights to use their information for service provision.'
    ]
  }
];

const additionalTerms = [
  {
    title: 'Payment Terms',
    points: [
      'All payments must be made in full before license delivery',
      'Prices are subject to change without notice',
      'Payment processing fees may apply',
      'Refunds are subject to our refund policy'
    ]
  },
  {
    title: 'Limitation of Liability',
    points: [
      'Our liability is limited to the amount paid for the specific service',
      'We are not responsible for software provider policy changes',
      'Users assume responsibility for proper license usage',
      'We provide no warranties beyond those required by law'
    ]
  },
  {
    title: 'Privacy and Data',
    points: [
      'User data is handled according to our Privacy Policy',
      'We collect only necessary information for service provision',
      'Data may be shared with payment processors and software providers',
      'Users have rights regarding their personal data'
    ]
  }
];

export function TermsOfServicePage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Legal terms and conditions for using OnlyPremiums services
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 11, 2024
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> By using our services, you agree to these terms. 
            Please read them carefully before making any purchases or using our platform.
          </AlertDescription>
        </Alert>

        {/* Main Sections */}
        <div className="space-y-8 mb-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Terms */}
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          {additionalTerms.map((term, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{term.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {term.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law and Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                These Terms of Service are governed by and construed in accordance with applicable laws. 
                Any disputes arising from these terms or use of our services will be resolved through 
                appropriate legal channels.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Dispute Resolution</h4>
                  <p className="text-sm text-muted-foreground">
                    We encourage users to contact our support team first to resolve any issues. 
                    Most disputes can be resolved quickly through direct communication.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Severability</h4>
                  <p className="text-sm text-muted-foreground">
                    If any provision of these terms is found to be unenforceable, 
                    the remaining provisions will continue to be valid and enforceable.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Questions About These Terms?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm mb-6">
              <p><strong>Email:</strong> legal@onlypremiums.com</p>
              <p><strong>Support:</strong> support@onlypremiums.com</p>
              <p><strong>Response Time:</strong> We will respond to legal inquiries within 48 hours</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/support" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Support
              </Link>
              <Link 
                to="/privacy" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Updates Notice */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Terms Updates</h3>
            <p className="text-sm text-muted-foreground">
              We may update these Terms of Service from time to time. We will notify users of any 
              material changes by posting the new terms on this page and updating the "Last updated" date. 
              Your continued use of our services after any changes constitutes acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}