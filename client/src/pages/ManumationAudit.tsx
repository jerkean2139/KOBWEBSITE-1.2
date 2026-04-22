import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Users,
  Cpu,
  DollarSign,
  Calendar,
  Clock,
  BarChart3,
  Target,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DELIVERABLES = [
  { icon: BarChart3, title: "Complete Operations Audit", description: "Deep dive into every process, workflow, and system in your business" },
  { icon: Cpu, title: "Custom Automation Blueprint", description: "Specific tools, integrations, and automations mapped to your operations" },
  { icon: DollarSign, title: "Revenue Leak Analysis", description: "Dollar amounts — where you're losing money and exactly how to recover it" },
  { icon: FileText, title: "90-Day Implementation Roadmap", description: "Week-by-week action plan with milestones and accountability checkpoints" },
  { icon: Users, title: "Team Delegation Map", description: "Role-by-role breakdown of what to offload, to whom, and in what order" },
  { icon: Target, title: "AI Readiness Score", description: "Which AI tools would have the highest ROI for your specific business" },
  { icon: MessageSquare, title: "1-on-1 Strategy Session", description: "90-minute deep-dive with Jeremy to walk through your audit findings" },
  { icon: Calendar, title: "Follow-Up Check-In", description: "30-day review to ensure implementation is on track" },
];

const COMPARISON = [
  { feature: "Time to complete", mini: "5 minutes", full: "2-3 hours" },
  { feature: "Questions", mini: "12 self-assessment", full: "Deep interview + data review" },
  { feature: "Score", mini: "Overall + 4 categories", full: "30+ metrics across all operations" },
  { feature: "Insights", mini: "Template-based overview", full: "Custom analysis specific to your business" },
  { feature: "Revenue analysis", mini: "General risk level", full: "Exact dollar amounts per leak" },
  { feature: "Action plan", mini: "Category recommendations", full: "90-day week-by-week roadmap" },
  { feature: "Team analysis", mini: "Not included", full: "Role-by-role delegation map" },
  { feature: "AI recommendations", mini: "General potential score", full: "Specific tool + ROI projections" },
  { feature: "1-on-1 with Jeremy", mini: "Not included", full: "90-minute strategy session" },
  { feature: "Follow-up", mini: "Not included", full: "30-day implementation check-in" },
  { feature: "Price", mini: "Free", full: "$2,500" },
];

const FAQS = [
  {
    q: "What happens during the Manumation Audit?",
    a: "Jeremy conducts a thorough analysis of your business operations through a combination of interviews, data review, and process mapping. This typically takes 2-3 hours spread across 1-2 sessions. You'll receive a comprehensive written report plus a 90-minute strategy session to walk through the findings.",
  },
  {
    q: "How is this different from the free Mini Audit?",
    a: "The Mini Audit gives you a high-level score across 4 categories based on self-assessment. The full Manumation Audit goes deep — Jeremy interviews you and your team, reviews your actual data, maps your workflows, and produces a custom analysis with specific dollar amounts, tool recommendations, and a week-by-week implementation roadmap.",
  },
  {
    q: "Who is the Manumation Audit designed for?",
    a: "Business owners doing $250K-$5M in revenue who are working too many hours, struggling to delegate, and know they need better systems but aren't sure where to start. If you scored 50+ on the Mini Audit, the full audit is designed for exactly where you are.",
  },
  {
    q: "What kind of ROI can I expect?",
    a: "On average, businesses that complete the audit and implement the roadmap recover $3,000-$8,000 per month in revenue leaks and time savings within 90 days. The audit pays for itself within the first month of implementation for most businesses.",
  },
  {
    q: "How long does it take to get my results?",
    a: "You'll receive your complete written report within 5 business days of your audit sessions. The 90-minute strategy walkthrough is scheduled within a week of report delivery.",
  },
  {
    q: "Can I apply the audit cost toward coaching?",
    a: "Yes. If you decide to work with Jeremy in a Done With You or Done For You engagement within 30 days of your audit, the $2,500 is credited toward your coaching package.",
  },
];

