import { useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { AssessmentContainer } from "@/components/InsuranceAssessment";
import { useInsuranceAssessment } from "@/hooks/useInsuranceAssessment";
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
  Star,
  AlertTriangle,
  Zap,
  BookOpen,
  Award,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

function FloatingCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className={`bg-gray-900 border border-white/10 rounded-2xl shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function InsuranceLanding({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-20 bg-gray-950">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 20% 30%, rgba(220,38,38,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(220,38,38,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 60% 20%, rgba(255,255,255,0.02) 0%, transparent 50%)",
            }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        </div>

        <div className="container relative z-10 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-8">
                  <img
                    src="/jeremy-about-photo.webp"
                    alt="Jeremy Kean"
                    className="w-14 h-14 rounded-full object-cover object-top border-2 border-red-500/50 shadow-lg shadow-red-500/10"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">Jeremy Kean</p>
                    <p className="text-white/40 text-xs">Agency Coach & CEO Sidekick</p>
                  </div>
                  <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/15 rounded-full border border-red-500/25 ml-2">
                    <Shield className="text-red-400" size={12} />
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">
                      Insurance Agency Coaching
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]"
              >
                Stop Running
                <br />
                Your Agency.
                <br />
                <span className="text-red-500">Start Leading It.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed"
              >
                Most insurance agency owners are losing $3,000–$8,000 every month to team
                inefficiency, missed opportunities, and operating as a firefighter instead of a CEO.{" "}
                <strong className="text-white">Find out your exact number.</strong>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02]"
                >
                  <BarChart3 size={20} />
                  Find Your Revenue Leak
                </button>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/5 transition-all"
                >
                  See How It Works
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {["JK", "MS", "RL", "AP", "TB"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-950 flex items-center justify-center text-[10px] font-bold text-white/80"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/50 text-xs">Trusted by agency owners nationwide</p>
                </div>
              </motion.div>
            </div>

            <div className="hidden lg:block relative">
              <FloatingCard className="p-6" delay={0.3}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-red-400" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Revenue Leak Analysis</p>
                    <p className="text-white/40 text-xs">Live Assessment Preview</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {[
                    { label: "Team Systems", value: 72, color: "bg-red-500" },
                    { label: "Sales Process", value: 45, color: "bg-orange-500" },
                    { label: "Cross-Selling", value: 28, color: "bg-yellow-500" },
                    { label: "Owner Leverage", value: 61, color: "bg-red-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/60">{item.label}</span>
                        <span className="text-white/80 font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3">
                  <AlertTriangle className="text-red-400 shrink-0" size={18} />
                  <div>
                    <p className="text-red-400 text-xs font-semibold">Monthly Leakage Detected</p>
                    <p className="text-white font-bold text-lg">$3,280/mo</p>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard
                className="absolute -top-4 -right-4 px-4 py-3"
                delay={0.6}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">3 min</span>
                </div>
                <p className="text-white/50 text-[10px]">Assessment Time</p>
              </FloatingCard>

              <FloatingCard
                className="absolute -bottom-6 -left-6 px-4 py-3"
                delay={0.9}
              >
                <p className="text-red-400 text-xs font-bold">$48,600</p>
                <p className="text-white/40 text-[10px]">Avg Annual Recovery</p>
              </FloatingCard>

              <FloatingCard
                className="absolute top-1/2 -right-8 px-4 py-3"
                delay={1.1}
              >
                <p className="text-white text-xs font-bold">Zero</p>
                <p className="text-white/40 text-[10px]">Risk to Get Started</p>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950 border-t border-white/5">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "$3.3K", label: "Avg Monthly Leak", icon: DollarSign },
              { value: "40%", label: "Recovery Rate", icon: TrendingUp },
              { value: "3 min", label: "Assessment Time", icon: Clock },
              { value: "100%", label: "Confidential", icon: Shield },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <stat.icon className="text-red-400 mx-auto mb-3" size={24} />
                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-950">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
              <AlertTriangle className="text-red-400" size={12} />
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">
                Problems Solved
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Problems Nobody
              <br />
              <span className="text-red-500">Talks About</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              You didn't get into the insurance business to babysit, chase numbers, or put out fires
              all day. But here you are.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              {
                icon: Users,
                title: "Your team has no accountability system",
                desc: "Goals are vague, tracking is nonexistent, and nobody owns their numbers. You end up micromanaging because there's no structure.",
                stat: "78%",
                statLabel: "of agencies lack weekly tracking",
              },
              {
                icon: PhoneCall,
                title: "Sales are a price war, not a value conversation",
                desc: "Your team leads with price instead of doing gap audits and telling the client's story. Every call is a race to the bottom.",
                stat: "$800",
                statLabel: "avg lost per missed cross-sell",
              },
              {
                icon: DollarSign,
                title: "Life production is an afterthought",
                desc: "Nobody pivots. Nobody cross-sells. Massive revenue sits untouched on the table because your team doesn't know how — or when — to bring it up.",
                stat: "40%",
                statLabel: "of revenue left untouched",
              },
              {
                icon: Target,
                title: "You ARE the agency",
                desc: "If you took a vacation, production would stop. That's not a business — it's a job with higher stress and no sick days.",
                stat: "60hrs",
                statLabel: "avg owner work week",
              },
            ].map((problem, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-gray-900/50 hover:bg-gray-900/80 border border-white/5 hover:border-red-500/20 rounded-2xl p-8 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <problem.icon className="text-red-400" size={22} />
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-bold text-lg">{problem.stat}</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">
                      {problem.statLabel}
                    </p>
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{problem.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{problem.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-900">
        <div className="container max-w-6xl">
          <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl border border-white/10 p-10 md:p-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(220,38,38,0.15) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  How Much Is Your Agency
                  <br />
                  <span className="text-red-500">Leaking Every Month?</span>
                </h2>
                <p className="text-white/60 mb-10 max-w-xl mx-auto text-lg">
                  This 3-minute assessment reveals exactly where your agency is losing money — and
                  what changes would recover it.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={onStart}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl font-semibold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] mb-6"
                >
                  <BarChart3 size={22} />
                  Find Out What You're Losing
                  <ArrowRight size={20} />
                </button>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-400/60" /> Takes 3 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-400/60" /> 100% confidential
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-green-400/60" /> No email required to
                    start
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 md:py-28 bg-gray-950">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
              <Zap className="text-red-400" size={12} />
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">
                How It Works
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Three Steps to
              <br />
              <span className="text-red-500">Clarity</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Take the Assessment",
                desc: "Answer 30 quick questions about your agency's operations, team management, and sales process. Completely free and confidential.",
              },
              {
                step: "02",
                icon: BarChart3,
                title: "See Your Numbers",
                desc: "Get a personalized report showing exactly where money is leaking — broken down by category with specific dollar amounts.",
              },
              {
                step: "03",
                icon: PhoneCall,
                title: "Build Your Plan",
                desc: "Book a free discovery call to create a coaching plan tailored to your agency's biggest gaps and recovery opportunities.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative bg-gray-900/50 border border-white/5 rounded-2xl p-8 text-center group hover:border-red-500/20 transition-all duration-300"
              >
                <div className="text-red-500/20 font-bold text-6xl absolute top-4 right-6">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-500/20 transition-colors">
                    <item.icon className="text-red-400" size={24} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-950 border-t border-white/5">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
              <Award className="text-red-400" size={12} />
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">
                What You Get
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Not Another Course.
              <br />
              <span className="text-red-500">A Real Coach.</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Jeremy works directly with you and your team — not a pre-recorded video library.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Team Accountability Systems",
                desc: "Weekly tracking, scorecards, and team huddle frameworks your people actually follow — not just a policy manual.",
              },
              {
                icon: TrendingUp,
                title: "Revenue Recovery Coaching",
                desc: "Find the money hiding in your existing book. Cross-selling strategies, referral systems, and retention plays.",
              },
              {
                icon: Target,
                title: "CEO Mindset Shift",
                desc: "Stop being the best producer. Start being the leader who builds a business that runs without you.",
              },
              {
                icon: PhoneCall,
                title: "Sales Process Overhaul",
                desc: "Replace price-first conversations with value-based gap audits that close bigger policies at higher premiums.",
              },
              {
                icon: BarChart3,
                title: "KPI & Performance Dashboards",
                desc: "Simple tracking systems so you always know who's performing, who's slipping, and where to focus.",
              },
              {
                icon: MessageSquare,
                title: "Whole-Team Coaching",
                desc: "Jeremy doesn't just coach the owner. He coaches your producers, CSRs, and managers too.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-white/5 rounded-2xl p-6 hover:border-red-500/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                  <feature.icon className="text-red-400" size={22} />
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-900">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
              <Star className="text-red-400" size={12} />
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest">Results</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Real Owners.
              <br />
              <span className="text-red-500">Real Results.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                quote:
                  "Jeremy helped us implement a weekly scorecard system. Within 90 days, our team went from no accountability to owning their numbers. Revenue jumped 23%.",
                name: "Agency Owner",
                role: "P&C Agency, Texas",
                result: "+23% Revenue",
              },
              {
                quote:
                  "We were leaving life production completely on the table. Jeremy's cross-sell framework helped us add $3,200/month in new life premium without adding a single new client.",
                name: "Agency Principal",
                role: "Multi-line Agency, Ohio",
                result: "+$3.2K/mo Life",
              },
              {
                quote:
                  "I was working 65 hours a week and couldn't take a day off. After 6 months of coaching, I took my first real vacation in 4 years — and production didn't skip a beat.",
                name: "Agency Owner",
                role: "Independent Agency, Florida",
                result: "65→45 hrs/wk",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-gray-950 border border-white/5 rounded-2xl p-8"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-white/40 text-xs">{testimonial.role}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                    <p className="text-green-400 text-xs font-bold">{testimonial.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-900/80 border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src="/jeremy-about-photo.webp"
                alt="Jeremy Kean"
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover object-top border-2 border-red-500/40 shrink-0"
                loading="lazy"
              />
              <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Your Coach
                </p>
                <h3 className="text-2xl font-bold text-white mb-1">Jeremy Kean</h3>
                <p className="text-white/40 text-sm mb-4">CEO Sidekick & Agency Coach</p>
                <p className="text-white/60 leading-relaxed">
                  "I've helped insurance agency owners recover exactly these kinds of losses — not
                  with corporate playbooks, but by coaching you and your entire team on the
                  psychology, systems, and accountability that nobody else teaches. I don't just tell
                  you what to do. I get in the trenches with your people and make it stick."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-900 border-t border-white/5">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Find Your
              <br />
              <span className="text-red-500">Revenue Leak?</span>
            </h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto text-lg">
              Take the free assessment. See your numbers. Then decide if you want help fixing them.
            </p>
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl font-semibold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] mb-6"
            >
              <BarChart3 size={22} />
              Start the Free Assessment
              <ArrowRight size={20} />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400/60" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400/60" /> No commitment
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-400/60" /> Results in 3 minutes
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default function InsuranceAssessmentPage() {
  const assessment = useInsuranceAssessment();
  const [location] = useLocation();

  useEffect(() => {
    if (location === "/insurance/assessment" && assessment.state.screen === "landing") {
      assessment.startAssessment();
    }
  }, [location, assessment.state.screen, assessment.startAssessment]);

  return (
    <>
      <SEO
        title="Insurance Agency Coaching | Revenue Leak Calculator | KeanOnBiz"
        description="Find out how much your insurance agency is losing every month. Take the free Revenue Leak Calculator to identify gaps in team performance, sales process, and operations."
        image="/manumation-book-cover-new.png"
      />
      <Navigation logoVariant="red" />
      <main id="main-content" className="min-h-screen" role="main">
        {assessment.state.screen === "landing" ? (
          <InsuranceLanding onStart={assessment.startAssessment} />
        ) : (
          <section className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <div className="container max-w-7xl">
              {assessment.state.screen === "question" && (
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {assessment.currentQuestion?.phase === 1
                      ? "What's Standing Between You and Running Your Agency Like a CEO?"
                      : "What You Could Gain"}
                  </h2>
                </div>
              )}
              <AssessmentContainer assessment={assessment} />
            </div>
          </section>
        )}
      </main>
      <Footer variant="insurance" />
    </>
  );
}
