import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ClipboardCheck, ArrowRight, ArrowLeft, Check, Loader2, ChevronRight, AlertCircle, Calendar, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";

// Lead scoring weights - higher scores = more urgent need
const SCORE_WEIGHTS: Record<string, Record<string, number>> = {
  weekly_hours: { under_40: 10, "40_50": 25, "50_60": 50, "60_plus": 100 },
  biggest_bottleneck: { me: 100, team: 60, systems: 80, leads: 40 },
  delegation_comfort: { very: 10, somewhat: 40, struggle: 70, never: 100 },
  annual_revenue: { under_250k: 20, "250k_500k": 40, "500k_1m": 70, "1m_plus": 100 },
  primary_goal: { scale: 60, freedom: 80, systems: 70, exit: 90 },
  automation_level: { none: 100, basic: 70, some: 40, advanced: 10 },
};

// Calculate lead score (0-100)
function calculateLeadScore(answers: Record<string, string>): number {
  let totalScore = 0;
  let count = 0;
  
  Object.entries(answers).forEach(([field, value]) => {
    if (SCORE_WEIGHTS[field] && SCORE_WEIGHTS[field][value]) {
      totalScore += SCORE_WEIGHTS[field][value];
      count++;
    }
  });
  
  return count > 0 ? Math.round(totalScore / count) : 0;
}

// Determine recommended call type based on score and answers
function getRecommendedCall(answers: Record<string, string>, score: number): { type: string; url: string; label: string; description: string } {
  if (score >= 70 || answers.weekly_hours === "60_plus" || answers.biggest_bottleneck === "me") {
    return {
      type: "discovery",
      url: "/jeremys-calendar-intro",
      label: "Discovery Call with Jeremy",
      description: "You've got a founder bottleneck — and you can't fix a broken engine from inside it. Let's map your escape plan in 30 minutes."
    };
  }
  
  if (score >= 40 || answers.primary_goal === "systems" || answers.primary_goal === "scale") {
    return {
      type: "discovery",
      url: "/jeremys-calendar-intro",
      label: "Discovery Call with Jeremy",
      description: "Your engine has untapped potential. Let's identify the bottlenecks holding you back and build a plan to break through."
    };
  }
  
  return {
    type: "discovery",
    url: "/jeremys-calendar-intro", 
    label: "Discovery Call with Jeremy",
    description: "Let's have a quick conversation to see where you stand and map out your next steps toward a business that runs without you."
  };
}

function getScoreLabel(score: number): { label: string; color: string; message: string } {
  if (score >= 70) return { 
    label: "Founder Bottleneck Detected", 
    color: "#ef4444",
    message: "You are the bottleneck. Your business has a broken engine — it runs on you, not because of you. Without intervention, you're heading toward burnout and your growth ceiling is locked."
  };
  if (score >= 50) return { 
    label: "Bottleneck Risk: High", 
    color: "#f59e0b",
    message: "Your business has significant founder dependencies. Key processes still run through you, and your engine is showing cracks. Left unchecked, these bottlenecks will stall your growth."
  };
  if (score >= 30) return { 
    label: "Bottleneck Risk: Moderate", 
    color: "#3b82f6",
    message: "You've built a decent foundation, but there are hidden bottlenecks limiting your potential. A few strategic changes could unlock real freedom and scalable growth."
  };
  return { 
    label: "Engine Running Smooth", 
    color: "#22c55e",
    message: "Your business engine is well-built. You've avoided the founder trap that catches most owners. Let's explore how to optimize what's already working and plan your next level."
  };
}

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
  fieldName: string;
}

