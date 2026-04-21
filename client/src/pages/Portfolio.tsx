import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Github, 
  Layers,
  Eye,
  ArrowLeft,
  Rocket,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Building2,
  Wrench,
  Globe,
  Code2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";

type ProjectStatus = "all" | "completed" | "in_progress" | "on_deck";

interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  replitUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  status: string;
  category: string | null;
  featuredImage: string | null;
  techStack: string[] | null;
  snapshotCount: number | null;
  clientIndustry: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export default function Portfolio() {
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectStatus>("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/portfolio/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const websiteProjects = projects.filter(p => p.category === "website");
  const toolProjects = projects.filter(p => p.category !== "website");

  const filterProjects = (list: PortfolioProject[]) =>
    list.filter(p => filter === "all" || p.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Deployed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Building
          </span>
        );
      case "on_deck":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--amber)]/20 text-[var(--amber)] border border-[var(--amber)]/30">
            <Lightbulb className="w-3 h-3" />
            On Deck
          </span>
        );
      default:
        return null;
    }
  };

  const statusTabs: { key: ProjectStatus; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: <Layers className="w-4 h-4" /> },
    { key: "completed", label: "Deployed", icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: "in_progress", label: "Building", icon: <Rocket className="w-4 h-4" /> },
    { key: "on_deck", label: "On Deck", icon: <Lightbulb className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.20 0.08 250) 0%, oklch(0.15 0.06 255) 50%, oklch(0.18 0.07 245) 100%)" }}>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderProjectCard = (project: PortfolioProject, index: number) => (
    <motion.div
      key={project.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card 
        className="group h-full overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        style={{ background: "rgba(255,255,255,0.04)" }}
        role="link"
        tabIndex={0}
        aria-label={`View case study: ${project.title}`}
        onClick={() => navigate(`/portfolio/${project.slug}`)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/portfolio/${project.slug}`); } }}
      >
        <div className="relative aspect-video overflow-hidden">
          {project.featuredImage ? (
            <img 
              src={project.featuredImage} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 250) 0%, oklch(0.16 0.04 255) 100%)" }}>
              <Layers className="w-10 h-10 text-white/15" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <Button className="bg-[var(--amber)] hover:bg-[var(--amber)]/90 text-gray-900 font-semibold text-sm shadow-lg">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>

          <div className="absolute top-3 right-3">
            {getStatusBadge(project.status)}
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-white group-hover:text-[var(--amber)] transition-colors mb-2">
            {project.title}
          </h3>

          {project.clientIndustry && (
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-medium mb-2">
              <Wrench className="w-3.5 h-3.5" />
              {project.clientIndustry}
            </div>
          )}
          
          {project.description && (
            <p className="text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.slice(0, 4).map((tech, i) => (
                <span 
                  key={i}
                  className="text-xs bg-white/5 text-white/70 px-2.5 py-0.5 rounded-full border border-white/10"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-xs text-white/30 px-1 py-0.5">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <span className="text-xs text-primary font-medium group-hover:text-[var(--amber)] transition-colors flex items-center gap-1">
              View case study
              <ArrowRight className="w-3 h-3" />
            </span>
            <div className="flex gap-2">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const filteredWebsites = filterProjects(websiteProjects);
  const filteredTools = filterProjects(toolProjects);

  return (
    <>
      <SEO 
        title="The Build Gallery | KeanOnBiz Portfolio"
        description="Explore our portfolio of custom-built automation platforms, websites, and business tools. See real projects from idea to deployment."
      />
      <Navigation />
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, oklch(0.20 0.08 250) 0%, oklch(0.15 0.06 255) 50%, oklch(0.18 0.07 245) 100%)" }}>
        <section className="pt-28 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--amber)]/20 rounded-full blur-[150px]" />
          </div>

          <div className="container relative z-10">
            <Link href="/">
              <Button variant="ghost" className="mb-8 text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Home
              </Button>
            </Link>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--amber)]/20 rounded-full mb-6 border border-[var(--amber)]/30">
                <Building2 className="text-[var(--amber)]" size={16} aria-hidden="true" />
                <p className="text-[var(--amber)] text-sm font-bold uppercase tracking-wider">Portfolio</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                The Build <span className="text-[var(--amber)]">Gallery</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                Real projects. Real results. From concept to deployment — see how we build 
                automation systems, platforms, and tools that transform businesses.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-16"
            >
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === tab.key
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </motion.div>

            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Websites</h2>
                  <p className="text-white/50 text-sm">Custom-built marketing sites, web apps, and digital experiences</p>
                </div>
              </motion.div>

              {filteredWebsites.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-dashed border-white/10 py-16 px-8 text-center"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white/20" />
                  </div>
                  {websiteProjects.length === 0 ? (
                    <>
                      <h3 className="text-lg text-white/60 mb-2 font-medium">Projects in Progress</h3>
                      <p className="text-white/40 text-sm max-w-md mx-auto">
                        Website projects are currently being built. Check back soon to see completed work with full case studies.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg text-white/60 mb-2 font-medium">No matching websites</h3>
                      <p className="text-white/40 text-sm">Try adjusting the filter to see more projects.</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredWebsites.map((project, index) => renderProjectCard(project, index))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--amber)]/20 flex items-center justify-center border border-[var(--amber)]/30">
                  <Code2 className="w-5 h-5 text-[var(--amber)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">SaaS Tools</h2>
                  <p className="text-white/50 text-sm">AI-powered software products and business automation platforms</p>
                </div>
              </motion.div>

              {filteredTools.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Code2 className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-lg text-white/60 mb-2">No matching tools</h3>
                  <p className="text-white/40 text-sm">Try adjusting the filter to see more projects.</p>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredTools.map((project, index) => renderProjectCard(project, index))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
