
import React from "react";
import { Heart } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";

interface NightDua {
  id: string;
  arabic: string;
  translation: string;
  transliteration: string;
  reference: string;
}

// Night duas for when one wakes up during the night
const nightDuas: NightDua[] = [
  {
    id: "night-dua-1",
    arabic: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير، الحمد لله، وسبحان الله، ولا إله إلا الله، والله أكبر، ولا حول ولا قوة إلا بالله العلي العظيم، رب اغفر لي",
    translation: "There is none worthy of worship but Allah alone, Who has no partner. His is the dominion and to Him belongs all praise, and He is able to do all things. Glory is to Allah. Praise is to Allah. There is none worthy of worship but Allah. Allah is the Most Great. There is no might and no power except by Allah's leave, the Exalted, the Mighty. My Lord, forgive me.",
    transliteration: "Laa 'ilaaha 'illallaahu wahdahu laa shareeka lahu, lahul-mulku wa lahul-hamdu, wa Huwa 'alaa kulli shay'in Qadeer. Al-hamdu lillaahi, wa Subhaanallaahi, wa laa 'ilaaha 'illallaahu, wallaahu 'Akbar, wa laa hawla wa laa Quwwata 'illaa billaahil-'Aliyyil-'Adheem. Rabbigh-fir lee.",
    reference: "صحيح البخاري"
  },
  {
    id: "night-dua-2",
    arabic: "اللهُمَّ لَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَوَاتِ وَالأَرْضِ وَمَنْ فِيهِنَّ",
    translation: "O Allah! All praise is due to You. You are the Sustainer of the heavens and the Earth and whatever is in them. All praise is due to You. You are the Light of the heavens and the Earth and whatever is in them.",
    transliteration: "Allaahumma lakal-hamdu 'Anta Qayyimus-samaawaati wal'ardhi wa man feehinna, wa lakal-hamdu 'Anta Noorus-samaawaati wal'ardhi wa man feehinna.",
    reference: "صحيح البخاري"
  },
  {
    id: "night-dua-3",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    transliteration: "Alhamdu lillahil-lathee ahyana ba'da ma amatana wa'ilayhin-nushoor.",
    reference: "صحيح البخاري"
  }
];

interface NightDuasProps {
  onAddToFavorites?: (duaId: string) => void;
}

const NightDuas: React.FC<NightDuasProps> = ({ onAddToFavorites }) => {
  const { settings } = useAppSettings();
  const [currentDuaIndex, setCurrentDuaIndex] = React.useState(0);
  
  // Rotate through the duas automatically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDuaIndex((prev) => (prev + 1) % nightDuas.length);
    }, 30000); // Change every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const currentDua = nightDuas[currentDuaIndex];
  
  return (
    <div className="rounded-lg p-4 overflow-hidden border border-violet-800/30 bg-gradient-to-r from-violet-900/20 to-violet-800/5">
      <div className="flex justify-between items-start mb-2">
        <p className="text-violet-400 text-lg font-arabic text-center">
          {settings.language === "ar" ? "دعاء من تعار من الليل" : "Dua for waking up at night"}
        </p>
        <button 
          onClick={() => onAddToFavorites?.(currentDua.id)}
          className="p-1.5 bg-violet-900/30 rounded-full hover:bg-violet-800/50 transition-colors"
        >
          <Heart className="w-4 h-4 text-violet-400" />
        </button>
      </div>
      
      <div className="mt-2 text-right space-y-3">
        <p className="text-white font-arabic text-base leading-relaxed">
          {currentDua.arabic}
        </p>
        
        {settings.language === "en" && (
          <>
            <p className="text-white/70 text-sm italic">
              {currentDua.transliteration}
            </p>
            <p className="text-white/80 text-sm">
              {currentDua.translation}
            </p>
          </>
        )}
        
        <p className="text-violet-400/80 text-xs text-left mt-2">
          {currentDua.reference}
        </p>
      </div>
    </div>
  );
};

export default NightDuas;
