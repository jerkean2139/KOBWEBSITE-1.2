import { useState, useRef, useEffect } from "react";

const logos = [
  { src: "/zapier-logo.png", alt: "Zapier - Automation platform" },
  { src: "/make-logo.png", alt: "Make.com - Visual automation" },
  { src: "/n8n-logo.png", alt: "n8n - Workflow automation" },
  { src: "/replit-logo.png", alt: "Replit - Cloud development" },
  { src: "/gohighlevel-logo.webp", alt: "GoHighLevel - Marketing automation platform" },
  { src: "/chatgpt-logo.png", alt: "ChatGPT - OpenAI" },
  { src: "/claude-logo.png", alt: "Claude AI - Anthropic" },
];

export default function LogoCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div 
        ref={scrollRef}
        className="flex gap-12 overflow-x-hidden py-4"
        style={{ scrollBehavior: 'auto' }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <div 
            key={index}
            className="flex-shrink-0 flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
          >
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="h-12 w-auto max-w-[120px] object-contain" 
              loading="lazy" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
