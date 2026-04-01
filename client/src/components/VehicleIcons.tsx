interface IconProps {
  className?: string;
  size?: number;
}

export function DIYIcon({ className = "", size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="carBodyDIY" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="glowDIY" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <ellipse cx="40" cy="58" rx="30" ry="4" fill="url(#glowDIY)" opacity="0.5" />
      
      <path d="M12 38 L20 28 L60 28 L68 38 L68 48 L12 48 Z" fill="url(#carBodyDIY)" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M22 28 L26 20 L54 20 L58 28" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="24" y="20" width="32" height="8" rx="2" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="0.5" />
      
      <rect x="26" y="22" width="10" height="5" rx="1" fill="#0f172a" stroke="#60a5fa" strokeWidth="0.5" opacity="0.8" />
      <rect x="44" y="22" width="10" height="5" rx="1" fill="#0f172a" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4" />
      
      <circle cx="22" cy="52" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="22" cy="52" r="4" fill="#0f172a" />
      <circle cx="22" cy="52" r="2" fill="#334155" />
      
      <circle cx="58" cy="52" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="58" cy="52" r="4" fill="#0f172a" />
      <circle cx="58" cy="52" r="2" fill="#334155" />
      
      <g filter="url(#glow)">
        <circle cx="31" cy="34" r="6" fill="#3b82f6" />
        <circle cx="31" cy="31" r="3" fill="#60a5fa" />
        <rect x="28" y="34" width="6" height="8" rx="2" fill="#3b82f6" />
        <circle cx="29" cy="38" r="1.5" fill="#1e40af" />
        <circle cx="33" cy="38" r="1.5" fill="#1e40af" />
      </g>
      
      <g opacity="0.3">
        <circle cx="49" cy="36" r="4" fill="#64748b" />
        <circle cx="49" cy="34" r="2" fill="#94a3b8" />
      </g>
      
      <rect x="26" y="40" width="8" height="3" rx="1" fill="#0f172a" opacity="0.6" />
      <circle cx="28" cy="41.5" r="0.8" fill="#22c55e"  />
      <circle cx="31" cy="41.5" r="0.8" fill="#3b82f6" />
      
      <text x="31" y="14" fontSize="7" fontWeight="bold" fill="#3b82f6" textAnchor="middle" className="uppercase">You Drive</text>
    </svg>
  );
}

export function DWYIcon({ className = "", size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="carBodyDWY" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="glowDWY" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="aiGlowDWY" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="glowGold">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <ellipse cx="40" cy="58" rx="30" ry="4" fill="url(#glowDWY)" opacity="0.5" />
      
      <path d="M12 38 L20 28 L60 28 L68 38 L68 48 L12 48 Z" fill="url(#carBodyDWY)" stroke="#fbbf24" strokeWidth="1.5" />
      <path d="M22 28 L26 20 L54 20 L58 28" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
      <rect x="24" y="20" width="32" height="8" rx="2" fill="#1e3a5f" stroke="#fbbf24" strokeWidth="0.5" />
      
      <rect x="26" y="22" width="10" height="5" rx="1" fill="#0f172a" stroke="#fbbf24" strokeWidth="0.5" opacity="0.8" />
      <rect x="44" y="22" width="10" height="5" rx="1" fill="#0f172a" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.8" />
      
      <circle cx="22" cy="52" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="22" cy="52" r="4" fill="#0f172a" />
      <circle cx="22" cy="52" r="2" fill="#334155" />
      
      <circle cx="58" cy="52" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="58" cy="52" r="4" fill="#0f172a" />
      <circle cx="58" cy="52" r="2" fill="#334155" />
      
      <g filter="url(#glowGold)">
        <circle cx="28" cy="34" r="6" fill="#fbbf24" />
        <circle cx="28" cy="31" r="3" fill="#fde68a" />
        <rect x="25" y="34" width="6" height="8" rx="2" fill="#fbbf24" />
        <circle cx="26" cy="38" r="1.5" fill="#b45309" />
        <circle cx="30" cy="38" r="1.5" fill="#b45309" />
      </g>
      
      <g filter="url(#glowGold)">
        <circle cx="49" cy="34" r="5" fill="url(#aiGlowDWY)" />
        <circle cx="49" cy="32" r="2.5" fill="#a78bfa" />
        <rect x="46.5" y="34" width="5" height="7" rx="1.5" fill="url(#aiGlowDWY)" />
        <rect x="47" y="36" width="4" height="2" rx="0.5" fill="#c4b5fd" opacity="0.6" />
        <circle cx="48" cy="39" r="1" fill="#4c1d95" />
        <circle cx="50" cy="39" r="1" fill="#4c1d95" />
      </g>
      
      <path d="M36 36 L42 36" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 1" opacity="0.6" />
      <circle cx="39" cy="36" r="1" fill="#fbbf24"  />
      
      <rect x="26" y="40" width="8" height="3" rx="1" fill="#0f172a" opacity="0.6" />
      <circle cx="28" cy="41.5" r="0.8" fill="#22c55e"  />
      <circle cx="31" cy="41.5" r="0.8" fill="#fbbf24" />
      
      <rect x="46" y="40" width="8" height="3" rx="1" fill="#0f172a" opacity="0.6" />
      <circle cx="48" cy="41.5" r="0.8" fill="#8b5cf6"  />
      <circle cx="51" cy="41.5" r="0.8" fill="#8b5cf6"   />
      
      <text x="28" y="14" fontSize="5" fontWeight="bold" fill="#fbbf24" textAnchor="middle">YOU</text>
      <text x="49" y="14" fontSize="5" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">+ AI</text>
    </svg>
  );
}

