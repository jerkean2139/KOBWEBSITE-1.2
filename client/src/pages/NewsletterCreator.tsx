import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { 
  Loader2, 
  Sparkles, 
  Send, 
  Eye, 
  FileText, 
  CheckCircle2,
  ArrowLeft,
  Search,
  ListFilter,
  FileEdit,
  Zap,
  Mail,
  Circle,
  Check,
  Edit,
  Save,
  X,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  Plus
} from "lucide-react";
import { Link } from "wouter";

interface Newsletter {
  id: number;
  title: string;
  status: string;
  tldr: string | null;
  topTenItems: string[] | null;
  htmlContent: string | null;
  headerImage: string | null;
  createdAt: string;
}

interface ProgressEvent {
  stage: string;
  message: string;
  data?: any;
}

const STAGES = [
  { key: "starting", label: "Initializing", icon: Zap },
  { key: "researching", label: "Researching Trends", icon: Search },
  { key: "analyzing", label: "Analyzing Sources", icon: ListFilter },
  { key: "ranking", label: "Selecting Top 10", icon: Sparkles },
  { key: "writing", label: "Writing Content", icon: FileEdit },
  { key: "finalizing", label: "Generating Email", icon: Mail },
  { key: "complete", label: "Complete", icon: Check },
];

export default function NewsletterCreator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [authError, setAuthError] = useState("");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>("");
  const [progressMessages, setProgressMessages] = useState<ProgressEvent[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");
  const eventSourceRef = useRef<EventSource | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTldr, setEditTldr] = useState("");
  const [editItems, setEditItems] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string[] | null>(null);
  const [isFinalSending, setIsFinalSending] = useState(false);
  const [finalSendStatus, setFinalSendStatus] = useState<"idle" | "success" | "error">("idle");

  const apiFetch = (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${adminKey}`,
        "Content-Type": "application/json",
      },
    });
  };

  const handleLogin = async () => {
    setAuthError("");
    try {
      const res = await fetch("/api/newsletters", {
        headers: { "Authorization": `Bearer ${adminKey}` },
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError("Invalid admin key");
      }
    } catch {
      setAuthError("Connection failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchNewsletters();
    }
  }, [isAuthenticated, adminKey]);

  const fetchNewsletters = async () => {
    try {
      const res = await apiFetch("/api/newsletters");
      const data = await res.json();
      setNewsletters(data);
    } catch (error) {
      console.error("Failed to fetch newsletters:", error);
    }
  };

  const createAndGenerate = async () => {
    setIsGenerating(true);
    setProgressMessages([]);
    setCurrentStage("starting");
    setShowPreview(false);

    try {
      const tokenRes = await apiFetch("/api/session-token", { method: "POST" });
      if (!tokenRes.ok) {
        throw new Error("Failed to get session token");
      }
      const { token: sessionToken } = await tokenRes.json();

      const res = await apiFetch("/api/newsletters", {
        method: "POST",
        body: JSON.stringify({ title: "New Newsletter" }),
      });
      const newsletter = await res.json();
      setSelectedNewsletter(newsletter);
      setNewsletters([newsletter, ...newsletters]);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(
        `/api/newsletters/${newsletter.id}/auto-generate?token=${encodeURIComponent(sessionToken)}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data: ProgressEvent = JSON.parse(event.data);
        setCurrentStage(data.stage);
        setProgressMessages((prev) => [...prev, data]);

        if (data.stage === "complete" && data.data) {
          const updated = {
            ...newsletter,
            title: data.data.title,
            tldr: data.data.tldr,
            topTenItems: data.data.topTen,
            htmlContent: data.data.htmlContent,
            headerImage: data.data.headerImage || null,
          };
          setSelectedNewsletter(updated);
          setIsGenerating(false);
          eventSource.close();
          fetchNewsletters();
        }

        if (data.stage === "error") {
          setIsGenerating(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setIsGenerating(false);
        eventSource.close();
      };
    } catch (error) {
      console.error("Failed to create newsletter:", error);
      setIsGenerating(false);
    }
  };

  const selectNewsletter = async (id: number) => {
    try {
      const res = await apiFetch(`/api/newsletters/${id}`);
      const data = await res.json();
      setSelectedNewsletter(data);
      setShowPreview(false);
      setIsEditing(false);
      setApproveError(null);
      setProgressMessages([]);
      setCurrentStage("");
      setSendStatus("idle");
      setFinalSendStatus("idle");
    } catch (error) {
      console.error("Failed to fetch newsletter:", error);
    }
  };

  const startEditing = () => {
    if (!selectedNewsletter) return;
    setEditTitle(selectedNewsletter.title || "");
    setEditTldr(selectedNewsletter.tldr || "");
    setEditItems([...(selectedNewsletter.topTenItems || [])]);
    setIsEditing(true);
    setShowPreview(false);
    setApproveError(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdits = async () => {
    if (!selectedNewsletter) return;
    setIsSaving(true);
    try {
      const res = await apiFetch(`/api/newsletters/${selectedNewsletter.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          tldr: editTldr,
          topTenItems: editItems,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedNewsletter(updated);
        setIsEditing(false);
        fetchNewsletters();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
    setIsSaving(false);
  };

  const updateItem = (index: number, value: string) => {
    const next = [...editItems];
    next[index] = value;
    setEditItems(next);
  };

  const removeItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setEditItems([...editItems, ""]);
  };

  const sendTestEmail = async () => {
    if (!selectedNewsletter || !testEmail.trim()) return;
    setIsSending(true);
    setSendStatus("idle");
    try {
      const res = await apiFetch(`/api/newsletters/${selectedNewsletter.id}/send`, {
        method: "POST",
        body: JSON.stringify({ testEmail }),
      });
      if (res.ok) {
        setSendStatus("success");
      } else {
        setSendStatus("error");
      }
    } catch (error) {
      console.error("Failed to send:", error);
      setSendStatus("error");
    }
    setIsSending(false);
  };

  const approveNewsletter = async () => {
    if (!selectedNewsletter) return;
    setIsApproving(true);
    setApproveError(null);
    try {
      const res = await apiFetch(`/api/newsletters/${selectedNewsletter.id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedNewsletter(updated);
        fetchNewsletters();
      } else {
        const data = await res.json();
        setApproveError(data.errors || [data.error]);
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      setApproveError(["Connection failed"]);
    }
    setIsApproving(false);
  };

  const approveAndSend = async () => {
    if (!selectedNewsletter) return;
    setIsFinalSending(true);
    setFinalSendStatus("idle");
    setApproveError(null);
    try {
      if (selectedNewsletter.status !== "approved") {
        const approveRes = await apiFetch(`/api/newsletters/${selectedNewsletter.id}/approve`, {
          method: "POST",
        });
        if (!approveRes.ok) {
          const data = await approveRes.json();
          setApproveError(data.errors || [data.error]);
          setIsFinalSending(false);
          return;
        }
      }

      const res = await apiFetch(`/api/newsletters/${selectedNewsletter.id}/send`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setFinalSendStatus("success");
        setSelectedNewsletter({ ...selectedNewsletter, status: "sent" });
        fetchNewsletters();
      } else {
        setFinalSendStatus("error");
      }
    } catch (error) {
      console.error("Failed to approve & send:", error);
      setFinalSendStatus("error");
    }
    setIsFinalSending(false);
  };

  const getStageStatus = (stageKey: string) => {
    const stageIndex = STAGES.findIndex((s) => s.key === stageKey);
    const currentIndex = STAGES.findIndex((s) => s.key === currentStage);
    
    if (stageIndex < currentIndex) return "complete";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  };

  const getChecklist = (nl: Newsletter) => {
    const titleOk = !!(nl.title && nl.title !== "New Newsletter");
    const tldrWords = (nl.tldr || "").trim().split(/\s+/).filter(Boolean).length;
    const tldrOk = tldrWords >= 20;
    const items = (nl.topTenItems || []) as string[];
    const itemsOk = items.length >= 10;
    const imageOk = !!nl.headerImage;
    const htmlOk = !!nl.htmlContent;
    return { titleOk, tldrOk, tldrWords, itemsOk, itemCount: items.length, imageOk, htmlOk };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Sent</Badge>;
      case "approved":
        return <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">Approved</Badge>;
      default:
        return <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">Draft</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: "#0f172a" }}>
          <Card className="w-full max-w-md bg-white/5 border-white/10">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Newsletter Admin</CardTitle>
              <p className="text-white/60">Enter your admin key to continue</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <Input
                  type="password"
                  placeholder="Admin Key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mb-4"
                  autoComplete="current-password"
                />
                {authError && (
                  <p className="text-red-400 text-sm text-center mb-4">{authError}</p>
                )}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Access Newsletter Creator
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const checklist = selectedNewsletter ? getChecklist(selectedNewsletter) : null;
  const allChecksPassed = checklist ? (checklist.titleOk && checklist.tldrOk && checklist.itemsOk && checklist.htmlOk) : false;

  return (
    <>
      <SEO title="Newsletter Creator - Admin" noindex={true} />
      <Navigation />
      <main className="min-h-screen pt-20" style={{ backgroundColor: "#0f172a" }}>
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10">
                <ArrowLeft size={18} className="mr-2" />
                Back to Site
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Newsletter Creator</h1>
              <p className="text-white/60">One-click AI-powered newsletter generation</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-white/5 border-white/10 mb-6">
                <CardContent className="pt-6">
                  <Button 
                    onClick={createAndGenerate}
                    disabled={isGenerating}
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={20} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2" size={20} />
                        Generate Newsletter
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <FileText size={18} />
                    Past Newsletters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                  {newsletters.map((nl) => (
                    <button
                      key={nl.id}
                      onClick={() => selectNewsletter(nl.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedNewsletter?.id === nl.id
                          ? "bg-primary/20 border border-primary/40"
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white text-sm font-medium truncate flex-1 mr-2">{nl.title}</p>
                        {getStatusBadge(nl.status)}
                      </div>
                      <p className="text-white/40 text-xs">
                        {new Date(nl.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                  {newsletters.length === 0 && (
                    <p className="text-white/40 text-sm text-center py-4">
                      No newsletters yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-9">
              {isGenerating ? (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Generating Your Newsletter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-8">
                      {STAGES.map((stage) => {
                        const status = getStageStatus(stage.key);
                        const Icon = stage.icon;
                        
                        return (
                          <div key={stage.key} className="flex items-center gap-4">
                            <div className={`
                              w-10 h-10 rounded-full flex items-center justify-center
                              ${status === "complete" ? "bg-green-600" : ""}
                              ${status === "active" ? "bg-blue-600 animate-pulse" : ""}
                              ${status === "pending" ? "bg-white/10" : ""}
                            `}>
                              {status === "complete" ? (
                                <CheckCircle2 size={20} className="text-white" />
                              ) : status === "active" ? (
                                <Loader2 size={20} className="text-white animate-spin" />
                              ) : (
                                <Icon size={20} className="text-white/40" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${
                                status === "pending" ? "text-white/40" : "text-white"
                              }`}>
                                {stage.label}
                              </p>
                              {status === "active" && progressMessages.length > 0 && (
                                <p className="text-blue-400 text-sm">
                                  {progressMessages[progressMessages.length - 1]?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-sm">
                      {progressMessages.map((msg, i) => (
                        <div key={i} className="text-green-400">
                          <span className="text-white/40">[{msg.stage}]</span> {msg.message}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : selectedNewsletter ? (
                <div className="space-y-6">
                  {checklist && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <ShieldCheck size={18} />
                          Quality Checklist
                          {allChecksPassed ? (
                            <Badge className="bg-green-600/20 text-green-400 border-green-600/30 ml-2">Ready</Badge>
                          ) : (
                            <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30 ml-2">Needs Attention</Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <CheckItem label="Title" passed={checklist.titleOk} />
                          <CheckItem label={`TL;DR (${checklist.tldrWords}/20+ words)`} passed={checklist.tldrOk} />
                          <CheckItem label={`Top Ten (${checklist.itemCount}/10)`} passed={checklist.itemsOk} />
                          <CheckItem label="Header Image" passed={checklist.imageOk} />
                          <CheckItem label="HTML Rendered" passed={checklist.htmlOk} />
                        </div>

                        {approveError && (
                          <div className="mt-4 bg-red-900/30 border border-red-600/30 rounded-lg p-3">
                            <p className="text-red-400 text-sm font-medium mb-1">Cannot approve:</p>
                            <ul className="text-red-400/80 text-sm space-y-1">
                              {approveError.map((err, i) => (
                                <li key={i} className="flex items-center gap-1">
                                  <AlertCircle size={14} /> {err}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-white">{selectedNewsletter.title}</CardTitle>
                        {getStatusBadge(selectedNewsletter.status)}
                      </div>
                      <div className="flex gap-2">
                        {!isEditing && selectedNewsletter.status !== "sent" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={startEditing}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                        )}
                        {isEditing && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEditing}
                              className="text-white border-white/20 hover:bg-white/10"
                            >
                              <X size={16} className="mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={saveEdits}
                              disabled={isSaving}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isSaving ? (
                                <Loader2 size={16} className="mr-1 animate-spin" />
                              ) : (
                                <Save size={16} className="mr-1" />
                              )}
                              Save
                            </Button>
                          </>
                        )}
                        {!isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            <Eye size={16} className="mr-1" />
                            {showPreview ? "Hide Preview" : "Preview Email"}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {showPreview && selectedNewsletter.htmlContent ? (
                        <div className="bg-white rounded-lg p-4 max-h-[600px] overflow-y-auto">
                          <iframe
                            srcDoc={selectedNewsletter.htmlContent}
                            className="w-full h-[500px] border-0"
                            title="Email Preview"
                          />
                        </div>
                      ) : isEditing ? (
                        <div className="space-y-6">
                          <div>
                            <label className="text-white/60 text-sm font-medium mb-2 block">Title</label>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-white/60 text-sm font-medium mb-2 block">TL;DR</label>
                            <Textarea
                              value={editTldr}
                              onChange={(e) => setEditTldr(e.target.value)}
                              rows={3}
                              className="bg-white/10 border-white/20 text-white resize-none"
                            />
                            <p className="text-white/40 text-xs mt-1">
                              {editTldr.trim().split(/\s+/).filter(Boolean).length} words (min 20)
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-white/60 text-sm font-medium">Top 10 Items ({editItems.length})</label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                                className="text-white border-white/20 hover:bg-white/10"
                              >
                                <Plus size={14} className="mr-1" />
                                Add Item
                              </Button>
                            </div>
                            <div className="space-y-3">
                              {editItems.map((item, i) => (
                                <div key={i} className="flex gap-2">
                                  <span className="text-white/40 text-sm font-mono mt-2.5 min-w-[24px]">{i + 1}.</span>
                                  <Textarea
                                    value={item}
                                    onChange={(e) => updateItem(i, e.target.value)}
                                    rows={2}
                                    className="bg-white/10 border-white/20 text-white resize-none flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(i)}
                                    className="text-red-400/60 hover:text-red-400 hover:bg-red-900/20 mt-1"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {selectedNewsletter.tldr && (
                            <div className="bg-blue-900/30 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                              <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2">TL;DR</p>
                              <p className="text-white/90">{selectedNewsletter.tldr}</p>
                            </div>
                          )}

                          {selectedNewsletter.topTenItems && selectedNewsletter.topTenItems.length > 0 && (
                            <div>
                              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-blue-400" />
                                Top 10 Insights
                              </h3>
                              <div className="space-y-3">
                                {selectedNewsletter.topTenItems.map((item, i) => (
                                  <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <p className="text-white/90">{item}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {!selectedNewsletter.tldr && !selectedNewsletter.topTenItems && (
                            <p className="text-white/40 text-center py-8">
                              This newsletter hasn't been generated yet.
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {selectedNewsletter.htmlContent && selectedNewsletter.status !== "sent" && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <Send size={18} />
                          Send Test Email
                        </CardTitle>
                        <p className="text-white/40 text-sm">Send a test to yourself before approving</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-3">
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                          <Button 
                            onClick={sendTestEmail}
                            disabled={isSending || !testEmail.trim()}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {isSending ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <>
                                <Mail size={18} className="mr-2" />
                                Send Test
                              </>
                            )}
                          </Button>
                        </div>
                        {sendStatus === "success" && (
                          <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Test email sent!
                          </p>
                        )}
                        {sendStatus === "error" && (
                          <p className="text-red-400 text-sm mt-2">Failed to send. Check your Resend configuration.</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {selectedNewsletter.status !== "sent" && selectedNewsletter.htmlContent && (
                    <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/20">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <ShieldCheck size={18} />
                          Approve & Send
                        </CardTitle>
                        <p className="text-white/40 text-sm">
                          {selectedNewsletter.status === "approved"
                            ? "Newsletter is approved. Ready to send to subscribers."
                            : "Review the checklist above, then approve and send to subscribers."}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {selectedNewsletter.status !== "approved" && (
                            <Button
                              onClick={approveNewsletter}
                              disabled={isApproving || !allChecksPassed}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isApproving ? (
                                <Loader2 size={18} className="mr-2 animate-spin" />
                              ) : (
                                <ShieldCheck size={18} className="mr-2" />
                              )}
                              Approve
                            </Button>
                          )}
                          <Button
                            onClick={approveAndSend}
                            disabled={isFinalSending || !allChecksPassed}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            {isFinalSending ? (
                              <Loader2 size={18} className="mr-2 animate-spin" />
                            ) : (
                              <Send size={18} className="mr-2" />
                            )}
                            Approve & Send
                          </Button>
                        </div>
                        {finalSendStatus === "success" && (
                          <p className="text-green-400 text-sm mt-3 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Newsletter sent to subscribers!
                          </p>
                        )}
                        {finalSendStatus === "error" && (
                          <p className="text-red-400 text-sm mt-3">Failed to send. Check Resend configuration.</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {selectedNewsletter.status === "sent" && (
                    <Card className="bg-green-900/20 border-green-600/20">
                      <CardContent className="py-6 text-center">
                        <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 font-medium">This newsletter has been sent</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-white/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Ready to Create a Newsletter?
                    </h3>
                    <p className="text-white/60 mb-6 max-w-md mx-auto">
                      Click the "Generate Newsletter" button and watch as AI researches trends, 
                      selects the top insights, and creates your newsletter automatically.
                    </p>
                    <Button 
                      onClick={createAndGenerate}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Sparkles className="mr-2" size={18} />
                      Generate Newsletter
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function CheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${passed ? "bg-green-900/20" : "bg-white/5"}`}>
      {passed ? (
        <CheckCircle2 size={16} className="text-green-400 shrink-0" />
      ) : (
        <Circle size={16} className="text-white/30 shrink-0" />
      )}
      <span className={`text-sm ${passed ? "text-green-400" : "text-white/40"}`}>{label}</span>
    </div>
  );
}
