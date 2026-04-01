import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { ASSESSMENT_ENDPOINTS } from "./config";

interface EmailGateProps {
  leakage: number;
  potential: number;
  onSubmitEmail: (email: string) => void;
  onSkip: () => void;
}

export function EmailGate({ leakage, potential, onSubmitEmail, onSkip }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      await fetch(ASSESSMENT_ENDPOINTS.emailCapture, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, leakage, potential }),
      });
    } catch {
    }

    onSubmitEmail(email);
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
          <div className="text-2xl text-gray-300 hidden sm:block">→</div>
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
          Enter your email to see your personalized report with detailed breakdowns.
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
            See My Results
          </button>
        </form>

        <button
          onClick={onSkip}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Skip — show me the summary only
        </button>

        <p className="text-xs text-gray-400 mt-4">
          We'll never spam you. Unsubscribe anytime.
        </p>
      </div>
    </motion.div>
  );
}
