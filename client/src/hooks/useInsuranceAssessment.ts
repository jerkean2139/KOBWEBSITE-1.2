import { useState, useCallback, useMemo } from "react";
import {
  questions,
  calculateScoring,
  getRiskLevel,
  HALFWAY_QUESTION_ID,
  PHASE_TRANSITION_QUESTION_ID,
  TOTAL_QUESTIONS,
  type ScoringResult,
  type RiskLevel,
} from "@/data/insuranceAssessment";

export type AssessmentScreen =
  | "landing"
  | "question"
  | "halfway-interstitial"
  | "phase-transition"
  | "email-gate"
  | "results";

export interface AssessmentState {
  screen: AssessmentScreen;
  currentQuestionIndex: number;
  answers: Record<number, number | string>;
  email: string;
  emailSubmitted: boolean;
  skippedEmail: boolean;
}

export function useInsuranceAssessment() {
  const [state, setState] = useState<AssessmentState>({
    screen: "landing",
    currentQuestionIndex: 0,
    answers: {},
    email: "",
    emailSubmitted: false,
    skippedEmail: false,
  });

  const currentQuestion = useMemo(
    () => questions[state.currentQuestionIndex],
    [state.currentQuestionIndex]
  );

  const phase1Leakage = useMemo(() => {
    let total = 0;
    for (const q of questions) {
      if (q.phase === 1 && q.type === "radio" && state.answers[q.id] !== undefined) {
        total += Number(state.answers[q.id]) || 0;
      }
    }
    return total;
  }, [state.answers]);

  const riskLevel: RiskLevel = useMemo(() => getRiskLevel(phase1Leakage), [phase1Leakage]);

  const scoring: ScoringResult = useMemo(
    () => calculateScoring(state.answers),
    [state.answers]
  );

  const answeredCount = useMemo(
    () => Object.keys(state.answers).length,
    [state.answers]
  );

  const progress = useMemo(
    () => (answeredCount / TOTAL_QUESTIONS) * 100,
    [answeredCount]
  );

  const categoryProgress = useMemo(() => {
    const progress: Record<string, { answered: number; total: number }> = {};
    for (const q of questions) {
      if (!progress[q.category]) {
        progress[q.category] = { answered: 0, total: 0 };
      }
      progress[q.category].total++;
      if (state.answers[q.id] !== undefined) {
        progress[q.category].answered++;
      }
    }
    return progress;
  }, [state.answers]);

  const startAssessment = useCallback(() => {
    setState((s) => ({ ...s, screen: "question", currentQuestionIndex: 0 }));
  }, []);

  const answerQuestion = useCallback(
    (questionId: number, value: number | string) => {
      setState((prev) => {
        const newAnswers = { ...prev.answers, [questionId]: value };
        const newState = { ...prev, answers: newAnswers };

        const currentQ = questions[prev.currentQuestionIndex];
        if (!currentQ) return newState;

        if (currentQ.id === HALFWAY_QUESTION_ID && prev.screen !== "halfway-interstitial") {
          return { ...newState, screen: "halfway-interstitial" };
        }

        if (currentQ.id === PHASE_TRANSITION_QUESTION_ID && prev.screen !== "phase-transition") {
          return { ...newState, screen: "phase-transition" };
        }

        if (prev.currentQuestionIndex >= questions.length - 1) {
          return { ...newState, screen: "email-gate" };
        }

        return { ...newState, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      });
    },
    []
  );

  const goToNextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex >= questions.length - 1) {
        return { ...prev, screen: "email-gate" };
      }
      const nextIndex = prev.currentQuestionIndex + 1;
      return { ...prev, currentQuestionIndex: nextIndex, screen: "question" };
    });
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex <= 0) return prev;
      return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1, screen: "question" };
    });
  }, []);

  const continueFromInterstitial = useCallback(() => {
    setState((prev) => ({
      ...prev,
      screen: "question",
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));
  }, []);

  const submitEmail = useCallback((email: string) => {
    setState((prev) => ({
      ...prev,
      email,
      emailSubmitted: true,
      screen: "results",
    }));
  }, []);

  const skipEmail = useCallback(() => {
    setState((prev) => ({
      ...prev,
      skippedEmail: true,
      screen: "results",
    }));
  }, []);

  const resetAssessment = useCallback(() => {
    setState({
      screen: "landing",
      currentQuestionIndex: 0,
      answers: {},
      email: "",
      emailSubmitted: false,
      skippedEmail: false,
    });
  }, []);

  return {
    state,
    currentQuestion,
    phase1Leakage,
    riskLevel,
    scoring,
    answeredCount,
    progress,
    categoryProgress,
    startAssessment,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    continueFromInterstitial,
    submitEmail,
    skipEmail,
    resetAssessment,
  };
}
