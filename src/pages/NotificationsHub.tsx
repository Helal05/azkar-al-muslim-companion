
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell, ChevronLeft, Settings, BellOff, ChevronRight, Volume, X, Clock, Calendar
} from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  NotificationType,
  SoundOption,
  availableSounds,
  getUpcomingNotifications,
  formatNotificationTime,
  NotificationItem,
  testNotification
} from "../data/notificationData";

// Interface for quick notification toggle
interface NotificationToggle {
  id: string;
  type: NotificationType;
  title: {
    ar: string;
    en: string;
  };
  icon: React.ReactNode;
  enabled: boolean;
  route: string;
  relatedTo?: string;
}

const NotificationsHub = () => {
  const navigate = useNavigate();
  const { settings, updateNotificationSettings } = useAppSettings();
  const { t } = useTranslation(settings.language);
  const { toast } = useToast();
  
  const [soundOptionsVisible, setSoundOptionsVisible] = useState(false);
  const [selectedSoundId, setSelectedSoundId] = useState("default");
  const [urgentNotificationsEnabled, setUrgentNotificationsEnabled] = useState(true);
  
  // Define notification sections
  const [prayerNotifications, setPrayerNotifications] = useState<NotificationToggle[]>([
    {
      id: "fajr",
      type: NotificationType.PRAYER,
      title: { ar: "الفجر", en: "Fajr" },
      icon: <Bell className="w-5 h-5" />,
      enabled: true,
      route: "/notification-settings/fajr",
      relatedTo: "Fajr"
    },
    {
      id: "sunrise",
      type: NotificationType.PRAYER,
      title: { ar: "الشروق", en: "Sunrise" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/sunrise",
      relatedTo: "Sunrise"
    },
    {
      id: "dhuhr",
      type: NotificationType.PRAYER,
      title: { ar: "الظهر", en: "Dhuhr" },
      icon: <Bell className="w-5 h-5" />,
      enabled: true,
      route: "/notification-settings/dhuhr",
      relatedTo: "Dhuhr"
    },
    {
      id: "asr",
      type: NotificationType.PRAYER,
      title: { ar: "العصر", en: "Asr" },
      icon: <Bell className="w-5 h-5" />,
      enabled: true,
      route: "/notification-settings/asr",
      relatedTo: "Asr"
    },
    {
      id: "maghrib",
      type: NotificationType.PRAYER,
      title: { ar: "المغرب", en: "Maghrib" },
      icon: <Bell className="w-5 h-5" />,
      enabled: true,
      route: "/notification-settings/maghrib",
      relatedTo: "Maghrib"
    },
    {
      id: "isha",
      type: NotificationType.PRAYER,
      title: { ar: "العشاء", en: "Isha" },
      icon: <Bell className="w-5 h-5" />,
      enabled: true,
      route: "/notification-settings/isha",
      relatedTo: "Isha"
    },
    {
      id: "last-third",
      type: NotificationType.TAHAJJUD,
      title: { ar: "الثلث الأخير", en: "Last Third" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/last-third"
    }
  ]);
  
  const [azkarNotifications, setAzkarNotifications] = useState<NotificationToggle[]>([
    {
      id: "duha",
      type: NotificationType.DUHA_PRAYER,
      title: { ar: "صلاة الضحى", en: "Duha Prayer" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/duha-prayer"
    },
    {
      id: "morning-azkar",
      type: NotificationType.AZKAR_MORNING,
      title: { ar: "أذكار الصباح", en: "Morning Azkar" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/morning-azkar"
    },
    {
      id: "evening-azkar",
      type: NotificationType.AZKAR_EVENING,
      title: { ar: "أذكار المساء", en: "Evening Azkar" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/evening-azkar"
    },
    {
      id: "misc-azkar",
      type: NotificationType.AZKAR_MORNING,
      title: { ar: "أذكار منوعة", en: "Misc Azkar" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/misc-azkar"
    },
    {
      id: "white-days",
      type: NotificationType.WHITE_DAYS_FASTING,
      title: { ar: "تذكير صيام الأيام البيض", en: "White Days Fasting" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/white-days-fasting"
    },
    {
      id: "friday-sunnah",
      type: NotificationType.FRIDAY_SUNNAH,
      title: { ar: "سنن يوم الجمعة", en: "Friday Sunnah" },
      icon: <Bell className="w-5 h-5" />,
      enabled: false,
      route: "/notification-settings/friday-sunnah"
    }
  ]);
  
  const [upcomingNotifications, setUpcomingNotifications] = useState<NotificationItem[]>([]);
  
  // Load settings from app context
  useEffect(() => {
    // Load notification settings from context
    const loadedSound = settings.notifications.adhanSound ? "default" : "no-sound";
    setSelectedSoundId(loadedSound);
    setUrgentNotificationsEnabled(settings.notifications.enabled || false);
    
    // Set notification toggles based on saved settings
    updateNotificationToggles();
    
    // Request notification permission if needed
    if (settings.notifications.enabled && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [settings]);
  
  // Update toggles based on settings
  const updateNotificationToggles = () => {
    // In a real app, you would load notification settings for each toggle
    // This is simplified for the demo
  };
  
  // Toggle notification for a specific type
  const toggleNotification = (id: string, section: 'prayer' | 'azkar') => {
    if (section === 'prayer') {
      setPrayerNotifications(prev => prev.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ));
    } else {
      setAzkarNotifications(prev => prev.map(item => 
        item.id === id ? { ...item, enabled: !item.enabled } : item
      ));
    }
    
    toast({
      title: settings.language === "ar" 
        ? "تم تحديث الإعدادات" 
        : "Settings Updated",
      description: ""
    });
  };
  
  // Toggle urgent notifications
  const toggleUrgentNotifications = (enabled: boolean) => {
    setUrgentNotificationsEnabled(enabled);
    updateNotificationSettings({ enabled });
    
    toast({
      title: enabled 
        ? (settings.language === "ar" ? "تم تفعيل التنبيهات العاجلة" : "Urgent Notifications Enabled")
        : (settings.language === "ar" ? "تم إيقاف التنبيهات العاجلة" : "Urgent Notifications Disabled"),
      description: settings.language === "ar"
        ? enabled ? "ستبقى التنبيهات على شاشة القفل لمدة ساعة" : "تم إيقاف التنبيهات العاجلة"
        : enabled ? "Notifications will stay on lock screen for an hour" : "Urgent notifications disabled"
    });
  };
  
  // Select notification sound
  const selectSound = (soundId: string) => {
    setSelectedSoundId(soundId);
    setSoundOptionsVisible(false);
    updateNotificationSettings({ adhanSound: soundId !== "no-sound" });
    
    // Play the selected sound as a preview
    if (soundId !== "no-sound") {
      const sound = availableSounds.find(s => s.id === soundId);
      if (sound && sound.path) {
        const audio = new Audio(sound.path);
        audio.play().catch(err => console.error("Error playing sound:", err));
      }
    }
    
    toast({
      title: settings.language === "ar" ? "تم تغيير الصوت" : "Sound Changed",
      description: ""
    });
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    toast({
      title: settings.language === "ar" ? "تم حذف التنبيهات" : "Notifications Cleared",
      description: settings.language === "ar" 
        ? "تم حذف كل التنبيهات القادمة" 
        : "All upcoming notifications have been cleared"
    });
  };
  
  // Get selected sound name
  const getSelectedSoundName = () => {
    const sound = availableSounds.find(s => s.id === selectedSoundId);
    return sound ? (settings.language === 'ar' ? sound.name.ar : sound.name.en) : '';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {settings.language === "ar" ? "منبه الأذكار و الأذان" : "Azkar & Adhan Notifications"}
        </h2>
        <button onClick={() => navigate("/settings")} className="p-2">
          <Settings className="w-5 h-5 text-gray-300" />
        </button>
      </div>
      
      <div className="p-4 pb-20">
        {/* Prayer Notifications Section */}
        <div className="mb-6">
          <h3 className="text-lg font-arabic mb-3 text-gray-100">
            {settings.language === "ar" 
              ? "لتفعيل صوت الأذان ادخل صفحة الصلاة في القائمة التالية واختر الصوت." 
              : "To enable Adhan sound, enter the prayer page in the following menu and choose the sound."}
          </h3>
          
          <div className="bg-slate-800/50 rounded-xl overflow-hidden">
            {prayerNotifications.map((item) => (
              <div 
                key={item.id}
                className="border-b border-slate-700/50 last:border-b-0"
              >
                <div 
                  className="p-4 flex items-center justify-between"
                  onClick={() => navigate(item.route)}
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Bell className={`w-5 h-5 ${item.enabled ? 'text-amber-400' : 'text-gray-500'}`} />
                    <span className="font-arabic">
                      {settings.language === "ar" ? item.title.ar : item.title.en}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Azkar Notifications Section */}
        <div className="mb-6">
          <div className="bg-slate-800/50 rounded-xl overflow-hidden">
            {azkarNotifications.map((item) => (
              <div 
                key={item.id}
                className="border-b border-slate-700/50 last:border-b-0"
              >
                <div 
                  className="p-4 flex items-center justify-between"
                  onClick={() => navigate(item.route)}
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Bell className={`w-5 h-5 ${item.enabled ? 'text-amber-400' : 'text-gray-500'}`} />
                    <span className="font-arabic">
                      {settings.language === "ar" ? item.title.ar : item.title.en}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Default Sound Selection */}
        <div 
          className="bg-slate-800/50 rounded-xl p-4 mb-6"
          onClick={() => navigate("/notification-sound")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Volume className="w-5 h-5 text-blue-400" />
              <span className="font-arabic">
                {settings.language === "ar" ? "صوت المنبه الرئيسي" : "Default Alert Sound"}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {/* Urgent Notifications Toggle */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-arabic">
                {settings.language === "ar" ? "التنبيهات العاجلة" : "Urgent Notifications"}
              </span>
              <span className="text-sm text-gray-400 font-arabic">
                {settings.language === "ar" 
                  ? "عند تفعيل هذه الخاصية تبقى التنبيهات على شاشة القفل لمدة ساعة"
                  : "When enabled, notifications stay on lock screen for an hour"}
              </span>
            </div>
            <Switch 
              checked={urgentNotificationsEnabled}
              onCheckedChange={toggleUrgentNotifications}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>
        
        {/* Upcoming Notifications */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <div 
            className="flex items-center justify-between mb-2"
            onClick={() => navigate("/upcoming-notifications")}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Bell className="w-5 h-5 text-amber-400" />
              <span className="font-arabic">
                {settings.language === "ar" ? "التنبيهات القادمة" : "Upcoming Notifications"}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {/* Clear All Notifications */}
        <button
          onClick={clearAllNotifications}
          className="w-full bg-red-900/60 hover:bg-red-800 transition-colors text-red-400 font-arabic py-3 px-4 rounded-lg"
        >
          {settings.language === "ar" ? "احذف كل التنبيهات" : "Clear All Notifications"}
        </button>
        
        <p className="mt-4 text-center text-sm text-red-500/80 font-arabic">
          {settings.language === "ar" 
            ? "إذا كان منبه الأذان مفعل مع صوت الأذان، تأكد من عدم اصطحاب هاتفك معك في أماكن قضاء الحاجة."
            : "If Adhan alert is enabled with Adhan sound, make sure not to take your phone with you to bathrooms."}
        </p>
      </div>
      
      {/* Sound Options Modal */}
      {soundOptionsVisible && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="bg-slate-800 p-4 flex items-center justify-between shadow-md">
            <button onClick={() => setSoundOptionsVisible(false)} className="p-2">
              <X className="w-5 h-5 text-gray-300" />
            </button>
            <h3 className="text-lg font-arabic">
              {settings.language === "ar" ? "اختر الصوت" : "Choose sound"}
            </h3>
            <div className="w-5"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {availableSounds.map(sound => (
              <div 
                key={sound.id}
                className={`mb-2 p-4 rounded-lg flex items-center justify-between ${
                  sound.id === selectedSoundId 
                    ? 'bg-blue-800/40 border border-blue-700/50' 
                    : 'bg-slate-700/50'
                }`}
                onClick={() => selectSound(sound.id)}
              >
                <div className="font-arabic">
                  {settings.language === "ar" ? sound.name.ar : sound.name.en}
                </div>
                {sound.id === selectedSoundId && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <div className="bg-slate-900/90 text-white fixed bottom-0 left-0 right-0 py-3 flex justify-around border-t border-white/10 backdrop-blur-md">
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

export default NotificationsHub;
