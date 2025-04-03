
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ChevronLeft, ChevronRight, Settings, List, Search, Heart, Share2 } from "lucide-react";
import { tasbeehItems } from "../data/tasbeehData";

const Tasbih = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [currentTasbihIndex, setCurrentTasbihIndex] = useState(0);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [tasbihHistory, setTasbihHistory] = useState<{date: string, count: number, text: string}[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(tasbeehItems);
  const [viewMode, setViewMode] = useState<'counter' | 'list'>('list');

  const currentTasbih = tasbeehItems[currentTasbihIndex];

  useEffect(() => {
    // Load saved data from localStorage
    const savedCount = localStorage.getItem("tasbih_count");
    const savedIndex = localStorage.getItem("tasbih_index");
    const savedTarget = localStorage.getItem("tasbih_target");
    const savedFavorites = localStorage.getItem("tasbih_favorites");
    
    if (savedCount) setCount(Number(savedCount));
    if (savedIndex) setCurrentTasbihIndex(Number(savedIndex));
    if (savedTarget) setTarget(Number(savedTarget));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    // Save to localStorage on changes
    localStorage.setItem("tasbih_count", String(count));
    localStorage.setItem("tasbih_index", String(currentTasbihIndex));
    localStorage.setItem("tasbih_target", String(target));
    localStorage.setItem("tasbih_favorites", JSON.stringify(favorites));
  }, [count, currentTasbihIndex, target, favorites]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tasbeehItems.filter(item => 
        item.text.includes(searchQuery) || 
        item.virtue.includes(searchQuery)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(tasbeehItems);
    }
  }, [searchQuery]);

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
    const nextIndex = (currentTasbihIndex + 1) % tasbeehItems.length;
    setCurrentTasbihIndex(nextIndex);
    setCount(0);
  };

  const prevTasbih = () => {
    const prevIndex = currentTasbihIndex === 0 ? tasbeehItems.length - 1 : currentTasbihIndex - 1;
    setCurrentTasbihIndex(prevIndex);
    setCount(0);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
    
    toast({
      title: favorites.includes(id) ? "تم الإزالة من المفضلة" : "تم الإضافة للمفضلة",
      description: ""
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect above
  };

  const selectTasbih = (index: number) => {
    setCurrentTasbihIndex(index);
    setCount(0);
    setViewMode('counter');
  };

  const shareTasbih = () => {
    if (navigator.share) {
      navigator.share({
        title: "تسبيح",
        text: `${currentTasbih.text}\n${currentTasbih.virtue}`,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      toast({
        title: "المشاركة غير متاحة",
        description: "متصفحك لا يدعم ميزة المشاركة"
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
        <h2 className="text-xl font-arabic font-bold">تسابيح</h2>
        <div className="flex items-center">
          <button onClick={() => setShowSearch(!showSearch)} className="p-2">
            <Search className="w-5 h-5" />
          </button>
          {viewMode === 'counter' && (
            <button onClick={() => setViewMode('list')} className="p-2">
              <List className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-black px-4 py-2 border-b border-gray-800">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن تسبيح..."
              className="w-full bg-gray-900 text-white rounded-lg py-2 px-4 font-arabic text-right pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </form>
        </div>
      )}
      
      {viewMode === 'list' ? (
        // Tasbih List View
        <div className="flex-1 bg-black p-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((tasbih, index) => (
              <div 
                key={tasbih.id}
                className={`relative ${tasbih.backgroundColor} rounded-lg p-4 overflow-hidden`}
                onClick={() => selectTasbih(index)}
              >
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tasbih.id);
                    }}
                    className="text-gray-700 hover:text-red-500"
                  >
                    <Heart 
                      className="w-4 h-4" 
                      fill={favorites.includes(tasbih.id) ? "red" : "none"}
                    />
                  </button>
                </div>
                <h3 className="text-center font-arabic text-lg font-bold mt-3 mb-1">
                  {tasbih.text}
                </h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Tasbih Counter View
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
          
          <p className="text-sm text-gray-400 text-center mb-6 font-arabic">
            {currentTasbih.virtue}
          </p>

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
              <RefreshCw className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextTasbih}
              className="p-3 bg-gray-900 rounded-full text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button 
              onClick={() => toggleFavorite(currentTasbih.id)}
              className="p-3 bg-gray-900 rounded-full text-white"
            >
              <Heart 
                className="h-5 w-5" 
                fill={favorites.includes(currentTasbih.id) ? "red" : "none"} 
              />
            </button>
            
            <button 
              onClick={shareTasbih}
              className="p-3 bg-gray-900 rounded-full text-white"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      
      {viewMode === 'counter' && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={incrementCount}
          className="bg-teal-800 hover:bg-teal-700 text-white py-8 text-xl font-arabic"
        >
          اضغط للتسبيح
        </motion.button>
      )}
    </div>
  );
};

export default Tasbih;
