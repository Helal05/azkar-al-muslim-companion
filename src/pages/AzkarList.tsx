
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { azkarItems, azkarCategories } from "../data/azkarData";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, List, Share, Heart } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";

const AzkarList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useAppSettings();
  
  // Find the current category
  const category = azkarCategories.find(cat => cat.id === categoryId);
  
  // Special handling for Tasbih and Qibla
  if (categoryId === "tasbih") {
    navigate("/tasbih");
    return null;
  }
  
  if (categoryId === "qibla") {
    navigate("/qibla");
    return null;
  }
  
  // Filter azkar by category
  const categoryAzkar = azkarItems.filter(item => item.category === categoryId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counter, setCounter] = useState(categoryAzkar[0]?.count || 0);
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
  }, [currentIndex, categoryId]);
  
  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem("azkar-favorites", JSON.stringify(favorites));
  }, [favorites]);
  
  if (!category || categoryAzkar.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <button onClick={() => navigate("/")} className="p-2">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-arabic font-bold">
            {category?.name || "الأذكار"}
          </h2>
          <div className="w-5"></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-arabic text-gray-400">
            لا توجد أذكار في هذا القسم
          </p>
        </div>
      </div>
    );
  }
  
  const currentAzkar = categoryAzkar[currentIndex];
  const isCurrentFavorite = favorites.includes(currentAzkar.id);
  
  const decrementCounter = () => {
    if (counter > 0) {
      const newCount = counter - 1;
      setCounter(newCount);
      
      if (newCount === 0) {
        setCompleted([...completed, currentIndex]);
        toast({
          title: settings.language === "ar" ? "أحسنت!" : "Well done!",
          description: settings.language === "ar" 
            ? "تم الانتهاء من هذا الذكر" 
            : "You have completed this dhikr",
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
      setFavorites(favorites.filter(id => id !== currentAzkar.id));
      toast({
        title: settings.language === "ar" ? "تمت الإزالة من المفضلة" : "Removed from favorites",
        description: "",
      });
    } else {
      setFavorites([...favorites, currentAzkar.id]);
      toast({
        title: settings.language === "ar" ? "تمت الإضافة للمفضلة" : "Added to favorites",
        description: "",
      });
    }
  };
  
  const shareAzkar = () => {
    if (navigator.share) {
      navigator.share({
        title: category.name,
        text: currentAzkar.arabic,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(currentAzkar.arabic).then(() => {
        toast({
          title: settings.language === "ar" ? "تم النسخ" : "Copied to clipboard",
          description: settings.language === "ar" 
            ? "تم نسخ الذكر إلى الحافظة"
            : "Dhikr was copied to clipboard",
        });
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="p-2">
          <List className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {category.name}
        </h2>
        <button className="p-2">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Azkar Content */}
      <div className="flex-1 flex flex-col p-2">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col"
        >
          <div 
            className="flex-1 flex flex-col bg-black p-4"
            onClick={decrementCounter}
          >
            <div className="arabic-text text-xl font-bold mb-6 flex-1 flex items-center justify-center text-white leading-loose">
              {currentAzkar.arabic}
            </div>
            
            {currentAzkar.benefit && (
              <div className="mt-4 mb-4">
                <p className="text-cyan-400 font-arabic text-base text-right">
                  {currentAzkar.benefit}
                </p>
                {currentAzkar.reference && (
                  <p className="text-gray-500 text-sm font-arabic text-right">
                    ({currentAzkar.reference})
                  </p>
                )}
              </div>
            )}
            
            {currentAzkar.suraVerse && (
              <p className="text-gray-500 text-sm font-arabic text-right">
                ({currentAzkar.suraVerse})
              </p>
            )}
          </div>
        </motion.div>
        
        {/* Bottom Navigation and Controls */}
        <div className="bg-gray-900 p-4 flex items-center justify-between border-t border-gray-800">
          <span className="text-white font-mono">
            {currentIndex + 1}/{categoryAzkar.length}
          </span>
          
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button 
              onClick={toggleFavorite}
              className="text-white"
            >
              <Heart className={`h-6 w-6 ${isCurrentFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            
            <button 
              onClick={shareAzkar}
              className="text-white"
            >
              <Share className="h-6 w-6" />
            </button>
            
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`p-1 rounded-full ${
                currentIndex === 0 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Counter Badge */}
            <button 
              onClick={decrementCounter}
              className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-mono"
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
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AzkarList;
