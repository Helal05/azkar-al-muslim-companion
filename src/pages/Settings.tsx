
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell, BellOff, Volume, VolumeOff, ChevronLeft, Calendar, 
  Moon, Sun, MapPin, Vibrate, Share2, Globe, PlusCircle, 
  MinusCircle, Languages, Users, X, ExternalLink, Mail,
  Star, MessageSquare, BookOpen, Info
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { 
    settings, 
    updateNotificationSettings, 
    updateLocationSettings, 
    toggleDarkMode, 
    increaseFontSize, 
    decreaseFontSize,
    updateLanguage,
    requestLocationPermission 
  } = useAppSettings();
  
  const { t } = useTranslation(settings.language);
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
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
    } else {
      toast({
        title: settings.language === "ar" ? "مشاركة" : "Share",
        description: settings.language === "ar" 
          ? "يمكنك مشاركة هذا التطبيق عبر نسخ الرابط"
          : "You can share this app by copying the link"
      });
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

  // Function to toggle a section's visibility
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-950 text-white">
      {/* Header with back button */}
      <div className="relative py-4 border-b border-white/10">
        <button 
          onClick={() => navigate(-1)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 rtl:right-auto rtl:left-4"
        >
          <X className="h-6 w-6 text-white/80" />
        </button>
        <h1 className="text-xl font-bold text-center font-arabic text-white">{t('settings')}</h1>
      </div>
      
      <div className="pb-20">
        {/* App Info Section */}
        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-arabic text-white">{settings.language === "ar" ? "التطبيق" : "App"}</h2>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "مزايا التطبيق" : "App Features"}
                </h3>
              </div>
            </div>
            <div className="bg-cyan-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="bg-blue-600/20 backdrop-blur-sm rounded-xl border border-blue-500/20 p-4 mb-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-arabic text-xl text-white mb-1">
                  {settings.language === "ar" ? "النسخة الحصرية" : "Premium Version"}
                </h3>
                <p className="text-sm text-white/70 font-arabic">
                  {settings.language === "ar" ? "اشترك وادعم التطبيق" : "Subscribe and support the app"}
                </p>
              </div>
              <div className="text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Settings Categories */}
        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-arabic text-white">{settings.language === "ar" ? "إعدادات" : "Settings"}</h2>
          </div>
          
          {/* Date & Prayer Times */}
          <div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between"
            onClick={() => toggleSection('prayerTimes')}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "التاريخ ومواقيت الصلاة" : "Date & Prayer Times"}
                </h3>
              </div>
            </div>
            <div className="bg-blue-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {activeSection === 'prayerTimes' && (
            <div className="mb-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/5 p-4">
              {/* Location */}
              <div className="mb-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
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
                  <Calendar className="w-5 h-5 text-amber-400" />
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
            </div>
          )}
          
          {/* Notifications */}
          <div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between"
            onClick={() => toggleSection('notifications')}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "منبه الأذكار والأذان" : "Azkar & Adhan Notifications"}
                </h3>
              </div>
            </div>
            <div className="bg-amber-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {activeSection === 'notifications' && (
            <div className="mb-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/5 p-4">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between mb-4">
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
              
              {/* Prayer Notifications */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {settings.notifications.prayerReminders ? (
                    <Calendar className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Calendar className="w-5 h-5 text-white/50" />
                  )}
                  <div>
                    <h3 className="font-arabic text-base text-white">
                      {settings.language === "ar" ? "تنبيهات الصلاة" : "Prayer Reminders"}
                    </h3>
                    <p className="text-sm text-white/50">
                      {settings.language === "ar" ? "تفعيل تنبيهات أوقات الصلاة" : "Enable prayer time alerts"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifications.prayerReminders} 
                  onCheckedChange={(checked) => updateNotificationSettings({ prayerReminders: checked })}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>
              
              {/* Azkar Notifications */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {settings.notifications.azkarReminders ? (
                    <BookOpen className="w-5 h-5 text-amber-400" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-white/50" />
                  )}
                  <div>
                    <h3 className="font-arabic text-base text-white">
                      {settings.language === "ar" ? "تنبيهات الأذكار" : "Azkar Reminders"}
                    </h3>
                    <p className="text-sm text-white/50">
                      {settings.language === "ar" ? "تفعيل تنبيهات الأذكار" : "Enable azkar reminders"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifications.azkarReminders} 
                  onCheckedChange={(checked) => updateNotificationSettings({ azkarReminders: checked })}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>
              
              {/* Sound */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  {settings.notifications.adhanSound ? (
                    <Volume className="w-5 h-5 text-amber-400" />
                  ) : (
                    <VolumeOff className="w-5 h-5 text-white/50" />
                  )}
                  <div>
                    <h3 className="font-arabic text-base text-white">
                      {settings.language === "ar" ? "صوت الأذان" : "Adhan Sound"}
                    </h3>
                    <p className="text-sm text-white/50">
                      {settings.language === "ar" ? "تشغيل صوت الأذان" : "Play adhan sound"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifications.adhanSound} 
                  onCheckedChange={(checked) => updateNotificationSettings({ adhanSound: checked })}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>
            </div>
          )}
          
          {/* Appearance */}
          <div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between"
            onClick={() => toggleSection('appearance')}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "المظهر والخلفيات" : "Appearance & Background"}
                </h3>
              </div>
            </div>
            <div className="bg-purple-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {activeSection === 'appearance' && (
            <div className="mb-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/5 p-4">
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
                      {settings.language === "ar" ? "الوضع الداكن" : "Dark Mode"}
                    </h3>
                    <p className="text-sm text-white/50">
                      {settings.language === "ar" ? "تغيير مظهر التطبيق" : "Change app appearance"}
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
                  <Languages className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="font-arabic text-base text-white">
                      {settings.language === "ar" ? "حجم خط الأذكار" : "Azkar Font Size"}
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
            </div>
          )}
          
          {/* Language */}
          <div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between"
            onClick={() => toggleSection('language')}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "اللغة" : "Language"}
                </h3>
              </div>
            </div>
            <div className="bg-blue-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {activeSection === 'language' && (
            <div className="mb-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/5 p-4">
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
            </div>
          )}
        </div>
        
        {/* Social & Info Section */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-arabic text-white">{settings.language === "ar" ? "أذكار" : "Azkar"}</h2>
          </div>
          
          {/* Help */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "مساعدة" : "Help"}
                </h3>
              </div>
            </div>
            <div className="bg-red-600 rounded-lg h-10 w-10 flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Rate App */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-arabic text-base text-white">
                {settings.language === "ar" ? "قيّم التطبيق" : "Rate App"}
              </h3>
              <div className="bg-yellow-600 rounded-lg h-8 w-8 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star key={rating} className="w-6 h-6 text-blue-400" fill="#3b82f6" />
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-white/50 mt-1 font-arabic">
              {settings.language === "ar" ? "إذا أعجبك التطبيق اختر 5 نجوم" : "If you like the app, choose 5 stars"}
            </p>
          </div>
          
          {/* Social Links */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "تابع التطبيق في X" : "Follow app on X"}
                </h3>
              </div>
            </div>
            <div className="bg-black rounded-lg h-8 w-8 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 5 6 19m12 0L6 5"/>
              </svg>
            </div>
          </div>
          
          {/* WhatsApp Channel */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "تابع قناة أذكار في الواتساب" : "Follow Azkar channel on WhatsApp"}
                </h3>
              </div>
            </div>
            <div className="bg-green-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Email */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "راسلني حول التطبيق" : "Email me about the app"}
                </h3>
              </div>
            </div>
            <div className="bg-amber-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Share App */}
          <div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-3 flex items-center justify-between"
            onClick={shareApp}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "انشر التطبيق" : "Share App"}
                </h3>
              </div>
            </div>
            <div className="bg-pink-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div>
                <h3 className="font-arabic text-base text-white">
                  {settings.language === "ar" ? "النشرة الإخبارية" : "Newsletter"}
                </h3>
              </div>
            </div>
            <div className="bg-blue-600 rounded-lg h-8 w-8 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Version Info */}
          <div className="text-center mb-4">
            <p className="text-sm text-white/50 font-arabic">
              {settings.language === "ar" ? "أذكار المسلم - تطبيق للذكر والدعاء" : "Muslim Azkar - App for Dhikr and Dua"}
            </p>
            <p className="text-xs text-white/30 mt-1">
              v1.1.0
            </p>
          </div>
          
          <div className="text-center mb-4 px-6">
            <p className="text-sm text-white/80 font-arabic leading-relaxed">
              {settings.language === "ar" 
                ? "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ."
                : "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is no deity except You."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
