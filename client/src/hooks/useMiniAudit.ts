import { useState, useCallback, useMemo } from "react";
import {
  questions,
  TOTAL_QUESTIONS,
  calculateOverallScore,
  calculateCategoryScores,
  getScoreLabel,
  getRecommendedCall,
  type AuditCategory,
} from "@/data/miniAuditQuestions";

export type AuditScreen = "question" | "contact" | "processing" | "results";

interface AuditState {
  screen: AuditScreen;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  contact: { name: string; email: string; phone: string };
}

export function useMiniAudit() {
  const [state, setState] = useState<AuditState>({
    screen: "question",
    currentQuestionIndex: 0,
    answers: {},
    contact: { name: "", email: "", phone: "" },
  });
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const currentQuestion = questions[state.currentQuestionIndex] ?? null;
  const answeredCount = Object.keys(state.answers).filter((k) => k !== "business_type").length;
  const progress = ((state.currentQuestionIndex + 1) / (TOTAL_QUESTIONS + 1)) * 100; // +1 for contact step

  const overallScore = useMemo(() => calculateOverallScore(state.answers), [state.answers]);
  const categoryScores = useMemo(() => calculateCategoryScores(state.answers), [state.answers]);
  const scoreLabel = useMemo(() => getScoreLabel(overallScore), [overallScore]);
  const recommendedCall = useMemo(() => getRecommendedCall(state.answers, overallScore), [state.answers, overallScore]);

  const answerQuestion = useCallback((fieldName: string, value: string) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [fieldName]: value },
    }));
    // Auto-advance after short delay
    setTimeout(() => {
      setState((prev) => {
        if (prev.currentQuestionIndex < TOTAL_QUESTIONS - 1) {
          return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
        }
        // Last question answered — go to contact step
        return { ...prev, screen: "contact" };
      });
      setDirection(1);
    }, 300);
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setState((prev) => {
      if (prev.screen === "contact") {
        return { ...prev, screen: "question", currentQuestionIndex: TOTAL_QUESTIONS - 1 };
      }
      if (prev.currentQuestionIndex > 0) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 };
      }
      return prev;
    });
  }, []);

  const updateContact = useCallback((field: "name" | "email" | "phone", value: string) => {
    setState((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(false);
    setState((prev) => ({ ...prev, screen: "processing" }));

    try {
      const score = calculateOverallScore(state.answers);
      const catScores = calculateCategoryScores(state.answers);
      const label = getScoreLabel(score);
      const call = getRecommendedCall(state.answers, score);

      // GHL form submission
      const formData = new URLSearchParams();
      formData.append("formId", "p7TQrdK8KZEQfC9JWtQT");
      formData.append("full_name", state.contact.name);
      formData.append("email", state.contact.email);
      formData.append("phone", state.contact.phone);
      Object.entries(state.answers).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("lead_score", score.toString());
      formData.append("lead_score_label", label.label);
      formData.append("recommended_call_type", call.type);
      formData.append("assessment_source", "keanonbiz_mini_audit");
      formData.append("assessment_date", new Date().toISOString());
      formData.append("category_scores", JSON.stringify(catScores));

      await fetch("https://api.leadconnectorhq.com/widget/form/p7TQrdK8KZEQfC9JWtQT", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        mode: "no-cors",
      });

      // Server-side webhook + tracking
      try {
        await fetch("/api/mini-audit/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: state.contact.name,
            email: state.contact.email,
            phone: state.contact.phone,
            lead_score: score,
            lead_score_label: label.label,
            recommended_call_type: call.type,
            category_scores: catScores,
            answers: state.answers,
          }),
        });
      } catch {
        // Non-critical
      }

      // Store completion in sessionStorage (unlocks calendar gate)
      sessionStorage.setItem(
        "kob_mini_audit_completed",
        JSON.stringify({ timestamp: Date.now(), score, email: state.contact.email })
      );

      // Brief processing animation, then show results
      await new Promise((r) => setTimeout(r, 2000));
      setState((prev) => ({ ...prev, screen: "results" }));
    } catch {
      setSubmitError(true);
      setState((prev) => ({ ...prev, screen: "contact" }));
    } finally {
      setIsSubmitting(false);
    }
  }, [state.answers, state.contact]);

  return {
    state,
    direction,
    currentQuestion,
    progress,
    answeredCount,
    overallScore,
    categoryScores,
    scoreLabel,
    recommendedCall,
    isSubmitting,
    submitError,
    answerQuestion,
    goBack,
    updateContact,
    submit,
  };
}
