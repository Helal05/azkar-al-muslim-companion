
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Moon, Sun, ChevronDown } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PrayerDay {
  date: string;
  hijriDate: string;
  weekday: string;
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  isToday?: boolean;
}

const MonthlyPrayerTimes = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { t } = useTranslation(settings.language);
  
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [showMonthSelect, setShowMonthSelect] = useState<boolean>(false);
  const [prayerDays, setPrayerDays] = useState<PrayerDay[]>([]);
  
  // Hijri month names
  const hijriMonths = [
    { id: 1, name: "محرم", nameEn: "Muharram" },
    { id: 2, name: "صفر", nameEn: "Safar" },
    { id: 3, name: "ربيع الأول", nameEn: "Rabi' al-Awwal" },
    { id: 4, name: "ربيع الثاني", nameEn: "Rabi' al-Thani" },
    { id: 5, name: "جماد الأول", nameEn: "Jumada al-Awwal" },
    { id: 6, name: "جماد الثاني", nameEn: "Jumada al-Thani" },
    { id: 7, name: "رجب", nameEn: "Rajab" },
    { id: 8, name: "شعبان", nameEn: "Sha'ban" },
    { id: 9, name: "رمضان", nameEn: "Ramadan" },
    { id: 10, name: "شوال", nameEn: "Shawwal" },
    { id: 11, name: "ذو القعدة", nameEn: "Dhu al-Qi'dah" },
    { id: 12, name: "ذو الحجة", nameEn: "Dhu al-Hijjah" }
  ];
  
  // Get current Hijri month (this is a simplified approach - would need a proper Hijri calendar library in production)
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number>(10); // Default to Shawwal for demo
  const [currentHijriYear, setCurrentHijriYear] = useState<number>(1446); // Current Hijri year
  
  // Arabic weekday names
  const weekdayNames = {
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  
  // Format time to display properly based on language
  const formatTime = (time: string) => {
    return settings.language === "ar" ? time : time.replace(/[٠-٩]/g, d => String("0123456789".indexOf(d)));
  };
  
  // Generate prayer times for the month
  const generateMonthPrayerTimes = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const todayDate = today.getDate();
    
    const daysList: PrayerDay[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const weekdayIndex = date.getDay();
      
      // This is a placeholder - in a real app, you would calculate the actual prayer times
      // based on the location, date, and calculation method
      const fajrHour = 4 + Math.floor(Math.random() * 2);
      const fajrMinute = Math.floor(Math.random() * 30);
      
      const sunriseHour = 5 + Math.floor(Math.random() * 2);
      const sunriseMinute = 30 + Math.floor(Math.random() * 30);
      
      const dhuhrHour = 11 + Math.floor(Math.random() * 2);
      const dhuhrMinute = 45 + Math.floor(Math.random() * 15);
      
      const asrHour = 15 + Math.floor(Math.random() * 2);
      const asrMinute = Math.floor(Math.random() * 30);
      
      const maghribHour = 18 + Math.floor(Math.random() * 2);
      const maghribMinute = Math.floor(Math.random() * 30);
      
      const ishaHour = 19 + Math.floor(Math.random() * 2);
      const ishaMinute = 30 + Math.floor(Math.random() * 30);
      
      // Convert date to strings with Arabic numerals for display
      const toArabicNumerals = (num: number): string => {
        if (settings.language !== "ar") return num.toString().padStart(2, '0');
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)]).join('');
      };
      
      // Format time for display
      const formatTimeDisplay = (hour: number, minute: number): string => {
        if (settings.language === "ar") {
          return `${toArabicNumerals(hour)}:${toArabicNumerals(minute).padStart(2, '٠')}`;
        } else {
          return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }
      };
      
      // Hijri date calculation (simplified - would need a proper library)
      const hijriDay = (day + 3) % 30 || 30; // Simplified approach
      const hijriDateDisplay = settings.language === "ar" 
        ? `${toArabicNumerals(hijriDay)}/${toArabicNumerals(currentHijriMonth)}/${toArabicNumerals(currentHijriYear)}`
        : `${hijriDay}/${currentHijriMonth}/${currentHijriYear}`;
      
      // Gregorian date display
      const gregorianDateDisplay = settings.language === "ar"
        ? `${toArabicNumerals(day)}/${toArabicNumerals(currentMonth + 1)}/${toArabicNumerals(currentYear)}`
        : `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
      
      daysList.push({
        date: gregorianDateDisplay,
        hijriDate: hijriDateDisplay,
        weekday: settings.language === "ar" ? weekdayNames.ar[weekdayIndex] : weekdayNames.en[weekdayIndex],
        prayers: {
          fajr: formatTimeDisplay(fajrHour, fajrMinute),
          sunrise: formatTimeDisplay(sunriseHour, sunriseMinute),
          dhuhr: formatTimeDisplay(dhuhrHour, dhuhrMinute),
          asr: formatTimeDisplay(asrHour, asrMinute),
          maghrib: formatTimeDisplay(maghribHour, maghribMinute),
          isha: formatTimeDisplay(ishaHour, ishaMinute)
        },
        isToday: isCurrentMonth && day === todayDate
      });
    }
    
    setPrayerDays(daysList);
  };
  
  useEffect(() => {
    generateMonthPrayerTimes();
  }, [currentMonth, currentYear, currentHijriMonth, settings.language]);
  
  // Switch to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
      // Update Hijri date (simplified)
      setCurrentHijriMonth(currentHijriMonth === 1 ? 12 : currentHijriMonth - 1);
      if (currentHijriMonth === 1) setCurrentHijriYear(currentHijriYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
      // Update Hijri date (simplified)
      setCurrentHijriMonth(currentHijriMonth === 1 ? 12 : currentHijriMonth - 1);
      if (currentHijriMonth === 1) setCurrentHijriYear(currentHijriYear - 1);
    }
  };
  
  // Switch to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
      // Update Hijri date (simplified)
      setCurrentHijriMonth(currentHijriMonth === 12 ? 1 : currentHijriMonth + 1);
      if (currentHijriMonth === 12) setCurrentHijriYear(currentHijriYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
      // Update Hijri date (simplified)
      setCurrentHijriMonth(currentHijriMonth === 12 ? 1 : currentHijriMonth + 1);
      if (currentHijriMonth === 12) setCurrentHijriYear(currentHijriYear + 1);
    }
  };
  
  // Select a specific Hijri month
  const selectHijriMonth = (monthId: number) => {
    setCurrentHijriMonth(monthId);
    setShowMonthSelect(false);
    // This is simplified - in a real app, you would convert from Hijri to Gregorian
  };
  
  // Get month name based on current language
  const getMonthName = () => {
    const hijriMonth = hijriMonths.find(m => m.id === currentHijriMonth);
    return settings.language === "ar" ? hijriMonth?.name : hijriMonth?.nameEn;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 flex items-center justify-between">
        <button onClick={() => navigate("/prayer-times")} className="p-2">
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {settings.language === "ar" 
            ? `مواقيت الصلاة لشهر ${getMonthName()}` 
            : `Prayer Times for ${getMonthName()}`}
        </h2>
        <div className="w-5"></div> {/* Empty div for alignment */}
      </div>
      
      {/* Month selection controls */}
      <div className="bg-slate-800/50 p-3 flex justify-between items-center">
        <button 
          onClick={prevMonth}
          className="p-2 bg-slate-700/50 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 text-amber-400" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMonthSelect(!showMonthSelect)}
            className="flex items-center space-x-2 bg-slate-700/50 px-4 py-2 rounded-lg"
          >
            <span className="font-arabic text-amber-400">{getMonthName()}</span>
            <ChevronDown className="w-4 h-4 text-amber-400" />
          </button>
          
          {/* Month dropdown */}
          {showMonthSelect && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {hijriMonths.map(month => (
                <button
                  key={month.id}
                  onClick={() => selectHijriMonth(month.id)}
                  className={`w-full text-start px-4 py-3 hover:bg-slate-700 transition-colors ${
                    currentHijriMonth === month.id ? 'bg-amber-900/30 text-amber-400' : ''
                  }`}
                >
                  <span className="font-arabic">
                    {settings.language === "ar" 
                      ? `${month.id} - ${month.name}` 
                      : `${month.id} - ${month.nameEn}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={nextMonth}
          className="p-2 bg-slate-700/50 rounded-full"
        >
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </button>
      </div>
      
      {/* Prayer times table */}
      <div className="flex-1 p-2 overflow-y-auto">
        <div className="rounded-lg overflow-hidden">
          {prayerDays.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`mb-2 rounded-lg ${day.isToday 
                ? 'bg-amber-900/30 border border-amber-600/50' 
                : 'bg-slate-800/50'}`}
            >
              {/* Day header */}
              <div className="flex justify-between items-center p-3 border-b border-slate-700/50">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-white/70">{day.weekday}</span>
                  {day.isToday && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                      {settings.language === "ar" ? "اليوم" : "Today"}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <span className="text-sm text-white/70">{day.date}</span>
                  <span className="text-sm text-amber-400/80">{day.hijriDate}</span>
                </div>
              </div>
              
              {/* Prayer times */}
              <div className="grid grid-cols-6 p-2 text-center">
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "الفجر" : "Fajr"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.fajr}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "الشروق" : "Sunrise"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.sunrise}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "الظهر" : "Dhuhr"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.dhuhr}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "العصر" : "Asr"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.asr}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "المغرب" : "Maghrib"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.maghrib}</div>
                </div>
                <div className="p-2">
                  <div className="text-xs text-white/70 mb-1">
                    {settings.language === "ar" ? "العشاء" : "Isha"}
                  </div>
                  <div className="text-sm font-semibold">{day.prayers.isha}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyPrayerTimes;