const questions: Question[] = [
  {
    id: "hours",
    question: "How many hours per week are you working in your business?",
    fieldName: "weekly_hours",
    options: [
      { value: "under_40", label: "Under 40 hours", description: "I've got a good handle on my time" },
      { value: "40_50", label: "40-50 hours", description: "Standard work week, manageable" },
      { value: "50_60", label: "50-60 hours", description: "Starting to feel the strain" },
      { value: "60_plus", label: "60+ hours", description: "I'm drowning and need help" },
    ],
  },
  {
    id: "business_type",
    question: "What best describes your business?",
    fieldName: "business_type",
    options: [
      { value: "insurance_agency", label: "Insurance Agency", description: "I own or run an insurance agency" },
      { value: "coaching_consulting", label: "Coaching or Consulting", description: "I sell my expertise" },
      { value: "service_business", label: "Service Business", description: "I deliver a service to clients" },
      { value: "other", label: "Other", description: "Something else" },
    ],
  },
  {
    id: "bottleneck",
    question: "What's the biggest bottleneck in your business right now?",
    fieldName: "biggest_bottleneck",
    options: [
      { value: "me", label: "Everything goes through me", description: "I'm the bottleneck for every decision" },
      { value: "team", label: "Team capacity", description: "My team is maxed out" },
      { value: "systems", label: "Lack of systems", description: "Things fall through the cracks" },
      { value: "leads", label: "Not enough leads", description: "I need more customers" },
    ],
  },
  {
    id: "delegation",
    question: "How comfortable are you with delegating tasks?",
    fieldName: "delegation_comfort",
    options: [
      { value: "very", label: "Very comfortable", description: "I delegate regularly and effectively" },
      { value: "somewhat", label: "Somewhat comfortable", description: "I delegate but micromanage" },
      { value: "struggle", label: "I struggle with it", description: "I know I should but I can't let go" },
      { value: "never", label: "I do everything myself", description: "No one can do it like I can" },
    ],
  },
  {
    id: "revenue",
    question: "What's your current annual revenue?",
    fieldName: "annual_revenue",
    options: [
      { value: "under_250k", label: "Under $250K", description: "" },
      { value: "250k_500k", label: "$250K - $500K", description: "" },
      { value: "500k_1m", label: "$500K - $1M", description: "" },
      { value: "1m_plus", label: "$1M+", description: "" },
    ],
  },
  {
    id: "goal",
    question: "What's your primary goal for the next 12 months?",
    fieldName: "primary_goal",
    options: [
      { value: "scale", label: "Scale revenue", description: "Grow the top line significantly" },
      { value: "freedom", label: "More time freedom", description: "Work less, live more" },
      { value: "systems", label: "Build better systems", description: "Create a business that runs without me" },
      { value: "exit", label: "Prepare to sell/exit", description: "Build enterprise value" },
    ],
  },
  {
    id: "automation",
    question: "How would you describe your current use of automation?",
    fieldName: "automation_level",
    options: [
      { value: "none", label: "What's automation?", description: "Everything is manual" },
      { value: "basic", label: "Basic tools only", description: "Email, maybe a CRM" },
      { value: "some", label: "Some automation", description: "A few processes are automated" },
      { value: "advanced", label: "Heavily automated", description: "We've automated most repetitive tasks" },
    ],
  },
];

