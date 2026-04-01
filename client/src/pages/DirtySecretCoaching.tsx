import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function DirtySecretCoaching() {
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
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen" role="main">
        <section
          aria-labelledby="dirty-secret-heading"
          className="relative min-h-screen pt-24 pb-20"
          style={{ backgroundColor: "#0a0a12" }}
        >
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FFD700]/10 rounded-full blur-3xl" aria-hidden="true"></div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto">
              <p className="text-red-400 text-sm font-bold uppercase tracking-wider mb-6">The Truth They Won't Tell You</p>

              <h1 id="dirty-secret-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-10 leading-tight">
                The Dirty Secret of <span className="text-primary">Business Coaching</span>
              </h1>

              <div className="prose prose-lg prose-invert max-w-none space-y-6 text-white/90 text-lg leading-relaxed">
                <p className="text-xl md:text-2xl text-white font-medium">
                  Let's be honest about what happens after you hang up the phone.
                </p>

                <p>
                  You just finished a session. You were on fire. You gave the client the perfect strategy, the exact script, and the clear roadmap to scale. They were nodding. They were taking notes. They were "committed."
                </p>

                <p>
                  Then, they clicked <span className="text-primary font-bold">"Leave Meeting."</span>
                </p>

                <p>
                  And in that exact second, <span className="text-[#FFD700] font-bold">The Riptide</span> grabbed them.
                </p>

                <p>
                  An employee called out sick. A customer demanded a refund. The server crashed. The inbox pinged 50 times.
                </p>

                <p className="text-white font-semibold text-xl">
                  They didn't <em>choose</em> to ignore your advice. They were dragged back out into the Ocean of Overwhelm before they could even write down their next step.
                </p>

                <div className="border-l-4 border-[#FFD700] pl-6 py-4 my-10">
                  <p className="text-2xl md:text-3xl font-bold text-white m-0">
                    You Are Selling Maps to People Who Are Drowning
                  </p>
                </div>

                <p>
                  Most business coaches are selling "clarity" to people who are fighting for survival. You tell them to "build a referral network." They agree.
                </p>

                <p className="text-xl font-bold text-white">
                  But when Monday morning hits, operations eat strategy for breakfast.
                </p>

                <p>
                  Because they don't have a system to catch them, they default to their old habits. They don't send the email. They don't track the lead. They don't document the process.
                </p>

                <p>
                  Three weeks later, you get on the call, and they have done <span className="font-bold text-white">zero</span>. They feel guilty. You feel frustrated.
                </p>

                <p className="text-red-400 text-xl font-bold">
                  And eventually? They fire you.
                </p>

                <p>
                  Not because your advice was bad. But because <span className="text-white font-semibold">they couldn't execute it</span>.
                </p>

                <div className="border-l-4 border-primary pl-6 py-4 my-10">
                  <p className="text-2xl md:text-3xl font-bold text-white m-0">
                    Stop Fighting the Riptide. Build the Boat.
                  </p>
                </div>

                <p className="text-xl font-semibold text-white">
                  You cannot "coach" someone out of chaos. You have to build the machine that pulls them out.
                </p>

                <p>
                  <span className="text-primary font-bold">Manumation</span> is not just another framework. It is the operational anchor. When you become a Certified Manumation Partner, you stop relying on your client's willpower. You start installing systems that work even when your client is overwhelmed.
                </p>

                <p>
                  Don't hope they follow up—<span className="font-bold text-white">install the automation that does it</span>.
                </p>

                <p>
                  Don't pray they track KPIs—<span className="font-bold text-white">install the dashboard that forces it</span>.
                </p>

                <p>
                  Don't wait for them to change—<span className="font-bold text-white">change their environment</span>.
                </p>

                {/* Dramatic closing statement */}
                <div className="relative py-16 my-12">
                  <div 
                    className="absolute inset-0 border-y-2 border-[#FFD700]/30"
                    style={{ 
                      boxShadow: "0 -4px 30px rgba(255, 215, 0, 0.15), 0 4px 30px rgba(59, 130, 246, 0.15)"
                    }}
                  />
                  <div className="relative text-center">
                    <p 
                      className="text-2xl md:text-4xl font-bold text-white mb-6"
                      style={{ textShadow: "0 0 40px rgba(255, 255, 255, 0.1)" }}
                    >
                      Your clients don't need more advice on how to swim.
                    </p>
                    <p 
                      className="text-3xl md:text-5xl text-[#FFD700] font-black"
                      style={{ textShadow: "0 0 60px rgba(255, 215, 0, 0.4), 0 4px 0 rgba(59, 130, 246, 0.6)" }}
                    >
                      They need you to build them the raft.
                    </p>
                  </div>
                </div>

                {/* CTA Card with chromatic layered shadows */}
                <div className="relative my-16">
                  {/* Chromatic shadow layers */}
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{ 
                      transform: "translate(12px, 12px)",
                      backgroundColor: "rgba(59, 130, 246, 0.4)"
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{ 
                      transform: "translate(6px, 6px)",
                      backgroundColor: "rgba(255, 215, 0, 0.3)"
                    }}
                  />
                  
                  {/* Main card */}
                  <div 
                    className="relative bg-[#12121f] border-2 border-white/20 rounded-2xl p-10 md:p-14 text-center"
                    style={{ 
                      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 60px rgba(59, 130, 246, 0.1)"
                    }}
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#FFD700] rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#FFD700] rounded-br-2xl" />
                    
                    <div 
                      className="inline-block px-6 py-2 bg-[#FFD700] text-gray-900 text-sm font-black uppercase tracking-widest mb-6"
                      style={{ 
                        boxShadow: "4px 4px 0 rgba(59, 130, 246, 0.8)",
                        transform: "rotate(-2deg)"
                      }}
                    >
                      Coming Soon
                    </div>
                    
                    <h3 
                      className="text-3xl md:text-4xl font-black text-white mb-6"
                      style={{ textShadow: "0 2px 0 rgba(59, 130, 246, 0.5)" }}
                    >
                      Become a Certified Manumation Partner
                    </h3>
                    
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                      Be the first to know when applications open. Join an elite group of coaches who deliver <span className="text-white font-semibold">results</span>, not just advice.
                    </p>
                    
                    <div className="w-full max-w-lg mx-auto">
                      <p className="text-xs text-white/70 text-center mb-4">
                        By submitting, you agree to our{" "}
                        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                        {" "}and{" "}
                        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
                      </p>
                      <iframe
                        src="https://api.leadconnectorhq.com/widget/form/BmNwodj0BwAaw5UlvZO0"
                        style={{ width: "100%", height: "450px", border: "none", borderRadius: "8px" }}
                        id="inline-BmNwodj0BwAaw5UlvZO0"
                        data-layout="{'id':'INLINE'}"
                        data-trigger-type="alwaysShow"
                        data-trigger-value=""
                        data-activation-type="alwaysActivated"
                        data-activation-value=""
                        data-deactivation-type="neverDeactivate"
                        data-deactivation-value=""
                        data-form-name="Manumation Certified Coach Interest"
                        data-height="450"
                        data-layout-iframe-id="inline-BmNwodj0BwAaw5UlvZO0"
                        data-form-id="BmNwodj0BwAaw5UlvZO0"
                        title="Manumation Certified Coach Interest"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer navigation with style */}
                <div className="relative pt-12 pb-8">
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="h-px flex-1 max-w-24 bg-primary/40" style={{ boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }} />
                    <div 
                      className="w-3 h-3 bg-[#FFD700] rotate-45"
                      style={{ boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)" }}
                    />
                    <div className="h-px flex-1 max-w-24 bg-[#FFD700]/40" style={{ boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }} />
                  </div>
                  
                  <div className="text-center">
                    <Link href="/">
                      <Button 
                        variant="outline" 
                        className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300"
                        style={{ boxShadow: "3px 3px 0 rgba(59, 130, 246, 0.3)" }}
                      >
                        <ArrowLeft className="mr-2" size={16} aria-hidden="true" />
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
