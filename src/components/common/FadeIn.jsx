import { motion } from 'framer-motion';

/**
 * Wraps any content in a fade + slide-up entrance animation that triggers once, the
 * first time it scrolls into view. Drop this around a section/card anywhere in the app
 * instead of a plain <div> to get consistent, subtle motion without repeating the same
 * animation setup everywhere.
 *
 * <FadeIn delay={0.1}><YourSection /></FadeIn>
 */
export default function FadeIn({ children, delay = 0, y = 16, className = '', as = 'div' }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </Component>
  );
}