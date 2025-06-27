import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Shield, 
  Users, 
  Bot,
  CreditCard,
  Globe,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Download
} from 'lucide-react';

const TermsOfServicePage = () => {
  const [acceptedSections, setAcceptedSections] = useState({
    general: false,
    agents: false,
    billing: false,
    privacy: false,
    sms: false
  });
  const [showConsent, setShowConsent] = useState(false);
  const [allAccepted, setAllAccepted] = useState(false);

  const handleSectionAccept = (section) => {
    const newAccepted = { ...acceptedSections, [section]: !acceptedSections[section] };
    setAcceptedSections(newAccepted);
    
    const allSectionsAccepted = Object.values(newAccepted).every(accepted => accepted);
    setAllAccepted(allSectionsAccepted);
  };

  const handleAcceptAll = () => {
    if (allAccepted) {
      // Redirect to dashboard or continue with signup
      window.location.href = '/dashboard';
    } else {
      setShowConsent(true);
    }
  };

  const sections = [
    {
      id: 'general',
      title: 'General Terms & Conditions',
      icon: <FileText className="h-5 w-5" />,
      description: 'Platform usage, account responsibilities, and service availability',
      content: `
        **1. ACCEPTANCE OF TERMS**
        By accessing and using the HARMONIX platform, you accept and agree to be bound by the terms and provision of this agreement.

        **2. PLATFORM DESCRIPTION**
        HARMONIX is an AI automation platform that provides intelligent agents for business process automation, including but not limited to sales, marketing, customer service, and operational tasks.

        **3. USER ACCOUNTS**
        - You must provide accurate and complete information when creating an account
        - You are responsible for maintaining the confidentiality of your account credentials
        - You must notify us immediately of any unauthorized use of your account
        - One person or legal entity may not maintain more than one account

        **4. ACCEPTABLE USE**
        You agree not to use the platform to:
        - Violate any applicable laws or regulations
        - Infringe on intellectual property rights
        - Transmit harmful, offensive, or illegal content
        - Attempt to gain unauthorized access to our systems
        - Use the service for competitive analysis or reverse engineering

        **5. SERVICE AVAILABILITY**
        - We strive for 99.9% uptime but cannot guarantee uninterrupted service
        - Scheduled maintenance will be announced in advance when possible
        - We reserve the right to modify or discontinue features with notice

        **6. INTELLECTUAL PROPERTY**
        - HARMONIX retains all rights to the platform and its technology
        - You retain rights to your data and content
        - You grant us license to use your data to provide and improve our services
        - Agent configurations you create remain your intellectual property

        **7. LIMITATION OF LIABILITY**
        HARMONIX shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.

        **8. TERMINATION**
        Either party may terminate this agreement at any time. Upon termination, your access will be revoked and data may be deleted according to our retention policy.
      `
    },
    {
      id: 'agents',
      title: 'AI Agent Terms',
      icon: <Bot className="h-5 w-5" />,
      description: 'AI agent behavior, limitations, and user responsibilities',
      content: `
        **1. AI AGENT FUNCTIONALITY**
        Our AI agents are designed to automate business processes and provide intelligent assistance. They operate based on:
        - Pre-trained models and algorithms
        - User-provided configurations and prompts
        - Real-time data and context
        - Continuous learning and improvement

        **2. AGENT LIMITATIONS**
        - AI agents may not always provide perfect or complete responses
        - Agents should not be used for critical decisions without human oversight
        - Performance may vary based on data quality and configuration
        - Agents cannot replace human judgment in complex situations

        **3. USER RESPONSIBILITIES**
        - Provide accurate and appropriate training data
        - Monitor agent performance and outputs
        - Ensure agent actions comply with applicable laws
        - Report any inappropriate or harmful agent behavior
        - Maintain appropriate human oversight for critical processes

        **4. THREAD INHERITANCE & CONTEXT**
        - Agents maintain conversation context across sessions
        - Context data is stored securely and used to improve responses
        - You can request context deletion at any time
        - Context sharing between agents requires explicit permission

        **5. AGENT MARKETPLACE**
        - Pre-built agents are provided "as-is" with no warranties
        - Custom agents can be shared with other users at your discretion
        - Revenue sharing applies to agents sold in the marketplace
        - We reserve the right to remove agents that violate our policies

        **6. DATA PROCESSING**
        - Agents process data according to your instructions
        - We implement security measures to protect data during processing
        - Agent outputs may be used to improve our services (anonymized)
        - You control what data agents can access and process

        **7. COMPLIANCE**
        - Agents must comply with applicable regulations (GDPR, CCPA, etc.)
        - Industry-specific compliance is your responsibility
        - We provide tools to help maintain compliance
        - Regular compliance audits may be required for enterprise accounts
      `
    },
    {
      id: 'billing',
      title: 'Billing & Subscription Terms',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Payment terms, subscription management, and refund policies',
      content: `
        **1. SUBSCRIPTION PLANS**
        - Basic Plan: $4,400/month - Access to all agents
        - Pro Plan: $8,000/month - Expanded quotas & support
        - Enterprise Plan: $15,300/month - Custom automation solutions
        - All prices are in USD and exclude applicable taxes

        **2. BILLING CYCLE**
        - Subscriptions are billed monthly in advance
        - Billing date is based on your initial subscription date
        - Usage overages are billed in the following cycle
        - Annual subscriptions receive a 10% discount

        **3. PAYMENT TERMS**
        - Payment is due immediately upon subscription
        - We accept major credit cards and ACH transfers
        - Failed payments may result in service suspension
        - Late fees may apply to overdue accounts

        **4. HARMONY TOKENS**
        - Tokens are used to measure agent usage and API calls
        - Token packages can be purchased separately
        - Unused tokens roll over for up to 12 months
        - Token pricing varies by usage volume

        **5. REFUND POLICY**
        - First-time subscribers: 30-day money-back guarantee
        - Annual subscriptions: Pro-rated refunds within 60 days
        - No refunds for used tokens or custom development
        - Refunds processed within 5-10 business days

        **6. SUBSCRIPTION CHANGES**
        - Upgrades take effect immediately with pro-rated billing
        - Downgrades take effect at the next billing cycle
        - Cancellations can be made at any time
        - Data retention period: 90 days after cancellation

        **7. ENTERPRISE BILLING**
        - Custom pricing available for large organizations
        - Net 30 payment terms for qualified accounts
        - Volume discounts for multi-year commitments
        - Dedicated account management included

        **8. TAXES**
        - Prices exclude applicable sales tax, VAT, or GST
        - Tax rates determined by billing address
        - Tax-exempt organizations must provide documentation
        - International customers responsible for local taxes
      `
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Shield className="h-5 w-5" />,
      description: 'Data collection, usage, storage, and user privacy rights',
      content: `
        **1. INFORMATION WE COLLECT**
        - Account information: name, email, company details
        - Usage data: feature usage, performance metrics, error logs
        - Agent data: configurations, prompts, training data
        - Communication data: support tickets, feedback, surveys
        - Technical data: IP address, browser type, device information

        **2. HOW WE USE YOUR INFORMATION**
        - Provide and improve our services
        - Process payments and manage subscriptions
        - Send important service notifications
        - Provide customer support
        - Analyze usage patterns and optimize performance
        - Comply with legal obligations

        **3. DATA SHARING**
        We do not sell your personal information. We may share data with:
        - Service providers (hosting, payment processing, analytics)
        - Legal authorities when required by law
        - Business partners with your explicit consent
        - Acquirers in case of merger or acquisition (with notice)

        **4. DATA SECURITY**
        - End-to-end encryption for data in transit
        - AES-256 encryption for data at rest
        - Regular security audits and penetration testing
        - SOC 2 Type II compliance
        - Multi-factor authentication required for admin access

        **5. DATA RETENTION**
        - Account data: Retained while account is active + 90 days
        - Usage data: Retained for 24 months for analytics
        - Agent data: Retained per your configuration settings
        - Support data: Retained for 7 years for legal compliance
        - Backup data: Retained for 30 days for disaster recovery

        **6. YOUR RIGHTS**
        - Access: Request copies of your personal data
        - Rectification: Correct inaccurate or incomplete data
        - Erasure: Request deletion of your personal data
        - Portability: Export your data in machine-readable format
        - Restriction: Limit how we process your data
        - Objection: Opt-out of certain data processing activities

        **7. INTERNATIONAL TRANSFERS**
        - Data may be processed in the US and EU
        - Adequate protection measures in place for all transfers
        - Standard Contractual Clauses used where applicable
        - Data Processing Agreements available for enterprise customers

        **8. COOKIES & TRACKING**
        - Essential cookies for platform functionality
        - Analytics cookies to improve user experience
        - Marketing cookies with your consent
        - Cookie preferences can be managed in settings
      `
    },
    {
      id: 'sms',
      title: 'SMS & Communication Terms',
      icon: <Globe className="h-5 w-5" />,
      description: 'SMS consent, communication preferences, and opt-out procedures',
      content: `
        **1. SMS CONSENT**
        By providing your phone number, you consent to receive SMS messages from HARMONIX including:
        - Account verification codes
        - Security alerts and notifications
        - Service updates and maintenance notices
        - Billing and payment reminders
        - Marketing messages (with separate opt-in)

        **2. MESSAGE FREQUENCY**
        - Transactional messages: As needed for account security
        - Service notifications: 1-2 per month on average
        - Marketing messages: Up to 4 per month (opt-in required)
        - Emergency alerts: Rare, only for critical service issues

        **3. OPT-OUT PROCEDURES**
        - Reply STOP to any message to unsubscribe from all SMS
        - Reply HELP for assistance and customer support
        - Manage preferences in your account settings
        - Contact support for immediate opt-out assistance
        - Opt-out confirmation will be sent within 24 hours

        **4. MESSAGE CHARGES**
        - Standard message and data rates apply
        - HARMONIX does not charge for SMS messages
        - Contact your carrier for rate information
        - International messaging rates may vary

        **5. SUPPORTED CARRIERS**
        Compatible with all major US carriers including:
        - Verizon, AT&T, T-Mobile, Sprint
        - Regional and prepaid carriers
        - Some international carriers (limited)
        - VoIP and virtual numbers may not be supported

        **6. EMAIL COMMUNICATIONS**
        - Account-related emails cannot be unsubscribed
        - Marketing emails include unsubscribe links
        - Newsletter subscriptions are separate opt-ins
        - Transactional emails are required for service operation

        **7. COMMUNICATION PREFERENCES**
        You can control:
        - Which types of notifications you receive
        - Preferred communication channels (email, SMS, in-app)
        - Frequency of non-essential communications
        - Language and timezone preferences

        **8. THIRD-PARTY INTEGRATIONS**
        - Agent communications through integrated platforms
        - Webhook notifications to your systems
        - API-based communication triggers
        - Compliance with platform-specific terms (Slack, Teams, etc.)

        **9. EMERGENCY COMMUNICATIONS**
        - Critical security alerts cannot be disabled
        - Service outage notifications for active users
        - Data breach notifications as required by law
        - Account suspension or termination notices
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
              <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/30">
                <FileText className="h-16 w-16 text-emerald-400" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Please review and accept our terms to continue using HARMONIX. 
              These terms govern your use of our AI automation platform.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="outline" className="border-emerald-600 text-emerald-400">
                Last Updated: December 2024
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6 mb-12">
            {sections.map((section) => (
              <Card key={section.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-600 rounded-lg text-white">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-white">{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {acceptedSections[section.id] && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <Checkbox
                        checked={acceptedSections[section.id]}
                        onCheckedChange={() => handleSectionAccept(section.id)}
                        className="border-emerald-600 data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-line text-slate-300 text-sm leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Consent Summary */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Consent Summary
              </CardTitle>
              <CardDescription>
                Review what you're agreeing to by accepting these terms
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">You agree to:</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>• Use HARMONIX responsibly and legally</li>
                    <li>• Provide accurate account information</li>
                    <li>• Pay subscription fees on time</li>
                    <li>• Monitor AI agent outputs</li>
                    <li>• Comply with data protection laws</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">We commit to:</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>• Protect your data with enterprise security</li>
                    <li>• Provide reliable AI automation services</li>
                    <li>• Respect your privacy and data rights</li>
                    <li>• Offer transparent billing and pricing</li>
                    <li>• Support you with dedicated assistance</li>
                  </ul>
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
              onClick={handleAcceptAll}
              disabled={!allAccepted}
              className={`${
                allAccepted 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {allAccepted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept All Terms & Continue
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Please Accept All Sections
                </>
              )}
            </Button>
          </div>

          {/* Legal Notice */}
          <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <p className="text-sm text-slate-400 text-center">
              By clicking "Accept All Terms & Continue", you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service. If you do not agree 
              to these terms, please do not use the HARMONIX platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

