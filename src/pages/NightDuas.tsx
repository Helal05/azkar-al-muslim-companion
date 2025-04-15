
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, List, Share2, Heart, Moon } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";

// Night Duas data
const nightDuas = [
  {
    id: "night-dua-1",
    arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
    translation: "O Allah, with Your name I die and live",
    benefit: "دعاء قبل النوم",
    reference: "البخاري، كتاب الدعوات",
    count: 1
  },
  {
    id: "night-dua-2",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: "I seek refuge in the Perfect Words of Allah from the evil of what He has created",
    benefit: "دعاء للحماية أثناء الليل",
    reference: "مسلم",
    count: 3
  },
  {
    id: "night-dua-3",
    arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
    translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants",
    benefit: "دعاء قبل النوم",
    reference: "أبو داود والترمذي",
    count: 3
  },
  {
    id: "night-dua-4",
    arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا، بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    translation: "In Your name my Lord, I lie down, and in Your name I rise. So if You take my soul then have mercy upon it, and if You release it then protect it with that which You protect Your righteous servants",
    benefit: "دعاء عند النوم للحماية الإلهية",
    reference: "البخاري ومسلم",
    count: 1
  },
  {
    id: "night-dua-5",
    arabic: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا. اللَّهُمَّ إِنِّي أَسْأَلُكَ العَافِيَةَ",
    translation: "O Allah, You created my soul and You take it back. Unto You is its death and its life. If You give it life then protect it, and if You cause it to die then forgive it. O Allah, I ask You for well-being",
    benefit: "دعاء قبل النوم للحماية والمغفرة",
    reference: "مسلم",
    count: 1
  },
  {
    id: "night-dua-6",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ",
    translation: "Praise is to Allah, Who fed us and gave us to drink, and Who sufficed us and gave us shelter. How many are there with no one to suffice them or give them shelter",
    benefit: "الشكر لله قبل النوم",
    reference: "مسلم",
    count: 1
  },
  {
    id: "night-dua-7",
    arabic: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا، أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ",
    translation: "O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things, I bear witness that none has the right to be worshipped except You. I seek refuge in You from the evil of my soul and from the evil of Shaitan and his helpers, and from bringing about any harm for myself, or bringing it forth for any Muslim",
    benefit: "دعاء قبل النوم للحماية من الشيطان",
    reference: "أبو داود والترمذي",
    count: 1
  },
  {
    id: "night-dua-8",
    arabic: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
    translation: "O Allah, I submit myself to You, entrust my affairs to You, turn my face to You, and lay myself down depending upon You, hoping in You and fearing You. There is no refuge, and no escape, except to You. I believe in Your Book which You have revealed, and Your Prophet whom You have sent",
    benefit: "دعاء قبل النوم للتوكل على الله",
    reference: "البخاري ومسلم",
    count: 1
  },
  {
    id: "night-dua-9",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translation: "In Your name, O Allah, I die and I live",
    benefit: "ذكر قبل النوم",
    reference: "البخاري",
    count: 1
  },
  {
    id: "night-dua-10",
    arabic: "سُبْحَانَ اللَّهِ (٣٣)، الْحَمْدُ لِلَّهِ (٣٣)، اللَّهُ أَكْبَرُ (٣٤)",
    translation: "Glory be to Allah (33 times), All praise is due to Allah (33 times), Allah is the Greatest (34 times)",
    benefit: "تسبيح قبل النوم",
    reference: "البخاري ومسلم",
    count: 1
  }
];

