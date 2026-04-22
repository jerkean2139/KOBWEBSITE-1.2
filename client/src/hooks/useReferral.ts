import { useState, useEffect } from "react";

const STORAGE_KEY = "kob_referral";

export function useReferral() {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params first
    const params = new URLSearchParams(window.location.search);
    const refFromUrl = params.get("ref");

    if (refFromUrl) {
      sessionStorage.setItem(STORAGE_KEY, refFromUrl);
      setReferralCode(refFromUrl);
      // Clean the URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.pathname + url.search);
      return;
    }

    // Fall back to stored referral
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setReferralCode(stored);
    }
  }, []);

  return {
    referralCode,
    isReferral: !!referralCode,
  };
}
