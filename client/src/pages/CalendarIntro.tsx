import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Target,
  Shield,
} from "lucide-react";
import { Link } from "wouter";

const testimonials = [
  {
    quote:
      "Jeremy helped us implement a weekly scorecard system. Within 90 days, our team went from no accountability to owning their numbers.",
    name: "Beth P.",
    role: "Agency Owner, Texas",
    result: "+23% Revenue",
  },
  {
    quote:
      "I was working 65 hours a week. After 6 months of coaching, I took my first real vacation in 4 years — and production didn't skip a beat.",
    name: "Agency Owner",
    role: "Independent Agency, Florida",
    result: "65→45 hrs/wk",
  },
  {
    quote:
      "He's a game changer — a Swiss Army Knife for everything the industry doesn't teach you.",
    name: "Anissa V.",
    role: "Agency Owner",
    result: "Game Changer",
  },
];

export default function CalendarIntro() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--surface-sunken)]">
      <Navigation logoVariant="red" />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
        <div className="container relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-3">
                <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm mb-6 border border-red-500/20">
                  <Clock size={16} />
                  <span className="font-bold uppercase tracking-widest text-xs">
                    60 minute strategy session
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Let's Build Your
                  <br />
                  <span className="text-red-500">Recovery Plan</span>
                </h1>
                <p className="text-lg text-gray-400 mb-6 max-w-lg leading-relaxed">
                  A focused, no-pressure strategy session where we look at your
                  numbers, identify your biggest leaks, and map out exactly what
                  to fix first.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-2">
                    {["BP", "AV", "SF", "JM", "RL"].map((initials, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[var(--surface-sunken)] flex items-center justify-center text-[10px] font-bold text-white/80"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-white/40 text-xs">
                      Trusted by agency owners nationwide
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <img
                    src="/jeremy-main-hero.webp"
                    alt="Jeremy Kean — Agency Coach"
                    width={280}
                    height={280}
                    className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl object-cover object-top border-2 border-red-500/30 shadow-2xl shadow-red-500/10"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-gray-900 border border-white/10 rounded-xl px-3 py-2 shadow-lg">
                    <p className="text-white font-bold text-sm">Jeremy Kean</p>
                    <p className="text-red-400 text-xs">CEO Sidekick</p>
                  </div>
                  <div className="absolute -top-3 -left-3 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-green-400 text-xs font-semibold">
                        Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, value: "35+", label: "Years Experience" },
                { icon: Target, value: "60+", label: "Business Owners Coached" },
                { icon: TrendingUp, value: "$4.2K", label: "Avg Monthly Recovery" },
                { icon: Shield, value: "100%", label: "Confidential" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-gray-900/50 border border-white/5 rounded-xl p-4 text-center"
                >
                  <stat.icon className="text-red-400 mx-auto mb-2" size={20} />
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-white/40 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 border-t border-white/5">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  What We'll Cover
                </h2>
                <ul className="space-y-4">
                  {[
                    "Review your Revenue Leak Calculator results together",
                    "Identify your top 2-3 highest-impact opportunities",
                    "Map out a 90-day action plan for your agency",
                    "Discuss team accountability and sales process gaps",
                    "Determine if ongoing coaching is the right fit",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="text-red-400" size={14} />
                      </div>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">
                    <CalendarIcon className="text-red-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Strategy Call</h3>
                    <p className="text-sm text-gray-500">
                      60 minutes with Jeremy
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  This isn't a sales pitch. It's a working session where we look
                  at your specific numbers and build a real plan.
                </p>
                <div className="space-y-2">
                  {[
                    "Free — no obligation",
                    "Bring your Revenue Leak results",
                    "Leave with a clear action plan",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs text-white/50"
                    >
                      <CheckCircle size={12} className="text-green-400/60" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg font-bold text-white mb-6 text-center">
              What Agency Owners Say
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-gray-900/50 border border-white/5 rounded-xl p-5"
                >
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-xs">
                        {t.name}
                      </p>
                      <p className="text-white/30 text-xs">{t.role}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-2 py-1">
                      <p className="text-green-400 text-[10px] font-bold">
                        {t.result}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Select Your Time
              </h2>
              <p className="text-gray-500">
                Choose a date and time that works for you
              </p>
            </div>
            <div className="bg-gray-900/30 rounded-2xl overflow-hidden border border-white/5">
              <iframe
                src="https://api.leadconnectorhq.com/widget/booking/uslCIRV9xwkJQlHC1Rl7"
                style={{
                  width: "100%",
                  border: "none",
                  overflow: "hidden",
                  minHeight: "700px",
                }}
                scrolling="no"
                id="uslCIRV9xwkJQlHC1Rl7_1765457335823"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-t border-white/5">
        <div className="container">
          <div className="flex justify-center gap-4">
            <Link href="/insurance">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-white hover:bg-red-500/10"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Insurance Coaching
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-white hover:bg-red-500/10"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
