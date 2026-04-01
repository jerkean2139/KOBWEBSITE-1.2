import { useState, useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Youtube, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Plus,
  Eye,
  Edit,
  Send,
  RefreshCw,
  BarChart3,
  Lightbulb,
  Zap,
  Copy,
  Check,
  RefreshCcw,
  X,
  Image as ImageIcon,
  Save,
  Mail,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  CircleDot,
  ExternalLink
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  youtubeChannels: number;
  contentTopics: number;
  pillarDistribution?: Record<string, number>;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  status: string;
  category: string | null;
  pillar: string | null;
  wordCount: number | null;
  createdAt: string;
  publishedAt: string | null;
  content?: string;
  htmlContent?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  tags?: string[];
  aiReview?: AIReview | string | null;
  seoScore?: number | null;
  readabilityScore?: number | null;
  authorName?: string | null;
  authorTitle?: string | null;
  faqs?: string | null;
  structuredData?: string | null;
}

interface Topic {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  priority: number;
  isActive: boolean;
}

interface Channel {
  id: number;
  channelId: string;
  channelName: string;
  channelUrl: string;
  category: string | null;
  isActive: boolean;
}

interface GenerationProgress {
  stage: string;
  message: string;
  data?: any;
}

interface AIReview {
  overallScore: number;
  copyScore: number;
  seoScore: number;
  imageScore: number;
  suggestions: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    issue: string;
    suggestion: string;
  }>;
  improvedTitle?: string;
  improvedMetaDescription?: string;
  improvedImagePrompt?: string;
}

type ImageProvider = "gemini" | "leonardo" | "replicate";
type PostLength = "short" | "medium" | "long";
type PostStyle = "educational" | "story" | "tactical";
type PostAuthor = "jeremy" | "michelle" | "marcus" | "sarah";
type PostPillar = "pain" | "hope" | "philosophy" | "proof" | "vision";

const AUTHOR_OPTIONS = [
  { value: "jeremy", label: "Jeremy Kean", title: "Business Coach & Automation Strategist" },
  { value: "michelle", label: "Michelle Davis", title: "Team Performance Coach" },
  { value: "marcus", label: "Marcus Rivera", title: "Operations & Productivity Coach" },
  { value: "sarah", label: "Sarah Chen", title: "AI Tools & Automation Specialist" },
];

const LENGTH_OPTIONS = [
  { value: "short", label: "Short (~800 words)", description: "Quick read, focused insight" },
  { value: "medium", label: "Medium (~1,200 words)", description: "Standard blog post" },
  { value: "long", label: "Long (~2,000 words)", description: "In-depth guide" },
];

const STYLE_OPTIONS = [
  { value: "educational", label: "Educational", description: "Teach a concept clearly" },
  { value: "story", label: "Story-Driven", description: "Lead with narrative" },
  { value: "tactical", label: "Tactical How-To", description: "Step-by-step actionable" },
];

const PILLAR_OPTIONS = [
  { value: "pain", label: "Pain", color: "bg-red-500" },
  { value: "hope", label: "Hope", color: "bg-amber-500" },
  { value: "philosophy", label: "Philosophy", color: "bg-violet-600" },
  { value: "proof", label: "Proof", color: "bg-emerald-500" },
  { value: "vision", label: "Vision", color: "bg-blue-500" },
];

