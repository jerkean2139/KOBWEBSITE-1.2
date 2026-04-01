import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { 
  Mic, 
  Play, 
  Pause,
  Clock, 
  Headphones, 
  ArrowRight, 
  Rss,
  Calendar,
  ChevronLeft,
  Volume2,
  ExternalLink
} from "lucide-react";

interface PodcastEpisode {
  id: number;
  episodeNumber: number;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  audioUrl: string | null;
  audioDuration: number;
  thumbnailUrl: string | null;
  topics: string[];
  guestName: string | null;
  guestTitle: string | null;
  publishedAt: string;
}

export default function Podcast() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/micropod/published")
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const podcastSeriesSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "PodcastSeries",
      "name": "The MicroPod – Business Bites",
      "description": "Quick, actionable business insights in under 10 minutes. No fluff, no theory – just what works from 35 years of building and automating businesses.",
      "url": "https://keanonbiz.com/micropod",
      "webFeed": "https://keanonbiz.com/podcast.xml",
      "author": {
        "@type": "Person",
        "name": "Jeremy Kean",
        "url": "https://keanonbiz.com",
        "jobTitle": "Founder & Business Automation Strategist"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Kean on Biz",
        "url": "https://keanonbiz.com"
      }
    };

    if (episodes.length > 0) {
      podcastSeriesSchema["episode"] = episodes.map((ep) => {
        const episodeSchema: Record<string, unknown> = {
          "@type": "PodcastEpisode",
          "name": ep.title,
          "description": ep.shortDescription || ep.description,
          "episodeNumber": ep.episodeNumber,
          "url": `https://keanonbiz.com/micropod/${ep.slug}`,
          "datePublished": ep.publishedAt
        };
        if (ep.audioDuration > 0) {
          const mins = Math.floor(ep.audioDuration / 60);
          const secs = ep.audioDuration % 60;
          episodeSchema["timeRequired"] = `PT${mins}M${secs}S`;
        }
        if (ep.audioUrl) {
          episodeSchema["associatedMedia"] = {
            "@type": "MediaObject",
            "contentUrl": ep.audioUrl.startsWith("http") ? ep.audioUrl : `https://keanonbiz.com${ep.audioUrl}`
          };
        }
        if (ep.guestName) {
          episodeSchema["actor"] = {
            "@type": "Person",
            "name": ep.guestName,
            ...(ep.guestTitle ? { "jobTitle": ep.guestTitle } : {})
          };
        }
        return episodeSchema;
      });
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "podcast-structured-data";
    script.textContent = JSON.stringify(podcastSeriesSchema);

    const existing = document.getElementById("podcast-structured-data");
    if (existing) {
      existing.remove();
    }
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("podcast-structured-data");
      if (el) el.remove();
    };
  }, [episodes]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const togglePlay = (episode: PodcastEpisode) => {
    if (!episode.audioUrl) return;

    if (playingId === episode.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(episode.audioUrl);
      audio.play();
      audio.onended = () => setPlayingId(null);
      audioRef.current = audio;
      setPlayingId(episode.id);
    }
  };

  const hasEpisodes = episodes.length > 0;

  return (
    <>
      <Navigation />
      
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 z-50 rounded-md">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen bg-[#0f172a]" role="main">
        <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #172554 100%)" }}>
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b]/30 via-transparent to-[#4c1d95]/20"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#4c1d95]/40 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#FFD700]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          <div className="container relative z-10">
            <AnimatedSection animation="fade-in">
              <div className="max-w-4xl mx-auto">
                <Link href="/">
                  <span className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 cursor-pointer">
                    <ChevronLeft size={16} aria-hidden="true" />
                    Back to Home
                  </span>
                </Link>
                
                <Breadcrumbs
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Podcast" },
                  ]}
                  variant="dark"
                  className="mb-6"
                />
                
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700]/20 rounded-full mb-6">
                      <Mic className="text-[#FFD700]" size={16} aria-hidden="true" />
                      <span className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">Podcast</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      The MicroPod<br />
                      <span className="text-primary">Business Bites</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                      Quick, actionable business insights in under 10 minutes. No fluff, no theory – just what works from 35 years of building and automating businesses.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <Clock className="text-primary" size={16} aria-hidden="true" />
                      <span className="text-white/80 text-sm">&lt; 10 min</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <Headphones className="text-primary" size={16} aria-hidden="true" />
                      <span className="text-white/80 text-sm">Audio First</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <Calendar className="text-primary" size={16} aria-hidden="true" />
                      <span className="text-white/80 text-sm">Weekly</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {loading ? (
          <section className="py-20" style={{ background: "linear-gradient(180deg, #172554 0%, #0f172a 100%)" }}>
            <div className="container">
              <div className="max-w-4xl mx-auto text-center">
                <div className="w-12 h-12 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70">Loading episodes...</p>
              </div>
            </div>
          </section>
        ) : hasEpisodes ? (
          <section className="py-16" style={{ background: "linear-gradient(180deg, #172554 0%, #0f172a 100%)" }}>
            <div className="container">
              <AnimatedSection animation="fade-in">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-white">Latest Episodes</h2>
                    <Button variant="outline" size="sm" className="text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/10" asChild>
                      <a href="/podcast.xml" target="_blank" rel="noopener noreferrer">
                        <Rss size={16} className="mr-2" />
                        RSS Feed
                      </a>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {episodes.map((episode, index) => (
                      <AnimatedSection key={episode.id} animation="slide-up" delay={index * 0.1}>
                        <Card className="border-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-5">
                              <button
                                onClick={() => togglePlay(episode)}
                                disabled={!episode.audioUrl}
                                className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {playingId === episode.id ? (
                                  <Pause className="text-white" size={22} />
                                ) : (
                                  <Play className="text-white ml-1" size={22} />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge variant="outline" className="text-xs text-white/70 border-white/20">
                                    Episode {episode.episodeNumber}
                                  </Badge>
                                  {episode.audioDuration > 0 && (
                                    <span className="text-sm text-white/70 flex items-center gap-1">
                                      <Clock size={12} aria-hidden="true" />
                                      {formatDuration(episode.audioDuration)}
                                    </span>
                                  )}
                                  {episode.publishedAt && (
                                    <span className="text-sm text-white/70 flex items-center gap-1">
                                      <Calendar size={12} aria-hidden="true" />
                                      {formatDate(episode.publishedAt)}
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-2 text-lg">
                                  {episode.title}
                                </h3>
                                <p className="text-white/70 text-sm line-clamp-2">
                                  {episode.shortDescription || episode.description}
                                </p>
                                {episode.topics && episode.topics.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {episode.topics.slice(0, 3).map((topic) => (
                                      <Badge key={topic} className="text-xs bg-white/10 text-white/70 border-0">
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {playingId === episode.id && episode.audioUrl && (
                              <div className="mt-4 pt-4 border-t border-white/10">
                                <audio
                                  controls
                                  src={episode.audioUrl}
                                  className="w-full h-10"
                                  autoPlay
                                  onEnded={() => setPlayingId(null)}
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        ) : (
          <section className="py-20" style={{ background: "linear-gradient(180deg, #172554 0%, #1e1b4b 50%, #0f172a 100%)" }}>
            <div className="container">
              <AnimatedSection animation="fade-in">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#4c1d95] to-primary rounded-full flex items-center justify-center shadow-2xl border-2 border-[#FFD700]/30">
                      <Mic className="text-[#FFD700]" size={48} />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#4c1d95]/40 rounded-full blur-3xl -z-10"></div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Episodes Coming Soon
                  </h2>
                  <p className="text-lg text-white/70 mb-8 leading-relaxed">
                    We're cooking up short-form audio that cuts through the noise and delivers one actionable insight per episode. 
                    Check back soon or subscribe to the RSS feed to get notified.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0f172a] font-bold" asChild>
                      <a href="/#contact">
                        Get Notified <ArrowRight className="ml-2" size={18} />
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
                      <Link href="/blog">
                        Read the Blog Instead
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-16">
                    <Card className="border-0 bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-left">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/30">
                        <Volume2 className="text-primary" size={24} aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-white mb-2">Bite-Sized Wisdom</h3>
                      <p className="text-white/70 text-sm">
                        Each episode tackles one specific challenge. No rambling, no filler – just the insight you need.
                      </p>
                    </Card>
                    
                    <Card className="border-0 bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-left">
                      <div className="w-12 h-12 bg-[#FFD700]/20 rounded-xl flex items-center justify-center mb-4 border border-[#FFD700]/30">
                        <Play className="text-[#FFD700]" size={24} aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-white mb-2">Real Stories</h3>
                      <p className="text-white/70 text-sm">
                        Lessons from 35 years of building businesses – the wins, the failures, and the "never do that again" moments.
                      </p>
                    </Card>
                    
                    <Card className="border-0 bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-left">
                      <div className="w-12 h-12 bg-[#4c1d95]/30 rounded-xl flex items-center justify-center mb-4 border border-[#4c1d95]/50">
                        <Rss className="text-[#a78bfa]" size={24} aria-hidden="true" />
                      </div>
                      <h3 className="font-bold text-white mb-2">Your Commute Companion</h3>
                      <p className="text-white/70 text-sm">
                        Perfect for your morning coffee, gym session, or drive to work. Business growth in your pocket.
                      </p>
                    </Card>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        )}

        <section className="py-16" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" }}>
          <div className="container">
            <AnimatedSection animation="fade-in">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Listen & Subscribe
                </h2>
                <p className="text-white/70 mb-8">
                  Subscribe on your favorite platform to never miss an episode.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
                    <a href="/podcast.xml" target="_blank" rel="noopener noreferrer">
                      <Rss size={18} className="mr-2 text-[#FFD700]" />
                      RSS Feed
                      <ExternalLink size={14} className="ml-2 opacity-50" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
                    <a href="https://podcasts.apple.com" target="_blank" rel="noopener noreferrer">
                      <Headphones size={18} className="mr-2 text-[#a78bfa]" />
                      Apple Podcasts
                      <ExternalLink size={14} className="ml-2 opacity-50" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
                    <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
                      <Volume2 size={18} className="mr-2 text-[#1DB954]" />
                      Spotify
                      <ExternalLink size={14} className="ml-2 opacity-50" />
                    </a>
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0f172a] font-bold" asChild>
                    <a href="/jeremys-calendar">
                      Book a Strategy Call <ArrowRight className="ml-2" size={18} />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
                    <a href="https://manumation.ai/coming-soon" target="_blank" rel="noopener noreferrer">
                      Get The Book
                    </a>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <footer className="py-8 text-white border-t border-white/10" style={{ background: "#0f172a" }}>
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} KeanOnBiz. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="https://manumation.ai/coming-soon" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Manumation
                </a>
                <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Zenoflo
                </a>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
