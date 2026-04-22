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
              Get Your Free Score
            </h2>
            <p className="text-lg mb-10 leading-relaxed max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              Five minutes. Personalized insights across five critical business areas. See where you stand — and what the full Manumation Audit would reveal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/assessment">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base font-bold"
                  style={{
                    backgroundColor: "var(--amber)",
                    color: "var(--amber-foreground)",
                  }}
                >
                  Take the Free Mini Audit
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </a>
              <a href="/jeremys-calendar-intro">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base font-semibold"
                >
                  Book a Call
                </Button>
              </a>
            </div>

            <p className="text-sm mt-6" style={{ color: "var(--text-tertiary)" }}>
              5 minutes · Personalized results · 100% free
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
