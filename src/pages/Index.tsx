
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { azkarCategories } from "../data/azkarData";
import { quranVerses, naturalBackgrounds } from "../data/duaData";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer } from "../data/prayerData";
import { useToast } from "@/hooks/use-toast";
import { Search, Heart, Bell, Settings, Moon, Sun } from "lucide-react";

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

  return (
    <div className="flex flex-col min-h-screen bg-black text-center">
      {/* Header with Islamic verse on natural background */}
      <div 
        className="w-full bg-black text-white py-6 px-4 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${naturalBackgrounds[backgroundIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Search 
              className="h-6 w-6 text-white" 
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
          <Heart 
            className="h-6 w-6 text-white"
            onClick={() => navigate("/favorites")}
          />
        </div>
        
        {/* Quran verse */}
        <div className="mt-4 mb-8">
          <p className="text-white text-3xl font-arabic font-bold text-center">
            {quranVerses[currentVerse].verse}
          </p>
        </div>
      </div>

      {/* Next Prayer Strip */}
      <div className="bg-gray-800 flex justify-between items-center p-2 text-white">
        <div className="text-right font-arabic">
          <span className="text-xl">{islamicDate.day} {islamicDate.month}</span>
        </div>
        
        <div className="flex items-center justify-center bg-gray-700 rounded-md px-3 py-1">
          <span className="text-2xl font-arabic">۵</span>
        </div>
        
        <div className="flex justify-between w-full px-2">
          <div className="text-right font-arabic">
            <span>الشروق {prayerTimes[1].time}</span>
          </div>
          <div className="text-left font-arabic">
            <span>الفجر {prayerTimes[0].time}</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around border-t border-b border-gray-800">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">المنوعة</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">المفضلة</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">القبلة</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">الصلاة</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">العداد</span>
        </button>
      </div>

      {/* Search Bar - Conditionally displayed */}
      {showSearch && (
        <div className="bg-black px-4 py-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث ..."
              className="w-full bg-gray-900 text-white rounded-lg py-2 px-4 font-arabic text-right"
            />
            <button
              type="submit"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </form>
        </div>
      )}

      {/* Special Dua Card */}
      <div className="flex-1 bg-black py-4 px-3">
        <div 
          className="mb-5 rounded-lg p-4 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${naturalBackgrounds[(backgroundIndex + 2) % naturalBackgrounds.length]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <p className="text-purple-300 text-xl font-arabic text-center">دعاء (من تعار من الليل)</p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Azkar Button Group */}
          <button
            onClick={() => navigate("/category/morning")}
            className="p-4 rounded-lg bg-black border border-cyan-800 text-center"
          >
            <span className="text-xl text-cyan-400 font-arabic">أذكار الصباح</span>
          </button>
          
          <button
            onClick={() => navigate("/category/athkar")}
            className="p-4 rounded-lg bg-black border border-cyan-800 text-center"
          >
            <span className="text-xl text-cyan-400 font-arabic">أذكاري</span>
          </button>
          
          <button
            onClick={() => navigate("/category/evening")}
            className="p-4 rounded-lg bg-black border border-pink-800 text-center"
          >
            <span className="text-xl text-pink-400 font-arabic">أذكار المساء</span>
          </button>
          
          <button
            onClick={() => navigate("/category/names")}
            className="p-4 rounded-lg bg-black border border-rose-800 text-center"
          >
            <span className="text-xl text-rose-400 font-arabic">أسماء الله الحسنى</span>
          </button>
          
          <button
            onClick={() => navigate("/category/prayerAthkar")}
            className="p-4 rounded-lg bg-black border border-amber-800 text-center"
          >
            <span className="text-xl text-amber-400 font-arabic">أذكار الصلاة</span>
          </button>
          
          <button
            onClick={() => navigate("/category/afterPrayer")}
            className="p-4 rounded-lg bg-black border border-blue-800 text-center"
          >
            <span className="text-xl text-blue-400 font-arabic">أذكار بعد الصلاة</span>
          </button>
          
          <button
            onClick={() => navigate("/category/sleep")}
            className="p-4 rounded-lg bg-black border border-purple-800 text-center"
          >
            <span className="text-xl text-purple-400 font-arabic">أذكار النوم</span>
          </button>
          
          <button
            onClick={() => navigate("/category/wakeup")}
            className="p-4 rounded-lg bg-black border border-green-800 text-center"
          >
            <span className="text-xl text-green-400 font-arabic">أذكار الاستيقاظ</span>
          </button>
          
          <button
            onClick={() => navigate("/category/quranDuas")}
            className="p-4 rounded-lg bg-black border border-emerald-800 text-center"
          >
            <span className="text-xl text-emerald-400 font-arabic">أدعية من القرآن</span>
          </button>
          
          <button
            onClick={() => navigate("/category/prophet")}
            className="p-4 rounded-lg bg-black border border-amber-800 text-center"
          >
            <span className="text-xl text-amber-400 font-arabic">من دعاء الرسول ﷺ</span>
          </button>
          
          <button
            onClick={() => navigate("/category/ruqyah")}
            className="p-4 rounded-lg bg-black border border-teal-800 text-center"
          >
            <span className="text-xl text-teal-400 font-arabic">الرقية بالقرآن</span>
          </button>
          
          <button
            onClick={() => navigate("/category/ruqyahSunnah")}
            className="p-4 rounded-lg bg-black border border-green-800 text-center"
          >
            <span className="text-xl text-green-400 font-arabic">الرقية بالسنة</span>
          </button>
          
          <button
            onClick={() => navigate("/tasbih")}
            className="p-4 rounded-lg bg-black border border-teal-800 text-center"
          >
            <span className="text-xl text-teal-400 font-arabic">تسابيح</span>
          </button>
          
          <button
            onClick={() => navigate("/more")}
            className="p-4 rounded-lg bg-black border border-lime-800 text-center"
          >
            <span className="text-xl text-lime-400 font-arabic">المزيد</span>
          </button>
        </div>
      </div>

      {/* Settings Button */}
      <div className="fixed top-4 right-4">
        <button
          onClick={() => navigate("/settings")}
          className="p-2 bg-black/50 rounded-full"
        >
          <Settings className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Index;
