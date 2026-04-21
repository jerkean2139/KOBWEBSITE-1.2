import { AnimatedSection } from "@/components/AnimatedSection";

const testimonials = [
  {
    name: "Jason Elkins",
    company: "100 Cups Consulting",
    image: "/testimonial-jason.webp",
    quote: "The Manumation Method gave me permission to simplify, evaluate problems quickly, and implement solutions without the decision-fatigue spiral. Finally, a framework that works for my brain.",
    featured: true,
  },
  {
    name: "Ryan Templeton",
    company: "Premier Health Advisors",
    image: "/testimonial-ryan.webp",
    quote: "Jeremy bridges the gap between 'tech' and 'tactical.' This isn't just theory; it is the specific blueprint I needed to stop manually grinding and start strategically scaling.",
  },
  {
    name: "Beth Prince",
    company: "State Farm Insurance Agent",
    image: "/testimonial-beth.webp",
    quote: "I was afraid automation would make my business feel robotic, but Jeremy proved the opposite. This method allowed me to 'clone' my values and voice, giving me more time with clients.",
  },
];

export default function TestimonialsSection() {
  const featured = testimonials[0];
  const rest = testimonials.slice(1);

  return (
    <section id="testimonials" className="py-20 lg:py-28" aria-labelledby="testimonials-heading">
      <div className="container">
        <AnimatedSection animation="fade-in" delay={0.1}>
          <p className="text-sm font-medium uppercase tracking-widest mb-3 text-center" style={{ color: "var(--amber)" }}>
            Real Results
          </p>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center mb-16">
            What They Say
          </h2>
        </AnimatedSection>

        {/* Featured testimonial — large pull-quote */}
        <AnimatedSection animation="fade-in" delay={0.2}>
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <blockquote>
              <p
                className="text-2xl sm:text-3xl lg:text-4xl font-bold italic leading-snug mb-8"
                style={{ color: "var(--foreground)" }}
              >
                "{featured.quote}"
              </p>
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <img
                src={featured.image}
                alt={featured.name}
                width="56"
                height="56"
                loading="lazy"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-foreground">{featured.name}</p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{featured.company}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Remaining testimonials — two-column */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {rest.map((t, i) => (
            <AnimatedSection key={t.name} animation="fade-in" delay={0.3 + i * 0.1}>
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--surface-elevated)" }}>
                <div className="flex items-center gap-1 mb-4" aria-label={`5 out of 5 stars`}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: "var(--amber)" }}>&#9733;</span>
                  ))}
                </div>
                <blockquote>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    "{t.quote}"
                  </p>
                </blockquote>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    width="40"
                    height="40"
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{t.company}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
