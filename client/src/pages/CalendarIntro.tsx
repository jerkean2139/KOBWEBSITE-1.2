import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Zap, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function CalendarIntro() {
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
              <span>15-20 minute session</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Quick <span className="text-[#FFD700]">Connect</span>
            </h1>
            <p className="text-xl text-slate-300">
              A brief check-in for idea exchange, introductions, or quick questions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#4c1d95]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Ideal For</h2>
                <ul className="space-y-3">
                  {[
                    "Quick questions about automation or systems",
                    "Exploring whether coaching is right for you",
                    "Getting pointed in the right direction",
                    "Making introductions or partnerships",
                    "Brief consultations on specific challenges",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-200">
                      <CheckCircle className="text-[#FFD700] mt-0.5 flex-shrink-0" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0f172a] rounded-xl p-6 border border-[#1e3a5f]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
                    <Zap className="text-[#FFD700]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Quick Connect</h3>
                    <p className="text-sm text-slate-400">15-20 minutes with Jeremy</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">
                  Perfect for rapid-fire questions, brief consultations, or exploring potential collaboration opportunities.
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
                src="https://api.leadconnectorhq.com/widget/booking/exCGzR6pDrz2wfc2aoNt" 
                style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "700px" }}
                scrolling="no" 
                id="exCGzR6pDrz2wfc2aoNt_1765457412053"
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
