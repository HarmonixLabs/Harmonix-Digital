import { motion } from 'framer-motion';
import { PageWrapper, pageStagger, pageItem, sacredCardVariants } from '@/components/transitions/page-wrapper';
import { ParallaxText, ParallaxBackground } from '@/components/transitions/parallax-background';
import { useScrollAnimations, useParallaxTransforms, useSacredAnimations } from '@/hooks/use-scroll-animations';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Users, Star, ArrowRight, Sparkles, Target, Globe } from 'lucide-react';

export default function TransitionsDemo() {
  const { ref, isInView, smoothProgress } = useScrollAnimations();
  const { y, yFast, ySlow, opacity, scale } = useParallaxTransforms(smoothProgress);
  const { breathingAnimation, orbitAnimation, pulseAnimation, floatAnimation } = useSacredAnimations();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced neural networks that learn and adapt to your business needs",
      color: "text-harmonix-gold"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant responses and real-time processing for maximum efficiency",
      color: "text-harmonix-sage"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless integration with your existing workflow and team",
      color: "text-harmonix-cedar"
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Enterprise-grade reliability with 99.9% uptime guarantee",
      color: "text-harmonix-gold"
    }
  ];

  return (
    <PageWrapper enableParallax={true} enableGeometry={true}>
      <div className="min-h-screen bg-harmonix-black">
        <Navbar />
        
        {/* Hero Section with Parallax */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{ y: yFast }}
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-harmonix-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-harmonix-sage/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto px-4"
            variants={pageStagger}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={pageItem}
              className="mb-8"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-harmonix-gold to-harmonix-sage bg-clip-text text-transparent"
                animate={breathingAnimation}
              >
                Page Transitions
              </motion.h1>
            </motion.div>

            <motion.div variants={pageItem}>
              <ParallaxText direction="up" speed={0.2}>
                <p className="text-xl md:text-2xl text-harmonix-sage mb-8 leading-relaxed">
                  Experience smooth page transitions with subtle parallax effects
                  <br />
                  that enhance the sacred design aesthetic
                </p>
              </ParallaxText>
            </motion.div>

            <motion.div variants={pageItem} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90">
                  Experience Magic
                  <motion.div className="ml-2" animate={floatAnimation}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="border-harmonix-sage text-harmonix-sage hover:bg-harmonix-sage/10">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Floating Sacred Elements */}
            <motion.div
              className="absolute -top-20 -left-20 w-40 h-40 border border-harmonix-gold/30 rounded-full"
              animate={orbitAnimation}
            />
            <motion.div
              className="absolute -bottom-20 -right-20 w-32 h-32 border border-harmonix-sage/30 rounded-full"
              animate={pulseAnimation}
            />
          </motion.div>
        </section>

        {/* Features Section with Stagger Animation */}
        <section ref={ref} className="py-20 relative">
          <ParallaxBackground speed={0.3}>
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-harmonix-gold mb-4">
                  Sacred Features
                </h2>
                <p className="text-xl text-harmonix-sage max-w-2xl mx-auto">
                  Discover the power of intelligent automation with our enhanced transition system
                </p>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={pageStagger}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={sacredCardVariants}
                    whileHover="hover"
                    className="h-full"
                  >
                    <Card className="h-full bg-harmonix-deep-forest/50 border-harmonix-sage/30 backdrop-blur-sm">
                      <CardHeader>
                        <motion.div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br from-harmonix-gold/20 to-harmonix-sage/20 flex items-center justify-center mb-4`}
                          animate={pulseAnimation}
                        >
                          <feature.icon className={`w-6 h-6 ${feature.color}`} />
                        </motion.div>
                        <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-harmonix-sage leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </ParallaxBackground>
        </section>

        {/* Parallax Text Section */}
        <section className="py-20 relative overflow-hidden">
          <motion.div style={{ y: ySlow, opacity, scale }}>
            <div className="max-w-4xl mx-auto text-center px-4">
              <ParallaxText direction="left" speed={0.4}>
                <h3 className="text-3xl md:text-4xl font-bold text-harmonix-gold mb-6">
                  Smooth as Sacred Geometry
                </h3>
              </ParallaxText>
              
              <ParallaxText direction="right" speed={0.3}>
                <p className="text-lg text-harmonix-sage leading-relaxed">
                  Every transition is crafted with the precision of sacred mathematics,
                  creating a harmonious flow that guides users through their journey
                  with the platform's divine intelligence.
                </p>
              </ParallaxText>
            </div>
          </motion.div>
        </section>

        {/* Call to Action with Sacred Animation */}
        <section className="py-20 bg-gradient-to-r from-harmonix-deep-forest to-harmonix-cedar">
          <motion.div
            className="max-w-4xl mx-auto text-center px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div className="mb-8" animate={breathingAnimation}>
              <Globe className="w-16 h-16 text-harmonix-gold mx-auto mb-4" />
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Future?
            </h3>
            
            <p className="text-xl text-harmonix-sage mb-8">
              Join the revolution of intelligent automation with sacred design principles
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 px-8 py-3 text-lg"
              >
                <Target className="mr-2 w-5 h-5" />
                Get Started Now
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}