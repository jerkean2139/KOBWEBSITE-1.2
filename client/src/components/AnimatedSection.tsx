import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  className?: string;
}

export function AnimatedSection({ 
  children, 
  animation = 'fade-in', 
  delay = 0,
  className = '' 
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05, rootMargin: '50px' });
  
  const animationClass = `scroll-${animation}`;
  const delayClass = delay > 0 ? `stagger-${delay}` : '';
  
  return (
    <div 
      ref={ref} 
      className={`${animationClass} ${delayClass} ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
