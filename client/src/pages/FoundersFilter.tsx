import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, Send, ArrowRight, ArrowLeft, CheckCircle, Flag, Loader2, Download, Calendar, Shield } from "lucide-react";
import { jsPDF } from "jspdf";
import { nanoid } from "nanoid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

async function apiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  return res;
}

interface Task {
  id: string;
  text: string;
  createdAt?: string;
  sortedAt?: string;
  isPriority?: boolean;
  operationsFlag?: boolean;
}

interface ConversationMessage {
  role: "donna" | "user";
  message: string;
  timestamp: string;
}

interface WorkshopSession {
  id: number;
  userId: string;
  title: string | null;
  status: string;
  currentStep: string | null;
  brainDumpItems: Task[] | null;
  onlyICanDoItems: Task[] | null;
  delegateSoonItems: Task[] | null;
  delegateNowItems: Task[] | null;
  priorityTasks: string[] | null;
  donnaConversation: ConversationMessage[] | null;
}

type StepType = "brain_dump" | "sorting" | "review" | "summary";

export default function FoundersFilter() {
  const [session, setSession] = useState<WorkshopSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [donnaLoading, setDonnaLoading] = useState(false);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  const [newTask, setNewTask] = useState("");
  const [donnaMessage, setDonnaMessage] = useState("");
  const [usedSuggestions, setUsedSuggestions] = useState<Set<string>>(new Set());
  
  const [brainDump, setBrainDump] = useState<Task[]>([]);
  const [onlyICan, setOnlyICan] = useState<Task[]>([]);
  const [delegateSoon, setDelegateSoon] = useState<Task[]>([]);
  const [delegateNow, setDelegateNow] = useState<Task[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<StepType>("brain_dump");

  useEffect(() => {
    checkExistingSession();
    const hideChat = () => {
      const widgets = document.querySelectorAll('[data-chat-widget], .lc_chat-widget, iframe[src*="leadconnector"], iframe[src*="msgsndr"]');
      widgets.forEach(el => (el as HTMLElement).style.display = 'none');
      const shadowWidgets = document.querySelectorAll('chat-widget');
      shadowWidgets.forEach(el => (el as HTMLElement).style.display = 'none');
    };
    hideChat();
    const interval = setInterval(hideChat, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      const widgets = document.querySelectorAll('[data-chat-widget], .lc_chat-widget, iframe[src*="leadconnector"], iframe[src*="msgsndr"], chat-widget');
      widgets.forEach(el => (el as HTMLElement).style.display = '');
    };
  }, []);

  const checkExistingSession = async () => {
    try {
      const listRes = await fetch("/api/workshop/sessions", { 
        credentials: "include",
      });
      if (listRes.ok) {
        const sessions = await listRes.json();
        const inProgress = sessions.find((s: WorkshopSession) => s.status === "in_progress");
        if (inProgress) {
          setSession(inProgress);
          setBrainDump(inProgress.brainDumpItems || []);
          setOnlyICan(inProgress.onlyICanDoItems || []);
          setDelegateSoon(inProgress.delegateSoonItems || []);
          setDelegateNow(inProgress.delegateNowItems || []);
          setConversation(inProgress.donnaConversation || []);
          setCurrentStep((inProgress.currentStep as StepType) || "brain_dump");
          setLoading(false);
          return;
        }
      }
      setShowPrivacyConsent(true);
      setLoading(false);
    } catch (error) {
      console.error("Failed to check session:", error);
      setShowPrivacyConsent(true);
      setLoading(false);
    }
  };

  const acceptPrivacyAndStart = async () => {
    if (!privacyAccepted) {
      toast.error("Please accept the privacy terms to continue.");
      return;
    }
    setLoading(true);
    setShowPrivacyConsent(false);
    try {
      const res = await apiRequest("POST", "/api/workshop/sessions", { acceptPrivacy: true });
      const data = await res.json();
      setSession(data);
      setBrainDump(data.brainDumpItems || []);
      setOnlyICan(data.onlyICanDoItems || []);
      setDelegateSoon(data.delegateSoonItems || []);
      setDelegateNow(data.delegateNowItems || []);
      setConversation(data.donnaConversation || []);
      setCurrentStep((data.currentStep as StepType) || "brain_dump");
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to start session. Please try again.");
      setShowPrivacyConsent(true);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = async (updates: Partial<WorkshopSession>) => {
    if (!session) return;
    setSaving(true);
    try {
      await apiRequest("PATCH", `/api/workshop/sessions/${session.id}`, updates);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: nanoid(),
      text: newTask.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...brainDump, task];
    setBrainDump(updated);
    setNewTask("");
    saveSession({ brainDumpItems: updated });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    const getList = (id: string): Task[] => {
      switch (id) {
        case "brainDump": return brainDump;
        case "onlyICan": return onlyICan;
        case "delegateSoon": return delegateSoon;
        case "delegateNow": return delegateNow;
        default: return [];
      }
    };

    let newBrainDump = brainDump;
    let newOnlyICan = onlyICan;
    let newDelegateSoon = delegateSoon;
    let newDelegateNow = delegateNow;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(getList(source.droppableId));
      const [reordered] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reordered);
      
      switch (source.droppableId) {
        case "brainDump": newBrainDump = items; setBrainDump(items); break;
        case "onlyICan": newOnlyICan = items; setOnlyICan(items); break;
        case "delegateSoon": newDelegateSoon = items; setDelegateSoon(items); break;
        case "delegateNow": newDelegateNow = items; setDelegateNow(items); break;
      }
    } else {
      const sourceItems = Array.from(getList(source.droppableId));
      const destItems = Array.from(getList(destination.droppableId));
      const [moved] = sourceItems.splice(source.index, 1);
      moved.sortedAt = new Date().toISOString();
      if (destination.droppableId === "delegateNow") {
        moved.isPriority = false;
        moved.operationsFlag = false;
      }
      destItems.splice(destination.index, 0, moved);
      
      switch (source.droppableId) {
        case "brainDump": newBrainDump = sourceItems; setBrainDump(sourceItems); break;
        case "onlyICan": newOnlyICan = sourceItems; setOnlyICan(sourceItems); break;
        case "delegateSoon": newDelegateSoon = sourceItems; setDelegateSoon(sourceItems); break;
        case "delegateNow": newDelegateNow = sourceItems; setDelegateNow(sourceItems); break;
      }
      switch (destination.droppableId) {
        case "brainDump": newBrainDump = destItems; setBrainDump(destItems); break;
        case "onlyICan": newOnlyICan = destItems; setOnlyICan(destItems); break;
        case "delegateSoon": newDelegateSoon = destItems; setDelegateSoon(destItems); break;
        case "delegateNow": newDelegateNow = destItems; setDelegateNow(destItems); break;
      }
    }

    saveSession({
      brainDumpItems: newBrainDump,
      onlyICanDoItems: newOnlyICan,
      delegateSoonItems: newDelegateSoon,
      delegateNowItems: newDelegateNow,
    });
  };

  const sendDonnaMessage = async () => {
    if (!donnaMessage.trim() || !session) return;
    setDonnaLoading(true);
    
    const userMsg: ConversationMessage = {
      role: "user",
      message: donnaMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setConversation(prev => [...prev, userMsg]);
    setDonnaMessage("");

    try {
      const res = await apiRequest("POST", `/api/workshop/sessions/${session.id}/donna`, {
        message: donnaMessage.trim(),
        currentStep,
      });
      const data = await res.json();
      const donnaMsg: ConversationMessage = {
        role: "donna",
        message: data.message,
        timestamp: new Date().toISOString(),
      };
      setConversation(prev => [...prev, donnaMsg]);
    } catch (error) {
      console.error("Donna error:", error);
      toast.error("Donna is taking a break. Please try again in a moment.");
    } finally {
      setDonnaLoading(false);
    }
  };

  const togglePriority = (taskId: string) => {
    const updated = delegateNow.map(t => 
      t.id === taskId ? { ...t, isPriority: !t.isPriority } : t
    );
    setDelegateNow(updated);
    saveSession({ delegateNowItems: updated });
  };

  const toggleOperationsFlag = (taskId: string) => {
    const updated = delegateNow.map(t => 
      t.id === taskId ? { ...t, operationsFlag: !t.operationsFlag } : t
    );
    setDelegateNow(updated);
    saveSession({ delegateNowItems: updated });
  };

  const goToStep = (step: StepType) => {
    setCurrentStep(step);
    saveSession({ currentStep: step });
  };

  const completeWorkshop = async () => {
    if (!session) return;
    await saveSession({
      status: "completed",
      currentStep: "summary",
      priorityTasks: delegateNow.filter(t => t.isPriority).map(t => t.id),
    });
    setCurrentStep("summary");
  };

  const generatePersonalizedPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const margin = 22;

    // Brand colors
    const navy: [number, number, number] = [26, 32, 48];
    const amber: [number, number, number] = [204, 163, 41];
    const fg: [number, number, number] = [230, 232, 238];
    const textSec: [number, number, number] = [160, 165, 180];
    const textTer: [number, number, number] = [110, 118, 138];
    const border: [number, number, number] = [58, 65, 85];
    const surface: [number, number, number] = [38, 48, 68];
    const red: [number, number, number] = [220, 60, 60];
    const yellow: [number, number, number] = [220, 170, 30];
    const green: [number, number, number] = [50, 180, 100];

    const drawBg = () => { doc.setFillColor(...navy); doc.rect(0, 0, pw, ph, 'F'); };
    const drawFoot = () => {
      doc.setDrawColor(...border); doc.setLineWidth(0.3); doc.line(margin, ph - 18, pw - margin, ph - 18);
      doc.setFontSize(8); doc.setTextColor(...textTer);
      doc.text('KeanOnBiz.com', margin, ph - 12);
      doc.text("Founder's Filter Action Plan", pw - margin, ph - 12, { align: 'right' });
    };
    const drawHeader = (title: string) => {
      doc.setFillColor(...navy); doc.rect(0, 0, pw, 28, 'F');
      doc.setFillColor(...amber); doc.rect(0, 28, pw, 1.5, 'F');
      doc.setTextColor(...fg); doc.setFontSize(16); doc.setFont('helvetica', 'bold');
      doc.text(title, pw / 2, 18, { align: 'center' });
    };

    // ── PAGE 1: TASK BREAKDOWN ──
    drawBg();
    doc.setFillColor(...amber); doc.rect(0, 0, pw, 3, 'F');

    doc.setTextColor(...amber); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text('KEANONBIZ', pw / 2, 25, { align: 'center' });

    doc.setTextColor(...fg); doc.setFontSize(26); doc.setFont('helvetica', 'bold');
    doc.text("Your Founder's Filter", pw / 2, 42, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Action Plan', pw / 2, 52, { align: 'center' });

    doc.setTextColor(...textTer); doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Generated ${new Date().toLocaleDateString()}`, pw / 2, 62, { align: 'center' });

    doc.setFillColor(...amber); doc.rect(pw / 2 - 15, 68, 30, 0.8, 'F');

    let y = 82;

    const priorityTasks = delegateNow.filter(t => t.isPriority);
    if (priorityTasks.length > 0) {
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...red);
      doc.text('PRIORITY: Delegate NOW', margin, y); y += 8;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...fg);
      priorityTasks.forEach(task => {
        const lines = doc.splitTextToSize(`•  ${task.text}${task.operationsFlag ? '  [Ops Change Needed]' : ''}`, pw - margin * 2);
        doc.text(lines, margin, y); y += lines.length * 5 + 2;
      });
      y += 6;
    }

    if (delegateNow.length > 0) {
      if (y > 230) { doc.addPage(); drawBg(); y = 35; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...yellow);
      doc.text(`Delegate NOW  (${delegateNow.length})`, margin, y); y += 7;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textSec);
      delegateNow.forEach(task => {
        if (y > 250) { doc.addPage(); drawBg(); y = 25; }
        const lines = doc.splitTextToSize(`•  ${task.text}`, pw - margin * 2);
        doc.text(lines, margin, y); y += lines.length * 4.5 + 2;
      });
      y += 6;
    }

    if (delegateSoon.length > 0) {
      if (y > 220) { doc.addPage(); drawBg(); y = 35; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...amber);
      doc.text(`Delegate Soon  (${delegateSoon.length})`, margin, y); y += 7;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textSec);
      delegateSoon.forEach(task => {
        if (y > 250) { doc.addPage(); drawBg(); y = 25; }
        const lines = doc.splitTextToSize(`•  ${task.text}`, pw - margin * 2);
        doc.text(lines, margin, y); y += lines.length * 4.5 + 2;
      });
      y += 6;
    }

    if (onlyICan.length > 0) {
      if (y > 220) { doc.addPage(); drawBg(); y = 35; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...green);
      doc.text(`Only I Can Do  (${onlyICan.length})`, margin, y); y += 7;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textSec);
      onlyICan.forEach(task => {
        if (y > 250) { doc.addPage(); drawBg(); y = 25; }
        const lines = doc.splitTextToSize(`•  ${task.text}`, pw - margin * 2);
        doc.text(lines, margin, y); y += lines.length * 4.5 + 2;
      });
    }
    drawFoot();

    // ── PAGE 2: IMPLEMENTATION PLAN ──
    doc.addPage(); drawBg();
    drawHeader("Donna's Strategy & Implementation Plan");

    y = 42;
    const sections = [
      { title: 'Week 1: Quick Wins', text: delegateNow.length > 0
        ? `Focus on delegating "${delegateNow[0]?.text || 'your first task'}". Create a simple checklist or record a 5-minute Loom video showing exactly how you do it. Hand it off by Friday.`
        : 'Review your task list and identify the single easiest task to delegate first.' },
      { title: 'Week 2-4: Build Momentum', text: `Delegate ${Math.min(delegateNow.length, 3)} more tasks from your "Delegate NOW" list. For each: (1) Document the process, (2) Train the person, (3) Let them do it while you observe, (4) Step away completely.` },
      { title: 'Month 2: Systems & Structure', text: `Move to your "Delegate Soon" list (${delegateSoon.length} tasks). These may need more documentation or training. Use SOPs, video tutorials, or checklists to make handoffs smoother.` },
      { title: 'Ongoing: Protect Your Time', text: `Your "${onlyICan.length} Only I Can Do" tasks are your zone of genius. Block dedicated time for these high-value activities. Everything else should flow to your team or systems.` },
    ];

    sections.forEach(s => {
      doc.setTextColor(...amber); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text(s.title, margin, y); y += 7;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textSec);
      const lines = doc.splitTextToSize(s.text, pw - margin * 2);
      doc.text(lines, margin, y); y += lines.length * 5 + 10;
    });

    const opsTasks = delegateNow.filter(t => t.operationsFlag);
    if (opsTasks.length > 0) {
      doc.setTextColor(...yellow); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text('Operations Changes Needed:', margin, y); y += 7;
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...textSec);
      opsTasks.forEach(task => {
        const lines = doc.splitTextToSize(`•  ${task.text} — Consider what systems, tools, or people you need to make this delegation work.`, pw - margin * 2);
        doc.text(lines, margin, y); y += lines.length * 5 + 2;
      });
    }

    // CTA box
    y = Math.max(y + 15, 220);
    doc.setFillColor(...surface);
    doc.roundedRect(margin, y, pw - margin * 2, 28, 3, 3, 'F');
    doc.setTextColor(...amber); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Ready for the Next Step?', margin + 8, y + 10);
    doc.setTextColor(...textSec); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Take the free Mini Audit at keanonbiz.com/assessment', margin + 8, y + 19);

    drawFoot();
    doc.save('founders-filter-action-plan.pdf');
    toast.success('Your action plan has been downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p style={{ color: "var(--text-secondary)" }}>Loading The Founder's Filter...</p>
        </div>
      </div>
    );
  }

  if (currentStep === "summary") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">The Founder's Filter Complete!</h1>
            <p style={{ color: "var(--text-secondary)" }}>Here's your action plan</p>
          </div>

          <div className="grid gap-6">
            {delegateNow.filter(t => t.isPriority).length > 0 && (
              <Card className="bg-red-900/20 border-red-500/30 p-6">
                <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Priority: Delegate NOW
                </h2>
                <ul className="space-y-2">
                  {delegateNow.filter(t => t.isPriority).map(task => (
                    <li key={task.id} className="text-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-red-400" />
                      {task.text}
                      {task.operationsFlag && (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                          Ops Change Needed
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Card className="bg-amber-900/20 border-amber-500/30 p-6">
              <h2 className="text-xl font-semibold text-amber-400 mb-4">Delegate NOW ({delegateNow.length})</h2>
              <ul className="space-y-2">
                {delegateNow.map(task => (
                  <li key={task.id} style={{ color: "var(--text-secondary)" }}>• {task.text}</li>
                ))}
              </ul>
            </Card>

            <Card className="bg-primary/10 border-primary/30 p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Delegate Soon ({delegateSoon.length})</h2>
              <ul className="space-y-2">
                {delegateSoon.map(task => (
                  <li key={task.id} style={{ color: "var(--text-secondary)" }}>• {task.text}</li>
                ))}
              </ul>
            </Card>

            <Card className="bg-card border-border p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>Only I Can Do ({onlyICan.length})</h2>
              <ul className="space-y-2">
                {onlyICan.map(task => (
                  <li key={task.id} style={{ color: "var(--text-secondary)" }}>• {task.text}</li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl text-center">
              <Download className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-2">Download Your Action Plan</h3>
              <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>Get a PDF with your personalized delegation plan to print or share with your team.</p>
              <Button 
                onClick={() => generatePersonalizedPDF()}
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-600 text-background font-bold"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/30 rounded-xl text-center">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-2">Need Help Implementing?</h3>
              <p className="mb-4 text-sm" style={{ color: "var(--text-secondary)" }}>Book a free strategy call to discuss how to actually delegate these tasks and build systems.</p>
              <Button
                onClick={() => window.location.href = "/jeremys-calendar-strategy"}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-foreground font-bold"
              >
                Book a Strategy Call
              </Button>
            </div>
          </div>

          <Card className="mt-6 bg-card border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Next Steps:</h3>
            <ol className="space-y-3" style={{ color: "var(--text-secondary)" }}>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-background rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span><strong className="text-foreground">Download your PDF</strong> — Print it or save it somewhere visible</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-background rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span><strong className="text-foreground">Pick ONE task from "Delegate NOW"</strong> — Start with the easiest one to build momentum</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-background rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span><strong className="text-foreground">Document how YOU do it</strong> — Record a Loom video or write out the steps</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-background rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span><strong className="text-foreground">Hand it off THIS WEEK</strong> — Don't wait. The longer you wait, the heavier it gets.</span>
              </li>
            </ol>
          </Card>

          <div className="mt-6 text-center">
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>We recommend doing this every quarter to stay clear.</p>
            <Button
              onClick={() => window.location.href = "/founders-filter"}
              variant="outline"
              className="border-border" style={{ color: "var(--text-secondary)" }}
            >
              Back to Founder's Filter Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-foreground font-bold">
                D
              </div>
              <div>
                <p className="text-foreground font-medium">Donna</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Your AI Guide</p>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === "donna"
                      ? "bg-amber-500/10 text-amber-100 border border-amber-500/20"
                      : "text-foreground bg-white/5"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
              {donnaLoading && (
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Donna is thinking...
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={donnaMessage}
                onChange={e => setDonnaMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendDonnaMessage()}
                placeholder="Ask Donna for help..."
                className="border-border text-foreground placeholder:opacity-30" style={{ backgroundColor: "var(--surface-elevated)" }}
              />
              <Button onClick={sendDonnaMessage} disabled={donnaLoading} size="icon" className="bg-amber-500 hover:bg-amber-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">The Founder's Filter</h1>
              <div className="flex gap-2">
                {["brain_dump", "sorting", "review"].map((step, i) => (
                  <button
                    key={step}
                    onClick={() => goToStep(step as StepType)}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                      currentStep === step
                        ? "bg-amber-500 text-background"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}. {step === "brain_dump" ? "Brain Dump" : step === "sorting" ? "Sort" : "Review"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-xs font-medium">Session Active</span>
              </div>
              {saving && <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Saving...</span>}
              {currentStep === "review" && (
                <Button onClick={completeWorkshop} className="bg-green-500 hover:bg-green-600">
                  Complete Session
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            {currentStep === "brain_dump" && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-2">Brain Dump</h2>
                <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
                  Get everything out of your head. What tasks are you carrying that feel heavy?
                </p>

                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTask()}
                    placeholder="Type a task and press Enter..."
                    className="bg-card border-border text-foreground placeholder:opacity-30"
                  />
                  <Button onClick={addTask} className="bg-amber-500 hover:bg-amber-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {(() => {
                  const allSuggestions = [
                    "Responding to emails",
                    "Scheduling meetings",
                    "Posting on social media",
                    "Following up with leads",
                    "Invoicing and billing",
                    "Updating spreadsheets",
                    "Answering customer questions",
                    "Booking travel",
                    "Managing my calendar",
                    "Data entry",
                    "Researching vendors",
                    "Ordering supplies",
                    "Writing proposals",
                    "Handling refunds",
                    "Onboarding new clients",
                    "Tracking expenses",
                    "Creating reports",
                    "Updating the website",
                    "Filing paperwork",
                    "Training new hires",
                    "Reviewing contracts",
                    "Managing inventory"
                  ];
                  const VISIBLE_COUNT = 8;
                  const available = allSuggestions.filter(s => !usedSuggestions.has(s));
                  const visible = available.slice(0, VISIBLE_COUNT);
                  if (visible.length === 0) return null;
                  return (
                    <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                      <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>Click any example to add it, or type your own:</p>
                      <div className="flex flex-wrap gap-2">
                        {visible.map((example) => (
                          <button
                            key={example}
                            onClick={() => {
                              const task = { id: nanoid(), text: example };
                              setBrainDump(prev => [...prev, task]);
                              setUsedSuggestions(prev => new Set(prev).add(example));
                            }}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-sm rounded-full transition border border-border hover:border-amber-500/50" style={{ color: "var(--text-secondary)" }}
                          >
                            + {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  {brainDump.map(task => (
                    <div key={task.id} className="bg-card p-3 rounded-lg text-foreground border border-border">
                      {task.text}
                    </div>
                  ))}
                </div>

                {brainDump.length >= 3 && (
                  <div className="mt-8 text-center">
                    <Button onClick={() => goToStep("sorting")} className="bg-amber-500 hover:bg-amber-600">
                      Continue to Sorting <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {(currentStep === "sorting" || currentStep === "review") && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-4 gap-4 h-full">
                  <Droppable droppableId="brainDump">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-card rounded-xl p-4 border ${
                          snapshot.isDraggingOver ? "border-amber-500" : "border-border"
                        }`}
                      >
                        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
                          Unsorted ({brainDump.length})
                        </h3>
                        <div className="space-y-2">
                          {brainDump.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 rounded-lg text-sm ${
                                    snapshot.isDragging
                                      ? "bg-amber-500 text-background"
                                      : "text-foreground"
                                  }`}
                                  style={snapshot.isDragging ? {} : { backgroundColor: "var(--surface-elevated)" }}
                                >
                                  {task.text}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="onlyICan">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-card rounded-xl p-4 border ${
                          snapshot.isDraggingOver ? "border-foreground/50" : "border-border"
                        }`}
                      >
                        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
                          Only I Can Do ({onlyICan.length})
                        </h3>
                        <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>Tasks requiring your unique expertise</p>
                        <div className="space-y-2">
                          {onlyICan.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 rounded-lg text-sm ${
                                    snapshot.isDragging
                                      ? "bg-foreground/50 text-background"
                                      : "text-foreground"
                                  }`}
                                  style={snapshot.isDragging ? {} : { backgroundColor: "var(--surface-elevated)" }}
                                >
                                  {task.text}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="delegateSoon">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-primary/10 rounded-xl p-4 border ${
                          snapshot.isDraggingOver ? "border-primary" : "border-primary/30"
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-primary mb-4">
                          Delegate Soon ({delegateSoon.length})
                        </h3>
                        <p className="text-xs text-primary/60 mb-4">Hand off in 30-60 days</p>
                        <div className="space-y-2">
                          {delegateSoon.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 rounded-lg text-sm ${
                                    snapshot.isDragging
                                      ? "bg-primary text-foreground"
                                      : "bg-primary/20 text-primary/90"
                                  }`}
                                >
                                  {task.text}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="delegateNow">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-red-900/20 rounded-xl p-4 border ${
                          snapshot.isDraggingOver ? "border-red-400" : "border-red-500/30"
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-red-400 mb-4">
                          Delegate NOW ({delegateNow.length})
                        </h3>
                        <p className="text-xs text-red-400/60 mb-4">These need to go ASAP</p>
                        <div className="space-y-2">
                          {delegateNow.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 rounded-lg text-sm ${
                                    snapshot.isDragging
                                      ? "bg-red-500 text-foreground"
                                      : "bg-red-900/40 text-red-100"
                                  }`}
                                >
                                  <div className="mb-2">{task.text}</div>
                                  {currentStep === "review" && (
                                    <div className="flex gap-2 mt-2">
                                      <button
                                        onClick={() => togglePriority(task.id)}
                                        className={`text-xs px-2 py-1 rounded ${
                                          task.isPriority
                                            ? "bg-amber-500 text-background"
                                            : "bg-white/5"
                                        }`}
                                        style={task.isPriority ? {} : { color: "var(--text-secondary)" }}
                                      >
                                        Priority
                                      </button>
                                      <button
                                        onClick={() => toggleOperationsFlag(task.id)}
                                        className={`text-xs px-2 py-1 rounded ${
                                          task.operationsFlag
                                            ? "bg-amber-500 text-background"
                                            : "bg-white/5"
                                        }`}
                                        style={task.operationsFlag ? {} : { color: "var(--text-secondary)" }}
                                      >
                                        Ops Change
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            )}
          </div>

          <div className="p-4 border-t border-border bg-card flex justify-between relative z-[9999]">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === "sorting") goToStep("brain_dump");
                if (currentStep === "review") goToStep("sorting");
              }}
              disabled={currentStep === "brain_dump"}
              className="border-border" style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {currentStep === "review" ? (
              <Button
                onClick={completeWorkshop}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Session <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (currentStep === "brain_dump") goToStep("sorting");
                  if (currentStep === "sorting") goToStep("review");
                }}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showPrivacyConsent} onOpenChange={() => {}}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-amber-500" />
              <DialogTitle className="text-xl">Privacy & Data Usage</DialogTitle>
            </div>
            <DialogDescription className="text-base" style={{ color: "var(--text-secondary)" }}>
              Before we begin, please review how we handle your data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg p-4 space-y-3 text-sm" style={{ backgroundColor: "var(--surface-elevated)", color: "var(--text-secondary)" }}>
              <p>
                <strong className="text-foreground">What we collect:</strong> The tasks you enter, your sorting decisions, and your conversation with Donna.
              </p>
              <p>
                <strong className="text-foreground">How we use it:</strong> To save your progress and help you complete the session. Your data is stored securely and never sold.
              </p>
              <p>
                <strong className="text-foreground">AI Processing:</strong> Your messages to Donna are processed by AI to provide personalized guidance.
              </p>
              <p>
                <strong className="text-foreground">Your rights:</strong> You can request deletion of your data at any time by contacting us.
              </p>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <Checkbox 
                id="privacy-consent"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="mt-1 border-border data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <label htmlFor="privacy-consent" className="text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                I understand and agree to the data usage described above. I consent to having my session data stored and processed to provide this service.
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={acceptPrivacyAndStart}
              disabled={!privacyAccepted}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50"
            >
              Start Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
