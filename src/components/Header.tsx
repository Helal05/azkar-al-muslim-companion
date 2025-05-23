
import { Settings, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };
  
  // Check system preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);
  
  // Get title based on current path
  const getTitle = () => {
    const path = location.pathname;
    if (path === "/") return "أذكار المسلم";
    if (path === "/settings") return "الإعدادات";
    if (path.includes("/category/")) {
      const categoryId = path.split("/").pop();
      if (categoryId === "tasbih") return "المسبحة الإلكترونية";
      if (categoryId === "qibla") return "القبلة";
      return "الأذكار";
    }
    return "أذكار المسلم";
  };

  return (
    <header className="bg-white dark:bg-islamic-green-dark/40 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {location.pathname !== "/" ? (
            <button 
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-islamic-neutral/50 dark:hover:bg-islamic-green-dark/50 transition-colors"
              aria-label="الرئيسية"
            >
              <Logo size="sm" />
            </button>
          ) : (
            <div className="py-1">
              <Logo size="md" />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-islamic-neutral/50 dark:hover:bg-islamic-green-dark/50 transition-colors"
            aria-label={isDarkMode ? "وضع النهار" : "وضع الليل"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => navigate("/settings")}
            className="p-2 rounded-full hover:bg-islamic-neutral/50 dark:hover:bg-islamic-green-dark/50 transition-colors"
            aria-label="الإعدادات"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
