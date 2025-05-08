
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  BookOpenText,
  Settings,
  Bell,
  Heart,
  SquareAsterisk,
  Clock,
  Prayer,
  ChevronRight,
  Compass
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSettings } from "../contexts/AppSettingsContext";
import QuranVerse from "../components/QuranVerse";

const More = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { toast } = useToast();
  
  const handleSectionClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center justify-center">
        <h2 className="text-xl font-arabic font-bold">المزيد</h2>
      </div>
      
      {/* Quote Banner */}
      <div className="p-4">
        <QuranVerse />
      </div>
      
      {/* Menu Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/names-of-allah" 
            className="bg-blue-900/30 hover:bg-blue-800/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center mb-2">
              <SquareAsterisk className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-white font-arabic text-center">أسماء الله الحسنى</span>
          </Link>
          
          <Link 
            to="/notifications-hub" 
            className="bg-purple-900/30 hover:bg-purple-800/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center mb-2">
              <Bell className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-white font-arabic text-center">إشعارات التطبيق</span>
          </Link>
          
          <Link 
            to="/qibla" 
            className="bg-green-900/30 hover:bg-green-800/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center mb-2">
              <Compass className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-white font-arabic text-center">القبلة</span>
          </Link>
          
          <Link 
            to="/favorites" 
            className="bg-red-900/30 hover:bg-red-800/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-white font-arabic text-center">المفضلة</span>
          </Link>
          
          <Link 
            to="/night-duas" 
            className="bg-indigo-900/30 hover:bg-indigo-800/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center mb-2">
              <Moon className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-white font-arabic text-center">أدعية الليل</span>
          </Link>
          
          <Link 
            to="/duha-prayer" 
            className="bg-amber-900/30 hover:bg-amber-800/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center mb-2">
              <Sun className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-white font-arabic text-center">صلاة الضحى</span>
          </Link>
          
          <Link 
            to="/sunnah-prayers" 
            className="bg-teal-900/30 hover:bg-teal-800/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-teal-900/50 flex items-center justify-center mb-2">
              <Prayer className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-white font-arabic text-center">السنن الرواتب</span>
          </Link>
          
          <Link 
            to="/friday-sunnah" 
            className="bg-amber-800/30 hover:bg-amber-700/30 rounded-lg p-4 flex flex-col items-center justify-center transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center mb-2">
              <Moon className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-white font-arabic text-center">سنن يوم الجمعة</span>
          </Link>
        </div>
        
        {/* Settings List */}
        <div className="mt-8">
          <div 
            onClick={() => navigate("/settings")}
            className="flex justify-between items-center p-4 bg-gray-900/30 rounded-lg mb-3"
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-gray-400 mr-3" />
              <span className="font-arabic text-white">الإعدادات</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
