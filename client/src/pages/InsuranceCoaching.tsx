import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Shield,
  Target,
  DollarSign,
  BarChart3,
  Clock,
  PhoneCall,
  AlertTriangle,
  BookOpen,
  Zap,
  Star,
  MessageSquare,
} from "lucide-react";

const INSURANCE_BLOG_POSTS = [
  {
    slug: "insurance-agency-tech-stack-7-tools-save-time",
    title: "The Insurance Agency Tech Stack: 7 Tools That Actually Save Time",
  },
  {
    slug: "automate-insurance-renewals-without-losing-personal-touch",
    title: "How to Automate Insurance Renewals Without Losing the Personal Touch",
  },
  {
    slug: "solo-agent-to-agency-owner-systems-before-hiring",
    title: "From Solo Agent to Agency Owner: The Systems You Need Before You Hire",
  },
  {
    slug: "insurance-agency-lead-generation-ai-powered-funnels",
    title: "Insurance Agency Lead Generation with Smart Funnels",
  },
  {
    slug: "insurance-agency-client-retention-strategies-2026",
    title: "Insurance Agency Client Retention Strategies for 2026",
  },
  {
    slug: "ai-automation-for-insurance-agencies-complete-guide-2026",
    title: "AI & Automation for Insurance Agencies: The Complete Guide",
  },
  {
    slug: "insurance-agency-bottleneck-nobody-talks-about",
    title: "The Insurance Agency Bottleneck Nobody Talks About",
  },
];

const PAIN_POINTS = [
  {
    icon: AlertTriangle,
    title: "Leads Going Cold",
    description: "You're spending money on leads that never get a follow-up. No system, no sequence, no accountability.",
  },
  {
    icon: Clock,
    title: "Renewals Falling Through",
    description: "You know retention matters, but renewals get managed reactively — 30 days out instead of 90.",
  },
  {
    icon: Users,
    title: "Team Can't Run Without You",
    description: "Every decision routes through you. You can't take a day off without something breaking.",
  },
  {
    icon: DollarSign,
    title: "Revenue Leaking Silently",
    description: "Cross-sell opportunities missed. Upsells forgotten. Referral asks that never happen.",
  },
  {
    icon: BarChart3,
    title: "No Visibility Into What's Working",
    description: "You're flying blind on close rates, response times, and producer performance.",
  },
  {
    icon: Target,
    title: "Growth Stalled at a Ceiling",
    description: "You hit a revenue number and can't break through. More effort isn't moving the needle.",
  },
];

const COACHING_PILLARS = [
  {
    icon: Shield,
    title: "Operations & Systems",
    description: "Build the SOPs, workflows, and processes that let your agency run without you in the middle of everything.",
    results: ["Renewal automation saving 30+ hours/month", "Client onboarding under 24 hours", "Zero-touch policy servicing for routine requests"],
  },
  {
    icon: TrendingUp,
    title: "Growth & Sales",
    description: "Fix your pipeline, tighten your close rate, and build a lead machine that feeds your producers consistently.",
    results: ["Lead response time under 5 minutes", "Quote-to-bind ratio above 40%", "Predictable monthly new business volume"],
  },
  {
    icon: Users,
    title: "Team & Delegation",
    description: "Stop being the bottleneck. Build a team that knows what to do, when to do it, and how to do it right.",
    results: ["Clear role definitions and KPIs", "Daily huddles that actually drive production", "Hiring frameworks that reduce turnover"],
  },
  {
    icon: Zap,
    title: "Technology & Integration",
    description: "Connect your AMS, CRM, and communication tools into a stack that works together instead of against you.",
    results: ["Unified tech stack (AMS + CRM + comms)", "Automated follow-up sequences", "Dashboard visibility into key metrics"],
  },
];

