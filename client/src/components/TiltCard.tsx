import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderGradient?: string;
  hoverBg?: string;
}

export function TiltCard({ 
  children, 
  className = "",
  borderGradient = "from-primary via-secondary to-primary",
  hoverBg = "group-hover:bg-[#0f172a]"
}: TiltCardProps) {
  return (
    <div className="relative group">
      <div 
        className={cn(
          "absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-sm",
          `bg-gradient-to-r ${borderGradient}`
        )}
      />
      
      <div
        className={cn(
          "relative rounded-2xl transition-all duration-300 ease-out",
          "backdrop-blur-xl bg-[#0a0a1a] border border-white/10",
          "shadow-xl shadow-black/20",
          "group-hover:border-[#FFD700]/40",
          hoverBg,
          className
        )}
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
