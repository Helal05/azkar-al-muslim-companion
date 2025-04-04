
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, AlertCircle } from "lucide-react";
import { getCurrentIslamicDate, getPrayerTimes, getForbiddenPrayerTimes } from "../data/prayerData";
import Header from "../components/Header";

const ForbiddenPrayerTimes = () => {
  const navigate = useNavigate();
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate());
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes());
  const [forbiddenTimes, setForbiddenTimes] = useState(getForbiddenPrayerTimes());
  
  // Update prayer times based on location
  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      {/* Sub Header */}
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/prayer-times")} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold text-amber-400">أوقات النهي عن الصلاة</h2>
        <div className="w-5"></div> {/* Placeholder for alignment */}
      </div>
      
      {/* Islamic Date Display */}
      <div className="bg-gray-800 p-3">
        <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              {islamicDate.day} {islamicDate.month} {islamicDate.year}هـ
            </p>
            <p className="text-gray-400 text-xs">{islamicDate.gregorianDate}</p>
          </div>
        </div>
      </div>
      
      {/* Forbidden Prayer Times */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-arabic font-bold text-red-500">أوقات لا تجوز فيها صلاة النافلة</h3>
          </div>
          
          <p className="text-center text-sm text-gray-400 mb-8 font-arabic">
            هناك ثلاثة أوقات نهى النبي ﷺ عن الصلاة فيها، ولا تُصَلَّى فيها إلا الفرائض والصلوات ذات السبب
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {forbiddenTimes.map((time, index) => (
              <div 
                key={index}
                className="bg-gray-800 border border-red-800/30 rounded-lg p-4"
              >
                <div className="flex items-start mb-3">
                  <Clock className="w-5 h-5 text-red-400 mt-1 ml-2" />
                  <div>
                    <h4 className="font-arabic text-lg text-red-400">{time.description}</h4>
                    <p className="text-sm text-gray-300 font-arabic mt-1">{time.timeRange}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-center font-arabic font-bold text-amber-400 mb-3">ملاحظات هامة</h3>
          <ul className="text-sm text-gray-300 font-arabic space-y-2">
            <li>• الصلوات ذات السبب: هي الصلوات التي لها سبب يوجبها مثل صلاة الكسوف وتحية المسجد وسجود التلاوة.</li>
            <li>• يجوز قضاء الفرائض الفائتة في هذه الأوقات.</li>
            <li>• لا يجوز تأخير الفريضة حتى يدخل وقت النهي.</li>
          </ul>
        </div>
        
        {/* القرآن والسنة Sources */}
        <div className="mt-6 bg-gray-800/30 rounded-lg p-4">
          <h3 className="text-center font-arabic font-bold text-green-400 mb-3">من السنة النبوية</h3>
          <div className="text-sm text-gray-300 font-arabic text-right border-r-2 border-green-700 pr-3">
            <p className="mb-2">"نهى رسول الله ﷺ أن نصلي فيهن أو أن نقبر فيهن موتانا: حين تطلع الشمس بازغة حتى ترتفع، وحين يقوم قائم الظهيرة حتى تزول الشمس، وحين تتضيف الشمس للغروب حتى تغرب"</p>
            <p className="text-xs text-gray-400">رواه مسلم</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around border-t border-gray-800">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">المنوعة</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">المفضلة</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">القبلة</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-amber-400 font-arabic">الصلاة</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">العداد</span>
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPrayerTimes;
