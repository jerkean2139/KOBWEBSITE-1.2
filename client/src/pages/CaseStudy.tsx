import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Github, Calendar, Clock, CheckCircle, Wrench, Lightbulb, Play, X, ChevronRight, Quote, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { CaseStudyMilestone, CaseStudyMedia, CaseStudyContent } from "@shared/schema";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  replitUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  status: string;
  category: string;
  featuredImage: string | null;
  techStack: string[];
  clientName: string | null;
  clientIndustry: string | null;
  buildStartDate: string | null;
  buildEndDate: string | null;
  caseStudy: CaseStudyContent | null;
  milestones: CaseStudyMilestone[] | null;
  mediaGallery: CaseStudyMedia[] | null;
  heroVideoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  completed: { label: "Deployed", icon: CheckCircle, color: "bg-green-500", textColor: "text-green-400", borderColor: "border-green-500/30" },
  in_progress: { label: "Currently Building", icon: Wrench, color: "bg-blue-500", textColor: "text-blue-400", borderColor: "border-blue-500/30" },
  on_deck: { label: "On Deck", icon: Lightbulb, color: "bg-[var(--amber)]", textColor: "text-[var(--amber)]", borderColor: "border-[var(--amber)]/30" },
};

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<CaseStudyMedia | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/portfolio/projects/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--surface-sunken)] to-[var(--background)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--surface-sunken)] to-[var(--background)] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link href="/portfolio">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.on_deck;
  const StatusIcon = status.icon;
  const isBuilding = project.status === "in_progress";

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-[var(--surface-sunken)] via-[var(--secondary)] to-[var(--surface-sunken)] pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/portfolio">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>

          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Portfolio", href: "/portfolio" },
              { label: project.title },
            ]}
            variant="dark"
            className="mb-8"
          />

          {isBuilding && (
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3">
              <Construction className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-blue-300 font-semibold">Currently Building</p>
                <p className="text-blue-300/70 text-sm">This project is actively under development. Check back for updates!</p>
              </div>
            </div>
          )}

          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${status.color} text-white`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                {project.category}
              </Badge>
              {project.clientIndustry && (
                <Badge variant="outline" className="border-[var(--amber)]/40 text-[var(--amber)]">
                  {project.clientIndustry}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
            
            {project.caseStudy?.tagline && (
              <p className="text-xl text-[var(--amber)] font-medium mb-4">{project.caseStudy.tagline}</p>
            )}
            
            <p className="text-lg text-gray-300 max-w-3xl">{project.description}</p>

            <div className="flex flex-wrap gap-4 mt-6">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Live Site
                  </Button>
                </a>
              )}
              {project.replitUrl && (
                <a href={project.replitUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    View on Replit
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </a>
              )}
            </div>

            {project.buildStartDate && (
              <div className="flex items-center gap-4 mt-6 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Started: {new Date(project.buildStartDate).toLocaleDateString()}
                </span>
                {project.buildEndDate && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Completed: {new Date(project.buildEndDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </header>

          {project.heroVideoUrl && (
            <section className="mb-12">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/10">
                <video 
                  src={project.heroVideoUrl} 
                  controls 
                  className="w-full h-full object-cover"
                  poster={project.featuredImage || undefined}
                />
              </div>
            </section>
          )}

          {project.featuredImage && !project.heroVideoUrl && (
            <section className="mb-12">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/10">
                <img 
                  src={project.featuredImage} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </section>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              {project.caseStudy?.problemStatement && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-red-400 rounded-full" />
                      <h2 className="text-2xl font-bold text-white">The Challenge</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{project.caseStudy.problemStatement}</p>
                  </CardContent>
                </Card>
              )}

              {project.caseStudy?.solutionOverview && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      <h2 className="text-2xl font-bold text-white">The Solution</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{project.caseStudy.solutionOverview}</p>
                  </CardContent>
                </Card>
              )}

              {project.caseStudy?.keyFeatures && project.caseStudy.keyFeatures.length > 0 && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-[var(--amber)] rounded-full" />
                      <h2 className="text-2xl font-bold text-white">Key Features</h2>
                    </div>
                    <ul className="space-y-3">
                      {project.caseStudy.keyFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <ChevronRight className="w-5 h-5 text-[var(--amber)] flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {project.caseStudy?.resultsAchieved && project.caseStudy.resultsAchieved.length > 0 && (
                <Card className="bg-[var(--amber)]/5 border-[var(--amber)]/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-green-400 rounded-full" />
                      <h2 className="text-2xl font-bold text-white">Results Achieved</h2>
                    </div>
                    <ul className="space-y-3">
                      {project.caseStudy.resultsAchieved.map((result, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {project.caseStudy?.clientTestimonial && (
                <Card className="bg-white/5 border-[var(--amber)]/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-[var(--amber)] mb-4" />
                    <p className="text-xl text-gray-300 italic leading-relaxed mb-4">
                      "{project.caseStudy.clientTestimonial}"
                    </p>
                    {project.clientName && (
                      <p className="text-[var(--amber)] font-medium">— {project.clientName}</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {project.techStack && project.techStack.length > 0 && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-primary" />
                      Tools & Tech
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.clientName && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Client</h3>
                    <p className="text-gray-300">{project.clientName}</p>
                    {project.clientIndustry && (
                      <p className="text-[var(--amber)]/70 text-sm mt-1">{project.clientIndustry}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {project.liveUrl && (
                <Card className="bg-primary/10 border-primary/30 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-white font-medium mb-3">See it in action</p>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Live Site
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {project.milestones && project.milestones.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Build Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-[var(--amber)] to-primary/30" />
                <div className="space-y-6">
                  {project.milestones.map((milestone, i) => (
                    <div key={milestone.id} className="relative pl-12">
                      <div className="absolute left-2 w-5 h-5 rounded-full bg-primary border-4 border-[var(--surface-sunken)]" />
                      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs text-[var(--amber)]/70 mb-1">
                                {new Date(milestone.date).toLocaleDateString()}
                              </p>
                              <h3 className="font-bold text-white">{milestone.title}</h3>
                              <p className="text-gray-400 text-sm mt-1">{milestone.description}</p>
                            </div>
                            {milestone.mediaUrl && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                                {milestone.mediaType === "video" ? (
                                  <video src={milestone.mediaUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <img src={milestone.mediaUrl} alt="" className="w-full h-full object-cover" />
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {project.mediaGallery && project.mediaGallery.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Build Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.mediaGallery.map((media) => (
                  <button
                    key={media.id}
                    onClick={() => setSelectedMedia(media)}
                    className="aspect-video rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-primary transition-all group relative"
                  >
                    {media.type === "video" ? (
                      <>
                        <video src={media.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <img src={media.url} alt={media.caption} className="w-full h-full object-cover" />
                    )}
                    {media.phase && (
                      <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-[var(--amber)] px-2 py-0.5 rounded">
                        {media.phase}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {selectedMedia && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMedia(null)}
            >
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                onClick={() => setSelectedMedia(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                {selectedMedia.type === "video" ? (
                  <video src={selectedMedia.url} controls autoPlay className="w-full rounded-lg" />
                ) : (
                  <img src={selectedMedia.url} alt={selectedMedia.caption} className="w-full rounded-lg" />
                )}
                <p className="text-white text-center mt-4">{selectedMedia.caption}</p>
                {selectedMedia.phase && (
                  <p className="text-[var(--amber)]/60 text-center text-sm">Phase: {selectedMedia.phase}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
