import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { interstitialCopy } from "@/data/insuranceAssessment";

interface InterstitialScreenProps {
  type: "halfway" | "phaseTransition";
  leakage: number;
  onContinue: () => void;
}

export function InterstitialScreen({ type, leakage, onContinue }: InterstitialScreenProps) {
  if (type === "halfway") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-2xl">📊</span>
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {interstitialCopy.halfway.title}
          </h2>

          <div className="my-6">
            <AnimatedCounter
              value={leakage}
              prefix="$"
              suffix="/mo"
              className="text-5xl font-bold text-red-600"
            />
          </div>

          <p className="text-lg text-gray-600 mb-4">{interstitialCopy.halfway.body}</p>
          <p className="text-gray-500 mb-8">{interstitialCopy.halfway.cta}</p>

          <button
            onClick={onContinue}
            className="px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/25"
          >
            {interstitialCopy.halfway.buttonText}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto text-center py-12"
    >
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="mb-8">
          <AnimatedCounter
            value={leakage}
            prefix="$"
            suffix="/mo"
            className="text-5xl md:text-6xl font-bold text-red-500"
          />
        </div>

        <p className="text-xl text-white/90 mb-4 font-medium">
          {interstitialCopy.phaseTransition.body1}
        </p>
        <p className="text-lg text-white/70 mb-4">
          {interstitialCopy.phaseTransition.body2}
        </p>
        <p className="text-base text-white/60 mb-8">
          {interstitialCopy.phaseTransition.body3}
        </p>

        <button
          onClick={onContinue}
          className="px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all shadow-lg"
        >
          {interstitialCopy.phaseTransition.buttonText}
        </button>
      </div>
    </motion.div>
  );
}
