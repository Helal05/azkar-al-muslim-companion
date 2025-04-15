
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for saved theme preference
const savedTheme = localStorage.getItem("azkar-app-settings");
if (savedTheme) {
  try {
    const settings = JSON.parse(savedTheme);
    
    // Apply dark mode setting
    if (settings.appearance && settings.appearance.darkMode !== undefined) {
      if (settings.appearance.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to dark mode if not specified
      document.documentElement.classList.add("dark");
    }
    
    // Apply font size setting if available
    if (settings.appearance && settings.appearance.fontSize) {
      document.documentElement.style.fontSize = `${settings.appearance.fontSize}%`;
    }
    
    // Apply RTL direction based on language
    if (settings.language) {
      document.documentElement.dir = settings.language === "ar" ? "rtl" : "ltr";
      
      // Apply language to html tag for better accessibility
      document.documentElement.lang = settings.language;
    } else {
      // Default to Arabic
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    }
  } catch (error) {
    console.error("Error parsing saved theme:", error);
    // Default to dark mode and RTL (Arabic) direction
    document.documentElement.classList.add("dark");
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }
} else {
  // Default to dark mode and RTL (Arabic) direction
  document.documentElement.classList.add("dark");
  document.documentElement.dir = "rtl";
  document.documentElement.lang = "ar";
}

createRoot(document.getElementById("root")!).render(<App />);
