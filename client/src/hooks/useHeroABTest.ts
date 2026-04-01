import { useState, useEffect } from "react";

interface HeroVariant {
  id: string;
  headline: string;
  highlightedText: string;
  subheadline: string;
}

const HERO_VARIANTS: HeroVariant[] = [
  {
    id: "variant_b",
    headline: "You Didn't Start a Business",
    highlightedText: "to Become Its Employee.",
    subheadline: "For agency owners and entrepreneurs drowning in daily operations. Take the free 5-minute assessment and discover exactly what's holding you back."
  }
];

const STORAGE_KEY = "hero_ab_variant";

function getOrAssignVariant(): HeroVariant {
  if (typeof window === "undefined") {
    return HERO_VARIANTS[0];
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const found = HERO_VARIANTS.find(v => v.id === stored);
    if (found) return found;
  }

  const randomIndex = Math.floor(Math.random() * HERO_VARIANTS.length);
  const variant = HERO_VARIANTS[randomIndex];
  localStorage.setItem(STORAGE_KEY, variant.id);
  return variant;
}

function trackEvent(eventName: string, variantId: string) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, {
      hero_variant: variantId,
      event_category: "ab_test",
      event_label: variantId
    });
  }
}

export function useHeroABTest() {
  const [variant, setVariant] = useState<HeroVariant>(() => getOrAssignVariant());
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);

  useEffect(() => {
    if (!hasTrackedImpression) {
      trackEvent("hero_impression", variant.id);
      setHasTrackedImpression(true);
    }
  }, [variant.id, hasTrackedImpression]);

  const trackCTAClick = (ctaName: string) => {
    trackEvent("hero_cta_click", variant.id);
    trackEvent(`hero_cta_${ctaName}`, variant.id);
  };

  return {
    variant,
    trackCTAClick
  };
}
