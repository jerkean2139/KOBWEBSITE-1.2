import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { FileText, Search, Zap, PhoneCall, Star, ArrowRight } from "lucide-react";

const steps = [
  { icon: FileText, label: "Content Drives Traffic", description: "Blog, podcast, and newsletter attract the right people.", color: "var(--primary)" },
  { icon: Search, label: "Bottleneck Audit", description: "5-minute diagnostic reveals your biggest opportunity.", color: "var(--amber)", badge: "FREE", cta: { text: "Take the Audit", href: "/assessment" } },
  { icon: Zap, label: "Automated Nurture", description: "AI-powered follow-up delivers value while you sleep.", color: "oklch(0.60 0.20 300)" },
  { icon: PhoneCall, label: "Discovery Call", description: "A real conversation about your business and goals.", color: "var(--primary)", cta: { text: "Book a Call", href: "/jeremys-calendar-intro" } },
  { icon: Star, label: "Community & Advocacy", description: "Clients become advocates. Referrals become the engine.", color: "oklch(0.65 0.18 155)" },
];

export default function FunnelSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28" aria-labelledby="how-it-works-heading">
      <div className="container">
        <AnimatedSection animation="fade-in" delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
              How It Works
            </p>
            <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Your Path to Freedom
            </h2>
          </div>
        </AnimatedSection>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <AnimatedSection key={step.label} animation="fade-in" delay={0.15 + i * 0.08}>
                <div
                  className="flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-lg"
                  style={{ backgroundColor: "var(--card)" }}
                >
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                    <Icon size={20} style={{ color: step.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>
                        STEP {i + 1}
                      </span>
                      {step.badge && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}>
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground mt-1">{step.label}</h3>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{step.description}</p>
                    {step.cta && (
                      <a href={step.cta.href} className="inline-flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: "var(--amber)" }}>
                        {step.cta.text} <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <AnimatedSection animation="fade-in" delay={0.6}>
          <div className="text-center mt-12">
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Most business owners start at Step 2. It takes 5 minutes.
            </p>
            <a href="/assessment">
              <Button
                size="lg"
                className="h-14 px-8 font-bold"
                style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
              >
                Take the Free Bottleneck Audit
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
