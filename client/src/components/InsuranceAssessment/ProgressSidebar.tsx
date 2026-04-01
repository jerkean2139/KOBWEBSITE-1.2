import { CheckCircle2, Circle } from "lucide-react";
import { categories, testimonials } from "@/data/insuranceAssessment";
import { AnimatedCounter } from "./AnimatedCounter";
import { useState, useEffect } from "react";
import type { ScoringResult } from "@/data/insuranceAssessment";

interface ProgressSidebarProps {
  categoryProgress: Record<string, { answered: number; total: number }>;
  answeredCount: number;
  currentPhase: 1 | 2;
  scoring?: ScoringResult;
}

export function ProgressSidebar({
  categoryProgress,
  answeredCount,
  currentPhase,
  scoring,
}: ProgressSidebarProps) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const showTestimonial = answeredCount >= 5;

  useEffect(() => {
    if (!showTestimonial) return;
    const interval = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [showTestimonial]);

  return (
    <div className="space-y-4 sticky top-24">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
          Progress by Category
        </h3>
        <div className="space-y-2.5">
          {categories.filter(c => c !== "Revenue & Opportunity").map((cat) => {
            const p = categoryProgress[cat];
            if (!p) return null;
            const done = p.answered >= p.total;
            return (
              <div key={cat} className="flex items-center gap-2">
                {done ? (
                  <CheckCircle2 className="text-green-500 flex-shrink-0" size={16} />
                ) : (
                  <Circle className="text-gray-300 flex-shrink-0" size={16} />
                )}
                <span className={`text-xs ${done ? "text-green-700 font-medium" : "text-gray-500"}`}>
                  {cat}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {p.answered}/{p.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {currentPhase === 2 && scoring && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
            Potential Impact
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Cost Saved</span>
              <AnimatedCounter value={scoring.costSaved} prefix="$" suffix="/mo" className="text-sm font-bold text-green-600" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Revenue Gained</span>
              <AnimatedCounter value={scoring.revenueGained} prefix="$" suffix="/mo" className="text-sm font-bold text-green-600" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Hours Recovered</span>
              <span className="text-sm font-bold text-blue-600">{scoring.hoursRecovered} hrs/wk</span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-700">Net Monthly Swing</span>
                <AnimatedCounter value={scoring.netMonthlySwing} prefix="$" suffix="/mo" className="text-base font-bold text-green-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {showTestimonial && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm flex-shrink-0">
              {testimonials[testimonialIndex].avatar}
            </div>
            <div>
              <p className="text-sm text-gray-600 italic leading-relaxed">
                "{testimonials[testimonialIndex].quote}"
              </p>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                — {testimonials[testimonialIndex].name}, {testimonials[testimonialIndex].role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
