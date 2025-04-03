
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { duaCategories } from "../data/duaData";
import { Search } from "lucide-react";

const More = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(duaCategories);
  
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

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4">
        <h2 className="text-xl font-arabic font-bold text-center">المزيد</h2>
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
          {filteredCategories.map((category) => (
            <div 
              key={category.id}
              className={`${category.backgroundColor} rounded-lg p-4 overflow-hidden`}
              onClick={() => handleSelectCategory(category.id)}
            >
              <h3 className="text-center font-arabic text-lg font-bold">
                {category.name}
              </h3>
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
          <span className="text-amber-400">المزيد</span>
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
          <span className="text-gray-300">المفضلة</span>
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

export default More;
