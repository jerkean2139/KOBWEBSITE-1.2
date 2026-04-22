import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import type { AuditQuestion } from "@/data/miniAuditQuestions";

interface QuestionStepProps {
  question: AuditQuestion;
  questionIndex: number;
  totalSteps: number;
  currentAnswer?: string;
  direction: number;
  onAnswer: (fieldName: string, value: string) => void;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
};

export function QuestionStep({ question, questionIndex, totalSteps, currentAnswer, direction, onAnswer }: QuestionStepProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="p-8 md:p-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 leading-tight">
          {question.question}
        </h2>
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = currentAnswer === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onAnswer(question.fieldName, option.value)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-white/5 hover:border-muted-foreground/30 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold text-lg ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{option.description}</p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover:border-muted-foreground/50"
                  }`}>
                    {isSelected && <Check className="text-primary-foreground" size={14} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-6 text-sm flex items-center gap-2" style={{ color: "var(--text-tertiary)" }}>
          Select an option to continue <ChevronRight size={14} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
