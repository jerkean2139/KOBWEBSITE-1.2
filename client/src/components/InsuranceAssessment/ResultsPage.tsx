import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  Calendar,
  Mail,
  Send,
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { ASSESSMENT_ENDPOINTS } from "./config";
import {
  questions,
  categories,
  testimonials,
  resultsCopy,
  getCategoryDiagnosis,
  getCategoryMaxScore,
  type ScoringResult,
} from "@/data/insuranceAssessment";

interface ResultsPageProps {
  scoring: ScoringResult;
  answers: Record<number, number | string>;
  showFullResults: boolean;
  emailAlreadyCaptured?: boolean;
}

function EmailResultsForm({ scoring }: { scoring: ScoringResult }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const resp = await fetch(ASSESSMENT_ENDPOINTS.emailResults, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          leakage: scoring.phase1Leakage,
          potential: scoring.netMonthlySwing,
          annual: scoring.annualRecovery,
        }),
      });
      if (resp.ok) {
        setSubmitted(true);
      }
    } catch {}
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium justify-center mt-2">
        <Send size={14} /> Results sent to your inbox!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 mt-3 max-w-md mx-auto">
      <label htmlFor="results-email" className="sr-only">Email address</label>
      <input
        id="results-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@agency.com"
        required
        aria-label="Email address to receive results"
        className="flex-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
      />
      <button
        type="submit"
        disabled={loading || !email}
        className="px-5 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
      >
        <Mail size={14} /> Email My Results
      </button>
    </form>
  );
}

export function ResultsPage({ scoring, answers, showFullResults, emailAlreadyCaptured }: ResultsPageProps) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2">
          Your Recovery Potential
        </p>
        <AnimatedCounter
          value={scoring.netMonthlySwing}
          prefix="$"
          suffix="/mo"
          duration={1500}
          className="text-5xl md:text-7xl font-bold text-green-600"
        />
        <p className="text-xl text-gray-600 mt-3">{resultsCopy.heroSubheadline}</p>
        <p className="text-gray-500 mt-1">
          <strong className="text-green-600">${scoring.annualRecovery.toLocaleString()}</strong> per year
          your agency could be recovering
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
        >
          <TrendingDown className="text-red-500 mx-auto mb-2" size={24} />
          <AnimatedCounter value={scoring.phase1Leakage} prefix="$" suffix="/mo" className="text-2xl font-bold text-red-600" />
          <p className="text-sm font-semibold text-red-700 mt-1">{resultsCopy.cards.leaking.title}</p>
          <p className="text-xs text-red-500 mt-1">{resultsCopy.cards.leaking.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center"
        >
          <TrendingUp className="text-green-500 mx-auto mb-2" size={24} />
          <AnimatedCounter
            value={scoring.costSaved + scoring.revenueGained}
            prefix="$"
            suffix="/mo"
            className="text-2xl font-bold text-green-600"
          />
          <p className="text-sm font-semibold text-green-700 mt-1">{resultsCopy.cards.recovery.title}</p>
          <p className="text-xs text-green-500 mt-1">{resultsCopy.cards.recovery.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center"
        >
          <Clock className="text-blue-500 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-blue-600">{scoring.hoursRecovered} hrs/wk</p>
          <p className="text-sm font-semibold text-blue-700 mt-1">{resultsCopy.cards.time.title}</p>
          <p className="text-xs text-blue-500 mt-1">{resultsCopy.cards.time.description}</p>
        </motion.div>
      </div>

      {showFullResults && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Where You're Losing Money</h3>
            <div className="space-y-5">
              {categories.filter((c) => c !== "Revenue & Opportunity").map((cat) => {
                const score = scoring.categoryBreakdown[cat] || 0;
                const maxScore = getCategoryMaxScore(cat);
                const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
                const diagnosis = getCategoryDiagnosis(cat, score, maxScore);

                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat}</span>
                      <span className="text-sm font-bold text-red-600">${score.toLocaleString()}/mo</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-full bg-red-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500">{diagnosis}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Where You'd Gain It Back</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <TrendingDown className="text-green-600" size={18} />
                  Cost Savings — ${scoring.costSaved.toLocaleString()}/mo
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Reduced team inefficiency (accountability systems, disciplined processes)
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Owner time recaptured (delegation, team development)
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Lower client acquisition cost (better conversations = higher close rates)
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={18} />
                  Revenue Gained — ${scoring.revenueGained.toLocaleString()}/mo
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Life & health production lift (trained life pivots on every conversation)
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    New business acceleration (value-based selling, same-day presentation)
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Client retention improvement (structured outreach, deeper relationships)
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          >
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-lg font-bold text-gray-900">Your Answers at a Glance</h3>
              {showAnswers ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {showAnswers && (
              <div className="mt-4 space-y-3">
                {questions.map((q) => {
                  const answer = answers[q.id];
                  if (answer === undefined) return null;

                  let displayAnswer = "";
                  if (q.type === "radio" && q.options) {
                    if (q.id === 30) {
                      displayAnswer = String(answer);
                    } else {
                      const opt = q.options.find((o) => o.value === answer);
                      displayAnswer = opt ? opt.text : String(answer);
                    }
                  } else {
                    displayAnswer = `${answer} ${q.unit || ""}`;
                  }

                  const isWorst = q.type === "radio" && q.options && q.id !== 30 &&
                    answer === Math.max(...q.options.map(o => o.value)) && (answer as number) > 0;

                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg text-sm ${
                        isWorst ? "bg-red-50 border border-red-200" : "bg-gray-50"
                      }`}
                    >
                      <p className="font-medium text-gray-700">
                        Q{q.id}: {q.question}
                      </p>
                      <p className={`mt-1 ${isWorst ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                        → {displayAnswer}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 rounded-2xl p-8 md:p-10 mb-8 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">{resultsCopy.pitch.headline}</h3>
        <p className="text-white/80 mb-4 max-w-2xl mx-auto leading-relaxed">{resultsCopy.pitch.body}</p>
        <p className="text-white/70 italic max-w-2xl mx-auto leading-relaxed">{resultsCopy.pitch.attribution}</p>
        <p className="text-white/50 mt-4 font-medium">{resultsCopy.pitch.signature}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold mx-auto mb-3">
                {t.avatar}
              </div>
              <p className="text-sm text-gray-600 italic mb-2">"{t.quote}"</p>
              <p className="text-xs text-gray-400 font-medium">
                — {t.name}, {t.role}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center space-y-4"
      >
        <a
          href="/jeremys-calendar-intro"
          className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/25"
        >
          <Calendar size={20} />
          {resultsCopy.cta.primary}
        </a>
        {!emailAlreadyCaptured && (
          <div className="mt-2">
            <p className="text-gray-500 text-sm">{resultsCopy.cta.secondary}</p>
            <EmailResultsForm scoring={scoring} />
          </div>
        )}
        {emailAlreadyCaptured && (
          <p className="text-green-600 text-sm mt-2 font-medium">
            A PDF copy of your results has been sent to your email.
          </p>
        )}
      </motion.div>
    </div>
  );
}