const TESTIMONIALS = [
  {
    name: "Ryan Templeton",
    role: "Founder, Premier Health Advisors",
    image: "/testimonial-ryan.webp",
    quote: "Jeremy bridges the gap between 'tech' and 'tactical.' This isn't just theory; it is the specific blueprint I needed to stop manually grinding and start strategically scaling. If you want to build a machine that works for you, read this.",
  },
  {
    name: "Beth P.",
    role: "Insurance Agency Owner",
    image: "/testimonial-beth.webp",
    quote: "I was afraid automation would make my business feel robotic, but Jeremy proved the opposite. This method allowed me to 'clone' my values and voice, giving me more time with clients. A total game-changer.",
  },
  {
    name: "Jason Elkins",
    role: "100 Cups Consulting",
    image: "/testimonial-jason.webp",
    quote: "The Manumation Method gave me permission to simplify, evaluate problems quickly, and implement solutions without the decision-fatigue spiral. Finally, a framework that works for my brain.",
  },
];

const RESULTS = [
  { metric: "30+", label: "Hours/Month Saved", sublabel: "on average per agency" },
  { metric: "90%+", label: "Retention Rate", sublabel: "target for coached agencies" },
  { metric: "3-5x", label: "ROI on Coaching", sublabel: "within first 6 months" },
  { metric: "100+", label: "Businesses Coached", sublabel: "across industries" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Insurance Agency Coaching — KeanOnBiz",
  "description": "Strategic coaching for insurance agency owners who want to grow revenue, retain more clients, and build systems that run without them.",
  "provider": {
    "@type": "Person",
    "name": "Jeremy Kean",
    "jobTitle": "Business Coach & Automation Strategist",
    "url": "https://keanonbiz.com/about",
  },
  "areaServed": "US",
  "serviceType": "Business Coaching",
  "url": "https://keanonbiz.com/insurance-coaching",
};

export default function InsuranceCoaching() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <SEO
        title="Insurance Agency Coaching | Grow Revenue & Build Systems | KeanOnBiz"
        description="Strategic coaching for insurance agency owners. Fix your pipeline, automate renewals, build a team that runs without you, and break through your revenue ceiling. 35+ years experience."
        image="/jeremy-about-photo.webp"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation logoVariant="red" />

      <main id="main-content">
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 pb-16">
          <div className="absolute inset-0" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 20% 30%, rgba(220,38,38,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(220,38,38,0.08) 0%, transparent 60%)",
              }}
            />
          </div>

          <div className="container relative z-10 max-w-6xl">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: "Home", href: "/" },
                { label: "Insurance", href: "/insurance" },
                { label: "Insurance Agency Coaching" },
              ]}
              className="mb-8"
            />

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="/jeremy-about-photo.webp"
                    alt="Jeremy Kean - Insurance Agency Coach"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover object-top border-2 border-red-500/50 shadow-lg shadow-red-500/10"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">Jeremy Kean</p>
                    <p className="text-white/40 text-xs">Agency Coach & CEO Sidekick</p>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white mb-6 leading-[1.1]">
                  Your Insurance Agency{" "}
                  <span className="text-red-500">Deserves Better Systems</span>
                </h1>

                <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                  You didn't build an agency to babysit every process. Strategic coaching
                  that fixes your pipeline, automates your renewals, and builds a team
                  that runs without you standing over their shoulder.
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
                    <a href="/insurance">
                      Take the Revenue Leak Calculator
                    </a>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8">
                  <h2 className="text-xl font-bold text-white mb-6">What Coaching Covers</h2>
                  <ul className="space-y-4">
                    {["Lead systems that follow up automatically", "Renewal workflows that retain 90%+ of clients", "Team accountability without micromanagement", "Tech stack that actually talks to each other", "Growth plan with real numbers, not theory"].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-white/80 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
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
                  Sound Familiar?
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  These are the problems agency owners bring to coaching every week.
                  If three or more hit home, we should talk.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAIN_POINTS.map((point, i) => (
                <AnimatedSection key={point.title} delay={i * 0.08}>
                  <div className="bg-gray-900/80 border border-white/10 rounded-xl p-6 h-full hover:border-red-500/30 transition-colors">
                    <point.icon className="text-red-500 mb-4" size={28} />
                    <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{point.description}</p>
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
                  How Coaching Works
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Four pillars. Each one addresses a different part of your agency
                  that's holding you back.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
              {COACHING_PILLARS.map((pillar, i) => (
                <AnimatedSection key={pillar.title} delay={i * 0.1}>
                  <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-8 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center">
                        <pillar.icon className="text-red-500" size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                    </div>
                    <p className="text-white/60 text-sm mb-5 leading-relaxed">{pillar.description}</p>
                    <ul className="space-y-2">
                      {pillar.results.map((result) => (
                        <li key={result} className="flex items-start gap-2">
                          <CheckCircle2 className="text-red-500/70 mt-0.5 flex-shrink-0" size={14} />
                          <span className="text-white/50 text-xs">{result}</span>
                        </li>
                      ))}
                    </ul>
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
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  These are the benchmarks coached agencies hit.
                  Not theory — real operational improvements.
                </p>
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
              <div className="text-center mb-14">
                <MessageSquare className="text-red-500 mx-auto mb-4" size={32} />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What Clients Say
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Real feedback from business owners who've worked with Jeremy.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <AnimatedSection key={t.name} delay={i * 0.1}>
                  <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-500/50"
                        loading="lazy"
                        width={48}
                        height={48}
                      />
                      <div>
                        <p className="text-white font-semibold text-sm">{t.name}</p>
                        <p className="text-white/50 text-xs">{t.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="text-yellow-500 fill-yellow-500" size={14} />
                      ))}
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed flex-grow">
                      "{t.quote}"
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-900/50">
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
                  alt="Jeremy Kean - Business Coach"
                  width={200}
                  height={200}
                  className="w-40 h-40 md:w-full md:h-auto rounded-xl object-cover object-top mx-auto"
                  loading="lazy"
                />
                <div>
                  <p className="text-white/70 leading-relaxed mb-4">
                    35+ years building, scaling, and fixing businesses across insurance,
                    technology, and coaching. 13 brands created from scratch. 100+ business
                    owners helped through coaching and consulting.
                  </p>
                  <p className="text-white/70 leading-relaxed mb-4">
                    Jeremy created <strong className="text-white">The Manumation Method</strong> — a
                    framework that combines human talent with smart systems and disciplined processes
                    to build agencies that don't depend on any single person, including the owner.
                  </p>
                  <p className="text-white/70 leading-relaxed mb-6">
                    His insurance agency coaching focuses on the operational side: the systems
                    nobody sees, the processes nobody documents, and the bottlenecks nobody
                    talks about. That's where the real revenue leaks hide.
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
                  Insurance Agency Resources
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Free guides and deep dives written for agency owners.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {INSURANCE_BLOG_POSTS.map((post, i) => (
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
          </div>
        </section>

        <section className="py-20 bg-gray-950">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Free Tools for Agency Owners
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedSection delay={0.05}>
                <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-red-500" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Revenue Leak Calculator</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                    Answer 30 questions about your agency. Get a personalized report showing
                    exactly where you're losing money every month — and what to fix first.
                  </p>
                  <Button asChild className="bg-red-600 hover:bg-red-700 text-white w-full">
                    <a href="/insurance">
                      Take the Calculator <ArrowRight className="ml-2" size={16} />
                    </a>
                  </Button>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/15 rounded-lg flex items-center justify-center">
                      <BarChart3 className="text-red-500" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Bottleneck Audit</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
                    A quick diagnostic that identifies your biggest operational bottleneck —
                    the one thing holding your agency back from the next level.
                  </p>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full">
                    <a href="/assessment">
                      Start the Audit <ArrowRight className="ml-2" size={16} />
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
                Ready to Fix What's Broken?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Book a free discovery call. No pitch deck. No pressure.
                Just a conversation about where your agency is, where you want it to go,
                and what's standing in the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-red-600 hover:bg-white/90 h-14 px-10 text-base font-semibold"
                >
                  <a href="/jeremys-calendar-intro">
                    Book a Discovery Call <ArrowRight className="ml-2" size={18} />
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer variant="insurance" />
    </div>
  );
}
