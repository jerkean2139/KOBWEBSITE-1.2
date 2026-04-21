import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts, BlogPost, getAllPillars, pillarInfo } from "@/data/blogPosts";
import { Clock, Calendar, ArrowRight, Lightbulb, Target, Users, Zap, Mail, CheckCircle2, Loader2, Mic, Pin, Flame, Sun, Compass, Trophy, Telescope } from "lucide-react";
import { SEO } from "@/components/SEO";

function BlogNewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await fetch("https://api.leadconnectorhq.com/widget/form/WeCKj6eththzMepQtObZ", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, formId: "WeCKj6eththzMepQtObZ" }).toString(),
      });
    } catch {}
    
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="flex items-center gap-3 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg">
        <CheckCircle2 className="text-green-400" size={20} aria-hidden="true" />
        <span className="text-green-300 font-medium">You're subscribed! Check your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email" 
        required
        disabled={status === "loading"}
        aria-label="Email address for newsletter"
        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
      />
      <Button 
        type="submit" 
        disabled={status === "loading"}
        className="bg-primary hover:bg-primary/90 text-white font-semibold px-6"
      >
        {status === "loading" ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : "Subscribe"}
      </Button>
    </form>
  );
}

export default function Blog() {

  const posts = getAllBlogPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const categoryIcons: Record<string, React.ReactNode> = {
    "AI Automation": <Zap className="w-4 h-4" />,
    "Business Strategy": <Target className="w-4 h-4" />,
    "Business Mindset": <Lightbulb className="w-4 h-4" />,
  };

  return (
    <>
      <SEO 
        title="Blog - Business Insights & AI Automation Tips"
        description="Practical strategies for business owners: AI automation, delegation systems, and building businesses that run without you. 35 years of hard-won lessons."
      />
      <Navigation />
      <main id="main-content" className="min-h-screen bg-white" role="main">
        <section className="relative pt-32 pb-16 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </div>
          
          <div className="container relative z-10">
            <AnimatedSection animation="fade-in">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                  <div>
                    <p className="text-primary font-medium text-sm uppercase tracking-wider mb-4">
                      No Fluff. No Theory. Just What Works.
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      The Playbook<br />
                      <span className="text-primary">They Don't Teach</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed mb-6">
                      35 years of hard-won lessons on AI, automation, and building businesses that run without you in the weeds. Updated daily.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                        <Target className="text-primary" size={16} aria-hidden="true" />
                        <span className="text-white/80 text-sm">Strategy</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                        <Zap className="text-primary" size={16} aria-hidden="true" />
                        <span className="text-white/80 text-sm">Efficiency</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                        <Users className="text-primary" size={16} aria-hidden="true" />
                        <span className="text-white/80 text-sm">Team Growth</span>
                      </div>
                      <Link href="/micropod">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--amber)]/20 rounded-lg border border-[var(--amber)]/30 hover:bg-[var(--amber)]/30 transition-colors cursor-pointer">
                          <Mic className="text-[var(--amber)]" size={16} aria-hidden="true" />
                          <span className="text-[var(--amber)] text-sm font-medium">MicroPod Coming Soon</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden lg:flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-6 bg-primary/20 rounded-3xl blur-3xl"></div>
                      <img
                        src="/manumation-book-cover-nobg.webp"
                        alt="The Manumation Method - Book Cover"
                        className="relative rounded-2xl shadow-2xl max-w-sm transform hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="text-primary" size={20} aria-hidden="true" />
                    <p className="text-white font-medium">Get weekly business insights delivered free</p>
                  </div>
                  <div className="max-w-lg">
                    <BlogNewsletterForm />
                    <p className="text-white/70 text-xs mt-3">No spam. Unsubscribe anytime.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-6 bg-white border-b border-gray-100">
          <div className="container">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-500 mr-2">Browse by Pillar:</span>
              {getAllPillars().map(p => {
                const pInfo = pillarInfo[p];
                const iconMap: Record<string, React.ReactNode> = {
                  flame: <Flame size={14} />,
                  sun: <Sun size={14} />,
                  compass: <Compass size={14} />,
                  trophy: <Trophy size={14} />,
                  telescope: <Telescope size={14} />,
                };
                const colorMap: Record<string, string> = {
                  pain: "hover:bg-red-500 hover:text-white hover:border-red-500",
                  hope: "hover:bg-amber-500 hover:text-white hover:border-amber-500",
                  philosophy: "hover:bg-violet-600 hover:text-white hover:border-violet-600",
                  proof: "hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
                  vision: "hover:bg-blue-500 hover:text-white hover:border-blue-500",
                };
                return (
                  <Link key={p} href={`/blog/topic/${p}`}>
                    <Badge variant="outline" className={`px-3 py-1.5 cursor-pointer transition-all flex items-center gap-1.5 text-sm ${colorMap[p] || "hover:bg-primary hover:text-white hover:border-primary"}`}>
                      {iconMap[pInfo.icon]}
                      {pInfo.title}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container">
            {featuredPost && (
              <AnimatedSection animation="slide-up" delay={0.1} className="mb-16">
                <div className="mb-8">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Featured Article</h2>
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                    <div className="flex flex-col xl:flex-row">
                      <div className="relative aspect-video xl:aspect-auto xl:w-1/2 xl:min-h-[400px] overflow-hidden shrink-0">
                        <img
                          src={featuredPost.featuredImage}
                          alt={featuredPost.featuredImageAlt}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {featuredPost.pinned && (
                            <Badge className="bg-amber-500 text-white font-semibold px-4 py-1 flex items-center gap-1">
                              <Pin size={12} /> Pinned
                            </Badge>
                          )}
                          <Badge className="bg-primary text-white font-semibold px-4 py-1">
                            Featured
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-8 xl:p-12 flex flex-col justify-between xl:w-1/2">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <Badge variant="outline" className="flex items-center gap-1.5 shrink-0">
                            {categoryIcons[featuredPost.category]}
                            {featuredPost.category}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Clock size={14} />
                            {featuredPost.readTime} min read
                          </span>
                        </div>
                        <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={featuredPost.author.image}
                              alt={featuredPost.author.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{featuredPost.author.name}</p>
                              <p className="text-gray-500 text-xs flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                            Read Article <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </AnimatedSection>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post, index) => (
                <AnimatedSection key={post.id} animation="slide-up" delay={0.2 + index * 0.1}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="group cursor-pointer h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.featuredImageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="flex items-center gap-1.5 text-xs">
                            {categoryIcons[post.category]}
                            {post.category}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {post.readTime} min
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{post.author.name}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fade-in" delay={0.4}>
              <div className="mt-20 text-center">
                <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl border border-primary/10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Want More Business Growth Insights?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get the complete framework for transforming your business with AI automation in The Manumation Method.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <a href="https://manumation.ai/coming-soon" target="_blank" rel="noopener noreferrer">
                        Get The Book <ArrowRight className="ml-2" size={16} aria-hidden="true" />
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/jeremys-calendar">
                        Book a Strategy Call
                      </Link>
                    </Button>
                  </div>
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
