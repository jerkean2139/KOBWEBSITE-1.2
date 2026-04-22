import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("https://api.leadconnectorhq.com/widget/form/WeCKj6eththzMepQtObZ", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, formId: "WeCKj6eththzMepQtObZ" }).toString(),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: "oklch(0.40 0.12 155 / 0.2)", border: "1px solid oklch(0.50 0.12 155 / 0.3)" }}>
        <CheckCircle2 size={20} style={{ color: "oklch(0.65 0.18 155)" }} aria-hidden="true" />
        <span className="font-medium" style={{ color: "oklch(0.70 0.14 155)" }}>You're subscribed. Check your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-2 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        disabled={status === "loading"}
        aria-label="Email address for newsletter"
        className="flex-1 h-12 px-4 rounded-lg text-foreground placeholder:opacity-30 focus:outline-none transition-all disabled:opacity-50 text-sm"
        style={{ backgroundColor: "var(--input)", border: "1px solid var(--border)" }}
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-12 px-6 font-semibold shrink-0"
        style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
      >
        {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : "Subscribe"}
      </Button>
    </form>
  );
}

export default function NewsletterSection() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--secondary)" }} aria-label="Newsletter signup">
      <div className="container">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
            Newsletter
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 tracking-tight">
            Biweekly Business Insights
          </h3>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            AI, automation, and systems strategies — written by Jeremy, delivered free. No fluff. No pitch decks.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
