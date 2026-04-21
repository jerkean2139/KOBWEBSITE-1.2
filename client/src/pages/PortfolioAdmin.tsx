import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Plus, Pencil, Trash2, ExternalLink, Rocket, CheckCircle2, Lightbulb, 
  Upload, X, GripVertical, Image as ImageIcon, Video, ChevronUp, ChevronDown,
  FileText, Milestone, GalleryHorizontalEnd, Settings, Save, Loader2
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";

interface CaseStudyContent {
  tagline?: string;
  problemStatement?: string;
  solutionOverview?: string;
  keyFeatures?: string[];
  buildApproach?: string;
  challengesFaced?: string[];
  lessonsLearned?: string[];
  resultsAchieved?: string[];
  clientTestimonial?: string;
  nextSteps?: string[];
}

interface CaseStudyMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  agentNotes?: string;
}

interface CaseStudyMedia {
  id: string;
  url: string;
  type: "image" | "video";
  caption: string;
  phase?: string;
  timestamp?: string;
}

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
  clientName: string | null;
  clientIndustry: string | null;
  heroVideoUrl: string | null;
  caseStudy: CaseStudyContent | null;
  milestones: CaseStudyMilestone[] | null;
  mediaGallery: CaseStudyMedia[] | null;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "on_deck", label: "On Deck", icon: Lightbulb },
  { value: "in_progress", label: "Building", icon: Rocket },
  { value: "completed", label: "Deployed", icon: CheckCircle2 },
];

const categoryOptions = ["website", "tool", "automation", "platform"];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function FileDropZone({ onUpload, accept, label, currentUrl, uploading }: {
  onUpload: (file: File) => void;
  accept: string;
  label: string;
  currentUrl?: string | null;
  uploading: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  }, [onUpload]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        dragOver ? "border-blue-400 bg-blue-400/10" : "border-slate-600 hover:border-slate-500"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
      {uploading ? (
        <div className="flex items-center justify-center gap-2 py-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-slate-400 text-sm">Uploading...</span>
        </div>
      ) : currentUrl ? (
        <div className="space-y-2">
          {currentUrl.match(/\.(mp4|webm|mov)$/i) ? (
            <video src={currentUrl} className="max-h-32 mx-auto rounded" controls />
          ) : (
            <img src={currentUrl} alt="" className="max-h-32 mx-auto rounded object-cover" />
          )}
          <p className="text-slate-500 text-xs">Click or drag to replace</p>
        </div>
      ) : (
        <div className="py-4">
          <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">{label}</p>
          <p className="text-slate-600 text-xs mt-1">Drag & drop or click to browse</p>
        </div>
      )}
    </div>
  );
}

