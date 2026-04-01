export function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="neural-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="currentColor" className="text-primary/40" />
          </pattern>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" className="text-primary" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#neural-grid)" />
        
        <g className="text-primary/30">
          <line x1="10%" y1="20%" x2="30%" y2="50%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
          <line x1="30%" y1="50%" x2="50%" y2="30%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
          <line x1="50%" y1="30%" x2="70%" y2="60%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
          <line x1="70%" y1="60%" x2="90%" y2="40%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.4" />
          <line x1="20%" y1="70%" x2="40%" y2="40%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.35" />
          <line x1="40%" y1="40%" x2="60%" y2="70%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.35" />
          <line x1="60%" y1="70%" x2="80%" y2="30%" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.35" />
        </g>
        
        <g>
          <circle cx="30%" cy="50%" r="4" className="fill-primary/50" />
          <circle cx="50%" cy="30%" r="4" className="fill-primary/50" />
          <circle cx="70%" cy="60%" r="4" className="fill-primary/50" />
          <circle cx="40%" cy="40%" r="3" className="fill-secondary/40" />
          <circle cx="60%" cy="70%" r="3" className="fill-secondary/40" />
        </g>
      </svg>
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
    </div>
  );
}
