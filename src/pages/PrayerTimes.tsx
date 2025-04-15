
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Clock, ChevronLeft, CalendarDays, MapPin, ChevronRight } from "lucide-react";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer } from "../data/prayerData";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const PrayerTimes = () => {
  const navigate = useNavigate();
  const { settings, updateNotificationSettings, requestLocationPermission } = useAppSettings();
  const { t } = useTranslation(settings.language);
  const { toast } = useToast();
  
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate(settings.language));
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes(settings.location.latitude, settings.location.longitude, settings.language));
  const [nextPrayerTime, setNextPrayerTime] = useState(getTimeToNextPrayer(settings.language, true));
  const [showNotificationOptions, setShowNotificationOptions] = useState(false);
  const [gregorianDate, setGregorianDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  // Format current date
  useEffect(() => {
    const today = new Date();
    const dayNames = {
      ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
      en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    };
    
    setDayOfWeek(settings.language === "ar" ? dayNames.ar[today.getDay()] : dayNames.en[today.getDay()]);
    
    if (settings.language === "ar") {
      const day = today.getDate().toString().padStart(2, '0');
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const year = today.getFullYear();
      setGregorianDate(`${day}/${month}/${year}`);
    } else {
      setGregorianDate(format(today, 'dd/MM/yyyy'));
    }
  }, [settings.language]);

  // Update Islamic date whenever settings change
  useEffect(() => {
    setIslamicDate(getCurrentIslamicDate(settings.language));
  }, [settings.language]);

  // Get next prayer name
  const getNextPrayer = () => {
    const next = prayerTimes.find(prayer => prayer.isNext);
    return next ? next.name : t('fajr');
  };

  // Update prayer times based on location
  useEffect(() => {
    setPrayerTimes(getPrayerTimes(settings.location.latitude, settings.location.longitude, settings.language));
  }, [settings.location, settings.language]);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNextPrayerTime(getTimeToNextPrayer(settings.language, true));
    }, 1000); // Update every second for accurate countdown

    return () => clearInterval(interval);
  }, [settings.language]);

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
    setShowNotificationOptions(!showNotificationOptions);
  };
  
  // Enable notifications with specific settings
  const enableNotifications = (type: 'atAdhan' | 'iqamah' | 'both' | 'none') => {
    // Request permission
    Notification.requestPermission().then(function(permission) {
      if (permission === "granted") {
        updateNotificationSettings({ 
          enabled: type !== 'none', 
          prayerReminders: type !== 'none',
          reminderType: type 
        });
        
        const notificationTitle = settings.language === "ar" ? "تم تفعيل الإشعارات" : "Notifications Enabled";
        let notificationDescription = "";
        
        if (settings.language === "ar") {
          switch(type) {
            case 'atAdhan':
              notificationDescription = "ستتلقى تنبيهات عند وقت الأذان";
              break;
            case 'iqamah':
              notificationDescription = "ستتلقى تنبيهات عند وقت الإقامة";
              break;
            case 'both':
              notificationDescription = "ستتلقى تنبيهات عند وقت الأذان والإقامة";
              break;
            case 'none':
              notificationDescription = "تم إيقاف تنبيهات الصلاة";
              break;
          }
        } else {
          switch(type) {
            case 'atAdhan':
              notificationDescription = "You will receive alerts at Adhan time";
              break;
            case 'iqamah':
              notificationDescription = "You will receive alerts at Iqamah time";
              break;
            case 'both':
              notificationDescription = "You will receive alerts at both Adhan and Iqamah times";
              break;
            case 'none':
              notificationDescription = "Prayer notifications have been turned off";
              break;
          }
        }
        
        toast({
          title: type === 'none' 
            ? (settings.language === "ar" ? "تم إيقاف الإشعارات" : "Notifications Disabled")
            : notificationTitle,
          description: notificationDescription
        });
        
        // Show sample notification if enabled
        if (type !== 'none') {
          new Notification(settings.language === "ar" ? "أذكاري" : "Azkari", {
            body: notificationDescription
          });
        }
        
        setShowNotificationOptions(false);
      }
    });
  };

  // Update location
  const updateLocation = async () => {
    const success = await requestLocationPermission();
    if (success) {
      toast({
        title: settings.language === "ar" ? "تم تحديث الموقع" : "Location Updated",
        description: settings.language === "ar" 
          ? `تم تحديث موقعك (${settings.location.city}) ومواقيت الصلاة` 
          : `Your location (${settings.location.city}) and prayer times have been updated`
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
        <div className="relative">
          <button onClick={toggleNotifications} className="p-2">
            <Bell className={`w-5 h-5 ${settings.notifications.prayerReminders ? "text-amber-400" : "text-gray-300"}`} />
          </button>
          
          {/* Notification Options Dropdown */}
          {showNotificationOptions && (
            <div className="absolute top-full right-0 mt-2 z-50 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
              <div className="p-3 border-b border-slate-700">
                <h3 className="font-arabic text-amber-400">
                  {settings.language === "ar" ? "إعدادات الإشعارات" : "Notification Settings"}
                </h3>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => enableNotifications('atAdhan')}
                  className={`w-full text-left p-2.5 hover:bg-slate-700 rounded-md transition-colors
                    ${settings.notifications.reminderType === 'atAdhan' ? 'bg-amber-900/30 text-amber-400' : ''}`}
                >
                  {settings.language === "ar" ? "عند الأذان" : "At Adhan Time"}
                </button>
                <button 
                  onClick={() => enableNotifications('iqamah')}
                  className={`w-full text-left p-2.5 hover:bg-slate-700 rounded-md transition-colors
                    ${settings.notifications.reminderType === 'iqamah' ? 'bg-amber-900/30 text-amber-400' : ''}`}
                >
                  {settings.language === "ar" ? "عند الإقامة" : "At Iqamah Time"}
                </button>
                <button 
                  onClick={() => enableNotifications('both')}
                  className={`w-full text-left p-2.5 hover:bg-slate-700 rounded-md transition-colors
                    ${settings.notifications.reminderType === 'both' ? 'bg-amber-900/30 text-amber-400' : ''}`}
                >
                  {settings.language === "ar" ? "الأذان والإقامة معاً" : "Both Adhan & Iqamah"}
                </button>
                <button 
                  onClick={() => enableNotifications('none')}
                  className="w-full text-left p-2.5 text-red-400 hover:bg-slate-700 rounded-md transition-colors mt-1"
                >
                  {settings.language === "ar" ? "إيقاف الإشعارات" : "Turn Off Notifications"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Islamic Date Display */}
      <div className="bg-slate-800/50 p-3">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-gray-300 text-sm">{gregorianDate}</p>
            <p className="text-gray-300 text-xs">{dayOfWeek}</p>
          </div>
          <button 
            onClick={updateLocation}
            className="flex items-center text-center hover:bg-slate-700/50 p-1.5 rounded-md transition-colors"
          >
            <MapPin className="w-4 h-4 text-amber-400 mr-1.5" />
            <p className="text-amber-400 text-lg font-arabic">
              {settings.location.city}
              {settings.location.region && `, ${settings.location.region}`}
            </p>
          </button>
          <div className="text-right">
            <p className="text-gray-300 text-sm font-arabic">
              {islamicDate.day} {islamicDate.month}
            </p>
            <p className="text-gray-300 text-xs font-arabic">{islamicDate.dayOfWeek}</p>
          </div>
        </div>
      </div>
      
      {/* Countdown to next prayer */}
      <div className="bg-slate-800/30 p-4 text-center">
        <div className="mb-1 text-sm text-gray-400 font-arabic">{getNextPrayer()}</div>
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
                  <div className="flex items-center justify-end text-amber-500 text-sm mt-1">
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
            className="flex items-center justify-between w-full bg-gradient-to-br from-slate-800/60 to-slate-800/20 p-4 rounded-lg border border-amber-800/30"
          >
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-arabic">
              {settings.language === "ar" 
                ? "جدول مواقيت الصلاة الشهري" 
                : "Monthly Prayer Times Calendar"}
            </span>
            <ChevronRight className="w-5 h-5 text-amber-400" />
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
