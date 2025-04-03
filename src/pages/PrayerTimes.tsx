
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentIslamicDate, getPrayerTimes, getTimeToNextPrayer, getForbiddenPrayerTimes } from "../data/prayerData";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const PrayerTimes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate());
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes());
  const [nextPrayerTime, setNextPrayerTime] = useState(getTimeToNextPrayer());
  const [notificationsEnabled, setNotificationsEnabled] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Initialize notification settings for each prayer time
    const savedNotifications = localStorage.getItem("prayer_notifications");
    if (savedNotifications) {
      setNotificationsEnabled(JSON.parse(savedNotifications));
    } else {
      const initialSettings: Record<string, boolean> = {};
      prayerTimes.forEach(prayer => {
        initialSettings[prayer.name] = true;
      });
      setNotificationsEnabled(initialSettings);
      localStorage.setItem("prayer_notifications", JSON.stringify(initialSettings));
    }
    
    // Get user's location for accurate prayer times
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
    
    // Update countdown timer every minute
    const interval = setInterval(() => {
      setNextPrayerTime(getTimeToNextPrayer());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    localStorage.setItem("prayer_notifications", JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);
  
  // Toggle notification for specific prayer
  const toggleNotification = (prayerName: string) => {
    setNotificationsEnabled(prev => ({
      ...prev,
      [prayerName]: !prev[prayerName]
    }));
    
    toast({
      title: notificationsEnabled[prayerName] ? "تم إيقاف الإشعارات" : "تم تفعيل الإشعارات",
      description: `${prayerName}`,
    });
    
    // In a real app, we would register or unregister notifications here
    if (!notificationsEnabled[prayerName]) {
      // This would need a proper notification implementation using the Web Notifications API
      if (Notification.permission === "granted") {
        scheduleNotification(prayerName);
      } else {
        requestNotificationPermission();
      }
    }
  };
  
  // Schedule prayer notification
  const scheduleNotification = (prayerName: string) => {
    // This is a placeholder. In a real app, we would calculate the exact time
    // and set a timeout to show a notification at the prayer time
    console.log(`Notification scheduled for ${prayerName}`);
  };
  
  // Request notification permissions if needed
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "الإشعارات غير مدعومة",
        description: "متصفحك لا يدعم إشعارات سطح المكتب"
      });
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast({
          title: "تم تفعيل الإشعارات",
          description: "ستتلقى إشعارات بأوقات الصلاة"
        });
        
        // After permission granted, register all enabled notifications
        Object.entries(notificationsEnabled).forEach(([name, enabled]) => {
          if (enabled) scheduleNotification(name);
        });
      } else {
        toast({
          title: "لم يتم السماح بالإشعارات",
          description: "يرجى السماح بالإشعارات في إعدادات المتصفح"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };
  
  // Get the next prayer
  const getNextPrayer = () => {
    const next = prayerTimes.find(prayer => prayer.isNext);
    return next ? next.name : "الفجر";
  };
  
  const forbiddenTimes = getForbiddenPrayerTimes();
  
  // Calculate remaining time to prayer more accurately
  const calculateRemainingTime = (prayer: any) => {
    // This is a placeholder. In a real app, we would calculate this based on actual time
    return "45:22"; // Example format
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center">
        <button onClick={() => navigate("/")} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">مواقيت الصلاة</h2>
      </div>
      
      {/* Islamic Date */}
      <div className="bg-gray-900 px-4 py-3 flex justify-between items-center">
        <div className="text-amber-400 font-arabic">
          <span className="text-xl">{islamicDate.day}</span>
          <span className="text-sm"> {islamicDate.month}</span>
        </div>
        
        <div className="font-arabic text-white">
          {new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}
        </div>
        
        <div className="text-gray-400 text-sm">
          {islamicDate.gregorianDate}
        </div>
      </div>
      
      {/* Next Prayer Countdown */}
      <div className="bg-gray-900/80 px-4 py-4 border-b border-gray-800">
        <h3 className="text-amber-400 text-center font-arabic text-lg mb-1">
          {getNextPrayer()}
        </h3>
        <p className="text-amber-400 text-4xl font-arabic text-center">
          {nextPrayerTime}
        </p>
      </div>
      
      {/* Prayer Times List with Notification Toggles */}
      <div className="flex-1 bg-black">
        {prayerTimes.slice(0, 6).map((prayer) => (
          <div 
            key={prayer.name}
            className={`px-4 py-3 flex justify-between items-center border-b border-gray-800 ${
              prayer.isNext ? 'bg-gray-900/30' : ''
            }`}
          >
            <div className="flex items-center">
              <Switch 
                checked={notificationsEnabled[prayer.name] || false}
                onCheckedChange={() => toggleNotification(prayer.name)}
                className="mr-3"
              />
              
              <div className="font-arabic">
                <h3 className={`text-lg ${prayer.isNext ? 'text-amber-400' : 'text-white'}`}>
                  {prayer.name}
                </h3>
              </div>
            </div>
            
            <div className={`font-arabic ${prayer.isNext ? 'text-amber-400' : 'text-gray-300'}`}>
              {prayer.time}
            </div>
          </div>
        ))}
      </div>
      
      {/* Forbidden Prayer Times */}
      <div className="bg-gray-900/40 p-4">
        <h3 className="text-red-500 font-arabic text-lg mb-2">أوقات النهي عن الصلاة</h3>
        
        {forbiddenTimes.map((time, index) => (
          <div key={index} className="mb-3 bg-red-900/10 p-3 rounded-md">
            <p className="font-arabic text-white">{time.description}</p>
            <p className="text-sm text-gray-400">{time.timeRange}</p>
          </div>
        ))}
      </div>
      
      {/* Buttons for Rawatib and Duha */}
      <div className="grid grid-cols-2 gap-2 p-2 bg-black">
        <button
          onClick={() => navigate("/sunnah-prayers")}
          className="p-4 bg-gray-900/50 rounded-lg text-center"
        >
          <span className="text-lg font-arabic text-white">السنن الرواتب</span>
        </button>
        <button
          onClick={() => navigate("/duha-prayer")}
          className="p-4 bg-gray-900/50 rounded-lg text-center"
        >
          <span className="text-lg font-arabic text-white">صلاة الضحى</span>
        </button>
      </div>
      
      {/* Notification Permission Button */}
      <div className="p-4 bg-black">
        <button
          onClick={requestNotificationPermission}
          className="w-full p-3 bg-islamic-green-dark rounded-lg font-arabic text-white"
        >
          تفعيل إشعارات أوقات الصلاة
        </button>
      </div>
    </div>
  );
};

export default PrayerTimes;
