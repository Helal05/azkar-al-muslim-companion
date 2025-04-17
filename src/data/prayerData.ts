
import { differenceInMinutes, format, addMinutes, addDays } from "date-fns";

// Interfaces for prayer times and date-related calculations
interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

interface IslamicDate {
  day: string;
  month: string;
  year: string;
  dayOfWeek: string;
  gregorianDate: string;
}

interface HijriDate {
  day: number;
  month: number;
  year: number;
}

// Helper function to format time
const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Convert a time string to a Date object 
const timeStringToDate = (timeStr: string): Date => {
  const now = new Date();
  const [hours, minutes] = timeStr.replace(' AM', '').replace(' PM', '').split(':');
  const isPM = timeStr.includes('PM');
  
  const resultDate = new Date();
  resultDate.setHours(
    isPM && parseInt(hours) !== 12 ? parseInt(hours) + 12 : 
    !isPM && parseInt(hours) === 12 ? 0 : parseInt(hours),
    parseInt(minutes),
    0,
    0
  );
  
  return resultDate;
};

// Calculate prayer times for a given location
export const getPrayerTimes = (
  latitude: number, 
  longitude: number, 
  language: string = 'ar'
): PrayerTime[] => {
  const now = new Date();
  
  // In a real app, these times would be calculated based on latitude/longitude
  // using a proper calculation library or API
  const prayerTimes: PrayerTime[] = [
    { name: language === 'ar' ? 'الفجر' : 'Fajr', time: '4:30 AM', isNext: false },
    { name: language === 'ar' ? 'الشروق' : 'Sunrise', time: '6:00 AM', isNext: false },
    { name: language === 'ar' ? 'الظهر' : 'Dhuhr', time: '12:30 PM', isNext: false },
    { name: language === 'ar' ? 'العصر' : 'Asr', time: '4:15 PM', isNext: false },
    { name: language === 'ar' ? 'المغرب' : 'Maghrib', time: '6:45 PM', isNext: false },
    { name: language === 'ar' ? 'العشاء' : 'Isha', time: '8:15 PM', isNext: false }
  ];

  // Determine the next prayer
  const nextPrayerIndex = prayerTimes.findIndex(prayer => {
    const prayerTimeDate = timeStringToDate(prayer.time);
    return prayerTimeDate > now;
  });

  if (nextPrayerIndex !== -1) {
    prayerTimes[nextPrayerIndex].isNext = true;
  } else {
    // If all prayers for today have passed, mark Fajr as next (for tomorrow)
    prayerTimes[0].isNext = true;
  }

  return prayerTimes;
};

// Get time to next prayer
export const getTimeToNextPrayer = (
  language: string = 'ar', 
  shortFormat: boolean = false
): string => {
  const now = new Date();
  const prayerTimes = getPrayerTimes(0, 0, language);
  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);

  if (!nextPrayer) return '';

  let nextPrayerTime = timeStringToDate(nextPrayer.time);
  
  // If next prayer is Fajr and it's earlier than current time, it's tomorrow's Fajr
  if (nextPrayer.name.includes('الفجر') || nextPrayer.name.includes('Fajr')) {
    if (nextPrayerTime < now) {
      nextPrayerTime = addDays(nextPrayerTime, 1);
    }
  }

  const minutesRemaining = differenceInMinutes(nextPrayerTime, now);
  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const mins = minutesRemaining % 60;

  if (shortFormat) {
    return language === 'ar' 
      ? `${hoursRemaining}:${mins.toString().padStart(2, '0')}` 
      : `${hoursRemaining}:${mins.toString().padStart(2, '0')}`;
  }

  return language === 'ar'
    ? `${hoursRemaining} ساعة و ${mins} دقيقة`
    : `${hoursRemaining} hours and ${mins} minutes`;
};

// Adjust date for Hijri calculation (simple approximation)
// In a real app, you'd use a proper Hijri calendar library
const adjustHijriDate = (gregDate: Date): number => {
  // Simple adjustment factor - in reality, the adjustment is more complex
  return gregDate.getDate() - 1;
};

