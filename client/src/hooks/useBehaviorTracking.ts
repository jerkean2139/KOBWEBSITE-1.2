import { useEffect, useRef } from "react";

const SESSION_KEY = "kob_session_id";

function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function usePageTracking(pageName: string) {
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    const sessionId = getSessionId();
    
    fetch("/api/track/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        page: window.location.pathname,
        title: pageName,
        referrer: document.referrer,
      }),
    }).catch(() => {});
    
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (duration > 5) {
        fetch("/api/track/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            page: window.location.pathname,
            title: pageName,
            duration,
          }),
        }).catch(() => {});
      }
    };
  }, [pageName]);
}

export function useBlogReadTracking(slug: string, title: string) {
  const startTime = useRef(Date.now());
  const maxScrollPercentage = useRef(0);
  
  useEffect(() => {
    const sessionId = getSessionId();
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / docHeight) * 100);
      maxScrollPercentage.current = Math.max(maxScrollPercentage.current, scrollPercentage);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      
      if (timeSpent > 10 && maxScrollPercentage.current > 20) {
        fetch("/api/track/blog-read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            slug,
            title,
            readPercentage: maxScrollPercentage.current,
            timeSpent,
          }),
        }).catch(() => {});
      }
    };
  }, [slug, title]);
}

export function trackNewsletterSubscribe(email: string, source: string) {
  const sessionId = getSessionId();
  
  return fetch("/api/track/newsletter-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, sessionId }),
  }).catch(() => {});
}

export function trackWorkshopComplete(data: {
  email?: string;
  taskCount: number;
  delegateNowCount: number;
  delegateSoonCount: number;
}) {
  const sessionId = getSessionId();
  
  return fetch("/api/track/workshop-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, sessionId }),
  }).catch(() => {});
}
