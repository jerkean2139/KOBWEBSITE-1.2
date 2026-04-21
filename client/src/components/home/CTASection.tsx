import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTASection() {
  return (
    <section id="assessment" className="py-20 lg:py-28" style={{ backgroundColor: "var(--surface-sunken)" }} aria-label="Bottleneck Audit call to action">
      <div className="container">
        <AnimatedSection animation="fade-in" delay={0.1}>
          <div className="text-center max-w-xl mx-auto">
            <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
              Bottleneck Audit
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Discover Your Bottleneck Score
            </h2>
            <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
              Identify your biggest opportunities for automation and delegation in under 5 minutes.
            </p>

            <div className="inline-flex flex-wrap justify-center gap-4 mb-8">
              {["5 Minutes", "Personalized Results", "Free"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <CheckCircle2 size={14} style={{ color: "var(--amber)" }} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>

            <a href="/assessment">
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold"
                style={{
                  backgroundColor: "var(--amber)",
                  color: "var(--amber-foreground)",
                }}
              >
                Take the Free Audit
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
