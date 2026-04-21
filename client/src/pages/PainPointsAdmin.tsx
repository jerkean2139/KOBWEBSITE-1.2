import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Brain,
  Building2,
  Target,
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  X,
  Save,
  Play,
  FileText,
} from "lucide-react";

interface Industry {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  targetPersona: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PainPoint {
  id: number;
  industryId: number;
  category: string;
  title: string;
  description: string | null;
  severity: number;
  source: string;
  sourceUrl: string | null;
  keywords: string[] | null;
  manumationAngle: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ResearchRun {
  id: number;
  runDate: string;
  industriesSearched: string[] | null;
  totalFindings: number | null;
  newPainPointsAdded: number | null;
  status: string;
  log: Array<{ timestamp: string; message: string; level: string }> | null;
  createdAt: string;
}

const CATEGORIES = ["operations", "sales", "marketing", "tech", "hiring"];

const CATEGORY_COLORS: Record<string, string> = {
  operations: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sales: "bg-green-500/20 text-green-400 border-green-500/30",
  marketing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  tech: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  hiring: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const SEVERITY_COLORS: Record<number, string> = {
  10: "bg-red-500",
  9: "bg-red-500",
  8: "bg-orange-500",
  7: "bg-orange-500",
  6: "bg-yellow-500",
  5: "bg-yellow-500",
  4: "bg-blue-500",
  3: "bg-blue-500",
  2: "bg-slate-500",
  1: "bg-slate-500",
};

export default function PainPointsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [researchRuns, setResearchRuns] = useState<ResearchRun[]>([]);

  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [industryForm, setIndustryForm] = useState({ name: "", slug: "", description: "", targetPersona: "", status: "active" });

  const [painPointDialogOpen, setPainPointDialogOpen] = useState(false);
  const [editingPainPoint, setEditingPainPoint] = useState<PainPoint | null>(null);
  const [painPointForm, setPainPointForm] = useState({
    industryId: "",
    category: "operations",
    title: "",
    description: "",
    severity: "5",
    source: "manual",
    sourceUrl: "",
    keywords: "",
    manumationAngle: "",
  });

  const [runningResearch, setRunningResearch] = useState(false);
  const [selectedRun, setSelectedRun] = useState<ResearchRun | null>(null);
  const [seeding, setSeeding] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${adminKey}`,
    "Content-Type": "application/json",
  });

  const authenticate = async () => {
    if (!adminKey) return;
    try {
      const res = await fetch("/api/pain-points/industries", {
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("pain_points_admin_key", adminKey);
        fetchAll();
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [indRes, ppRes, rrRes] = await Promise.all([
        fetch("/api/pain-points/industries", { headers: getAuthHeaders() }),
        fetch("/api/pain-points/pain-points", { headers: getAuthHeaders() }),
        fetch("/api/pain-points/research-runs", { headers: getAuthHeaders() }),
      ]);
      const indData = await indRes.json();
      const ppData = await ppRes.json();
      const rrData = rrRes.ok ? await rrRes.json() : [];
      setIndustries(Array.isArray(indData) ? indData : []);
      setPainPoints(Array.isArray(ppData) ? ppData : []);
      setResearchRuns(Array.isArray(rrData) ? rrData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveIndustry = async () => {
    try {
      if (editingIndustry) {
        await fetch(`/api/pain-points/industries/${editingIndustry.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(industryForm),
        });
      } else {
        await fetch("/api/pain-points/industries", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(industryForm),
        });
      }
      setIndustryDialogOpen(false);
      setEditingIndustry(null);
      setIndustryForm({ name: "", slug: "", description: "", targetPersona: "", status: "active" });
      fetchAll();
    } catch (error) {
      console.error("Failed to save industry:", error);
    }
  };

  const deleteIndustry = async (id: number) => {
    if (!confirm("Delete this industry and all its pain points?")) return;
    try {
      await fetch(`/api/pain-points/industries/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchAll();
    } catch (error) {
      console.error("Failed to delete industry:", error);
    }
  };

  const openEditIndustry = (industry: Industry) => {
    setEditingIndustry(industry);
    setIndustryForm({
      name: industry.name,
      slug: industry.slug,
      description: industry.description || "",
      targetPersona: industry.targetPersona || "",
      status: industry.status,
    });
    setIndustryDialogOpen(true);
  };

  const openAddIndustry = () => {
    setEditingIndustry(null);
    setIndustryForm({ name: "", slug: "", description: "", targetPersona: "", status: "active" });
    setIndustryDialogOpen(true);
  };

  const savePainPoint = async () => {
    try {
      const payload = {
        industryId: parseInt(painPointForm.industryId),
        category: painPointForm.category,
        title: painPointForm.title,
        description: painPointForm.description,
        severity: parseInt(painPointForm.severity),
        source: painPointForm.source,
        sourceUrl: painPointForm.sourceUrl || null,
        keywords: painPointForm.keywords ? painPointForm.keywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        manumationAngle: painPointForm.manumationAngle,
      };

      if (editingPainPoint) {
        await fetch(`/api/pain-points/pain-points/${editingPainPoint.id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/pain-points/pain-points", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }
      setPainPointDialogOpen(false);
      setEditingPainPoint(null);
      resetPainPointForm();
      fetchAll();
    } catch (error) {
      console.error("Failed to save pain point:", error);
    }
  };

  const deletePainPoint = async (id: number) => {
    if (!confirm("Delete this pain point?")) return;
    try {
      await fetch(`/api/pain-points/pain-points/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      fetchAll();
    } catch (error) {
      console.error("Failed to delete pain point:", error);
    }
  };

  const openEditPainPoint = (pp: PainPoint) => {
    setEditingPainPoint(pp);
    setPainPointForm({
      industryId: String(pp.industryId),
      category: pp.category,
      title: pp.title,
      description: pp.description || "",
      severity: String(pp.severity),
      source: pp.source,
      sourceUrl: pp.sourceUrl || "",
      keywords: (pp.keywords || []).join(", "),
      manumationAngle: pp.manumationAngle || "",
    });
    setPainPointDialogOpen(true);
  };

  const openAddPainPoint = () => {
    setEditingPainPoint(null);
    resetPainPointForm();
    if (industryFilter !== "all") {
      setPainPointForm(prev => ({ ...prev, industryId: industryFilter }));
    }
    setPainPointDialogOpen(true);
  };

  const resetPainPointForm = () => {
    setPainPointForm({
      industryId: "",
      category: "operations",
      title: "",
      description: "",
      severity: "5",
      source: "manual",
      sourceUrl: "",
      keywords: "",
      manumationAngle: "",
    });
  };

  const triggerResearch = async () => {
    setRunningResearch(true);
    try {
      await fetch("/api/pain-points/research/run", {
        method: "POST",
        headers: getAuthHeaders(),
      });
      setTimeout(() => {
        fetchAll();
        setRunningResearch(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to trigger research:", error);
      setRunningResearch(false);
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/pain-points/seed", {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAll();
      } else {
        alert(data.error || "Seed failed");
      }
    } catch (error) {
      console.error("Failed to seed:", error);
    } finally {
      setSeeding(false);
    }
  };

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const filteredPainPoints = painPoints.filter(pp => {
    if (industryFilter !== "all" && pp.industryId !== parseInt(industryFilter)) return false;
    if (categoryFilter !== "all" && pp.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        pp.title.toLowerCase().includes(q) ||
        (pp.description || "").toLowerCase().includes(q) ||
        (pp.keywords || []).some(k => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getIndustryName = (id: number) => industries.find(i => i.id === id)?.name || "Unknown";

  const pointsPerIndustry = industries.map(ind => ({
    ...ind,
    count: painPoints.filter(pp => pp.industryId === ind.id).length,
    avgSeverity: painPoints.filter(pp => pp.industryId === ind.id).length > 0
      ? Math.round(painPoints.filter(pp => pp.industryId === ind.id).reduce((sum, pp) => sum + pp.severity, 0) / painPoints.filter(pp => pp.industryId === ind.id).length * 10) / 10
      : 0,
  }));

  const categoryDistribution = CATEGORIES.map(cat => ({
    category: cat,
    count: painPoints.filter(pp => pp.category === cat).length,
  }));

  const lastResearchDate = researchRuns.length > 0 ? new Date(researchRuns[0].runDate).toLocaleDateString() : "Never";

  useEffect(() => {
    const savedKey = localStorage.getItem("pain_points_admin_key");
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
      setTimeout(() => fetchAll(), 100);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchAll();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--surface-sunken)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-white/10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <Brain className="text-amber-400" size={32} />
            </div>
            <CardTitle className="text-2xl text-white">Industry Intelligence</CardTitle>
            <CardDescription className="text-white/60">
              Pain points database & research pipeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && authenticate()}
              placeholder="Enter admin key"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
            />
            <Button onClick={authenticate} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              Access Industry Intelligence
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO title="Industry Intelligence - Admin" noindex={true} />
      <div className="min-h-screen bg-[var(--surface-sunken)]">
        <header className="border-b border-white/10 bg-[var(--surface-sunken)]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Brain className="text-amber-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Industry Intelligence</h1>
                <p className="text-xs text-white/50">Pain Points Database & Research</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAll}
                disabled={loading}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAuthenticated(false);
                  setAdminKey("");
                  localStorage.removeItem("pain_points_admin_key");
                }}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-secondary border border-white/10 mb-8 p-1">
              <TabsTrigger value="dashboard" className="text-white/60 data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                <BarChart3 className="mr-2 h-4 w-4" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="industries" className="text-white/60 data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                <Building2 className="mr-2 h-4 w-4" /> Industries
              </TabsTrigger>
              <TabsTrigger value="pain-points" className="text-white/60 data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                <Target className="mr-2 h-4 w-4" /> Pain Points
                {painPoints.length > 0 && (
                  <span className="ml-1.5 bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{painPoints.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="research" className="text-white/60 data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                <Search className="mr-2 h-4 w-4" /> Research
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Industries</p>
                        <p className="text-3xl font-bold text-white">{industries.length}</p>
                      </div>
                      <Building2 className="text-amber-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Pain Points</p>
                        <p className="text-3xl font-bold text-white">{painPoints.length}</p>
                      </div>
                      <Target className="text-red-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Research Runs</p>
                        <p className="text-3xl font-bold text-white">{researchRuns.length}</p>
                      </div>
                      <Search className="text-cyan-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Last Research</p>
                        <p className="text-lg font-bold text-white">{lastResearchDate}</p>
                      </div>
                      <Clock className="text-purple-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="bg-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Pain Points per Industry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pointsPerIndustry.map(ind => (
                        <div key={ind.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{ind.name}</p>
                            <div className="mt-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (ind.count / Math.max(...pointsPerIndustry.map(i => i.count), 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className="ml-4 text-right flex-shrink-0">
                            <span className="text-white font-bold">{ind.count}</span>
                            <span className="text-white/40 text-xs ml-1">pts</span>
                          </div>
                        </div>
                      ))}
                      {pointsPerIndustry.length === 0 && (
                        <p className="text-white/40 text-sm text-center py-4">No industries yet. Seed the database to get started.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryDistribution.map(cat => (
                        <div key={cat.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Badge className={`${CATEGORY_COLORS[cat.category]} border text-xs capitalize`}>
                              {cat.category}
                            </Badge>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-white/30 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (cat.count / Math.max(...categoryDistribution.map(c => c.count), 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-white font-bold ml-4">{cat.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Coverage Gaps</CardTitle>
                    <CardDescription className="text-white/50">Industries with fewer than 8 pain points</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pointsPerIndustry.filter(i => i.count < 8).map(ind => (
                        <div key={ind.id} className="flex items-center justify-between bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                          <span className="text-white/80 text-sm">{ind.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-red-400 text-sm font-medium">{ind.count}/8 min</span>
                            <AlertCircle className="text-red-400" size={14} />
                          </div>
                        </div>
                      ))}
                      {pointsPerIndustry.filter(i => i.count < 8).length === 0 && (
                        <div className="flex items-center gap-2 text-green-400 text-sm py-2">
                          <CheckCircle2 size={16} />
                          All industries have adequate coverage
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {industries.length === 0 && (
                      <Button
                        onClick={seedDatabase}
                        disabled={seeding}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                      >
                        {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                        Seed Database (7 Industries)
                      </Button>
                    )}
                    <Button
                      onClick={triggerResearch}
                      disabled={runningResearch}
                      variant="outline"
                      className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      {runningResearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                      Run Research Pipeline
                    </Button>
                    <Button
                      onClick={() => { setActiveTab("industries"); openAddIndustry(); }}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Industry
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="industries">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Industries</h2>
                <Button onClick={openAddIndustry} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  <Plus className="mr-2 h-4 w-4" /> Add Industry
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {industries.map(ind => {
                  const count = painPoints.filter(pp => pp.industryId === ind.id).length;
                  return (
                    <Card key={ind.id} className="bg-card border-white/10 hover:border-amber-500/30 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{ind.name}</h3>
                            <p className="text-white/40 text-xs mt-0.5">/{ind.slug}</p>
                          </div>
                          <Badge className={ind.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30 border" : "bg-slate-500/20 text-slate-400 border-slate-500/30 border"}>
                            {ind.status}
                          </Badge>
                        </div>
                        {ind.description && (
                          <p className="text-white/60 text-sm mb-3 line-clamp-2">{ind.description}</p>
                        )}
                        {ind.targetPersona && (
                          <p className="text-white/40 text-xs mb-3 italic line-clamp-2">{ind.targetPersona}</p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div className="flex items-center gap-1.5">
                            <Target size={14} className="text-amber-400" />
                            <span className="text-white/70 text-sm">{count} pain points</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditIndustry(ind)} className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10">
                              <Edit size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteIndustry(ind.id)} className="h-8 w-8 p-0 text-red-400/50 hover:text-red-400 hover:bg-red-500/10">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {industries.length === 0 && (
                <Card className="bg-card border-white/10">
                  <CardContent className="p-12 text-center">
                    <Building2 className="mx-auto text-white/20 mb-4" size={48} />
                    <p className="text-white/50 mb-4">No industries yet</p>
                    <Button onClick={seedDatabase} disabled={seeding} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                      {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                      Seed Database
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pain-points">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-white">Pain Points</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 w-48"
                    />
                  </div>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white text-sm">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(ind => (
                        <SelectItem key={ind.id} value={String(ind.id)}>{ind.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white text-sm">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={openAddPainPoint} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    <Plus className="mr-2 h-4 w-4" /> Add Pain Point
                  </Button>
                </div>
              </div>

              <div className="text-white/40 text-sm mb-4">
                Showing {filteredPainPoints.length} of {painPoints.length} pain points
              </div>

              <div className="space-y-3">
                {filteredPainPoints.map(pp => (
                  <Card key={pp.id} className="bg-card border-white/10 hover:border-white/20 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${SEVERITY_COLORS[pp.severity] || "bg-slate-500"}`}>
                            {pp.severity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-white font-semibold">{pp.title}</h3>
                            <Badge className={`${CATEGORY_COLORS[pp.category]} border text-[10px] capitalize`}>
                              {pp.category}
                            </Badge>
                            <Badge className={pp.source === "research" ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 border text-[10px]" : "bg-white/10 text-white/50 border-white/20 border text-[10px]"}>
                              {pp.source}
                            </Badge>
                          </div>
                          <p className="text-white/50 text-xs mb-1">{getIndustryName(pp.industryId)}</p>
                          {pp.description && (
                            <p className="text-white/60 text-sm mb-2 line-clamp-2">{pp.description}</p>
                          )}
                          {pp.keywords && pp.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {pp.keywords.map((kw, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">{kw}</span>
                              ))}
                            </div>
                          )}
                          {pp.manumationAngle && (
                            <div className="bg-amber-500/5 border border-amber-500/10 rounded px-3 py-2 mt-2">
                              <p className="text-amber-400/80 text-xs">
                                <span className="font-semibold">Manumation Angle:</span> {pp.manumationAngle}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button variant="ghost" size="sm" onClick={() => openEditPainPoint(pp)} className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10">
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deletePainPoint(pp.id)} className="h-8 w-8 p-0 text-red-400/50 hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredPainPoints.length === 0 && (
                  <Card className="bg-card border-white/10">
                    <CardContent className="p-12 text-center">
                      <Target className="mx-auto text-white/20 mb-4" size={48} />
                      <p className="text-white/50">No pain points found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="research">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Research Pipeline</h2>
                <Button
                  onClick={triggerResearch}
                  disabled={runningResearch}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                >
                  {runningResearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  Run Research Now
                </Button>
              </div>

              <div className="space-y-4">
                {researchRuns.map(run => (
                  <Card key={run.id} className="bg-card border-white/10">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={
                            run.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30 border" :
                            run.status === "running" ? "bg-blue-500/20 text-blue-400 border-blue-500/30 border" :
                            "bg-red-500/20 text-red-400 border-red-500/30 border"
                          }>
                            {run.status === "running" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                            {run.status}
                          </Badge>
                          <span className="text-white/50 text-sm">
                            {new Date(run.runDate).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-white/60">
                            <span className="text-white font-bold">{run.totalFindings || 0}</span> found
                          </div>
                          <div className="text-white/60">
                            <span className="text-green-400 font-bold">{run.newPainPointsAdded || 0}</span> new
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRun(selectedRun?.id === run.id ? null : run)}
                            className="text-white/50 hover:text-white hover:bg-white/10"
                          >
                            <FileText size={14} className="mr-1" />
                            Log
                          </Button>
                        </div>
                      </div>
                      {run.industriesSearched && (
                        <div className="flex flex-wrap gap-1.5">
                          {run.industriesSearched.map((slug, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-white/50">{slug}</span>
                          ))}
                        </div>
                      )}
                      {selectedRun?.id === run.id && run.log && (
                        <div className="mt-4 bg-black/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                          <div className="space-y-1 font-mono text-xs">
                            {run.log.map((entry, i) => (
                              <div key={i} className={`flex gap-2 ${entry.level === "error" ? "text-red-400" : entry.level === "warn" ? "text-yellow-400" : "text-white/60"}`}>
                                <span className="text-white/30 flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                <span>{entry.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {researchRuns.length === 0 && (
                  <Card className="bg-card border-white/10">
                    <CardContent className="p-12 text-center">
                      <Search className="mx-auto text-white/20 mb-4" size={48} />
                      <p className="text-white/50 mb-4">No research runs yet</p>
                      <Button onClick={triggerResearch} disabled={runningResearch} className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                        {runningResearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                        Start First Research Run
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Dialog open={industryDialogOpen} onOpenChange={setIndustryDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingIndustry ? "Edit Industry" : "Add Industry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1 block">Name</label>
              <Input
                value={industryForm.name}
                onChange={(e) => {
                  setIndustryForm(prev => ({
                    ...prev,
                    name: e.target.value,
                    slug: editingIndustry ? prev.slug : slugify(e.target.value),
                  }));
                }}
                placeholder="e.g., Insurance Agencies"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Slug</label>
              <Input
                value={industryForm.slug}
                onChange={(e) => setIndustryForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g., insurance-agencies"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Description</label>
              <Textarea
                value={industryForm.description}
                onChange={(e) => setIndustryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this industry..."
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Target Persona</label>
              <Textarea
                value={industryForm.targetPersona}
                onChange={(e) => setIndustryForm(prev => ({ ...prev, targetPersona: e.target.value }))}
                placeholder="Who is the ideal client in this industry?"
                className="bg-white/5 border-white/10 text-white"
                rows={2}
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Status</label>
              <Select value={industryForm.status} onValueChange={(v) => setIndustryForm(prev => ({ ...prev, status: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIndustryDialogOpen(false)} className="text-white/60 hover:text-white">
                Cancel
              </Button>
              <Button onClick={saveIndustry} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold" disabled={!industryForm.name || !industryForm.slug}>
                <Save className="mr-2 h-4 w-4" />
                {editingIndustry ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={painPointDialogOpen} onOpenChange={setPainPointDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPainPoint ? "Edit Pain Point" : "Add Pain Point"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1 block">Industry</label>
                <Select value={painPointForm.industryId} onValueChange={(v) => setPainPointForm(prev => ({ ...prev, industryId: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(ind => (
                      <SelectItem key={ind.id} value={String(ind.id)}>{ind.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1 block">Category</label>
                <Select value={painPointForm.category} onValueChange={(v) => setPainPointForm(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Title</label>
              <Input
                value={painPointForm.title}
                onChange={(e) => setPainPointForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Concise pain point title"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Description</label>
              <Textarea
                value={painPointForm.description}
                onChange={(e) => setPainPointForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the pain point and its impact..."
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1 block">Severity (1-10)</label>
                <Select value={painPointForm.severity} onValueChange={(v) => setPainPointForm(prev => ({ ...prev, severity: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <SelectItem key={n} value={String(n)}>{n} {n >= 9 ? "- Critical" : n >= 7 ? "- High" : n >= 5 ? "- Medium" : "- Low"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1 block">Source</label>
                <Select value={painPointForm.source} onValueChange={(v) => setPainPointForm(prev => ({ ...prev, source: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Source URL (optional)</label>
              <Input
                value={painPointForm.sourceUrl}
                onChange={(e) => setPainPointForm(prev => ({ ...prev, sourceUrl: e.target.value }))}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Keywords (comma-separated)</label>
              <Input
                value={painPointForm.keywords}
                onChange={(e) => setPainPointForm(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="e.g., renewals, retention, policy lapse"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">Manumation Angle</label>
              <Textarea
                value={painPointForm.manumationAngle}
                onChange={(e) => setPainPointForm(prev => ({ ...prev, manumationAngle: e.target.value }))}
                placeholder="How does the Manumation Method solve this problem?"
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setPainPointDialogOpen(false)} className="text-white/60 hover:text-white">
                Cancel
              </Button>
              <Button onClick={savePainPoint} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold" disabled={!painPointForm.title || !painPointForm.industryId}>
                <Save className="mr-2 h-4 w-4" />
                {editingPainPoint ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}