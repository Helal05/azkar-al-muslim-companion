
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { azkarItems, azkarCategories } from "../data/azkarData";
import Header from "../components/Header";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AzkarList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  useEffect(() => {
    // Reset counter when azkar changes
    if (categoryAzkar[currentIndex]) {
      setCounter(categoryAzkar[currentIndex].count);
    }
  }, [currentIndex, categoryId]);
  
  if (!category || categoryAzkar.length === 0) {
    return (
      <div className="min-h-screen pattern-bg flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-arabic text-islamic-green-dark dark:text-islamic-neutral">
            لا توجد أذكار في هذا القسم
          </p>
        </div>
      </div>
    );
  }
  
  const currentAzkar = categoryAzkar[currentIndex];
  
  const decrementCounter = () => {
    if (counter > 0) {
      const newCount = counter - 1;
      setCounter(newCount);
      
      if (newCount === 0) {
        setCompleted([...completed, currentIndex]);
        toast({
          title: "أحسنت!",
          description: "تم الانتهاء من هذا الذكر",
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
  
  return (
    <div className="min-h-screen pattern-bg flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-arabic font-bold text-islamic-green-dark dark:text-islamic-neutral">
            {category.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {currentIndex + 1} / {categoryAzkar.length}
          </p>
        </div>
        
        <div className="flex-1 flex flex-col">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div 
              className="azkar-card flex-1 flex flex-col"
              onClick={decrementCounter}
            >
              <div className="arabic-text text-xl mb-6 flex-1 flex items-center justify-center">
                {currentAzkar.text}
              </div>
              
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="counter-badge">
                    {counter} / {currentAzkar.count}
                  </span>
                  
                  {currentAzkar.reference && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 arabic-text">
                      {currentAzkar.reference}
                    </span>
                  )}
                </div>
                
                {currentAzkar.translation && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                    {currentAzkar.translation}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
          
          <div className="mt-6 flex justify-between">
            <button 
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full ${
                currentIndex === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                  : 'bg-islamic-blue dark:bg-islamic-blue-dark text-white hover:bg-islamic-blue-dark'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={goToNext}
              disabled={currentIndex === categoryAzkar.length - 1}
              className={`p-3 rounded-full ${
                currentIndex === categoryAzkar.length - 1 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500' 
                  : 'bg-islamic-blue dark:bg-islamic-blue-dark text-white hover:bg-islamic-blue-dark'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AzkarList;
