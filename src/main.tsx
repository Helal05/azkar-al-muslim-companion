
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for saved theme preference
const savedTheme = localStorage.getItem("azkar-app-settings");
if (savedTheme) {
  try {
    const settings = JSON.parse(savedTheme);
    if (settings.appearance && settings.appearance.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Apply font size setting if available
    if (settings.appearance && settings.appearance.fontSize) {
      document.documentElement.style.fontSize = `${settings.appearance.fontSize}%`;
    }
    
    // Apply RTL direction based on language
    if (settings.language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  } catch (error) {
    console.error("Error parsing saved theme:", error);
    // Default to dark mode and RTL (Arabic) direction
    document.documentElement.classList.add("dark");
    document.documentElement.dir = "rtl";
  }
} else {
  // Default to dark mode and RTL (Arabic) direction
  document.documentElement.classList.add("dark");
  document.documentElement.dir = "rtl";
}

createRoot(document.getElementById("root")!).render(<App />);
