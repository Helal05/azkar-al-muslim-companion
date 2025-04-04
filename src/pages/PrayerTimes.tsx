
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Clock, ChevronLeft, CalendarDays, AlertTriangle, MapPin } from "lucide-react";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer } from "../data/prayerData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { useToast } from "@/hooks/use-toast";

const PrayerTimes = () => {
  const navigate = useNavigate();
  const { settings, updateNotificationSettings, requestLocationPermission } = useAppSettings();
  const { t } = useTranslation(settings.language);
  const { toast } = useToast();
  
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate());
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes(settings.location.latitude, settings.location.longitude));
  const [nextPrayerTime, setNextPrayerTime] = useState(getTimeToNextPrayer());

  // Get next prayer name
  const getNextPrayer = () => {
    const next = prayerTimes.find(prayer => prayer.isNext);
    return next ? next.name : t('fajr');
  };

  // Update prayer times based on location
  useEffect(() => {
    setPrayerTimes(getPrayerTimes(settings.location.latitude, settings.location.longitude));
  }, [settings.location]);

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
      return `${nextPrayer.name} ${settings.language === "ar" ? "بعد" : "in"} ${nextPrayerTime}`;
    }
    return "";
  };

  // Toggle prayer notifications
  const toggleNotifications = () => {
    if (!settings.notifications.enabled) {
      // Request permission
      Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
          updateNotificationSettings({ enabled: true, prayerReminders: true });
          
          toast({
            title: settings.language === "ar" ? "تم تفعيل الإشعارات" : "Notifications Enabled",
            description: settings.language === "ar" 
              ? "ستتلقى تنبيهات بأوقات الصلاة" 
              : "You will receive prayer time alerts"
          });
          
          // Show sample notification
          new Notification(settings.language === "ar" ? "أذكاري" : "Azkari", {
            body: settings.language === "ar" 
              ? "تم تفعيل تنبيهات الصلاة" 
              : "Prayer time alerts activated"
          });
        }
      });
    } else {
      updateNotificationSettings({ prayerReminders: !settings.notifications.prayerReminders });
      
      toast({
        title: settings.notifications.prayerReminders 
          ? (settings.language === "ar" ? "تم إيقاف الإشعارات" : "Notifications Disabled")
          : (settings.language === "ar" ? "تم تفعيل الإشعارات" : "Notifications Enabled"),
        description: settings.notifications.prayerReminders
          ? (settings.language === "ar" ? "لن تتلقى تنبيهات بأوقات الصلاة" : "You won't receive prayer time alerts")
          : (settings.language === "ar" ? "ستتلقى تنبيهات بأوقات الصلاة" : "You will receive prayer time alerts")
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Sub Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">{t('prayerTimes')}</h2>
        <button onClick={toggleNotifications} className="p-2">
          <Bell className={`w-5 h-5 ${settings.notifications.prayerReminders ? "text-amber-400" : "text-gray-300"}`} />
        </button>
      </div>
      
      {/* Islamic Date Display */}
      <div className="bg-slate-800/50 p-3">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-gray-300 text-sm">{islamicDate.gregorianDate}</p>
          </div>
          <div className="flex items-center text-center">
            <MapPin className="w-4 h-4 text-amber-400 mr-1.5" />
            <p className="text-amber-400 text-lg font-arabic">{settings.location.city}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm font-arabic">
              {islamicDate.day} {islamicDate.month}
            </p>
          </div>
        </div>
      </div>
      
      {/* Countdown to next prayer */}
      <div className="bg-slate-800/30 p-4 text-center">
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
                  : 'bg-slate-800/50'
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
                  {settings.language === "ar" 
                    ? prayer.name 
                    : t(prayer.name.toLowerCase() as any)}
                </span>
                {prayer.isNext && (
                  <div className="flex items-center text-amber-500 text-sm mt-1">
                    <Bell className="w-4 h-4 mr-1" />
                    <span className="font-arabic">{t('nextPrayer')}</span>
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
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/20 border border-green-800/30 text-center p-4 rounded-lg"
          >
            <span className="text-green-400 font-arabic text-lg">{t('sunnahPrayers')}</span>
          </button>
          
          <button
            onClick={() => navigate("/duha-prayer")}
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/20 border border-green-800/30 text-center p-4 rounded-lg"
          >
            <span className="text-green-400 font-arabic text-lg">{t('duhaPrayer')}</span>
          </button>
          
          <button
            onClick={() => navigate("/forbidden-times")}
            className="bg-gradient-to-br from-slate-800/60 to-slate-800/20 border border-red-800/30 text-center p-4 rounded-lg col-span-2"
          >
            <span className="text-red-400 font-arabic text-lg">{t('forbiddenPrayerTimes')}</span>
          </button>
        </div>
        
        {/* Monthly Calendar Link */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/monthly-prayer-times")}
            className="flex items-center justify-center w-full bg-gradient-to-br from-slate-800/60 to-slate-800/20 p-4 rounded-lg border border-amber-800/30"
          >
            <CalendarDays className="w-5 h-5 text-amber-400 mr-2" />
            <span className="text-amber-400 font-arabic">
              {settings.language === "ar" 
                ? "جدول مواقيت الصلاة الشهري" 
                : "Monthly Prayer Times Calendar"}
            </span>
          </button>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-slate-900/90 text-white py-3 flex justify-around border-t border-white/10 backdrop-blur-md">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">{settings.language === "ar" ? "المزيد" : "More"}</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">{settings.language === "ar" ? "المفضلة" : "Favorites"}</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">{settings.language === "ar" ? "القبلة" : "Qibla"}</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-amber-400 font-arabic">{settings.language === "ar" ? "الصلاة" : "Prayer"}</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">{settings.language === "ar" ? "العداد" : "Counter"}</span>
        </button>
      </div>
    </div>
  );
};

export default PrayerTimes;
