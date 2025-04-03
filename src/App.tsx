
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AzkarList from "./pages/AzkarList";
import Tasbih from "./pages/Tasbih";
import Qibla from "./pages/Qibla";
import Settings from "./pages/Settings";
import PrayerTimes from "./pages/PrayerTimes";
import SunnahPrayers from "./pages/SunnahPrayers";
import DuhaPrayer from "./pages/DuhaPrayer";
import More from "./pages/More";
import DuaCategory from "./pages/DuaCategory";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:categoryId" element={<AzkarList />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/sunnah-prayers" element={<SunnahPrayers />} />
          <Route path="/duha-prayer" element={<DuhaPrayer />} />
          <Route path="/forbidden-times" element={<PrayerTimes />} /> {/* Reuse the prayer times page for now */}
          <Route path="/more" element={<More />} />
          <Route path="/dua-category/:categoryId" element={<DuaCategory />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
