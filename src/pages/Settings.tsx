
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Bell, BellOff, Volume, VolumeOff, ArrowUp, ArrowDown, ChevronLeft, Calendar, Moon, Sun, MapPin, Vibrate, Share2, Globe, PlusCircle, MinusCircle, Languages } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [location, setLocation] = useState("مكة المكرمة");
  const [method, setMethod] = useState("أم القرى");
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("azkar-settings");
    if (savedSettings) {
      const { notifications, sound, vibration, fontSize, darkMode, location, method } = JSON.parse(savedSettings);
      setNotifications(notifications);
      setSound(sound);
      setVibration(vibration);
      setFontSize(fontSize);
      setDarkMode(darkMode);
      if (location) setLocation(location);
      if (method) setMethod(method);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "azkar-settings", 
      JSON.stringify({ 
        notifications, 
        sound, 
        vibration, 
        fontSize,
        darkMode,
        location,
        method 
      })
    );
  }, [notifications, sound, vibration, fontSize, darkMode, location, method]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };
  
  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 150) {
      setFontSize(fontSize + 10);
    }
  };
  
  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 80) {
      setFontSize(fontSize - 10);
    }
  };
  
  // Request notification permissions
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotifications(true);
        new Notification("أذكار المسلم", {
          body: "تم تفعيل الإشعارات بنجاح!",
        });
      } else {
        setNotifications(false);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };
  
  // Share app functionality
  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: "تطبيق أذكاري",
        text: "تطبيق للأذكار والأدعية الإسلامية",
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header with back button */}
      <div className="relative py-4 border-b border-white/10">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <ChevronLeft className="h-6 w-6 text-white/80" />
        </button>
        <h1 className="text-xl font-bold text-center font-arabic text-white">الإعدادات</h1>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Location & Prayer Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5"
          >
            <h2 className="text-lg font-arabic text-amber-400 mb-4">إعدادات المواقيت</h2>
            
            {/* Location */}
            <div className="mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <MapPin className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="font-arabic text-base text-white">الموقع</h3>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg border border-white/5 p-3 text-center">
                <p className="text-sm text-white/70 mb-1">المدينة الحالية</p>
                <p className="font-arabic text-white">{location}</p>
                <button className="mt-2 text-xs text-amber-400 px-3 py-1 rounded-md border border-amber-800/30 bg-amber-900/10">
                  تغيير الموقع
                </button>
              </div>
            </div>
            
            {/* Calculation Method */}
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <Calendar className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="font-arabic text-base text-white">طريقة الحساب</h3>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg border border-white/5 p-3 text-center">
                <p className="text-sm text-white/70 mb-1">الطريقة الحالية</p>
                <p className="font-arabic text-white">{method}</p>
                <button className="mt-2 text-xs text-amber-400 px-3 py-1 rounded-md border border-amber-800/30 bg-amber-900/10">
                  تغيير الطريقة
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Notifications & Sound */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5"
          >
            <h2 className="text-lg font-arabic text-amber-400 mb-4">الإشعارات والصوت</h2>
            
            {/* Notifications */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {notifications ? (
                  <Bell className="w-5 h-5 text-amber-400" />
                ) : (
                  <BellOff className="w-5 h-5 text-white/50" />
                )}
                <div>
                  <h3 className="font-arabic text-base text-white">
                    الإشعارات
                  </h3>
                  <p className="text-sm text-white/50">
                    تذكير بأوقات الأذكار
                  </p>
                </div>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={(checked) => {
                  if (checked) {
                    requestNotificationPermission();
                  } else {
                    setNotifications(false);
                  }
                }}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
            
            {/* Sound */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {sound ? (
                  <Volume className="w-5 h-5 text-amber-400" />
                ) : (
                  <VolumeOff className="w-5 h-5 text-white/50" />
                )}
                <div>
                  <h3 className="font-arabic text-base text-white">
                    الصوت
                  </h3>
                  <p className="text-sm text-white/50">
                    تشغيل صوت عند الضغط
                  </p>
                </div>
              </div>
              <Switch 
                checked={sound} 
                onCheckedChange={setSound}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
            
            {/* Vibration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Vibrate className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="font-arabic text-base text-white">
                    الاهتزاز
                  </h3>
                  <p className="text-sm text-white/50">
                    تفعيل الاهتزاز عند الضغط
                  </p>
                </div>
              </div>
              <Switch 
                checked={vibration} 
                onCheckedChange={setVibration}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
          </motion.div>
          
          {/* Appearance */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5"
          >
            <h2 className="text-lg font-arabic text-amber-400 mb-4">المظهر</h2>
            
            {/* Dark Mode */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-amber-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <h3 className="font-arabic text-base text-white">
                    الوضع الداكن
                  </h3>
                  <p className="text-sm text-white/50">
                    تغيير مظهر التطبيق
                  </p>
                </div>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
            
            {/* Font Size */}
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <Languages className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="font-arabic text-base text-white">
                    حجم الخط
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 80}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    fontSize <= 80 
                      ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed' 
                      : 'bg-slate-700/50 text-white hover:bg-slate-700 transition-colors'
                  }`}
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
                
                <div className="w-32 text-center">
                  <div 
                    className="font-arabic p-2 bg-slate-700/50 border border-white/5 rounded-md" 
                    style={{ fontSize: `${fontSize}%` }}
                  >
                    حجم الخط
                  </div>
                  <span className="text-xs text-white/50 mt-1 block">
                    {fontSize}%
                  </span>
                </div>
                
                <button 
                  onClick={increaseFontSize}
                  disabled={fontSize >= 150}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    fontSize >= 150
                      ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed' 
                      : 'bg-slate-700/50 text-white hover:bg-slate-700 transition-colors'
                  }`}
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Additional Options */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5"
          >
            <h2 className="text-lg font-arabic text-amber-400 mb-4">خيارات إضافية</h2>
            
            {/* Share App */}
            <button 
              onClick={shareApp}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors mb-3"
            >
              <div className="flex items-center">
                <Share2 className="w-5 h-5 text-white/70 ml-2" />
                <span className="font-arabic text-white">مشاركة التطبيق</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            
            {/* Languages */}
            <button 
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors mb-3"
            >
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-white/70 ml-2" />
                <span className="font-arabic text-white">اللغة</span>
              </div>
              <div className="flex items-center">
                <span className="text-white/50 text-sm ml-1">العربية</span>
                <ChevronLeft className="w-4 h-4 text-white/50" />
              </div>
            </button>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-white/50 font-arabic">
            أذكار المسلم - تطبيق للذكر والدعاء
          </p>
          <p className="text-xs text-white/30 mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