export default function ContentStudio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedImageProvider, setSelectedImageProvider] = useState<ImageProvider>("gemini");
  const [selectedAuthor, setSelectedAuthor] = useState<PostAuthor>("jeremy");
  const [selectedLength, setSelectedLength] = useState<PostLength>("medium");
  const [selectedStyle, setSelectedStyle] = useState<PostStyle>("educational");
  const [selectedPillar, setSelectedPillar] = useState<PostPillar>("pain");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [industries, setIndustries] = useState<Array<{ id: number; name: string; slug: string }>>([]);
  const [progress, setProgress] = useState<GenerationProgress[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [latestReview, setLatestReview] = useState<AIReview | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedMeta, setEditedMeta] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [remixing, setRemixing] = useState<"content" | "image" | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [pillarFilter, setPillarFilter] = useState<string>("all");
  const [approvalPost, setApprovalPost] = useState<BlogPost | null>(null);
  const [approvalChecklist, setApprovalChecklist] = useState<Record<string, boolean>>({});
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const authenticate = async () => {
    if (adminKey) {
      try {
        const res = await fetch("/api/content-studio/stats", {
          headers: { Authorization: `Bearer ${adminKey}` },
        });
        if (res.ok) {
          setIsAuthenticated(true);
          fetchData();
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    }
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${adminKey}`,
    "Content-Type": "application/json",
  });

  const getSessionToken = async (): Promise<string> => {
    const res = await fetch("/api/content-studio/session-token", {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to get session token");
    }
    const { token } = await res.json();
    return token;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, postsRes, topicsRes, channelsRes, industriesRes] = await Promise.all([
        fetch("/api/content-studio/stats", { headers: getAuthHeaders() }),
        fetch("/api/content-studio/blog-posts", { headers: getAuthHeaders() }),
        fetch("/api/content-studio/topics", { headers: getAuthHeaders() }),
        fetch("/api/content-studio/channels", { headers: getAuthHeaders() }),
        fetch("/api/pain-points/industries"),
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        setIsAuthenticated(false);
        return;
      }

      const statsData = await statsRes.json();
      const postsData = await postsRes.json();
      const topicsData = await topicsRes.json();
      const channelsData = await channelsRes.json();
      const industriesData = await industriesRes.json();

      setStats(statsData);
      setPosts(Array.isArray(postsData) ? postsData : []);
      setTopics(Array.isArray(topicsData) ? topicsData : []);
      setChannels(Array.isArray(channelsData) ? channelsData : []);
      setIndustries(Array.isArray(industriesData) ? industriesData : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAndGeneratePost = async () => {
    setGenerating(true);
    setProgress([]);
    setLatestReview(null);
    
    try {
      // Get session token for SSE authentication
      const sessionToken = await getSessionToken();
      
      const createRes = await fetch("/api/content-studio/blog-posts", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: "Generating..." }),
      });
      const newPost = await createRes.json();
      
      const params = new URLSearchParams();
      params.append("token", sessionToken);
      if (selectedTopic) params.append("topicId", selectedTopic);
      params.append("imageProvider", selectedImageProvider);
      params.append("author", selectedAuthor);
      params.append("length", selectedLength);
      params.append("style", selectedStyle);
      params.append("pillar", selectedPillar);
      if (selectedIndustry) params.append("targetIndustry", selectedIndustry);
      
      const queryString = `?${params.toString()}`;
      const eventSource = new EventSource(
        `/api/content-studio/blog-posts/${newPost.id}/generate${queryString}`
      );

      eventSource.addEventListener("progress", (e) => {
        const data = JSON.parse(e.data);
        setProgress(prev => [...prev, data]);
        
        // Capture AI review data when available
        if (data.stage === "review_complete" && data.data) {
          setLatestReview(data.data);
        }
      });

      eventSource.addEventListener("complete", (e) => {
        const data = JSON.parse(e.data);
        setProgress(prev => [...prev, { stage: "complete", message: "Blog post generated and reviewed!" }]);
        if (data.review) {
          setLatestReview(data.review);
        }
        eventSource.close();
        setGenerating(false);
        fetchData();
      });

      eventSource.addEventListener("error", (e) => {
        setProgress(prev => [...prev, { stage: "error", message: "Generation failed" }]);
        eventSource.close();
        setGenerating(false);
      });

    } catch (error) {
      console.error("Failed to generate:", error);
      setGenerating(false);
    }
  };

  const publishPost = async (postId: number) => {
    try {
      await fetch(`/api/content-studio/blog-posts/${postId}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to publish:", error);
    }
  };

  const parseAiReview = (post: BlogPost): AIReview | null => {
    if (!post.aiReview) return null;
    if (typeof post.aiReview === "string") {
      try { return JSON.parse(post.aiReview); } catch { return null; }
    }
    return post.aiReview as AIReview;
  };

  const loadPostForApproval = async (postId: number) => {
    setLoadingApproval(true);
    try {
      const res = await fetch(`/api/content-studio/blog-posts/${postId}`, {
        headers: getAuthHeaders(),
      });
      const post = await res.json();
      setApprovalPost(post);
      const checklist: Record<string, boolean> = {
        hasTitle: !!(post.title && post.title !== "Untitled Draft" && post.title !== "Generating..."),
        hasContent: !!(post.content && post.content.trim().length > 100),
        hasMeta: !!(post.metaDescription && post.metaDescription.trim().length > 50),
        hasImage: !!post.featuredImage,
        hasTags: !!(post.tags && post.tags.length > 0),
        hasPillar: !!post.pillar,
        hasMinWords: (post.wordCount || 0) >= 500,
        hasAiReview: !!post.aiReview,
      };
      setApprovalChecklist(checklist);
    } catch (error) {
      console.error("Failed to load post for approval:", error);
    } finally {
      setLoadingApproval(false);
    }
  };

  const approveAndPublish = async (postId: number) => {
    setPublishing(true);
    try {
      await fetch(`/api/content-studio/blog-posts/${postId}/publish`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      setApprovalPost(null);
      setApprovalChecklist({});
      fetchData();
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setPublishing(false);
    }
  };

  const sendBackToDraft = async (postId: number) => {
    setApprovalPost(null);
    setApprovalChecklist({});
    viewPost(postId);
    setIsEditing(true);
  };

  const viewPost = async (postId: number) => {
    setLoadingPost(true);
    try {
      const res = await fetch(`/api/content-studio/blog-posts/${postId}`, {
        headers: getAuthHeaders(),
      });
      const post = await res.json();
      setSelectedPost(post);
      setEditedContent(post.content || "");
      setEditedTitle(post.title || "");
      setEditedMeta(post.metaDescription || "");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoadingPost(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const savePostEdits = async () => {
    if (!selectedPost) return;
    try {
      await fetch(`/api/content-studio/blog-posts/${selectedPost.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          metaDescription: editedMeta,
        }),
      });
      // Refetch the full post to get all fields properly synced
      const refetchRes = await fetch(`/api/content-studio/blog-posts/${selectedPost.id}`, {
        headers: getAuthHeaders(),
      });
      const fullPost = await refetchRes.json();
      setSelectedPost(fullPost);
      setEditedContent(fullPost.content || "");
      setEditedTitle(fullPost.title || "");
      setEditedMeta(fullPost.metaDescription || "");
      setIsEditing(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const remixContent = async () => {
    if (!selectedPost) return;
    setRemixing("content");
    setProgress([]);
    try {
      const sessionToken = await getSessionToken();
      const eventSource = new EventSource(
        `/api/content-studio/blog-posts/${selectedPost.id}/remix?type=content&imageProvider=${selectedImageProvider}&token=${encodeURIComponent(sessionToken)}`
      );

      eventSource.addEventListener("progress", (e) => {
        const data = JSON.parse(e.data);
        setProgress(prev => [...prev, data]);
      });

      eventSource.addEventListener("complete", (e) => {
        const data = JSON.parse(e.data);
        if (data.post) {
          setSelectedPost(data.post);
          setEditedContent(data.post.content || "");
          setEditedTitle(data.post.title || "");
          setEditedMeta(data.post.metaDescription || "");
        }
        eventSource.close();
        setRemixing(null);
        fetchData();
      });

      eventSource.addEventListener("error", () => {
        eventSource.close();
        setRemixing(null);
      });
    } catch (error) {
      console.error("Remix failed:", error);
      setRemixing(null);
    }
  };

  const remixImage = async () => {
    if (!selectedPost) return;
    setRemixing("image");
    setProgress([]);
    try {
      const sessionToken = await getSessionToken();
      const eventSource = new EventSource(
        `/api/content-studio/blog-posts/${selectedPost.id}/remix?type=image&imageProvider=${selectedImageProvider}&token=${encodeURIComponent(sessionToken)}`
      );

      eventSource.addEventListener("progress", (e) => {
        const data = JSON.parse(e.data);
        setProgress(prev => [...prev, data]);
      });

      eventSource.addEventListener("complete", (e) => {
        const data = JSON.parse(e.data);
        if (data.post) {
          setSelectedPost(data.post);
        }
        eventSource.close();
        setRemixing(null);
        fetchData();
      });

      eventSource.addEventListener("error", () => {
        eventSource.close();
        setRemixing(null);
      });
    } catch (error) {
      console.error("Remix failed:", error);
      setRemixing(null);
    }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("content_studio_key");
    if (savedKey) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#12121f] border-white/10">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-primary" size={32} />
            </div>
            <CardTitle className="text-2xl text-white">Content Studio</CardTitle>
            <CardDescription className="text-white/60">
              AI-powered blog and newsletter automation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && authenticate()}
              placeholder="Enter admin key"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
            />
            <Button onClick={authenticate} className="w-full bg-primary hover:bg-primary/90">
              Access Content Studio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO title="Content Studio - Admin" noindex={true} />
      <div className="min-h-screen bg-[#0a0a12]">
        <header className="border-b border-white/10 bg-[#0a0a12]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Sparkles className="text-primary" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Content Studio</h1>
              <p className="text-xs text-white/50">AI-Powered Content Automation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/newsletter">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <Mail className="mr-2 h-4 w-4" />
                Newsletter Creator
              </Button>
            </a>
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
            <TabsTrigger value="dashboard" className="text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white">
              <BarChart3 className="mr-2 h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="generate" className="text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Sparkles className="mr-2 h-4 w-4" /> Generate
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="mr-2 h-4 w-4" /> Posts
            </TabsTrigger>
            <TabsTrigger value="topics" className="text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Lightbulb className="mr-2 h-4 w-4" /> Topics
            </TabsTrigger>
            <TabsTrigger value="channels" className="text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Youtube className="mr-2 h-4 w-4" /> Channels
            </TabsTrigger>
            <TabsTrigger value="approve" className="text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShieldCheck className="mr-2 h-4 w-4" /> Approve
              {stats && stats.draftPosts > 0 && (
                <span className="ml-1.5 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.draftPosts}</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="bg-[#12121f] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/50 text-sm">Total Posts</p>
                      <p className="text-3xl font-bold text-white">{stats?.totalPosts || 0}</p>
                    </div>
                    <FileText className="text-primary" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#12121f] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/50 text-sm">Published</p>
                      <p className="text-3xl font-bold text-green-400">{stats?.publishedPosts || 0}</p>
                    </div>
                    <CheckCircle2 className="text-green-400" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#12121f] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/50 text-sm">Drafts</p>
                      <p className="text-3xl font-bold text-yellow-400">{stats?.draftPosts || 0}</p>
                    </div>
                    <Clock className="text-yellow-400" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#12121f] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/50 text-sm">Topics</p>
                      <p className="text-3xl font-bold text-purple-400">{stats?.contentTopics || 0}</p>
                    </div>
                    <Lightbulb className="text-purple-400" size={32} />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#12121f] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/50 text-sm">Channels</p>
                      <p className="text-3xl font-bold text-red-400">{stats?.youtubeChannels || 0}</p>
                    </div>
                    <Youtube className="text-red-400" size={32} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {stats?.pillarDistribution && (
              <Card className="bg-[#12121f] border-white/10 mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="text-primary" size={20} />
                    Topic Cluster Distribution
                  </CardTitle>
                  <CardDescription className="text-white/50">Posts per pillar hub — balance your content across all clusters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {PILLAR_OPTIONS.map(pillar => {
                      const count = stats.pillarDistribution?.[pillar.value] || 0;
                      const total = stats.totalPosts || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={pillar.value} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-3 h-3 rounded-full ${pillar.color}`}></span>
                            <span className="text-white/80 text-xs font-medium truncate">{pillar.label}</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{count}</p>
                          <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                            <div className={`${pillar.color} h-1.5 rounded-full transition-all`} style={{ width: `${Math.max(pct, 2)}%` }}></div>
                          </div>
                          <p className="text-white/40 text-xs mt-1">{pct}% of content</p>
                        </div>
                      );
                    })}
                  </div>
                  {(() => {
                    const unassigned = stats.pillarDistribution?.["unassigned"] || 0;
                    return unassigned > 0 ? (
                      <p className="text-yellow-400/70 text-xs mt-3">
                        {unassigned} post{unassigned > 1 ? "s" : ""} not assigned to any pillar
                      </p>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#12121f] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="text-primary" size={20} />
                    Recent Drafts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {posts.filter(p => p.status === "draft").slice(0, 5).length === 0 ? (
                    <p className="text-white/50 text-center py-8">No drafts yet. Generate your first post!</p>
                  ) : (
                    <div className="space-y-3">
                      {posts.filter(p => p.status === "draft").slice(0, 5).map(post => (
                        <div key={post.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-white font-medium truncate">{post.title}</p>
                              <p className="text-white/50 text-xs mt-1">
                                {post.wordCount ? `${post.wordCount} words • ` : ""}
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => publishPost(post.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Publish
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#12121f] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="text-[#FFD700]" size={20} />
                    Quick Generate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a topic (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10">
                      {topics.map(topic => (
                        <SelectItem key={topic.id} value={topic.id.toString()} className="text-white">
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-3">
                    <Select value={selectedAuthor} onValueChange={(v) => setSelectedAuthor(v as PostAuthor)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Author" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {AUTHOR_OPTIONS.map(author => (
                          <SelectItem key={author.value} value={author.value} className="text-white">
                            <span className="flex flex-col">
                              <span>{author.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedPillar} onValueChange={(v) => setSelectedPillar(v as PostPillar)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Pillar" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {PILLAR_OPTIONS.map(pillar => (
                          <SelectItem key={pillar.value} value={pillar.value} className="text-white">
                            <span className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${pillar.color}`}></span>
                              {pillar.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Select value={selectedLength} onValueChange={(v) => setSelectedLength(v as PostLength)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Length" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {LENGTH_OPTIONS.map(length => (
                          <SelectItem key={length.value} value={length.value} className="text-white">
                            {length.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedStyle} onValueChange={(v) => setSelectedStyle(v as PostStyle)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Style" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {STYLE_OPTIONS.map(style => (
                          <SelectItem key={style.value} value={style.value} className="text-white">
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Select value={selectedImageProvider} onValueChange={(v) => setSelectedImageProvider(v as ImageProvider)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select image provider" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10">
                      <SelectItem value="gemini" className="text-white">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Gemini Nano Banana
                        </span>
                      </SelectItem>
                      <SelectItem value="leonardo" className="text-white">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          Leonardo Kino XL
                        </span>
                      </SelectItem>
                      <SelectItem value="replicate" className="text-white">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          Replicate Flux LORA
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={createAndGeneratePost}
                    disabled={generating}
                    className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate New Post
                      </>
                    )}
                  </Button>
                  
                  {progress.length > 0 && (
                    <div className="mt-4 p-4 bg-black/30 rounded-lg border border-white/10 max-h-48 overflow-y-auto">
                      {progress.map((p, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm mb-2">
                          {p.stage === "complete" ? (
                            <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={14} />
                          ) : p.stage === "error" ? (
                            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={14} />
                          ) : p.stage === "review_complete" ? (
                            <CheckCircle2 className="text-[#FFD700] shrink-0 mt-0.5" size={14} />
                          ) : (
                            <Loader2 className="text-primary animate-spin shrink-0 mt-0.5" size={14} />
                          )}
                          <span className="text-white/70">{p.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {latestReview && (
                    <div className="mt-4 p-4 bg-black/30 rounded-lg border border-[#FFD700]/30">
                      <h4 className="text-[#FFD700] font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb size={16} />
                        AI Review Score: {latestReview.overallScore}/100
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-2 bg-white/5 rounded">
                          <p className="text-xs text-white/50">Copy</p>
                          <p className={`text-lg font-bold ${latestReview.copyScore >= 80 ? 'text-green-400' : latestReview.copyScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {latestReview.copyScore}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                          <p className="text-xs text-white/50">SEO</p>
                          <p className={`text-lg font-bold ${latestReview.seoScore >= 80 ? 'text-green-400' : latestReview.seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {latestReview.seoScore}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                          <p className="text-xs text-white/50">Image</p>
                          <p className={`text-lg font-bold ${latestReview.imageScore >= 80 ? 'text-green-400' : latestReview.imageScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {latestReview.imageScore}
                          </p>
                        </div>
                      </div>
                      {latestReview.suggestions?.filter(s => s.priority === "high").length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-white/50 uppercase">High Priority Suggestions</p>
                          {latestReview.suggestions.filter(s => s.priority === "high").slice(0, 3).map((s, i) => (
                            <div key={i} className="text-xs p-2 bg-red-500/10 border border-red-500/20 rounded">
                              <p className="text-white/80">{s.suggestion}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generate">
            <Card className="bg-[#12121f] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Generate New Blog Post</CardTitle>
                <CardDescription className="text-white/60">
                  Configure your content cluster, author, and style — AI handles the rest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-white/80 text-sm mb-3 block font-medium">Content Pillar</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {PILLAR_OPTIONS.map(pillar => {
                      const count = stats?.pillarDistribution?.[pillar.value] || 0;
                      const isSelected = selectedPillar === pillar.value;
                      return (
                        <button
                          key={pillar.value}
                          onClick={() => setSelectedPillar(pillar.value as PostPillar)}
                          className={`p-3 rounded-lg border text-left transition-all ${isSelected ? `${pillar.color} border-white/30 text-white ring-2 ring-white/20` : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}
                        >
                          <span className="text-sm font-medium block">{pillar.label}</span>
                          <span className={`text-xs ${isSelected ? "text-white/80" : "text-white/40"}`}>{count} post{count !== 1 ? "s" : ""}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Content Topic (optional)</label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Auto-generate from pillar" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {topics.map(topic => (
                          <SelectItem key={topic.id} value={topic.id.toString()} className="text-white">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                              {topic.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Target Industry (optional)</label>
                    <Select value={selectedIndustry} onValueChange={(v) => setSelectedIndustry(v === "none" ? "" : v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Auto-match from pillar" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        <SelectItem value="none" className="text-white/60">
                          Auto-match from pillar
                        </SelectItem>
                        {industries.map(industry => (
                          <SelectItem key={industry.id} value={industry.slug} className="text-white">
                            {industry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Author</label>
                    <Select value={selectedAuthor} onValueChange={(v) => setSelectedAuthor(v as PostAuthor)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Author" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {AUTHOR_OPTIONS.map(author => (
                          <SelectItem key={author.value} value={author.value} className="text-white">
                            {author.label} — {author.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Length</label>
                    <Select value={selectedLength} onValueChange={(v) => setSelectedLength(v as PostLength)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Length" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {LENGTH_OPTIONS.map(length => (
                          <SelectItem key={length.value} value={length.value} className="text-white">
                            {length.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Style</label>
                    <Select value={selectedStyle} onValueChange={(v) => setSelectedStyle(v as PostStyle)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Style" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {STYLE_OPTIONS.map(style => (
                          <SelectItem key={style.value} value={style.value} className="text-white">
                            {style.label} — {style.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-2 block">Image Provider</label>
                    <Select value={selectedImageProvider} onValueChange={(v) => setSelectedImageProvider(v as ImageProvider)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Image provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        <SelectItem value="gemini" className="text-white">
                          Gemini Nano Banana
                        </SelectItem>
                        <SelectItem value="leonardo" className="text-white">
                          Leonardo Kino XL
                        </SelectItem>
                        <SelectItem value="replicate" className="text-white">
                          Replicate Flux LORA
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={createAndGeneratePost}
                  disabled={generating}
                  size="lg"
                  className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Blog Post...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Blog Post
                    </>
                  )}
                </Button>

                {progress.length > 0 && (
                  <div className="p-6 bg-black/30 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-4">Generation Progress</h3>
                    <div className="space-y-3">
                      {progress.map((p, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {p.stage === "complete" ? (
                            <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={18} />
                          ) : p.stage === "error" ? (
                            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                          ) : (
                            <Loader2 className="text-primary animate-spin shrink-0 mt-0.5" size={18} />
                          )}
                          <div>
                            <p className="text-white">{p.message}</p>
                            {p.data?.title && (
                              <p className="text-primary text-sm mt-1">"{p.data.title}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <Card className="bg-[#12121f] border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Blog Posts</CardTitle>
                    <CardDescription className="text-white/60">
                      Manage your generated blog posts
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setActiveTab("generate")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Post
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setPillarFilter("all")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${pillarFilter === "all" ? "bg-primary text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                  >
                    All Posts
                  </button>
                  {PILLAR_OPTIONS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setPillarFilter(p.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${pillarFilter === p.value ? `${p.color} text-white` : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${pillarFilter === p.value ? "bg-white/80" : p.color}`}></span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-white/20 mb-4" size={48} />
                    <p className="text-white/50">No blog posts yet</p>
                    <Button
                      onClick={() => setActiveTab("generate")}
                      className="mt-4 bg-primary hover:bg-primary/90"
                    >
                      Generate Your First Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {posts
                      .filter(post => pillarFilter === "all" || post.pillar === pillarFilter)
                      .map(post => {
                        const pillarOption = PILLAR_OPTIONS.find(p => p.value === post.pillar);
                        return (
                      <div key={post.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant={post.status === "published" ? "default" : "secondary"}
                                className={post.status === "published" ? "bg-green-600" : "bg-yellow-600"}
                              >
                                {post.status}
                              </Badge>
                              {pillarOption && (
                                <Badge variant="outline" className={`text-xs border-white/20`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${pillarOption.color} mr-1.5 inline-block`}></span>
                                  {pillarOption.label}
                                </Badge>
                              )}
                              {post.category && !pillarOption && (
                                <Badge variant="outline" className="text-white/60 border-white/20">
                                  {post.category}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-white font-medium">{post.title}</h3>
                            <p className="text-white/50 text-sm mt-1">
                              {post.wordCount ? `${post.wordCount} words • ` : ""}
                              Created {new Date(post.createdAt).toLocaleDateString()}
                              {post.publishedAt && ` • Published ${new Date(post.publishedAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => viewPost(post.id)}
                              className="text-white/60 hover:text-white"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => {
                                viewPost(post.id);
                                setTimeout(() => setIsEditing(true), 100);
                              }}
                              className="text-white/60 hover:text-white"
                            >
                              <Edit size={16} />
                            </Button>
                            {post.status === "draft" && (
                              <Button
                                size="sm"
                                onClick={() => publishPost(post.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Publish
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <Card className="bg-[#12121f] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Content Topics</CardTitle>
                <CardDescription className="text-white/60">
                  Topics that guide AI content generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topics.map(topic => (
                    <div key={topic.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-primary border-primary/30">
                              {topic.category}
                            </Badge>
                            <span className="text-white/40 text-xs">Priority: {topic.priority}</span>
                          </div>
                          <h3 className="text-white font-medium">{topic.name}</h3>
                          <p className="text-white/40 text-xs mt-1">/{topic.slug}</p>
                        </div>
                        <Badge variant={topic.isActive ? "default" : "secondary"} className={topic.isActive ? "bg-green-600" : ""}>
                          {topic.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels">
            <Card className="bg-[#12121f] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">YouTube Channels</CardTitle>
                <CardDescription className="text-white/60">
                  Channels monitored for content inspiration and video embedding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channels.map(channel => (
                    <a
                      key={channel.id}
                      href={channel.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-red-500/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center group-hover:bg-red-600/30 transition-colors">
                          <Youtube className="text-red-500" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate group-hover:text-red-400 transition-colors">
                            {channel.channelName}
                          </h3>
                          <Badge variant="outline" className="text-white/40 border-white/20 text-xs mt-1">
                            {channel.category}
                          </Badge>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approve Tab */}
          <TabsContent value="approve">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Draft Posts Queue */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-[#12121f] border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <FileText size={18} /> Draft Queue
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Posts awaiting review and approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {posts.filter(p => p.status === "draft").length === 0 ? (
                      <div className="text-center py-8 text-white/40">
                        <ShieldCheck size={40} className="mx-auto mb-2 opacity-30" />
                        <p>No drafts pending review</p>
                        <p className="text-sm mt-1">Generate new content in the Generate tab</p>
                      </div>
                    ) : (
                      posts.filter(p => p.status === "draft").map(post => (
                        <button
                          key={post.id}
                          onClick={() => loadPostForApproval(post.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            approvalPost?.id === post.id
                              ? "bg-primary/10 border-primary/50"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <p className="text-white font-medium text-sm line-clamp-2">{post.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className="text-white/40 border-white/20 text-[10px]">
                              {post.pillar || "unassigned"}
                            </Badge>
                            <span className="text-white/30 text-[10px]">{post.wordCount || 0} words</span>
                            <span className="text-white/30 text-[10px]">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Review Panel */}
              <div className="lg:col-span-2 space-y-4">
                {loadingApproval ? (
                  <Card className="bg-[#12121f] border-white/10">
                    <CardContent className="flex items-center justify-center py-20">
                      <RefreshCcw className="animate-spin text-primary" size={24} />
                      <span className="ml-3 text-white/60">Loading post for review...</span>
                    </CardContent>
                  </Card>
                ) : !approvalPost ? (
                  <Card className="bg-[#12121f] border-white/10">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-white/40">
                      <ArrowRight size={40} className="mb-3 opacity-30" />
                      <p className="text-lg">Select a draft from the queue to review</p>
                      <p className="text-sm mt-1">Review content quality, SEO, and AI scores before publishing</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Quality Checklist */}
                    <Card className="bg-[#12121f] border-white/10">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <CircleDot size={18} /> Quality Checklist
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "hasTitle", label: "Title" },
                            { key: "hasContent", label: "Content (100+ chars)" },
                            { key: "hasMeta", label: "Meta Description" },
                            { key: "hasImage", label: "Featured Image" },
                            { key: "hasTags", label: "Tags" },
                            { key: "hasPillar", label: "Content Pillar" },
                            { key: "hasMinWords", label: "500+ Words" },
                            { key: "hasAiReview", label: "AI Review" },
                          ].map(item => (
                            <div
                              key={item.key}
                              className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                                approvalChecklist[item.key]
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {approvalChecklist[item.key] ? (
                                <CircleCheck size={16} />
                              ) : (
                                <CircleAlert size={16} />
                              )}
                              {item.label}
                            </div>
                          ))}
                        </div>
                        {Object.values(approvalChecklist).every(Boolean) && (
                          <div className="mt-3 p-2 bg-green-500/10 rounded-lg text-green-400 text-sm flex items-center gap-2">
                            <CircleCheck size={16} />
                            All quality checks passed — ready to publish
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* AI Review Scores */}
                    {(() => {
                      const review = parseAiReview(approvalPost);
                      if (!review) return null;
                      return (
                        <Card className="bg-[#12121f] border-white/10">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                              <Sparkles size={18} /> AI Review Scores
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              {[
                                { label: "Overall", score: review.overallScore, color: "text-white" },
                                { label: "Copy", score: review.copyScore, color: "text-blue-400" },
                                { label: "SEO", score: review.seoScore, color: "text-green-400" },
                                { label: "Image", score: review.imageScore, color: "text-purple-400" },
                              ].map(s => (
                                <div key={s.label} className="text-center p-3 bg-white/5 rounded-lg">
                                  <div className={`text-2xl font-bold ${s.color}`}>{s.score}/10</div>
                                  <div className="text-white/40 text-xs mt-1">{s.label}</div>
                                </div>
                              ))}
                            </div>

                            {review.suggestions && review.suggestions.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-white/60 text-sm font-medium">Suggestions</h4>
                                {review.suggestions.map((sug, idx) => (
                                  <div key={idx} className="flex items-start gap-2 p-2 bg-white/5 rounded text-sm">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] shrink-0 mt-0.5 ${
                                        sug.priority === "high"
                                          ? "text-red-400 border-red-400/30"
                                          : sug.priority === "medium"
                                          ? "text-amber-400 border-amber-400/30"
                                          : "text-green-400 border-green-400/30"
                                      }`}
                                    >
                                      {sug.priority}
                                    </Badge>
                                    <div>
                                      <p className="text-white/80">{sug.issue}</p>
                                      <p className="text-white/40 text-xs mt-0.5">{sug.suggestion}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {(review.improvedTitle || review.improvedMetaDescription) && (
                              <div className="mt-4 space-y-2">
                                <h4 className="text-white/60 text-sm font-medium">AI Improvements</h4>
                                {review.improvedTitle && (
                                  <div className="p-2 bg-white/5 rounded">
                                    <span className="text-white/40 text-xs">Suggested Title:</span>
                                    <p className="text-white/80 text-sm">{review.improvedTitle}</p>
                                  </div>
                                )}
                                {review.improvedMetaDescription && (
                                  <div className="p-2 bg-white/5 rounded">
                                    <span className="text-white/40 text-xs">Suggested Meta:</span>
                                    <p className="text-white/80 text-sm">{review.improvedMetaDescription}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })()}

                    {/* Content Preview */}
                    <Card className="bg-[#12121f] border-white/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">Content Preview</CardTitle>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedPost(approvalPost);
                              setEditedContent(approvalPost.content || "");
                              setEditedTitle(approvalPost.title || "");
                              setEditedMeta(approvalPost.metaDescription || "");
                              setIsEditing(false);
                            }}
                            className="text-white/60 hover:text-white"
                          >
                            <ExternalLink size={14} className="mr-1" /> Full Preview
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {approvalPost.featuredImage && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                              src={approvalPost.featuredImage}
                              alt={approvalPost.featuredImageAlt || approvalPost.title}
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        )}
                        <h2 className="text-white text-xl font-bold mb-2">{approvalPost.title}</h2>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-white/40 border-white/20 text-xs">
                            {approvalPost.pillar}
                          </Badge>
                          <span className="text-white/30 text-xs">{approvalPost.wordCount} words</span>
                          {approvalPost.authorName && (
                            <span className="text-white/30 text-xs">by {approvalPost.authorName}</span>
                          )}
                        </div>
                        {approvalPost.metaDescription && (
                          <p className="text-white/50 text-sm mb-3 italic">{approvalPost.metaDescription}</p>
                        )}
                        {approvalPost.tags && approvalPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {approvalPost.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] bg-white/10 text-white/60">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="prose prose-invert prose-sm max-w-none max-h-60 overflow-y-auto rounded-lg bg-white/5 p-4">
                          {approvalPost.htmlContent ? (
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(approvalPost.htmlContent) }} />
                          ) : (
                            <div className="whitespace-pre-wrap text-white/70 text-sm">
                              {(approvalPost.content || "").slice(0, 1500)}
                              {(approvalPost.content || "").length > 1500 && "..."}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => approveAndPublish(approvalPost.id)}
                        disabled={publishing}
                        className="bg-green-600 hover:bg-green-500 text-white flex-1"
                      >
                        {publishing ? (
                          <RefreshCcw className="animate-spin mr-2" size={16} />
                        ) : (
                          <ThumbsUp className="mr-2" size={16} />
                        )}
                        Approve & Publish
                      </Button>
                      <Button
                        onClick={() => sendBackToDraft(approvalPost.id)}
                        variant="outline"
                        className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 flex-1"
                      >
                        <Edit className="mr-2" size={16} />
                        Edit Before Publishing
                      </Button>
                      <Button
                        onClick={() => { setApprovalPost(null); setApprovalChecklist({}); }}
                        variant="ghost"
                        className="text-white/40 hover:text-white"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="bg-[#12121f] border-white/10 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl">
                {isEditing ? "Edit Post" : "Post Preview"}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Edit size={14} className="mr-1" /> Edit
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedContent(selectedPost?.content || "");
                        setEditedTitle(selectedPost?.title || "");
                        setEditedMeta(selectedPost?.metaDescription || "");
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={savePostEdits}
                      className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black"
                    >
                      <Save size={14} className="mr-1" /> Save
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          {selectedPost && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Featured Image */}
              {selectedPost.featuredImage && (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={selectedPost.featuredImage}
                    alt={selectedPost.featuredImageAlt || selectedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={remixImage}
                      disabled={!!remixing}
                      className="bg-black/70 hover:bg-black/90 text-white"
                    >
                      {remixing === "image" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <RefreshCcw size={14} />
                      )}
                      <span className="ml-1">Remix Image</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Image Provider Selection for Remix */}
              {!selectedPost.featuredImage && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 border-dashed flex items-center justify-between">
                  <span className="text-white/50 text-sm">No featured image</span>
                  <Button
                    size="sm"
                    onClick={remixImage}
                    disabled={!!remixing}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {remixing === "image" ? (
                      <Loader2 size={14} className="animate-spin mr-1" />
                    ) : (
                      <ImageIcon size={14} className="mr-1" />
                    )}
                    Generate Image
                  </Button>
                </div>
              )}

              {/* Title Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white/60 text-sm">Title</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(isEditing ? editedTitle : (selectedPost.title || ""), "title")}
                    className="text-white/40 hover:text-white h-7 px-2"
                  >
                    {copiedField === "title" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </Button>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                  />
                ) : (
                  <p className="text-white font-medium">{selectedPost.title}</p>
                )}
              </div>

              {/* Meta Description Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white/60 text-sm">Meta Description</label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(isEditing ? editedMeta : (selectedPost.metaDescription || ""), "meta")}
                    className="text-white/40 hover:text-white h-7 px-2"
                  >
                    {copiedField === "meta" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </Button>
                </div>
                {isEditing ? (
                  <Textarea
                    value={editedMeta}
                    onChange={(e) => setEditedMeta(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[60px] focus:border-primary/50"
                  />
                ) : (
                  <p className="text-white/70 text-sm">{selectedPost.metaDescription}</p>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white/60 text-sm">
                    Content ({selectedPost.wordCount || 0} words)
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={remixContent}
                      disabled={!!remixing}
                      className="text-white/40 hover:text-white h-7 px-2"
                    >
                      {remixing === "content" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <RefreshCcw size={14} />
                      )}
                      <span className="ml-1">Remix</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(isEditing ? editedContent : (selectedPost.content || ""), "content")}
                      className="text-white/40 hover:text-white h-7 px-2"
                    >
                      {copiedField === "content" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      <span className="ml-1">Copy</span>
                    </Button>
                  </div>
                </div>
                {isEditing ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[300px] font-mono text-sm focus:border-primary/50"
                  />
                ) : (
                  <div className="bg-white/5 rounded-lg border border-white/10 p-4 max-h-[400px] overflow-y-auto">
                    <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">
                      {selectedPost.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-white/60 text-sm">Tags</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard((selectedPost.tags || []).join(", "), "tags")}
                      className="text-white/40 hover:text-white h-7 px-2"
                    >
                      {copiedField === "tags" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-white/60 border-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Remix Progress */}
              {remixing && progress.length > 0 && (
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <p className="text-white/50 text-xs uppercase mb-2">Remixing {remixing}...</p>
                  {progress.slice(-3).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm mb-1">
                      {p.stage === "complete" ? (
                        <CheckCircle2 className="text-green-400 shrink-0" size={14} />
                      ) : (
                        <Loader2 className="text-primary animate-spin shrink-0" size={14} />
                      )}
                      <span className="text-white/70">{p.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <Select value={selectedImageProvider} onValueChange={(v) => setSelectedImageProvider(v as ImageProvider)}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white text-sm">
                    <SelectValue placeholder="Image provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/10">
                    <SelectItem value="gemini" className="text-white">Gemini</SelectItem>
                    <SelectItem value="leonardo" className="text-white">Leonardo</SelectItem>
                    <SelectItem value="replicate" className="text-white">Replicate</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  {selectedPost.status === "draft" && (
                    <Button
                      onClick={() => {
                        publishPost(selectedPost.id);
                        setSelectedPost(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
