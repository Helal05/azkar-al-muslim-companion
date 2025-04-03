
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Bell, BellOff, Volume, VolumeOff, ArrowUp, ArrowDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [notifications, setNotifications] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("azkar-settings");
    if (savedSettings) {
      const { notifications, sound, vibration, fontSize } = JSON.parse(savedSettings);
      setNotifications(notifications);
      setSound(sound);
      setVibration(vibration);
      setFontSize(fontSize);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "azkar-settings", 
      JSON.stringify({ notifications, sound, vibration, fontSize })
    );
  }, [notifications, sound, vibration, fontSize]);
  
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

  return (
    <div className="min-h-screen pattern-bg flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-arabic font-bold text-islamic-green-dark dark:text-islamic-neutral">
            الإعدادات
          </h2>
        </div>
        
        <div className="bg-white dark:bg-islamic-green-dark/30 rounded-xl shadow-md p-6 max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {notifications ? (
                  <Bell className="w-5 h-5 text-islamic-green-dark dark:text-islamic-neutral" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
                <div>
                  <h3 className="font-arabic text-lg text-islamic-green-dark dark:text-islamic-neutral">
                    الإشعارات
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
              />
            </div>
            
            {/* Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {sound ? (
                  <Volume className="w-5 h-5 text-islamic-green-dark dark:text-islamic-neutral" />
                ) : (
                  <VolumeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
                <div>
                  <h3 className="font-arabic text-lg text-islamic-green-dark dark:text-islamic-neutral">
                    الصوت
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تشغيل صوت عند الضغط
                  </p>
                </div>
              </div>
              <Switch 
                checked={sound} 
                onCheckedChange={setSound}
              />
            </div>
            
            {/* Vibration */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <span className="emoji">📳</span>
                <div>
                  <h3 className="font-arabic text-lg text-islamic-green-dark dark:text-islamic-neutral">
                    الاهتزاز
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    تفعيل الاهتزاز عند الضغط
                  </p>
                </div>
              </div>
              <Switch 
                checked={vibration} 
                onCheckedChange={setVibration}
              />
            </div>
            
            {/* Font Size */}
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <span className="emoji">🔤</span>
                <div>
                  <h3 className="font-arabic text-lg text-islamic-green-dark dark:text-islamic-neutral">
                    حجم الخط
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 80}
                  className={`p-2 rounded-md ${
                    fontSize <= 80 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                      : 'bg-islamic-blue/20 text-islamic-blue-dark hover:bg-islamic-blue/30 dark:bg-islamic-blue-dark/20 dark:text-islamic-blue-light dark:hover:bg-islamic-blue-dark/30'
                  }`}
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                
                <div className="w-32 text-center">
                  <div 
                    className="font-arabic p-2 bg-islamic-neutral dark:bg-islamic-green-dark/50 rounded-md" 
                    style={{ fontSize: `${fontSize}%` }}
                  >
                    حجم الخط
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {fontSize}%
                  </span>
                </div>
                
                <button 
                  onClick={increaseFontSize}
                  disabled={fontSize >= 150}
                  className={`p-2 rounded-md ${
                    fontSize >= 150
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                      : 'bg-islamic-blue/20 text-islamic-blue-dark hover:bg-islamic-blue/30 dark:bg-islamic-blue-dark/20 dark:text-islamic-blue-light dark:hover:bg-islamic-blue-dark/30'
                  }`}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
            أذكار المسلم - تطبيق للذكر والدعاء
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
