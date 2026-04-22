import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import HeroSection from "@/components/home/HeroSection";
import StatementSection from "@/components/home/StatementSection";
import AboutSection from "@/components/home/AboutSection";
import ManumationAuditSection from "@/components/home/ManumationAuditSection";
import ResultsSection from "@/components/home/ResultsSection";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ClosingSection from "@/components/home/ClosingSection";

const reviewsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Jason Elkins" },
      "reviewRating": { "@type": "Rating", "ratingValue": 5, "bestRating": 5 },
      "reviewBody": "The Manumation Method gave me permission to simplify, evaluate problems quickly, and implement solutions without the decision-fatigue spiral. Finally, a framework that works for my brain.",
      "itemReviewed": { "@id": "https://keanonbiz.com/#professional-service" },
      "datePublished": "2025-10-15",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Ryan Templeton" },
      "reviewRating": { "@type": "Rating", "ratingValue": 5, "bestRating": 5 },
      "reviewBody": "Jeremy bridges the gap between 'tech' and 'tactical.' This isn't just theory; it is the specific blueprint I needed to stop manually grinding and start strategically scaling.",
      "itemReviewed": { "@id": "https://keanonbiz.com/#professional-service" },
      "datePublished": "2025-11-01",
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Beth Prince" },
      "reviewRating": { "@type": "Rating", "ratingValue": 5, "bestRating": 5 },
      "reviewBody": "I was afraid automation would make my business feel robotic, but Jeremy proved the opposite. This method allowed me to 'clone' my values and voice, giving me more time with clients.",
      "itemReviewed": { "@id": "https://keanonbiz.com/#professional-service" },
      "datePublished": "2025-11-20",
    },
  ],
};

export default function Home() {
  return (
    <>
      <SEO
        title="Jeremy Kean | Business Coach & AI Automation Expert"
        description="Strategic coaching and AI-powered automation for insurance agencies and business owners. 35+ years experience, 100+ businesses helped. Transform your operations with The Manumation Method."
        image="/manumation-book-cover-nobg.webp"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />
      <Navigation />
      <main id="main-content" className="min-h-screen" role="main">
        <HeroSection />
        <StatementSection />
        <AboutSection />
        <ManumationAuditSection />
        <ResultsSection />
        <ServicesSection />
        <TestimonialsSection />
        <CTASection />
        <NewsletterSection />
        <ClosingSection />
      </main>
      <Footer />
    </>
  );
}
