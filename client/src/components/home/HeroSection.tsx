import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import { ArrowRight, Users, Clock, Award } from "lucide-react";
import { useHeroABTest } from "@/hooks/useHeroABTest";

export default function HeroSection() {
  const { variant, trackCTAClick } = useHeroABTest();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16"
      style={{ background: "var(--background)" }}
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="currentColor" />
            </pattern>
            <radialGradient id="hero-grid-fade" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="hero-grid-mask">
              <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" mask="url(#hero-grid-mask)" className="text-foreground" />
        </svg>
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Copy */}
          <AnimatedSection animation="fade-in" delay={0.1}>
            <div className="max-w-xl">
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
                style={{ lineHeight: "1.05" }}
              >
                <span className="text-foreground">{variant.headline}{" "}</span>
                <span style={{ color: "var(--amber)" }}>{variant.highlightedText}</span>
              </h1>

              <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {variant.subheadline}
              </p>

              {/* Social proof — minimal text, no glass */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10">
                <div className="flex items-center gap-2">
                  <Users size={18} style={{ color: "var(--amber)" }} aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">
                    <CountUp end={100} suffix="+" /> businesses helped
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} style={{ color: "var(--amber)" }} aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">
                    <CountUp end={15} suffix="+" /> hrs/week saved
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} style={{ color: "var(--amber)" }} aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground">
                    <CountUp end={35} /> years experience
                  </span>
                </div>
              </div>

              {/* CTA */}
              <a
                href="/assessment"
                onClick={() => trackCTAClick("take_assessment")}
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-bold rounded-lg"
                  style={{
                    backgroundColor: "var(--amber)",
                    color: "var(--amber-foreground)",
                  }}
                >
                  Take the Free Bottleneck Audit
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </a>
            </div>
          </AnimatedSection>

          {/* Right: Editorial photo — no decoration, the crop IS the design */}
          <AnimatedSection animation="fade-in" delay={0.3}>
            <div className="hidden lg:block">
              <img
                src="/jeremy-main-hero.webp"
                alt="Jeremy Kean — Business Coach"
                width="600"
                height="700"
                className="w-full max-w-lg ml-auto object-cover"
                style={{ aspectRatio: "5/6", borderRadius: "2px" }}
                {...{ fetchpriority: "high" } as any}
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
