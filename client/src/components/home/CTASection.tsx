import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="assessment" className="py-24 lg:py-32" style={{ backgroundColor: "var(--surface-sunken)" }} aria-label="Bottleneck Audit call to action">
      <div className="container">
        <AnimatedSection animation="fade-in" delay={0.1}>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium uppercase tracking-widest mb-4" style={{ color: "var(--amber)" }}>
              Free Assessment
            </p>
            <h2
              className="font-extrabold tracking-tight mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: "1.08" }}
            >
              Discover Your
              <br />
              Bottleneck Score
            </h2>
            <p className="text-lg mb-10 leading-relaxed max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              Five minutes. Thirty questions. A personalized score showing exactly where coaching and automation would make the biggest impact on your business.
            </p>

            <div className="flex flex-col items-center gap-6">
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

              <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: "var(--text-tertiary)" }}>
                <span>5 minutes</span>
                <span aria-hidden="true">·</span>
                <span>Personalized results</span>
                <span aria-hidden="true">·</span>
                <span>100% free</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
