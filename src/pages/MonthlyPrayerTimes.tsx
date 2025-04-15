
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Moon, Sun, ChevronDown } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateHijriDate, getPrayerTimesForDate } from "../data/prayerData";

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
    { id: 5, name: "جمادى الأولى", nameEn: "Jumada al-Ula" },
    { id: 6, name: "جمادى الآخرة", nameEn: "Jumada al-Thani" },
    { id: 7, name: "رجب", nameEn: "Rajab" },
    { id: 8, name: "شعبان", nameEn: "Sha'ban" },
    { id: 9, name: "رمضان", nameEn: "Ramadan" },
    { id: 10, name: "شوال", nameEn: "Shawwal" },
    { id: 11, name: "ذو القعدة", nameEn: "Dhu al-Qi'dah" },
    { id: 12, name: "ذو الحجة", nameEn: "Dhu al-Hijjah" }
  ];
  
  // Get current Hijri month based on calculated Hijri date
  const todayHijri = calculateHijriDate();
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number>(todayHijri.month as number);
  const [currentHijriYear, setCurrentHijriYear] = useState<number>(todayHijri.year as number);
  
  // Arabic weekday names
  const weekdayNames = {
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  
  // Convert a number to Arabic numeral string
  const toArabicNumerals = (num: number): string => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => {
      // Convert digit to number explicitly to ensure it's a number
      const digitNum = parseInt(digit, 10);
      // Check if it's a valid number before accessing the array
      return !isNaN(digitNum) ? arabicNumerals[digitNum] : digit;
    }).join('');
  };
  
  // Format time to display properly based on language
  const formatTime = (time: string) => {
    return settings.language === "ar" ? time : time.replace(/[٠-٩]/g, d => String("0123456789"[["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"].indexOf(d)]));
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
      
      // Get accurate prayer times for this date and location
      const prayerTimesForDay = getPrayerTimesForDate(
        date, 
        settings.location.latitude, 
        settings.location.longitude, 
        settings.language
      );
      
      // Calculate Hijri date for this day
      const hijriDate = calculateHijriDate(date);
      
      // Format date strings
      const gregorianDateDisplay = settings.language === "ar"
        ? `${toArabicNumerals(day)}/${toArabicNumerals(currentMonth + 1)}/${toArabicNumerals(currentYear)}`
        : `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
      
      const hijriDateDisplay = settings.language === "ar" 
        ? `${toArabicNumerals(hijriDate.day as number)}/${toArabicNumerals(hijriDate.month as number)}/${toArabicNumerals(hijriDate.year as number)}`
        : `${hijriDate.day}/${hijriDate.month}/${hijriDate.year}`;
      
      daysList.push({
        date: gregorianDateDisplay,
        hijriDate: hijriDateDisplay,
        weekday: settings.language === "ar" ? weekdayNames.ar[weekdayIndex] : weekdayNames.en[weekdayIndex],
        prayers: {
          fajr: prayerTimesForDay[0].time,
          sunrise: prayerTimesForDay[1].time,
          dhuhr: prayerTimesForDay[2].time,
          asr: prayerTimesForDay[3].time,
          maghrib: prayerTimesForDay[4].time,
          isha: prayerTimesForDay[5].time
        },
        isToday: isCurrentMonth && day === todayDate
      });
    }
    
    setPrayerDays(daysList);
  };
  
  useEffect(() => {
    generateMonthPrayerTimes();
  }, [currentMonth, currentYear, settings.language, settings.location]);
  
  // Switch to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
      
      // Calculate new Hijri date for previous month
      const prevDate = new Date(currentYear - 1, 11, 15);
      const prevHijri = calculateHijriDate(prevDate);
      setCurrentHijriMonth(Number(prevHijri.month));
      setCurrentHijriYear(Number(prevHijri.year));
    } else {
      setCurrentMonth(currentMonth - 1);
      
      // Calculate new Hijri date for previous month
      const prevDate = new Date(currentYear, currentMonth - 1, 15);
      const prevHijri = calculateHijriDate(prevDate);
      setCurrentHijriMonth(Number(prevHijri.month));
      setCurrentHijriYear(Number(prevHijri.year));
    }
  };
  
  // Switch to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
      
      // Calculate new Hijri date for next month
      const nextDate = new Date(currentYear + 1, 0, 15);
      const nextHijri = calculateHijriDate(nextDate);
      setCurrentHijriMonth(Number(nextHijri.month));
      setCurrentHijriYear(Number(nextHijri.year));
    } else {
      setCurrentMonth(currentMonth + 1);
      
      // Calculate new Hijri date for next month
      const nextDate = new Date(currentYear, currentMonth + 1, 15);
      const nextHijri = calculateHijriDate(nextDate);
      setCurrentHijriMonth(Number(nextHijri.month));
      setCurrentHijriYear(Number(nextHijri.year));
    }
  };
  
  // Select a specific Hijri month
  const selectHijriMonth = (monthId: number) => {
    setCurrentHijriMonth(monthId);
    setShowMonthSelect(false);
    
    // Approximating Gregorian equivalent (simplified)
    // In a real app, you would use a proper conversion library
    const today = new Date();
    const currentHijriDate = calculateHijriDate(today);
    
    // If selected month is ahead of current Hijri month
    if (monthId > Number(currentHijriDate.month)) {
      // Go forward by the difference in months
      const monthsAhead = monthId - Number(currentHijriDate.month);
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() + monthsAhead);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    } 
    // If selected month is behind current Hijri month
    else if (monthId < Number(currentHijriDate.month)) {
      // Go backward by the difference in months
      const monthsBehind = Number(currentHijriDate.month) - monthId;
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth() - monthsBehind);
      setCurrentMonth(newDate.getMonth());
      setCurrentYear(newDate.getFullYear());
    }
    // If same month, no change needed
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
