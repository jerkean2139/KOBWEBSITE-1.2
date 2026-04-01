import { useRef, useCallback } from 'react';

interface TiltOptions {
  max?: number;
  scale?: number;
  speed?: number;
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const { max = 10, scale = 1.02, speed = 400 } = options;
  const ref = useRef<T>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -max;
    const rotateY = ((x - centerX) / centerX) * max;
    
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    ref.current.style.transition = `transform ${speed / 4}ms ease-out`;
  }, [max, scale, speed]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    ref.current.style.transition = `transform ${speed}ms ease-out`;
  }, [speed]);

  return {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}
