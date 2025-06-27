import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxBackgroundProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxBackground({ 
  children, 
  speed = 0.5, 
  className = '' 
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`relative ${className}`}
      data-scroll-container="true"
    >
      {children}
    </motion.div>
  );
}

// Sacred geometric patterns for background
export function SacredGeometryBG() {
  const { scrollYProgress } = useScroll();
  
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [360, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
      {/* Primary sacred circle */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96"
        style={{ rotate: rotate1, scale }}
      >
        <div className="w-full h-full border border-harmonix-gold rounded-full">
          <div className="absolute inset-8 border border-harmonix-sage rounded-full">
            <div className="absolute inset-8 border border-harmonix-cedar rounded-full">
              <div className="absolute inset-8 bg-harmonix-gold/10 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secondary sacred circle */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64"
        style={{ rotate: rotate2, scale }}
      >
        <div className="w-full h-full border border-harmonix-sage rounded-full">
          <div className="absolute inset-6 border border-harmonix-cedar rounded-full">
            <div className="absolute inset-6 bg-harmonix-sage/10 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </div>
  );
}

function FloatingParticle({ index }: { index: number }) {
  const { scrollYProgress } = useScroll();
  
  const x = useTransform(
    scrollYProgress, 
    [0, 1], 
    [Math.random() * 100, Math.random() * 100 + 50]
  );
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [Math.random() * 100, Math.random() * 100 + 100]
  );

  return (
    <motion.div
      className="absolute w-2 h-2 bg-harmonix-gold/20 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        x,
        y,
      }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: index * 0.2,
      }}
    />
  );
}

// Parallax text reveal effect
interface ParallaxTextProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function ParallaxText({ 
  children, 
  speed = 0.3, 
  direction = 'up' 
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [50, -50]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-50, 50]);
      case 'left':
        return [useTransform(scrollYProgress, [0, 1], [50, -50]), 0];
      case 'right':
        return [useTransform(scrollYProgress, [0, 1], [-50, 50]), 0];
      default:
        return useTransform(scrollYProgress, [0, 1], [50, -50]);
    }
  };

  const transform = getTransform();
  const y = direction === 'up' || direction === 'down' ? transform : 0;
  const x = direction === 'left' || direction === 'right' ? (transform as any)[0] : 0;

  return (
    <motion.div
      ref={ref}
      style={{ 
        y: y as any, 
        x: x as any 
      }}
    >
      {children}
    </motion.div>
  );
}