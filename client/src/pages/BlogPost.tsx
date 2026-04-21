import { useParams, Link, Redirect } from "wouter";
import { useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPostBySlug, getAllBlogPosts, getRelatedPosts, pillarInfo, blogPosts as allBlogPostsData } from "@/data/blogPosts";
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Linkedin, Twitter, Facebook, BookOpen, Bot, Sparkles, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";

function injectInternalLinks(content: string, currentSlug: string): string {
  const allPosts = allBlogPostsData;

  const linkMap: Array<{ phrase: string; slug: string; title: string }> = [];

  for (const p of allPosts) {
    if (p.slug === currentSlug) continue;
    linkMap.push({ phrase: p.title, slug: p.slug, title: p.title });
    for (const tag of p.tags.slice(0, 3)) {
      if (tag.length > 8 && !linkMap.find(l => l.phrase.toLowerCase() === tag.toLowerCase())) {
        linkMap.push({ phrase: tag, slug: p.slug, title: p.title });
      }
    }
  }

  linkMap.sort((a, b) => b.phrase.length - a.phrase.length);

  let injectedCount = 0;
  const maxLinks = 5;
  const usedSlugs = new Set<string>();
  let result = content;

  for (const link of linkMap) {
    if (injectedCount >= maxLinks) break;
    if (usedSlugs.has(link.slug)) continue;

    const escapedPhrase = link.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![\\[\\(])\\b(${escapedPhrase})\\b(?![\\]\\)])`, "i");
    const match = result.match(regex);

    if (match && match.index !== undefined) {
      const before = result.slice(0, match.index);
      const after = result.slice(match.index + match[0].length);

      if (!before.includes("[" + match[0]) && !before.endsWith("[") && !after.startsWith("](")) {
        result = `${before}[${match[0]}](/blog/${link.slug})${after}`;
        usedSlugs.add(link.slug);
        injectedCount++;
      }
    }
  }

  return result;
}

function renderMarkdown(content: string): string {
  let html = content
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl md:text-2xl font-semibold text-gray-900 mt-10 mb-4">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold text-gray-900 mt-8 mb-3">$1</h4>')
    .replace(/^---$/gim, '<hr class="my-10 border-t-2 border-gray-200" />')
    .replace(/^> (.+)$/gim, '<blockquote class="my-8 pl-6 py-4 pr-4 border-l-4 border-primary bg-primary/5 rounded-r-lg text-gray-800 italic">$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<figure class="my-10"><img src="$2" alt="$1" class="w-full rounded-xl shadow-lg" /><figcaption class="text-center text-sm text-gray-500 mt-3">$1</figcaption></figure>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (match, text, url) => {
      const isExternal = url.startsWith('http');
      if (isExternal) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline underline-offset-4 font-medium">${text}</a>`;
      }
      return `<a href="${url}" class="text-primary hover:text-primary/80 underline underline-offset-4 font-medium">${text}</a>`;
    })
    .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-3 text-gray-700 leading-relaxed list-disc">$1</li>')
    .replace(/^\| (.+) \|$/gim, (match, content) => {
      const cells = content.split(' | ').map((cell: string) => `<td class="px-4 py-3 border border-gray-200">${cell.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-6 mb-2 text-gray-700 leading-relaxed"><span class="font-semibold">$1.</span> $2</li>');

  const paragraphs = html.split('\n\n');
  html = paragraphs.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<li') || p.startsWith('<tr') || p.startsWith('<table') || p.startsWith('<hr') || p.startsWith('<blockquote')) return p;
    if (p.includes('<li')) {
      return `<ul class="my-6 space-y-2 list-inside">${p}</ul>`;
    }
    return `<p class="text-gray-700 leading-relaxed mb-6">${p}</p>`;
  }).join('\n');

  return html;
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(params.slug || "");
  const allPosts = getAllBlogPosts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  if (!post) {
    return <Redirect to="/blog" />;
  }

  const currentIndex = allPosts.findIndex(p => p.id === post.id);
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = getRelatedPosts(post, 3);

  const shareUrl = `https://keanonbiz.com/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);

  const categoryIcons: Record<string, React.ReactNode> = {
    "AI Automation": <Bot className="w-4 h-4" />,
    "Business Strategy": <Sparkles className="w-4 h-4" />,
    "Business Mindset": <Users className="w-4 h-4" />,
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "image": `https://keanonbiz.com${post.featuredImage}`,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": "https://keanonbiz.com",
      "jobTitle": post.author.title
    },
    "publisher": {
      "@type": "Organization",
      "name": "KeanOnBiz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://keanonbiz.com/kean-on-biz-logo-blue.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": shareUrl
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", ")
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const breadcrumbEntries: Array<{ label: string; href?: string }> = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];
  if (post.pillar && pillarInfo[post.pillar]) {
    breadcrumbEntries.push({
      label: pillarInfo[post.pillar].title,
      href: `/blog/topic/${post.pillar}`,
    });
  }
  breadcrumbEntries.push({ label: post.title });

  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#hero-heading", ".article-summary", ".faq-container"]
    },
    "url": shareUrl
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.metaDescription}
        image={post.featuredImage}
        type="article"
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        author={post.author.name}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      
      <Navigation />
      <main id="main-content" className="min-h-screen bg-white" role="main">
        <article itemScope itemType="https://schema.org/Article">
          <header className="relative pt-28 pb-16 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            </div>
            
            <div className="container relative z-10">
              <AnimatedSection animation="fade-in">
                <Breadcrumbs items={breadcrumbEntries} className="mb-8" />
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={0.1}>
                <div className="max-w-4xl">
                  <div className="flex items-center gap-4 mb-6">
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      {categoryIcons[post.category]}
                      {post.category}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Clock size={14} />
                      {post.readTime} min read
                    </span>
                  </div>
                  
                  <h1 
                    id="hero-heading"
                    itemProp="headline"
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                  >
                    {post.title}
                  </h1>
                  
                  <p className="article-summary text-xl text-gray-600 leading-relaxed mb-8" itemProp="description">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <img
                        src={post.author.image}
                        alt={post.author.name}
                        itemProp="image"
                        className="h-12 w-auto object-contain"
                      />
                      <div itemProp="author" itemScope itemType="https://schema.org/Person">
                        <p itemProp="name" className="font-semibold text-gray-900">{post.author.name}</p>
                        <p className="text-gray-500 text-sm">{post.author.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <time itemProp="datePublished" dateTime={post.publishedAt} className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      {post.updatedAt !== post.publishedAt && (
                        <span className="text-gray-400">
                          Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </header>

          <AnimatedSection animation="fade-in" delay={0.2}>
            <div className="relative aspect-video max-w-5xl mx-auto -mt-8 px-4">
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                itemProp="image"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </AnimatedSection>

          <div className="container py-16">
            <div className="grid lg:grid-cols-12 gap-12">
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-32 flex flex-col items-center gap-4">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Share</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-500 flex items-center justify-center transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                </div>
              </aside>

              <div className="lg:col-span-7">
                {post.audioFile && (
                  <AnimatedSection animation="fade-in" delay={0.25}>
                    <div className="mb-10 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{post.audioTitle || "Audio Deep Dive"}</p>
                          <p className="text-white/70 text-sm">Listen to this article</p>
                        </div>
                      </div>
                      <audio 
                        controls 
                        className="w-full h-12"
                        preload="metadata"
                      >
                        <source src={post.audioFile} type="audio/mp4" />
                        <source src={post.audioFile} type="audio/x-m4a" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </AnimatedSection>
                )}

                <div 
                  itemProp="articleBody"
                  className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(injectInternalLinks(post.content, post.slug))) }}
                />

                {post.faqs.length > 0 && (
                  <AnimatedSection animation="slide-up" delay={0.4}>
                    <div className="faq-container mt-16 pt-12 border-t border-gray-200">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-6">
                        {post.faqs.map((faq, index) => (
                          <Card key={index} className="border-0 shadow-md">
                            <CardContent className="p-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {faq.question}
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                <AnimatedSection animation="fade-in" delay={0.5}>
                  <div className="mt-12 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </AnimatedSection>

                {post.pillar && pillarInfo[post.pillar] && (
                  <AnimatedSection animation="fade-in" delay={0.55}>
                    <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <p className="text-sm text-gray-600 mb-2">This article is part of our</p>
                      <Link href={`/blog/topic/${post.pillar}`} className="font-semibold text-primary hover:underline text-lg">
                        {pillarInfo[post.pillar].title} &rarr;
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{pillarInfo[post.pillar].description}</p>
                    </div>
                  </AnimatedSection>
                )}

                <div className="lg:hidden mt-8 flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-500">Share:</span>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                </div>
              </div>

              <aside className="lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <AnimatedSection animation="slide-left" delay={0.3}>
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-br from-primary to-blue-600 p-6 text-white">
                        <img src="/manumation-book-cover-nobg.webp" alt="Manumation Method" className="w-16 h-auto mb-4 rounded shadow-lg" />
                        <h3 className="text-xl font-bold mb-2">The Manumation Method</h3>
                        <p className="text-white/90 text-sm">
                          Get the complete framework for transforming your business with AI automation.
                        </p>
                      </div>
                      <CardContent className="p-6">
                        <Button className="w-full" asChild>
                          <a href="https://manumation.ai/coming-soon" target="_blank" rel="noopener noreferrer">
                            Get The Book <ArrowRight className="ml-2" size={16} />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedSection>

                  <AnimatedSection animation="slide-left" delay={0.4}>
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
                        <img src="/zenoflo-logo.svg" alt="Zenoflo" className="w-12 h-12 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Zenoflo Automation</h3>
                        <p className="text-white/90 text-sm">
                          Ready-to-deploy AI workflows for insurance agencies and businesses.
                        </p>
                      </div>
                      <CardContent className="p-6">
                        <Button variant="outline" className="w-full" asChild>
                          <a href="https://zenoflo.com" target="_blank" rel="noopener noreferrer">
                            Explore Solutions <ArrowRight className="ml-2" size={16} />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedSection>

                  <AnimatedSection animation="slide-left" delay={0.5}>
                    <Card className="border-0 shadow-lg p-6">
                      <h3 className="font-bold text-gray-900 mb-4">About the Author</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={post.author.image}
                          alt={post.author.name}
                          className="h-14 w-auto object-contain"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{post.author.name}</p>
                          <p className="text-sm text-gray-500">{post.author.title}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {post.author.bio}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/jeremys-calendar">
                          Book a Strategy Call
                        </Link>
                      </Button>
                    </Card>
                  </AnimatedSection>
                </div>
              </aside>
            </div>

            {relatedPosts.length > 0 && (
              <AnimatedSection animation="slide-up" delay={0.6}>
                <div className="mt-16 pt-12 border-t border-gray-200">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    Related Articles
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((related) => (
                      <Link key={related.id} href={`/blog/${related.slug}`}>
                        <Card className="group cursor-pointer h-full border-0 shadow-md hover:shadow-lg transition-all overflow-hidden">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={related.featuredImage}
                              alt={related.featuredImageAlt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <CardContent className="p-4">
                            <Badge variant="secondary" className="mb-2 text-xs">
                              {related.category}
                            </Badge>
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                              {related.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {related.readTime} min read
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            <AnimatedSection animation="fade-in" delay={0.7}>
              <nav className="mt-16 pt-12 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-8">
                  {prevPost && (
                    <Link href={`/blog/${prevPost.slug}`}>
                      <Card className="group cursor-pointer h-full border-0 shadow-md hover:shadow-lg transition-all p-6">
                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                          <ArrowLeft size={14} /> Previous Article
                        </p>
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {prevPost.title}
                        </h4>
                      </Card>
                    </Link>
                  )}
                  {nextPost && (
                    <Link href={`/blog/${nextPost.slug}`}>
                      <Card className="group cursor-pointer h-full border-0 shadow-md hover:shadow-lg transition-all p-6 text-right md:col-start-2">
                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-2 justify-end">
                          Next Article <ArrowRight size={14} />
                        </p>
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                          {nextPost.title}
                        </h4>
                      </Card>
                    </Link>
                  )}
                </div>
              </nav>
            </AnimatedSection>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
