import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Calendar as CalendarIcon, Clock, Users, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const sessionTypes = [
  {
    id: "strategy",
    title: "Strategy & Working Sessions",
    description: "Deep strategic planning or focused execution work. Perfect for automation strategy, system design, and hands-on implementation.",
    duration: "60 min",
    icon: CalendarIcon,
    href: "/jeremys-calendar-strategy",
    highlights: ["Automation strategy", "System design", "Implementation"],
  },
  {
    id: "coaching",
    title: "1:1 Coaching Call",
    description: "Exclusive session for active coaching clients and their team members who need additional time outside regularly scheduled sessions.",
    duration: "60 min",
    icon: Users,
    href: "/jeremys-calendar-coaching",
    highlights: ["Clients only", "Team training", "Progress reviews"],
    badge: "Clients Only",
  },
  {
    id: "intro",
    title: "Quick Connect",
    description: "Brief check-in for idea exchange, introductions, or exploring whether coaching is right for you.",
    duration: "15-20 min",
    icon: Zap,
    href: "/jeremys-calendar-intro",
    highlights: ["Quick questions", "Introductions", "Explore fit"],
  },
];

export default function Calendar() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-[var(--background)]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <img 
              src="/jeremy-about-photo.webp" 
              alt="Jeremy Kean" 
              className="w-28 h-28 md:w-36 md:h-36 rounded-full mx-auto mb-6 object-cover border-4 border-[var(--amber)]/30 shadow-lg"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Book with <span className="text-[var(--amber)]">Jeremy</span>
            </h1>
            <p className="text-xl text-slate-300">
              Choose the session type that fits your needs
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sessionTypes.map((session) => {
              const Icon = session.icon;
              return (
                <Link key={session.id} href={session.href}>
                  <div className="group relative h-full bg-[var(--surface-elevated)] hover:bg-[var(--secondary)] border border-[var(--surface-elevated)] hover:border-[var(--amber)]/50 rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col">
                    {session.badge && (
                      <span className="absolute top-4 right-4 bg-[var(--amber)] text-[var(--background)] text-xs font-bold px-3 py-1 rounded-full">
                        {session.badge}
                      </span>
                    )}
                    
                    <div className="w-14 h-14 rounded-full bg-[var(--background)] flex items-center justify-center mb-4">
                      <Icon className="text-[var(--amber)]" size={28} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--amber)] transition-colors">
                      {session.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <Clock size={16} />
                      <span className="text-sm">{session.duration}</span>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed flex-grow">
                      {session.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {session.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="text-xs bg-[var(--background)] text-slate-300 px-2 py-1 rounded"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-[var(--amber)] font-medium group-hover:gap-3 gap-2 transition-all mt-auto">
                      <span>Book Now</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[var(--secondary)]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Not Sure Which Session?
            </h2>
            <p className="text-slate-300 mb-6">
              Start with a Quick Connect call and we'll figure out the best path forward together.
            </p>
            <Link href="/jeremys-calendar-intro">
              <Button 
                size="lg" 
                className="bg-[var(--amber)] hover:bg-[var(--amber)]/90 text-[var(--background)] font-semibold"
              >
                Schedule Quick Connect
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[var(--background)] border-t border-[var(--surface-elevated)]">
        <div className="container">
          <div className="text-center">
            <Link href="/">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-[var(--surface-elevated)]">
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
