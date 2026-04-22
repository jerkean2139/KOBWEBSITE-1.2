import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ClipboardCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { useMiniAudit } from "@/hooks/useMiniAudit";
import { QuestionStep, ContactStep, ProcessingScreen, ResultsPage } from "@/components/MiniAudit";
import { TOTAL_QUESTIONS } from "@/data/miniAuditQuestions";

export default function Assessment() {
  const audit = useMiniAudit();

  // Results screen — full-width layout, no card wrapper
  if (audit.state.screen === "results") {
    return (
      <>
        <SEO
          title="Your Mini Audit Results | KeanOnBiz"
          description="Your personalized Manumation Mini Audit results — see your bottleneck score and category breakdown."
        />
        <Navigation />
        <main className="min-h-screen" style={{ backgroundColor: "var(--surface-sunken)" }}>
          <ResultsPage
            firstName={audit.state.contact.name.split(" ")[0]}
            overallScore={audit.overallScore}
            categoryScores={audit.categoryScores}
            scoreLabel={audit.scoreLabel}
            recommendedCall={audit.recommendedCall}
          />
        </main>
        <Footer />
      </>
    );
  }

  // Processing screen
  if (audit.state.screen === "processing") {
    return (
      <>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--surface-sunken)" }}>
          <ProcessingScreen />
        </main>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Free Mini Audit — Discover What's Holding You Back | KeanOnBiz"
        description="Take this 5-minute Mini Audit to identify your biggest business bottlenecks across 4 critical categories. Get a personalized score and see what the full Manumation Audit would reveal."
      />
      <Navigation />
      <main id="main-content" className="min-h-screen" style={{ backgroundColor: "var(--surface-sunken)" }} role="main">
        {/* Header */}
        <section className="relative pt-28 pb-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div
              className="absolute top-10 right-20 w-80 h-80 rounded-full opacity-15"
              style={{ backgroundColor: "var(--primary)", filter: "blur(100px)" }}
            />
            <div
              className="absolute bottom-10 left-20 w-64 h-64 rounded-full opacity-10"
              style={{ backgroundColor: "var(--amber)", filter: "blur(80px)" }}
            />
          </div>

          <div className="container relative z-10">
            <AnimatedSection animation="fade-in">
              <div className="max-w-2xl mx-auto text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{ border: "1px solid oklch(0.58 0.20 250 / 0.3)", backgroundColor: "oklch(0.58 0.20 250 / 0.1)" }}
                >
                  <ClipboardCheck className="text-primary" size={16} aria-hidden="true" />
                  <p className="text-primary text-sm font-bold uppercase tracking-wider">Free Mini Audit</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Discover Your Bottleneck Score
                </h1>
                <p style={{ color: "var(--text-secondary)" }}>
                  12 questions across 4 categories. Answer honestly for the most accurate results.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="container max-w-2xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {audit.state.screen === "contact"
                ? "Contact Info"
                : `Question ${audit.state.currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`}
            </span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {Math.round(audit.progress)}%
            </span>
          </div>
          <div className="h-2 rounded-full" style={{ backgroundColor: "var(--muted)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--amber)" }}
              initial={{ width: 0 }}
              animate={{ width: `${audit.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question / Contact Card */}
        <section className="pb-20">
          <div className="container max-w-2xl mx-auto px-4">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
              }}
            >
              {audit.state.screen === "question" && audit.currentQuestion && (
                <>
                  <QuestionStep
                    question={audit.currentQuestion}
                    questionIndex={audit.state.currentQuestionIndex}
                    totalSteps={TOTAL_QUESTIONS}
                    currentAnswer={audit.state.answers[audit.currentQuestion.fieldName]}
                    direction={audit.direction}
                    onAnswer={audit.answerQuestion}
                  />
                  {/* Back button */}
                  {audit.state.currentQuestionIndex > 0 && (
                    <div className="px-8 md:px-12 pb-6">
                      <Button
                        variant="ghost"
                        onClick={audit.goBack}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ArrowLeft className="mr-2" size={18} /> Back
                      </Button>
                    </div>
                  )}
                </>
              )}

              {audit.state.screen === "contact" && (
                <ContactStep
                  name={audit.state.contact.name}
                  email={audit.state.contact.email}
                  phone={audit.state.contact.phone}
                  isSubmitting={audit.isSubmitting}
                  submitError={audit.submitError}
                  onUpdate={audit.updateContact}
                  onSubmit={audit.submit}
                  onBack={audit.goBack}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