// Get current Islamic date using a simplified calculation
// In a real app, you'd use a proper Hijri calendar library
export const getCurrentIslamicDate = (language: string = 'ar'): IslamicDate => {
  const gregorianDate = new Date();
  
  // Simplified Hijri date calculation
  const hijriDate = calculateHijriDate(gregorianDate);
  
  const monthNames = language === 'ar' 
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const hijriMonthNames = [
    { ar: 'محرّم', en: 'Muharram' },
    { ar: 'صفر', en: 'Safar' },
    { ar: 'ربيع الأول', en: 'Rabi\' al-Awwal' },
    { ar: 'ربيع الثاني', en: 'Rabi\' al-Thani' },
    { ar: 'جمادى الأولى', en: 'Jumada al-Awwal' },
    { ar: 'جمادى الآخرة', en: 'Jumada al-Thani' },
    { ar: 'رجب', en: 'Rajab' },
    { ar: 'شعبان', en: 'Sha\'ban' },
    { ar: 'رمضان', en: 'Ramadan' },
    { ar: 'شوال', en: 'Shawwal' },
    { ar: 'ذو القعدة', en: 'Dhu al-Qi\'dah' },
    { ar: 'ذو الحجة', en: 'Dhu al-Hijjah' }
  ];

  const dayNames = language === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get the hijri month name
  const monthIndex = hijriDate.month - 1;
  const hijriMonthName = monthIndex >= 0 && monthIndex < hijriMonthNames.length 
    ? (language === 'ar' ? hijriMonthNames[monthIndex].ar : hijriMonthNames[monthIndex].en)
    : '';

  return {
    day: language === 'ar' 
      ? hijriDate.day.toLocaleString('ar-EG') 
      : hijriDate.day.toString(),
    month: hijriMonthName,
    year: language === 'ar' 
      ? hijriDate.year.toLocaleString('ar-EG') 
      : hijriDate.year.toString(),
    dayOfWeek: dayNames[gregorianDate.getDay()],
    gregorianDate: format(gregorianDate, 'dd/MM/yyyy')
  };
};

// List of forbidden prayer times
export const getForbiddenPrayerTimes = () => {
  return [
    {
      description: "عند شروق الشمس",
      descriptionEn: "After sunrise",
      timeRange: "من شروق الشمس حتى ترتفع",
      timeRangeEn: "From sunrise until it rises"
    },
    {
      description: "عند استواء الشمس",
      descriptionEn: "When the sun is at its zenith",
      timeRange: "من زوال الشمس حتى تزول",
      timeRangeEn: "From zenith until it passes"
    },
    {
      description: "عند غروب الشمس",
      descriptionEn: "During sunset",
      timeRange: "من أصفرار الشمس حتى تغرب",
      timeRangeEn: "From yellowing until sunset"
    }
  ];
};

// Calculate Hijri date (simplified version)
// In a production app, you should use a proper Hijri calendar library
export const calculateHijriDate = (date: Date = new Date()): HijriDate => {
  // Basic Hijri date calculation (approximate)
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();
  
  // Julian Day Count
  let jd = Math.floor((gregorianYear + 8799) / 100);
  jd = jd - Math.floor(jd / 4);
  jd = jd + Math.floor(((gregorianMonth - 1) * 30.6 + 0.5));
  jd = jd + gregorianDay;
  jd = jd + 1721117.5;
  
  // Hijri calculation
  const hijriDay = Math.floor(jd - 1948440 + 10632);
  const n = Math.floor((hijriDay - 1) / 10631);
  const hijriYear = Math.floor(n * 30 + ((hijriDay - 1 - n * 10631) / 355.575264) + 1);
  const hijriMonth = Math.min(12, Math.ceil((hijriDay - (1 + Math.floor((hijriYear - 1) * 354.367) + Math.floor((hijriYear - 1) / 30) * 10631)) / 29.5));
  
  // Adjustment for better accuracy
  const adjustment = adjustHijriDate(date);
  
  return {
    day: Math.max(1, Math.floor(hijriDay - (Math.floor((hijriYear - 1) * 354.367) + Math.floor((hijriYear - 1) / 30) * 10631) - (hijriMonth - 1) * 29.5) + adjustment),
    month: hijriMonth,
    year: hijriYear
  };
};

// Get prayer times for a specific date
export const getPrayerTimesForDate = (
  date: Date, 
  latitude: number, 
  longitude: number, 
  language: string = 'ar'
): PrayerTime[] => {
  // In a real app, you would calculate times based on the date and location
  // This is a simplified version that shifts the times slightly for demonstration
  const dayOffset = date.getDate() % 6 - 3; // -3 to +2 minutes variation
  const monthOffset = (date.getMonth() % 3) - 1; // -1 to +1 minutes variation
  
  const baseHours = [4, 6, 12, 16, 18, 20]; // Base hours for prayers
  const baseMinutes = [30, 0, 30, 15, 45, 15]; // Base minutes for prayers
  
  const prayerNames = language === 'ar' 
    ? ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء']
    : ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  // Generate prayer times with slight variations based on date
  return prayerNames.map((name, index) => {
    const hour = baseHours[index];
    const minute = Math.max(0, Math.min(59, baseMinutes[index] + dayOffset + monthOffset));
    
    const prayerTime = new Date(date);
    prayerTime.setHours(hour, minute, 0, 0);
    
    // Convert to 12-hour format
    const isPM = hour >= 12;
    const hour12 = hour % 12 || 12;
    const timeString = `${hour12}:${minute.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
    
    return {
      name,
      time: timeString,
      isNext: false
    };
  });
};
