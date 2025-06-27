import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  Lock, 
  Download,
  Trash2,
  Edit,
  Share,
  Globe,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Cookie
} from 'lucide-react';

const PrivacyPolicyPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleCookiePreference = (type) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveCookiePreferences = () => {
    // Save to localStorage and update cookie consent
    localStorage.setItem('harmonix_cookie_preferences', JSON.stringify(cookiePreferences));
    console.log('Cookie preferences saved:', cookiePreferences);
    
    // Show confirmation
    alert('Cookie preferences saved successfully!');
  };

  const dataRights = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: 'Right to Access',
      description: 'Request copies of your personal data',
      action: 'Request Data Export'
    },
    {
      icon: <Edit className="h-5 w-5" />,
      title: 'Right to Rectification',
      description: 'Correct inaccurate or incomplete data',
      action: 'Update Information'
    },
    {
      icon: <Trash2 className="h-5 w-5" />,
      title: 'Right to Erasure',
      description: 'Request deletion of your personal data',
      action: 'Delete Account'
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: 'Right to Portability',
      description: 'Export your data in machine-readable format',
      action: 'Download Data'
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: 'Right to Restriction',
      description: 'Limit how we process your data',
      action: 'Manage Processing'
    },
    {
      icon: <Share className="h-5 w-5" />,
      title: 'Right to Object',
      description: 'Opt-out of certain data processing',
      action: 'Manage Consent'
    }
  ];

  const privacySections = [
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <Eye className="h-5 w-5" />,
      content: `
        **Personal Information:**
        • Account details (name, email, company)
        • Contact information (phone, address)
        • Billing information (payment methods, invoices)
        • Profile information (preferences, settings)

        **Usage Data:**
        • Platform interactions and feature usage
        • Agent configurations and prompts
        • Performance metrics and analytics
        • Error logs and debugging information

        **Technical Data:**
        • IP address and geolocation
        • Browser type and version
        • Device information and operating system
        • Cookies and tracking technologies

        **Communication Data:**
        • Support tickets and correspondence
        • Feedback and survey responses
        • Marketing communication preferences
        • SMS and email interactions
      `
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <Lock className="h-5 w-5" />,
      content: `
        **Service Provision:**
        • Provide and maintain HARMONIX platform
        • Process payments and manage subscriptions
        • Deliver customer support and assistance
        • Send important service notifications

        **Platform Improvement:**
        • Analyze usage patterns and optimize performance
        • Develop new features and capabilities
        • Conduct research and analytics
        • Ensure platform security and reliability

        **Communication:**
        • Send account-related notifications
        • Provide marketing communications (with consent)
        • Respond to inquiries and support requests
        • Share important updates and announcements

        **Legal Compliance:**
        • Comply with applicable laws and regulations
        • Respond to legal requests and court orders
        • Protect our rights and prevent fraud
        • Enforce our terms of service
      `
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: <Share className="h-5 w-5" />,
      content: `
        **We DO NOT sell your personal information.**

        **Service Providers:**
        • Cloud hosting and infrastructure (AWS, Google Cloud)
        • Payment processing (Stripe, PayPal)
        • Email and communication services
        • Analytics and monitoring tools

        **Legal Requirements:**
        • Law enforcement agencies (when legally required)
        • Regulatory authorities and government bodies
        • Legal proceedings and court orders
        • Protection of rights and safety

        **Business Transfers:**
        • Mergers, acquisitions, or asset sales
        • Due diligence processes (with confidentiality)
        • Successor entities (with notice to users)
        • Bankruptcy or insolvency proceedings

        **With Your Consent:**
        • Third-party integrations you authorize
        • Marketing partners (opt-in only)
        • Research collaborations
        • Public testimonials and case studies
      `
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: <Shield className="h-5 w-5" />,
      content: `
        **Encryption:**
        • AES-256 encryption for data at rest
        • TLS 1.3 for data in transit
        • End-to-end encryption for sensitive communications
        • Encrypted database backups

        **Access Controls:**
        • Multi-factor authentication required
        • Role-based access permissions
        • Regular access reviews and audits
        • Principle of least privilege

        **Infrastructure Security:**
        • SOC 2 Type II compliant data centers
        • 24/7 security monitoring and alerting
        • Regular penetration testing
        • Vulnerability assessments and patching

        **Incident Response:**
        • Dedicated security team
        • Incident response procedures
        • Breach notification protocols
        • Forensic analysis capabilities
      `
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: <Trash2 className="h-5 w-5" />,
      content: `
        **Account Data:**
        • Active accounts: Retained while account exists
        • Deleted accounts: 90 days for recovery
        • Billing records: 7 years for tax compliance
        • Support tickets: 7 years for legal requirements

        **Usage Data:**
        • Analytics data: 24 months for insights
        • Performance logs: 12 months for optimization
        • Error logs: 6 months for debugging
        • Audit trails: 7 years for compliance

        **Communication Data:**
        • Email communications: 3 years
        • SMS messages: 1 year
        • Marketing data: Until consent withdrawn
        • Support conversations: 7 years

        **Backup Data:**
        • Automated backups: 30 days
        • Disaster recovery: 90 days
        • Archived data: Per legal requirements
        • Deleted data: Securely purged after retention period
      `
    },
    {
      id: 'international',
      title: 'International Transfers',
      icon: <Globe className="h-5 w-5" />,
      content: `
        **Transfer Locations:**
        • Primary processing: United States
        • EU data centers: Available for EU customers
        • Backup facilities: Multiple geographic regions
        • CDN locations: Global for performance

        **Legal Safeguards:**
        • Standard Contractual Clauses (SCCs)
        • Data Processing Agreements (DPAs)
        • Adequacy decisions where applicable
        • Privacy Shield successor frameworks

        **EU-US Transfers:**
        • Trans-Atlantic Data Privacy Framework
        • Binding Corporate Rules (BCRs)
        • Consent mechanisms where appropriate
        • Regular compliance assessments

        **Data Localization:**
        • EU data can remain in EU (upon request)
        • Government data restrictions respected
        • Local law compliance ensured
        • Cross-border transfer logs maintained
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                <Shield className="h-16 w-16 text-blue-400" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Your privacy is fundamental to how we build and operate HARMONIX. 
              This policy explains how we collect, use, and protect your information.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="outline" className="border-blue-600 text-blue-400">
                GDPR Compliant
              </Badge>
              <Badge variant="outline" className="border-purple-600 text-purple-400">
                SOC 2 Type II
              </Badge>
              <Badge variant="outline" className="border-green-600 text-green-400">
                Last Updated: December 2024
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Download className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Download Your Data</h3>
                <p className="text-slate-400 text-sm mb-4">Export all your personal data in machine-readable format</p>
                <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                  Request Export
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Cookie className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Cookie Preferences</h3>
                <p className="text-slate-400 text-sm mb-4">Manage your cookie and tracking preferences</p>
                <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Manage Cookies
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700 hover:border-red-500 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Trash2 className="h-8 w-8 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
                <p className="text-slate-400 text-sm mb-4">Permanently delete your account and all data</p>
                <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-6 mb-12">
            {privacySections.map((section) => (
              <Card key={section.id} className="bg-slate-800 border-slate-700">
                <CardHeader 
                  className="cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg text-white">
                        {section.icon}
                      </div>
                      <CardTitle className="text-white">{section.title}</CardTitle>
                    </div>
                    
                    <div className={`transform transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </CardHeader>
                
                {expandedSection === section.id && (
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-line text-slate-300 text-sm leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Your Rights */}
          <Card className="bg-slate-800 border-slate-700 mb-12">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Your Privacy Rights
              </CardTitle>
              <CardDescription>
                Under GDPR and other privacy laws, you have the following rights regarding your personal data
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataRights.map((right, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-700 rounded-lg">
                    <div className="p-2 bg-blue-600 rounded-lg text-white flex-shrink-0">
                      {right.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{right.title}</h4>
                      <p className="text-slate-400 text-sm mb-3">{right.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                      >
                        {right.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cookie Preferences */}
          <Card className="bg-slate-800 border-slate-700 mb-12">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookie Preferences
              </CardTitle>
              <CardDescription>
                Manage your cookie and tracking preferences. Essential cookies cannot be disabled.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {Object.entries(cookiePreferences).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div>
                      <h4 className="text-lg font-semibold text-white capitalize">{type} Cookies</h4>
                      <p className="text-slate-400 text-sm">
                        {type === 'essential' && 'Required for basic platform functionality'}
                        {type === 'analytics' && 'Help us understand how you use the platform'}
                        {type === 'marketing' && 'Used to show you relevant advertisements'}
                        {type === 'preferences' && 'Remember your settings and preferences'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {type === 'essential' ? (
                        <Badge variant="outline" className="border-green-600 text-green-400">
                          Required
                        </Badge>
                      ) : (
                        <Button
                          variant={enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCookiePreference(type)}
                          className={enabled 
                            ? "bg-purple-600 hover:bg-purple-700" 
                            : "border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                          }
                        >
                          {enabled ? 'Enabled' : 'Disabled'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={saveCookiePreferences}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-emerald-400">Privacy Contact</CardTitle>
              <CardDescription>
                Questions about this privacy policy or your data rights?
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Data Protection Officer</h4>
                  <p className="text-slate-400 text-sm mb-2">Email: privacy@harmonix.digital</p>
                  <p className="text-slate-400 text-sm mb-2">Phone: +1 (555) 123-4567</p>
                  <p className="text-slate-400 text-sm">Response time: 72 hours</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Mailing Address</h4>
                  <p className="text-slate-400 text-sm mb-2">HARMONIX Digital Inc.</p>
                  <p className="text-slate-400 text-sm mb-2">123 AI Innovation Drive</p>
                  <p className="text-slate-400 text-sm mb-2">San Francisco, CA 94105</p>
                  <p className="text-slate-400 text-sm">United States</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="border-slate-600 text-slate-400 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/terms'}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
            >
              View Terms of Service
            </Button>
            
            <Button 
              onClick={() => window.print()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

