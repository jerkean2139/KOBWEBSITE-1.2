import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, Calendar, BookOpen, Mic, Mail, ClipboardCheck, 
  BookMarked, Users, Shield, Lock, Droplets, Search,
  ExternalLink, Layers, Globe, Settings, FileText
} from "lucide-react";
import { SEO } from "@/components/SEO";

interface SiteRoute {
  path: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "public" | "calendar" | "content" | "tools" | "admin" | "legal";
}

const siteRoutes: SiteRoute[] = [
  { path: "/", name: "Home", description: "Main landing page with services overview", icon: <Home className="w-5 h-5" />, category: "public" },
  { path: "/blog", name: "Blog", description: "Business insights and articles", icon: <BookOpen className="w-5 h-5" />, category: "content" },
  { path: "/micropod", name: "MicroPod", description: "Podcast episodes and audio content", icon: <Mic className="w-5 h-5" />, category: "content" },
  { path: "/newsletter", name: "Newsletter", description: "Weekly business insights signup", icon: <Mail className="w-5 h-5" />, category: "content" },
  { path: "/book", name: "The Book", description: "The Manumation Method book page", icon: <BookMarked className="w-5 h-5" />, category: "content" },
  
  { path: "/jeremys-calendar", name: "Book a Call", description: "Main calendar booking page", icon: <Calendar className="w-5 h-5" />, category: "calendar" },
  { path: "/jeremys-calendar-strategy", name: "Strategy Session", description: "90-min deep dive strategy call", icon: <Calendar className="w-5 h-5" />, category: "calendar" },
  { path: "/jeremys-calendar-coaching", name: "Coaching Call", description: "1:1 coaching session booking", icon: <Calendar className="w-5 h-5" />, category: "calendar" },
  { path: "/jeremys-calendar-intro", name: "Intro Call", description: "Free introductory call", icon: <Calendar className="w-5 h-5" />, category: "calendar" },
  
  { path: "/become-a-coach", name: "Become a Coach", description: "Manumation coaching certification", icon: <Users className="w-5 h-5" />, category: "public" },
  { path: "/coaching-truth", name: "Coaching Truth", description: "The dirty secret of coaching industry", icon: <Shield className="w-5 h-5" />, category: "public" },
  { path: "/assessment", name: "Assessment", description: "Business readiness assessment tool", icon: <ClipboardCheck className="w-5 h-5" />, category: "tools" },
  
  { path: "/founders-filter", name: "The Founder's Filter", description: "Task delegation tool landing", icon: <Droplets className="w-5 h-5" />, category: "tools" },
  { path: "/founders-filter/start", name: "Start Founder's Filter", description: "Interactive delegation exercise", icon: <Droplets className="w-5 h-5" />, category: "tools" },
  { path: "/portfolio", name: "Build Gallery", description: "Watch projects come to life over time", icon: <Layers className="w-5 h-5" />, category: "public" },
  
  { path: "/admin/newsletter", name: "Newsletter Creator", description: "AI-powered newsletter generator", icon: <Lock className="w-5 h-5" />, category: "admin" },
  { path: "/admin/content-studio", name: "Content Studio", description: "Automated blog post generator", icon: <Lock className="w-5 h-5" />, category: "admin" },
  
  { path: "/terms", name: "Terms of Service", description: "Legal terms and conditions", icon: <FileText className="w-5 h-5" />, category: "legal" },
  { path: "/privacy", name: "Privacy Policy", description: "Data privacy information", icon: <FileText className="w-5 h-5" />, category: "legal" },
];

const categoryInfo = {
  public: { label: "Public Pages", icon: <Globe className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
  calendar: { label: "Calendar & Booking", icon: <Calendar className="w-4 h-4" />, color: "from-green-500 to-emerald-500" },
  content: { label: "Content & Media", icon: <BookOpen className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
  tools: { label: "Interactive Tools", icon: <Settings className="w-4 h-4" />, color: "from-amber-500 to-orange-500" },
  admin: { label: "Admin Tools", icon: <Lock className="w-4 h-4" />, color: "from-red-500 to-rose-500" },
  legal: { label: "Legal", icon: <FileText className="w-4 h-4" />, color: "from-slate-500 to-gray-500" },
};

export default function DevSitemap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredRoutes = siteRoutes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || route.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: siteRoutes.length,
    public: siteRoutes.filter(r => r.category === "public").length,
    content: siteRoutes.filter(r => r.category === "content").length,
    tools: siteRoutes.filter(r => r.category === "tools").length,
  };

  return (
    <>
      <SEO title="Dev Sitemap" noindex={true} />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold mb-6">
            <Layers className="w-4 h-4" />
            Developer Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Site Map
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Interactive overview of all pages on KeanOnBiz. Click any card to visit that page.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Pages", value: stats.total, color: "bg-blue-500" },
            { label: "Public", value: stats.public, color: "bg-green-500" },
            { label: "Content", value: stats.content, color: "bg-purple-500" },
            { label: "Tools", value: stats.tools, color: "bg-amber-500" },
          ].map((stat, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 text-center">
                <div className={`inline-flex w-3 h-3 rounded-full ${stat.color} mb-2`}></div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-slate-800/50 border border-slate-700 p-1 flex-wrap h-auto">
            <TabsTrigger value="all" className="text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-white">
              All Pages
            </TabsTrigger>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="text-slate-300 data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-1"
              >
                {info.icon}
                <span className="hidden sm:inline">{info.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route) => {
            const catInfo = categoryInfo[route.category];
            return (
              <Link key={route.path} href={route.path}>
                <Card className="group cursor-pointer bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-300 h-full overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${catInfo.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${catInfo.color} text-white`}>
                        {route.icon}
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                      {route.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {route.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-slate-900/50 text-slate-500 px-2 py-1 rounded font-mono">
                        {route.path}
                      </code>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        {catInfo.icon}
                        {catInfo.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredRoutes.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No pages found matching "{searchQuery}"</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            KeanOnBiz Developer Tools • {new Date().toLocaleDateString()}
          </p>
        </div>
        </div>
      </div>
    </>
  );
}
