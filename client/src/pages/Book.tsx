import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BookOpen, Users, Sparkles, Clock, Award, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import CountdownTimer from "@/components/CountdownTimer";
import CountUp from "@/components/CountUp";

export default function Book() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a12]">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20"
              style={{ 
                backgroundColor: "#3b82f6",
                filter: "blur(120px)"
              }}
            />
            <div 
              className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15"
              style={{ 
                backgroundColor: "#FFD700",
                filter: "blur(100px)"
              }}
            />
          </div>
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection animation="slide-left">
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-[#FFD700]/30"
                  style={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                >
                  <BookOpen className="text-[#FFD700]" size={16} />
                  <p className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">New Book • Available Now</p>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  The Manumation <span className="text-[#3b82f6]">Method</span>
                </h1>
                <p className="text-xl text-white/80 mb-6 leading-relaxed">
                  The strategic fusion of human ingenuity and AI automation that transforms business experiences while creating true freedom for innovative thinkers.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: "4px 4px 0 rgba(59, 130, 246, 0.3), 8px 8px 0 rgba(59, 130, 246, 0.1)"
                    }}
                  >
                    <CheckCircle2 className="text-[#3b82f6]" size={20} />
                    <span className="text-white font-semibold text-sm"><CountUp end={100} suffix="+" /> Businesses Helped</span>
                  </div>
                  <div 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      boxShadow: "4px 4px 0 rgba(255, 215, 0, 0.3), 8px 8px 0 rgba(255, 215, 0, 0.1)"
                    }}
                  >
                    <Award className="text-[#FFD700]" size={20} />
                    <span className="text-white font-semibold text-sm">35 Years Experience</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-[#FFD700] text-gray-900 font-bold border-0"
                    style={{
                      boxShadow: "0 4px 0 #b89700, 0 8px 20px rgba(255, 215, 0, 0.3)"
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
                    backgroundColor: "#13131f",
                    boxShadow: "-8px 8px 0 rgba(59, 130, 246, 0.4), 8px -8px 0 rgba(255, 215, 0, 0.4), 0 25px 50px rgba(0,0,0,0.5)"
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

        <section className="py-24 bg-white relative">
          <div className="container">
            <div className="text-center mb-16">
              <AnimatedSection animation="fade-in">
                <div className="inline-block px-4 py-2 bg-[#3b82f6]/10 rounded-full mb-4 border border-[#3b82f6]/20">
                  <p className="text-[#3b82f6] text-sm font-bold uppercase tracking-wider">What You'll Learn</p>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={100}>
                <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a12] mb-6">
                  Transform Your Business
                </h2>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={200}>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The Manumation Method provides a complete framework for building systems that work—without losing the human touch that makes your business special.
                </p>
              </AnimatedSection>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <AnimatedSection animation="slide-up" delay={0}>
                <div 
                  className="h-full p-8 rounded-2xl bg-white border-2 border-gray-100"
                  style={{
                    boxShadow: "8px 8px 0 rgba(59, 130, 246, 0.15), 0 10px 40px rgba(0,0,0,0.05)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-[#3b82f6]/10 border border-[#3b82f6]/20"
                  >
                    <Clock className="text-[#3b82f6]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a0a12] mb-3">Reclaim Your Time</h3>
                  <p className="text-gray-600">
                    Learn how to identify and automate the tasks that drain your energy, freeing up hours every week for high-value work.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={150}>
                <div 
                  className="h-full p-8 rounded-2xl bg-white border-2 border-gray-100"
                  style={{
                    boxShadow: "8px 8px 0 rgba(255, 215, 0, 0.25), 0 10px 40px rgba(0,0,0,0.05)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-[#FFD700]/10 border border-[#FFD700]/30"
                  >
                    <Sparkles className="text-[#d4a800]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a0a12] mb-3">AI That Works For You</h3>
                  <p className="text-gray-600">
                    Discover practical AI applications that enhance (not replace) human connection in your business.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={300}>
                <div 
                  className="h-full p-8 rounded-2xl bg-white border-2 border-gray-100"
                  style={{
                    boxShadow: "8px 8px 0 rgba(139, 92, 246, 0.2), 0 10px 40px rgba(0,0,0,0.05)"
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-purple-100 border border-purple-200"
                  >
                    <Users className="text-purple-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0a0a12] mb-3">Scale With Soul</h3>
                  <p className="text-gray-600">
                    Build systems that grow your business while maintaining the personal touch your clients love.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#0a0a12] relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
              style={{ 
                backgroundColor: "#3b82f6",
                filter: "blur(150px)"
              }}
            />
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="fade-in">
                <div className="text-center mb-12">
                  <div className="inline-block px-4 py-2 bg-[#3b82f6]/20 rounded-full mb-4 border border-[#3b82f6]/30">
                    <p className="text-[#3b82f6] text-sm font-bold uppercase tracking-wider">Inside The Book</p>
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
                          ? "4px 4px 0 rgba(59, 130, 246, 0.2)" 
                          : "4px 4px 0 rgba(255, 215, 0, 0.2)"
                      }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: index % 2 === 0 ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 215, 0, 0.2)" }}
                      >
                        <CheckCircle2 
                          className={index % 2 === 0 ? "text-[#3b82f6]" : "text-[#FFD700]"} 
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

        <section className="py-20 bg-[#f8f9fa] relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <AnimatedSection animation="fade-in">
                <h2 className="text-4xl md:text-5xl font-bold text-[#0a0a12] mb-6 leading-tight">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Pre-order The Manumation Method now and be the first to receive it when it launches December 31st.
                </p>
              </AnimatedSection>
              <AnimatedSection animation="slide-up" delay={100}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-[#3b82f6] text-white font-bold border-0"
                    style={{
                      boxShadow: "0 4px 0 #2563eb, 0 8px 20px rgba(59, 130, 246, 0.3)"
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
                    className="text-lg px-8 py-6 text-[#0a0a12] border-2 border-gray-300 bg-white"
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

        <footer className="bg-[#0a0a12] text-white py-12 border-t border-white/10">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <img 
                  src="/kean-on-biz-logo.webp" 
                  alt="Kean on Biz" 
                  className="h-10 mb-4"
                />
                <p className="text-white/70 text-sm">
                  Building better systems for modern businesses. Strategy, method, and machine – all in one ecosystem.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <a href="/#about" className="text-white/70 text-sm">
                    About
                  </a>
                  <a href="/#services" className="text-white/70 text-sm">
                    Services
                  </a>
                  <a href="/#testimonials" className="text-white/70 text-sm">
                    Results
                  </a>
                  <a href="/jeremys-calendar" className="text-white/70 text-sm">
                    Book a Call
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white/80">Get In Touch</h4>
                <div className="flex flex-col gap-3">
                  <a href="mailto:support@keanonbiz.com" className="flex items-center gap-2 text-white/70 text-sm">
                    <Mail size={16} aria-hidden="true" />
                    support@keanonbiz.com
                  </a>
                  <div className="flex gap-4 mt-2">
                    <a href="https://www.facebook.com/keanonbiz" target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm">
                      Facebook
                    </a>
                    <a href="https://www.instagram.com/jeremykean" target="_blank" rel="noopener noreferrer" className="text-white/70 text-sm">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-white/70 text-sm">
              <p>&copy; {new Date().getFullYear()} Kean on Biz. All rights reserved. | Headquarters in Indiana</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
