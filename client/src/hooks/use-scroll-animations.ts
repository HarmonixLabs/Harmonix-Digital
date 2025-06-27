import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';

// Enhanced scroll hook with parallax and intersection observer
export function useScrollAnimations() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth spring animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Intersection Observer for performance
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return {
    ref,
    isInView,
    scrollYProgress,
    smoothProgress
  };
}

// Parallax transforms for different speeds
export function useParallaxTransforms(progress: MotionValue<number>) {
  const y = useTransform(progress, [0, 1], [0, -50]);
  const yFast = useTransform(progress, [0, 1], [0, -100]);
  const ySlow = useTransform(progress, [0, 1], [0, -25]);
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.8, 1, 1.2]);
  const rotate = useTransform(progress, [0, 1], [0, 360]);

  return {
    y,
    yFast,
    ySlow,
    opacity,
    scale,
    rotate
  };
}

// Stagger animation for lists
export function useStaggerAnimation(itemCount: number, delay = 0.1) {
  const staggerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return { staggerVariants, itemVariants };
}

// Sacred geometry animation patterns
export function useSacredAnimations() {
  const breathingAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const orbitAnimation = {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return {
    breathingAnimation,
    orbitAnimation,
    pulseAnimation,
    floatAnimation,
  };
}

// Page enter/exit animations
export function usePageTransition() {
  const pageEnter = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const slideEnter = {
    initial: {
      x: "100%",
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return { pageEnter, slideEnter };
}