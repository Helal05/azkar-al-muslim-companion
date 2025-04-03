
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { azkarCategories } from "../data/azkarData";
import { quranVerses, naturalBackgrounds } from "../data/duaData";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer, getForbiddenPrayerTimes } from "../data/prayerData";
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

  // Detect user's location for prayer times
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPrayerTimes(getPrayerTimes(latitude, longitude));
        },
        (error) => {
          console.log("Error getting location:", error);
          // Use default location if permission denied
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
  
  const forbiddenTimes = getForbiddenPrayerTimes();

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950 text-center">
      {/* Header with Islamic date */}
      <div 
        className="w-full bg-black text-white py-6 px-4 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${naturalBackgrounds[backgroundIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-5xl">🌙</div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-arabic font-bold text-amber-300">
              {new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}
            </h1>
            <p className="text-white text-sm">{islamicDate.gregorianDate}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-4xl font-arabic text-amber-300">{islamicDate.day}</span>
            <span className="text-lg font-arabic">{islamicDate.month}</span>
          </div>
        </div>
        
        {/* Quran verse */}
        <div className="mt-4 mb-2">
          <p className="text-white text-xl font-arabic font-bold text-center">
            {quranVerses[currentVerse].verse}
          </p>
        </div>
      </div>

      {/* Prayer Times Section */}
      <div className="bg-black text-white">
        <div className="rounded-lg mx-2 my-4 overflow-hidden border border-gray-800">
          <div className="px-4 py-2 bg-black text-center">
            <h2 className="text-xl font-arabic font-bold">مواقيت الصلاة</h2>
          </div>
          
          {/* Next Prayer Countdown */}
          <div className="bg-gray-900 px-4 py-3 border-b border-gray-800">
            <p className="text-amber-400 text-sm font-arabic text-right">
              {getNextPrayer()} · بعد
            </p>
            <p className="text-amber-400 text-3xl font-arabic text-center mt-1">
              {nextPrayerTime}
            </p>
            <div className="flex items-center bg-red-900/20 px-3 py-1 mt-2 rounded-md">
              <div className="w-1 h-full bg-red-600 mr-2"></div>
              <p className="text-sm font-arabic text-right">
                {forbiddenTimes[0].description}
                <br />
                <span className="text-xs text-gray-400">{forbiddenTimes[0].timeRange}</span>
              </p>
            </div>
          </div>
          
          {/* Prayer Times Grid */}
          <div className="grid grid-cols-2 gap-2 p-2">
            {prayerTimes.slice(0, 6).map((prayer, index) => (
              <div 
                key={prayer.name}
                className={`p-3 flex flex-col items-center ${
                  prayer.isNext ? 'bg-gray-700/50' : 'bg-gray-800/30'
                } rounded-lg`}
              >
                <div className="mb-1">
                  <Bell className="h-4 w-4 text-gray-400" />
                </div>
                <div className="font-arabic">
                  <h3 className={`text-lg ${prayer.isNext ? 'text-amber-400' : 'text-white'}`}>
                    {prayer.name}
                  </h3>
                  <p className={`${prayer.isNext ? 'text-amber-400' : 'text-gray-300'}`}>
                    {prayer.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Prayer Times */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-gray-900/50">
            {prayerTimes.slice(6).map((prayer) => (
              <div 
                key={prayer.name}
                className="p-2 flex flex-col items-center bg-gray-800/30 rounded-lg"
              >
                <div className="mb-1">
                  <Bell className="h-3 w-3 text-gray-400" />
                </div>
                <div className="font-arabic">
                  <h3 className="text-sm text-white">{prayer.name}</h3>
                  <p className="text-gray-300 text-sm">{prayer.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Buttons for Rawatib and Duha */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-gray-900/50">
            <button
              onClick={() => navigate("/sunnah-prayers")}
              className="p-4 bg-black rounded-lg text-center"
            >
              <span className="text-lg font-arabic text-white">السنن الرواتب</span>
            </button>
            <button
              onClick={() => navigate("/duha-prayer")}
              className="p-4 bg-black rounded-lg text-center"
            >
              <span className="text-lg font-arabic text-white">صلاة الضحى</span>
            </button>
          </div>
          
          {/* Forbidden Prayer Times Button */}
          <div className="p-2 bg-gray-900/50">
            <button
              onClick={() => navigate("/forbidden-times")}
              className="w-full p-4 bg-black rounded-lg text-center"
            >
              <span className="text-lg font-arabic text-white">أوقات النهي عن الصلاة</span>
            </button>
          </div>
        </div>
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
      
      {/* Top App Bar */}
      <div className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button onClick={toggleDarkMode}>
            {darkMode ? 
              <Sun size={20} className="text-gray-300" /> : 
              <Moon size={20} className="text-gray-300" />
            }
          </button>
          <button onClick={() => setShowSearch(!showSearch)}>
            <Search size={20} className="text-gray-300" />
          </button>
          <button onClick={() => navigate("/favorites")}>
            <Heart size={20} className="text-gray-300" />
          </button>
        </div>
        
        <div>
          <button
            onClick={() => navigate("/prayer-times")}
            className="text-sm text-white text-right text-nowrap"
          >
            {getNextPrayer()}
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 bg-black py-4 px-3">
        {/* Special Dua */}
        <div className="mb-5 bg-black border border-purple-800 rounded-lg p-4">
          <p className="text-purple-400 text-xl font-arabic">دعاء من تعار من الليل</p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {azkarCategories.map((category) => {
            if (category.id === "qibla" || category.id === "tasbih") {
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/${category.id}`)}
                  className={`p-4 rounded-lg bg-black border border-${category.id === "qibla" ? "rose" : "teal"}-800 text-center`}
                >
                  <span className={`text-xl ${category.textColor} font-arabic`}>{category.name}</span>
                </button>
              );
            }
            
            return (
              <button
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className={`p-4 rounded-lg bg-black border border-${category.id === "names" ? "rose" : category.id === "quran" ? "emerald" : category.id === "prophet" ? "amber" : category.id === "morning" ? "cyan" : category.id === "evening" ? "pink" : category.id === "ruqyah" ? "teal" : category.id === "ruqyahSunnah" ? "green" : category.id === "more" ? "lime" : "blue"}-800 text-center`}
              >
                <span className={`text-xl ${category.textColor} font-arabic`}>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">المزيد</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">القبلة</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">الصلاة</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">المفضلة</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">العداد</span>
        </button>
      </div>
    </div>
  );
};

export default Index;
