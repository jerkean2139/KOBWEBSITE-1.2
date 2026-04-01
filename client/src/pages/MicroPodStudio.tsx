import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Sparkles,
  Loader2,
  RefreshCw,
  BarChart3,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Edit,
  Save,
  X,
  Play,
  Volume2,
  Settings,
  Shield,
  XCircle,
  ArrowLeft,
} from "lucide-react";

interface Episode {
  id: number;
  episodeNumber: number | null;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  script: string | null;
  audioUrl: string | null;
  audioDuration: number | null;
  transcript: string | null;
  topics: string[] | null;
  targetIndustryId: number | null;
  targetLength: number | null;
  sourceBlogPostId: number | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Industry {
  id: number;
  name: string;
  slug: string;
}

interface GenerationProgress {
  stage: string;
  message: string;
  data?: any;
}

interface Stats {
  total: number;
  drafts: number;
  approved: number;
  published: number;
}

export default function MicroPodStudio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const [genTopic, setGenTopic] = useState("");
  const [genTargetLength, setGenTargetLength] = useState("7");
  const [genIndustryId, setGenIndustryId] = useState("");
  const [latestReview, setLatestReview] = useState<any>(null);

  const [approvalEpisode, setApprovalEpisode] = useState<Episode | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const [voiceConfig, setVoiceConfig] = useState<{
    hasApiKey: boolean;
    defaultVoiceId: string;
    availableModels: { id: string; name: string }[];
  } | null>(null);
  const [voiceId, setVoiceId] = useState("");
  const [selectedModel, setSelectedModel] = useState("eleven_multilingual_v2");
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthError, setSynthError] = useState("");

  const authenticate = async () => {
    if (!adminKey) return;
    try {
      const res = await fetch("/api/micropod/stats", {
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("micropod_studio_key", adminKey);
        fetchData();
      }
    } catch (error) {
      console.error("Auth failed:", error);
    }
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${adminKey}`,
    "Content-Type": "application/json",
  });

  const getSessionToken = async (): Promise<string> => {
    const res = await fetch("/api/micropod/session-token", {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to get session token");
    const { token } = await res.json();
    return token;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [episodesRes, industriesRes, statsRes] = await Promise.all([
        fetch("/api/micropod/episodes", { headers: getAuthHeaders() }),
        fetch("/api/micropod/industries"),
        fetch("/api/micropod/stats", { headers: getAuthHeaders() }),
      ]);

      if (episodesRes.status === 401 || episodesRes.status === 403) {
        setIsAuthenticated(false);
        return;
      }

      setEpisodes(await episodesRes.json());
      setIndustries(await industriesRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoiceConfig = async () => {
    try {
      const res = await fetch("/api/micropod/voice-config", { headers: getAuthHeaders() });
      if (res.ok) {
        const config = await res.json();
        setVoiceConfig(config);
        if (config.defaultVoiceId && !voiceId) {
          setVoiceId(config.defaultVoiceId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch voice config:", error);
    }
  };

  const synthesizeAudio = async () => {
    if (!selectedEpisode) return;
    setSynthesizing(true);
    setSynthError("");
    try {
      const res = await fetch(`/api/micropod/episodes/${selectedEpisode.id}/synthesize`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          voiceId: voiceId || undefined,
          modelId: selectedModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSynthError(data.error || "Synthesis failed");
        return;
      }
      setSelectedEpisode(data.episode);
      fetchData();
    } catch (error) {
      console.error("Synthesis failed:", error);
      setSynthError("Audio synthesis request failed");
    } finally {
      setSynthesizing(false);
    }
  };

  const generateScript = async () => {
    setGenerating(true);
    setProgress([]);
    setLatestReview(null);

    try {
      const sessionToken = await getSessionToken();

      const createRes = await fetch("/api/micropod/episodes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: genTopic || "Generating...",
          targetLength: parseInt(genTargetLength),
          targetIndustryId: genIndustryId ? parseInt(genIndustryId) : undefined,
        }),
      });
      const newEpisode = await createRes.json();

      const params = new URLSearchParams();
      params.append("token", sessionToken);
      params.append("topic", genTopic);
      params.append("targetLength", genTargetLength);
      if (genIndustryId) params.append("industryId", genIndustryId);

      const eventSource = new EventSource(
        `/api/micropod/episodes/${newEpisode.id}/generate?${params.toString()}`
      );

      eventSource.addEventListener("progress", (e) => {
        const data = JSON.parse(e.data);
        setProgress((prev) => [...prev, data]);
        if (data.stage === "review_complete" && data.data) {
          setLatestReview(data.data);
        }
      });

      eventSource.addEventListener("complete", (e) => {
        const data = JSON.parse(e.data);
        setProgress((prev) => [...prev, { stage: "complete", message: "Script generated!" }]);
        if (data.review) setLatestReview(data.review);
        if (data.episode) setSelectedEpisode(data.episode);
        eventSource.close();
        setGenerating(false);
        fetchData();
        setActiveTab("episodes");
      });

      eventSource.addEventListener("error", () => {
        setProgress((prev) => [...prev, { stage: "error", message: "Generation failed" }]);
        eventSource.close();
        setGenerating(false);
      });
    } catch (error) {
      console.error("Failed to generate:", error);
      setGenerating(false);
    }
  };

  const deleteEpisode = async (id: number) => {
    try {
      await fetch(`/api/micropod/episodes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (selectedEpisode?.id === id) setSelectedEpisode(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const saveEpisodeEdits = async () => {
    if (!selectedEpisode) return;
    try {
      const res = await fetch(`/api/micropod/episodes/${selectedEpisode.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
          script: editedScript,
        }),
      });
      const updated = await res.json();
      setSelectedEpisode(updated);
      setIsEditing(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const viewEpisode = async (id: number) => {
    try {
      const res = await fetch(`/api/micropod/episodes/${id}`, {
        headers: getAuthHeaders(),
      });
      const episode = await res.json();
      setSelectedEpisode(episode);
      setEditedScript(episode.script || "");
      setEditedTitle(episode.title || "");
      setEditedDescription(episode.description || "");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to fetch episode:", error);
    }
  };

  const viewApprovalEpisode = async (id: number) => {
    try {
      const res = await fetch(`/api/micropod/episodes/${id}`, {
        headers: getAuthHeaders(),
      });
      const episode = await res.json();
      setApprovalEpisode(episode);
      setPublishError("");
    } catch (error) {
      console.error("Failed to fetch episode for approval:", error);
    }
  };

  const getQualityChecks = (ep: Episode) => [
    { key: "title", label: "Title present", passed: !!ep.title && ep.title.trim().length > 0 },
    { key: "description", label: "Description > 50 chars", passed: !!ep.description && ep.description.length > 50 },
    { key: "script", label: "Script > 500 words", passed: !!ep.script && ep.script.split(/\s+/).length > 500 },
    { key: "audio", label: "Audio generated", passed: !!ep.audioUrl },
    { key: "duration", label: "Duration > 0", passed: !!ep.audioDuration && ep.audioDuration > 0 },
    { key: "topics", label: "Topics assigned", passed: !!ep.topics && Array.isArray(ep.topics) && ep.topics.length > 0 },
    { key: "transcript", label: "Transcript present", passed: !!ep.transcript && ep.transcript.trim().length > 0 },
  ];

  const publishEpisode = async (force = false) => {
    if (!approvalEpisode) return;
    setPublishing(true);
    setPublishError("");
    try {
      const res = await fetch(`/api/micropod/episodes/${approvalEpisode.id}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error || "Failed to publish");
        return;
      }
      setApprovalEpisode(data.episode);
      fetchData();
    } catch (error) {
      console.error("Failed to publish:", error);
      setPublishError("Publish request failed");
    } finally {
      setPublishing(false);
    }
  };

  const approveEpisode = async () => {
    if (!approvalEpisode) return;
    try {
      const res = await fetch(`/api/micropod/episodes/${approvalEpisode.id}/approve`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setApprovalEpisode(data.episode);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("micropod_studio_key");
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchData();
      fetchVoiceConfig();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#12121f] border-white/10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <Mic className="text-purple-400" size={32} />
            </div>
            <CardTitle className="text-2xl text-white">MicroPod Studio</CardTitle>
            <CardDescription className="text-white/60">
              AI-powered podcast script generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && authenticate()}
              placeholder="Enter admin key"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
            />
            <Button onClick={authenticate} className="w-full bg-purple-600 hover:bg-purple-700">
              Access MicroPod Studio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "approved": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <>
      <SEO title="MicroPod Studio - Admin" noindex={true} />
      <div className="min-h-screen bg-[#0a0a12]">
        <header className="border-b border-white/10 bg-[#0a0a12]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mic className="text-purple-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MicroPod Studio</h1>
                <p className="text-xs text-white/50">AI Podcast Script Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
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
                  localStorage.removeItem("micropod_studio_key");
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
            <TabsList className="bg-[#1a1a2e] border border-white/10 mb-8 p-1">
              <TabsTrigger value="dashboard" className="text-white/60 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <BarChart3 className="mr-2 h-4 w-4" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="generate" className="text-white/60 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Sparkles className="mr-2 h-4 w-4" /> Generate
              </TabsTrigger>
              <TabsTrigger value="episodes" className="text-white/60 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <FileText className="mr-2 h-4 w-4" /> Episodes
                {stats && stats.drafts > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.drafts}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approval" className="text-white/60 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Shield className="mr-2 h-4 w-4" /> Approval
                {stats && (stats.drafts + stats.approved) > 0 && (
                  <span className="ml-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.drafts + stats.approved}</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-[#12121f] border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Total Episodes</p>
                        <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
                      </div>
                      <Mic className="text-purple-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#12121f] border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Drafts</p>
                        <p className="text-3xl font-bold text-amber-400">{stats?.drafts || 0}</p>
                      </div>
                      <FileText className="text-amber-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#12121f] border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Approved</p>
                        <p className="text-3xl font-bold text-blue-400">{stats?.approved || 0}</p>
                      </div>
                      <CheckCircle2 className="text-blue-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#12121f] border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-sm">Published</p>
                        <p className="text-3xl font-bold text-green-400">{stats?.published || 0}</p>
                      </div>
                      <Play className="text-green-400" size={32} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#12121f] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Episodes</CardTitle>
                </CardHeader>
                <CardContent>
                  {episodes.length === 0 ? (
                    <p className="text-white/40 text-center py-8">No episodes yet. Go to Generate to create your first script.</p>
                  ) : (
                    <div className="space-y-3">
                      {episodes.slice(0, 5).map((ep) => (
                        <div
                          key={ep.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                          onClick={() => { viewEpisode(ep.id); setActiveTab("episodes"); }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-white/30 text-sm font-mono">#{ep.episodeNumber || "—"}</span>
                            <div>
                              <p className="text-white font-medium">{ep.title}</p>
                              <p className="text-white/40 text-sm">{new Date(ep.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Badge className={statusColor(ep.status)}>{ep.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="generate">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-[#12121f] border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="text-purple-400" size={20} />
                      Generate Script
                    </CardTitle>
                    <CardDescription className="text-white/50">
                      Create a podcast script grounded in real pain points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Topic / Theme</label>
                      <Textarea
                        value={genTopic}
                        onChange={(e) => setGenTopic(e.target.value)}
                        placeholder="e.g., Why your best employee is your biggest risk"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
                      />
                    </div>

                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Target Length</label>
                      <Select value={genTargetLength} onValueChange={setGenTargetLength}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes (~750 words)</SelectItem>
                          <SelectItem value="7">7 minutes (~1,050 words)</SelectItem>
                          <SelectItem value="10">10 minutes (~1,500 words)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Target Industry (optional)</label>
                      <Select value={genIndustryId} onValueChange={setGenIndustryId}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="All industries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All industries</SelectItem>
                          {industries.map((ind) => (
                            <SelectItem key={ind.id} value={String(ind.id)}>
                              {ind.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={generateScript}
                      disabled={generating || !genTopic.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Script...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Podcast Script
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#12121f] border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="text-purple-400" size={20} />
                      Generation Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {progress.length === 0 ? (
                      <p className="text-white/40 text-center py-8">
                        Enter a topic and click Generate to start
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {progress.map((p, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                            {p.stage === "error" ? (
                              <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={16} />
                            ) : p.stage === "complete" ? (
                              <CheckCircle2 className="text-green-400 mt-0.5 shrink-0" size={16} />
                            ) : (
                              <Loader2 className="text-purple-400 mt-0.5 shrink-0 animate-spin" size={16} />
                            )}
                            <div>
                              <p className="text-white text-sm">{p.message}</p>
                              {p.stage === "review_complete" && p.data && (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                  <div className="bg-white/5 rounded p-2 text-center">
                                    <p className="text-white/40 text-xs">Overall</p>
                                    <p className="text-white font-bold">{p.data.overallScore}/100</p>
                                  </div>
                                  <div className="bg-white/5 rounded p-2 text-center">
                                    <p className="text-white/40 text-xs">Flow</p>
                                    <p className="text-white font-bold">{p.data.flowScore}/100</p>
                                  </div>
                                  <div className="bg-white/5 rounded p-2 text-center">
                                    <p className="text-white/40 text-xs">Voice</p>
                                    <p className="text-white font-bold">{p.data.voiceScore}/100</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="episodes">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-white/70 text-sm font-medium mb-2">All Episodes</h3>
                  {episodes.length === 0 ? (
                    <p className="text-white/40 text-center py-8">No episodes yet</p>
                  ) : (
                    episodes.map((ep) => (
                      <div
                        key={ep.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                          selectedEpisode?.id === ep.id
                            ? "bg-purple-500/10 border-purple-500/30"
                            : "bg-white/5 border-transparent hover:bg-white/10"
                        }`}
                        onClick={() => viewEpisode(ep.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/30 text-xs font-mono">#{ep.episodeNumber || "—"}</span>
                          <Badge className={`${statusColor(ep.status)} text-xs`}>{ep.status}</Badge>
                        </div>
                        <p className="text-white font-medium text-sm truncate">{ep.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-white/30 text-xs">{new Date(ep.createdAt).toLocaleDateString()}</span>
                          {ep.targetLength && (
                            <span className="text-white/30 text-xs">{ep.targetLength} min</span>
                          )}
                          {ep.audioUrl && (
                            <Volume2 size={12} className="text-green-400" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="lg:col-span-2">
                  {!selectedEpisode ? (
                    <Card className="bg-[#12121f] border-white/10">
                      <CardContent className="p-12 text-center">
                        <Mic className="mx-auto text-white/20 mb-4" size={48} />
                        <p className="text-white/40">Select an episode to view or edit</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-[#12121f] border-white/10">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            {isEditing ? (
                              <input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-lg font-bold"
                              />
                            ) : (
                              <CardTitle className="text-white text-lg">{selectedEpisode.title}</CardTitle>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={statusColor(selectedEpisode.status)}>{selectedEpisode.status}</Badge>
                              {selectedEpisode.targetLength && (
                                <span className="text-white/40 text-sm">{selectedEpisode.targetLength} min target</span>
                              )}
                              {selectedEpisode.script && (
                                <span className="text-white/40 text-sm">
                                  {selectedEpisode.script.split(/\s+/).length} words
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Button size="sm" onClick={saveEpisodeEdits} className="bg-green-600 hover:bg-green-700">
                                  <Save className="mr-1 h-4 w-4" /> Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setIsEditing(false)}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setIsEditing(true)}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <Edit className="mr-1 h-4 w-4" /> Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteEpisode(selectedEpisode.id)}
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-white/50 text-xs mb-1 block">Description</label>
                          {isEditing ? (
                            <Textarea
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                              className="bg-white/5 border-white/10 text-white min-h-[60px]"
                            />
                          ) : (
                            <p className="text-white/70 text-sm">{selectedEpisode.description || "No description"}</p>
                          )}
                        </div>

                        {selectedEpisode.topics && selectedEpisode.topics.length > 0 && (
                          <div>
                            <label className="text-white/50 text-xs mb-1 block">Topics</label>
                            <div className="flex flex-wrap gap-2">
                              {selectedEpisode.topics.map((t, i) => (
                                <Badge key={i} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-white/50 text-xs mb-1 block">Script</label>
                          {isEditing ? (
                            <Textarea
                              value={editedScript}
                              onChange={(e) => setEditedScript(e.target.value)}
                              className="bg-white/5 border-white/10 text-white min-h-[400px] font-mono text-sm"
                            />
                          ) : selectedEpisode.script ? (
                            <div className="bg-white/5 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                              <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                                {selectedEpisode.script}
                              </pre>
                            </div>
                          ) : (
                            <p className="text-white/40 text-sm">No script generated yet</p>
                          )}
                        </div>

                        {selectedEpisode.audioUrl && (
                          <div>
                            <label className="text-white/50 text-xs mb-2 block flex items-center gap-1.5">
                              <Volume2 size={12} /> Audio Preview
                            </label>
                            <div className="bg-white/5 rounded-lg p-4">
                              <audio
                                controls
                                className="w-full"
                                src={selectedEpisode.audioUrl}
                                key={selectedEpisode.audioUrl}
                              />
                              <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                                {selectedEpisode.audioDuration && (
                                  <span>{Math.floor(selectedEpisode.audioDuration / 60)}:{String(selectedEpisode.audioDuration % 60).padStart(2, '0')} estimated</span>
                                )}
                                <span>{selectedEpisode.audioUrl.split('/').pop()}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedEpisode.script && (
                          <div className="border-t border-white/10 pt-4">
                            <label className="text-white/50 text-xs mb-3 block flex items-center gap-1.5">
                              <Settings size={12} /> Voice Synthesis
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="text-white/40 text-xs mb-1 block">Voice ID</label>
                                <input
                                  value={voiceId}
                                  onChange={(e) => setVoiceId(e.target.value)}
                                  placeholder={voiceConfig?.defaultVoiceId || "Enter ElevenLabs Voice ID"}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
                                />
                              </div>
                              <div>
                                <label className="text-white/40 text-xs mb-1 block">Model</label>
                                <Select value={selectedModel} onValueChange={setSelectedModel}>
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(voiceConfig?.availableModels || [
                                      { id: "eleven_multilingual_v2", name: "Multilingual v2 (Recommended)" },
                                      { id: "eleven_monolingual_v1", name: "English v1" },
                                      { id: "eleven_turbo_v2_5", name: "Turbo v2.5 (Faster)" },
                                      { id: "eleven_turbo_v2", name: "Turbo v2 (Fastest)" },
                                    ]).map((m) => (
                                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {!voiceConfig?.hasApiKey && (
                              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-3">
                                <p className="text-amber-400 text-xs">ELEVENLABS_API_KEY is not configured. Add it to your environment secrets.</p>
                              </div>
                            )}

                            {synthError && (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                                <p className="text-red-400 text-xs">{synthError}</p>
                              </div>
                            )}

                            <Button
                              onClick={synthesizeAudio}
                              disabled={synthesizing || !voiceConfig?.hasApiKey}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              {synthesizing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Synthesizing Audio...
                                </>
                              ) : selectedEpisode.audioUrl ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Regenerate Audio
                                </>
                              ) : (
                                <>
                                  <Volume2 className="mr-2 h-4 w-4" />
                                  Generate Audio
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="approval">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-white/70 text-sm font-medium mb-2">Draft & Approved Queue</h3>
                  {episodes.filter((ep) => ep.status === "draft" || ep.status === "approved").length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="mx-auto text-white/20 mb-3" size={32} />
                      <p className="text-white/40 text-sm">No episodes awaiting approval</p>
                    </div>
                  ) : (
                    episodes
                      .filter((ep) => ep.status === "draft" || ep.status === "approved")
                      .map((ep) => {
                        const checks = getQualityChecks(ep);
                        const passedCount = checks.filter((c) => c.passed).length;
                        return (
                          <div
                            key={ep.id}
                            className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                              approvalEpisode?.id === ep.id
                                ? "bg-purple-500/10 border-purple-500/30"
                                : "bg-white/5 border-transparent hover:bg-white/10"
                            }`}
                            onClick={() => viewApprovalEpisode(ep.id)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white/30 text-xs font-mono">#{ep.episodeNumber || "—"}</span>
                              <Badge className={`${statusColor(ep.status)} text-xs`}>{ep.status}</Badge>
                            </div>
                            <p className="text-white font-medium text-sm truncate">{ep.title}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-white/30 text-xs">{new Date(ep.createdAt).toLocaleDateString()}</span>
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${passedCount === checks.length ? "bg-green-400" : passedCount >= 5 ? "bg-amber-400" : "bg-red-400"}`} />
                                <span className="text-white/40 text-xs">{passedCount}/{checks.length}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                <div className="lg:col-span-2">
                  {!approvalEpisode ? (
                    <Card className="bg-[#12121f] border-white/10">
                      <CardContent className="p-12 text-center">
                        <Shield className="mx-auto text-white/20 mb-4" size={48} />
                        <p className="text-white/40">Select an episode from the queue to review</p>
                      </CardContent>
                    </Card>
                  ) : (() => {
                    const checks = getQualityChecks(approvalEpisode);
                    const passedCount = checks.filter((c) => c.passed).length;
                    const allPassed = passedCount === checks.length;
                    const wordCount = approvalEpisode.script ? approvalEpisode.script.split(/\s+/).length : 0;

                    return (
                      <div className="space-y-6">
                        <Card className="bg-[#12121f] border-white/10">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-white text-lg">{approvalEpisode.title}</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={statusColor(approvalEpisode.status)}>{approvalEpisode.status}</Badge>
                                  {approvalEpisode.targetLength && (
                                    <span className="text-white/40 text-sm">{approvalEpisode.targetLength} min target</span>
                                  )}
                                  <span className="text-white/40 text-sm">{wordCount} words</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEpisode(approvalEpisode);
                                  setEditedScript(approvalEpisode.script || "");
                                  setEditedTitle(approvalEpisode.title || "");
                                  setEditedDescription(approvalEpisode.description || "");
                                  setIsEditing(true);
                                  setActiveTab("episodes");
                                }}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Edit className="mr-1 h-4 w-4" /> Edit Script
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-6">
                              <h4 className="text-white/70 text-sm font-medium mb-3">Quality Checklist</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {checks.map((check) => (
                                  <div
                                    key={check.key}
                                    className={`flex items-center gap-2 p-3 rounded-lg border ${
                                      check.passed
                                        ? "bg-green-500/5 border-green-500/20"
                                        : "bg-red-500/5 border-red-500/20"
                                    }`}
                                  >
                                    {check.passed ? (
                                      <CheckCircle2 className="text-green-400 shrink-0" size={16} />
                                    ) : (
                                      <XCircle className="text-red-400 shrink-0" size={16} />
                                    )}
                                    <span className={`text-sm ${check.passed ? "text-green-300" : "text-red-300"}`}>
                                      {check.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <div className="flex-1 bg-white/10 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      allPassed ? "bg-green-500" : passedCount >= 5 ? "bg-amber-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${(passedCount / checks.length) * 100}%` }}
                                  />
                                </div>
                                <span className="text-white/50 text-xs">{passedCount}/{checks.length}</span>
                              </div>
                            </div>

                            {approvalEpisode.description && (
                              <div className="mb-4">
                                <label className="text-white/50 text-xs mb-1 block">Description</label>
                                <p className="text-white/70 text-sm">{approvalEpisode.description}</p>
                              </div>
                            )}

                            {approvalEpisode.topics && approvalEpisode.topics.length > 0 && (
                              <div className="mb-4">
                                <label className="text-white/50 text-xs mb-1 block">Topics</label>
                                <div className="flex flex-wrap gap-2">
                                  {approvalEpisode.topics.map((t, i) => (
                                    <Badge key={i} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                                      {t}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {approvalEpisode.script && (
                              <div className="mb-4">
                                <label className="text-white/50 text-xs mb-1 block">Script Preview</label>
                                <div className="bg-white/5 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                                  <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                                    {approvalEpisode.script}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {approvalEpisode.audioUrl && (
                              <div className="mb-4">
                                <label className="text-white/50 text-xs mb-2 block flex items-center gap-1.5">
                                  <Volume2 size={12} /> Audio Preview
                                </label>
                                <div className="bg-white/5 rounded-lg p-4">
                                  <audio
                                    controls
                                    className="w-full"
                                    src={approvalEpisode.audioUrl}
                                    key={approvalEpisode.audioUrl}
                                  />
                                  {approvalEpisode.audioDuration && (
                                    <p className="text-white/40 text-xs mt-2">
                                      {Math.floor(approvalEpisode.audioDuration / 60)}:{String(approvalEpisode.audioDuration % 60).padStart(2, '0')} estimated
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {publishError && (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                                <p className="text-red-400 text-sm">{publishError}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                              {approvalEpisode.status === "draft" && (
                                <Button
                                  onClick={approveEpisode}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Approve
                                </Button>
                              )}
                              <Button
                                onClick={() => publishEpisode(false)}
                                disabled={publishing || approvalEpisode.status === "published"}
                                className={`${
                                  allPassed
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-amber-600 hover:bg-amber-700"
                                } text-white`}
                              >
                                {publishing ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing...
                                  </>
                                ) : (
                                  <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Approve & Publish
                                  </>
                                )}
                              </Button>
                              {!allPassed && approvalEpisode.status !== "published" && (
                                <Button
                                  variant="outline"
                                  onClick={() => publishEpisode(true)}
                                  disabled={publishing}
                                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                >
                                  Force Publish
                                </Button>
                              )}
                              {approvalEpisode.status === "published" && (
                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                  <CheckCircle2 size={16} />
                                  Published {approvalEpisode.publishedAt ? `on ${new Date(approvalEpisode.publishedAt).toLocaleDateString()}` : ""}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
