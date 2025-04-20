import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuranVerse from "../components/QuranVerse";
import { azkarCategories } from "../data/azkarData";
import { quranVerses, naturalBackgrounds } from "../data/duaData";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer } from "../data/prayerData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Search, Heart, Settings, MapPin, Clock, Calendar } from "lucide-react";

const islamicBackgrounds = [
  "/patterns/islamic-pattern.svg",
  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1619817724539-7eda2d359fdb?q=80&w=1471&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=1470&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1638903556115-2da9c323071c?q=80&w=1470&auto=format&fit=crop"
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, toggleDarkMode, requestLocationPermission } = useAppSettings();
  
  const [currentVerse, setCurrentVerse] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate(settings.language));
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes(settings.location.latitude, settings.location.longitude, settings.language));
  const [nextPrayerTime, setNextPrayerTime] = useState(getTimeToNextPrayer(settings.language, true));
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Change Quranic verse and background periodically
  useEffect(() => {
    const verseInterval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % quranVerses.length);
    }, 30000); // Change verse every 30 seconds

    const bgInterval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % islamicBackgrounds.length);
    }, 60000); // Change background every minute

    // Update prayer times and Islamic date every minute
    const timeInterval = setInterval(() => {
      setNextPrayerTime(getTimeToNextPrayer(settings.language, true));
      setIslamicDate(getCurrentIslamicDate(settings.language));
    }, 60000);

    return () => {
      clearInterval(verseInterval);
      clearInterval(bgInterval);
      clearInterval(timeInterval);
    };
  }, [settings.language]);

  // Apply language changes and get user's location for accurate prayer times
  useEffect(() => {
    setPrayerTimes(getPrayerTimes(settings.location.latitude, settings.location.longitude, settings.language));
    setIslamicDate(getCurrentIslamicDate(settings.language));
  }, [settings.location, settings.language]);
  
  // Auto request location on first load
  useEffect(() => {
    const hasRequestedLocation = localStorage.getItem("location-requested");
    if (!hasRequestedLocation) {
      requestLocationPermission();
      localStorage.setItem("location-requested", "true");
    }
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem("search-query", searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Get next prayer name and time
  const getNextPrayer = () => {
    const next = prayerTimes.find(prayer => prayer.isNext);
    return next ? `${next.name} ${next.time}` : "الفجر ص ٤:١١";
  };

  // Share app functionality
  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: settings.language === "ar" ? "تطبيق أذكاري" : "Azkari App",
        text: settings.language === "ar" 
          ? "تطبيق للأذكار والأدعية الإسلامية" 
          : "Islamic app for Azkar and Duas",
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      toast({
        title: settings.language === "ar" ? "المشاركة غير متاحة" : "Sharing not available",
        description: settings.language === "ar" 
          ? "متصفحك لا يدعم ميزة المشاركة" 
          : "Your browser doesn't support the share feature"
      });
    }
  };

  // Modern Islamic categories with their colors and icons
  const azkarMenuItems = [
    { 
      id: "morning", 
      title: settings.language === "ar" ? "أذكار الصباح" : "Morning Azkar", 
      borderColor: "border-cyan-700",
      textColor: "text-cyan-500", 
      gradientFrom: "from-cyan-900/20", 
      gradientTo: "to-cyan-800/5" 
    },
    { 
      id: "evening", 
      title: settings.language === "ar" ? "أذكار المساء" : "Evening Azkar", 
      borderColor: "border-indigo-700",
      textColor: "text-indigo-500", 
      gradientFrom: "from-indigo-900/20", 
      gradientTo: "to-indigo-800/5" 
    },
    { 
      id: "night-duas", 
      title: settings.language === "ar" ? "أدعية الليل" : "Night Duas", 
      borderColor: "border-violet-700",
      textColor: "text-violet-500", 
      gradientFrom: "from-violet-900/20", 
      gradientTo: "to-violet-800/5" 
    },
    { 
      id: "afterPrayer", 
      title: settings.language === "ar" ? "أذكار بعد الصلاة" : "After Prayer Azkar", 
      borderColor: "border-emerald-700",
      textColor: "text-emerald-500", 
      gradientFrom: "from-emerald-900/20", 
      gradientTo: "to-emerald-800/5" 
    },
    { 
      id: "sleep", 
      title: settings.language === "ar" ? "أذكار النوم" : "Sleep Azkar", 
      borderColor: "border-blue-700",
      textColor: "text-blue-500", 
      gradientFrom: "from-blue-900/20", 
      gradientTo: "to-blue-800/5" 
    },
    { 
      id: "wakeup", 
      title: settings.language === "ar" ? "أذكار الاستيقاظ" : "Wakeup Azkar", 
      borderColor: "border-teal-700",
      textColor: "text-teal-500", 
      gradientFrom: "from-teal-900/20", 
      gradientTo: "to-teal-800/5" 
    },
    { 
      id: "quranDuas", 
      title: settings.language === "ar" ? "أدعية من القرآن" : "Duas from Quran", 
      borderColor: "border-amber-700",
      textColor: "text-amber-500", 
      gradientFrom: "from-amber-900/20", 
      gradientTo: "to-amber-800/5" 
    },
    { 
      id: "prophet", 
      title: settings.language === "ar" ? "من دعاء الرسول ﷺ" : "Prophet's Duas ﷺ", 
      borderColor: "border-purple-700",
      textColor: "text-purple-500", 
      gradientFrom: "from-purple-900/20", 
      gradientTo: "to-purple-800/5" 
    },
    { 
      id: "names", 
      title: settings.language === "ar" ? "أسماء الله الحسنى" : "Allah's Names", 
      borderColor: "border-rose-700",
      textColor: "text-rose-500", 
      gradientFrom: "from-rose-900/20", 
      gradientTo: "to-rose-800/5",
      path: "/names-of-allah"
    },
    { 
      id: "ruqyah", 
      title: settings.language === "ar" ? "الرقية الشرعية" : "Ruqyah", 
      borderColor: "border-green-700",
      textColor: "text-green-500", 
      gradientFrom: "from-green-900/20", 
      gradientTo: "to-green-800/5" 
    },
    { 
      id: "tasbih", 
      title: settings.language === "ar" ? "تسابيح" : "Tasbeeh",
      path: "/tasbih",
      borderColor: "border-sky-700",
      textColor: "text-sky-500", 
      gradientFrom: "from-sky-900/20", 
      gradientTo: "to-sky-800/5" 
    },
    { 
      id: "more", 
      title: settings.language === "ar" ? "المزيد" : "More", 
      path: "/more",
      borderColor: "border-gray-700",
      textColor: "text-gray-400", 
      gradientFrom: "from-gray-900/20", 
      gradientTo: "to-gray-800/5" 
    },
  ];

  // Get the next prayer that's highlighted
  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header with QuranVerse component */}
      <QuranVerse />
      
      {/* Keep the rest of the components */}
      {/* Date & Prayer Time Info */}
      <div className="bg-slate-800/80 border-t border-b border-white/10 backdrop-blur-md">
        {/* Islamic Date Display */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center text-xs text-white/70">
            <Calendar className="h-3.5 w-3.5 ml-1 rtl:mr-1 text-white/70" />
            <span className="text-white/70">{islamicDate.gregorianDate}</span>
          </div>
          
          <div className="text-sm font-arabic font-semibold text-amber-400/90">
            {islamicDate.day} {islamicDate.month} {settings.language === "ar" ? "" : islamicDate.year}
            {settings.language === "ar" ? "هـ" : "H"}
          </div>
          
          <button 
            onClick={() => requestLocationPermission()}
            className="flex items-center text-xs hover:bg-slate-700/20 p-1 rounded transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 ml-1 text-white/70" />
            <span className="text-white/70">{settings.location.city}</span>
          </button>
        </div>
        
        {/* Next Prayer Time */}
        <div className="border-t border-white/5 px-4 py-3 flex justify-between items-center">
          <div className="flex flex-col items-center">
            <p className="text-xs mb-1 text-white/70">
              {settings.language === "ar" ? "متبقي للصلاة" : "Time remaining"}
            </p>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 ml-1 text-white/70" />
              <p className="text-white font-semibold">{nextPrayerTime}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-xs mb-1 text-white/70">
              {settings.language === "ar" ? "الصلاة القادمة" : "Next prayer"}
            </p>
            <p className="font-arabic font-semibold text-amber-400">{nextPrayer?.name}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-xs mb-1 text-white/70">
              {settings.language === "ar" ? "وقت الصلاة" : "Prayer time"}
            </p>
            <p className="font-semibold font-arabic text-white">{nextPrayer?.time}</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-900/90 py-2.5 flex justify-around border-b border-white/5 backdrop-blur-md">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="font-arabic text-gray-400">
            {settings.language === "ar" ? "المنوعة" : "Misc"}
          </span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="font-arabic text-gray-400">
            {settings.language === "ar" ? "المفضلة" : "Favorites"}
          </span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="font-arabic text-gray-400">
            {settings.language === "ar" ? "القبلة" : "Qibla"}
          </span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="font-arabic text-gray-400">
            {settings.language === "ar" ? "الصلاة" : "Prayer"}
          </span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="font-arabic text-gray-400">
            {settings.language === "ar" ? "العداد" : "Counter"}
          </span>
        </button>
      </div>

      {/* Main Content - Categories Grid */}
      <div className="flex-1 py-5 px-3 overflow-y-auto">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {azkarMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.path ? navigate(item.path) : navigate(`/category/${item.id}`)}
              className={`p-4 rounded-lg bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} border ${item.borderColor} text-center transition-all duration-300 hover:shadow-lg hover:shadow-${item.borderColor}/10 active:scale-95`}
            >
              <span className={`text-lg ${item.textColor} font-arabic`}>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
