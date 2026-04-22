import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const steps = [
  "Analyzing your answers...",
  "Scoring founder dependency...",
  "Evaluating systems maturity...",
  "Calculating automation potential...",
  "Generating your personalized report...",
];

export function ProcessingScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <motion.div
        className="w-16 h-16 rounded-full mb-8"
        style={{ border: "3px solid var(--border)", borderTopColor: "var(--amber)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold text-foreground text-center"
      >
        {steps[step]}
      </motion.p>
      <div className="flex gap-1.5 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i <= step ? "var(--amber)" : "var(--border)" }}
          />
        ))}
      </div>
    </div>
  );
}
