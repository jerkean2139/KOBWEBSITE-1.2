import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ChevronRight, AlertCircle } from "lucide-react";

interface ContactStepProps {
  name: string;
  email: string;
  phone: string;
  isSubmitting: boolean;
  submitError: boolean;
  onUpdate: (field: "name" | "email" | "phone", value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ContactStep({ name, email, phone, isSubmitting, submitError, onUpdate, onSubmit, onBack }: ContactStepProps) {
  const canSubmit = name.trim() && email.trim() && !isSubmitting;

  return (
    <div className="p-8 md:p-12">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
        Almost there! Where should we send your results?
      </h2>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        We'll generate your personalized score and category breakdown.
      </p>

      <div className="space-y-5">
        <div>
          <label htmlFor="audit-name" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Full Name</label>
          <input
            id="audit-name"
            type="text"
            value={name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="Jeremy Kean"
            className="w-full px-5 py-4 bg-white/5 border rounded-xl text-foreground placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label htmlFor="audit-email" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Email Address</label>
          <input
            id="audit-email"
            type="email"
            value={email}
            onChange={(e) => onUpdate("email", e.target.value)}
            placeholder="jeremy@example.com"
            className="w-full px-5 py-4 bg-white/5 border rounded-xl text-foreground placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label htmlFor="audit-phone" className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Phone Number</label>
          <input
            id="audit-phone"
            type="tel"
            value={phone}
            onChange={(e) => onUpdate("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-5 py-4 bg-white/5 border rounded-xl text-foreground placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
      </div>

      <p className="text-xs mt-6" style={{ color: "var(--text-tertiary)" }}>
        By submitting, you agree to our{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
        {" "}and{" "}
        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
      </p>

      {submitError && (
        <div role="alert" className="mt-4 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: "oklch(0.60 0.22 25 / 0.1)", border: "1px solid oklch(0.60 0.22 25 / 0.3)" }}>
          <AlertCircle size={20} style={{ color: "oklch(0.70 0.18 25)" }} />
          <p className="text-sm" style={{ color: "oklch(0.70 0.18 25)" }}>Something went wrong. Please try again.</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2" size={18} /> Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="font-semibold px-8 py-6 text-lg disabled:opacity-50"
          style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 animate-spin" size={20} /> Analyzing...</>
          ) : (
            <>Get My Results <ChevronRight className="ml-2" size={20} /></>
          )}
        </Button>
      </div>
    </div>
  );
}