export default function Assessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [direction, setDirection] = useState(1);
  const [leadScore, setLeadScore] = useState(0);
  const [recommendedCall, setRecommendedCall] = useState<{ type: string; url: string; label: string; description: string } | null>(null);

  const totalSteps = questions.length + 1; // +1 for contact info
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isContactStep = currentStep === questions.length;

  const handleOptionSelect = (value: string) => {
    const question = questions[currentStep];
    setAnswers((prev) => ({ ...prev, [question.fieldName]: value }));
    
    // Auto-advance after selection with slight delay
    setTimeout(() => {
      if (currentStep < questions.length) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(false);
    
    try {
      // Calculate lead score and recommendation
      const score = calculateLeadScore(answers);
      const recommendation = getRecommendedCall(answers, score);
      const scoreLabel = getScoreLabel(score);
      
      setLeadScore(score);
      setRecommendedCall(recommendation);
      
      // Build form data for GHL with enhanced data
      const formData = new URLSearchParams();
      formData.append("formId", "p7TQrdK8KZEQfC9JWtQT");
      formData.append("full_name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      
      // Add all assessment answers
      Object.entries(answers).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add lead scoring data for GHL custom fields
      formData.append("lead_score", score.toString());
      formData.append("lead_score_label", scoreLabel.label);
      formData.append("recommended_call_type", recommendation.type);
      formData.append("assessment_source", "keanonbiz_website");
      formData.append("assessment_date", new Date().toISOString());

      // Submit to GHL - using no-cors since GHL doesn't return CORS headers
      await fetch("https://api.leadconnectorhq.com/widget/form/p7TQrdK8KZEQfC9JWtQT", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        mode: "no-cors",
      });
      
      // Trigger GHL webhook for workflow automation (via backend to avoid CORS)
      try {
        await fetch("/api/ghl-webhooks/assessment-completed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: name,
            email,
            phone,
            lead_score: score,
            lead_score_label: scoreLabel.label,
            recommended_call_type: recommendation.type,
            assessment_source: "keanonbiz_website",
            assessment_date: new Date().toISOString(),
            contact: {
              audit_business_type: answers.business_type || "",
            },
            ...Object.fromEntries(
              Object.entries(answers).filter(([key]) => key !== "business_type")
            ),
          }),
        });
      } catch {
        console.log("GHL webhook skipped");
      }

      // Also track the assessment completion for analytics
      try {
        await fetch("/api/track/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            score,
            scoreLabel: scoreLabel.label,
            answers,
            recommendedCall: recommendation.type,
          }),
        });
      } catch (trackError) {
        // Non-critical, continue anyway
        console.log("Tracking skipped");
      }

      setIsComplete(true);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  if (isComplete) {
    const scoreInfo = getScoreLabel(leadScore);
    
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-[#0a0a12] py-20">
          <div className="container max-w-3xl px-4">
            {/* Success Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="text-white" size={40} aria-hidden="true" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white mb-2 text-center"
            >
              {name.split(" ")[0]}, here's your Bottleneck Score
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-center mb-6"
            >
              Based on your answers, here's where your business engine stands.
            </motion.p>
            
            {/* Score Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#13131f] rounded-2xl border border-white/10 p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/70 text-sm uppercase tracking-wider">Your Bottleneck Score</span>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ backgroundColor: `${scoreInfo.color}20`, color: scoreInfo.color }}
                >
                  {scoreInfo.label}
                </span>
              </div>
              
              <div className="flex items-end gap-4 mb-4">
                <span className="text-6xl font-bold text-white">{leadScore}</span>
                <span className="text-white/70 text-lg mb-2">/100</span>
              </div>
              
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: scoreInfo.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${leadScore}%` }}
                  transition={{ delay: 0.6, duration: 1 }}
                />
              </div>
              
              <p className="text-white/70">{scoreInfo.message}</p>
            </motion.div>
            
            {/* Personalized Recommendation */}
            {recommendedCall && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-[#3b82f6]/20 to-[#FFD700]/20 rounded-2xl border border-[#3b82f6]/30 p-6 mb-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center shrink-0">
                    {recommendedCall.type === "strategy" ? (
                      <Calendar className="text-white" size={24} aria-hidden="true" />
                    ) : (
                      <Zap className="text-white" size={24} aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#FFD700] text-sm font-bold uppercase tracking-wider mb-1">Recommended Next Step</p>
                    <h3 className="text-xl font-bold text-white mb-2">{recommendedCall.label}</h3>
                    <p className="text-white/70 mb-4">{recommendedCall.description}</p>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white font-bold"
                      asChild
                    >
                      <a href={recommendedCall.url}>
                        Book Your {recommendedCall.label} <ArrowRight className="ml-2" aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid sm:grid-cols-2 gap-4 mb-6"
            >
              <a 
                href="/book"
                className="bg-[#13131f] rounded-2xl border border-white/10 p-5 hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                    <span className="text-[#FFD700] text-lg">📖</span>
                  </div>
                  <h4 className="text-white font-bold group-hover:text-[#FFD700] transition-colors">Get the Book</h4>
                </div>
                <p className="text-white/60 text-sm">The Manumation Method — the complete framework for building a business that runs without you.</p>
              </a>
              <div 
                className="bg-[#13131f] rounded-2xl border border-white/10 p-5 relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#3b82f6] rounded-full">
                  <span className="text-white text-xs font-bold uppercase tracking-wider">Coming Soon</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                    <Users className="text-[#3b82f6]" size={20} />
                  </div>
                  <h4 className="text-white font-bold">Join the Community</h4>
                </div>
                <p className="text-white/60 text-sm">Connect with other business owners breaking free from the founder trap. Stay tuned — launching soon.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center"
            >
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  className="text-white border-white/20 bg-white/5 hover:bg-white/10"
                  asChild
                >
                  <a href="/blog">Read the Blog</a>
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white/20 bg-white/5 hover:bg-white/10"
                  asChild
                >
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Free Bottleneck Audit - Discover What's Holding You Back"
        description="Take this 5-minute Bottleneck Audit to identify your biggest business bottlenecks and get a personalized action plan for growth."
      />
      <Navigation />
      <main id="main-content" className="min-h-screen bg-[#0a0a12]" role="main">
        {/* Header Section */}
        <section className="relative pt-28 pb-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-10 right-20 w-80 h-80 rounded-full opacity-15"
              style={{ backgroundColor: "#3b82f6", filter: "blur(100px)" }}
            />
            <div 
              className="absolute bottom-10 left-20 w-64 h-64 rounded-full opacity-10"
              style={{ backgroundColor: "#FFD700", filter: "blur(80px)" }}
            />
          </div>
          
          <div className="container relative z-10">
            <AnimatedSection animation="fade-in">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border border-[#3b82f6]/30 bg-[#3b82f6]/10">
                  <ClipboardCheck className="text-[#3b82f6]" size={16} aria-hidden="true" />
                  <p className="text-[#3b82f6] text-sm font-bold uppercase tracking-wider">5-Minute Bottleneck Audit</p>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Discover Your Path to Freedom
                </h1>
                <p className="text-white/70">Answer honestly for the most accurate results</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="container max-w-2xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">Question {currentStep + 1} of {totalSteps}</span>
            <span className="text-white/70 text-sm">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#3b82f6] to-[#FFD700]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <section className="pb-20">
          <div className="container max-w-2xl mx-auto px-4">
            <div 
              className="bg-[#13131f] rounded-3xl border border-white/10 overflow-hidden"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}
            >
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-8 md:p-12"
                  >
                  {!isContactStep ? (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                        {questions[currentStep].question}
                      </h2>
                      <div className="space-y-4">
                        {questions[currentStep].options.map((option) => {
                          const isSelected = answers[questions[currentStep].fieldName] === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleOptionSelect(option.value)}
                              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group ${
                                isSelected
                                  ? "border-[#3b82f6] bg-[#3b82f6]/10"
                                  : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`font-semibold text-lg ${isSelected ? "text-[#3b82f6]" : "text-white"}`}>
                                    {option.label}
                                  </p>
                                  {option.description && (
                                    <p className="text-white/70 text-sm mt-1">{option.description}</p>
                                  )}
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected 
                                    ? "border-[#3b82f6] bg-[#3b82f6]" 
                                    : "border-white/30 group-hover:border-white/50"
                                }`}>
                                  {isSelected && <Check className="text-white" size={14} />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                        Almost there! Where should we send your results?
                      </h2>
                      <p className="text-white/70 mb-8">We'll email you a personalized action plan based on your answers.</p>
                      <div className="space-y-5">
                        <div>
                          <label htmlFor="assessment-name" className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
                          <input
                            id="assessment-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jeremy Kean"
                            className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="assessment-email" className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
                          <input
                            id="assessment-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jeremy@example.com"
                            className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="assessment-phone" className="block text-white/70 text-sm font-medium mb-2">Phone Number</label>
                          <input
                            id="assessment-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(555) 123-4567"
                            className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-all"
                          />
                        </div>
                      </div>
                      <p className="text-white/70 text-xs mt-6">
                        By submitting, you agree to our{" "}
                        <a href="/privacy" className="text-[#3b82f6] hover:underline">Privacy Policy</a>
                        {" "}and{" "}
                        <a href="/terms" className="text-[#3b82f6] hover:underline">Terms of Service</a>.
                      </p>
                    </>
                  )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Error Message */}
              {submitError && (
                <div role="alert" aria-live="assertive" className="mx-8 md:mx-12 mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <AlertCircle className="text-red-400 shrink-0" size={20} aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-red-300 text-sm font-medium">Something went wrong. Please try again.</p>
                    <p className="text-red-300/60 text-xs mt-1">If this continues, please contact us directly.</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="px-8 md:px-12 pb-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                >
                  <ArrowLeft className="mr-2" size={18} aria-hidden="true" />
                  Back
                </Button>
                
                {isContactStep ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!name || !email || isSubmitting}
                    className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:opacity-90 text-white font-semibold px-8 py-6 text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={20} aria-hidden="true" />
                        Submitting...
                      </>
                    ) : submitError ? (
                      <>
                        Try Again
                        <ChevronRight className="ml-2" size={20} aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Get My Results
                        <ChevronRight className="ml-2" size={20} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-white/30 text-sm flex items-center gap-2">
                    Select an option to continue
                    <ChevronRight size={16} aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
