import DOMPurify from "dompurify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: "About Jeremy & KeanOnBiz",
    items: [
      {
        question: "Who is Jeremy Kean?",
        answer:
          'Jeremy Kean is a business coach and automation strategist with 35+ years of hands-on experience. He has helped over 100 businesses and created 13 brands. He specializes in helping overwhelmed business owners build systems that run without them. Learn more on the <a href="/about" class="text-primary hover:underline">About page</a>.',
      },
      {
        question: "What is KeanOnBiz?",
        answer:
          'KeanOnBiz is the front door to Jeremy Kean\'s coaching and consulting ecosystem. It offers 1:1 coaching, digital marketing services, and an AI-powered tech platform. KeanOnBiz works alongside <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Manumation</a> (the method) and <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Zenoflo</a> (the tech engine).',
      },
      {
        question: "What industries does Jeremy work with?",
        answer:
          'Jeremy works with business owners across multiple industries, with a particular focus on <a href="/insurance-coaching" class="text-primary hover:underline">insurance agencies</a>. He also serves home services, healthcare, professional services, real estate, fitness, and other service-based businesses. His frameworks are designed to work for any business that relies on people, processes, and client relationships. Take the <a href="/assessment" class="text-primary hover:underline">Bottleneck Audit</a> to see how his approach applies to your industry.',
      },
    ],
  },
  {
    title: "Coaching Services",
    items: [
      {
        question: "What does business coaching with Jeremy look like?",
        answer:
          'Coaching with Jeremy is hands-on and practical — not theory-heavy. Sessions focus on building real systems for your business: SOPs, delegation frameworks, automation workflows, and accountability structures. You choose your engagement level: Do It Yourself (book + templates), Done With You (coaching + guidance), or Done For You (full implementation). See all options on the <a href="/#services" class="text-primary hover:underline">Services section</a>.',
      },
      {
        question: "How much does coaching cost?",
        answer:
          'Coaching packages vary based on your engagement level and business needs. The best way to find out what fits is to <a href="/jeremys-calendar-intro" class="text-primary hover:underline">book a free Discovery Call</a>. There is no obligation — Jeremy will help you figure out whether coaching is the right fit before you commit to anything.',
      },
      {
        question: "How do I get started?",
        answer:
          'The fastest way to get started is to <a href="/assessment" class="text-primary hover:underline">take the free Bottleneck Audit</a>. It takes about 5 minutes and gives you a personalized score showing where your biggest growth opportunities are. From there, you can <a href="/jeremys-calendar-intro" class="text-primary hover:underline">book a Discovery Call</a> to discuss your results with Jeremy.',
      },
      {
        question: "Do you offer group coaching or workshops?",
        answer:
          'Currently, Jeremy focuses on 1:1 coaching for maximum impact. Group workshops and a coaching community are planned for 2026. Sign up for the <a href="/newsletter" class="text-primary hover:underline">newsletter</a> to be the first to know when group programs launch.',
      },
    ],
  },
  {
    title: "The Manumation Method",
    items: [
      {
        question: "What is the Manumation Method?",
        answer:
          'The Manumation Method is a strategic framework that blends human ingenuity with AI agents and automated systems to transform business operations. The core principle: systematize first, automate second. It helps business owners stop duct-taping tools and start operating with clarity, speed, and soul. <a href="/book" class="text-primary hover:underline">Learn more about the book</a>.',
      },
      {
        question: "Is the Manumation Method book available?",
        answer:
          'Yes! The Manumation Method is available now. It covers the complete framework, real-world case studies, implementation templates, and step-by-step guides. <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Get your copy here</a>.',
      },
      {
        question: "How is the Manumation Method different from other business frameworks?",
        answer:
          'Most business frameworks focus on either strategy or tools. The Manumation Method bridges both — it gives you the thinking framework AND the implementation playbook. It was built by someone who has actually run businesses (13 brands over 35 years), not by a consultant who only advises. It is designed for business owners who are hands-on and need systems that work in the real world. <a href="/about" class="text-primary hover:underline">Read Jeremy\'s full story</a>.',
      },
    ],
  },
  {
    title: "AI & Automation",
    items: [
      {
        question: "How does AI automation help my business?",
        answer:
          'AI automation handles the repetitive, time-consuming tasks that drain your energy: follow-up sequences, appointment scheduling, data entry, customer communication, and reporting. The goal is not to replace your team — it is to free them up for high-value work that requires human judgment and relationships. Most clients save 15+ hours per week. Visit the <a href="/business-automation" class="text-primary hover:underline">Business Automation</a> page to learn more.',
      },
      {
        question: "Do I need to be tech-savvy to use AI tools?",
        answer:
          'No. Jeremy\'s approach is designed for business owners, not engineers. The systems are built to be simple and practical. You do not need to write code or understand AI models — you just need to be willing to follow a process. Jeremy and his team handle the technical setup. Learn more about the approach on the <a href="/business-automation" class="text-primary hover:underline">Business Automation</a> page.',
      },
      {
        question: "What tools and platforms do you use?",
        answer:
          'The KeanOnBiz tech ecosystem includes GoHighLevel (CRM and marketing automation), custom AI agents, voice automation, and workflow tools. The specific stack depends on your business needs. The Zenoflo platform powers many of these solutions. You can see the full tech ecosystem on the <a href="/#tech-ecosystem" class="text-primary hover:underline">homepage</a>.',
      },
      {
        question: "Will automation make my business feel impersonal?",
        answer:
          'This is the most common concern — and the answer is no. The Manumation Method is specifically designed to preserve the human touch. Automation handles the back-office tasks so you can spend more time with clients, not less. As one client put it: "This method allowed me to clone my values and voice, giving me more time with clients." <a href="/book" class="text-primary hover:underline">Read the book</a> to see how it works in practice.',
      },
    ],
  },
  {
    title: "Insurance Agency Coaching",
    items: [
      {
        question: "Do you specialize in insurance agencies?",
        answer:
          'Yes. Insurance agencies are a primary focus. Jeremy has deep experience helping insurance agency owners fix their pipeline, automate renewals, build teams that run without them, and break through revenue ceilings. <a href="/insurance-coaching" class="text-primary hover:underline">Learn about Insurance Agency Coaching</a>.',
      },
      {
        question: "What is the Revenue Leak Calculator?",
        answer:
          'The Revenue Leak Calculator is a free 30-question assessment for insurance agency owners. It identifies how much revenue your agency is losing each month from gaps in coaching, sales process, team performance, and operations. You get a detailed breakdown by category with specific recommendations. <a href="/insurance" class="text-primary hover:underline">Take the free assessment</a>.',
      },
      {
        question: "Can you help me automate my agency without losing the personal touch?",
        answer:
          'Absolutely. That is the core of what we do. Insurance is a relationship business, and automation should enhance those relationships — not replace them. We help you automate renewals, follow-ups, onboarding, and reporting while keeping client-facing interactions personal and human. Try the <a href="/insurance" class="text-primary hover:underline">Revenue Leak Calculator</a> to see where your agency has the most opportunity.',
      },
    ],
  },
  {
    title: "Getting Started",
    items: [
      {
        question: "What is the Bottleneck Audit?",
        answer:
          'The Bottleneck Audit is a free 5-minute assessment that identifies your biggest business bottlenecks and automation opportunities. You get a personalized score (0-100) with specific recommendations for where coaching and systems can make the biggest impact. <a href="/assessment" class="text-primary hover:underline">Take the Bottleneck Audit now</a>.',
      },
      {
        question: "What happens after I book a Discovery Call?",
        answer:
          'During the Discovery Call, Jeremy will review your situation, discuss your goals, and help you determine whether coaching is the right fit. There is no pressure and no obligation. If coaching makes sense, he will recommend a specific engagement level and next steps. If it does not, he will tell you honestly. <a href="/jeremys-calendar-intro" class="text-primary hover:underline">Book your Discovery Call here</a>.',
      },
      {
        question: "Can I try before committing to coaching?",
        answer:
          'Yes. Start with the free tools: take the <a href="/assessment" class="text-primary hover:underline">Bottleneck Audit</a>, try <a href="/founders-filter" class="text-primary hover:underline">The Founder\'s Filter</a> (a free delegation tool), read the <a href="/blog" class="text-primary hover:underline">blog</a>, and grab a copy of <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">The Manumation Method</a>. These will give you a strong sense of Jeremy\'s approach before you invest in coaching.',
      },
    ],
  },
];

