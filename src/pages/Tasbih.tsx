
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { azkarItems } from "../data/azkarData";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";

const Tasbih = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [currentZikr, setCurrentZikr] = useState(0);
  const { toast } = useToast();
  
  // Filter out only tasbih items
  const tasbihItems = azkarItems.filter(item => item.category === "tasbih");
  
  // Handle the counter increment
  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Create a subtle haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
    
    // Check if we reached the target count
    if (newCount === target) {
      toast({
        title: "أحسنت!",
        description: `تم الوصول إلى ${target} من التسبيح`,
      });
      
      // Create a stronger haptic feedback for completion
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };
  
  // Reset the counter
  const resetCount = () => {
    setCount(0);
  };
  
  // Change the zikr
  const changeZikr = () => {
    const nextIndex = (currentZikr + 1) % tasbihItems.length;
    setCurrentZikr(nextIndex);
    setTarget(tasbihItems[nextIndex].count);
    setCount(0);
  };
  
  // Handle target count change
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTarget(value);
    }
  };
  
  // Save/load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("tasbih-state");
    if (savedState) {
      const { count: savedCount, target: savedTarget, currentZikr: savedZikr } = JSON.parse(savedState);
      setCount(savedCount);
      setTarget(savedTarget);
      setCurrentZikr(savedZikr);
    }
    
    // Save state on unmount
    return () => {
      localStorage.setItem("tasbih-state", JSON.stringify({ count, target, currentZikr }));
    };
  }, []);
  
  // Save state when values change
  useEffect(() => {
    localStorage.setItem("tasbih-state", JSON.stringify({ count, target, currentZikr }));
  }, [count, target, currentZikr]);
  
  const currentTasbih = tasbihItems[currentZikr];
  const progressPercentage = (count / target) * 100;
  
  return (
    <div className="min-h-screen pattern-bg flex flex-col">
      <Header />
      
      <div className="container mx-auto flex-1 flex flex-col justify-center items-center px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-arabic font-bold text-islamic-green-dark dark:text-islamic-neutral">
            المسبحة الإلكترونية
          </h2>
        </div>
        
        <div className="relative w-full max-w-xs">
          {/* Progress ring */}
          <svg className="w-full" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-islamic-green/20 dark:text-islamic-green/10" 
            />
            
            {/* Progress ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 45} 
              strokeDashoffset={2 * Math.PI * 45 * (1 - progressPercentage / 100)}
              className="text-islamic-green dark:text-islamic-green-light transform -rotate-90 origin-center transition-all duration-300" 
            />
          </svg>
          
          {/* Count display */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3, times: [0, 0.2, 1] }}
            key={count}
          >
            <span className="text-5xl font-bold text-islamic-green-dark dark:text-islamic-neutral">
              {count}
            </span>
            <span className="text-sm text-islamic-green-dark/70 dark:text-islamic-neutral/70">
              / {target}
            </span>
          </motion.div>
        </div>
        
        {/* Current zikr text */}
        <div className="my-8 text-center">
          <h3 className="font-arabic text-2xl text-islamic-green-dark dark:text-islamic-neutral mb-1">
            {currentTasbih?.text || "سُبْحَانَ اللهِ"}
          </h3>
          {currentTasbih?.reference && (
            <p className="text-sm text-gray-500 dark:text-gray-400 arabic-text">
              {currentTasbih.reference}
            </p>
          )}
        </div>
        
        {/* Counter button */}
        <motion.button
          className="tasbih-button w-32 h-32 mb-6"
          whileTap={{ scale: 0.95 }}
          onClick={incrementCount}
        >
          <span className="sr-only">Increment</span>
          <span className="font-arabic text-2xl text-white font-bold">إضغط</span>
        </motion.button>
        
        {/* Controls */}
        <div className="flex space-x-4 rtl:space-x-reverse">
          <button 
            onClick={resetCount}
            className="p-3 rounded-full bg-islamic-blue/20 dark:bg-islamic-blue-dark/20 text-islamic-blue-dark dark:text-islamic-blue-light hover:bg-islamic-blue/30 dark:hover:bg-islamic-blue-dark/30"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={changeZikr}
            className="py-2 px-4 rounded-full bg-islamic-blue dark:bg-islamic-blue-dark text-white font-arabic"
          >
            تغيير الذكر
          </button>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <input 
              type="number"
              value={target}
              onChange={handleTargetChange}
              className="w-16 p-2 border border-islamic-green/30 dark:border-islamic-green/20 rounded-md bg-white dark:bg-islamic-green-dark/30 text-center"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasbih;
