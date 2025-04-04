
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
  } catch (error) {
    console.error("Error parsing saved theme:", error);
  }
} else {
  // Default to dark mode
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
