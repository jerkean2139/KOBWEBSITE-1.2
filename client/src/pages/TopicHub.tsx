import { useParams, Link, Redirect } from "wouter";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { JsonLd } from "@/components/JsonLd";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostsByPillar, pillarInfo, getAllPillars, type PillarTopic } from "@/data/blogPosts";
import { Clock, Calendar, ArrowRight, Flame, Sun, Compass, Trophy, Telescope, BookOpen } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const pillarIcons: Record<string, React.ReactNode> = {
  flame: <Flame className="w-8 h-8" />,
  sun: <Sun className="w-8 h-8" />,
  compass: <Compass className="w-8 h-8" />,
  trophy: <Trophy className="w-8 h-8" />,
  telescope: <Telescope className="w-8 h-8" />,
};

const pillarColors: Record<PillarTopic, string> = {
  "pain": "from-red-500 to-rose-700",
  "hope": "from-amber-500 to-orange-600",
  "philosophy": "from-violet-600 to-purple-800",
  "proof": "from-emerald-500 to-green-700",
  "vision": "from-blue-500 to-indigo-700",
};

export default function TopicHub() {
  const params = useParams<{ pillar: string }>();
  const pillar = params.pillar as PillarTopic;
  const allPillars = getAllPillars();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pillar]);

  if (!allPillars.includes(pillar)) {
    return <Redirect to="/blog" />;
  }

  const info = pillarInfo[pillar];
  const posts = getPostsByPillar(pillar);
  const otherPillars = allPillars.filter(p => p !== pillar);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": info.title,
    "description": info.metaDescription,
    "url": `https://keanonbiz.com/blog/topic/${pillar}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://keanonbiz.com/blog/${post.slug}`,
        "name": post.title
      }))
    },
    "isPartOf": {
      "@type": "Blog",
      "name": "KeanOnBiz Blog",
      "url": "https://keanonbiz.com/blog"
    },
    "about": {
      "@type": "Thing",
      "name": info.title,
      "description": info.description
    }
  };

  const breadcrumbEntries = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: info.title },
  ];

  return (
    <>
      <SEO
        title={info.metaTitle}
        description={info.metaDescription}
      />
      <JsonLd data={collectionSchema} />

      <Navigation />
      <main id="main-content" className="min-h-screen bg-background" role="main">
        <section className={`relative pt-32 pb-20 bg-gradient-to-br ${pillarColors[pillar]} overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="container relative z-10">
            <AnimatedSection animation="fade-in">
              <Breadcrumbs items={breadcrumbEntries} variant="dark" className="mb-8" />
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={0.1}>
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    {pillarIcons[info.icon]}
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
                    {posts.length} Article{posts.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {info.title}
                </h1>
                <p className="text-xl text-white/90 leading-relaxed mb-8">
                  {info.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {info.keywords.map(keyword => (
                    <span key={keyword} className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm border border-white/20">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16" style={{ backgroundColor: "var(--surface-elevated)" }}>
          <div className="container">
            <div className="flex flex-wrap gap-3 mb-12">
              <Link href="/blog">
                <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-white/5 transition-colors text-sm">
                  All Topics
                </Badge>
              </Link>
              {allPillars.map(p => (
                <Link key={p} href={`/blog/topic/${p}`}>
                  <Badge
                    variant={p === pillar ? "default" : "outline"}
                    className={`px-4 py-2 cursor-pointer transition-colors text-sm ${p === pillar ? "bg-primary text-white" : "hover:bg-white/5"}`}
                  >
                    {pillarInfo[p].title}
                  </Badge>
                </Link>
              ))}
            </div>

            {posts.length > 0 && (
              <AnimatedSection animation="slide-up" delay={0.1} className="mb-12">
                <Link href={`/blog/${posts[0].slug}`}>
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card">
                    <div className="flex flex-col xl:flex-row">
                      <div className="relative aspect-video xl:aspect-auto xl:w-1/2 xl:min-h-[350px] overflow-hidden shrink-0">
                        <img
                          src={posts[0].featuredImage}
                          alt={posts[0].featuredImageAlt}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary text-white font-semibold px-4 py-1">
                            Latest in {info.title}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-8 xl:p-10 flex flex-col justify-center xl:w-1/2">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-xs">{posts[0].category}</Badge>
                          <span className="text-sm flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
                            <Clock size={14} /> {posts[0].readTime} min read
                          </span>
                        </div>
                        <h2 className="text-2xl xl:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                          {posts[0].title}
                        </h2>
                        <p className="mb-6 leading-relaxed line-clamp-3" style={{ color: "var(--text-tertiary)" }}>
                          {posts[0].excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={posts[0].author.image}
                              alt={posts[0].author.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-foreground text-sm">{posts[0].author.name}</p>
                              <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                                <Calendar size={12} />
                                {new Date(posts[0].publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                            Read <ArrowRight className="ml-2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </AnimatedSection>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post, index) => (
                <AnimatedSection key={post.id} animation="slide-up" delay={0.15 + index * 0.05}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="group cursor-pointer h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-card">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.featuredImageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                            <Clock size={12} /> {post.readTime} min
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-tertiary)" }}>{post.excerpt}</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <img src={post.author.image} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{post.author.name}</p>
                            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--text-secondary)" }} />
                <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
                <p className="mb-6" style={{ color: "var(--text-tertiary)" }}>We're working on more content for this topic. Check back soon!</p>
                <Button asChild>
                  <Link href="/blog">Browse All Articles</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container">
            <AnimatedSection animation="fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-8">Explore More Topics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherPillars.map(p => {
                  const pInfo = pillarInfo[p];
                  const pPosts = getPostsByPillar(p);
                  return (
                    <Link key={p} href={`/blog/topic/${p}`}>
                      <Card className="group cursor-pointer h-full border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${pillarColors[p]}`}></div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillarColors[p]} flex items-center justify-center text-white`}>
                              {pillarIcons[pInfo.icon] && <span className="scale-50">{pillarIcons[pInfo.icon]}</span>}
                            </div>
                            <Badge variant="secondary" className="text-xs">{pPosts.length} articles</Badge>
                          </div>
                          <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {pInfo.title}
                          </h3>
                          <p className="text-sm line-clamp-2" style={{ color: "var(--text-tertiary)" }}>{pInfo.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16" style={{ backgroundColor: "var(--surface-elevated)" }}>
          <div className="container">
            <AnimatedSection animation="fade-in">
              <div className="max-w-2xl mx-auto text-center p-8 bg-gradient-to-br from-primary/5 to-primary/5 rounded-2xl border border-primary/10">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Ready to Transform Your Business?
                </h3>
                <p className="mb-6" style={{ color: "var(--text-tertiary)" }}>
                  Get personalized guidance on {info.title.toLowerCase()} from Jeremy Kean with 35+ years of hands-on experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/jeremys-calendar">
                      Book a Strategy Call <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://manumation.ai/coming-soon" target="_blank" rel="noopener noreferrer">
                      Get The Book
                    </a>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <footer className="py-8 bg-background text-foreground">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                &copy; {new Date().getFullYear()} KeanOnBiz. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/blog" className="transition-colors text-sm" style={{ color: "var(--text-secondary)" }}>Blog</Link>
                <a href="https://manumation.ai" target="_blank" rel="noopener noreferrer" className="transition-colors text-sm" style={{ color: "var(--text-secondary)" }}>Manumation</a>
                <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer" className="transition-colors text-sm" style={{ color: "var(--text-secondary)" }}>Zenoflo</a>
                <Link href="/" className="transition-colors text-sm" style={{ color: "var(--text-secondary)" }}>Home</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
