import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { AuditCategory } from "@/data/miniAuditQuestions";

interface CategoryScoreCardProps {
  category: AuditCategory;
  score: number;
  insight: string;
  lockedTeaser: string;
  delay?: number;
}

function getScoreColor(score: number): string {
  if (score >= 70) return "oklch(0.65 0.20 25)";
  if (score >= 50) return "oklch(0.75 0.15 80)";
  if (score >= 30) return "var(--primary)";
  return "oklch(0.65 0.18 155)";
}

export function CategoryScoreCard({ category, score, insight, lockedTeaser, delay = 0 }: CategoryScoreCardProps) {
  const color = getScoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 rounded-lg"
      style={{ backgroundColor: "var(--surface-elevated)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">{category}</span>
        <span className="text-sm font-bold" style={{ color }}>{score}/100</span>
      </div>

      {/* Score bar */}
      <div className="w-full h-1.5 rounded-full mb-3" style={{ backgroundColor: "var(--muted)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.3, duration: 0.8 }}
        />
      </div>

      {/* Insight */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
        {insight}
      </p>

      {/* Locked teaser */}
      <div className="flex items-start gap-2 p-3 rounded-md" style={{ backgroundColor: "var(--muted)" }}>
        <Lock size={14} className="mt-0.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          <span className="font-semibold">Full audit reveals:</span> {lockedTeaser}
        </p>
      </div>
    </motion.div>
  );
}