const allFaqs = FAQ_CATEGORIES.flatMap((cat) => cat.items);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer.replace(/<[^>]*>/g, ""),
    },
  })),
};

export default function FAQ() {
  return (
    <>
      <SEO
        title="Frequently Asked Questions | KeanOnBiz"
        description="Answers to common questions about business coaching, the Manumation Method, AI automation, insurance agency coaching, and getting started with Jeremy Kean."
      />
      <JsonLd data={faqJsonLd} />
      <Navigation />
      <main id="main-content" className="min-h-screen pt-20">
        <section
          className="relative py-16 md:py-24 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--secondary) 0%, var(--surface-sunken) 50%, var(--secondary) 100%)",
          }}
        >
          <div className="container relative z-10">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: "Home", href: "/" },
                { label: "FAQ" },
              ]}
            />
            <AnimatedSection animation="fade-in">
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-6 border border-primary/30">
                  <HelpCircle
                    className="text-primary"
                    size={16}
                    aria-hidden="true"
                  />
                  <p className="text-primary text-sm font-bold uppercase tracking-wider">
                    FAQ
                  </p>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Frequently Asked{" "}
                  <span className="text-primary">Questions</span>
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                  Everything you need to know about business coaching, the
                  Manumation Method, and how Jeremy Kean can help your business
                  grow.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {FAQ_CATEGORIES.map((category, catIdx) => (
                <AnimatedSection
                  key={catIdx}
                  animation="slide-up"
                  delay={catIdx * 50}
                >
                  <div className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                      {category.title}
                    </h2>
                    <Accordion type="multiple" className="w-full">
                      {category.items.map((item, itemIdx) => (
                        <AccordionItem
                          key={itemIdx}
                          value={`cat-${catIdx}-item-${itemIdx}`}
                          className="border-b border-border"
                        >
                          <AccordionTrigger className="text-base font-semibold text-foreground py-5 hover:no-underline hover:text-primary transition-colors">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                            <div
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fade-in">
              <div className="max-w-2xl mx-auto text-center mt-8 p-8 bg-muted/50 rounded-2xl">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Still have questions?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Book a free Discovery Call with Jeremy to discuss your
                  specific situation. No obligation, no pressure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    asChild
                  >
                    <a href="/jeremys-calendar-intro">
                      Book a Discovery Call{" "}
                      <ArrowRight className="ml-2" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-bold"
                    asChild
                  >
                    <a href="/assessment">Take the Bottleneck Audit</a>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
