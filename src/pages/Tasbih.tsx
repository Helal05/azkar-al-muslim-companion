
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Refresh, ChevronLeft, ChevronRight, Settings, List } from "lucide-react";
import { azkarItems } from "../data/azkarData";

const tasbihItems = azkarItems.filter(item => item.category === "tasbih");

const Tasbih = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [currentTasbihIndex, setCurrentTasbihIndex] = useState(0);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [tasbihHistory, setTasbihHistory] = useState<{date: string, count: number, text: string}[]>([]);

  const currentTasbih = tasbihItems[currentTasbihIndex];

  useEffect(() => {
    // Load saved data from localStorage
    const savedCount = localStorage.getItem("tasbih_count");
    const savedIndex = localStorage.getItem("tasbih_index");
    const savedTarget = localStorage.getItem("tasbih_target");
    
    if (savedCount) setCount(Number(savedCount));
    if (savedIndex) setCurrentTasbihIndex(Number(savedIndex));
    if (savedTarget) setTarget(Number(savedTarget));
  }, []);

  useEffect(() => {
    // Save to localStorage on changes
    localStorage.setItem("tasbih_count", String(count));
    localStorage.setItem("tasbih_index", String(currentTasbihIndex));
    localStorage.setItem("tasbih_target", String(target));
  }, [count, currentTasbihIndex, target]);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Vibrate if enabled
    if (vibrationEnabled && "vibrate" in navigator) {
      navigator.vibrate(30);
    }
    
    // Check if reached target
    if (newCount === target) {
      toast({
        title: "أحسنت!",
        description: `وصلت إلى الهدف: ${target}`,
      });
      
      // Add to history
      const now = new Date();
      const newHistoryItem = {
        date: now.toLocaleString("ar-SA"),
        count: newCount,
        text: currentTasbih.text
      };
      
      setTasbihHistory(prev => [...prev, newHistoryItem]);
    }
  };

  const resetCount = () => {
    setCount(0);
    toast({
      title: "تم التصفير",
      description: "تم تصفير العداد"
    });
  };

  const nextTasbih = () => {
    const nextIndex = (currentTasbihIndex + 1) % tasbihItems.length;
    setCurrentTasbihIndex(nextIndex);
    setCount(0);
  };

  const prevTasbih = () => {
    const prevIndex = currentTasbihIndex === 0 ? tasbihItems.length - 1 : currentTasbihIndex - 1;
    setCurrentTasbihIndex(prevIndex);
    setCount(0);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="p-2">
          <List className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">المسبحة الإلكترونية</h2>
        <button className="p-2">
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      {/* Tasbih Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Progress Arc */}
        <div className="w-64 h-64 relative mb-8">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#333"
              strokeWidth="5"
            />
            
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#4A8262"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${(count / target) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Count Display */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white">{count}</span>
            <span className="text-sm text-gray-400 mt-2">الهدف: {target}</span>
          </div>
        </div>
        
        {/* Tasbih Text */}
        <h2 className="text-2xl font-arabic font-bold text-teal-400 text-center mb-4">
          {currentTasbih.text}
        </h2>

        {/* Tasbih Controls */}
        <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-8">
          <button
            onClick={prevTasbih}
            className="p-3 bg-gray-900 rounded-full text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <button
            onClick={resetCount}
            className="p-3 bg-gray-900 rounded-full text-white"
          >
            <Refresh className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextTasbih}
            className="p-3 bg-gray-900 rounded-full text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Tasbih Click Area */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={incrementCount}
        className="bg-teal-800 hover:bg-teal-700 text-white py-8 text-xl font-arabic"
      >
        اضغط للتسبيح
      </motion.button>
    </div>
  );
};

export default Tasbih;
