import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BookOpen, Users, Sparkles, Clock, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { AnimatedSection } from "@/components/AnimatedSection";
import CountdownTimer from "@/components/CountdownTimer";
import CountUp from "@/components/CountUp";

export default function Book() {
  return (
    <>
      <SEO
        title="The Manumation Method Book | AI + Human Systems for Business | KeanOnBiz"
        description="The Manumation Method: the strategic fusion of human ingenuity and AI automation. Learn how to build systems that grow your business while keeping the human touch."
      />
      <Navigation />
      <main className="min-h-screen pt-20">
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--surface-sunken)]">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20"
              style={{ 
                backgroundColor: "oklch(0.58 0.20 250)",
                filter: "blur(120px)"
              }}
            />
            <div 
              className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15"
              style={{ 
                backgroundColor: "var(--amber)",
                filter: "blur(100px)"
              }}
            />
          </div>
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection animation="slide-left">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-[var(--amber)]/30"
                  style={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                >
                  <BookOpen className="text-[var(--amber)]" size={16} />
                  <p className="text-[var(--amber)] text-sm font-bold uppercase tracking-wider">New Book • Available Now</p>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  The Manumation <span className="text-primary">Method</span>
                </h1>
                <p className="text-xl text-white/80 mb-6 leading-relaxed">
                  The strategic fusion of human ingenuity and AI automation that transforms business experiences while creating true freedom for innovative thinkers.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: "4px 4px 0 oklch(0.58 0.20 250 / 0.3), 8px 8px 0 oklch(0.58 0.20 250 / 0.1)"
                    }}
                  >
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className="text-white font-semibold text-sm"><CountUp end={100} suffix="+" /> Businesses Helped</span>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: "4px 4px 0 oklch(0.80 0.16 80 / 0.3), 8px 8px 0 oklch(0.80 0.16 80 / 0.1)"
                    }}
                  >
                    <Award className="text-[var(--amber)]" size={20} />
                    <span className="text-white font-semibold text-sm">35 Years Experience</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-[var(--amber)] text-gray-900 font-bold border-0"
                    style={{
                      boxShadow: "0 4px 0 oklch(0.65 0.14 80), 0 8px 20px oklch(0.80 0.16 80 / 0.3)"
                    }}
                    asChild
                  >
                    <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer">
                      Get the Book <ArrowRight className="ml-2" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 text-white border-2 border-white/30 bg-transparent hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    style={{
                      boxShadow: "0 4px 0 rgba(255, 255, 255, 0.1)"
                    }}
                    asChild
                  >
                    <a href="/assessment">
                      Take the Bottleneck Audit
                    </a>
                  </Button>
                </div>

                <CountdownTimer />
              </AnimatedSection>

              <AnimatedSection animation="slide-right" className="hidden lg:flex justify-center items-start pt-8">
                <div 
                  className="relative p-2 rounded-2xl max-w-xs"
                  style={{
                    backgroundColor: "oklch(0.19 0.025 250)",
                    boxShadow: "-8px 8px 0 oklch(0.58 0.20 250 / 0.4), 8px -8px 0 oklch(0.80 0.16 80 / 0.4), 0 25px 50px rgba(0,0,0,0.5)"
                  }}
                >
                  <img
                    src="/manumation-book-cover-nobg.webp"
                    alt="The Manumation Method Book Cover"
                    className="relative w-full rounded-xl"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-card relative">
          <div className="container">
            <div className="text-center mb-16">
              <AnimatedSection animation="fade-in">
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4 border border-primary/20">
                  <p className="text-primary text-sm font-bold uppercase tracking-wider">What You'll Learn</p>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={100}>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Transform Your Business
                </h2>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={200}>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The Manumation Method provides a complete framework for building systems that work—without losing the human touch that makes your business special.
                </p>
              </AnimatedSection>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <AnimatedSection animation="slide-up" delay={0}>
                <div 
                  className="h-full p-8 rounded-2xl bg-card border-2 border-border"
                  style={{
                    boxShadow: "8px 8px 0 oklch(0.58 0.20 250 / 0.15), 0 10px 40px rgba(0,0,0,0.05)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 border border-primary/20"
                  >
                    <Clock className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Reclaim Your Time</h3>
                  <p className="text-muted-foreground">
                    Learn how to identify and automate the tasks that drain your energy, freeing up hours every week for high-value work.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={150}>
                <div 
                  className="h-full p-8 rounded-2xl bg-card border-2 border-border"
                  style={{
                    boxShadow: "8px 8px 0 oklch(0.80 0.16 80 / 0.25), 0 10px 40px rgba(0,0,0,0.05)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-[var(--amber)]/10 border border-[var(--amber)]/30"
                  >
                    <Sparkles className="text-[var(--amber)]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">AI That Works For You</h3>
                  <p className="text-muted-foreground">
                    Discover practical AI applications that enhance (not replace) human connection in your business.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={300}>
                <div 
                  className="h-full p-8 rounded-2xl bg-card border-2 border-border"
                  style={{
                    boxShadow: "8px 8px 0 rgba(139, 92, 246, 0.2), 0 10px 40px rgba(0,0,0,0.05)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-purple-100 border border-purple-200"
                  >
                    <Users className="text-purple-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Scale With Soul</h3>
                  <p className="text-muted-foreground">
                    Build systems that grow your business while maintaining the personal touch your clients love.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[var(--surface-sunken)] relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
              style={{ 
                backgroundColor: "oklch(0.58 0.20 250)",
                filter: "blur(150px)"
              }}
            />
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="fade-in">
                <div className="text-center mb-12">
                  <div className="inline-block px-4 py-2 bg-primary/20 rounded-full mb-4 border border-primary/30">
                    <p className="text-primary text-sm font-bold uppercase tracking-wider">Inside The Book</p>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    What's Covered
                  </h2>
                </div>
              </AnimatedSection>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "The Manumation Framework: Understanding the balance between manual expertise and automation",
                  "Identifying automation opportunities without losing the human touch",
                  "Building AI-powered workflows that actually work in the real world",
                  "The phased approach: Quick wins, core processes, and advanced optimization",
                  "Case studies from insurance agencies and service businesses",
                  "Implementation templates and step-by-step guides",
                  "Common pitfalls and how to avoid them",
                  "Measuring ROI and continuous improvement strategies"
                ].map((item, index) => (
                  <AnimatedSection key={index} animation="slide-up" delay={index * 50}>
                    <div 
                      className="flex items-start gap-4 p-4 rounded-xl border border-white/10"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        boxShadow: index % 2 === 0 
                          ? "4px 4px 0 oklch(0.58 0.20 250 / 0.2)"
                          : "4px 4px 0 oklch(0.80 0.16 80 / 0.2)"
                      }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: index % 2 === 0 ? "oklch(0.58 0.20 250 / 0.2)" : "oklch(0.80 0.16 80 / 0.2)" }}
                      >
                        <CheckCircle2 
                          className={index % 2 === 0 ? "text-primary" : "text-[var(--amber)]"} 
                          size={14} 
                        />
                      </div>
                      <span className="text-white/90 text-sm">{item}</span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <AnimatedSection animation="fade-in">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-lg text-muted-foreground mb-10">
                  Pre-order The Manumation Method now and be the first to receive it when it launches December 31st.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={100}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-primary text-white font-bold border-0"
                    style={{
                      boxShadow: "0 4px 0 oklch(0.50 0.20 250), 0 8px 20px oklch(0.58 0.20 250 / 0.3)"
                    }}
                    asChild
                  >
                    <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer">
                      Get the Book <ArrowRight className="ml-2" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 text-foreground border-2 border-gray-300 bg-white"
                    style={{
                      boxShadow: "0 4px 0 rgba(0, 0, 0, 0.1)"
                    }}
                    asChild
                  >
                    <a href="/">
                      Learn More About Jeremy
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
