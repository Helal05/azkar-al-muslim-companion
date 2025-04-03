
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Compass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Qibla = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [direction, setDirection] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Request device orientation permission and initialize sensors
  useEffect(() => {
    // Function to request permission for Device Orientation API
    const requestOrientationPermission = async () => {
      try {
        // Check if DeviceOrientationEvent is available
        if (typeof DeviceOrientationEvent !== 'undefined' && 
            typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          // For iOS 13+ devices
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          
          if (permission === 'granted') {
            setHasPermission(true);
            initCompass();
          } else {
            setError("لم يتم السماح باستخدام مستشعرات الجهاز");
          }
        } else {
          // For non iOS or older devices
          setHasPermission(true);
          initCompass();
        }
      } catch (err) {
        console.error("Error requesting device orientation permission:", err);
        setError("حدث خطأ أثناء محاولة الوصول إلى مستشعرات الجهاز");
      }
    };

    // Initialize compass functionality
    const initCompass = () => {
      // For demo/mock purposes, we'll set a random Qibla direction
      // In a real app, this would be calculated based on the user's location
      // and the coordinates of the Kaaba in Mecca
      setQiblaDirection(Math.floor(Math.random() * 360));
      
      // Listen for device orientation events to get compass direction
      window.addEventListener('deviceorientation', handleOrientation);
      
      toast({
        title: "تم تفعيل البوصلة",
        description: "حرك جهازك للعثور على اتجاه القبلة",
      });
    };

    requestOrientationPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Handle device orientation event
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Get the alpha value (compass direction)
    const alpha = event.alpha;
    if (alpha !== null) {
      // Update the direction state
      setDirection(360 - alpha); // Convert to conventional compass direction
    }
  };
  
  // Request permission again
  const requestPermissionAgain = () => {
    setError(null);
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permission: string) => {
          if (permission === 'granted') {
            setHasPermission(true);
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            setError("لم يتم السماح باستخدام مستشعرات الجهاز");
          }
        })
        .catch((err: any) => {
          console.error("Error requesting device orientation permission:", err);
          setError("حدث خطأ أثناء محاولة الوصول إلى مستشعرات الجهاز");
        });
    }
  };

  // Calculate the angle between current direction and Qibla
  const angleToQibla = qiblaDirection - direction;
  
  // Normalize angle to 0-360
  const normalizedAngle = ((angleToQibla % 360) + 360) % 360;
  
  // Is the user facing approximately toward the Qibla?
  const isFacingQibla = Math.abs(normalizedAngle) < 10 || Math.abs(normalizedAngle - 360) < 10;

  return (
    <div className="min-h-screen pattern-bg flex flex-col">
      <Header />
      
      <div className="container mx-auto flex-1 flex flex-col justify-center items-center px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-arabic font-bold text-islamic-green-dark dark:text-islamic-neutral">
            اتجاه القبلة
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            استخدم البوصلة للعثور على اتجاه القبلة
          </p>
        </div>
        
        {error ? (
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg mb-4">
              <p className="text-red-700 dark:text-red-300 font-arabic">{error}</p>
            </div>
            <button 
              onClick={requestPermissionAgain}
              className="py-2 px-4 rounded-md bg-islamic-blue dark:bg-islamic-blue-dark text-white font-arabic"
            >
              السماح بالوصول للمستشعرات
            </button>
          </div>
        ) : !hasPermission ? (
          <div className="text-center">
            <p className="font-arabic mb-4">يرجى السماح بالوصول إلى مستشعرات الجهاز</p>
            <button 
              onClick={requestPermissionAgain}
              className="py-2 px-4 rounded-md bg-islamic-blue dark:bg-islamic-blue-dark text-white font-arabic"
            >
              السماح بالوصول
            </button>
          </div>
        ) : (
          <div className="relative">
            <div 
              className={`w-64 h-64 rounded-full border-4 ${
                isFacingQibla 
                  ? 'border-green-500 dark:border-green-400' 
                  : 'border-islamic-blue dark:border-islamic-blue-light'
              } relative flex items-center justify-center bg-white/80 dark:bg-islamic-green-dark/30 shadow-lg`}
            >
              {/* Compass markings */}
              <div className="absolute inset-0 flex items-start justify-center">
                <div className="w-1 h-4 bg-islamic-green-dark dark:bg-islamic-neutral mt-2"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="h-1 w-4 bg-islamic-green-dark dark:bg-islamic-neutral ml-2"></div>
              </div>
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="w-1 h-4 bg-islamic-green-dark dark:bg-islamic-neutral mb-2"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-end">
                <div className="h-1 w-4 bg-islamic-green-dark dark:bg-islamic-neutral mr-2"></div>
              </div>
              
              {/* Compass needle */}
              <div 
                className="relative w-full h-full" 
                style={{ transform: `rotate(${direction}deg)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-full flex flex-col">
                    <div className="flex-1 bg-red-500 dark:bg-red-400"></div>
                    <div className="flex-1 bg-gray-600 dark:bg-gray-400"></div>
                  </div>
                </div>
              </div>
              
              {/* Qibla direction marker */}
              <div 
                className="absolute w-full h-full pointer-events-none"
                style={{ transform: `rotate(${qiblaDirection}deg)` }}
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -mt-1">
                  <div className="w-4 h-4 bg-islamic-gold rounded-full"></div>
                </div>
              </div>
              
              {/* Center dot */}
              <div className="absolute w-4 h-4 rounded-full bg-islamic-green-dark dark:bg-islamic-neutral"></div>
              
              {/* Direction display */}
              <Compass className="absolute text-islamic-green-dark dark:text-islamic-neutral w-full h-full opacity-10" />
            </div>
            
            <div className="text-center mt-8">
              <p className="font-arabic text-xl mb-2">
                {isFacingQibla ? (
                  <span className="text-green-600 dark:text-green-400">أنت تواجه القبلة!</span>
                ) : (
                  <span>استدر {normalizedAngle < 180 ? "يمينًا" : "يسارًا"} بزاوية {Math.min(normalizedAngle, 360 - normalizedAngle).toFixed(0)} درجة</span>
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                اتجاهك الحالي: {Math.round(direction)}° | اتجاه القبلة: {Math.round(qiblaDirection)}°
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Qibla;
