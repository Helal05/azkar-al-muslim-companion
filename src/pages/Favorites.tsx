import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { duaCategories } from "../data/duaData";
import { tasbeehItems } from "../data/tasbeehData";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Heart, Share2, Trash2 } from "lucide-react";

interface FavoriteDua {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  arabic: string;
  reference: string;
  virtue?: string;
  times?: number;
  type: 'dua';
}

interface FavoriteTasbeeh {
  id: string;
  text: string;
  virtue: string;
  count: number;
  backgroundColor: string;
  type: 'tasbeeh';
}

type FavoriteItem = FavoriteDua | FavoriteTasbeeh;

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = () => {
    // Load dua favorites
    const savedDuaFavorites = localStorage.getItem("dua_favorites");
    const duaFavIds: string[] = savedDuaFavorites ? JSON.parse(savedDuaFavorites) : [];
    
    const favoriteDuas: FavoriteDua[] = [];
    duaCategories.forEach(category => {
      category.duas.forEach(dua => {
        if (duaFavIds.includes(dua.id)) {
          favoriteDuas.push({
            ...dua,
            categoryId: category.id,
            categoryName: category.name,
            reference: dua.reference || dua.source,
            type: 'dua'
          });
        }
      });
    });
    
    // Load tasbeeh favorites
    const savedTasbeehFavorites = localStorage.getItem("tasbih_favorites");
    const tasbeehFavIds: string[] = savedTasbeehFavorites ? JSON.parse(savedTasbeehFavorites) : [];
    
    const favoriteTasbeehs: FavoriteTasbeeh[] = tasbeehItems
      .filter(item => tasbeehFavIds.includes(item.id))
      .map(item => ({
        ...item,
        type: 'tasbeeh'
      }));
    
    // Combine all favorites
    setFavoriteItems([...favoriteDuas, ...favoriteTasbeehs]);
  };
  
  const removeFavorite = (item: FavoriteItem) => {
    if (item.type === 'dua') {
      // Remove from dua favorites
      const savedFavorites = localStorage.getItem("dua_favorites");
      if (savedFavorites) {
        const favorites: string[] = JSON.parse(savedFavorites);
        const updated = favorites.filter(id => id !== item.id);
        localStorage.setItem("dua_favorites", JSON.stringify(updated));
      }
    } else {
      // Remove from tasbeeh favorites
      const savedFavorites = localStorage.getItem("tasbih_favorites");
      if (savedFavorites) {
        const favorites: string[] = JSON.parse(savedFavorites);
        const updated = favorites.filter(id => id !== item.id);
        localStorage.setItem("tasbih_favorites", JSON.stringify(updated));
      }
    }
    
    // Update UI
    setFavoriteItems(prev => prev.filter(i => i.id !== item.id));
    
    toast({
      title: "تمت الإزالة من المفضلة",
      description: ""
    });
  };
  
  const shareItem = (item: FavoriteItem) => {
    if (navigator.share) {
      let text = "";
      let title = "";
      
      if (item.type === 'dua') {
        title = item.title;
        text = `${item.arabic}\n\n${item.reference}`;
      } else {
        title = "تسبيح";
        text = `${item.text}\n${item.virtue}`;
      }
      
      navigator.share({
        title,
        text,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      toast({
        title: "المشاركة غير متاحة",
        description: "متصفحك لا يدعم ميزة المشاركة"
      });
    }
  };
  
  const navigateToItem = (item: FavoriteItem) => {
    if (item.type === 'dua') {
      navigate(`/dua-category/${item.categoryId}`);
    } else {
      navigate("/tasbih");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center">
        <button onClick={() => navigate("/")} className="p-2 mr-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">المفضلة</h2>
      </div>
      
      {favoriteItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-5xl mb-4">💫</div>
          <p className="text-white font-arabic text-center text-lg">
            ليس لديك أي عناصر في المفضلة حتى الآن
          </p>
          <p className="text-gray-400 font-arabic text-center mt-2">
            اضغط على أيقونة القلب ❤️ لإضافة الأذكار والأدعية إلى المفضلة
          </p>
        </div>
      ) : (
        <div className="flex-1 bg-black p-4">
          {favoriteItems.map((item) => (
            <div 
              key={item.id}
              className="mb-4 bg-gray-900/20 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-800 py-2 px-4 flex justify-between items-center">
                <h3 className="font-arabic text-lg text-white">
                  {item.type === 'dua' ? item.title : "تسبيح"}
                </h3>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => removeFavorite(item)}
                    className="p-1 rounded-full"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                  <button
                    onClick={() => shareItem(item)}
                    className="p-1 rounded-full"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              
              <div 
                className="p-4 cursor-pointer"
                onClick={() => navigateToItem(item)}
              >
                <p className="font-arabic text-white text-right text-lg leading-relaxed mb-2">
                  {item.type === 'dua' ? item.arabic : item.text}
                </p>
                
                {item.type === 'dua' && (
                  <p className="font-arabic text-gray-400 text-sm mt-3">
                    {item.reference}
                  </p>
                )}
                
                {item.type === 'tasbeeh' && (
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-arabic text-amber-400 text-sm">
                      {item.virtue}
                    </p>
                    <div className="bg-islamic-green-dark/30 px-2 py-1 rounded-md">
                      <p className="font-arabic text-islamic-green-light text-sm">
                        {item.count} مرة
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">المزيد</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">القبلة</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">الصلاة</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-amber-400">المفضلة</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">العداد</span>
        </button>
      </div>
    </div>
  );
};

export default Favorites;
