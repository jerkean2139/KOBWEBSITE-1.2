import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import CountUp from "@/components/CountUp";
import { ArrowRight, CheckCircle2, ExternalLink, Mail, Phone, Sparkles, Users, Megaphone, Bot, BookOpen, Award, ClipboardCheck, Loader2, Mic, Clock, Heart, FileText, Search, Zap, PhoneCall, Star } from "lucide-react";
import { DIYIcon, DWYIcon, DFYIcon } from "@/components/VehicleIcons";
import { TiltCard } from "@/components/TiltCard";
import { NeuralBackground } from "@/components/NeuralBackground";
import LogoCarousel from "@/components/LogoCarousel";
import { useHeroABTest } from "@/hooks/useHeroABTest";

function NewsletterForm() {
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
      <div className="flex-1 w-full max-w-md">
        <div role="status" aria-live="polite" className="flex items-center gap-3 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <CheckCircle2 className="text-green-400" size={20} aria-hidden="true" />
          <span className="text-green-300 font-medium">You're subscribed! Check your inbox.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
          required
          disabled={status === "loading"}
          aria-label="Email address for newsletter"
          className="flex-1 h-12 px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/30 transition-all disabled:opacity-50"
        />
        <Button 
          type="submit" 
          disabled={status === "loading"}
          className="h-12 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold px-6"
        >
          {status === "loading" ? (
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/70">
        <span className="flex items-center gap-1"><CheckCircle2 size={12} aria-hidden="true" /> No spam</span>
        <span className="flex items-center gap-1"><CheckCircle2 size={12} aria-hidden="true" /> Unsubscribe anytime</span>
      </div>
    </div>
  );
}

export default function Home() {
  const { variant, trackCTAClick } = useHeroABTest();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO 
        title="Jeremy Kean | Business Coach & AI Automation Expert"
        description="Strategic coaching and AI-powered automation for insurance agencies and business owners. 35+ years experience, 100+ businesses helped. Transform your operations with The Manumation Method."
        image="/manumation-book-cover-nobg.png"
      />
      <Navigation />
      <main id="main-content" className="min-h-screen" role="main">
        {/* Hero Section */}
        <section
          aria-labelledby="hero-heading"
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 max-w-full"
        style={{
          background: "linear-gradient(135deg, oklch(0.20 0.08 250) 0%, oklch(0.15 0.06 255) 50%, oklch(0.18 0.07 245) 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
              <radialGradient id="hero-grid-fade" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <mask id="hero-grid-mask">
                <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" mask="url(#hero-grid-mask)" />
          </svg>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 20% 40%, oklch(0.45 0.15 250 / 0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 85% 60%, oklch(0.55 0.12 85 / 0.06) 0%, transparent 70%)",
              animation: "hero-gradient-shift 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent 0%, oklch(0.6 0.15 250 / 0.2) 50%, transparent 100%)" }}
          />
          <style>{`
            @keyframes hero-gradient-shift {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            @keyframes book-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-gradient-shift, .book-float { animation: none !important; }
            }
          `}</style>
        </div>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700]/20 rounded-full mb-6">
                <BookOpen className="text-[#FFD700]" size={16} aria-hidden="true" />
                <p className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">New Book • Available Now</p>
              </div>
              <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                {variant.headline} <span className="text-primary">{variant.highlightedText}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                {variant.subheadline}
              </p>
              
              {/* Social Proof Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <CheckCircle2 className="text-[#FFD700] shrink-0" size={16} aria-hidden="true" />
                  <span className="text-white/90 font-medium text-sm"><CountUp end={100} suffix="+" /> Businesses Helped</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Clock className="text-[#FFD700] shrink-0" size={16} aria-hidden="true" />
                  <span className="text-white/90 font-medium text-sm"><CountUp end={15} suffix="+" /> Hours/Week Saved</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Award className="text-[#FFD700] shrink-0" size={16} aria-hidden="true" />
                  <span className="text-white/90 font-medium text-sm"><CountUp end={35} /> Years Experience</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="text-lg sm:text-xl px-8 sm:px-10 py-6 sm:py-7 min-h-[56px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 w-fit"
                  asChild
                  onClick={() => trackCTAClick("take_assessment")}
                >
                  <a href="/assessment">Take the Free Bottleneck Audit <ArrowRight className="ml-2" aria-hidden="true" /></a>
                </Button>
                <p className="text-white/60 text-sm font-medium tracking-wide">5 minutes. Personalized results. Free.</p>
              </div>
              
              {/* Quick Testimonial - Desktop only to avoid mobile clutter */}
              <div className="hidden md:flex items-center gap-3 mt-6 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 max-w-lg">
                <img src="/testimonial-ryan.jpg" alt="Ryan Templeton" className="w-10 h-10 rounded-full object-cover border-2 border-primary/50 shrink-0" />
                <p className="text-white/80 text-sm italic">"This is the specific blueprint I needed to stop manually grinding and start strategically scaling."</p>
              </div>
              
              {/* Mobile Book CTA */}
              <div className="lg:hidden mt-8 p-6 bg-gradient-to-br from-[#FFD700]/20 to-primary/20 rounded-2xl border-2 border-[#FFD700]/30">
                <div className="flex items-center gap-4">
                  <img
                    src="/manumation-book-cover-nobg.png"
                    alt="The Manumation Method"
                    className="w-20 h-auto rounded-lg shadow-lg"
                  />
                  <div className="flex-1">
                    <p className="text-[#FFD700] text-xs font-bold uppercase mb-1">New Book</p>
                    <h3 className="text-white font-bold text-sm mb-2">The Manumation Method</h3>
                    <Button size="sm" className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-gray-900 font-bold min-h-[44px]" asChild>
                      <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer">
                        Get the Book
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-16">
              <div className="relative max-w-xs mx-auto" style={{ animation: "book-float 6s ease-in-out infinite" }}>
                <div
                  className="absolute -inset-1 rounded-xl opacity-30"
                  style={{ background: "linear-gradient(135deg, oklch(0.6 0.15 250 / 0.4), oklch(0.7 0.15 85 / 0.3), oklch(0.6 0.15 250 / 0.4))", filter: "blur(20px)" }}
                />
                <img
                  src="/manumation-book-cover-nobg.png"
                  alt="The Manumation Method"
                  className="relative rounded-lg transform hover:scale-105 transition-transform duration-300 w-full drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))" }}
                />
              </div>
              <div className="flex justify-center mt-6">
                <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-gray-900 font-bold shadow-xl px-8" asChild>
                  <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer">
                    Get the Book
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" aria-labelledby="about-heading" className="py-16 md:py-24 bg-background relative" style={{ clipPath: "polygon(0 0, 100% 0, 100% 95%, 0 100%)" }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-left" className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl"></div>
                <img
                  src="/jeremy-about-photo.webp"
                  alt="Jeremy Kean - Business Coach with 35 years of experience helping entrepreneurs transform their businesses"
                  className="relative rounded-2xl shadow-2xl w-full h-auto object-cover object-top"
                  style={{ maxHeight: '600px' }}
                  loading="lazy"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-right" className="order-1 md:order-2">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                <p className="text-primary text-sm font-bold uppercase tracking-wider">Meet Jeremy</p>
              </div>
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                35 Years.<br />
                13 Brands Created.<br />
                One Truth.
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                The difference between struggling and scaling isn't working harder – it's building better systems.
              </p>
              <p className="text-base text-muted-foreground mb-4">
                As a husband, father of three, and business owner with A.D.D., I intimately understand the chaos that comes with juggling multiple priorities. That's exactly what drove me to become obsessed with creating systems that actually work in the real world, not just in theory.
              </p>
              <div className="grid grid-cols-1 gap-3 mt-6">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Battle-Tested Results</h3>
                    <p className="text-muted-foreground text-sm">50% reduction in admin work, 70% automation of customer communication</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0" size={20} aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">Systems That Make Sense</h3>
                    <p className="text-muted-foreground text-sm">Built for how your brain—and business—actually function</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section aria-labelledby="philosophy-heading" className="py-16 md:py-24 relative overflow-hidden -mt-16" style={{
        background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.20 0.06 255) 100%)",
        clipPath: "polygon(0 5%, 100% 0, 100% 95%, 0 100%)",
        paddingTop: "8rem"
      }}>
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-primary/20 rounded-full mb-6">
              <p className="text-primary text-sm font-bold uppercase tracking-wider">The Ecosystem</p>
            </div>
            <h2 id="philosophy-heading" className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight knight-rider-scan">
              Strategy. Method. Machine.
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/5 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 hover:bg-white/10 transition-all">
                <div className="text-6xl font-bold text-primary mb-4">01</div>
                <h3 className="text-2xl font-bold text-white mb-2">KeanOnBiz</h3>
                <p className="text-white/80 font-semibold mb-2">gives you the strategy.</p>
                <p className="text-white/70 text-sm">Personal coaching and strategic guidance</p>
              </div>
              <a href="https://manumation.ai/coming-soon" target="_blank" rel="noopener noreferrer" className="bg-white/5 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 hover:bg-white/10 hover:border-primary/60 transition-all group cursor-pointer">
                <div className="text-6xl font-bold text-primary mb-4">02</div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Manumation</h3>
                <p className="text-white/80 font-semibold mb-2">gives you the method.</p>
                <p className="text-white/70 text-sm">The framework that blends human + automation</p>
              </a>
              <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 hover:bg-white/10 hover:border-primary/60 transition-all group cursor-pointer">
                <div className="text-6xl font-bold text-primary mb-4">03</div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Zenoflo</h3>
                <p className="text-white/80 font-semibold mb-2">gives you the machine.</p>
                <p className="text-white/70 text-sm">The tech platform that powers it all</p>
              </a>
            </div>
            <p className="text-xl text-white font-semibold max-w-3xl mx-auto leading-relaxed">
              Together, they're how modern businesses stop duct-taping tools and finally operate with clarity, speed, and soul.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Ecosystem Section */}
      <section id="tech-ecosystem" aria-labelledby="tech-heading" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
              <p className="text-primary text-sm font-bold uppercase tracking-wider">Tech Brands</p>
            </div>
            <h2 id="tech-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Purpose-Built Platforms
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our tech ecosystem leverages industry-leading automation and AI platforms to build custom solutions that actually work for your business.
            </p>
          </div>
          
          <LogoCarousel />

          <div className="text-center mt-12">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine these powerful platforms with custom development to create automation solutions tailored to your specific business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - DIY/DWY/DFY Model with Premium Design */}
      <section 
        id="services" 
        aria-labelledby="services-heading" 
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.12 0.03 250) 0%, oklch(0.08 0.02 260) 50%, oklch(0.10 0.04 240) 100%)",
        }}
      >
        <NeuralBackground />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <AnimatedSection animation="fade-in">
              <div className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full mb-6 border border-primary/30">
                <p className="text-primary text-sm font-bold uppercase tracking-wider">Engagement Levels</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={100}>
              <h2 id="services-heading" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Choose Your <span className="text-[#FFD700]">Journey</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={200}>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                Think of your business transformation like a road trip. You decide how much support you need along the way.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* DIY - Do It Yourself */}
            <AnimatedSection animation="slide-up" delay={0}>
              <TiltCard 
                className="h-full p-6"
                glowColor="rgba(59, 130, 246, 0.4)"
                borderGradient="from-primary via-blue-400 to-primary"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border border-primary/20">
                    <DIYIcon size={72} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Do It Yourself</h3>
                  <p className="text-primary font-medium text-sm">
                    You drive. We're in the back seat.
                  </p>
                </div>
                
                <p className="text-sm text-white/70 text-center mb-6">
                  Access our proven frameworks, templates, and training resources. You're in full control of the implementation.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-primary" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">The Manumation Method book & guides</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-primary" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">Templates & workflow blueprints</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-primary" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">Community support access</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-primary/20 hover:bg-primary/30 text-white border border-primary/30 backdrop-blur-sm" asChild>
                  <a href="/assessment">
                    <ClipboardCheck className="mr-2" size={16} aria-hidden="true" />
                    Take the Bottleneck Audit
                  </a>
                </Button>
              </TiltCard>
            </AnimatedSection>

            {/* DWY - Done With You */}
            <AnimatedSection animation="slide-up" delay={200}>
              <TiltCard 
                className="h-full p-6 relative overflow-visible"
                glowColor="rgba(251, 191, 36, 0.4)"
                borderGradient="from-[#FFD700] via-amber-400 to-[#FFD700]"
              >
                <div className="absolute -top-3 right-4 px-3 py-1 bg-[#FFD700] text-gray-900 text-xs font-bold rounded-full shadow-lg z-10">
                  MOST POPULAR
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FFD700]/30 to-primary/20 flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border border-[#FFD700]/20">
                    <DWYIcon size={72} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Done With You</h3>
                  <p className="text-[#FFD700] font-medium text-sm">
                    You drive. We're in the passenger seat.
                  </p>
                </div>
                
                <p className="text-sm text-white/70 text-center mb-6">
                  Collaborative coaching where we guide you through implementation. You stay in control while we navigate together.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-[#FFD700]" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">1:1 coaching sessions</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-[#FFD700]" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">Custom strategy development</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-[#FFD700]" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">Hands-on guidance & accountability</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-[#FFD700]/20 hover:bg-[#FFD700]/30 text-white border border-[#FFD700]/30 backdrop-blur-sm" asChild>
                  <a href="/assessment">
                    <ClipboardCheck className="mr-2" size={16} aria-hidden="true" />
                    Take the Bottleneck Audit
                  </a>
                </Button>
              </TiltCard>
            </AnimatedSection>

            {/* DFY - Done For You */}
            <AnimatedSection animation="slide-up" delay={400}>
              <TiltCard 
                className="h-full p-6"
                glowColor="rgba(139, 92, 246, 0.4)"
                borderGradient="from-purple-500 via-primary to-purple-500"
              >
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/30 to-primary/20 flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border border-purple-500/20">
                    <DFYIcon size={72} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Done For You</h3>
                  <p className="text-purple-400 font-medium text-sm">
                    We drive. You're in the passenger seat.
                  </p>
                </div>
                
                <p className="text-sm text-white/70 text-center mb-6">
                  Full-service implementation by our expert team. Sit back while we build and optimize your systems.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-purple-400" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">Complete system build-out</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-purple-400" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">AI automation & integrations</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="text-purple-400" size={14} aria-hidden="true" />
                    </div>
                    <span className="text-white/80">Ongoing management & optimization</span>
                  </li>
                </ul>
                
                <Button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-500/30 backdrop-blur-sm" asChild>
                  <a href="/assessment">
                    <ClipboardCheck className="mr-2" size={16} aria-hidden="true" />
                    Take the Bottleneck Audit
                  </a>
                </Button>
              </TiltCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works - Funnel Section */}
      <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a0a12 0%, #0f172a 50%, #0a0a12 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.45 0.15 250 / 0.3) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <AnimatedSection animation="fade-in">
              <div className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full mb-6 border border-primary/30">
                <p className="text-primary text-sm font-bold uppercase tracking-wider">How It Works</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={100}>
              <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Your Path to <span className="text-primary">Freedom</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={200}>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                A proven 5-step journey from overwhelmed operator to confident business owner.
              </p>
            </AnimatedSection>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Desktop: horizontal timeline */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/60 via-[#FFD700]/60 via-50% via-purple-500/60 to-emerald-500/60" aria-hidden="true" />

                <div className="grid grid-cols-5 gap-6">
                  {[
                    { num: 1, icon: <FileText size={28} />, hex: "#3b82f6", title: "Content Drives Traffic", desc: "Blog posts, videos, and insights that attract business owners like you." },
                    { num: 2, icon: <Search size={28} />, hex: "#FFD700", badgeText: "#0f172a", title: "Bottleneck Audit", desc: "Find exactly where your business is stuck in 5 minutes. Free.", cta: { text: "Take the Audit", href: "/assessment" } },
                    { num: 3, icon: <Zap size={28} />, hex: "#a855f7", title: "Automated Nurture", desc: "Personalized follow-up with resources tailored to your results." },
                    { num: 4, icon: <PhoneCall size={28} />, hex: "#2563eb", title: "Discovery Call", desc: "A focused conversation with Jeremy to map your transformation.", cta: { text: "Book a Call", href: "/jeremys-calendar-intro" } },
                    { num: 5, icon: <Star size={28} />, hex: "#10b981", title: "Community & Advocacy", desc: "Join a network of owners building businesses that run without them." },
                  ].map((step, i) => (
                    <AnimatedSection key={step.num} animation="slide-up" delay={i * 150}>
                      <div className="flex flex-col items-center text-center group">
                        <div className="relative z-10 mb-6">
                          <div className="w-28 h-28 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:border-white/25 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10">
                            <div style={{ color: step.hex }}>{step.icon}</div>
                          </div>
                          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg" style={{ backgroundColor: step.hex, color: step.badgeText || '#fff', boxShadow: `0 4px 14px ${step.hex}40` }}>
                            {step.num}
                          </div>
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                        {step.cta && (
                          <a href={step.cta.href} className="inline-flex items-center gap-1.5 text-sm font-semibold mt-3 hover:underline" style={{ color: step.hex }}>
                            {step.cta.text} <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: vertical timeline */}
            <div className="md:hidden space-y-0">
              {[
                { num: 1, icon: <FileText size={24} />, hex: "#3b82f6", title: "Content Drives Traffic", desc: "Blog posts, videos, and insights that attract business owners like you." },
                { num: 2, icon: <Search size={24} />, hex: "#FFD700", badgeText: "#0f172a", title: "Bottleneck Audit", desc: "Find exactly where your business is stuck in 5 minutes. Free.", cta: { text: "Take the Audit", href: "/assessment" } },
                { num: 3, icon: <Zap size={24} />, hex: "#a855f7", title: "Automated Nurture", desc: "Personalized follow-up with resources tailored to your results." },
                { num: 4, icon: <PhoneCall size={24} />, hex: "#2563eb", title: "Discovery Call", desc: "A focused conversation with Jeremy to map your transformation.", cta: { text: "Book a Call", href: "/jeremys-calendar-intro" } },
                { num: 5, icon: <Star size={24} />, hex: "#10b981", title: "Community & Advocacy", desc: "Join a network of owners building businesses that run without them." },
              ].map((step, i) => (
                <AnimatedSection key={step.num} animation="slide-up" delay={i * 100}>
                  <div className="relative flex gap-4 items-start pl-4">
                    {i < 4 && <div className="absolute left-[2.25rem] top-16 bottom-0 w-0.5 bg-white/10" aria-hidden="true" />}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10">
                        <div style={{ color: step.hex }}>{step.icon}</div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: step.hex, color: step.badgeText || '#fff' }}>
                        {step.num}
                      </div>
                    </div>
                    <div className="pb-8 pt-1">
                      <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                      {step.cta && (
                        <a href={step.cta.href} className="inline-flex items-center gap-1.5 text-sm font-semibold mt-2 hover:underline" style={{ color: step.hex }}>
                          {step.cta.text} <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="slide-up" delay={700}>
              <div className="text-center mt-12">
                <p className="text-white/50 mb-6">Most business owners start at Step 2. It takes 5 minutes.</p>
                <Button size="lg" className="text-base px-8 py-6 bg-[#FFD700] hover:bg-[#FFD700]/90 text-gray-900 font-bold shadow-xl shadow-[#FFD700]/20" asChild>
                  <a href="/assessment">
                    Start Your Bottleneck Audit <ArrowRight className="ml-2" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Brand Showcase Section */}
      <section className="py-20 bg-[#0a0a12] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 60% 50% at 15% 30%, oklch(0.45 0.15 250 / 0.3) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 70%, oklch(0.4 0.12 290 / 0.2) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <AnimatedSection animation="fade-in">
              <div className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full mb-4 border border-primary/30">
                <p className="text-primary text-sm font-bold uppercase tracking-wider">Tech Brands</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Purpose-Built <span className="text-primary">Platforms</span>
              </h2>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedSection animation="slide-up" delay={0}>
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-primary/50 rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
                <div className="relative h-full bg-[#0f172a] border border-primary/30 rounded-2xl p-8 hover:bg-[#1a2744] transition-all duration-300">
                  <img src="/zenoflo-logo.svg" alt="Zenoflo - Your Business Command Center" className="h-10 mb-4 object-contain object-left" loading="lazy" />
                  <h3 className="text-xl font-bold text-white mb-2">Your Business Command Center</h3>
                  <p className="text-white/70 mb-6 text-sm">
                    Complete business operating system featuring AI agents, voice automation, and intelligent workflows that adapt to your needs.
                  </p>
                  <Button className="w-full bg-primary/20 hover:bg-primary/30 text-white border border-primary/30" asChild>
                    <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer">
                      Visit Zenoflo.com <ExternalLink className="ml-2" size={16} aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={150}>
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-[#FFD700]/40 rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
                <div className="relative h-full bg-[#0f172a] border border-[#FFD700]/30 rounded-2xl p-8 hover:bg-[#1a2744] transition-all duration-300 overflow-visible">
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-[#FFD700] text-gray-900 text-xs font-bold rounded-full shadow-lg z-10">
                    COMING SOON
                  </div>
                  <img src="/agentmob-logo.png" alt="AgentMob.ai - AI Agent Orchestration Platform" className="h-12 mb-4 object-contain object-left" loading="lazy" />
                  <h3 className="text-xl font-bold text-white mb-2">AI Agent Orchestration Platform</h3>
                  <p className="text-white/70 mb-6 text-sm">
                    Central hub for AI agents that connect through intelligent orchestration, enabling seamless automation across your entire business.
                  </p>
                  <Button className="w-full bg-[#FFD700]/20 hover:bg-[#FFD700]/30 text-white border border-[#FFD700]/30 cursor-default" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* MicroPod Teaser Section - HIDDEN until podcast is ready
      <section className="py-16 bg-background">
        ...MicroPod content hidden...
      </section>
      */}

      {/* Testimonials Section */}
      <section id="testimonials" aria-labelledby="testimonials-heading" className="py-16 md:py-24 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, oklch(0.25 0.08 250) 0%, oklch(0.18 0.06 255) 50%, oklch(0.22 0.07 245) 100%)",
      }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse 60% 50% at 10% 20%, oklch(0.45 0.15 250 / 0.4) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 90% 80%, oklch(0.55 0.12 85 / 0.3) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <AnimatedSection animation="fade-in">
              <div className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full mb-6 border border-primary/30">
                <p className="text-primary text-sm font-bold uppercase tracking-wider">Testimonials</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={100}>
              <h2 id="testimonials-heading" className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Real Results, <span className="bg-gradient-to-r from-primary via-[#FFD700] to-primary bg-clip-text text-transparent">Real Stories</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={200}>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                Business owners who transformed their operations with The Manumation Method
              </p>
            </AnimatedSection>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <AnimatedSection animation="slide-up" delay={0}>
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-[#FFD700]/40 rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative h-full bg-[#0f172a] border-[#FFD700]/30 rounded-2xl overflow-hidden hover:bg-[#1a2744] transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/testimonial-jason.webp" alt="Jason Elkins" className="w-12 h-12 rounded-full object-cover border-2 border-[#FFD700]/50" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Jason Elkins</h3>
                      <p className="text-white/70 text-xs">100 Cups Consulting</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed flex-grow">
                    "The Manumation Method gave me permission to simplify, evaluate problems quickly, and implement solutions without the decision-fatigue spiral. Finally, a framework that works for my brain."
                  </p>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={100}>
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-primary/40 rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative h-full bg-[#0f172a] border-primary/30 rounded-2xl overflow-hidden hover:bg-[#1a2744] transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/testimonial-ryan.jpg" alt="Ryan Templeton" className="w-12 h-12 rounded-full object-cover border-2 border-primary/50" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Ryan Templeton</h3>
                      <p className="text-white/70 text-xs">Founder, Premier Health Advisors</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed flex-grow">
                    "Jeremy bridges the gap between 'tech' and 'tactical.' This isn't just theory; it is the specific blueprint I needed to stop manually grinding and start strategically scaling. If you want to build a machine that works <em>for</em> you, read this."
                  </p>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={200}>
            <div className="group relative h-full">
              <div className="absolute -inset-0.5 bg-[#FFD700]/40 rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative h-full bg-[#0f172a] border-[#FFD700]/30 rounded-2xl overflow-hidden hover:bg-[#1a2744] transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/testimonial-beth.jpg" alt="Beth Prince" className="w-12 h-12 rounded-full object-cover border-2 border-[#FFD700]/50" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Beth Prince</h3>
                      <p className="text-white/70 text-xs">State Farm Insurance Agent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed flex-grow">
                    "I was afraid automation would make my business feel robotic, but Jeremy proved the opposite. This method allowed me to 'clone' my values and voice, giving me more time with clients. A total game-changer."
                  </p>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* OLD Testimonials Section - TEMPORARILY COMMENTED OUT
            <AnimatedSection animation="slide-up" delay={300}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#6d28d9] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#2e1065] border-[#6d28d9] rounded-2xl overflow-hidden hover:bg-[#3b1a7d] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "Jeremy helped us scale from 2 to 8 agents without adding administrative overhead."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#6d28d9]/30 rounded-xl">
                    <p className="text-sm text-[#c4b5fd] font-medium">• Streamlined onboarding process</p>
                    <p className="text-sm text-[#c4b5fd] font-medium">• 4x team growth in 12 months</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-4.webp" alt="Heather K." className="w-14 h-14 rounded-full object-cover border-2 border-[#6d28d9] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Heather K.</h3>
                      <p className="text-white/60 text-sm">Agency Principal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={400}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#1e3a5f] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#0f172a] border-[#1e3a5f] rounded-2xl overflow-hidden hover:bg-[#1a2744] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "The coaching gave me clarity on what to automate and what to keep personal."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#1e3a5f]/30 rounded-xl">
                    <p className="text-sm text-[#60a5fa] font-medium">• Doubled client satisfaction scores</p>
                    <p className="text-sm text-[#60a5fa] font-medium">• Cut response time from 24hrs to 2hrs</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-5.webp" alt="Ashley R." className="w-14 h-14 rounded-full object-cover border-2 border-[#1e3a5f] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Ashley R.</h3>
                      <p className="text-white/60 text-sm">Independent Agent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={500}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#4c1d95] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#1e1b4b] border-[#4c1d95] rounded-2xl overflow-hidden hover:bg-[#2e2866] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "Best investment I've made in my business. Systems that actually stick."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#4c1d95]/30 rounded-xl">
                    <p className="text-sm text-[#a78bfa] font-medium">• Eliminated manual data entry</p>
                    <p className="text-sm text-[#a78bfa] font-medium">• Increased revenue by 28%</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-6.jpg" alt="Erica T." className="w-14 h-14 rounded-full object-cover border-2 border-[#4c1d95] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Erica T.</h3>
                      <p className="text-white/60 text-sm">Small Business Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={600}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#1e40af] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#172554] border-[#1e40af] rounded-2xl overflow-hidden hover:bg-[#1e3a6e] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "Jeremy's approach to automation is practical and immediately actionable."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#1e40af]/30 rounded-xl">
                    <p className="text-sm text-[#93c5fd] font-medium">• Automated renewal reminders</p>
                    <p className="text-sm text-[#93c5fd] font-medium">• Retention rate up to 94%</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-7.jpg" alt="Amy L." className="w-14 h-14 rounded-full object-cover border-2 border-[#1e40af] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Amy L.</h3>
                      <p className="text-white/60 text-sm">Insurance Broker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={700}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#6d28d9] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#2e1065] border-[#6d28d9] rounded-2xl overflow-hidden hover:bg-[#3b1a7d] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "Went from drowning in admin work to focusing on what I do best—selling."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#6d28d9]/30 rounded-xl">
                    <p className="text-sm text-[#c4b5fd] font-medium">• Freed up 20+ hours monthly</p>
                    <p className="text-sm text-[#c4b5fd] font-medium">• Closed 40% more policies</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-8.webp" alt="Ryan P." className="w-14 h-14 rounded-full object-cover border-2 border-[#6d28d9] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Ryan P.</h3>
                      <p className="text-white/60 text-sm">Sales Executive</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={800}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#1e3a5f] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#0f172a] border-[#1e3a5f] rounded-2xl overflow-hidden hover:bg-[#1a2744] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "The systems we built together have been game-changing for our agency growth."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#1e3a5f]/30 rounded-xl">
                    <p className="text-sm text-[#60a5fa] font-medium">• Scaled to 3 locations</p>
                    <p className="text-sm text-[#60a5fa] font-medium">• Consistent processes across all offices</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-9.webp" alt="Anissa W." className="w-14 h-14 rounded-full object-cover border-2 border-[#1e3a5f] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Anissa W.</h3>
                      <p className="text-white/60 text-sm">Multi-Location Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={900}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#4c1d95] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#1e1b4b] border-[#4c1d95] rounded-2xl overflow-hidden hover:bg-[#2e2866] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "Jeremy understands insurance agencies. His solutions are built for our reality."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#4c1d95]/30 rounded-xl">
                    <p className="text-sm text-[#a78bfa] font-medium">• Automated claims tracking</p>
                    <p className="text-sm text-[#a78bfa] font-medium">• Customer complaints down 65%</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-10.webp" alt="Paula G." className="w-14 h-14 rounded-full object-cover border-2 border-[#4c1d95] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Paula G.</h3>
                      <p className="text-white/60 text-sm">Claims Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={1000}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#1e40af] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#172554] border-[#1e40af] rounded-2xl overflow-hidden hover:bg-[#1e3a6e] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "Finally have the work-life balance I've been chasing for years."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#1e40af]/30 rounded-xl">
                    <p className="text-sm text-[#93c5fd] font-medium">• Left office by 5pm daily</p>
                    <p className="text-sm text-[#93c5fd] font-medium">• Revenue actually increased 22%</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-11.webp" alt="Nicci D." className="w-14 h-14 rounded-full object-cover border-2 border-[#1e40af] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Nicci D.</h3>
                      <p className="text-white/60 text-sm">Agency Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={1100}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#6d28d9] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#2e1065] border-[#6d28d9] rounded-2xl overflow-hidden hover:bg-[#3b1a7d] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "The AI voice agents Jeremy set up handle 70% of our inbound calls now."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#6d28d9]/30 rounded-xl">
                    <p className="text-sm text-[#c4b5fd] font-medium">• 24/7 customer support coverage</p>
                    <p className="text-sm text-[#c4b5fd] font-medium">• Staff focused on complex cases</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-1.jpg" alt="Cody M." className="w-14 h-14 rounded-full object-cover border-2 border-[#6d28d9] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Cody M.</h3>
                      <p className="text-white/60 text-sm">Tech Director</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={1200}>
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-[#1e3a5f] rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
              <Card className="relative bg-[#0f172a] border-[#1e3a5f] rounded-2xl overflow-hidden hover:bg-[#1a2744] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6 text-[#FFD700]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic leading-relaxed">
                    "Jeremy helped us transition from chaos to clarity. Our team is thriving."
                  </p>
                  <div className="space-y-2 mb-6 p-4 bg-[#1e3a5f]/30 rounded-xl">
                    <p className="text-sm text-[#60a5fa] font-medium">• Employee satisfaction up 45%</p>
                    <p className="text-sm text-[#60a5fa] font-medium">• Zero turnover in 18 months</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src="/testimonial-2.webp" alt="Missy H." className="w-14 h-14 rounded-full object-cover border-2 border-[#1e3a5f] group-hover:border-[#FFD700] transition-colors duration-300" loading="lazy" />
                    <div>
                      <h3 className="font-bold text-white text-lg">Missy H.</h3>
                      <p className="text-white/60 text-sm">HR Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      END Testimonials Section - TEMPORARILY COMMENTED OUT */}

      {/* For Business Coaches CTA - HIDDEN until coaching program launches
      <section className="py-20 bg-[#0f172a] relative overflow-hidden">
        ...Coaching CTA content hidden...
      </section>
      */}

      {/* Bottleneck Audit CTA */}
      <section id="assessment" className="py-20 bg-[#0a0a12] relative overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(ellipse 70% 60% at 30% 50%, oklch(0.45 0.15 250 / 0.35) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 75% 50%, oklch(0.55 0.12 85 / 0.25) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fade-in">
              <div className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full mb-6 border border-primary/30">
                <p className="text-primary text-sm font-bold uppercase tracking-wider">Bottleneck Audit</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={100}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Discover Your <span className="text-primary">Bottleneck Score</span>
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={200}>
              <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
                Identify exactly where intelligent automation will free up your time, grow your revenue, and simplify your operations.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="slide-up" delay={300}>
              <div className="group relative inline-block">
                <div className="absolute -inset-1 bg-primary/40 rounded-2xl opacity-50 group-hover:opacity-80 blur transition-all duration-300"></div>
                <div className="relative bg-[#0f172a] border border-primary/30 rounded-2xl p-8">
                  <div className="flex items-center justify-center gap-8 text-sm text-white/70 flex-wrap mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="text-primary" size={14} aria-hidden="true" />
                      </div>
                      <span>5 Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                        <CheckCircle2 className="text-[#FFD700]" size={14} aria-hidden="true" />
                      </div>
                      <span>Personalized Results</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <CheckCircle2 className="text-purple-400" size={14} aria-hidden="true" />
                      </div>
                      <span>Free</span>
                    </div>
                  </div>
                  <Button size="lg" className="text-lg px-10 py-6 bg-[#FFD700] hover:bg-[#FFD700]/90 text-gray-900 font-bold border-0" style={{ boxShadow: "0 4px 0 #b89700, 0 8px 20px rgba(255, 215, 0, 0.3)" }} asChild>
                    <a href="/assessment">
                      Start Your Bottleneck Audit <ArrowRight className="ml-2" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Newsletter Signup - Compact Dark Design */}
      <section className="py-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #172554 100%)' }}>
        <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(ellipse 50% 50% at 75% 10%, oklch(0.45 0.15 250 / 0.3) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 25% 90%, oklch(0.55 0.12 85 / 0.2) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Mail className="text-[#FFD700]" size={20} aria-hidden="true" />
                  <span className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">Newsletter</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  Get Biweekly Business Insights
                </h3>
                <p className="text-white/70 text-sm">
                  AI, automation & systems strategies delivered free.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Agent Coaching */}
      <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1220 0%, #162032 50%, #0f172a 100%)" }}>
        <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(ellipse 50% 50% at 70% 40%, oklch(0.5 0.12 220 / 0.25) 0%, transparent 70%)" }} />
        <div className="container relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-primary/25">
                <Star className="w-4 h-4" aria-hidden="true" />
                Insurance Agents
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Coaching & Tools Built for Insurance Agents
              </h2>
              <p className="text-white/70 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Specialized coaching, AI-powered tools, and proven systems designed to help insurance agents streamline operations, close more deals, and scale their book of business.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-base"
                asChild
              >
                <a href="https://pocketcoach.one" target="_blank" rel="noopener noreferrer">
                  Explore PocketCoach <ExternalLink className="ml-2 w-5 h-5" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Giving Back Section */}
      <section className="py-20 relative overflow-hidden bg-[#f8f9fa]">
        <div className="container relative z-10">
          <AnimatedSection animation="fade-in">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="order-2 md:order-1">
                  <div className="inline-flex items-center gap-2 bg-gray-900/10 text-gray-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                    <Heart className="w-4 h-4 text-red-500" aria-hidden="true" />
                    Giving Back in 2026
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    Business With Purpose
                  </h2>
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                    For every new client in 2026, we sponsor one child through Kingdom Legacy Ministries.
                  </p>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    Building a business that matters means investing in the next generation. Kingdom Legacy Ministries provides education, nutrition, and community support to children who need it most.
                  </p>
                  <Button 
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-6 text-base"
                    asChild
                  >
                    <a href="https://www.kingdomlegacyministries.org" target="_blank" rel="noopener noreferrer">
                      Learn About Kingdom Legacy <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
                <div className="order-1 md:order-2">
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src="/kingdom-legacy-giving-back.webp"
                      alt="Children supported through Kingdom Legacy Ministries"
                      className="w-full h-auto object-cover"
                      width="600"
                      height="338"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Follow Jeremy - Social Section */}
      <section className="py-12 relative overflow-hidden bg-[#0a0a12]">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Follow Jeremy</h3>
            <p className="text-white/60 text-sm mb-6">Stay connected for daily insights on business systems, AI automation, and leadership.</p>
            <div className="flex justify-center gap-6">
              <a href="https://www.linkedin.com/in/jeremykean" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/70 group-hover:text-primary transition-colors" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <span className="text-white/50 text-xs font-medium group-hover:text-white/80 transition-colors">LinkedIn</span>
              </a>
              <a href="https://www.facebook.com/keanonbiz" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/70 group-hover:text-primary transition-colors" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <span className="text-white/50 text-xs font-medium group-hover:text-white/80 transition-colors">Facebook</span>
              </a>
              <a href="https://www.youtube.com/@keanonbiz" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/70 group-hover:text-primary transition-colors" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <span className="text-white/50 text-xs font-medium group-hover:text-white/80 transition-colors">YouTube</span>
              </a>
              <a href="https://www.instagram.com/jeremykean" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/70 group-hover:text-primary transition-colors" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
                </div>
                <span className="text-white/50 text-xs font-medium group-hover:text-white/80 transition-colors">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>


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
                <button onClick={() => scrollToSection("about")} className="text-background/70 hover:text-background transition-colors text-left text-sm">
                  About
                </button>
                <button onClick={() => scrollToSection("services")} className="text-background/70 hover:text-background transition-colors text-left text-sm">
                  Services
                </button>
                <button onClick={() => scrollToSection("testimonials")} className="text-background/70 hover:text-background transition-colors text-left text-sm">
                  Results
                </button>
                <a href="/jeremys-calendar-intro" className="text-background/70 hover:text-background transition-colors text-sm">
                  Book a Discovery Call
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
              <div className="flex flex-col gap-3">
                <a href="mailto:support@keanonbiz.com" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm">
                  <Mail size={16} aria-hidden="true" />
                  support@keanonbiz.com
                </a>
                <a href="tel:+17653906007" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors text-sm">
                  <Phone size={16} aria-hidden="true" />
                  (765) 390-6007
                </a>
                <div className="flex gap-4 mt-2">
                  <a href="https://www.linkedin.com/in/jeremykean" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors" aria-label="Follow Jeremy on LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="https://www.facebook.com/keanonbiz" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors" aria-label="Follow Jeremy on Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@keanonbiz" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors" aria-label="Follow Jeremy on YouTube">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/jeremykean" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors" aria-label="Follow Jeremy on Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
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
      </main>
    </>
  );
}
