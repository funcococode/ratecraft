import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from "@/lib/store";
import { toast } from "@/lib/toast";
import LandingPage from "@/pages/Landing";

const LibraryPage = lazy(() => import("@/pages/Library"));
const EditorPage = lazy(() => import("@/pages/Editor"));
const ViewPage = lazy(() => import("@/pages/View"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash || pathname === "/view") window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="size-6 animate-spin rounded-full border-2 border-line border-t-ink" />
    </div>
  );
}

export default function App() {
  useEffect(() => store.onError((m) => toast.error(m)), []);
  return (
    <TooltipProvider delayDuration={300}>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<LibraryPage />} />
            <Route path="/app/:cardId" element={<EditorPage />} />
            <Route path="/view" element={<ViewPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}
