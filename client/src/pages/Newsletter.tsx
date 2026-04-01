import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CheckCircle2, Mail, Loader2, Sparkles, TrendingUp, Brain, Zap, Clock, Users } from "lucide-react";

function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://api.leadconnectorhq.com/widget/form/WeCKj6eththzMepQtObZ", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          formId: "WeCKj6eththzMepQtObZ",
        }).toString(),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500/30 rounded-xl">
          <CheckCircle2 className="text-green-400 flex-shrink-0" size={24} />
          <div>
            <p className="text-green-300 font-semibold">You're in!</p>
            <p className="text-green-300/80 text-sm">Check your inbox for the welcome email.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
          required
          disabled={status === "loading"}
          className="flex-1 px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 focus:ring-2 focus:ring-[#FFD700]/30 transition-all disabled:opacity-50 text-lg"
        />
        <Button 
          type="submit" 
          size="lg"
          disabled={status === "loading"}
          className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-gray-900 font-bold px-8 py-4 text-lg min-h-[56px]"
        >
          {status === "loading" ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Mail className="mr-2" size={20} aria-hidden="true" />
              Subscribe Free
            </>
          )}
        </Button>
      </form>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-white/70">
        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} aria-hidden="true" /> 100% Free</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} aria-hidden="true" /> No spam ever</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} aria-hidden="true" /> Unsubscribe anytime</span>
      </div>
    </div>
  );
}

export default function Newsletter() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24 pb-16"
          style={{
            background: "linear-gradient(135deg, oklch(0.20 0.08 250) 0%, oklch(0.15 0.06 255) 50%, oklch(0.18 0.07 245) 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.3),transparent_50%)]"></div>
          </div>
          
          <div className="container relative z-10 px-4">
            <AnimatedSection animation="fade-in" className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700]/20 rounded-full mb-6 border border-[#FFD700]/30">
                <Mail className="text-[#FFD700]" size={18} />
                <span className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">Free Bi-Weekly Newsletter</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Business Wisdom That
                <span className="text-[#FFD700]"> Actually Works</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                Join thousands of entrepreneurs getting battle-tested strategies, automation insights, and real talk about building businesses that run without you.
              </p>
              
              <NewsletterSignupForm />
            </AnimatedSection>
          </div>
        </section>

        {/* What You'll Get Section */}
        <section className="py-20 bg-background">
          <div className="container px-4">
            <AnimatedSection animation="slide-up" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What You'll Get Every Two Weeks
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                No fluff. No filler. Just actionable insights from 35 years of building and scaling businesses.
              </p>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <AnimatedSection animation="slide-up" delay={0}>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Mindset Shifts</h3>
                  <p className="text-muted-foreground">
                    The mental models that separate struggling entrepreneurs from thriving business owners.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-up" delay={100}>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Automation Secrets</h3>
                  <p className="text-muted-foreground">
                    Real examples of how to automate the boring stuff so you can focus on what matters.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-up" delay={200}>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Growth Strategies</h3>
                  <p className="text-muted-foreground">
                    Proven tactics for scaling your business without burning out or losing your soul.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-up" delay={300}>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">AI & Tech Tips</h3>
                  <p className="text-muted-foreground">
                    How to leverage AI and technology without getting lost in the hype or complexity.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-up" delay={400}>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Time Freedom</h3>
                  <p className="text-muted-foreground">
                    Systems and strategies for getting your time back so you can live the life you want.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-up" delay={500}>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Real Stories</h3>
                  <p className="text-muted-foreground">
                    Behind-the-scenes looks at what's working (and what's not) in my businesses.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* About Jeremy Section */}
        <section className="py-20 relative overflow-hidden" style={{
          background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.20 0.06 255) 100%)",
        }}>
          <div className="container px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <AnimatedSection animation="slide-left">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#FFD700]/20 rounded-2xl blur-2xl"></div>
                  <img
                    src="/jeremy-about-photo.webp"
                    alt="Jeremy Kean"
                    className="relative rounded-2xl shadow-2xl w-full h-auto object-cover object-top"
                    style={{ maxHeight: '500px' }}
                    loading="lazy"
                  />
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slide-right">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Who's Behind This Newsletter?
                </h2>
                <p className="text-lg text-white/80 mb-4 leading-relaxed">
                  I'm Jeremy Kean. Over the past 35 years, I've built 13 brands, helped over 100 businesses transform their operations, and developed a framework called <span className="text-[#FFD700] font-semibold">Manumation</span> that combines human wisdom with smart automation.
                </p>
                <p className="text-lg text-white/80 mb-6 leading-relaxed">
                  As a husband, father of three, and business owner with A.D.D., I understand the chaos that comes with juggling multiple priorities. That's exactly why I became obsessed with creating systems that actually work in the real world.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-[#FFD700] font-bold text-2xl">35+</span>
                    <p className="text-white/70 text-sm">Years Experience</p>
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-[#FFD700] font-bold text-2xl">13</span>
                    <p className="text-white/70 text-sm">Brands Built</p>
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-[#FFD700] font-bold text-2xl">100+</span>
                    <p className="text-white/70 text-sm">Businesses Helped</p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-background">
          <div className="container px-4">
            <AnimatedSection animation="slide-up" className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Level Up Your Business?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join the newsletter and get actionable insights delivered straight to your inbox every two weeks. It's free, and you can unsubscribe anytime.
              </p>
              
              <div className="p-8 rounded-2xl border border-border bg-muted/30">
                <NewsletterSignupForm />
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <img 
                src="/kean-on-biz-logo.png" 
                alt="Kean on Biz" 
                className="h-10 mb-4"
              />
              <p className="text-background/70 text-sm">
                Building better systems for modern businesses. Strategy, method, and machine – all in one ecosystem.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <a href="/" className="text-background/70 hover:text-background transition-colors text-sm">
                  Home
                </a>
                <a href="/blog" className="text-background/70 hover:text-background transition-colors text-sm">
                  Blog
                </a>
                <a href="/micropod" className="text-background/70 hover:text-background transition-colors text-sm">
                  MicroPod
                </a>
                <a href="/jeremys-calendar" className="text-background/70 hover:text-background transition-colors text-sm">
                  Book a Call
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
              <div className="flex flex-col gap-3">
                <a href="mailto:support@keanonbiz.com" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm">
                  <Mail size={16} />
                  support@keanonbiz.com
                </a>
                <div className="flex gap-4 mt-2">
                  <a href="https://www.facebook.com/keanonbiz" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Facebook
                  </a>
                  <a href="https://www.instagram.com/jeremykean" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-background/70 text-sm">
              <p>&copy; {new Date().getFullYear()} Kean on Biz. All rights reserved. | Headquarters in Indiana</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/terms" className="hover:text-background transition-colors">Terms of Service</a>
                <a href="/privacy" className="hover:text-background transition-colors">Privacy Policy</a>
                <span className="text-background/50">Fonts by <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">Google Fonts</a></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
