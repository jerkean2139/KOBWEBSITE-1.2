import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import type { RiskLevel } from "@/data/insuranceAssessment";

interface LeakageSidebarProps {
  leakage: number;
  riskLevel: RiskLevel;
}

export function LeakageSidebar({ leakage, riskLevel }: LeakageSidebarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <TrendingDown className="text-red-500" size={20} />
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Estimated Monthly Leakage
          </h3>
        </div>

        <motion.div
          key={leakage}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatedCounter
            value={leakage}
            prefix="$"
            suffix="/mo"
            className="text-3xl md:text-4xl font-bold text-red-600"
          />
        </motion.div>

        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${riskLevel.bgColor} ${riskLevel.textColor} ${riskLevel.borderColor} border`}
          >
            <span>{riskLevel.badge}</span>
            {riskLevel.label}
          </span>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 italic leading-relaxed">
            "{riskLevel.quote}"
          </p>
        </div>

        {leakage > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <AlertTriangle size={14} />
              <span>
                That's <strong className="text-red-600">${(leakage * 12).toLocaleString()}/year</strong> walking
                out the door
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
