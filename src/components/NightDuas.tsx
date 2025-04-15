
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from "../contexts/AppSettingsContext";
import { Moon, ChevronRight, Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface NightDua {
  id: string;
  arabic: string;
  translation?: string;
  reference?: string;
}

const nightDuas: NightDua[] = [
  {
    id: "night-dua-1",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ.",
    translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is no deity except You.",
    reference: "أبو داود والترمذي"
  },
  {
    id: "night-dua-2",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.",
    translation: "O Allah, I seek refuge in You from disbelief and poverty. O Allah, I seek refuge in You from the punishment of the grave. There is no deity except You.",
    reference: "أبو داود والنسائي"
  },
  {
    id: "night-dua-3",
    arabic: "لا إلهَ إلاّ اللّهُ وَحْدَهُ لا شَريكَ لهُ، لهُ المُلْكُ ولهُ الحَمْدُ، وهُوَ على كلّ شيءٍ قديرٌ، سُبْحانَ اللّهِ، والحمْدُ للّهِ، ولا إلهَ إلاّ اللّهُ، واللّهُ أكبَرُ، وَلا حَوْلَ وَلا قُوَّةَ إِلاّ بِاللّهِ العليِّ العظيمِ، ربِّ اغْفِرْ لي.",
    translation: "There is no deity except Allah, alone, with no partner. His is the dominion and His is the praise, and He is over all things competent. Glory is to Allah, and praise is to Allah, and there is no deity except Allah, and Allah is the greatest. And there is no might nor power except by Allah, the Most High, the Most Great. O Lord, forgive me.",
    reference: "البخاري"
  },
  {
    id: "night-dua-4",
    arabic: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِيَ إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.",
    translation: "O Allah, I submit myself to You, and entrust my affairs to You, and turn my face to You, and I put my complete trust in You, hoping in You and fearing You. There is no refuge and no escape from You except to You. I believe in Your Book which You have revealed, and Your Prophet whom You have sent.",
    reference: "البخاري ومسلم"
  },
  {
    id: "night-dua-5",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
    translation: "In Your name, O Allah, I die and I live.",
    reference: "البخاري"
  }
];

export const NightDuas: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { toast } = useToast();
  const isArabic = settings.language === "ar";
  
  const getRandomDua = (): NightDua => {
    const randomIndex = Math.floor(Math.random() * nightDuas.length);
    return nightDuas[randomIndex];
  };
  
  const [currentDua, setCurrentDua] = React.useState<NightDua>(getRandomDua());
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    const savedFavorites = localStorage.getItem("azkar-favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const changeDua = () => {
    let newDua = getRandomDua();
    // Make sure we don't get the same dua twice in a row
    while (newDua.id === currentDua.id) {
      newDua = getRandomDua();
    }
    setCurrentDua(newDua);
  };
  
  const toggleFavorite = () => {
    const isCurrentFavorite = favorites.includes(currentDua.id);
    
    if (isCurrentFavorite) {
      setFavorites(favorites.filter(id => id !== currentDua.id));
      toast({
        title: settings.language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from favorites",
        description: ""
      });
    } else {
      setFavorites([...favorites, currentDua.id]);
      toast({
        title: settings.language === "ar" ? "تمت الإضافة للمفضلة" : "Added to favorites",
        description: ""
      });
    }
    
    localStorage.setItem("azkar-favorites", JSON.stringify(
      isCurrentFavorite 
        ? favorites.filter(id => id !== currentDua.id)
        : [...favorites, currentDua.id]
    ));
  };
  
  const isCurrentFavorite = favorites.includes(currentDua.id);
  
  return (
    <div className="relative min-h-[200px] bg-gradient-to-br from-slate-900 to-indigo-900 border border-indigo-800/30 p-4 rounded-xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-2 right-2 opacity-20">
        <Moon className="w-12 h-12 text-indigo-300" />
      </div>
      
      <div className="absolute top-3 left-3 flex items-center z-10">
        <h3 className="text-lg font-arabic text-indigo-300">
          {isArabic ? "دعاء من تعار من الليل" : "Night Duas"}
        </h3>
      </div>
      
      <div className="flex justify-around absolute bottom-3 right-3 z-10">
        <button 
          onClick={toggleFavorite}
          className="flex items-center text-xs text-indigo-300 hover:text-indigo-200 mr-4"
        >
          <Heart className={`w-4 h-4 ${isCurrentFavorite ? 'fill-indigo-300 text-indigo-300' : 'text-indigo-300'}`} />
        </button>
        
        <button 
          onClick={() => navigate("/category/night-duas")}
          className="flex items-center text-xs text-indigo-300 hover:text-indigo-200"
        >
          {isArabic ? "المزيد" : "More"}
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
      
      <div className="flex justify-center items-center mt-12 mb-12">
        <div onClick={changeDua} className="max-w-sm">
          <p className="text-center font-arabic text-white text-base leading-loose">
            {currentDua.arabic}
          </p>
          
          {currentDua.reference && (
            <p className="text-center text-xs text-indigo-300 mt-2">
              {currentDua.reference}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NightDuas;
