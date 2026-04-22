import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    label: "Content Drives Traffic",
    description: "Blog, podcast, and newsletter attract the right people — business owners who need systems, not hype.",
  },
  {
    num: "02",
    label: "Bottleneck Audit",
    description: "A 5-minute diagnostic that reveals your biggest operational bottleneck. Free. Personalized. No fluff.",
    cta: { text: "Take the Audit", href: "/assessment" },
    highlight: true,
  },
  {
    num: "03",
    label: "Automated Nurture",
    description: "AI-powered follow-up delivers real value while you sleep — not spam, actual frameworks you can use.",
  },
  {
    num: "04",
    label: "Discovery Call",
    description: "A real conversation. No pitch deck. Just your business, your goals, and whether we're a fit.",
    cta: { text: "Book a Call", href: "/jeremys-calendar-intro" },
  },
  {
    num: "05",
    label: "Community & Advocacy",
    description: "Clients become advocates. Referrals become the engine. The system feeds itself.",
  },
];

export default function FunnelSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28" aria-labelledby="how-it-works-heading">
      <div className="container">
        <AnimatedSection animation="fade-in" delay={0.1}>
          <div className="max-w-2xl mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
              How It Works
            </p>
            <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Your Path to Freedom
            </h2>
          </div>
        </AnimatedSection>

        {/* Editorial numbered steps — asymmetric, not identical cards */}
        <div className="max-w-3xl">
          {steps.map((step, i) => (
            <AnimatedSection key={step.num} animation="fade-in" delay={0.12 + i * 0.08}>
              <div
                className={`flex gap-6 sm:gap-8 py-8 ${i < steps.length - 1 ? "" : ""}`}
                style={i < steps.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}
              >
                {/* Large step number */}
                <span
                  className="text-3xl sm:text-4xl font-extrabold shrink-0 w-12 tabular-nums"
                  style={{ color: step.highlight ? "var(--amber)" : "var(--border)", lineHeight: "1" }}
                >
                  {step.num}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground mb-1">{step.label}</h3>
                  <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
                    {step.description}
                  </p>
                  {step.cta && (
                    <a
                      href={step.cta.href}
                      className="inline-flex items-center gap-1 mt-3 text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ color: "var(--amber)" }}
                    >
                      {step.cta.text} <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedSection animation="fade-in" delay={0.6}>
          <div className="mt-16">
            <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
              Most business owners start at Step 02. It takes 5 minutes.
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
