import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Cog,
  Workflow,
  Clock,
  PhoneCall,
  BookOpen,
  Zap,
  BarChart3,
  Layers,
  Settings,
  Target,
} from "lucide-react";

const AUTOMATION_STAGES = [
  {
    number: "01",
    title: "Audit & Map",
    description: "We map every process in your business — who does what, how long it takes, and where the bottlenecks hide. No guesswork.",
    details: ["Process documentation", "Time audit", "Bottleneck identification", "Priority scoring"],
  },
  {
    number: "02",
    title: "Systematize",
    description: "Before anything gets automated, it gets systematized. SOPs, checklists, and decision trees so humans can do it consistently first.",
    details: ["Standard operating procedures", "Decision frameworks", "Role clarity", "Training materials"],
  },
  {
    number: "03",
    title: "Automate",
    description: "Now we automate the repetitive parts — follow-ups, reminders, data entry, reporting. The stuff that eats your team's time.",
    details: ["Workflow automation", "CRM sequences", "Automated reporting", "Integration setup"],
  },
  {
    number: "04",
    title: "Measure & Optimize",
    description: "Dashboards and KPIs so you can see what's working. Monthly reviews to tighten what's loose and scale what's winning.",
    details: ["Performance dashboards", "KPI tracking", "Monthly optimization", "Scaling playbooks"],
  },
];

const USE_CASES = [
  {
    icon: Users,
    title: "Client Onboarding",
    before: "Manual emails, missed steps, inconsistent experience",
    after: "Automated welcome sequence, document collection, and status updates",
  },
  {
    icon: TrendingUp,
    title: "Lead Follow-Up",
    before: "Leads go cold because nobody followed up within 24 hours",
    after: "Instant response, multi-touch sequences, automatic pipeline updates",
  },
  {
    icon: Clock,
    title: "Renewals & Retention",
    before: "Reactive renewals at 30 days, no proactive outreach",
    after: "90-day automated lifecycle with human touchpoints where they matter",
  },
  {
    icon: BarChart3,
    title: "Reporting & Visibility",
    before: "Spreadsheets updated monthly (if someone remembers)",
    after: "Real-time dashboards showing pipeline, revenue, and team performance",
  },
  {
    icon: Layers,
    title: "Team Operations",
    before: "Everyone does it differently, no accountability, tribal knowledge",
    after: "Documented SOPs, clear KPIs, daily huddle structure",
  },
  {
    icon: Settings,
    title: "Tech Stack Integration",
    before: "5 tools that don't talk to each other, double data entry",
    after: "Connected systems with automatic data flow between platforms",
  },
];

const RESULTS = [
  { metric: "15-30", label: "Hours/Week Saved", sublabel: "per team member" },
  { metric: "60%", label: "Fewer Manual Tasks", sublabel: "within 90 days" },
  { metric: "2-5x", label: "Faster Response Times", sublabel: "to leads and clients" },
  { metric: "100+", label: "Businesses Transformed", sublabel: "across industries" },
];