export function DFYIcon({ className = "", size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="carBodyDFY" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="glowDFY" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="humanGlowDFY" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <filter id="glowPurple">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <ellipse cx="40" cy="58" rx="30" ry="4" fill="url(#glowDFY)" opacity="0.5" />
      
      <path d="M12 38 L20 28 L60 28 L68 38 L68 48 L12 48 Z" fill="url(#carBodyDFY)" stroke="#8b5cf6" strokeWidth="1.5" />
      <path d="M22 28 L26 20 L54 20 L58 28" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
      <rect x="24" y="20" width="32" height="8" rx="2" fill="#1e3a5f" stroke="#8b5cf6" strokeWidth="0.5" />
      
      <rect x="26" y="22" width="10" height="5" rx="1" fill="#0f172a" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.8" />
      <rect x="44" y="22" width="10" height="5" rx="1" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.5" opacity="0.8" />
      
      <circle cx="22" cy="52" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="22" cy="52" r="4" fill="#0f172a" />
      <circle cx="22" cy="52" r="2" fill="#334155" />
      
      <circle cx="58" cy="52" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="58" cy="52" r="4" fill="#0f172a" />
      <circle cx="58" cy="52" r="2" fill="#334155" />
      
      <g filter="url(#glowPurple)">
        <circle cx="28" cy="34" r="6" fill="#8b5cf6" />
        <circle cx="28" cy="31" r="3" fill="#a78bfa" />
        <rect x="25" y="34" width="6" height="8" rx="2" fill="#8b5cf6" />
        <rect x="25.5" y="36" width="5" height="2" rx="0.5" fill="#c4b5fd" opacity="0.6" />
        <circle cx="26" cy="39" r="1.2" fill="#4c1d95" />
        <circle cx="30" cy="39" r="1.2" fill="#4c1d95" />
        <path d="M26 31 L30 31" stroke="#e9d5ff" strokeWidth="0.8" />
      </g>
      
      <g filter="url(#glowPurple)">
        <circle cx="49" cy="34" r="5" fill="url(#humanGlowDFY)" />
        <circle cx="49" cy="32" r="2.5" fill="#60a5fa" />
        <rect x="46.5" y="34" width="5" height="7" rx="1.5" fill="url(#humanGlowDFY)" />
        <circle cx="48" cy="38" r="1" fill="#1e3a8a" />
        <circle cx="50" cy="38" r="1" fill="#1e3a8a" />
      </g>
      
      <path d="M36 34 L42 34" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="2 1" opacity="0.8" />
      <path d="M36 36 L42 36" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="2 1" opacity="0.8" />
      <circle cx="39" cy="35" r="1.5" fill="#a78bfa"  />
      
      <rect x="26" y="40" width="10" height="3" rx="1" fill="#0f172a" opacity="0.8" />
      <circle cx="28" cy="41.5" r="0.8" fill="#8b5cf6"  />
      <circle cx="31" cy="41.5" r="0.8" fill="#a78bfa"   />
      <circle cx="34" cy="41.5" r="0.8" fill="#c4b5fd"   />
      
      <text x="28" y="14" fontSize="5" fontWeight="bold" fill="#8b5cf6" textAnchor="middle">AI+HUMAN</text>
      <text x="49" y="14" fontSize="5" fontWeight="bold" fill="#3b82f6" textAnchor="middle">YOU</text>
    </svg>
  );
}
