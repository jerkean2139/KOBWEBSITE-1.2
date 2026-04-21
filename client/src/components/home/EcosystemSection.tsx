import { AnimatedSection } from "@/components/AnimatedSection";
import { ArrowRight, ExternalLink } from "lucide-react";
import LogoCarousel from "@/components/LogoCarousel";
import { Button } from "@/components/ui/button";

const brands = [
  {
    num: "01",
    name: "KeanOnBiz",
    role: "The Strategy",
    description: "Coaching, frameworks, and the roadmap to get unstuck.",
    href: "/about",
    external: false,
  },
  {
    num: "02",
    name: "Manumation",
    role: "The Method",
    description: "The book, the system, the philosophy behind it all.",
    href: "https://manumation.ai/coming-soon",
    external: true,
  },
  {
    num: "03",
    name: "Zenoflo",
    role: "The Machine",
    description: "AI-powered tools that run your operations.",
    href: "https://zenoflo.com",
    external: true,
  },
];

export default function EcosystemSection() {
  return (
    <>
      {/* Brand Philosophy */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--secondary)" }} aria-labelledby="philosophy-heading">
        <div className="container">
          <AnimatedSection animation="fade-in" delay={0.1}>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 id="philosophy-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                Strategy. Method. Machine.
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Three brands. One ecosystem. Everything a business owner needs to operate with clarity, speed, and soul.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {brands.map((brand, i) => (
              <AnimatedSection key={brand.name} animation="fade-in" delay={0.15 + i * 0.1}>
                <a
                  href={brand.href}
                  target={brand.external ? "_blank" : undefined}
                  rel={brand.external ? "noopener noreferrer" : undefined}
                  className="group block p-6 rounded-lg transition-colors hover:bg-white/5"
                  style={{ backgroundColor: "var(--surface-elevated)" }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                    {brand.num}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-1 text-foreground group-hover:text-amber transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm font-medium mb-3" style={{ color: "var(--amber)" }}>{brand.role}</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{brand.description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    {brand.external ? (
                      <>Visit <ExternalLink size={12} /></>
                    ) : (
                      <>Learn more <ArrowRight size={12} /></>
                    )}
                  </span>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Logos */}
      <section id="tech-ecosystem" className="py-16" aria-label="Technology partners">
        <div className="container text-center">
          <AnimatedSection animation="fade-in" delay={0.1}>
            <p className="text-sm font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-tertiary)" }}>
              Purpose-Built Platforms
            </p>
            <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              We combine best-in-class platforms with custom development to build systems that actually work.
            </p>
            <LogoCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* Brand Showcase — Zenoflo */}
      <section className="py-16" aria-label="Our platforms">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <AnimatedSection animation="fade-in" delay={0.1}>
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--surface-elevated)" }}>
                <img src="/zenoflo-logo.svg" alt="Zenoflo" className="h-8 mb-4" loading="lazy" />
                <h3 className="text-lg font-bold text-foreground mb-2">Your Business Command Center</h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                  AI agents, voice automation, and intelligent workflows — all in one platform.
                </p>
                <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Visit Zenoflo <ExternalLink size={14} className="ml-1" />
                  </Button>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
