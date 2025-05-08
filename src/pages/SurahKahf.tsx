
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const SurahKahf = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">سورة الكهف</h2>
      </div>
      
      {/* Surah Header */}
      <div className="p-4 flex justify-center">
        <div className="border-b border-gray-700 w-full max-w-xl flex justify-center items-center pb-2">
          <img 
            src="/patterns/islamic-pattern.svg" 
            alt="Islamic Pattern" 
            className="w-full max-w-xs opacity-50"
          />
          <div className="absolute">
            <h1 className="font-arabic text-white text-2xl">سورة الكهف</h1>
          </div>
        </div>
      </div>
      
      {/* Surah Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="font-arabic text-white text-right text-2xl leading-loose">
          <p className="text-center mb-8 text-4xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p>الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا <span className="inline-block rounded-full bg-gray-800 w-6 h-6 text-sm flex items-center justify-center mx-1">١</span></p>
          <p>قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا <span className="inline-block rounded-full bg-gray-800 w-6 h-6 text-sm flex items-center justify-center mx-1">٢</span></p>
          <p>مَاكِثِينَ فِيهِ أَبَدًا <span className="inline-block rounded-full bg-gray-800 w-6 h-6 text-sm flex items-center justify-center mx-1">٣</span></p>
          <p>وَيُنْذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا <span className="inline-block rounded-full bg-gray-800 w-6 h-6 text-sm flex items-center justify-center mx-1">٤</span></p>
          <p>مَا لَهُمْ بِهِ مِنْ عِلْمٍ وَلَا لِآبَائِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَاهِهِمْ ۚ إِنْ يَقُولُونَ إِلَّا كَذِبًا <span className="inline-block rounded-full bg-gray-800 w-6 h-6 text-sm flex items-center justify-center mx-1">٥</span></p>
          
          {/* Add more verses as needed */}
        </div>
        
        <div className="text-center mt-8 text-gray-500">
          <p className="font-arabic">٢٩٣</p>
        </div>
      </div>
    </div>
  );
};

export default SurahKahf;
