import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gauge, GitBranch, Cpu, DollarSign, Clock } from "lucide-react";

const auditAreas = [
  { icon: Gauge, label: "Operations Efficiency", description: "How smoothly your engine runs without you in the driver's seat" },
  { icon: GitBranch, label: "Delegation Readiness", description: "Whether your team can carry the load — or everything routes through you" },
  { icon: Cpu, label: "Automation Maturity", description: "Where AI and systems could replace manual grind" },
  { icon: DollarSign, label: "Revenue Leaks", description: "The money walking out the door every month that nobody's tracking" },
  { icon: Clock, label: "Time Allocation", description: "Where your hours actually go vs. where they should" },
];

// Preview scores for the mock card — creates desire to see their own
const previewScores = [
  { label: "Operations", score: 42, color: "oklch(0.65 0.20 25)" },
  { label: "Delegation", score: 28, color: "oklch(0.65 0.20 25)" },
  { label: "Automation", score: 61, color: "oklch(0.70 0.16 80)" },
  { label: "Revenue", score: 35, color: "oklch(0.65 0.20 25)" },
  { label: "Time", score: 54, color: "oklch(0.70 0.16 80)" },
];

export default function ManumationAuditSection() {
  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--surface-sunken)" }} aria-labelledby="audit-heading">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Copy */}
          <AnimatedSection animation="fade-in" delay={0.1}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                The Manumation Audit
              </p>
              <h2 id="audit-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
                See What's Actually
                <br />
                Costing You
              </h2>
              <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "var(--text-secondary)" }}>
                Most business owners know something's off — they just can't pinpoint where the time, money, and energy are leaking. The audit measures five critical areas and shows you exactly what to fix first.
              </p>

              {/* Five areas */}
              <div className="space-y-4 mb-10">
                {auditAreas.map((area) => {
                  const Icon = area.icon;
                  return (
                    <div key={area.label} className="flex items-start gap-3">
                      <Icon size={18} className="mt-0.5 shrink-0" style={{ color: "var(--amber)" }} aria-hidden="true" />
                      <div>
                        <span className="font-semibold text-foreground text-sm">{area.label}</span>
                        <span className="text-sm" style={{ color: "var(--text-tertiary)" }}> — {area.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <a href="/assessment">
                <Button
                  size="lg"
                  className="h-14 px-8 font-bold"
                  style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
                >
                  Take the Free Mini Audit
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </a>
              <p className="text-xs mt-3" style={{ color: "var(--text-tertiary)" }}>
                5 minutes. AI-powered insights. 100% free.
              </p>
            </div>
          </AnimatedSection>

          {/* Right: Mock audit preview card */}
          <AnimatedSection animation="fade-in" delay={0.3}>
            <div className="rounded-lg p-6 sm:p-8" style={{ backgroundColor: "var(--card)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                    Sample Audit Score
                  </p>
                  <p className="text-3xl font-extrabold text-foreground mt-1">44<span className="text-lg font-medium" style={{ color: "var(--text-tertiary)" }}>/100</span></p>
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "oklch(0.65 0.20 25 / 0.15)", color: "oklch(0.70 0.18 25)" }}
                >
                  High Risk
                </span>
              </div>

              <div className="space-y-4">
                {previewScores.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "var(--muted)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.score}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-xs italic" style={{ color: "var(--text-tertiary)" }}>
                  "Your delegation score of 28% suggests a critical founder dependency — your business likely stalls when you're unavailable."
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
