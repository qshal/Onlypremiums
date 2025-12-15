import { Shield, Eye, Lock, UserCheck, Database, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Personal information you provide when creating an account (name, email address)',
      'Payment information processed securely through our payment providers',
      'Order history and license key delivery information',
      'Communication records when you contact our support team',
      'Technical information such as IP address, browser type, and device information',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To process and fulfill your orders for software subscriptions',
      'To deliver license keys and provide customer support',
      'To communicate with you about your orders and account',
      'To improve our services and user experience',
      'To comply with legal obligations and prevent fraud',
      'To send promotional emails (with your consent)',
    ],
  },
  {
    icon: Shield,
    title: 'Information Sharing',
    content: [
      'We do not sell, trade, or rent your personal information to third parties',
      'We may share information with trusted service providers who assist in our operations',
      'We may disclose information when required by law or to protect our rights',
      'Anonymous, aggregated data may be used for analytics and business purposes',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'We use industry-standard encryption to protect your data in transit and at rest',
      'Payment information is processed through PCI-compliant payment processors',
      'Access to personal information is restricted to authorized personnel only',
      'We regularly review and update our security measures',
      'We maintain secure servers and databases with regular backups',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'Access: You can request a copy of the personal information we hold about you',
      'Correction: You can request correction of inaccurate or incomplete information',
      'Deletion: You can request deletion of your personal information (subject to legal requirements)',
      'Portability: You can request your data in a portable format',
      'Opt-out: You can unsubscribe from marketing communications at any time',
    ],
  },
  {
    icon: Globe,
    title: 'Cookies and Tracking',
    content: [
      'We use essential cookies to provide basic website functionality',
      'Analytics cookies help us understand how visitors use our website',
      'You can control cookie preferences through your browser settings',
      'We do not use cookies for advertising or tracking across other websites',
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 11, 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              OnlyPremiums ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our services. By using our services, you consent to the practices described in this policy.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        <div className="space-y-8">
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
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Account information: Until account deletion</li>
                <li>• Order history: 7 years for tax and legal purposes</li>
                <li>• Support communications: 3 years</li>
                <li>• Marketing data: Until you opt out</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>International Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your information may be transferred to and processed in countries other than your own.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• We ensure adequate protection through appropriate safeguards</li>
                <li>• Data transfers comply with applicable privacy laws</li>
                <li>• We use standard contractual clauses where required</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> privacy@onlypremiums.com</p>
              <p><strong>Address:</strong> OnlyPremiums Privacy Team, [Your Address]</p>
              <p><strong>Response Time:</strong> We will respond to privacy inquiries within 30 days</p>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Policy Updates</h3>
            <p className="text-sm text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date. Your continued use 
              of our services after any changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}