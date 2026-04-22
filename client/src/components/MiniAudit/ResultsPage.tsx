import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, FileText, Users as UsersIcon, Cpu, DollarSign, Calendar } from "lucide-react";
import { CategoryScoreCard } from "./CategoryScoreCard";
import { useReferral } from "@/hooks/useReferral";
import {
  CATEGORIES,
  getCategoryInsight,
  getLockedTeaser,
  type AuditCategory,
} from "@/data/miniAuditQuestions";

interface ResultsPageProps {
  firstName: string;
  overallScore: number;
  categoryScores: Record<AuditCategory, number>;
  scoreLabel: { label: string; color: string; message: string };
  recommendedCall: { url: string; label: string; description: string };
}

const FULL_AUDIT_LOCKED = [
  { icon: DollarSign, text: "Revenue leak quantification — exact dollar amount per month" },
  { icon: UsersIcon, text: "Team-specific delegation map with role-by-role action plan" },
  { icon: Cpu, text: "Automation ROI projection with implementation costs" },
  { icon: FileText, text: "90-day implementation roadmap with weekly milestones" },
  { icon: Calendar, text: "Custom tool recommendations for your specific stack" },
];

export function ResultsPage({ firstName, overallScore, categoryScores, scoreLabel, recommendedCall }: ResultsPageProps) {
  const { isReferral } = useReferral();
  const callHref = isReferral ? recommendedCall.url : "/jeremys-calendar-intro";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <p className="text-sm font-medium mb-2" style={{ color: "var(--text-tertiary)" }}>
          {firstName}, your Mini Audit score is
        </p>
        <div className="flex items-end justify-center gap-2 mb-3">
          <span className="text-7xl font-extrabold text-foreground">{overallScore}</span>
          <span className="text-2xl font-medium mb-3" style={{ color: "var(--text-tertiary)" }}>/100</span>
        </div>
        <span
          className="inline-block text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full"
          style={{ backgroundColor: `color-mix(in oklch, ${scoreLabel.color} 15%, transparent)`, color: scoreLabel.color }}
        >
          {scoreLabel.label}
        </span>
      </motion.div>

      {/* Score bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="h-2 rounded-full" style={{ backgroundColor: "var(--muted)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreLabel.color }}
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ delay: 0.4, duration: 1 }}
          />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-12 max-w-lg mx-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        {scoreLabel.message}
      </motion.p>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h3 className="text-xl font-bold text-foreground mb-6">Your Breakdown by Category</h3>
        <div className="space-y-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryScoreCard
              key={cat}
              category={cat}
              score={categoryScores[cat]}
              insight={getCategoryInsight(cat, categoryScores[cat])}
              lockedTeaser={getLockedTeaser(cat)}
              delay={0.6 + i * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Upsell Bridge — What the Mini Audit Can't Tell You */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="rounded-lg p-6 sm:p-8 mb-10"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-xl font-bold text-foreground mb-2">What the Mini Audit Can't Tell You</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          This free assessment gives you the overview. The full Manumation Audit goes deep — here's what it unlocks:
        </p>

        <div className="space-y-3 mb-8">
          {FULL_AUDIT_LOCKED.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--muted)" }}>
                  <Lock size={14} style={{ color: "var(--text-tertiary)" }} />
                </div>
                <p className="text-sm pt-1" style={{ color: "var(--text-secondary)" }}>{item.text}</p>
              </div>
            );
          })}
        </div>

        <a href="/manumation-audit">
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 font-bold"
            style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
          >
            Learn About the Full Manumation Audit
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </a>
      </motion.div>

      {/* Recommended Next Step */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="rounded-lg p-6 sm:p-8 mb-10"
        style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Recommended Next Step</p>
        <h3 className="text-xl font-bold mb-2">{recommendedCall.label}</h3>
        <p className="text-sm mb-6 opacity-90">{recommendedCall.description}</p>
        <a href={callHref}>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold h-12 px-8">
            Book Your Call <ArrowRight className="ml-2" size={16} />
          </Button>
        </a>
      </motion.div>

      {/* Secondary links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <a href="/book">
          <Button variant="outline" size="sm">Get the Book</Button>
        </a>
        <a href="/blog">
          <Button variant="outline" size="sm">Read the Blog</Button>
        </a>
        <a href="/">
          <Button variant="outline" size="sm">Back to Home</Button>
        </a>
      </motion.div>
    </div>
  );
}