export default function PortfolioAdmin() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [activeTab, setActiveTab] = useState("basics");
  const [uploading, setUploading] = useState<string | null>(null);

  const [basics, setBasics] = useState({
    title: "",
    slug: "",
    description: "",
    status: "on_deck",
    category: "tool",
    liveUrl: "",
    githubUrl: "",
    replitUrl: "",
    featuredImage: "",
    heroVideoUrl: "",
    techStack: "",
    clientName: "",
    clientIndustry: "",
  });

  const [caseStudy, setCaseStudy] = useState<CaseStudyContent>({});
  const [milestones, setMilestones] = useState<CaseStudyMilestone[]>([]);
  const [gallery, setGallery] = useState<CaseStudyMedia[]>([]);

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

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
        return null;
      }
    } catch {
      toast.error("Upload failed");
      return null;
    }
  };

  const handleFeaturedImageUpload = async (file: File) => {
    setUploading("featured");
    const url = await uploadFile(file);
    if (url) setBasics(prev => ({ ...prev, featuredImage: url }));
    setUploading(null);
  };

  const handleHeroVideoUpload = async (file: File) => {
    setUploading("heroVideo");
    const url = await uploadFile(file);
    if (url) setBasics(prev => ({ ...prev, heroVideoUrl: url }));
    setUploading(null);
  };

  const handleMilestoneMediaUpload = async (file: File, milestoneId: string) => {
    setUploading(`milestone-${milestoneId}`);
    const url = await uploadFile(file);
    if (url) {
      const isVideo = file.type.startsWith("video/");
      setMilestones(prev => prev.map(m =>
        m.id === milestoneId ? { ...m, mediaUrl: url, mediaType: isVideo ? "video" : "image" } : m
      ));
    }
    setUploading(null);
  };

  const handleGalleryUpload = async (file: File) => {
    setUploading("gallery");
    const url = await uploadFile(file);
    if (url) {
      const isVideo = file.type.startsWith("video/");
      setGallery(prev => [...prev, {
        id: generateId(),
        url,
        type: isVideo ? "video" : "image",
        caption: "",
        phase: "",
      }]);
    }
    setUploading(null);
  };

  const resetForm = () => {
    setBasics({
      title: "", slug: "", description: "", status: "on_deck", category: "tool",
      liveUrl: "", githubUrl: "", replitUrl: "", featuredImage: "", heroVideoUrl: "",
      techStack: "", clientName: "", clientIndustry: "",
    });
    setCaseStudy({});
    setMilestones([]);
    setGallery([]);
    setActiveTab("basics");
  };

  const openNewProject = () => {
    setEditingProject(null);
    resetForm();
  };

  const openEditProject = (project: PortfolioProject) => {
    setEditingProject(project);
    setBasics({
      title: project.title,
      slug: project.slug,
      description: project.description || "",
      status: project.status,
      category: project.category || "tool",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      replitUrl: project.replitUrl || "",
      featuredImage: project.featuredImage || "",
      heroVideoUrl: project.heroVideoUrl || "",
      techStack: project.techStack?.join(", ") || "",
      clientName: project.clientName || "",
      clientIndustry: project.clientIndustry || "",
    });
    setCaseStudy(project.caseStudy || {});
    setMilestones(project.milestones || []);
    setGallery(project.mediaGallery || []);
    setActiveTab("basics");
  };

  const buildPayload = () => {
    const slug = basics.slug || basics.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return {
      title: basics.title,
      slug,
      description: basics.description || null,
      status: basics.status,
      category: basics.category,
      liveUrl: basics.liveUrl || null,
      githubUrl: basics.githubUrl || null,
      replitUrl: basics.replitUrl || null,
      featuredImage: basics.featuredImage || null,
      heroVideoUrl: basics.heroVideoUrl || null,
      techStack: basics.techStack ? basics.techStack.split(",").map(t => t.trim()).filter(Boolean) : [],
      clientName: basics.clientName || null,
      clientIndustry: basics.clientIndustry || null,
      caseStudy: Object.keys(caseStudy).length > 0 ? caseStudy : null,
      milestones: milestones.length > 0 ? milestones : undefined,
      mediaGallery: gallery.length > 0 ? gallery : undefined,
    };
  };

  const handleSave = async () => {
    if (!basics.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload = buildPayload();

    try {
      if (editingProject) {
        const res = await fetch(`/api/portfolio/projects/${editingProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Project updated");
          fetchProjects();
          const updated = await res.json();
          setEditingProject(updated);
        } else {
          const err = await res.json();
          toast.error(err.error || "Failed to save");
        }
      } else {
        const res = await fetch("/api/portfolio/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Project created");
          fetchProjects();
          const created = await res.json();
          setEditingProject(created);
        } else {
          const err = await res.json();
          toast.error(err.error || "Failed to create");
        }
      }
    } catch {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project and all its snapshots?")) return;
    try {
      const res = await fetch(`/api/portfolio/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Project deleted");
        if (editingProject?.id === id) {
          setEditingProject(null);
          resetForm();
        }
        fetchProjects();
      }
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Deployed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Building</Badge>;
      case "on_deck":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">On Deck</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const addDynamicItem = (field: keyof CaseStudyContent) => {
    const current = (caseStudy[field] as string[] | undefined) || [];
    setCaseStudy({ ...caseStudy, [field]: [...current, ""] });
  };

  const updateDynamicItem = (field: keyof CaseStudyContent, index: number, value: string) => {
    const current = [...((caseStudy[field] as string[] | undefined) || [])];
    current[index] = value;
    setCaseStudy({ ...caseStudy, [field]: current });
  };

  const removeDynamicItem = (field: keyof CaseStudyContent, index: number) => {
    const current = [...((caseStudy[field] as string[] | undefined) || [])];
    current.splice(index, 1);
    setCaseStudy({ ...caseStudy, [field]: current });
  };

  const addMilestone = () => {
    setMilestones(prev => [...prev, {
      id: generateId(),
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    }]);
  };

  const updateMilestone = (id: string, updates: Partial<CaseStudyMilestone>) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const moveMilestone = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= milestones.length) return;
    const updated = [...milestones];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setMilestones(updated);
  };

  const moveGalleryItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= gallery.length) return;
    const updated = [...gallery];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setGallery(updated);
  };

  const inputClass = "bg-slate-800/80 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20";
  const labelClass = "text-slate-300 text-sm font-medium";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--surface-sunken)] to-[var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const isEditorOpen = editingProject !== null || basics.title !== "";

  return (
    <>
      <SEO title="Portfolio Admin" noindex={true} />
      <div className="min-h-screen bg-gradient-to-b from-[var(--surface-sunken)] via-[var(--background)] to-[var(--surface-sunken)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/portfolio">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-white">
                Portfolio <span className="text-blue-400">Manager</span>
              </h1>
            </div>
            <Button onClick={openNewProject} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`${isEditorOpen ? "lg:col-span-4" : "lg:col-span-12"}`}>
              <div className="space-y-2">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card
                      className={`border cursor-pointer transition-all ${
                        editingProject?.id === project.id
                          ? "bg-blue-900/20 border-blue-500/50"
                          : "bg-[var(--background)]/80 border-slate-700/50 hover:border-slate-600"
                      }`}
                      onClick={() => openEditProject(project)}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 min-w-0">
                            {project.featuredImage && (
                              <img
                                src={project.featuredImage}
                                alt={project.title}
                                className="w-12 h-10 object-cover rounded flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
                              <div className="flex items-center gap-1.5 mt-1">
                                {getStatusBadge(project.status)}
                                <Badge className="bg-slate-700/50 text-slate-400 text-[10px] border-slate-600/50">{project.category}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-500 hover:text-white">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                              </a>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                              className="h-7 w-7 p-0 text-red-400/60 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-slate-500">No projects yet. Click "New Project" to get started.</p>
                  </div>
                )}
              </div>
            </div>

            {isEditorOpen && (
              <div className="lg:col-span-8">
                <Card className="bg-[var(--background)]/90 border-slate-700/50">
                  <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                      {editingProject ? `Editing: ${editingProject.title}` : "New Project"}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {editingProject ? "Save Changes" : "Create Project"}
                      </Button>
                      <Button variant="ghost" onClick={() => { setEditingProject(null); resetForm(); }} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="px-4 pt-3">
                      <TabsList className="bg-slate-800/50 border border-slate-700/50 w-full grid grid-cols-4">
                        <TabsTrigger value="basics" className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                          <Settings className="w-3.5 h-3.5 mr-1.5" /> Basics
                        </TabsTrigger>
                        <TabsTrigger value="casestudy" className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                          <FileText className="w-3.5 h-3.5 mr-1.5" /> Case Study
                        </TabsTrigger>
                        <TabsTrigger value="milestones" className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                          <Milestone className="w-3.5 h-3.5 mr-1.5" /> Milestones
                          {milestones.length > 0 && <span className="ml-1 text-[10px] bg-blue-500/30 px-1.5 rounded-full">{milestones.length}</span>}
                        </TabsTrigger>
                        <TabsTrigger value="gallery" className="text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs">
                          <GalleryHorizontalEnd className="w-3.5 h-3.5 mr-1.5" /> Gallery
                          {gallery.length > 0 && <span className="ml-1 text-[10px] bg-blue-500/30 px-1.5 rounded-full">{gallery.length}</span>}
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="p-4">
                      <TabsContent value="basics" className="mt-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Title *</Label>
                            <Input
                              value={basics.title}
                              onChange={(e) => setBasics({ ...basics, title: e.target.value })}
                              className={inputClass}
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Slug</Label>
                            <Input
                              value={basics.slug}
                              onChange={(e) => setBasics({ ...basics, slug: e.target.value })}
                              placeholder="auto-generated from title"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className={labelClass}>Description</Label>
                          <Textarea
                            value={basics.description}
                            onChange={(e) => setBasics({ ...basics, description: e.target.value })}
                            className={`${inputClass} min-h-[80px]`}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Status</Label>
                            <Select value={basics.status} onValueChange={(v) => setBasics({ ...basics, status: v })}>
                              <SelectTrigger className={inputClass}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-600">
                                {statusOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-white">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Category</Label>
                            <Select value={basics.category} onValueChange={(v) => setBasics({ ...basics, category: v })}>
                              <SelectTrigger className={inputClass}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-600">
                                {categoryOptions.map((cat) => (
                                  <SelectItem key={cat} value={cat} className="text-white capitalize">
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Client Industry</Label>
                            <Input
                              value={basics.clientIndustry}
                              onChange={(e) => setBasics({ ...basics, clientIndustry: e.target.value })}
                              placeholder="e.g., Insurance"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Client Name</Label>
                            <Input
                              value={basics.clientName}
                              onChange={(e) => setBasics({ ...basics, clientName: e.target.value })}
                              className={inputClass}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Tech Stack (comma separated)</Label>
                            <Input
                              value={basics.techStack}
                              onChange={(e) => setBasics({ ...basics, techStack: e.target.value })}
                              placeholder="React, Node.js, PostgreSQL"
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Live URL</Label>
                            <Input
                              value={basics.liveUrl}
                              onChange={(e) => setBasics({ ...basics, liveUrl: e.target.value })}
                              placeholder="https://..."
                              className={inputClass}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelClass}>GitHub URL</Label>
                            <Input
                              value={basics.githubUrl}
                              onChange={(e) => setBasics({ ...basics, githubUrl: e.target.value })}
                              placeholder="https://github.com/..."
                              className={inputClass}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Replit URL</Label>
                            <Input
                              value={basics.replitUrl}
                              onChange={(e) => setBasics({ ...basics, replitUrl: e.target.value })}
                              placeholder="https://replit.com/..."
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Featured Image</Label>
                            <FileDropZone
                              onUpload={handleFeaturedImageUpload}
                              accept="image/*"
                              label="Drop featured image here"
                              currentUrl={basics.featuredImage}
                              uploading={uploading === "featured"}
                            />
                            {basics.featuredImage && (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={basics.featuredImage}
                                  onChange={(e) => setBasics({ ...basics, featuredImage: e.target.value })}
                                  className={`${inputClass} text-xs`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setBasics({ ...basics, featuredImage: "" })}
                                  className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <Label className={labelClass}>Hero Video</Label>
                            <FileDropZone
                              onUpload={handleHeroVideoUpload}
                              accept="video/*"
                              label="Drop hero video here"
                              currentUrl={basics.heroVideoUrl}
                              uploading={uploading === "heroVideo"}
                            />
                            {basics.heroVideoUrl && (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={basics.heroVideoUrl}
                                  onChange={(e) => setBasics({ ...basics, heroVideoUrl: e.target.value })}
                                  className={`${inputClass} text-xs`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setBasics({ ...basics, heroVideoUrl: "" })}
                                  className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="casestudy" className="mt-0 space-y-4">
                        <div className="space-y-1.5">
                          <Label className={labelClass}>Tagline</Label>
                          <Input
                            value={caseStudy.tagline || ""}
                            onChange={(e) => setCaseStudy({ ...caseStudy, tagline: e.target.value })}
                            placeholder="A catchy one-liner for the project"
                            className={inputClass}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className={labelClass}>Problem Statement</Label>
                          <Textarea
                            value={caseStudy.problemStatement || ""}
                            onChange={(e) => setCaseStudy({ ...caseStudy, problemStatement: e.target.value })}
                            placeholder="What challenge did the client face?"
                            className={`${inputClass} min-h-[80px]`}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className={labelClass}>Solution Overview</Label>
                          <Textarea
                            value={caseStudy.solutionOverview || ""}
                            onChange={(e) => setCaseStudy({ ...caseStudy, solutionOverview: e.target.value })}
                            placeholder="How did we solve it?"
                            className={`${inputClass} min-h-[80px]`}
                          />
                        </div>

                        <DynamicListField
                          label="Key Features"
                          items={caseStudy.keyFeatures || []}
                          onAdd={() => addDynamicItem("keyFeatures")}
                          onUpdate={(i, v) => updateDynamicItem("keyFeatures", i, v)}
                          onRemove={(i) => removeDynamicItem("keyFeatures", i)}
                          placeholder="Feature description"
                          inputClass={inputClass}
                          labelClass={labelClass}
                        />

                        <div className="space-y-1.5">
                          <Label className={labelClass}>Build Approach</Label>
                          <Textarea
                            value={caseStudy.buildApproach || ""}
                            onChange={(e) => setCaseStudy({ ...caseStudy, buildApproach: e.target.value })}
                            placeholder="How was this built? Tools, methodology, timeline..."
                            className={`${inputClass} min-h-[80px]`}
                          />
                        </div>

                        <DynamicListField
                          label="Challenges Faced"
                          items={caseStudy.challengesFaced || []}
                          onAdd={() => addDynamicItem("challengesFaced")}
                          onUpdate={(i, v) => updateDynamicItem("challengesFaced", i, v)}
                          onRemove={(i) => removeDynamicItem("challengesFaced", i)}
                          placeholder="Challenge description"
                          inputClass={inputClass}
                          labelClass={labelClass}
                        />

                        <DynamicListField
                          label="Lessons Learned"
                          items={caseStudy.lessonsLearned || []}
                          onAdd={() => addDynamicItem("lessonsLearned")}
                          onUpdate={(i, v) => updateDynamicItem("lessonsLearned", i, v)}
                          onRemove={(i) => removeDynamicItem("lessonsLearned", i)}
                          placeholder="Lesson learned"
                          inputClass={inputClass}
                          labelClass={labelClass}
                        />

                        <DynamicListField
                          label="Results Achieved"
                          items={caseStudy.resultsAchieved || []}
                          onAdd={() => addDynamicItem("resultsAchieved")}
                          onUpdate={(i, v) => updateDynamicItem("resultsAchieved", i, v)}
                          onRemove={(i) => removeDynamicItem("resultsAchieved", i)}
                          placeholder="Result or metric"
                          inputClass={inputClass}
                          labelClass={labelClass}
                        />

                        <div className="space-y-1.5">
                          <Label className={labelClass}>Client Testimonial</Label>
                          <Textarea
                            value={caseStudy.clientTestimonial || ""}
                            onChange={(e) => setCaseStudy({ ...caseStudy, clientTestimonial: e.target.value })}
                            placeholder="What did the client say about the project?"
                            className={`${inputClass} min-h-[80px]`}
                          />
                        </div>

                        <DynamicListField
                          label="Next Steps"
                          items={caseStudy.nextSteps || []}
                          onAdd={() => addDynamicItem("nextSteps")}
                          onUpdate={(i, v) => updateDynamicItem("nextSteps", i, v)}
                          onRemove={(i) => removeDynamicItem("nextSteps", i)}
                          placeholder="Planned next step"
                          inputClass={inputClass}
                          labelClass={labelClass}
                        />
                      </TabsContent>

                      <TabsContent value="milestones" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400 text-sm">Track build progress with milestones</p>
                          <Button onClick={addMilestone} variant="outline" size="sm" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Milestone
                          </Button>
                        </div>

                        {milestones.length === 0 && (
                          <div className="text-center py-12 text-slate-500">
                            <Milestone className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p>No milestones yet</p>
                          </div>
                        )}

                        {milestones.map((milestone, index) => (
                          <Card key={milestone.id} className="bg-slate-800/40 border-slate-700/40 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-slate-600" />
                                <span className="text-slate-500 text-xs font-mono">#{index + 1}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => moveMilestone(index, "up")} disabled={index === 0} className="h-7 w-7 p-0 text-slate-500 hover:text-white">
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => moveMilestone(index, "down")} disabled={index === milestones.length - 1} className="h-7 w-7 p-0 text-slate-500 hover:text-white">
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => removeMilestone(milestone.id)} className="h-7 w-7 p-0 text-red-400/60 hover:text-red-400">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-2 space-y-1.5">
                                <Label className={labelClass}>Title</Label>
                                <Input
                                  value={milestone.title}
                                  onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                                  className={inputClass}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label className={labelClass}>Date</Label>
                                <Input
                                  type="date"
                                  value={milestone.date}
                                  onChange={(e) => updateMilestone(milestone.id, { date: e.target.value })}
                                  className={inputClass}
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <Label className={labelClass}>Description</Label>
                              <Textarea
                                value={milestone.description}
                                onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                                className={`${inputClass} min-h-[60px]`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className={labelClass}>Agent Notes</Label>
                              <Textarea
                                value={milestone.agentNotes || ""}
                                onChange={(e) => updateMilestone(milestone.id, { agentNotes: e.target.value })}
                                placeholder="Internal build notes..."
                                className={`${inputClass} min-h-[50px]`}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className={labelClass}>Media (optional)</Label>
                              <FileDropZone
                                onUpload={(file) => handleMilestoneMediaUpload(file, milestone.id)}
                                accept="image/*,video/*"
                                label="Drop milestone media"
                                currentUrl={milestone.mediaUrl}
                                uploading={uploading === `milestone-${milestone.id}`}
                              />
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      <TabsContent value="gallery" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400 text-sm">Project screenshots, demos, and videos</p>
                        </div>

                        <FileDropZone
                          onUpload={handleGalleryUpload}
                          accept="image/*,video/*"
                          label="Drop images or videos to add to gallery"
                          uploading={uploading === "gallery"}
                        />

                        {gallery.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <GalleryHorizontalEnd className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p>No gallery items yet</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          {gallery.map((item, index) => (
                            <Card key={item.id} className="bg-slate-800/40 border-slate-700/40 overflow-hidden">
                              <div className="relative">
                                {item.type === "video" ? (
                                  <video src={item.url} className="w-full h-32 object-cover" />
                                ) : (
                                  <img src={item.url} alt={item.caption} className="w-full h-32 object-cover" />
                                )}
                                <div className="absolute top-1 right-1 flex gap-1">
                                  <Badge className="bg-black/70 text-white text-[10px]">
                                    {item.type === "video" ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                  </Badge>
                                </div>
                                <div className="absolute bottom-1 right-1 flex gap-0.5">
                                  <Button variant="ghost" size="sm" onClick={() => moveGalleryItem(index, "up")} disabled={index === 0} className="h-6 w-6 p-0 bg-black/50 text-white hover:bg-black/70">
                                    <ChevronUp className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => moveGalleryItem(index, "down")} disabled={index === gallery.length - 1} className="h-6 w-6 p-0 bg-black/50 text-white hover:bg-black/70">
                                    <ChevronDown className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setGallery(prev => prev.filter(g => g.id !== item.id))} className="h-6 w-6 p-0 bg-red-900/50 text-red-300 hover:bg-red-900/70">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="p-2 space-y-1.5">
                                <Input
                                  value={item.caption}
                                  onChange={(e) => setGallery(prev => prev.map(g => g.id === item.id ? { ...g, caption: e.target.value } : g))}
                                  placeholder="Caption"
                                  className={`${inputClass} text-xs h-7`}
                                />
                                <Input
                                  value={item.phase || ""}
                                  onChange={(e) => setGallery(prev => prev.map(g => g.id === item.id ? { ...g, phase: e.target.value } : g))}
                                  placeholder="Phase (e.g., Design, Build, Launch)"
                                  className={`${inputClass} text-xs h-7`}
                                />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DynamicListField({ label, items, onAdd, onUpdate, onRemove, placeholder, inputClass, labelClass }: {
  label: string;
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  inputClass: string;
  labelClass: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className={labelClass}>{label}</Label>
        <Button onClick={onAdd} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            className={`${inputClass} text-sm`}
          />
          <Button onClick={() => onRemove(index)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400/60 hover:text-red-400 flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-slate-600 text-xs italic">No items yet. Click "Add" to start.</p>
      )}
    </div>
  );
}
