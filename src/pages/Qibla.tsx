
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Compass, MapPin } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "@/hooks/use-toast";

const Qibla = () => {
  const navigate = useNavigate();
  const { settings, requestLocationPermission } = useAppSettings();
  const { toast } = useToast();
  
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  
  // Calculate qibla direction based on user's coordinates
  useEffect(() => {
    calculateQiblaDirection();
  }, [settings.location.latitude, settings.location.longitude]);
  
  // Calculate Qibla direction using the Haversine formula
  const calculateQiblaDirection = () => {
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    const userLat = settings.location.latitude;
    const userLng = settings.location.longitude;
    
    // Convert all to radians
    const userLatRad = userLat * (Math.PI / 180);
    const userLngRad = userLng * (Math.PI / 180);
    const kaabaLatRad = kaabaLat * (Math.PI / 180);
    const kaabaLngRad = kaabaLng * (Math.PI / 180);
    
    // Calculate the qibla direction
    const y = Math.sin(kaabaLngRad - userLngRad);
    const x = Math.cos(userLatRad) * Math.tan(kaabaLatRad) - 
              Math.sin(userLatRad) * Math.cos(kaabaLngRad - userLngRad);
    
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    qibla = (qibla + 360) % 360; // Normalize to 0-360
    
    setQiblaDirection(qibla);
  };
  
  // Request device orientation permissions and start compass
  const startCompass = async () => {
    try {
      setIsCalibrating(true);
      
      // Check if DeviceOrientationEvent is available and request permission if needed
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setHasPermission(true);
          window.addEventListener('deviceorientation', handleOrientation);
          toast({
            title: settings.language === "ar" ? "تم منح الإذن" : "Permission granted",
            description: settings.language === "ar" 
              ? "يمكنك الآن استخدام البوصلة"
              : "You can now use the compass"
          });
        } else {
          setHasPermission(false);
          toast({
            title: settings.language === "ar" ? "تم رفض الإذن" : "Permission denied",
            description: settings.language === "ar" 
              ? "يرجى منح إذن الوصول إلى توجيه الجهاز"
              : "Please grant permission to device orientation",
            variant: "destructive"
          });
        }
      } else {
        // For devices that don't need permission (Android, etc.)
        setHasPermission(true);
        window.addEventListener('deviceorientation', handleOrientation);
      }
      
      setIsCalibrating(false);
    } catch (error) {
      console.error("Error requesting device orientation permission:", error);
      setIsCalibrating(false);
      setHasPermission(false);
      toast({
        title: settings.language === "ar" ? "خطأ" : "Error",
        description: settings.language === "ar" 
          ? "حدث خطأ أثناء طلب إذن توجيه الجهاز"
          : "Error requesting device orientation permission",
        variant: "destructive"
      });
    }
  };
  
  // Handle device orientation changes
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Get the device heading (alpha) and adjust it
    // Alpha is the compass direction the device is facing
    let heading = event.webkitCompassHeading || event.alpha || 0;
    
    // For devices using alpha instead of webkitCompassHeading
    if (event.alpha && !event.webkitCompassHeading) {
      heading = 360 - heading; // Convert to same reference as webkitCompassHeading
    }
    
    setCompassHeading(heading);
  };
  
  // Clean up event listener
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);
  
  // Update user location
  const updateLocation = async () => {
    const success = await requestLocationPermission();
    if (success) {
      calculateQiblaDirection();
      toast({
        title: settings.language === "ar" ? "تم تحديث الموقع" : "Location updated",
        description: settings.language === "ar" 
          ? "تم تحديث موقعك واتجاه القبلة"
          : "Your location and Qibla direction have been updated"
      });
    }
  };
  
  // Convert heading to direction name
  const getDirectionName = (heading: number): string => {
    const directions = {
      ar: ["الشمال", "الشمال الشرقي", "الشرق", "الجنوب الشرقي", "الجنوب", "الجنوب الغربي", "الغرب", "الشمال الغربي"],
      en: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    };
    
    const index = Math.round(heading / 45) % 8;
    return settings.language === "ar" ? directions.ar[index] : directions.en[index];
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {settings.language === "ar" ? "القبلة" : "Qibla Direction"}
        </h2>
        <div className="w-5"></div> {/* Empty div for alignment */}
      </div>
      
      {/* Location Info */}
      <div className="bg-slate-800/50 p-3">
        <button 
          onClick={updateLocation}
          className="flex items-center justify-center space-x-2 rtl:space-x-reverse w-full py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 font-arabic">
            {settings.language === "ar" 
              ? `${settings.location.city}، ${settings.location.country}` 
              : `${settings.location.city}, ${settings.location.country}`}
          </span>
        </button>
      </div>
      
      {/* Compass */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {qiblaDirection !== null ? (
          <>
            {hasPermission ? (
              <>
                <div className="relative w-64 h-64 mb-8">
                  <motion.div 
                    className="w-full h-full"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -compassHeading }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {/* Compass dial with cardinal directions */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-slate-700/50 shadow-lg">
                      <div className="absolute w-1 h-8 bg-white top-0 left-1/2 -translate-x-1/2"></div>
                      <div className="absolute w-1 h-8 bg-slate-600 bottom-0 left-1/2 -translate-x-1/2"></div>
                      <div className="absolute h-1 w-8 bg-slate-600 left-0 top-1/2 -translate-y-1/2"></div>
                      <div className="absolute h-1 w-8 bg-slate-600 right-0 top-1/2 -translate-y-1/2"></div>
                      
                      {/* Cardinal directions */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold">N</div>
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400">S</div>
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400">W</div>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400">E</div>
                      
                      {/* Qibla marker */}
                      <div 
                        className="absolute w-1 h-12 bg-amber-500 opacity-75"
                        style={{ 
                          transform: `rotate(${qiblaDirection}deg) translateY(-90px)`,
                          transformOrigin: 'center 132px',
                          left: 'calc(50% - 0.5px)'
                        }}
                      >
                        <div className="w-5 h-5 bg-amber-500 rounded-full absolute -top-3 left-1/2 -translate-x-1/2"></div>
                      </div>
                      
                      {/* Center dot */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 rounded-full"></div>
                    </div>
                  </motion.div>
                  
                  {/* Static Kaaba icon in center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 flex items-center justify-center">
                    <div className="w-14 h-14 bg-black rounded-md border-2 border-amber-600 flex items-center justify-center">
                      <span className="text-amber-500 text-xs font-arabic">الكعبة</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-amber-400 font-arabic text-xl font-semibold">
                    {settings.language === "ar" 
                      ? `اتجاه القبلة: ${getDirectionName(qiblaDirection)}`
                      : `Qibla: ${getDirectionName(qiblaDirection)}`}
                  </p>
                  <p className="text-white/60 font-arabic mt-2">
                    {settings.language === "ar" 
                      ? `${Math.round(qiblaDirection)}° من الشمال`
                      : `${Math.round(qiblaDirection)}° from North`}
                  </p>
                </div>
                
                <div className="text-center text-white/70">
                  <p className="text-sm font-arabic">
                    {settings.language === "ar" 
                      ? `اتجاه البوصلة: ${Math.round(compassHeading)}°`
                      : `Compass heading: ${Math.round(compassHeading)}°`}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Compass className="w-24 h-24 mx-auto text-amber-400 mb-6" />
                <p className="font-arabic text-lg mb-6">
                  {settings.language === "ar" 
                    ? "اتجاه القبلة من موقعك الحالي:"
                    : "Qibla direction from your current location:"}
                </p>
                <p className="text-amber-400 font-arabic text-3xl font-semibold mb-8">
                  {settings.language === "ar" 
                    ? `${Math.round(qiblaDirection)}° ${getDirectionName(qiblaDirection)}`
                    : `${Math.round(qiblaDirection)}° ${getDirectionName(qiblaDirection)}`}
                </p>
                <button
                  onClick={startCompass}
                  disabled={isCalibrating}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-arabic hover:bg-amber-700 transition-colors"
                >
                  {isCalibrating 
                    ? (settings.language === "ar" ? "جاري التحميل..." : "Loading...") 
                    : (settings.language === "ar" ? "استخدام البوصلة" : "Use Compass")}
                </button>
                <p className="text-white/60 text-sm mt-4 font-arabic">
                  {settings.language === "ar" 
                    ? "الرجاء السماح بالوصول إلى توجيه الجهاز"
                    : "Please allow access to device orientation"}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-6"></div>
            <p className="font-arabic text-lg">
              {settings.language === "ar" 
                ? "جاري حساب اتجاه القبلة..."
                : "Calculating Qibla direction..."}
            </p>
          </div>
        )}
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
          <span className="text-amber-400 font-arabic">{settings.language === "ar" ? "القبلة" : "Qibla"}</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">{settings.language === "ar" ? "الصلاة" : "Prayer"}</span>
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

export default Qibla;