export default function ManumationAudit() {
  return (
    <>
      <SEO
        title="The Manumation Audit — Deep Business Diagnostic | KeanOnBiz"
        description="A comprehensive $2,500 business audit that identifies your exact revenue leaks, builds a custom automation blueprint, and gives you a 90-day implementation roadmap. Includes 1-on-1 strategy session with Jeremy Kean."
      />
      <Navigation />
      <main id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="pt-28 pb-16" style={{ backgroundColor: "var(--surface-sunken)" }}>
          <div className="container">
            <Breadcrumbs variant="dark" items={[{ label: "Home", href: "/" }, { label: "Manumation Audit" }]} />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-8">
              <AnimatedSection animation="fade-in" delay={0.1}>
                <div className="max-w-xl">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                    The Manumation Audit
                  </p>
                  <h1
                    className="font-extrabold tracking-tight mb-6"
                    style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: "1.08" }}
                  >
                    Stop Guessing.
                    <br />
                    <span style={{ color: "var(--amber)" }}>Start Knowing.</span>
                  </h1>
                  <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                    A comprehensive diagnostic that identifies your exact revenue leaks, maps your automation opportunities, and gives you a 90-day roadmap to a business that runs without you.
                  </p>
                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-4xl font-extrabold text-foreground">$2,500</span>
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>one-time investment</span>
                  </div>
                  <a href="/jeremys-calendar-strategy">
                    <Button
                      size="lg"
                      className="h-14 px-8 font-bold"
                      style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
                    >
                      Book Your Audit <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </a>
                  <p className="text-xs mt-3" style={{ color: "var(--text-tertiary)" }}>
                    Cost credited toward coaching if you proceed within 30 days
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-in" delay={0.3}>
                <div className="hidden lg:block">
                  <img
                    src="/jeremy-about-photo.webp"
                    alt="Jeremy Kean — Business Coach"
                    width="500"
                    height="580"
                    loading="lazy"
                    className="w-full max-w-md ml-auto object-cover"
                    style={{ aspectRatio: "7/8", borderRadius: "2px" }}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 lg:py-28" aria-labelledby="deliverables-heading">
          <div className="container">
            <AnimatedSection animation="fade-in" delay={0.1}>
              <div className="max-w-2xl mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                  What You Get
                </p>
                <h2 id="deliverables-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Eight Deliverables. Zero Fluff.
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DELIVERABLES.map((item, i) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={item.title} animation="fade-in" delay={0.12 + i * 0.06}>
                    <div className="p-5 rounded-lg h-full" style={{ backgroundColor: "var(--surface-elevated)" }}>
                      <Icon size={20} className="mb-3" style={{ color: "var(--amber)" }} aria-hidden="true" />
                      <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20" style={{ backgroundColor: "var(--surface-sunken)" }}>
          <div className="container">
            <AnimatedSection animation="fade-in" delay={0.1}>
              <div className="max-w-2xl mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                  The Process
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Three Steps to Clarity
                </h2>
              </div>
            </AnimatedSection>

            <div className="max-w-3xl">
              {[
                { num: "01", title: "Book", description: "Schedule your audit session. Jeremy will send a brief intake form so you come prepared." },
                { num: "02", title: "Audit", description: "2-3 hours of deep analysis — interviews, data review, process mapping. Jeremy does the heavy lifting." },
                { num: "03", title: "Transform", description: "Receive your written report + 90-day roadmap. Walk through it in a 90-minute strategy session. Start implementing." },
              ].map((step, i) => (
                <AnimatedSection key={step.num} animation="fade-in" delay={0.15 + i * 0.1}>
                  <div className="flex gap-6 sm:gap-8 py-8" style={i < 2 ? { borderBottom: "1px solid var(--border)" } : undefined}>
                    <span
                      className="text-3xl sm:text-4xl font-extrabold shrink-0 w-12 tabular-nums"
                      style={{ color: "var(--amber)", lineHeight: "1" }}
                    >
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Mini vs Full Comparison */}
        <section className="py-20 lg:py-28" aria-labelledby="comparison-heading">
          <div className="container">
            <AnimatedSection animation="fade-in" delay={0.1}>
              <div className="max-w-2xl mb-14">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                  Compare
                </p>
                <h2 id="comparison-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Mini Audit vs. Full Audit
                </h2>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={0.2}>
              <div className="overflow-x-auto">
                <table className="w-full max-w-3xl text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th className="text-left py-3 pr-4 font-semibold text-foreground"></th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-secondary)" }}>Mini Audit</th>
                      <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--amber)" }}>Full Manumation Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td className="py-3 pr-4 font-medium text-foreground">{row.feature}</td>
                        <td className="py-3 px-4" style={{ color: "var(--text-secondary)" }}>{row.mini}</td>
                        <td className="py-3 px-4 font-medium text-foreground">{row.full}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Case Study */}
        <section className="py-20" style={{ backgroundColor: "var(--surface-sunken)" }}>
          <div className="container">
            <AnimatedSection animation="fade-in" delay={0.1}>
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                  Case Study
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
                  From 65 Hours/Week to 45 — In 90 Days
                </h2>

                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Before", value: "65 hrs/wk", sublabel: "Owner working hours" },
                    { label: "After", value: "45 hrs/wk", sublabel: "20 hours recovered" },
                    { label: "Revenue", value: "+$3,280/mo", sublabel: "Monthly recovery" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-lg" style={{ backgroundColor: "var(--card)" }}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
                      <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{stat.sublabel}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  An independent insurance agency owner came to Jeremy working 65 hours a week. The Manumation Audit identified $3,280/month in revenue leaks across missed cross-sells, reactive renewals, and team inefficiency. The 90-day roadmap focused on three changes: a weekly team scorecard, automated renewal workflows, and a delegation framework for routine policy servicing.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Within 90 days, the owner dropped to 45 hours/week, took their first real vacation in 4 years, and production didn't skip a beat.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 lg:py-28">
          <div className="container">
            <AnimatedSection animation="fade-in" delay={0.1}>
              <div className="max-w-2xl mb-10">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                  Questions
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Frequently Asked
                </h2>
              </div>
            </AnimatedSection>

            <div className="max-w-2xl">
              <Accordion type="multiple">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-b" style={{ borderColor: "var(--border)" }}>
                    <AccordionTrigger className="text-left font-semibold text-foreground py-5 hover:no-underline hover:text-primary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--surface-sunken)" }}>
          <div className="container">
            <AnimatedSection animation="fade-in" delay={0.1}>
              <div className="max-w-2xl mx-auto text-center">
                <h2
                  className="font-extrabold tracking-tight mb-6"
                  style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: "1.08" }}
                >
                  Ready to See What's Really Going On?
                </h2>
                <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
                  Book your Manumation Audit and get the clarity you need to build a business that runs without you.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="/jeremys-calendar-strategy">
                    <Button
                      size="lg"
                      className="h-14 px-10 font-bold"
                      style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
                    >
                      Book Your Audit <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </a>
                  <a href="/assessment">
                    <Button variant="outline" size="lg" className="h-14 px-8 font-semibold">
                      Take the Free Mini Audit First
                    </Button>
                  </a>
                </div>
                <p className="text-xs mt-4" style={{ color: "var(--text-tertiary)" }}>
                  $2,500 one-time · Credited toward coaching if you proceed within 30 days
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
