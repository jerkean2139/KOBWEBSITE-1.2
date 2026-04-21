import { AnimatedSection } from "@/components/AnimatedSection";
import { CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <AnimatedSection animation="fade-in" delay={0.1}>
            <div className="relative">
              <img
                src="/jeremy-about-photo.webp"
                alt="Jeremy Kean"
                width="560"
                height="640"
                loading="lazy"
                className="w-full max-w-md rounded-lg object-cover"
                style={{ aspectRatio: "7/8" }}
              />
            </div>
          </AnimatedSection>

          {/* Copy */}
          <AnimatedSection animation="fade-in" delay={0.2}>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                Meet Jeremy
              </p>
              <h2 id="about-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
                35 Years. 13 Brands.
                <br />
                One Truth.
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                Every system you build should make the next decision easier, not harder. I've spent 35 years learning that the hard way — building businesses, burning out, rebuilding, and finally cracking the code on what actually works.
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                My A.D.D. brain forced me to find frameworks that cut through complexity. That's how The Manumation Method was born — a system designed for business owners who think fast but need structure.
              </p>

              {/* Key stats */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "var(--surface-elevated)" }}>
                  <CheckCircle2 size={20} style={{ color: "var(--amber)" }} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">Battle-Tested Results</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      50% reduction in admin work, 70% automation rate
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: "var(--surface-elevated)" }}>
                  <CheckCircle2 size={20} style={{ color: "var(--amber)" }} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground">Systems That Make Sense</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Built for how your brain actually functions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
