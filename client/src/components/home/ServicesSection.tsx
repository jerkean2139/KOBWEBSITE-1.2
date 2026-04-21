import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { DIYIcon, DWYIcon, DFYIcon } from "@/components/VehicleIcons";

const tiers = [
  {
    id: "diy",
    icon: DIYIcon,
    title: "Do It Yourself",
    tagline: "You drive. We're in the back seat.",
    features: [
      "The Manumation Method Book",
      "Free Bottleneck Audit",
      "Blog, Podcast & Newsletter",
    ],
    emphasis: false,
  },
  {
    id: "dwy",
    icon: DWYIcon,
    title: "Done With You",
    tagline: "You drive. We're in the passenger seat.",
    badge: "MOST POPULAR",
    features: [
      "1:1 Strategy & Coaching Sessions",
      "Custom Automation Blueprint",
      "Ongoing Accountability & Support",
    ],
    emphasis: true,
  },
  {
    id: "dfy",
    icon: DFYIcon,
    title: "Done For You",
    tagline: "We drive. You're in the passenger seat.",
    features: [
      "Full System Build & Implementation",
      "AI Agent Setup & Training",
      "Managed Operations & Optimization",
    ],
    emphasis: false,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28" style={{ backgroundColor: "var(--surface-sunken)" }} aria-labelledby="services-heading">
      <div className="container">
        <AnimatedSection animation="fade-in" delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
              Three Ways to Work Together
            </p>
            <h2 id="services-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Choose Your Journey
            </h2>
          </div>
        </AnimatedSection>

        {/* Editorial stacked layout */}
        <div className="space-y-6">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <AnimatedSection key={tier.id} animation="fade-in" delay={0.15 + i * 0.1}>
                <div
                  className={`rounded-lg p-6 sm:p-8 lg:p-10 transition-colors ${
                    tier.emphasis ? "ring-1" : ""
                  }`}
                  style={{
                    backgroundColor: tier.emphasis ? "var(--surface-elevated)" : "var(--card)",
                    borderColor: tier.emphasis ? "var(--amber)" : undefined,
                    ringColor: tier.emphasis ? "var(--amber)" : undefined,
                  }}
                >
                  <div className="grid lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-10 items-center">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-4 lg:min-w-[240px]">
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
                        <Icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-foreground">{tier.title}</h3>
                          {tier.badge && (
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
                            >
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{tier.tagline}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {tier.features.map((feature) => (
                        <span key={feature} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <CheckCircle2 size={14} style={{ color: "var(--amber)" }} aria-hidden="true" />
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <a href="/assessment" className="shrink-0">
                      <Button
                        variant={tier.emphasis ? "default" : "outline"}
                        className="w-full lg:w-auto font-semibold"
                        style={tier.emphasis ? {
                          backgroundColor: "var(--amber)",
                          color: "var(--amber-foreground)",
                        } : undefined}
                      >
                        Get Started
                        <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
