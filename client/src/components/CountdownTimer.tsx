import { useState, useEffect } from "react";
import { Clock, Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // December 31, 2025 at midnight EST
      const launchDate = new Date("2025-12-31T00:00:00-05:00").getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference <= 0) {
        setIsLaunched(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLaunched) {
    return (
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD700]/20 rounded-xl border-2 border-[#FFD700]/40" style={{ paddingBottom: '10px' }}>
        <Sparkles className="text-[#FFD700]" size={20} />
        <span className="text-[#FFD700] font-bold text-sm uppercase tracking-wide">Book Now Available!</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#FFD700]/20 rounded-xl border-2 border-[#FFD700]/40">
      <Clock className="text-[#FFD700]" size={20} />
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-[#FFD700] font-bold text-xl">{timeLeft.days}</div>
          <div className="text-[#FFD700]/80 text-xs uppercase">Days</div>
        </div>
        <div className="text-[#FFD700] text-xl">:</div>
        <div className="text-center">
          <div className="text-[#FFD700] font-bold text-xl">{timeLeft.hours}</div>
          <div className="text-[#FFD700]/80 text-xs uppercase">Hours</div>
        </div>
        <div className="text-[#FFD700] text-xl">:</div>
        <div className="text-center">
          <div className="text-[#FFD700] font-bold text-xl">{timeLeft.minutes}</div>
          <div className="text-[#FFD700]/80 text-xs uppercase">Mins</div>
        </div>
        <div className="text-[#FFD700] text-xl hidden sm:inline">:</div>
        <div className="text-center hidden sm:block">
          <div className="text-[#FFD700] font-bold text-xl">{timeLeft.seconds}</div>
          <div className="text-[#FFD700]/80 text-xs uppercase">Secs</div>
        </div>
      </div>
    </div>
  );
}
