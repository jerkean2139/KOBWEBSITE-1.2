import { AnimatedSection } from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";

const stats = [
  { prefix: "$", value: 3280, suffix: "/mo", label: "Average revenue recovered", sublabel: "across coached businesses" },
  { prefix: "", value: 15, suffix: "+ hrs/wk", label: "Time freed for strategic work", sublabel: "average per business owner" },
  { prefix: "", value: 70, suffix: "%", label: "Automation rate achieved", sublabel: "of repetitive operations" },
  { prefix: "", value: 90, suffix: " days", label: "To first major win", sublabel: "average time to measurable results" },
];

export default function ResultsSection() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="results-heading">
      <div className="container">
        <AnimatedSection animation="fade-in" delay={0.1}>
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
              Real Results
            </p>
            <h2 id="results-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Numbers Don't Lie
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} animation="fade-in" delay={0.15 + i * 0.08}>
              <div>
                <p className="font-extrabold tracking-tight mb-1" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: "1", color: "var(--amber)" }}>
                  {stat.prefix}<CountUp end={stat.value} />{stat.suffix}
                </p>
                <p className="font-semibold text-foreground text-sm mb-0.5">{stat.label}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{stat.sublabel}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Supporting pull-quote */}
        <AnimatedSection animation="fade-in" delay={0.5}>
          <div className="max-w-2xl" style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
            <blockquote>
              <p className="text-lg leading-relaxed italic mb-4" style={{ color: "var(--text-secondary)" }}>
                "I was working 65 hours a week and couldn't take a day off. After 6 months of coaching, I took my first real vacation in 4 years — and production didn't skip a beat."
              </p>
            </blockquote>
            <p className="text-sm font-semibold text-foreground">Agency Owner</p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Independent Agency, Florida</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
