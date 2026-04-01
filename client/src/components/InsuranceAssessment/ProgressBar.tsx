import { motion } from "framer-motion";
import { getProgressText, TOTAL_QUESTIONS } from "@/data/insuranceAssessment";

interface ProgressBarProps {
  answeredCount: number;
  currentPhase: 1 | 2;
}

export function ProgressBar({ answeredCount, currentPhase }: ProgressBarProps) {
  const progress = (answeredCount / TOTAL_QUESTIONS) * 100;
  const progressText = getProgressText(answeredCount, TOTAL_QUESTIONS);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{progressText}</span>
        <span className="text-sm text-gray-500">
          {answeredCount} of {TOTAL_QUESTIONS}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              currentPhase >= 1 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {answeredCount >= 23 ? "✓" : "1"}
          </div>
          <span className={`text-xs ${currentPhase === 1 ? "text-red-600 font-semibold" : "text-gray-500"}`}>
            What You're Losing
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              currentPhase === 2 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <span className={`text-xs ${currentPhase === 2 ? "text-red-600 font-semibold" : "text-gray-500"}`}>
            What You Could Gain
          </span>
        </div>
      </div>
    </div>
  );
}
