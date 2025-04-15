
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
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
import ForbiddenPrayerTimes from "./pages/ForbiddenPrayerTimes";
import MonthlyPrayerTimes from "./pages/MonthlyPrayerTimes";
import Search from "./pages/Search";
import NamesOfAllah from "./pages/NamesOfAllah";
import NightDuas from "./pages/NightDuas";

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
    <AppSettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/:categoryId" element={<AzkarList />} />
            <Route path="/night-duas" element={<NightDuas />} />
            <Route path="/tasbih" element={<Tasbih />} />
            <Route path="/qibla" element={<Qibla />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            <Route path="/sunnah-prayers" element={<SunnahPrayers />} />
            <Route path="/duha-prayer" element={<DuhaPrayer />} />
            <Route path="/forbidden-times" element={<ForbiddenPrayerTimes />} />
            <Route path="/monthly-prayer-times" element={<MonthlyPrayerTimes />} />
            <Route path="/more" element={<More />} />
            <Route path="/dua-category/:categoryId" element={<DuaCategory />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
            <Route path="/names-of-allah" element={<NamesOfAllah />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppSettingsProvider>
  </QueryClientProvider>
);

export default App;
