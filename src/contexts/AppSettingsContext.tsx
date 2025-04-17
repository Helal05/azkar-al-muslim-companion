
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export interface AppSettings {
  // Location settings
  location: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    method: string;
  };
  // Notification settings
  notifications: {
    enabled: boolean;
    prayerReminders: boolean;
    azkarReminders: boolean;
    reminderTime: number; // minutes before prayer
    adhanSound: boolean;
    reminderType: 'atAdhan' | 'iqamah' | 'both' | 'none';
  };
  // Appearance settings
  appearance: {
    darkMode: boolean;
    fontSize: number; // percentage (100 = default)
  };
  // Language settings
  language: "ar" | "en";
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateLocationSettings: (locationData: Partial<AppSettings["location"]>) => void;
  updateNotificationSettings: (notificationData: Partial<AppSettings["notifications"]>) => void;
  updateAppearanceSettings: (appearanceData: Partial<AppSettings["appearance"]>) => void;
  updateLanguage: (language: "ar" | "en") => void;
  toggleDarkMode: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  requestLocationPermission: () => Promise<boolean>;
}

const defaultSettings: AppSettings = {
  location: {
    city: "مكة المكرمة",
    region: "",
    country: "المملكة العربية السعودية",
    latitude: 21.3891,
    longitude: 39.8579,
    method: "أم القرى"
  },
  notifications: {
    enabled: false,
    prayerReminders: true,
    azkarReminders: false,
    reminderTime: 10,
    adhanSound: true,
    reminderType: 'atAdhan'
  },
  appearance: {
    darkMode: true,
    fontSize: 100
  },
  language: "ar"
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  
  useEffect(() => {
    const savedSettings = localStorage.getItem("azkar-app-settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        if (parsedSettings.appearance.darkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
        document.documentElement.style.fontSize = `${parsedSettings.appearance.fontSize}%`;
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
    
    // Try to get location on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocationSettings({
            latitude,
            longitude
          });
          
          // Get city name from coordinates
          getCityNameFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.log("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("azkar-app-settings", JSON.stringify(settings));
  }, [settings]);
  
  // Function to get city name from coordinates using reverse geocoding
  const getCityNameFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${settings.language}`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const city = data.address.city || 
                    data.address.town || 
                    data.address.village || 
                    data.address.county ||
                    data.address.state ||
                    "Unknown";
        
        const region = data.address.state || 
                      data.address.province || 
                      data.address.region || 
                      "";
                      
        const country = data.address.country || "";
        
        updateLocationSettings({ 
          city,
          region,
          country
        });
      }
    } catch (error) {
      console.error("Error getting city name:", error);
    }
  };
  
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const updateLocationSettings = (locationData: Partial<AppSettings["location"]>) => {
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        location: { ...prevSettings.location, ...locationData }
      };
      
      toast({
        title: prevSettings.language === "ar" ? "تم تحديث الموقع" : "Location updated",
        description: prevSettings.language === "ar" 
          ? `تم تغيير الموقع إلى ${locationData.city || prevSettings.location.city}`
          : `Location changed to ${locationData.city || prevSettings.location.city}`
      });
      
      return updatedSettings;
    });
  };
  
  const updateNotificationSettings = (notificationData: Partial<AppSettings["notifications"]>) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, ...notificationData }
    }));
    
    // Show toast for notification settings update
    if (notificationData.enabled !== undefined) {
      toast({
        title: settings.language === "ar" 
          ? notificationData.enabled ? "تم تفعيل الإشعارات" : "تم إيقاف الإشعارات"
          : notificationData.enabled ? "Notifications enabled" : "Notifications disabled",
        description: ""
      });
    }
    
    // Request notification permission if enabling notifications
    if (notificationData.enabled && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };
  
  const updateAppearanceSettings = (appearanceData: Partial<AppSettings["appearance"]>) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, ...appearanceData }
    }));
    
    if (appearanceData.darkMode !== undefined) {
      if (appearanceData.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
    if (appearanceData.fontSize !== undefined) {
      document.documentElement.style.fontSize = `${appearanceData.fontSize}%`;
    }
  };
  
  const updateLanguage = (language: "ar" | "en") => {
    setSettings(prev => ({ ...prev, language }));
    
    toast({
      title: language === "ar" ? "تم تغيير اللغة" : "Language changed",
      description: language === "ar" 
        ? "تم تغيير لغة التطبيق إلى العربية"
        : "App language changed to English"
    });
    
    // Refresh prayer times based on new language setting
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getCityNameFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.log("Error refreshing location after language change:", error);
        }
      );
    }
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !settings.appearance.darkMode;
    updateAppearanceSettings({ darkMode: newDarkMode });
    
    toast({
      title: settings.language === "ar" 
        ? `تم تفعيل الوضع ${newDarkMode ? 'الداكن' : 'الفاتح'}`
        : `${newDarkMode ? 'Dark' : 'Light'} mode activated`,
      description: ""
    });
  };
  
  const increaseFontSize = () => {
    if (settings.appearance.fontSize < 150) {
      updateAppearanceSettings({ fontSize: settings.appearance.fontSize + 10 });
    }
  };
  
  const decreaseFontSize = () => {
    if (settings.appearance.fontSize > 80) {
      updateAppearanceSettings({ fontSize: settings.appearance.fontSize - 10 });
    }
  };
  
  const requestLocationPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      toast({
        title: settings.language === "ar" ? "خطأ" : "Error",
        description: settings.language === "ar" 
          ? "متصفحك لا يدعم تحديد الموقع"
          : "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Update location coordinates immediately
      updateLocationSettings({
        latitude,
        longitude
      });
      
      // Get city name from coordinates
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${settings.language}`
        );
        const data = await response.json();
        
        const city = data.address?.city || 
                    data.address?.town || 
                    data.address?.village || 
                    data.address?.county ||
                    data.address?.state ||
                    "Unknown";
                    
        const region = data.address?.state || 
                      data.address?.province || 
                      data.address?.region || 
                      "";
                      
        const country = data.address?.country || "";
        
        updateLocationSettings({
          city,
          region,
          country
        });
        
        toast({
          title: settings.language === "ar" ? "تم تحديد موقعك" : "Location detected",
          description: settings.language === "ar" 
            ? `تم تحديد موقعك: ${city}, ${region}`
            : `Your location: ${city}, ${region}`
        });
        
        return true;
      } catch (error) {
        console.error("Error getting city name:", error);
        
        // Still update coordinates even if city name could not be obtained
        updateLocationSettings({
          latitude,
          longitude
        });
        
        toast({
          title: settings.language === "ar" ? "تم تحديد موقعك" : "Location detected",
          description: settings.language === "ar" 
            ? "تم تحديد إحداثيات موقعك، لكن لم نتمكن من تحديد اسم المدينة."
            : "Your location coordinates have been detected, but we couldn't determine the city name."
        });
        
        return true;
      }
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: settings.language === "ar" ? "خطأ في تحديد الموقع" : "Location error",
        description: settings.language === "ar" 
          ? "لم نتمكن من تحديد موقعك. يرجى السماح بالوصول إلى الموقع أو إدخال المدينة يدويًا."
          : "We couldn't determine your location. Please allow location access or enter your city manually.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const value = {
    settings,
    updateSettings,
    updateLocationSettings,
    updateNotificationSettings,
    updateAppearanceSettings,
    updateLanguage,
    toggleDarkMode,
    increaseFontSize,
    decreaseFontSize,
    requestLocationPermission
  };
  
  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
