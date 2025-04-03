
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { duaCategories } from "../data/duaData";
import { naturalBackgrounds } from "../data/duaData";
import { Search, ChevronLeft } from "lucide-react";

const More = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(duaCategories);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  useEffect(() => {
    // Change background periodically
    const bgInterval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % naturalBackgrounds.length);
    }, 120000); // Change background every 2 minutes

    return () => {
      clearInterval(bgInterval);
    };
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = duaCategories.filter(category => 
        category.name.includes(searchQuery) || 
        category.duas.some(dua => 
          dua.title.includes(searchQuery) || 
          dua.arabic.includes(searchQuery)
        )
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(duaCategories);
    }
  }, [searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search handled by the useEffect above
  };
  
  const handleSelectCategory = (categoryId: string) => {
    navigate(`/dua-category/${categoryId}`);
  };
  
  // Share functionality
  const shareContent = (categoryId: string, categoryName: string) => {
    if (navigator.share) {
      navigator.share({
        title: categoryName,
        text: `مشاركة ${categoryName} من تطبيق أذكاري`,
        url: `${window.location.origin}/dua-category/${categoryId}`,
      }).catch(err => console.error("Error sharing:", err));
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">المنوعة</h2>
        <div className="w-5"></div> {/* Placeholder for alignment */}
      </div>
      
      {/* Search */}
      <div className="bg-black px-4 py-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث ..."
            className="w-full bg-gray-900 text-white rounded-lg py-2 px-4 font-arabic text-right"
          />
          <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </button>
        </form>
      </div>
      
      {/* Dua Categories Grid */}
      <div className="flex-1 bg-black p-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((category, index) => (
            <div 
              key={category.id}
              className="rounded-lg overflow-hidden"
              onClick={() => handleSelectCategory(category.id)}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${naturalBackgrounds[(index + backgroundIndex) % naturalBackgrounds.length]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="p-4 flex flex-col items-center">
                <h3 className="text-center font-arabic text-lg font-bold text-white">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-300 mt-2">
                  {category.duas.length} دعاء
                </p>
                <button 
                  className="mt-3 text-xs bg-white/20 px-3 py-1 rounded-full text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    shareContent(category.id, category.name);
                  }}
                >
                  مشاركة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-amber-400 font-arabic">المنوعة</span>
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
          <span className="text-gray-300 font-arabic">العداد</span>
        </button>
      </div>
    </div>
  );
};

export default More;
