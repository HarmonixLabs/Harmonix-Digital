import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Layers, Shield } from 'lucide-react';

const HeroLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-navy to-charcoal-deep relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <g fill="#D4AF37">
                <path d="M8 6 L12 10 L8 14 L4 10 Z" opacity="0.9" />
                <path d="M16 6 L20 10 L16 14 L12 10 Z" opacity="0.8" />
                <path d="M24 6 L28 10 L24 14 L20 10 Z" opacity="0.7" />
                <path d="M12 14 L16 18 L12 22 L8 18 Z" opacity="0.8" />
                <path d="M20 14 L24 18 L20 22 L16 18 Z" opacity="0.9" />
                <path d="M16 22 L20 26 L16 30 L12 26 Z" opacity="0.8" />
              </g>
            </svg>
          </div>
          <span className="text-xl font-semibold text-golden-primary tracking-wide">
            HARMONIX
          </span>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          className="hidden md:flex items-center space-x-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="#platform" className="text-warm-white hover:text-golden-primary transition-colors">
            Platform
          </a>
          <a href="#marketplace" className="text-warm-white hover:text-golden-primary transition-colors">
            Marketplace
          </a>
          <a href="#about" className="text-warm-white hover:text-golden-primary transition-colors">
            About
          </a>
        </motion.div>

        {/* Sign In Button */}
        <motion.button
          className="px-6 py-2 border border-golden-primary/30 rounded-full text-warm-white hover:bg-golden-primary/10 transition-all duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Sign in
        </motion.button>
      </nav>

      {/* Main Hero Content */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <motion.h1
                className="text-5xl lg:text-6xl font-playfair text-golden-primary leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                The elite, AI automation platform
              </motion.h1>
              
              <motion.p
                className="text-xl text-warm-white/90 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Transform your business with advanced AI agents
              </motion.p>

              <motion.button
                className="px-8 py-4 bg-golden-primary text-deep-navy font-semibold rounded-lg hover:bg-golden-light transition-all duration-300 shadow-lg hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>

            {/* Right Content - SŌL Brain Visualization */}
            <motion.div
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className="relative">
                {/* Central Figure */}
                <div className="relative z-10">
                  <svg viewBox="0 0 300 400" className="w-64 h-80 lg:w-72 lg:h-96">
                    {/* Head outline */}
                    <path
                      d="M150 50 C120 50, 100 70, 100 100 L100 160 C100 190, 120 210, 150 210 C180 210, 200 190, 200 160 L200 100 C200 70, 180 50, 150 50 Z"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Glowing eyes */}
                    <circle cx="130" cy="120" r="4" fill="#F4E4BC" className="animate-pulse" />
                    <circle cx="170" cy="120" r="4" fill="#F4E4BC" className="animate-pulse" />
                    
                    {/* Lotus on forehead */}
                    <g transform="translate(150, 90)">
                      <path d="M0 -8 L4 0 L0 8 L-4 0 Z" fill="#D4AF37" opacity="0.9" />
                      <path d="M8 -4 L4 4 L-8 4 L-4 -4 Z" fill="#D4AF37" opacity="0.8" />
                      <path d="M4 -8 L8 0 L4 8 L0 0 Z" fill="#D4AF37" opacity="0.7" />
                      <path d="M-4 -8 L0 0 L-4 8 L-8 0 Z" fill="#D4AF37" opacity="0.7" />
                    </g>
                    
                    {/* Body outline */}
                    <path
                      d="M150 210 L150 220 C150 230, 145 240, 140 250 L110 350 C105 360, 115 370, 125 365 L150 350 L175 365 C185 370, 195 360, 190 350 L160 250 C155 240, 150 230, 150 220 Z"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      fill="none"
                    />
                    
                    {/* Circuit patterns */}
                    <g stroke="#D4AF37" strokeWidth="1" opacity="0.6">
                      <line x1="150" y1="220" x2="150" y2="250" />
                      <line x1="140" y1="230" x2="160" y2="230" />
                      <line x1="135" y1="240" x2="165" y2="240" />
                      <circle cx="140" cy="240" r="2" fill="#D4AF37" />
                      <circle cx="160" cy="240" r="2" fill="#D4AF37" />
                    </g>
                    
                    {/* Chest lotus */}
                    <g transform="translate(150, 280)">
                      <path d="M0 -6 L3 0 L0 6 L-3 0 Z" fill="#D4AF37" opacity="0.9" />
                      <path d="M6 -3 L3 3 L-6 3 L-3 -3 Z" fill="#D4AF37" opacity="0.8" />
                      <path d="M3 -6 L6 0 L3 6 L0 0 Z" fill="#D4AF37" opacity="0.7" />
                      <path d="M-3 -6 L0 0 L-3 6 L-6 0 Z" fill="#D4AF37" opacity="0.7" />
                    </g>
                  </svg>
                </div>

                {/* Orbital rings */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full border border-golden-primary/30 relative">
                    {/* Orbital points */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                      <motion.div
                        key={angle}
                        className="absolute w-3 h-3 bg-golden-primary rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `
                            translate(-50%, -50%) 
                            rotate(${angle}deg) 
                            translateY(-${160 + (index % 2) * 20}px)
                          `,
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-20 lg:mt-32"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {[
              {
                icon: Monitor,
                title: "The Platform",
                description: "Manage your AI agents from a single dashboard",
              },
              {
                icon: Layers,
                title: "Agent Marketplace",
                description: "Browse and deploy AI agents to serve your needs",
              },
              {
                icon: Shield,
                title: "Harmony Token",
                description: "Recharge your AI agents with our stable token",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center space-y-4"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 mx-auto border border-golden-primary/30 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-golden-primary" />
                </div>
                <h3 className="text-xl font-semibold text-warm-white">
                  {feature.title}
                </h3>
                <p className="text-warm-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-golden-primary/5 to-transparent"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default HeroLanding;