const NightDuas = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useAppSettings();
  
  const categoryAzkar = nightDuas;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counter, setCounter] = useState(categoryAzkar[0]?.count || 1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem("azkar-favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  useEffect(() => {
    // Reset counter when azkar changes
    if (categoryAzkar[currentIndex]) {
      setCounter(categoryAzkar[currentIndex].count);
    }
  }, [currentIndex]);
  
  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem("azkar-favorites", JSON.stringify(favorites));
  }, [favorites]);
  
  const currentAzkar = categoryAzkar[currentIndex];
  const currentAzkarId = currentAzkar.id;
  const isCurrentFavorite = favorites.includes(currentAzkarId);
  
  const decrementCounter = () => {
    if (counter > 0) {
      const newCount = counter - 1;
      setCounter(newCount);
      
      if (newCount === 0) {
        setCompleted([...completed, currentIndex]);
        toast({
          title: settings.language === "ar" ? "أحسنت!" : "Well done!",
          description: settings.language === "ar" 
            ? "تم الانتهاء من هذا الدعاء" 
            : "You have completed this dua",
        });
        
        // Auto advance to next azkar after a brief delay
        if (currentIndex < categoryAzkar.length - 1) {
          setTimeout(() => {
            goToNext();
          }, 1000);
        }
      }
    }
  };
  
  const goToNext = () => {
    if (currentIndex < categoryAzkar.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const toggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites(favorites.filter(id => id !== currentAzkarId));
      toast({
        title: settings.language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from favorites",
        description: "",
      });
    } else {
      setFavorites([...favorites, currentAzkarId]);
      toast({
        title: settings.language === "ar" ? "تمت الإضافة للمفضلة" : "Added to favorites",
        description: "",
      });
    }
  };
  
  const shareAzkar = () => {
    if (navigator.share) {
      navigator.share({
        title: settings.language === "ar" ? "أدعية الليل" : "Night Duas",
        text: currentAzkar.arabic,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(currentAzkar.arabic).then(() => {
        toast({
          title: settings.language === "ar" ? "تم النسخ" : "Copied to clipboard",
          description: settings.language === "ar" 
            ? "تم نسخ الدعاء إلى الحافظة"
            : "Dua was copied to clipboard",
        });
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 text-white p-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {settings.language === "ar" ? "أدعية الليل" : "Night Duas"}
        </h2>
        <div className="w-5 h-5">
          <Moon className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
      
      {/* Dua Content */}
      <div className="flex-1 flex flex-col p-2">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col"
        >
          <div 
            className="flex-1 flex flex-col bg-slate-800/20 p-6 rounded-lg border border-indigo-900/30"
            onClick={decrementCounter}
          >
            <div className="arabic-text text-xl font-bold mb-6 flex-1 flex items-center justify-center text-white leading-loose">
              {currentAzkar.arabic}
            </div>
            
            {settings.language !== "ar" && (
              <div className="mt-4 mb-2 text-center">
                <p className="text-indigo-300 text-base">
                  {currentAzkar.translation}
                </p>
              </div>
            )}
            
            {currentAzkar.benefit && (
              <div className="mt-4 mb-4">
                <p className="text-indigo-400 font-arabic text-base text-right">
                  {currentAzkar.benefit}
                </p>
                {currentAzkar.reference && (
                  <p className="text-gray-500 text-sm font-arabic text-right">
                    ({currentAzkar.reference})
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Bottom Navigation and Controls */}
        <div className="bg-slate-800/50 p-4 mt-2 flex items-center justify-between rounded-lg">
          <span className="text-white font-mono">
            {currentIndex + 1}/{categoryAzkar.length}
          </span>
          
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button 
              onClick={toggleFavorite}
              className="text-white"
              aria-label={isCurrentFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            >
              <Heart className={`h-6 w-6 ${isCurrentFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            
            <button 
              onClick={shareAzkar}
              className="text-white"
              aria-label="مشاركة الدعاء"
            >
              <Share2 className="h-6 w-6" />
            </button>
            
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`p-1 rounded-full ${
                currentIndex === 0 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white'
              }`}
              aria-label="الدعاء السابق"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Counter Badge */}
            <button 
              onClick={decrementCounter}
              className="bg-indigo-900/50 text-white px-3 py-1 rounded-full text-sm font-mono"
              aria-label="عدد التكرارات"
            >
              {counter}/{currentAzkar.count}
            </button>
            
            <button
              onClick={goToNext}
              disabled={currentIndex === categoryAzkar.length - 1}
              className={`p-1 rounded-full ${
                currentIndex === categoryAzkar.length - 1 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white'
              }`}
              aria-label="الدعاء التالي"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NightDuas;
