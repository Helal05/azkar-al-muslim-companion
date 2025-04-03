
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { rawathib } from "../data/duaData";

const SunnahPrayers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center">
        <button onClick={() => navigate("/prayer-times")} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">السنن الرواتب</h2>
      </div>
      
      <div className="p-4 bg-gray-900/30">
        <p className="font-arabic text-white text-center mb-4">
          السنن الرواتب هي الصلوات التطوعية المؤكدة التي كان يصليها النبي ﷺ قبل الصلاة المفروضة أو بعدها
        </p>
      </div>
      
      {/* Rawatib List */}
      <div className="flex-1 bg-black p-4">
        {rawathib.map((prayer, index) => (
          <div 
            key={index}
            className="mb-4 bg-gray-900/20 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-800 py-2 px-4">
              <h3 className="font-arabic text-lg text-white">{prayer.prayer}</h3>
            </div>
            
            <div className="p-4 flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="font-arabic text-gray-300">قبل الفريضة:</span>
                <span className="font-arabic text-white">{prayer.before} ركعات</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-arabic text-gray-300">بعد الفريضة:</span>
                <span className="font-arabic text-white">{prayer.after} ركعات</span>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="font-arabic text-gray-400 text-sm">{prayer.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gray-900/20 rounded-lg">
          <h3 className="font-arabic text-lg text-white mb-2">فضل السنن الرواتب</h3>
          <p className="font-arabic text-gray-300">
            قال رسول الله ﷺ: «مَا مِنْ عَبْدٍ مُسْلِمٍ يُصَلِّي لِلَّهِ تَعَالَى كُلَّ يَوْمٍ ثِنْتَيْ عَشْرَةَ رَكْعَةً تَطَوُّعًا غَيْرَ الْفَرِيضَةِ إِلَّا بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ»
          </p>
          <p className="font-arabic text-gray-400 text-sm mt-2">رواه مسلم</p>
        </div>
      </div>
    </div>
  );
};

export default SunnahPrayers;
