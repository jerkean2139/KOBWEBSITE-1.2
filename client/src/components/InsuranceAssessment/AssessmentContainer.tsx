import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { LeakageSidebar } from "./LeakageSidebar";
import { ProgressSidebar } from "./ProgressSidebar";
import { InterstitialScreen } from "./InterstitialScreen";
import { EmailGate } from "./EmailGate";
import { ResultsPage } from "./ResultsPage";
import { questions } from "@/data/insuranceAssessment";
import type { useInsuranceAssessment } from "@/hooks/useInsuranceAssessment";

type AssessmentHook = ReturnType<typeof useInsuranceAssessment>;

interface AssessmentContainerProps {
  assessment: AssessmentHook;
}

export function AssessmentContainer({ assessment }: AssessmentContainerProps) {
  const {
    state,
    currentQuestion,
    phase1Leakage,
    riskLevel,
    scoring,
    answeredCount,
    categoryProgress,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    continueFromInterstitial,
    submitEmail,
    skipEmail,
  } = assessment;

  if (state.screen === "halfway-interstitial") {
    return (
      <div className="min-h-[60vh] flex items-center">
        <InterstitialScreen
          type="halfway"
          leakage={phase1Leakage}
          onContinue={continueFromInterstitial}
        />
      </div>
    );
  }

  if (state.screen === "phase-transition") {
    return (
      <div className="min-h-[60vh] flex items-center">
        <InterstitialScreen
          type="phaseTransition"
          leakage={phase1Leakage}
          onContinue={continueFromInterstitial}
        />
      </div>
    );
  }

  if (state.screen === "email-gate") {
    return (
      <div className="min-h-[60vh] flex items-center">
        <EmailGate
          leakage={phase1Leakage}
          potential={scoring.netMonthlySwing}
          onSubmitEmail={submitEmail}
          onSkip={skipEmail}
        />
      </div>
    );
  }

  if (state.screen === "results") {
    return (
      <ResultsPage
        scoring={scoring}
        answers={state.answers}
        showFullResults={state.emailSubmitted}
      />
    );
  }

  if (state.screen === "question" && currentQuestion) {
    const currentPhase = currentQuestion.phase;

    return (
      <div>
        <ProgressBar answeredCount={answeredCount} currentPhase={currentPhase} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <LeakageSidebar leakage={phase1Leakage} riskLevel={riskLevel} />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <QuestionCard
              question={currentQuestion}
              questionNumber={state.currentQuestionIndex + 1}
              totalQuestions={questions.length}
              currentAnswer={state.answers[currentQuestion.id]}
              onAnswer={answerQuestion}
              onPrevious={goToPreviousQuestion}
              canGoPrevious={state.currentQuestionIndex > 0}
              onNext={goToNextQuestion}
            />
          </div>

          <div className="lg:col-span-3 order-3">
            <ProgressSidebar
              categoryProgress={categoryProgress}
              answeredCount={answeredCount}
              currentPhase={currentPhase}
              scoring={currentPhase === 2 ? scoring : undefined}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
