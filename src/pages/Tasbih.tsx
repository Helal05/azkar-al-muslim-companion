
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ChevronLeft, ChevronRight, Settings, List, Search, Heart, Share2 } from "lucide-react";

const Tasbih = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Load saved data from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem("tasbih_count");
    const savedTarget = localStorage.getItem("tasbih_target");
    
    if (savedCount) setCount(Number(savedCount));
    if (savedTarget) setTarget(Number(savedTarget));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("tasbih_count", String(count));
    localStorage.setItem("tasbih_target", String(target));
  }, [count, target]);

  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Play sound if enabled
    if (soundEnabled) {
      const audio = new Audio('/click.mp3');
      audio.play().catch(err => console.error("Error playing sound:", err));
    }
    
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
    }
  };

  const resetCount = () => {
    setCount(0);
    toast({
      title: "تم التصفير",
      description: "تم تصفير العداد"
    });
  };

  const shareCounter = () => {
    if (navigator.share) {
      navigator.share({
        title: "عداد التسبيح",
        text: `عدد تسبيحاتي: ${count}/${target}`,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      toast({
        title: "المشاركة غير متاحة",
        description: "متصفحك لا يدعم ميزة المشاركة"
      });
    }
  };

  // List of common azkar
  const commonAzkar = [
    "سبحان الله",
    "الحمد لله",
    "الله أكبر",
    "لا إله إلا الله",
    "سبحان الله وبحمده",
    "لا حول ولا قوة إلا بالله",
    "أستغفر الله",
    "سبحان الله وبحمده سبحان الله العظيم"
  ];
  
  // Select a default zikr
  const [selectedZikr, setSelectedZikr] = useState(commonAzkar[0]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">عداد الأذكار</h2>
        <button onClick={() => navigate("/settings")} className="p-2">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Tasbih Counter View */}
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
        
        {/* Selected Zikr Text */}
        <h2 className="text-2xl font-arabic font-bold text-teal-400 text-center mb-6">
          {selectedZikr}
        </h2>

        {/* Tasbih Controls */}
        <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-8">
          <button
            onClick={resetCount}
            className="p-3 bg-gray-900 rounded-full text-white"
          >
            <RefreshCw className="h-6 w-6" />
          </button>
          
          <button 
            onClick={shareCounter}
            className="p-3 bg-gray-900 rounded-full text-white"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>
        
        {/* Zikr Selection */}
        <div className="w-full mb-8">
          <select
            value={selectedZikr}
            onChange={(e) => setSelectedZikr(e.target.value)}
            className="w-full bg-gray-900 text-white rounded-lg py-2 px-4 font-arabic text-center"
          >
            {commonAzkar.map((zikr, index) => (
              <option key={index} value={zikr}>{zikr}</option>
            ))}
          </select>
        </div>
        
        {/* Target Selection */}
        <div className="w-full mb-6">
          <label className="block text-white text-sm font-arabic mb-1 text-right">
            تعديل الهدف:
          </label>
          <div className="flex justify-between items-center bg-gray-900 rounded-lg p-2">
            {[33, 66, 99, 100, 500, 1000].map((num) => (
              <button
                key={num}
                onClick={() => setTarget(num)}
                className={`py-1 px-3 rounded-md ${
                  target === num ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={incrementCount}
        className="bg-teal-800 hover:bg-teal-700 text-white py-8 text-xl font-arabic"
      >
        اضغط للتسبيح
      </motion.button>

      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">المنوعة</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">القبلة</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">الصلاة</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300 font-arabic">المفضلة</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-amber-400 font-arabic">العداد</span>
        </button>
      </div>
    </div>
  );
};

export default Tasbih;
