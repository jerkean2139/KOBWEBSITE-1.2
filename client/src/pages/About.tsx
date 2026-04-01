import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Briefcase, Users, Lightbulb, BookOpen, Bot, Heart, Globe, Cog, GraduationCap, ChevronRight } from "lucide-react";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": { "@id": "https://keanonbiz.com/#person-jeremy-kean" },
      "name": "About Jeremy Kean",
      "url": "https://keanonbiz.com/about",
      "description": "Meet Jeremy Kean — 35+ years of business experience, 13 brands created, 100+ businesses helped. Business coach, AI automation expert, and author of The Manumation Method."
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Jeremy Kean | Business Coach & AI Automation Expert | KeanOnBiz"
        description="Meet Jeremy Kean — 35+ years of business experience, 13 brands created, 100+ businesses helped. Business coach, AI automation expert, and author of The Manumation Method."
      />
      <Navigation />

      <main id="main-content" className="pt-20">
        <section className="py-12 md:py-20" style={{
          background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.20 0.06 255) 100%)"
        }}>
          <div className="container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} variant="dark" />

            <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
              <AnimatedSection animation="slide-left">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl"></div>
                  <img
                    src="/jeremy-about-photo.webp"
                    alt="Jeremy Kean - Business Coach with 35 years of experience helping entrepreneurs transform their businesses"
                    className="relative rounded-2xl shadow-2xl w-full h-auto object-cover object-top"
                    style={{ maxHeight: "600px" }}
                    width={600}
                    height={600}
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-right">
                <div className="inline-block px-4 py-2 bg-primary/20 rounded-full mb-4">
                  <p className="text-primary text-sm font-bold uppercase tracking-wider">Meet Jeremy</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  35 Years. 13 Brands Created. One Truth.
                </h1>
                <p className="text-lg text-white/80 mb-4 leading-relaxed">
                  The difference between struggling and scaling isn't working harder — it's building better systems.
                </p>
                <p className="text-base text-white/70 mb-6">
                  As a husband, father of three, and business owner with A.D.D., I intimately understand the chaos that comes with juggling multiple priorities. That's exactly what drove me to become obsessed with creating systems that actually work in the real world, not just in theory.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl" asChild>
                  <a href="/jeremys-calendar">Book a Call <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" /></a>
                </Button>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <AnimatedSection animation="fade-in">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">My Story</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                  <p>
                    I've spent 35+ years in the trenches of business — not watching from the sidelines, but building, failing, learning, and building again. I've created 13 brands, helped over 100 businesses transform their operations, and learned one thing above everything else: the businesses that thrive are the ones that build systems, not just hustle harder.
                  </p>
                  <p>
                    My journey started in insurance, where I saw firsthand how agencies were drowning in manual processes, missed follow-ups, and reactive operations. I became obsessed with finding a better way — and that obsession led me to automation, AI, and eventually the creation of The Manumation Method.
                  </p>
                  <p>
                    Manumation isn't just a framework. It's the strategic fusion of human ingenuity, AI agents, and automated systems. It's about keeping what makes your business human while letting technology handle the repetitive, time-consuming work that burns you out.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 md:py-24" style={{
          background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.20 0.06 255) 100%)"
        }}>
          <div className="container">
            <AnimatedSection animation="fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">By the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { number: "35+", label: "Years of Experience", icon: Briefcase },
                  { number: "100+", label: "Businesses Helped", icon: Users },
                  { number: "13", label: "Brands Created", icon: Lightbulb },
                  { number: "1", label: "Book Published", icon: BookOpen },
                ].map((stat) => (
                  <Card key={stat.label} className="bg-white/5 border-white/10 text-center">
                    <CardContent className="p-6">
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
                      <div className="text-3xl md:text-4xl font-bold text-[#FFD700] mb-2">{stat.number}</div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <AnimatedSection animation="fade-in">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">What I Believe</h2>
                <div className="grid gap-4">
                  {[
                    { title: "Systems Over Hustle", desc: "Working 80-hour weeks isn't a badge of honor. Building systems that let your business run without you — that's the real win." },
                    { title: "AI Should Serve People", desc: "AI isn't here to replace the human touch in your business. It's here to handle the work that was stealing your time and energy." },
                    { title: "Real Results, Not Theory", desc: "I've built 13 brands and helped 100+ businesses. Every strategy I teach has been battle-tested in the real world." },
                    { title: "Business With Purpose", desc: "For every new client in 2026, we sponsor one child through Kingdom Legacy Ministries. Business should create impact beyond the balance sheet." },
                  ].map((belief) => (
                    <div key={belief.title} className="flex items-start gap-4 p-5 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="text-primary mt-1 flex-shrink-0 w-5 h-5" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{belief.title}</h3>
                        <p className="text-muted-foreground text-sm">{belief.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 md:py-24" style={{
          background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.20 0.06 255) 100%)"
        }}>
          <div className="container">
            <AnimatedSection animation="fade-in">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-block px-4 py-2 bg-primary/20 rounded-full mb-4">
                    <p className="text-primary text-sm font-bold uppercase tracking-wider">Three Brands, One Mission</p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Ecosystem</h2>
                  <p className="text-white/80 text-lg max-w-2xl mx-auto">
                    I don't just coach — I've built an entire ecosystem of tools and frameworks designed to help business owners stop duct-taping solutions and start operating with clarity, speed, and soul.
                  </p>
                </div>

                <div className="relative">
                  <div className="grid md:grid-cols-3 gap-6 md:gap-4 relative z-10">
                    <Card className="bg-[oklch(0.18_0.06_250)] border-primary/30 border-2 relative overflow-hidden group hover:border-primary/60 transition-colors">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                      <CardContent className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-primary" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">KeanOnBiz</h3>
                            <span className="text-primary text-sm font-semibold">The Front Door</span>
                          </div>
                        </div>
                        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                          <span className="text-primary/80 text-xs font-medium uppercase tracking-wider">Awareness & Conversion</span>
                        </div>
                        <p className="text-white/70 text-sm mb-4">Consulting, coaching, and strategy. Where business owners discover the path forward and build trust.</p>
                        <ul className="space-y-2">
                          {["Consulting", "Coaching", "Strategy", "Trust & Conversion"].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <a href="https://manumation.ai/coming-soon" target="_blank" rel="noopener noreferrer" className="group block">
                      <Card className="bg-[oklch(0.22_0.06_60)] border-[#C4972A]/30 border-2 relative overflow-hidden hover:border-[#C4972A]/60 transition-colors h-full">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#C4972A]"></div>
                        <CardContent className="p-6 md:p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[#C4972A]/20 flex items-center justify-center">
                              <GraduationCap className="w-6 h-6 text-[#C4972A]" aria-hidden="true" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-[#C4972A] transition-colors">Manumation</h3>
                              <span className="text-[#C4972A] text-sm font-semibold">The Framework</span>
                            </div>
                          </div>
                          <div className="inline-block px-3 py-1 bg-[#C4972A]/10 rounded-full mb-4">
                            <span className="text-[#C4972A]/80 text-xs font-medium uppercase tracking-wider">Education & Community</span>
                          </div>
                          <p className="text-white/70 text-sm mb-4">Book, workshop, community, and DONNA AI. Where business owners learn the method and commit to change.</p>
                          <ul className="space-y-2">
                            {["Book", "Workshop", "Community", "DONNA AI Tool"].map((item) => (
                              <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-[#C4972A] flex-shrink-0" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </a>

                    <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer" className="group block">
                      <Card className="bg-[oklch(0.18_0.04_220)] border-white/20 border-2 relative overflow-hidden hover:border-white/40 transition-colors h-full">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/60"></div>
                        <CardContent className="p-6 md:p-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                              <Cog className="w-6 h-6 text-white/80" aria-hidden="true" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Zenoflo</h3>
                              <span className="text-white/60 text-sm font-semibold">The Engine</span>
                            </div>
                          </div>
                          <div className="inline-block px-3 py-1 bg-white/5 rounded-full mb-4">
                            <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Delivery & Retention</span>
                          </div>
                          <p className="text-white/70 text-sm mb-4">Software platform, system delivery, and client retention. Where the operational engine runs day-to-day.</p>
                          <ul className="space-y-2">
                            {["Software Platform", "System Delivery", "Client Retention", "Ongoing Operations"].map((item) => (
                              <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-white/50 flex-shrink-0" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </a>
                  </div>

                  <div className="hidden md:flex justify-center items-center gap-0 mt-8">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                      <span className="text-white/60 text-sm">Buyer Discovers & Engages</span>
                      <ChevronRight className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="text-white/60 text-sm">Buyer Learns & Commits</span>
                      <ChevronRight className="w-4 h-4 text-[#C4972A]" aria-hidden="true" />
                      <span className="text-white/60 text-sm">Client Success Drives Referrals</span>
                      <ChevronRight className="w-4 h-4 text-white/50" aria-hidden="true" />
                      <span className="text-white/60 text-sm italic">Repeat</span>
                    </div>
                  </div>

                  <div className="flex md:hidden flex-col items-center gap-2 mt-6">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>Buyer Discovers & Engages</span>
                      <ArrowRight className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>Buyer Learns & Commits</span>
                      <ArrowRight className="w-4 h-4 text-[#C4972A]" aria-hidden="true" />
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>Client Success Drives Referrals</span>
                      <ArrowRight className="w-4 h-4 text-white/50" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <AnimatedSection animation="fade-in">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Talk?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Whether you're drowning in day-to-day operations or ready to scale with smarter systems, let's find out where you stand.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl" asChild>
                    <a href="/jeremys-calendar">Book a Call <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" /></a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/assessment">Take Free Bottleneck Audit</a>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background py-8">
        <div className="container text-center">
          <p className="text-background/70 text-sm">
            &copy; {new Date().getFullYear()} KeanOnBiz. All rights reserved. |{" "}
            <Link href="/terms" className="hover:text-background transition-colors">Terms</Link> |{" "}
            <Link href="/privacy" className="hover:text-background transition-colors">Privacy</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
