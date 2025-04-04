
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, BellOff, Volume, VolumeOff, ChevronLeft, Calendar, Moon, Sun, MapPin, Vibrate, Share2, Globe, PlusCircle, MinusCircle, Languages, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";

const Settings = () => {
  const navigate = useNavigate();
  const { settings, 
          updateNotificationSettings, 
          updateLocationSettings, 
          toggleDarkMode, 
          increaseFontSize, 
          decreaseFontSize,
          updateLanguage,
          requestLocationPermission } = useAppSettings();
  
  const { t } = useTranslation(settings.language);
  
  // Share app functionality
  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: t('appName'),
        text: settings.language === "ar" 
          ? "تطبيق للأذكار والأدعية الإسلامية"
          : "Islamic App for Azkar and Duas",
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    }
  };
  
  // Request notification permissions
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        updateNotificationSettings({ enabled: true });
        new Notification(t('appName'), {
          body: settings.language === "ar" 
            ? "تم تفعيل الإشعارات بنجاح!"
            : "Notifications enabled successfully!",
        });
      } else {
        updateNotificationSettings({ enabled: false });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };
  
  // Change location modal (simplified for demo)
  const changeLocation = async () => {
    const success = await requestLocationPermission();
    if (!success) {
      // In a real app, you would show a modal for manual location selection
      const cityName = prompt(settings.language === "ar" 
        ? "أدخل اسم المدينة:" 
        : "Enter city name:");
      
      if (cityName) {
        updateLocationSettings({ city: cityName });
      }
    }
  };
  
  // Change calculation method
  const changeMethod = () => {
    const methods = ["أم القرى", "رابطة العالم الإسلامي", "الهيئة المصرية"];
    const currentIndex = methods.indexOf(settings.location.method);
    const nextIndex = (currentIndex + 1) % methods.length;
    
    updateLocationSettings({ method: methods[nextIndex] });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-950 text-white">
      {/* Header with back button */}
      <div className="relative py-4 border-b border-white/10">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <ChevronLeft className="h-6 w-6 text-white/80" />
        </button>
        <h1 className="text-xl font-bold text-center font-arabic text-white">{t('settings')}</h1>
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
            <h2 className="text-lg font-arabic text-amber-400 mb-4">{settings.language === "ar" ? "إعدادات المواقيت" : "Prayer Time Settings"}</h2>
            
            {/* Location */}
            <div className="mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <MapPin className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="font-arabic text-base text-white">{t('location')}</h3>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg border border-white/5 p-3 text-center">
                <p className="text-sm text-white/70 mb-1">{t('currentCity')}</p>
                <p className="font-arabic text-white">{settings.location.city}</p>
                <button 
                  onClick={changeLocation}
                  className="mt-2 text-xs text-amber-400 px-3 py-1 rounded-md border border-amber-800/30 bg-amber-900/10"
                >
                  {t('changeLocation')}
                </button>
              </div>
            </div>
            
            {/* Calculation Method */}
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <Calendar className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="font-arabic text-base text-white">{t('calculationMethod')}</h3>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg border border-white/5 p-3 text-center">
                <p className="text-sm text-white/70 mb-1">{t('currentMethod')}</p>
                <p className="font-arabic text-white">{settings.location.method}</p>
                <button 
                  onClick={changeMethod}
                  className="mt-2 text-xs text-amber-400 px-3 py-1 rounded-md border border-amber-800/30 bg-amber-900/10"
                >
                  {t('changeMethod')}
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
            <h2 className="text-lg font-arabic text-amber-400 mb-4">{settings.language === "ar" ? "الإشعارات والصوت" : "Notifications & Sound"}</h2>
            
            {/* Notifications */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {settings.notifications.enabled ? (
                  <Bell className="w-5 h-5 text-amber-400" />
                ) : (
                  <BellOff className="w-5 h-5 text-white/50" />
                )}
                <div>
                  <h3 className="font-arabic text-base text-white">
                    {t('notifications')}
                  </h3>
                  <p className="text-sm text-white/50">
                    {t('reminderForAzkar')}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications.enabled} 
                onCheckedChange={(checked) => {
                  if (checked) {
                    requestNotificationPermission();
                  } else {
                    updateNotificationSettings({ enabled: false });
                  }
                }}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
            
            {/* Sound */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {settings.notifications.prayerReminders ? (
                  <Volume className="w-5 h-5 text-amber-400" />
                ) : (
                  <VolumeOff className="w-5 h-5 text-white/50" />
                )}
                <div>
                  <h3 className="font-arabic text-base text-white">
                    {t('soundEnabled')}
                  </h3>
                  <p className="text-sm text-white/50">
                    {t('playSoundOnTap')}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications.prayerReminders} 
                onCheckedChange={(checked) => updateNotificationSettings({ prayerReminders: checked })}
                className="data-[state=checked]:bg-amber-600"
              />
            </div>
            
            {/* Vibration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Vibrate className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="font-arabic text-base text-white">
                    {t('vibrationEnabled')}
                  </h3>
                  <p className="text-sm text-white/50">
                    {t('enableVibration')}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications.azkarReminders} 
                onCheckedChange={(checked) => updateNotificationSettings({ azkarReminders: checked })}
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
            <h2 className="text-lg font-arabic text-amber-400 mb-4">{settings.language === "ar" ? "المظهر" : "Appearance"}</h2>
            
            {/* Dark Mode */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {settings.appearance.darkMode ? (
                  <Moon className="w-5 h-5 text-amber-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <h3 className="font-arabic text-base text-white">
                    {t('darkModeLabel')}
                  </h3>
                  <p className="text-sm text-white/50">
                    {t('changeAppearance')}
                  </p>
                </div>
              </div>
              <Switch 
                checked={settings.appearance.darkMode} 
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
                    {t('fontSize')}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={decreaseFontSize}
                  disabled={settings.appearance.fontSize <= 80}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    settings.appearance.fontSize <= 80 
                      ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed' 
                      : 'bg-slate-700/50 text-white hover:bg-slate-700 transition-colors'
                  }`}
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
                
                <div className="w-32 text-center">
                  <div 
                    className="font-arabic p-2 bg-slate-700/50 border border-white/5 rounded-md" 
                    style={{ fontSize: `${settings.appearance.fontSize}%` }}
                  >
                    {settings.language === "ar" ? "حجم الخط" : "Font Size"}
                  </div>
                  <span className="text-xs text-white/50 mt-1 block">
                    {settings.appearance.fontSize}%
                  </span>
                </div>
                
                <button 
                  onClick={increaseFontSize}
                  disabled={settings.appearance.fontSize >= 150}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    settings.appearance.fontSize >= 150
                      ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed' 
                      : 'bg-slate-700/50 text-white hover:bg-slate-700 transition-colors'
                  }`}
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Language Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5"
          >
            <h2 className="text-lg font-arabic text-amber-400 mb-4">{settings.language === "ar" ? "إعدادات اللغة" : "Language Settings"}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => updateLanguage("ar")}
                className={`p-4 rounded-lg ${
                  settings.language === "ar" 
                    ? "bg-amber-900/30 border-2 border-amber-500/50" 
                    : "bg-slate-700/50 border border-white/10"
                } flex flex-col items-center justify-center transition-all`}
              >
                <Globe className={`w-6 h-6 mb-2 ${settings.language === "ar" ? "text-amber-400" : "text-white/70"}`} />
                <p className={`font-arabic ${settings.language === "ar" ? "text-amber-400" : "text-white"}`}>العربية</p>
              </button>
              
              <button 
                onClick={() => updateLanguage("en")}
                className={`p-4 rounded-lg ${
                  settings.language === "en" 
                    ? "bg-amber-900/30 border-2 border-amber-500/50" 
                    : "bg-slate-700/50 border border-white/10"
                } flex flex-col items-center justify-center transition-all`}
              >
                <Globe className={`w-6 h-6 mb-2 ${settings.language === "en" ? "text-amber-400" : "text-white/70"}`} />
                <p className={settings.language === "en" ? "text-amber-400" : "text-white"}>English</p>
              </button>
            </div>
          </motion.div>
          
          {/* Additional Options */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5"
          >
            <h2 className="text-lg font-arabic text-amber-400 mb-4">{t('additionalOptions')}</h2>
            
            {/* Share App */}
            <button 
              onClick={shareApp}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors mb-3"
            >
              <div className="flex items-center">
                <Share2 className="w-5 h-5 text-white/70 ml-2" />
                <span className="font-arabic text-white">{t('shareApp')}</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-white/50 font-arabic">
            {settings.language === "ar" ? "أذكار المسلم - تطبيق للذكر والدعاء" : "Muslim Azkar - App for Dhikr and Dua"}
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
