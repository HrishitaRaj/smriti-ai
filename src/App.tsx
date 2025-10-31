import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Chat from "./pages/Chat";
import VisualGallery from "./pages/VisualGallery";
import Activities from "./pages/Activities";
import Memories from "./pages/Memories";
import NotFound from "./pages/NotFound";
import EmotionTracker from "./pages/EmotionTracker";

// Caretaker pages
import Dashboard from "@/pages/Caretaker/Dashboard";
import Family from "@/pages/Caretaker/Family";
import Alerts from "@/pages/Caretaker/Alerts";
import MoodCalendar from "@/pages/Caretaker/MoodCalendar";
import Patient from "@/pages/Caretaker/Patient";
import Settings from "@/pages/Caretaker/Settings";

// Layout
import { Sidebar } from "@/components/Sidebar";

const queryClient = new QueryClient();

const CaretakerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Index />} />

          {/* Caretaker Pages - All share Sidebar layout */}
          <Route
            path="/caretaker/dashboard"
            element={
              <CaretakerLayout>
                <Dashboard />
              </CaretakerLayout>
            }
          />
          <Route
            path="/caretaker/family"
            element={
              <CaretakerLayout>
                <Family />
              </CaretakerLayout>
            }
          />
          <Route
            path="/caretaker/alerts"
            element={
              <CaretakerLayout>
                <Alerts />
              </CaretakerLayout>
            }
          />
          <Route
            path="/caretaker/moodcalendar"
            element={
              <CaretakerLayout>
                <MoodCalendar />
              </CaretakerLayout>
            }
          />
          <Route
            path="/caretaker/patient"
            element={
              <CaretakerLayout>
                <Patient />
              </CaretakerLayout>
            }
          />
          <Route
            path="/caretaker/settings"
            element={
              <CaretakerLayout>
                <Settings />
              </CaretakerLayout>
            }
          />

          {/* 404 Page */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/visualgallery" element={<VisualGallery />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/emotion-tracker" element={<EmotionTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
