import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ArrowLeft, Mail, Award, Users, Lightbulb, Rocket } from "lucide-react";
import { Link } from "wouter";

export default function ManumationCoach() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen" role="main">
        <section
          aria-labelledby="coach-heading"
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
          style={{
            background: "linear-gradient(135deg, oklch(0.20 0.08 250) 0%, oklch(0.15 0.06 255) 50%, oklch(0.18 0.07 245) 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]"></div>
          </div>
          
          <div className="container relative z-10 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection animation="fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700]/20 rounded-full mb-6">
                  <Award className="text-[#FFD700]" size={16} />
                  <p className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">Coming Soon</p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={100}>
                <h1 id="coach-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Become a Certified <span className="text-primary">Manumation Coach</span>
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={200}>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join an elite group of business coaches trained in The Manumation Method. Help other entrepreneurs blend human ingenuity with AI automation to transform their businesses.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="scale" delay={300}>
                <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 max-w-xl mx-auto mb-12">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Be the First to Know</h2>
                    <p className="text-white/80 mb-6">
                      We're building something special. Enter your email to get notified when applications open.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-gray-900 font-bold px-6">
                        Notify Me
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection animation="fade-in" delay={400}>
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                      <Lightbulb className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Master the Method</h3>
                    <p className="text-white/70 text-sm">
                      Deep training in The Manumation Method framework
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                      <Users className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Join the Community</h3>
                    <p className="text-white/70 text-sm">
                      Connect with certified coaches worldwide
                    </p>
                  </div>
                  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                      <Rocket className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Build Your Practice</h3>
                    <p className="text-white/70 text-sm">
                      Tools and support to grow your coaching business
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-in" delay={500}>
                <Link href="/">
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                    <ArrowLeft className="mr-2" size={16} />
                    Back to Home
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
