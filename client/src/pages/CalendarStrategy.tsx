import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Calendar as CalendarIcon, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function CalendarStrategy() {
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
    <div className="min-h-screen bg-[#0f172a]">
      <Navigation />
      
      <section className="pt-32 pb-12 bg-[#0f172a]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#1e3a5f] text-slate-300 px-4 py-2 rounded-full text-sm mb-6">
              <Clock size={16} />
              <span>60 minute session</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Strategy & <span className="text-[#FFD700]">Working Sessions</span>
            </h1>
            <p className="text-xl text-slate-300">
              Deep strategic planning and focused execution work with Jeremy.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#1e1b4b]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Session Focus Areas</h2>
                <ul className="space-y-3">
                  {[
                    "Comprehensive business automation strategy",
                    "System design and workflow mapping",
                    "Hands-on implementation and setup",
                    "Marketing strategy and campaign planning",
                    "AI integration and custom solutions",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="text-[#FFD700] mt-0.5 flex-shrink-0" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0f172a] rounded-xl p-6 border border-[#1e3a5f]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                    <CalendarIcon className="text-[#FFD700]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Strategy Session</h3>
                    <p className="text-sm text-slate-400">60 minutes with Jeremy</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">
                  Come prepared with specific goals or challenges. The more context you provide, the more value we can extract from our time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0f172a]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Select Your Time</h2>
              <p className="text-slate-400">Choose a date and time that works for you</p>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <iframe 
                src="https://api.leadconnectorhq.com/widget/booking/uslCIRV9xwkJQlHC1Rl7" 
                style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
                scrolling="no" 
                id="uslCIRV9xwkJQlHC1Rl7_1765457335823"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#0f172a] border-t border-[#1e3a5f]">
        <div className="container">
          <div className="flex justify-center gap-4">
            <Link href="/jeremys-calendar">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-[#1e3a5f]">
                <ArrowLeft className="mr-2" size={16} />
                All Booking Options
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-[#1e3a5f]">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
