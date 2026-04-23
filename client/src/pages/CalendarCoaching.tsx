import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Users, Clock, ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function CalendarCoaching() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />
      
      <section className="pt-32 pb-12 bg-[var(--background)]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[var(--amber)] text-[var(--background)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck size={16} />
              <span>Clients Only</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              1:1 <span className="text-[var(--amber)]">Coaching Call</span>
            </h1>
            <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
              Exclusive sessions for active coaching clients and their teams.
            </p>
            <div className="inline-flex items-center gap-2 mt-4" style={{ color: "var(--text-tertiary)" }}>
              <Clock size={18} />
              <span>60 minute session</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[var(--secondary)]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">What to Expect</h2>
                <ul className="space-y-3">
                  {[
                    "Deep dive into specific business challenges",
                    "Strategic guidance on implementation",
                    "Accountability check-ins and progress reviews",
                    "Team member training and walkthroughs",
                    "Addressing urgent challenges as they arise",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle className="text-[var(--amber)] mt-0.5 flex-shrink-0" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[var(--background)] rounded-xl p-6 border border-[var(--surface-elevated)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center">
                    <Users className="text-[var(--amber)]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">For Active Clients</h3>
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>60 minutes with Jeremy</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  This session is for active coaching clients and their team members who need additional time outside regularly scheduled sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Time</h2>
              <p style={{ color: "var(--text-tertiary)" }}>Choose a date and time that works for you</p>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <iframe 
                src="https://api.leadconnectorhq.com/widget/booking/HDMThBdATyMVW7HFteZe" 
                style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
                scrolling="no" 
                id="HDMThBdATyMVW7HFteZe_1765457377264"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[var(--background)] border-t border-[var(--surface-elevated)]">
        <div className="container">
          <div className="flex justify-center gap-4">
            <Link href="/jeremys-calendar">
              <Button variant="ghost" className="hover:text-white hover:bg-[var(--surface-elevated)]" style={{ color: "var(--text-tertiary)" }}>
                <ArrowLeft className="mr-2" size={16} />
                All Booking Options
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="hover:text-white hover:bg-[var(--surface-elevated)]" style={{ color: "var(--text-tertiary)" }}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
