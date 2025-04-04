
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Search as SearchIcon, X } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { azkarCategories } from "../data/azkarData";

interface SearchResult {
  id: string;
  type: 'azkar' | 'dua' | 'prayer';
  title: string;
  text?: string;
  category?: string;
  path: string;
}

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useAppSettings();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Get search query from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else {
      const savedQuery = localStorage.getItem("search-query");
      if (savedQuery) {
        setSearchQuery(savedQuery);
        performSearch(savedQuery);
      }
    }
  }, [location.search]);
  
  // Perform search
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // In a real app, this would search through a database or API
    // For this demo, we'll simulate searching through the azkar data
    
    const searchResults: SearchResult[] = [];
    
    // Search in azkar categories
    azkarCategories.forEach(category => {
      const categoryName = settings.language === "ar" ? category.name : category.name; // Use name instead of title
      
      // If category matches search query
      if (categoryName.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: `category-${category.id}`,
          type: 'azkar',
          title: categoryName,
          category: 'Category',
          path: `/category/${category.id}`
        });
      }
      
      // Get azkar items from the category - using the right property
      const azkarItemsForCategory = azkarCategories.flatMap(c => c.id === category.id ? [] : []);
      
      // For now, we'll simulate item search with placeholder logic
      // In a real implementation, we would search through actual azkar items
      if (categoryName.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: `azkar-sample-${category.id}`,
          type: 'azkar',
          title: `Sample Azkar from ${categoryName}`,
          text: settings.language === "ar" ? "نموذج ذكر..." : "Sample azkar text...",
          category: categoryName,
          path: `/category/${category.id}`
        });
      }
    });
    
    // Mock prayer times search results
    const prayerTimeKeywords = ["صلاة", "prayer", "salah", "adhan", "أذان", "صلوات", "prayers", "time", "وقت"];
    
    if (prayerTimeKeywords.some(keyword => query.toLowerCase().includes(keyword.toLowerCase()))) {
      searchResults.push({
        id: "prayer-times",
        type: 'prayer',
        title: settings.language === "ar" ? "مواقيت الصلاة" : "Prayer Times",
        category: settings.language === "ar" ? "الصلاة" : "Prayer",
        path: "/prayer-times"
      });
      
      searchResults.push({
        id: "monthly-prayer-times",
        type: 'prayer',
        title: settings.language === "ar" ? "جدول مواقيت الصلاة الشهري" : "Monthly Prayer Times",
        category: settings.language === "ar" ? "الصلاة" : "Prayer",
        path: "/monthly-prayer-times"
      });
    }
    
    setResults(searchResults);
    setIsSearching(false);
  };
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    localStorage.setItem("search-query", searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    localStorage.removeItem("search-query");
    navigate("/search");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {settings.language === "ar" ? "البحث" : "Search"}
        </h2>
        <div className="w-5"></div> {/* Empty for alignment */}
      </div>
      
      {/* Search Input */}
      <div className="p-3 bg-slate-800/50">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={settings.language === "ar" ? "اكتب للبحث..." : "Type to search..."}
            className="w-full bg-slate-700/50 text-white rounded-lg py-3 px-4 pr-12 font-arabic border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-transparent"
            dir={settings.language === "ar" ? "rtl" : "ltr"}
          />
          
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-slate-600/50"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-amber-600/20 rounded-md"
          >
            <SearchIcon className="h-5 w-5 text-amber-400" />
          </button>
        </form>
      </div>
      
      {/* Search Results */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isSearching ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-center">
              <p className="text-white/70 font-arabic">
                {settings.language === "ar" ? "جاري البحث..." : "Searching..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {searchQuery && results.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-white/70 font-arabic">
                  {settings.language === "ar" 
                    ? `لا توجد نتائج لـ "${searchQuery}"`
                    : `No results found for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.length > 0 && (
                  <p className="text-sm text-white/60 mb-2">
                    {settings.language === "ar" 
                      ? `تم العثور على ${results.length} نتيجة`
                      : `Found ${results.length} results`}
                  </p>
                )}
                
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-800/50 rounded-lg p-4 border border-white/5"
                    onClick={() => navigate(result.path)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-amber-400/80 mb-1">
                          {result.category}
                        </p>
                        <h3 className="text-white font-arabic text-lg">
                          {result.title}
                        </h3>
                        {result.text && (
                          <p className="text-white/70 text-sm mt-2">
                            {result.text}
                          </p>
                        )}
                      </div>
                      <div className={`py-1 px-2 rounded text-xs ${
                        result.type === 'azkar' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-amber-900/30 text-amber-400'
                      }`}>
                        {result.type === 'azkar' 
                          ? (settings.language === "ar" ? 'ذكر' : 'Azkar')
                          : (settings.language === "ar" ? 'صلاة' : 'Prayer')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
