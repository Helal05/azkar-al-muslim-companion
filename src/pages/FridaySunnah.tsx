
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BackgroundSelector from "../components/BackgroundSelector";
import AdhkarInstructions from "../components/AdhkarInstructions";
import { useAppSettings } from "../contexts/AppSettingsContext";

const FridaySunnah = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Handle background change
  const handleBackgroundChange = (type: string, backgroundPath?: string, audioPath?: string) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsAudioPlaying(false);
    }
    
    // Set new background
    if (type === 'image' && backgroundPath) {
      setCurrentBackground(backgroundPath);
    } else if (type === 'animated-with-sound' && backgroundPath && audioPath) {
      setCurrentBackground(backgroundPath);
      const audio = new Audio(audioPath);
      audio.loop = true;
      audio.play().then(() => {
        setCurrentAudio(audio);
        setIsAudioPlaying(true);
      }).catch(err => console.error("Error playing audio:", err));
    } else if (type === 'animated-without-sound' && backgroundPath) {
      setCurrentBackground(backgroundPath);
    }
    
    setShowBackgroundSelector(false);
  };

  const sunnah = [
    { id: "ghusl", title: "الإغتسال", description: "يستحب الاغتسال يوم الجمعة" },
    { id: "perfume", title: "التطيب", description: "يستحب التطيب يوم الجمعة" },
    { id: "clothes", title: "لبس أحسن الثياب", description: "يستحب لبس أحسن الثياب يوم الجمعة" },
    { id: "early", title: "التبكير إلى المسجد", description: "يستحب التبكير إلى المسجد يوم الجمعة" },
    { id: "dua", title: "الدعـــــاء", description: "يستحب الإكثار من الدعاء يوم الجمعة" },
    { id: "kahf", title: "قراءة سورة الكهف", description: "يستحب قراءة سورة الكهف يوم الجمعة" }
  ];

  return (
    <div 
      className="min-h-screen text-white flex flex-col"
      style={currentBackground ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {
        backgroundColor: 'black'
      }}
    >
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2"
          aria-label="عودة"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-arabic font-bold">سنن يوم الجمعة</h1>
        <button
          onClick={() => setShowBackgroundSelector(true)}
          className="p-2"
          aria-label="إعدادات الخلفية"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title */}
        <div className="text-center my-4 font-arabic">
          <h2 className="text-2xl font-bold">سنن يوم الجمعة</h2>
        </div>
        
        {/* Grid of Sunnah Items */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {sunnah.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.95 }}
              className="bg-black/60 border border-gray-800 rounded-lg p-4 flex items-center justify-center"
              onClick={() => {
                if (item.id === "kahf") {
                  navigate("/surah-kahf");
                } else if (item.id === "dua") {
                  navigate("/dua-category/jummah");
                }
              }}
            >
              <span className={`font-arabic text-lg ${item.id === "kahf" ? "text-amber-300" : "text-white"}`}>
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Virtues and Duas */}
        <div className="space-y-4 mt-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/60 border border-gray-800 rounded-lg p-4"
          >
            <p className="font-arabic text-center text-lg leading-relaxed">
              اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-black/60 border border-gray-800 rounded-lg p-4"
          >
            <p className="font-arabic text-center text-lg leading-relaxed">
              اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، وَبَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-arabic text-center mb-2">فضائل يوم الجمعة</h3>
            <div className="bg-black/60 border border-gray-800 rounded-lg p-4">
              <p className="font-arabic text-base leading-relaxed">
                عن أبي هريرة رضي الله عنه، عن النبي صلى الله عليه وسلم أنه قال: ((خير يومٍ طلعت فيه الشمس يوم الجمعة؛ فيه خُلِق آدم، وفيه أُدخِل الجنة، وفيه أُخرِج منها، ولا تقوم الساعة إلا في يوم الجمعة)).
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Small button at bottom to show instructions */}
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setShowInstructions(true)}
            className="text-blue-400 text-sm font-arabic"
          >
            كيف تستخدم الأذكار المنوعة
          </button>
        </div>
      </div>

      {/* Background Selector Dialog */}
      <Dialog open={showBackgroundSelector} onOpenChange={setShowBackgroundSelector}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center font-arabic">اختر الخلفية</DialogTitle>
          </DialogHeader>
          <BackgroundSelector onSelectBackground={handleBackgroundChange} />
        </DialogContent>
      </Dialog>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center font-arabic">كيف تستخدم الأذكار المنوعة</DialogTitle>
          </DialogHeader>
          <AdhkarInstructions />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FridaySunnah;
