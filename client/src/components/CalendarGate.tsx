import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardCheck, UserCheck, Loader2 } from "lucide-react";

interface CalendarGateProps {
  onQualified: () => void;
}

export default function CalendarGate({ onQualified }: CalendarGateProps) {
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");

  const validateCode = async () => {
    if (!referralCode.trim()) return;
    setValidating(true);
    setError("");
    try {
      const resp = await fetch("/api/referral/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: referralCode.trim() }),
      });
      const data = await resp.json();
      if (data.valid) {
        sessionStorage.setItem("kob_referral", referralCode.trim().toUpperCase());
        onQualified();
      } else {
        setError("Invalid referral code. Please check and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-lg w-full text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "var(--primary)", opacity: 0.9 }}
        >
          <UserCheck className="text-primary-foreground" size={28} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
          Before We Chat
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
          To make the most of our time together, please complete the free 5-minute Mini Audit first.
          It gives Jeremy context on your business so the call is focused on solutions, not discovery.
        </p>

        <div className="space-y-4">
          <a href="/assessment" className="block">
            <Button
              size="lg"
              className="w-full h-14 font-bold text-base"
              style={{ backgroundColor: "var(--amber)", color: "var(--amber-foreground)" }}
            >
              <ClipboardCheck className="mr-2" size={20} />
              Take the Free Mini Audit
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </a>

          {!showReferralInput ? (
            <button
              onClick={() => setShowReferralInput(true)}
              className="text-sm transition-colors hover:underline"
              style={{ color: "var(--text-tertiary)" }}
            >
              I was referred by someone
            </button>
          ) : (
            <div className="p-5 rounded-lg text-left" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
              <label htmlFor="ref-code" className="block text-sm font-medium mb-2 text-foreground">
                Enter your referral code
              </label>
              <div className="flex gap-2">
                <input
                  id="ref-code"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && validateCode()}
                  placeholder="e.g. BETH2026"
                  className="flex-1 px-4 py-3 bg-white/5 border rounded-lg text-foreground placeholder:opacity-30 focus:outline-none focus:border-primary transition-all text-sm"
                  style={{ borderColor: "var(--border)" }}
                />
                <Button
                  onClick={validateCode}
                  disabled={validating || !referralCode.trim()}
                  className="px-5 font-semibold"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {validating ? <Loader2 className="animate-spin" size={18} /> : "Verify"}
                </Button>
              </div>
              {error && (
                <p className="text-xs mt-2" style={{ color: "oklch(0.70 0.18 25)" }}>{error}</p>
              )}
            </div>
          )}
        </div>

        <p className="text-xs mt-8" style={{ color: "var(--text-tertiary)" }}>
          Already completed the audit? Your booking access should be unlocked automatically.
          <br />
          If not, <a href="/assessment" className="text-primary hover:underline">retake the Mini Audit</a> or enter your referral code above.
        </p>
      </div>
    </div>
  );
}
