import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import type { ScoringResult } from "@/data/insuranceAssessment";

interface EmailGateProps {
  leakage: number;
  potential: number;
  scoring: ScoringResult;
  answers: Record<number, number | string>;
  onSubmitEmail: (email: string) => void;
  onSkip: () => void;
}

export function EmailGate({ leakage, potential, scoring, answers, onSubmitEmail, onSkip }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const resp = await fetch("/api/insurance-assessment/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          leakage: scoring.phase1Leakage,
          potential: scoring.netMonthlySwing,
          annualRecovery: scoring.annualRecovery,
          costSaved: scoring.costSaved,
          revenueGained: scoring.revenueGained,
          hoursRecovered: scoring.hoursRecovered,
          categoryBreakdown: scoring.categoryBreakdown,
          answers,
        }),
      });

      if (!resp.ok) {
        throw new Error("Server error");
      }

      onSubmitEmail(email);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center py-12"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="text-green-600" size={32} />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Complete!</h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="text-center">
            <AnimatedCounter
              value={leakage}
              prefix="-$"
              className="text-2xl font-bold text-red-600"
            />
            <p className="text-xs text-gray-500 mt-1">leaking/mo</p>
          </div>
          <div className="text-2xl text-gray-300 hidden sm:block">&rarr;</div>
          <div className="text-center">
            <AnimatedCounter
              value={potential}
              prefix="+$"
              className="text-2xl font-bold text-green-600"
            />
            <p className="text-xs text-gray-500 mt-1">potential/mo</p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Enter your email to unlock your full report. We'll also send a PDF copy to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="assessment-email" className="sr-only">Email address</label>
          <input
            id="assessment-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@agency.com"
            required
            aria-label="Email address for assessment results"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-center text-lg transition-all"
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 px-6 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Lock size={18} />
            {loading ? "Sending..." : "See My Results"}
          </button>
          {error && (
            <p className="text-red-500 text-sm" role="alert">{error}</p>
          )}
        </form>

        <button
          onClick={onSkip}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Skip — show me the summary only
        </button>

        <p className="text-xs text-gray-400 mt-4">
          We'll send a PDF copy of your results. No spam, ever.
        </p>
      </div>
    </motion.div>
  );
}
