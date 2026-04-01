import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { AssessmentQuestion } from "@/data/insuranceAssessment";

interface QuestionCardProps {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: number | string;
  onAnswer: (questionId: number, value: number | string) => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  onNext: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswer,
  onPrevious,
  canGoPrevious,
  onNext,
}: QuestionCardProps) {
  const [numericValue, setNumericValue] = useState<string>(
    currentAnswer !== undefined ? String(currentAnswer) : String(question.default ?? "")
  );

  useEffect(() => {
    if (question.type === "numeric") {
      setNumericValue(
        currentAnswer !== undefined ? String(currentAnswer) : String(question.default ?? "")
      );
    }
  }, [question.id, currentAnswer, question.type, question.default]);

  const handleRadioSelect = (value: number, optionText?: string) => {
    if (question.id === 30 && optionText) {
      onAnswer(question.id, optionText);
    } else {
      onAnswer(question.id, value);
    }
  };

  const handleNumericSubmit = () => {
    const val = Number(numericValue);
    if (!isNaN(val)) {
      onAnswer(question.id, val);
    }
  };

  const isNumericValid = numericValue !== "" && !isNaN(Number(numericValue));

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
            {question.category}
          </span>
          <span className="text-gray-400 text-sm ml-auto">
            Q{questionNumber} of {totalQuestions}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {question.question}
        </h3>

        <p className="text-gray-500 text-sm mb-6">{question.helper}</p>

        {question.type === "radio" && question.options && (
          <div role="radiogroup" aria-label={question.question} className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected =
                question.id === 30
                  ? currentAnswer === option.text
                  : currentAnswer === option.value;

              return (
                <button
                  key={idx}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleRadioSelect(option.value, option.text)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-200 hover:border-red-300 hover:bg-red-50/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "border-red-500 bg-red-500" : "border-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm md:text-base ${
                        isSelected ? "text-red-800 font-medium" : "text-gray-700"
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {question.type === "numeric" && (
          <div className="space-y-4">
            <label htmlFor={`q-${question.id}`} className="sr-only">
              {question.question}
            </label>
            <div className="flex items-center gap-3">
              {question.unit?.startsWith("$") && (
                <span className="text-2xl font-bold text-gray-400" aria-hidden="true">$</span>
              )}
              <input
                id={`q-${question.id}`}
                type="number"
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value)}
                min={question.min}
                max={question.max}
                aria-label={`${question.question} (${question.unit || ""})`}
                className="w-full text-2xl font-bold p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder={String(question.default)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isNumericValid) handleNumericSubmit();
                }}
              />
              {question.unit && !question.unit.startsWith("$") && (
                <span className="text-sm text-gray-500 whitespace-nowrap">{question.unit}</span>
              )}
            </div>
            <button
              onClick={handleNumericSubmit}
              disabled={!isNumericValid}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all ${
                isNumericValid
                  ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/25"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Next <ArrowRight className="inline ml-2" size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          {canGoPrevious ? (
            <button
              onClick={onPrevious}
              aria-label="Go to previous question"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Previous
            </button>
          ) : (
            <div />
          )}
          {question.type === "radio" && currentAnswer !== undefined && (
            <button
              onClick={onNext}
              aria-label="Go to next question"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Next <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
