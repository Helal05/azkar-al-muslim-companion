
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { azkarCategories } from "../data/azkarData";
import { quranVerses, naturalBackgrounds } from "../data/duaData";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer } from "../data/prayerData";
import { useToast } from "@/hooks/use-toast";
import { Search, Heart, Bell, Settings, Moon, Sun, MapPin, Clock, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [currentVerse, setCurrentVerse] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate());
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes());
  const [nextPrayerTime, setNextPrayerTime] = useState(getTimeToNextPrayer());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  // Change Quranic verse and background periodically
  useEffect(() => {
    const verseInterval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % quranVerses.length);
    }, 60000); // Change verse every minute

    const bgInterval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % naturalBackgrounds.length);
    }, 120000); // Change background every 2 minutes

    // Update prayer times every minute
    const timeInterval = setInterval(() => {
      setNextPrayerTime(getTimeToNextPrayer());
    }, 60000);

    return () => {
      clearInterval(verseInterval);
      clearInterval(bgInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Get user's location for accurate prayer times
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPrayerTimes(getPrayerTimes(latitude, longitude));
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "جاري البحث...",
        description: `البحث عن: ${searchQuery}`,
      });
      // In a real app, this would search through all azkar and duas
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
        title: "تطبيق أذكاري",
        text: "تطبيق للأذكار والأدعية الإسلامية",
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      toast({
        title: "المشاركة غير متاحة",
        description: "متصفحك لا يدعم ميزة المشاركة"
      });
    }
  };

  // Modern Islamic categories with their colors and icons
  const azkarMenuItems = [
    { 
      id: "morning", 
      title: "أذكار الصباح", 
      borderColor: "border-cyan-700",
      textColor: "text-cyan-500", 
      gradientFrom: "from-cyan-900/20", 
      gradientTo: "to-cyan-800/5" 
    },
    { 
      id: "evening", 
      title: "أذكار المساء", 
      borderColor: "border-indigo-700",
      textColor: "text-indigo-500", 
      gradientFrom: "from-indigo-900/20", 
      gradientTo: "to-indigo-800/5" 
    },
    { 
      id: "afterPrayer", 
      title: "أذكار بعد الصلاة", 
      borderColor: "border-emerald-700",
      textColor: "text-emerald-500", 
      gradientFrom: "from-emerald-900/20", 
      gradientTo: "to-emerald-800/5" 
    },
    { 
      id: "sleep", 
      title: "أذكار النوم", 
      borderColor: "border-blue-700",
      textColor: "text-blue-500", 
      gradientFrom: "from-blue-900/20", 
      gradientTo: "to-blue-800/5" 
    },
    { 
      id: "wakeup", 
      title: "أذكار الاستيقاظ", 
      borderColor: "border-teal-700",
      textColor: "text-teal-500", 
      gradientFrom: "from-teal-900/20", 
      gradientTo: "to-teal-800/5" 
    },
    { 
      id: "quranDuas", 
      title: "أدعية من القرآن", 
      borderColor: "border-amber-700",
      textColor: "text-amber-500", 
      gradientFrom: "from-amber-900/20", 
      gradientTo: "to-amber-800/5" 
    },
    { 
      id: "prophet", 
      title: "من دعاء الرسول ﷺ", 
      borderColor: "border-purple-700",
      textColor: "text-purple-500", 
      gradientFrom: "from-purple-900/20", 
      gradientTo: "to-purple-800/5" 
    },
    { 
      id: "names", 
      title: "أسماء الله الحسنى", 
      borderColor: "border-rose-700",
      textColor: "text-rose-500", 
      gradientFrom: "from-rose-900/20", 
      gradientTo: "to-rose-800/5" 
    },
    { 
      id: "ruqyah", 
      title: "الرقية بالقرآن", 
      borderColor: "border-green-700",
      textColor: "text-green-500", 
      gradientFrom: "from-green-900/20", 
      gradientTo: "to-green-800/5" 
    },
    { 
      id: "ruqyahSunnah", 
      title: "الرقية بالسنة", 
      borderColor: "border-emerald-700",
      textColor: "text-emerald-500", 
      gradientFrom: "from-emerald-900/20", 
      gradientTo: "to-emerald-800/5" 
    },
    { 
      id: "tasbih", 
      title: "تسابيح", 
      path: "/tasbih",
      borderColor: "border-sky-700",
      textColor: "text-sky-500", 
      gradientFrom: "from-sky-900/20", 
      gradientTo: "to-sky-800/5" 
    },
    { 
      id: "more", 
      title: "المزيد", 
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header with Islamic pattern overlay and Quran verse */}
      <div 
        className="relative w-full text-white py-6 px-4 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${naturalBackgrounds[backgroundIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Islamic Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-15" 
          style={{
            backgroundImage: "url('/patterns/islamic-pattern.svg')",
            backgroundSize: '300px',
            backgroundRepeat: 'repeat'
          }}
        />
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-6 w-6 text-white/80 hover:text-white transition-colors" />
          </button>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button onClick={() => navigate("/favorites")} className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <Heart className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
            </button>
            <button onClick={() => navigate("/settings")} className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              <Settings className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
            </button>
            <button onClick={toggleDarkMode} className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
              {darkMode ? 
                <Sun className="h-5 w-5 text-white/80 hover:text-white transition-colors" /> :
                <Moon className="h-5 w-5 text-white/80 hover:text-white transition-colors" />
              }
            </button>
          </div>
        </div>
        
        {/* Search Bar - Conditionally displayed */}
        {showSearch && (
          <div className="mb-4 relative z-10">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث ..."
                className="w-full bg-white/10 backdrop-blur-md text-white rounded-lg py-2.5 px-4 font-arabic text-right border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-white/60" />
              </button>
            </form>
          </div>
        )}
        
        {/* Quran verse */}
        <div className="mt-6 mb-8 relative z-10">
          <p className="text-white text-xl md:text-2xl font-arabic font-bold text-center leading-relaxed">
            {quranVerses[currentVerse].verse}
          </p>
          <p className="text-white/70 text-xs text-center mt-2 font-arabic">
            {quranVerses[currentVerse].surah}
          </p>
        </div>
      </div>

      {/* Date & Prayer Time Info */}
      <div className="bg-slate-800/80 border-t border-b border-white/10 backdrop-blur-md">
        {/* Islamic Date Display */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center text-xs text-white/70">
            <Calendar className="h-3.5 w-3.5 ml-1 rtl:mr-1" />
            <span>{islamicDate.gregorianDate}</span>
          </div>
          
          <div className="text-amber-400/90 text-sm font-arabic font-semibold">
            {islamicDate.day} {islamicDate.month} {islamicDate.year}هـ
          </div>
          
          <div className="flex items-center text-xs text-white/70">
            <MapPin className="h-3.5 w-3.5 ml-1 rtl:mr-1" />
            <span>مكة المكرمة</span>
          </div>
        </div>
        
        {/* Next Prayer Time */}
        <div className="border-t border-white/5 px-4 py-3 flex justify-between items-center">
          <div className="flex flex-col items-center">
            <p className="text-white/70 text-xs mb-1">متبقي للصلاة</p>
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 text-white/70 ml-1" />
              <p className="text-white font-semibold">{nextPrayerTime}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white/70 text-xs mb-1">الصلاة القادمة</p>
            <p className="text-amber-400 font-arabic font-semibold">{nextPrayer?.name}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <p className="text-white/70 text-xs mb-1">وقت الصلاة</p>
            <p className="text-white font-semibold font-arabic">{nextPrayer?.time}</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-900/90 text-white py-2.5 flex justify-around border-b border-white/5 backdrop-blur-md">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">المنوعة</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">المفضلة</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">القبلة</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">الصلاة</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">العداد</span>
        </button>
      </div>

      {/* Main Content - Categories Grid */}
      <div className="flex-1 py-5 px-3">
        {/* Special Dua Card */}
        <div 
          className="mb-5 rounded-lg p-4 overflow-hidden border border-violet-800/30 bg-gradient-to-r from-violet-900/20 to-violet-800/5"
        >
          <p className="text-violet-400 text-xl font-arabic text-center">دعاء (من تعار من الليل)</p>
        </div>
        
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
