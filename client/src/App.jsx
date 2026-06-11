import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Spinner } from "./components/ui/Spinner";

const LandingPage = lazy(() => import("./pages/page"));
const LoginPage = lazy(() => import("./pages/(auth)/login"));
const RegisterPage = lazy(() => import("./pages/(auth)/register"));
const DashboardLayout = lazy(() => import("./pages/dashboard/layout"));
const DashboardOverview = lazy(() => import("./pages/dashboard/overview"));
const ChatPage = lazy(() => import("./pages/dashboard/chat"));
const ExplorerPage = lazy(() => import("./pages/dashboard/explorer"));
const ArchitecturePage = lazy(() => import("./pages/dashboard/architecture"));
const BugsPage = lazy(() => import("./pages/dashboard/bugs"));
const ComplexityPage = lazy(() => import("./pages/dashboard/complexity"));
const ContributorPage = lazy(() => import("./pages/dashboard/contributor"));
const DefensePage = lazy(() => import("./pages/dashboard/defense"));
const DocsPage = lazy(() => import("./pages/dashboard/docs"));
const GapsPage = lazy(() => import("./pages/dashboard/gaps"));
const InterviewPage = lazy(() => import("./pages/dashboard/interview"));
const KnowledgeBasePage = lazy(() => import("./pages/dashboard/knowledge-base"));
const OnboardingPage = lazy(() => import("./pages/dashboard/onboarding"));
const QuizPage = lazy(() => import("./pages/dashboard/quiz"));
const ResumePage = lazy(() => import("./pages/dashboard/resume"));
const ReviewerPage = lazy(() => import("./pages/dashboard/reviewer"));
const RoadmapPage = lazy(() => import("./pages/dashboard/roadmap"));
const SearchPage = lazy(() => import("./pages/dashboard/search"));
const SecurityPage = lazy(() => import("./pages/dashboard/security"));
const SettingsPage = lazy(() => import("./pages/dashboard/settings"));
const TimelinePage = lazy(() => import("./pages/dashboard/timeline"));

function SpinnerFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<SpinnerFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="explorer" element={<ExplorerPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="bugs" element={<BugsPage />} />
            <Route path="complexity" element={<ComplexityPage />} />
            <Route path="contributor" element={<ContributorPage />} />
            <Route path="defense" element={<DefensePage />} />
            <Route path="docs" element={<DocsPage />} />
            <Route path="gaps" element={<GapsPage />} />
            <Route path="interview" element={<InterviewPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="reviewer" element={<ReviewerPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="timeline" element={<TimelinePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
