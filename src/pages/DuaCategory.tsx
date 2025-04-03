
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { duaCategories } from "../data/duaData";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Heart, Share2, Bookmark } from "lucide-react";

const DuaCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [category, setCategory] = useState(duaCategories.find(c => c.id === categoryId));
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("dua_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [categoryId]);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white font-arabic text-xl">لم يتم العثور على هذه الفئة</p>
        <button
          onClick={() => navigate("/more")}
          className="mt-4 px-6 py-2 bg-islamic-green-dark rounded-lg text-white font-arabic"
        >
          العودة
        </button>
      </div>
    );
  }
  
  const toggleFavorite = (duaId: string) => {
    setFavorites(prev => {
      let updated;
      if (prev.includes(duaId)) {
        updated = prev.filter(id => id !== duaId);
        toast({
          title: "تمت الإزالة من المفضلة",
          description: ""
        });
      } else {
        updated = [...prev, duaId];
        toast({
          title: "تمت الإضافة إلى المفضلة",
          description: ""
        });
      }
      
      localStorage.setItem("dua_favorites", JSON.stringify(updated));
      return updated;
    });
  };
  
  const shareDua = (dua: {
    title: string;
    arabic: string;
    reference: string;
  }) => {
    if (navigator.share) {
      navigator.share({
        title: dua.title,
        text: `${dua.arabic}\n\n${dua.reference}`,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: "المشاركة غير متاحة",
        description: "متصفحك لا يدعم ميزة المشاركة"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center">
        <button onClick={() => navigate("/more")} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">{category.name}</h2>
      </div>
      
      {/* Dua List */}
      <div className="flex-1 bg-black p-4">
        {category.duas.map((dua) => (
          <div 
            key={dua.id}
            className="mb-6 bg-gray-900/20 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-800 py-2 px-4 flex justify-between items-center">
              <h3 className="font-arabic text-lg text-white">{dua.title}</h3>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => toggleFavorite(dua.id)}
                  className="p-1 rounded-full"
                >
                  <Heart 
                    className="w-5 h-5" 
                    fill={favorites.includes(dua.id) ? "#ef4444" : "none"} 
                    color={favorites.includes(dua.id) ? "#ef4444" : "white"}
                  />
                </button>
                <button
                  onClick={() => shareDua(dua)}
                  className="p-1 rounded-full"
                >
                  <Share2 className="w-5 h-5" color="white" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <p className="font-arabic text-white text-right text-lg leading-relaxed mb-4">
                {dua.arabic}
              </p>
              
              {dua.translation && (
                <div className="mb-4 border-t border-gray-700 pt-3">
                  <p className="font-arabic text-gray-300 text-right">
                    {dua.translation}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col mt-3">
                {dua.virtue && (
                  <p className="font-arabic text-amber-400 text-sm text-right mb-2">
                    {dua.virtue}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-2">
                  <p className="font-arabic text-gray-400 text-sm">
                    {dua.reference}
                  </p>
                  
                  {dua.times && dua.times > 1 && (
                    <div className="bg-islamic-green-dark/30 px-2 py-1 rounded-md">
                      <p className="font-arabic text-islamic-green-light text-sm">
                        يقال {dua.times} مرات
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DuaCategory;
