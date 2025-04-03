
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { duha } from "../data/duaData";

const DuhaPrayer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center">
        <button onClick={() => navigate("/prayer-times")} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">صلاة الضحى</h2>
      </div>
      
      <div className="p-4 bg-amber-900/20">
        <p className="font-arabic text-amber-200 text-center text-lg mb-2">
          صلاة الضحى من أعظم النوافل وأجلها
        </p>
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-black p-4">
        <div className="mb-6 bg-gray-900/20 rounded-lg overflow-hidden">
          <div className="bg-gray-800 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">وقت صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-white">{duha.time}</p>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-900/20 rounded-lg overflow-hidden">
          <div className="bg-gray-800 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">عدد ركعات صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-white">{duha.rakaat}</p>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-900/20 rounded-lg overflow-hidden">
          <div className="bg-gray-800 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">فضل صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-white">{duha.virtue}</p>
            
            <div className="mt-4 border-t border-gray-700 pt-4">
              <p className="font-arabic text-white">قال النبي ﷺ: «يصبح على كل سلامى من أحدكم صدقة، فكل تسبيحة صدقة، وكل تحميدة صدقة، وكل تهليلة صدقة، وكل تكبيرة صدقة، وأمر بالمعروف صدقة، ونهي عن المنكر صدقة، ويجزئ من ذلك ركعتان يركعهما من الضحى»</p>
              <p className="font-arabic text-gray-400 text-sm mt-2">رواه مسلم</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6 bg-gray-900/20 rounded-lg overflow-hidden">
          <div className="bg-gray-800 py-2 px-4">
            <h3 className="font-arabic text-lg text-white">كيفية صلاة الضحى</h3>
          </div>
          
          <div className="p-4">
            <p className="font-arabic text-white">صلاة الضحى مثنى مثنى كباقي النوافل، أي كل ركعتين بتسليمة. ويقرأ في كل ركعة بعد الفاتحة ما تيسر من القرآن، ويستحب أن يقرأ في الركعة الأولى بـ (والشمس وضحاها)، وفي الثانية بـ (والضحى).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuhaPrayer;
