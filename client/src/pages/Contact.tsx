import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function Contact() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact KeanOnBiz",
      "url": "https://keanonbiz.com/contact",
      "description": "Get in touch with Jeremy Kean for business coaching, AI automation consulting, or partnership opportunities.",
      "mainEntity": { "@id": "https://keanonbiz.com/#person-jeremy-kean" }
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Jeremy Kean | Book a Call or Get in Touch | KeanOnBiz"
        description="Get in touch with Jeremy Kean for business coaching, AI automation consulting, or partnership opportunities. Book a call, send an email, or connect on social media."
      />
      <Navigation />

      <main id="main-content" className="pt-20">
        <section className="py-12 md:py-20" style={{
          background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.20 0.06 255) 100%)"
        }}>
          <div className="container">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} variant="dark" />

            <AnimatedSection animation="fade-in">
              <div className="max-w-3xl mt-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Let's Talk About Your Business
                </h1>
                <p className="text-lg text-white/80 leading-relaxed">
                  Whether you're looking for 1:1 coaching, AI automation consulting, or just want to see if we're a good fit — I'd love to hear from you.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <AnimatedSection animation="slide-left">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Book a Discovery Call</h2>
                <p className="text-muted-foreground mb-6">
                  The fastest way to get started is to book a Discovery Call with Jeremy. Let's find out where you are and map the path forward.
                </p>
                <div className="space-y-4">
                  <a href="/jeremys-calendar-intro" className="block">
                    <Card className="border-2 border-primary/50 bg-primary/5 hover:border-primary transition-colors shadow-md">
                      <CardContent className="p-6 flex items-start gap-4">
                        <Calendar className="w-7 h-7 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground text-lg">Discovery Call</h3>
                            <span className="text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Recommended</span>
                          </div>
                          <p className="text-muted-foreground text-sm">Let's talk about your business, identify your biggest bottlenecks, and see if we're a good fit to work together.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>

                  <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold pt-2">Other options</p>

                  <a href="/jeremys-calendar-strategy" className="block">
                    <Card className="hover:border-primary/50 transition-colors border-border/50">
                      <CardContent className="p-4 flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1 text-sm">Strategy Session</h3>
                          <p className="text-muted-foreground text-xs">Already know you need help — let's build a clear plan for your business growth.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                  <a href="/jeremys-calendar-coaching" className="block">
                    <Card className="hover:border-primary/50 transition-colors border-border/50">
                      <CardContent className="p-4 flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1 text-sm">Coaching Session</h3>
                          <p className="text-muted-foreground text-xs">For existing clients — personalized, 1:1 guidance to keep moving forward.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-right">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Other Ways to Reach Me</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a href="mailto:support@keanonbiz.com" className="text-primary hover:underline">
                        support@keanonbiz.com
                      </a>
                      <p className="text-muted-foreground text-sm mt-1">Typically respond within 24 hours on business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Location</h3>
                      <p className="text-muted-foreground text-sm">Based in Indiana, serving clients across the United States.</p>
                      <p className="text-muted-foreground text-sm">All coaching and consulting is done virtually.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Availability</h3>
                      <p className="text-muted-foreground text-sm">Monday – Friday, 9:00 AM – 5:00 PM EST</p>
                      <p className="text-muted-foreground text-sm">Calls available by appointment.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Connect Online</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://linkedin.com/in/jeremykean"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Jeremy Kean on LinkedIn"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24" style={{
          background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.20 0.06 255) 100%)"
        }}>
          <div className="container">
            <AnimatedSection animation="fade-in">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Not Sure Where to Start?</h2>
                <p className="text-lg text-white/80 mb-8">
                  Take the free Bottleneck Audit to see where you stand — then book a Discovery Call so we have something concrete to talk about.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl" asChild>
                  <a href="/assessment">Take Free Bottleneck Audit <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" /></a>
                </Button>
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
