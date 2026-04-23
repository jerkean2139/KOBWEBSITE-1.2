import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface GHLFormProps {
  formId: string;
  /** Heading above the form */
  heading?: string;
  /** Submit button text */
  buttonText?: string;
  /** Success message after submission */
  successMessage?: string;
  /** Source tag for GHL tracking */
  source?: string;
  /** Show phone field */
  showPhone?: boolean;
  /** Additional CSS class */
  className?: string;
  /** After successful submit */
  onSuccess?: () => void;
}

export default function GHLForm({
  formId,
  heading,
  buttonText = "Get Started",
  successMessage = "You're in! Check your inbox.",
  source = "keanonbiz_website",
  showPhone = true,
  className = "",
  onSuccess,
}: GHLFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");

    try {
      // Submit to GHL form API (no-cors — fire and forget)
      const formData = new URLSearchParams();
      formData.append("formId", formId);
      formData.append("full_name", name.trim());
      formData.append("email", email.trim());
      if (phone.trim()) formData.append("phone", phone.trim());
      formData.append("source", source);

      await fetch(`https://api.leadconnectorhq.com/widget/form/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        mode: "no-cors",
      });

      // Also send through our server for webhook + tracking
      try {
        await fetch("/api/ghl-webhooks/form-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formId,
            full_name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            source,
          }),
        });
      } catch {
        // Non-critical — GHL form post already succeeded
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "oklch(0.40 0.12 155 / 0.2)" }}
        >
          <CheckCircle2 size={28} style={{ color: "oklch(0.65 0.18 155)" }} />
        </div>
        <p className="text-lg font-bold text-foreground mb-1">{successMessage}</p>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          We'll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {heading && (
        <h3 className="text-lg font-bold text-foreground mb-4">{heading}</h3>
      )}
      <div className="space-y-3">
        <div>
          <label htmlFor={`ghl-name-${formId}`} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Full Name
          </label>
          <input
            id={`ghl-name-${formId}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jeremy Kean"
            required
            className="w-full px-4 py-3 rounded-lg text-foreground placeholder:opacity-30 focus:outline-none transition-all text-sm"
            style={{
              backgroundColor: "var(--input)",
              border: "1px solid var(--border)",
            }}
          />
        </div>
        <div>
          <label htmlFor={`ghl-email-${formId}`} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Email
          </label>
          <input
            id={`ghl-email-${formId}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jeremy@example.com"
            required
            className="w-full px-4 py-3 rounded-lg text-foreground placeholder:opacity-30 focus:outline-none transition-all text-sm"
            style={{
              backgroundColor: "var(--input)",
              border: "1px solid var(--border)",
            }}
          />
        </div>
        {showPhone && (
          <div>
            <label htmlFor={`ghl-phone-${formId}`} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Phone <span style={{ color: "var(--text-tertiary)" }}>(optional)</span>
            </label>
            <input
              id={`ghl-phone-${formId}`}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 rounded-lg text-foreground placeholder:opacity-30 focus:outline-none transition-all text-sm"
              style={{
                backgroundColor: "var(--input)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={status === "loading" || !name.trim() || !email.trim()}
        className="w-full h-12 mt-4 font-bold text-sm disabled:opacity-40"
        style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
      >
        {status === "loading" ? (
          <><Loader2 className="mr-2 animate-spin" size={18} /> Submitting...</>
        ) : (
          <>{buttonText} <ArrowRight className="ml-2" size={16} /></>
        )}
      </Button>

      {status === "error" && (
        <p className="text-sm mt-2 text-center" style={{ color: "oklch(0.70 0.18 25)" }}>
          Something went wrong. Please try again.
        </p>
      )}

      <p className="text-xs mt-3 text-center" style={{ color: "var(--text-tertiary)" }}>
        By submitting, you agree to our{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
        {" "}and{" "}
        <a href="/terms" className="text-primary hover:underline">Terms</a>.
      </p>
    </form>
  );
}
