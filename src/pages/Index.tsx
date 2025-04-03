
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { azkarCategories } from "../data/azkarData";
import { useToast } from "@/hooks/use-toast";
import { AlignCenter, Moon, Search, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950 text-center">
      {/* Header Quote */}
      <div className="w-full bg-gradient-to-b from-teal-800 to-teal-900 py-12 px-4">
        <p className="text-white text-2xl font-arabic font-bold text-center">
          إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ
        </p>
      </div>

      {/* Top App Bar */}
      <div className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <AlignCenter size={20} className="text-gray-300" />
          <Search size={20} className="text-gray-300" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        
        <div>
          <button
            onClick={() => {
              toast({
                title: "مواقيت الصلاة",
                description: "سيتم إضافة هذه الميزة قريبًا إن شاء الله",
              });
            }}
            className="text-sm text-white text-right text-nowrap"
          >
            الفجر 04:11 | الشروق 05:40
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black text-white py-3 flex justify-around">
        <button className="flex flex-col items-center text-xs">
          <span className="text-gray-300">المنوعة</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-300">القبلة</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          <span className="text-gray-300">الصلاة</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          <span className="text-gray-300">المفضلة</span>
        </button>
        <button className="flex flex-col items-center text-xs">
          <span className="text-gray-300">العداد</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-black py-4 px-3">
        {/* Special Dua */}
        <div className="mb-5 bg-black border border-purple-800 rounded-lg p-4">
          <p className="text-purple-400 text-xl font-arabic">دعاء (من تعار من الليل)</p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {azkarCategories.map((category) => {
            if (category.id === "qibla" || category.id === "tasbih") {
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/${category.id}`)}
                  className={`p-4 rounded-lg bg-black border border-${category.id === "qibla" ? "rose" : "teal"}-800 text-center`}
                >
                  <span className={`text-xl ${category.textColor} font-arabic`}>{category.name}</span>
                </button>
              );
            }
            
            return (
              <button
                key={category.id}
                onClick={() => navigate(`/category/${category.id}`)}
                className={`p-4 rounded-lg bg-black border border-${category.id === "names" ? "rose" : category.id === "quran" ? "emerald" : category.id === "prophet" ? "amber" : category.id === "morning" ? "cyan" : category.id === "evening" ? "pink" : category.id === "ruqyah" ? "teal" : category.id === "ruqyahSunnah" ? "green" : category.id === "more" ? "lime" : "blue"}-800 text-center`}
              >
                <span className={`text-xl ${category.textColor} font-arabic`}>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
