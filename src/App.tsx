
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import PrayerTimes from "./pages/PrayerTimes";
import More from "./pages/More";
import Qibla from "./pages/Qibla";
import MonthlyPrayerTimes from "./pages/MonthlyPrayerTimes";
import ForbiddenPrayerTimes from "./pages/ForbiddenPrayerTimes";
import NamesOfAllah from "./pages/NamesOfAllah";
import Settings from "./pages/Settings";
import NotificationsManager from "./pages/NotificationsManager";
import NotificationsHub from "./pages/NotificationsHub";
import AzkarList from "./pages/AzkarList";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import DuaCategory from "./pages/DuaCategory";
import Favorites from "./pages/Favorites";
import Tasbih from "./pages/Tasbih";
import NightDuas from "./pages/NightDuas";
import DuhaPrayer from "./pages/DuhaPrayer";
import SunnahPrayers from "./pages/SunnahPrayers";
import FridaySunnah from "./pages/FridaySunnah";
import SurahKahf from "./pages/SurahKahf";

// Components
import { Toaster } from "@/components/ui/toaster";

// Styles
import "./App.css";

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/more" element={<More />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/monthly-prayer-times" element={<MonthlyPrayerTimes />} />
          <Route path="/forbidden-prayer-times" element={<ForbiddenPrayerTimes />} />
          <Route path="/names-of-allah" element={<NamesOfAllah />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationsManager />} />
          <Route path="/notifications-hub" element={<NotificationsHub />} />
          <Route path="/azkar/:categoryId" element={<AzkarList />} />
          <Route path="/dua-category/:categoryId" element={<DuaCategory />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/search" element={<Search />} />
          <Route path="/night-duas" element={<NightDuas />} />
          <Route path="/duha-prayer" element={<DuhaPrayer />} />
          <Route path="/sunnah-prayers" element={<SunnahPrayers />} />
          <Route path="/friday-sunnah" element={<FridaySunnah />} />
          <Route path="/surah-kahf" element={<SurahKahf />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
