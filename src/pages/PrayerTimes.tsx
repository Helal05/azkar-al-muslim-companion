
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Clock, ChevronLeft, CalendarDays, AlertTriangle } from "lucide-react";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer } from "../data/prayerData";
import Header from "../components/Header";

const PrayerTimes = () => {
  const navigate = useNavigate();
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate());
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes());
  const [nextPrayerTime, setNextPrayerTime] = useState(getTimeToNextPrayer());
  const [cityName, setCityName] = useState("القاهرة"); // Default city
  const [countdown, setCountdown] = useState("");

  // Get next prayer name
  const getNextPrayer = () => {
    const next = prayerTimes.find(prayer => prayer.isNext);
    return next ? next.name : "الفجر";
  };

  // Update prayer times based on location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPrayerTimes(getPrayerTimes(latitude, longitude));
          
          // In a real app, we would use reverse geocoding to get city name
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              if (data.address && data.address.city) {
                setCityName(data.address.city);
              } else if (data.address && data.address.town) {
                setCityName(data.address.town);
              }
            })
            .catch(error => {
              console.error("Error getting city name:", error);
            });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  }, []);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNextPrayerTime(getTimeToNextPrayer());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate elapsed time since last prayer or time until next prayer
  const getElapsedOrRemainingTime = () => {
    const nextPrayer = prayerTimes.find(prayer => prayer.isNext);
    if (nextPrayer) {
      return `${nextPrayer.name} بعد ${nextPrayerTime}`;
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      {/* Sub Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">مواقيت الصلاة</h2>
        <button onClick={() => navigate("/settings")} className="p-2">
          <Bell className="w-5 h-5 text-gray-300" />
        </button>
      </div>
      
      {/* Islamic Date Display */}
      <div className="bg-gray-800 p-3">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-gray-300 text-sm">{islamicDate.gregorianDate}</p>
          </div>
          <div className="text-center">
            <p className="text-amber-400 text-lg font-arabic">{cityName}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm font-arabic">
              {islamicDate.day} {islamicDate.month}
            </p>
          </div>
        </div>
      </div>
      
      {/* Countdown to next prayer */}
      <div className="bg-gray-900 p-4 text-center">
        <div className="mb-1 text-sm text-gray-400 font-arabic">{getNextPrayer()} {getElapsedOrRemainingTime()}</div>
        <div className="text-3xl font-bold text-amber-400 font-arabic">{nextPrayerTime}</div>
      </div>
      
      {/* Prayer Times */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {prayerTimes.map((prayer, index) => (
            <div 
              key={index}
              className={`flex justify-between items-center p-4 rounded-lg ${
                prayer.isNext 
                  ? 'bg-amber-900/20 border border-amber-700/50' 
                  : 'bg-gray-800/50'
              }`}
            >
              <div className="text-left">
                <span className={`text-xl font-arabic ${
                  prayer.isNext ? 'text-amber-400' : 'text-white'
                }`}>
                  {prayer.time}
                </span>
              </div>
              
              <div className="text-right">
                <span className={`text-xl font-arabic ${
                  prayer.isNext ? 'text-amber-400' : 'text-white'
                }`}>
                  {prayer.name}
                </span>
                {prayer.isNext && (
                  <div className="flex items-center text-amber-500 text-sm mt-1">
                    <Bell className="w-4 h-4 mr-1" />
                    <span className="font-arabic">الصلاة القادمة</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Additional Prayer-related options */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/sunnah-prayers")}
            className="bg-black border border-green-800 text-center p-4 rounded-lg"
          >
            <span className="text-green-400 font-arabic text-lg">السنن الرواتب</span>
          </button>
          
          <button
            onClick={() => navigate("/duha-prayer")}
            className="bg-black border border-green-800 text-center p-4 rounded-lg"
          >
            <span className="text-green-400 font-arabic text-lg">صلاة الضحى</span>
          </button>
          
          <button
            onClick={() => navigate("/forbidden-times")}
            className="bg-black border border-red-800 text-center p-4 rounded-lg col-span-2"
          >
            <span className="text-red-400 font-arabic text-lg">أوقات النهي عن الصلاة</span>
          </button>
        </div>
        
        {/* Monthly Calendar Link */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/monthly-prayer-times")}
            className="flex items-center justify-center w-full bg-gray-800 p-4 rounded-lg"
          >
            <CalendarDays className="w-5 h-5 text-amber-400 mr-2" />
            <span className="text-amber-400 font-arabic">جدول مواقيت الصلاة الشهري</span>
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around border-t border-gray-800">
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
          <span className="text-amber-400 font-arabic">الصلاة</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">العداد</span>
        </button>
      </div>
    </div>
  );
};

export default PrayerTimes;
