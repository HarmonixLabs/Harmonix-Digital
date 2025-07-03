import { useState } from "react";
import { Container, Section, Grid } from "@/components/layout";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { 
  ValidatedInput, 
  ValidatedTextarea, 
  FormSuccess, 
  FormLoading,
  useFormValidation,
  emailSchema,
  nameSchema,
  messageSchema
} from "@/components/forms/validation";
import { HealthStatusIndicator } from "@/components/self-healing/status-indicator";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Zap, 
  Shield, 
  CheckCircle,
  Activity,
  Code,
  Layout,
  FormInput
} from "lucide-react";
import { z } from "zod";

// Form schema
const demoFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema
});

type DemoFormData = z.infer<typeof demoFormSchema>;

export default function InteractiveDemo() {
  const [formData, setFormData] = useState<DemoFormData>({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validation = useFormValidation(demoFormSchema, formData);

  const handleInputChange = (field: keyof DemoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validation.validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.validateAll()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const features = [
    {
      icon: Layout,
      title: "Responsive Layout",
      description: "8px baseline grid system with standardized containers",
      status: "active"
    },
    {
      icon: FormInput,
      title: "Form Validation",
      description: "Real-time validation with animated feedback",
      status: "active"
    },
    {
      icon: Shield,
      title: "Self-Healing",
      description: "Automated issue detection and recovery",
      status: "active"
    },
    {
      icon: Activity,
      title: "System Health",
      description: "Real-time monitoring with visual indicators",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <Section spacing="lg">
        <Container>
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
              Interactive Demo
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">
              Platform Features Showcase
            </h1>
            <p className="text-xl text-harmonix-sage-fade max-w-2xl mx-auto">
              Experience the enhanced UI/UX features, form validation, and self-healing capabilities
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">
              Implemented Features
            </h2>
            <Grid cols={{ mobile: 1, sm: 2, lg: 4 }} gap="md">
              {features.map((feature, index) => (
                <AnimatedCard key={index} variant="shimmer">
                  <Card className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20 h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-harmonix-regal-gold/20">
                          <feature.icon className="w-5 h-5 text-harmonix-regal-gold" />
                        </div>
                        <CardTitle className="text-lg text-white">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-harmonix-sage-fade mb-3">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">
                          {feature.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </Grid>
          </div>

          {/* Form Validation Demo */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">
              Form Validation Demo
            </h2>
            <Container size="sm">
              <Card className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20">
                <CardHeader>
                  <CardTitle className="text-white">Try the Enhanced Form</CardTitle>
                  <p className="text-sm text-harmonix-sage-fade">
                    Real-time validation with animated feedback
                  </p>
                </CardHeader>
                <CardContent>
                  {submitSuccess ? (
                    <FormSuccess message="Form submitted successfully! This demonstrates the validation system." />
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <ValidatedInput
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onBlur={() => validation.touchField('name')}
                        error={validation.errors.name}
                        touched={validation.touched.name}
                        required
                      />

                      <ValidatedInput
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => validation.touchField('email')}
                        error={validation.errors.email}
                        touched={validation.touched.email}
                        required
                      />

                      <ValidatedTextarea
                        name="message"
                        placeholder="Your Message (min 10 characters)"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        onBlur={() => validation.touchField('message')}
                        error={validation.errors.message}
                        touched={validation.touched.message}
                        rows={4}
                      />

                      <AnimatedButton
                        type="submit"
                        disabled={isSubmitting || !validation.isValid}
                        variant="shimmer"
                        className="w-full bg-harmonix-regal-gold hover:bg-harmonix-gold-bright text-harmonix-deep-forest font-semibold"
                      >
                        {isSubmitting ? (
                          <FormLoading message="Processing..." />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Submit Demo Form
                          </>
                        )}
                      </AnimatedButton>
                    </form>
                  )}
                </CardContent>
              </Card>
            </Container>
          </div>

          {/* Responsive Layout Demo */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">
              Responsive Layout System
            </h2>
            <div className="space-y-4">
              <Card className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-harmonix-deep-forest/50 rounded-lg">
                    <h4 className="font-semibold text-harmonix-regal-gold mb-2">Mobile</h4>
                    <p className="text-sm text-harmonix-sage-fade">320-767px</p>
                  </div>
                  <div className="p-4 bg-harmonix-deep-forest/50 rounded-lg">
                    <h4 className="font-semibold text-harmonix-regal-gold mb-2">Tablet</h4>
                    <p className="text-sm text-harmonix-sage-fade">768-1199px</p>
                  </div>
                  <div className="p-4 bg-harmonix-deep-forest/50 rounded-lg">
                    <h4 className="font-semibold text-harmonix-regal-gold mb-2">Desktop</h4>
                    <p className="text-sm text-harmonix-sage-fade">1200px+</p>
                  </div>
                </div>
                <p className="text-sm text-harmonix-sage-fade">
                  Resize your browser to see responsive behavior. All spacing follows the 8px baseline grid.
                </p>
              </Card>
            </div>
          </div>

          {/* Self-Healing Demo */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">
              Self-Healing System
            </h2>
            <Container size="sm">
              <Card className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Active Monitoring</h3>
                      <p className="text-sm text-harmonix-sage-fade">
                        Self-healing system is monitoring platform health
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-harmonix-sage-fade">Form validation auto-enhancement</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-harmonix-sage-fade">Layout overflow detection</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-harmonix-sage-fade">Touch target optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-harmonix-sage-fade">WebSocket reconnection</span>
                    </div>
                  </div>
                  <p className="text-xs text-harmonix-sage-fade mt-4">
                    Check the floating indicator in the bottom-right corner for real-time status
                  </p>
                </CardContent>
              </Card>
            </Container>
          </div>

          {/* Interactive Elements */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-8 text-center">
              Interactive UI Elements
            </h2>
            <Grid cols={{ mobile: 1, sm: 2, lg: 3 }} gap="md">
              <div className="space-y-4">
                <h4 className="font-medium text-harmonix-regal-gold">Animated Buttons</h4>
                <AnimatedButton variant="shimmer">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Shimmer Effect
                </AnimatedButton>
                <AnimatedButton variant="glow">
                  <Zap className="w-4 h-4 mr-2" />
                  Glow Effect
                </AnimatedButton>
                <AnimatedButton variant="ripple">
                  <Activity className="w-4 h-4 mr-2" />
                  Ripple Effect
                </AnimatedButton>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-harmonix-regal-gold">Card Animations</h4>
                <AnimatedCard variant="float">
                  <Card className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20 p-4">
                    <p className="text-sm text-white">Floating Card</p>
                  </Card>
                </AnimatedCard>
                <AnimatedCard variant="breathe">
                  <Card className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20 p-4">
                    <p className="text-sm text-white">Breathing Card</p>
                  </Card>
                </AnimatedCard>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-harmonix-regal-gold">Status Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-500/20 text-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-500">
                    <Activity className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                  <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold">
                    <Code className="w-3 h-3 mr-1" />
                    Enhanced
                  </Badge>
                </div>
              </div>
            </Grid>
          </div>
        </Container>
      </Section>

      <Footer />
      
      {/* Floating Health Indicator */}
      <HealthStatusIndicator position="bottom-right" />
    </div>
  );
}