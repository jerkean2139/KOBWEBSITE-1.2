import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Brain, Target, Users, Clock, Calendar, Star, Quote, Download, FileText } from "lucide-react";
import { Link } from "wouter";
import { generateFoundersFilterPDF } from "@/components/FoundersFilterPDFGenerator";

export default function FoundersFilterLanding() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-amber-500/10"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold mb-6">
                Free 59-Minute Session
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                The Founder's Filter
              </h1>
              <p className="text-xl md:text-2xl text-amber-400 font-semibold mb-4">
                Stop drowning in tasks that aren't yours to carry.
              </p>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                In 59 minutes, you'll finally get the mental load out of your head and into a system. 
                You'll walk away knowing exactly what to delegate <strong className="text-white">today</strong>, 
                what to hand off this quarter, and what truly requires <em>you</em>.
              </p>
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                    59 MINUTES
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-500/30 flex-shrink-0">
                      <img 
                        src="/jeremy-main-hero.webp" 
                        alt="Jeremy Kean"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">The Founder's Filter</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Users className="w-4 h-4" /> AI Assistant
                        </span>
                      </div>
                      <div className="flex gap-4 text-slate-400 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> Live Session
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> 59 min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                  Guided by Donna AI
                </div>
              </div>
              <div className="flex items-center gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  59 minutes
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  100% Free
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  AI-Guided
                </span>
              </div>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/zgCM4tgBuMifZyMfWfmH"
                style={{ width: "100%", height: "489px", border: "none", borderRadius: "3px" }}
                id="inline-zgCM4tgBuMifZyMfWfmH"
                data-layout='{"id":"INLINE"}'
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="The Founder's Filter"
                data-height="489"
                data-layout-iframe-id="inline-zgCM4tgBuMifZyMfWfmH"
                data-form-id="zgCM4tgBuMifZyMfWfmH"
                title="The Founder's Filter"
              />
              <div className="mt-4 pt-4 border-t border-slate-700 text-center">
                <p className="text-slate-400 text-sm mb-3">Already signed up?</p>
                <Link href="/founders-filter/start">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-bold"
                  >
                    Start The Founder's Filter Now →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Here's the Brutal Truth About Your To-Do List
          </h2>
          <p className="text-xl text-slate-300 text-center mb-12 max-w-3xl mx-auto">
            You're carrying tasks that aren't yours. Things that should've been delegated months ago. 
            And every day you keep doing them, you're stealing time from the work only <em>you</em> can do.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-red-500/30 p-6">
              <div className="text-4xl font-bold text-red-400 mb-2">73%</div>
              <p className="text-slate-400">of founders spend their day on tasks someone else could handle</p>
            </Card>
            <Card className="bg-slate-900/50 border-amber-500/30 p-6">
              <div className="text-4xl font-bold text-amber-400 mb-2">2+ years</div>
              <p className="text-slate-400">is how long most owners wait before finally delegating</p>
            </Card>
            <Card className="bg-slate-900/50 border-green-500/30 p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">59 min</div>
              <p className="text-slate-400">is all it takes to finally sort the chaos in your head</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            What Happens in 59 Minutes
          </h2>
          <p className="text-slate-400 text-center mb-12">
            This isn't a passive webinar. It's an interactive session with your AI guide, Donna.
          </p>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-500">Minutes 1-20</span>
                  <h3 className="text-xl font-semibold text-white">Brain Dump</h3>
                </div>
                <p className="text-slate-400">
                  Get everything out of your head. Every task, every worry, every "I should probably..." 
                  that's been weighing you down. Donna guides you through prompts designed to uncover 
                  the hidden tasks you've been unconsciously carrying.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-500">Minutes 20-45</span>
                  <h3 className="text-xl font-semibold text-white">Sort & Prioritize</h3>
                </div>
                <p className="text-slate-400">
                  Drag each task into one of three columns: "Only I Can Do," "Delegate Soon," 
                  or "Delegate NOW." Donna helps you challenge your assumptions—because that thing 
                  you think only you can do? Probably isn't.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-500">Minutes 45-59</span>
                  <h3 className="text-xl font-semibold text-white">Action Plan</h3>
                </div>
                <p className="text-slate-400">
                  Leave with a concrete plan: your top 3 priority delegations, flagged for urgency 
                  and operational changes needed. Your session is saved so you can revisit quarterly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 py-20 border-y border-slate-700">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Why It's Called "The Founder's Filter"
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-3xl mx-auto">
            It's not just a one-time brain dump. It's a filter that separates what's truly yours from what should flow to someone else.
          </p>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold">1</div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">You Start at the Top</h4>
                  <p className="text-slate-400">As the CEO or company leader, you do this exercise first. Identify what only you can do, and push everything else down.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/80 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold">2</div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Your Leaders Do the Same</h4>
                  <p className="text-slate-400">Your C-suite takes what you delegated, keeps what truly requires their expertise, and pushes the rest to their teams. Director to manager. Manager to team lead.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/60 flex items-center justify-center flex-shrink-0 text-slate-900 font-bold">3</div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">The Signal to Hire</h4>
                  <p className="text-slate-400">When the lowest level shows signs of overwhelm—not from laziness, but genuine capacity limits—that's your signal: <strong className="text-amber-400">you're past due on hiring.</strong></p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <p className="text-blue-300 text-sm">
                <strong className="text-blue-200">Important:</strong> This only works when each level has the skill and competency to receive what's being passed down. If they don't, you either <em>train them</em> (coaching, mentorship, systems) or <em>hire for that specialty</em>. You can't fully delegate what someone isn't equipped to handle.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 to-green-500/10 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">What Founders Are Saying</h2>
          </div>
          <Card className="bg-slate-900/80 border-amber-500/30 p-8 md:p-12 relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-amber-500/20" />
            <div className="relative z-10">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-6 italic">
                "Last Friday, I took my daughter to lunch. That might not sound like much, but I'd been 
                telling myself I'd do that for <strong className="text-amber-400">two years</strong>. 
                Two years of 'next week' and 'when things slow down.' The Founder's Filter finally 
                made me see what I was really holding onto—and what I could let go of. That lunch? 
                Best hour I've spent in months."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                  R
                </div>
                <div>
                  <p className="text-white font-semibold">Ryan T.</p>
                  <p className="text-slate-400 text-sm">Agency Owner, 12 employees</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What You'll Walk Away With
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "A clear list of tasks that truly require YOUR expertise",
              "Immediate action items for tasks you need to hand off NOW",
              "A plan for tasks to delegate over the next 30-60 days",
              "Mental relief from finally getting it all organized",
              "Saved progress you can revisit quarterly",
              "Printable PDF workbook with all worksheets",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600/20 to-amber-500/20 py-16 border-y border-slate-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 mb-6">
            <FileText className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Your Free Workbook
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Download the complete Founder's Filter workbook. Includes the brain dump worksheet, 
            sorting templates, action plan pages, and the 30-day delegation commitment.
          </p>
          <Button 
            onClick={() => generateFoundersFilterPDF()}
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg px-8 py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF Workbook
          </Button>
          <p className="text-slate-500 text-sm mt-4">
            6-page printable PDF • No email required
          </p>
        </div>
      </div>

      <div className="bg-slate-800/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Why 59 minutes?</h3>
              <p className="text-slate-400">
                Because real transformation takes more than a quick exercise. This workshop gives you 
                the time to actually think, sort, and make decisions—not just skim the surface.
              </p>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Who is Donna?</h3>
              <p className="text-slate-400">
                Donna is your AI guide throughout the workshop. She asks the right questions, 
                challenges your assumptions, and keeps you on track. Think of her as a patient 
                coach who won't let you off easy.
              </p>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Is my data saved?</h3>
              <p className="text-slate-400">
                Yes. Your session is saved to your account so you can pause and come back, 
                or revisit your results quarterly. We recommend doing this workshop 4x per year.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20" id="signup">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Stop Carrying Tasks That Aren't Yours?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            59 minutes from now, you'll have clarity you haven't had in years.
          </p>
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/zgCM4tgBuMifZyMfWfmH"
              style={{ width: "100%", height: "489px", border: "none", borderRadius: "3px" }}
              id="inline-zgCM4tgBuMifZyMfWfmH-bottom"
              data-layout='{"id":"INLINE"}'
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="The Founder's Filter"
              data-height="489"
              data-layout-iframe-id="inline-zgCM4tgBuMifZyMfWfmH-bottom"
              data-form-id="zgCM4tgBuMifZyMfWfmH"
              title="The Founder's Filter"
            />
          </div>
          <p className="text-slate-500 text-sm mt-6">
            Free forever. Takes 59 minutes. Your session is saved.
          </p>
        </div>
      </div>

      <div className="py-12 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-2">Created by</p>
          <p className="text-white font-semibold">Jeremy Kean</p>
          <p className="text-slate-400 text-sm">35+ years helping business owners build systems that work without them</p>
        </div>
      </div>

      <footer className="py-8 border-t border-slate-700">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} KeanOnBiz. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
