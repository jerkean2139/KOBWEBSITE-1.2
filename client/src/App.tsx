import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Home = lazy(() => import("./pages/Home"));
const Calendar = lazy(() => import("./pages/Calendar"));
const CalendarStrategy = lazy(() => import("./pages/CalendarStrategy"));
const CalendarCoaching = lazy(() => import("./pages/CalendarCoaching"));
const CalendarIntro = lazy(() => import("./pages/CalendarIntro"));
const ManumationCoach = lazy(() => import("./pages/ManumationCoach"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Assessment = lazy(() => import("./pages/Assessment"));
const Book = lazy(() => import("./pages/Book"));
const DirtySecretCoaching = lazy(() => import("./pages/DirtySecretCoaching"));
const NewsletterCreator = lazy(() => import("./pages/NewsletterCreator"));
const ContentStudio = lazy(() => import("./pages/ContentStudio"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Podcast = lazy(() => import("./pages/Podcast"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const FoundersFilterLanding = lazy(() => import("./pages/FoundersFilterLanding"));
const FoundersFilter = lazy(() => import("./pages/FoundersFilter"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioAdmin = lazy(() => import("./pages/PortfolioAdmin"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const TopicHub = lazy(() => import("./pages/TopicHub"));
const DevSitemap = lazy(() => import("./pages/DevSitemap"));
const PainPointsAdmin = lazy(() => import("./pages/PainPointsAdmin"));
const MicroPodStudio = lazy(() => import("./pages/MicroPodStudio"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const InsuranceAssessment = lazy(() => import("./pages/InsuranceAssessment"));
const InsuranceCoaching = lazy(() => import("./pages/InsuranceCoaching"));
const BusinessAutomation = lazy(() => import("./pages/BusinessAutomation"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ width: 40, height: 40, border: "4px solid rgba(0,0,0,0.1)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path="/jeremys-calendar" component={Calendar} />
        <Route path="/jeremys-calendar-strategy" component={CalendarStrategy} />
        <Route path="/jeremys-calendar-coaching" component={CalendarCoaching} />
        <Route path="/jeremys-calendar-intro" component={CalendarIntro} />
        <Route path="/become-a-coach" component={ManumationCoach} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/topic/:pillar" component={TopicHub} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/micropod" component={Podcast} />
        <Route path="/newsletter" component={Newsletter} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/book" component={Book} />
        <Route path="/coaching-truth" component={DirtySecretCoaching} />
        <Route path="/admin/newsletter" component={NewsletterCreator} />
        <Route path="/admin/content-studio" component={ContentStudio} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/founders-filter" component={FoundersFilterLanding} />
        <Route path="/founders-filter/start" component={FoundersFilter} />
        <Route path="/waterfall-workshop">{() => <Redirect to="/founders-filter" />}</Route>
        <Route path="/waterfall-workshop/start">{() => <Redirect to="/founders-filter/start" />}</Route>
        <Route path="/insurance" component={InsuranceAssessment} />
        <Route path="/insurance/assessment" component={InsuranceAssessment} />
        <Route path="/insurance-coaching" component={InsuranceCoaching} />
        <Route path="/business-automation" component={BusinessAutomation} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/portfolio/:slug" component={CaseStudy} />
        <Route path="/admin/portfolio" component={PortfolioAdmin} />
        <Route path="/admin/micropod" component={MicroPodStudio} />
        <Route path="/admin/pain-points" component={PainPointsAdmin} />
        <Route path="/dev" component={DevSitemap} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