const RELATED_POSTS = [
  {
    slug: "insurance-agency-tech-stack-7-tools-save-time",
    title: "The Tech Stack: 7 Tools That Actually Save Time",
  },
  {
    slug: "automate-insurance-renewals-without-losing-personal-touch",
    title: "How to Automate Renewals Without Losing the Personal Touch",
  },
  {
    slug: "solo-agent-to-agency-owner-systems-before-hiring",
    title: "From Solo to Owner: Systems You Need Before You Hire",
  },
  {
    slug: "insurance-agency-bottleneck-nobody-talks-about",
    title: "The Bottleneck Nobody Talks About",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Business Automation Coaching — KeanOnBiz",
  "description": "The Manumation Method: systematize first, automate second. Strategic coaching for business owners who want to build operations that run without them.",
  "provider": {
    "@type": "Person",
    "name": "Jeremy Kean",
    "jobTitle": "Business Coach & Automation Strategist",
    "url": "https://keanonbiz.com/about",
  },
  "areaServed": "US",
  "serviceType": "Business Coaching",
  "url": "https://keanonbiz.com/business-automation",
};

export default function BusinessAutomation() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SEO
        title="Business Automation Coaching | The Manumation Method | KeanOnBiz"
        description="Systematize first, automate second. The Manumation Method helps business owners build operations that run without them. 35+ years experience, 100+ businesses transformed."
        image="/manumation-book-cover-new.png"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      <main id="main-content">
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 pb-16">
          <div className="absolute inset-0" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 30% 40%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 60%, rgba(220,38,38,0.08) 0%, transparent 60%)",
              }}
            />
          </div>

          <div className="container relative z-10 max-w-6xl">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: "Home", href: "/" },
                { label: "Business Automation" },
              ]}
              className="mb-8"
            />

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/15 rounded-full border border-red-500/25 mb-6">
                  <Cog className="text-red-400" size={14} />
                  <span className="text-red-400 text-xs font-bold uppercase tracking-widest">
                    The Manumation Method
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white mb-6 leading-[1.1]">
                  Systematize First.{" "}
                  <span className="text-red-500">Automate Second.</span>
                </h1>

                <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                  Most businesses jump straight to automation and wonder why it doesn't
                  stick. The Manumation Method starts with systems — the human processes
                  that make automation actually work.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 text-base font-semibold"
                  >
                    <a href="/jeremys-calendar-intro">
                      Book a Discovery Call <ArrowRight className="ml-2" size={18} />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-base"
                  >
                    <a href="/assessment">
                      Take the Bottleneck Audit
                    </a>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                  <h2 className="text-xl font-bold text-white mb-6">The Problem With "Just Automate It"</h2>
                  <div className="space-y-4 text-white/70 text-sm leading-relaxed">
                    <p>
                      You bought the CRM. Set up the sequences. Maybe even hired someone
                      to "do the tech." Six months later, half of it's broken and your
                      team went back to the old way.
                    </p>
                    <p>
                      That's because automation without systems is just faster chaos.
                      The Manumation Method fixes the process first — then automates it
                      so it actually sticks.
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-red-400 text-xs font-semibold">
                      <Workflow size={14} />
                      <span>Human ingenuity + disciplined processes + smart automation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-900/50">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  The 4-Stage Process
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Every engagement follows the same proven path. No shortcuts.
                  No skipping straight to software.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {AUTOMATION_STAGES.map((stage, i) => (
                <AnimatedSection key={stage.title} delay={i * 0.1}>
                  <div className="bg-gray-900/80 border border-white/10 rounded-xl p-6 h-full">
                    <span className="text-red-500 text-3xl font-bold opacity-40">{stage.number}</span>
                    <h3 className="text-lg font-bold text-white mt-2 mb-3">{stage.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">{stage.description}</p>
                    <ul className="space-y-1.5">
                      {stage.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2">
                          <CheckCircle2 className="text-red-500/60 flex-shrink-0" size={12} />
                          <span className="text-white/40 text-xs">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-950">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Before & After
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Here's what changes when you systematize and automate the right things.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {USE_CASES.map((uc, i) => (
                <AnimatedSection key={uc.title} delay={i * 0.08}>
                  <div className="bg-gray-900/60 border border-white/10 rounded-xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <uc.icon className="text-red-500" size={22} />
                      <h3 className="text-base font-bold text-white">{uc.title}</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-red-400/60 text-[10px] uppercase tracking-wider font-semibold mb-1">Before</p>
                        <p className="text-white/50 text-sm">{uc.before}</p>
                      </div>
                      <div className="border-t border-white/5 pt-3">
                        <p className="text-green-400/60 text-[10px] uppercase tracking-wider font-semibold mb-1">After</p>
                        <p className="text-white/70 text-sm">{uc.after}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-900/50">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Results That Matter
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {RESULTS.map((r, i) => (
                <AnimatedSection key={r.label} delay={i * 0.1}>
                  <div className="text-center p-6 bg-gray-900/80 border border-white/10 rounded-xl">
                    <p className="text-3xl md:text-4xl font-bold text-red-500 mb-1">{r.metric}</p>
                    <p className="text-white font-semibold text-sm mb-1">{r.label}</p>
                    <p className="text-white/40 text-xs">{r.sublabel}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-950">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  About Jeremy Kean
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start bg-gray-900/60 border border-white/10 rounded-2xl p-8 md:p-10">
                <img
                  src="/jeremy-about-photo.webp"
                  alt="Jeremy Kean - Business Coach & Automation Expert"
                  width={200}
                  height={200}
                  className="w-40 h-40 md:w-full md:h-auto rounded-xl object-cover object-top mx-auto"
                  loading="lazy"
                />
                <div>
                  <p className="text-white/70 leading-relaxed mb-4">
                    Jeremy Kean has spent 35+ years building and scaling businesses. He's created
                    13 brands, coached 100+ business owners, and developed The Manumation Method —
                    a practical framework for business owners who are ready to stop doing everything
                    themselves.
                  </p>
                  <p className="text-white/70 leading-relaxed mb-4">
                    His approach is different: systematize first, automate second, scale third.
                    No buzzwords, no dashboards for the sake of dashboards. Just the systems,
                    processes, and training that make your business run without you in the middle
                    of every decision.
                  </p>
                  <p className="text-white/70 leading-relaxed mb-4">
                    The three-brand ecosystem behind the method:{" "}
                    <strong className="text-white">KeanOnBiz</strong> (coaching & consulting),{" "}
                    <strong className="text-white">Manumation</strong> (the framework & methodology), and{" "}
                    <strong className="text-white">Zenoflo</strong> (the software engine that powers the
                    automation tools, dashboards, and workflows clients use day-to-day).
                  </p>
                  <p className="text-white/70 leading-relaxed mb-6">
                    Whether you run an insurance agency, a service business, or a growing team,
                    the principles are the same: document it, delegate it, and build the
                    discipline to let it run.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      <Link href="/about">Full Bio</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      <Link href="/book">The Manumation Method</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-20 bg-gray-900/50">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-10">
                <BookOpen className="text-red-500 mx-auto mb-4" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Related Resources
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {RELATED_POSTS.map((post, i) => (
                <AnimatedSection key={post.slug} delay={i * 0.06}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block bg-gray-900/80 border border-white/10 rounded-xl p-5 hover:border-red-500/30 transition-colors h-full"
                  >
                    <h3 className="text-white font-semibold text-sm leading-snug mb-2">{post.title}</h3>
                    <span className="text-red-500 text-xs font-medium flex items-center gap-1">
                      Read Article <ArrowRight size={12} />
                    </span>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection delay={0.3}>
              <div className="text-center mt-8">
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link href="/blog">
                    View All Articles <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-20 bg-gray-950">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-10">
                <Target className="text-red-500 mx-auto mb-4" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Free Tools
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <AnimatedSection delay={0.05}>
                <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center">
                      <BarChart3 className="text-red-500" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Bottleneck Audit</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                    Quick diagnostic that identifies the one thing holding your business
                    back — your biggest bottleneck — and what to do about it.
                  </p>
                  <Button asChild className="bg-red-600 hover:bg-red-700 text-white w-full">
                    <a href="/assessment">
                      Start the Audit <ArrowRight className="ml-2" size={16} />
                    </a>
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center">
                      <Zap className="text-red-500" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">The Founder's Filter</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                    Interactive delegation tool. Sort your tasks into what to keep,
                    hand off soon, or delegate immediately — with AI guidance.
                  </p>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full">
                    <a href="/founders-filter">
                      Try the Filter <ArrowRight className="ml-2" size={16} />
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <section className="py-20 bg-red-600">
          <div className="container max-w-4xl text-center">
            <AnimatedSection>
              <PhoneCall className="text-white/80 mx-auto mb-6" size={40} />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Stop Doing Everything Yourself
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Book a free discovery call. We'll talk about what's eating your time,
                what should be systematized, and what the path forward looks like.
                No pitch. No pressure.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-red-600 hover:bg-white/90 h-14 px-10 text-base font-semibold"
              >
                <a href="/jeremys-calendar-intro">
                  Book a Discovery Call <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 border-t border-white/10 py-8">
        <div className="container text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} KeanOnBiz. All rights reserved. |{" "}
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms</Link> |{" "}
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
