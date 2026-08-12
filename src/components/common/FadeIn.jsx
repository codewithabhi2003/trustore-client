import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reusable entrance animation for Trustore sections and cards.
 *
 * <FadeIn delay={0.1}>
 *   <YourSection />
 * </FadeIn>
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 16,
  className = '',
  as = 'div',
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0 }
      }
      viewport={{
        once: true,
        margin: '-60px',
      }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.5,
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </Component>
  );
}