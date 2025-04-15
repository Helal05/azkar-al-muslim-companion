
import { format, addDays } from 'date-fns';

export interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

export interface IslamicDate {
  day: string;
  month: string;
  year: string;
  dayOfWeek: string;
  gregorianDate: string;
}

export interface ForbiddenPrayerTime {
  description: string;
  timeRange: string;
  descriptionEn?: string;
  timeRangeEn?: string;
}

// Convert a JS Date to Arabic numeral string
const toArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => {
    // Convert digit to number explicitly to ensure it's a number
    const digitNum = parseInt(digit, 10);
    // Check if it's a valid number before accessing the array
    return !isNaN(digitNum) ? arabicNumerals[digitNum] : digit;
  }).join('');
};

// Format time to Arabic notation (ص/م)
const formatArabicTime = (hour: number, minute: number): string => {
  const period = hour < 12 ? 'ص' : 'م';
  const h = hour % 12 || 12;
  // Ensure minutes are padded with leading zero if needed
  const formattedMinute = minute < 10 ? `٠${toArabicNumerals(minute)}` : toArabicNumerals(minute);
  return `${period} ${toArabicNumerals(h)}:${formattedMinute}`;
};

// Format time to English notation (AM/PM)
const formatEnglishTime = (hour: number, minute: number): string => {
  const period = hour < 12 ? 'AM' : 'PM';
  const h = hour % 12 || 12;
  // Ensure minutes are padded with leading zero if needed
  const formattedMinute = minute < 10 ? `0${minute}` : minute.toString();
  return `${h}:${formattedMinute} ${period}`;
};

// Hijri calendar calculation
// This is a more accurate Hijri date calculation compared to the simplified one
const hijriMonths = [
  { ar: "محرم", en: "Muharram" },
  { ar: "صفر", en: "Safar" },
  { ar: "ربيع الأول", en: "Rabi' al-Awwal" },
  { ar: "ربيع الثاني", en: "Rabi' al-Thani" },
  { ar: "جمادى الأولى", en: "Jumada al-Ula" },
  { ar: "جمادى الآخرة", en: "Jumada al-Thani" },
  { ar: "رجب", en: "Rajab" },
  { ar: "شعبان", en: "Sha'ban" },
  { ar: "رمضان", en: "Ramadan" },
  { ar: "شوال", en: "Shawwal" },
  { ar: "ذو القعدة", en: "Dhu al-Qi'dah" },
  { ar: "ذو الحجة", en: "Dhu al-Hijjah" }
];

// Function to calculate Hijri date
export const calculateHijriDate = (date = new Date()): { day: number; month: number; year: number } => {
  // Based on the Kuwaiti algorithm for Hijri date calculation
  // A simplified version for demonstration
  const gregorianDate = new Date(date);
  
  // Julian day calculation
  const year = gregorianDate.getFullYear();
  const month = gregorianDate.getMonth() + 1;
  const day = gregorianDate.getDate();
  
  let jd = Math.floor((365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524.5);
  
  // Adjustment for Gregorian calendar
  if (jd > 2299160) {
    const a = Math.floor((year / 100));
    jd += (2 - a + Math.floor(a / 4));
  }
  
  // Islamic date calculation
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  
  const hijriMonth = Math.floor((24 * l3) / 709);
  const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;
  
  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear
  };
};

export const getCurrentIslamicDate = (language = 'ar'): IslamicDate => {
  const today = new Date();
  const dayNames = {
    ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  };
  
  // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
  const dayIndex = today.getDay();
  
  // Calculate Hijri date using our function
  const hijriDate = calculateHijriDate(today);
  
  return {
    day: language === 'ar' ? toArabicNumerals(hijriDate.day) : hijriDate.day.toString(),
    month: language === 'ar' ? hijriMonths[hijriDate.month - 1].ar : hijriMonths[hijriDate.month - 1].en,
    year: language === 'ar' ? toArabicNumerals(hijriDate.year) : hijriDate.year.toString(), 
    dayOfWeek: language === 'ar' ? dayNames.ar[dayIndex] : dayNames.en[dayIndex],
    gregorianDate: format(today, 'dd/MM/yyyy')
  };
};

// Calculate prayer times based on coordinates using more accurate formula
// This uses a simplified version of the prayer time calculation methods
export const getPrayerTimes = (latitude: number = 21.3891, longitude: number = 39.8579, language: string = 'ar'): PrayerTime[] => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Day of year calculation for seasonal adjustment
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  // Latitude-based prayer time adjustments
  const latitudeAdjustment = Math.abs(latitude) / 90; // Normalized latitude factor
  
  // Seasonal adjustment based on day of year
  const seasonalFactor = Math.sin((dayOfYear - 80) * Math.PI / 180) * 0.5;
  
  // Base prayer times for equator at equinox
  const baseFajr = 5;
  const baseSunrise = 6.5;
  const baseDhuhr = 12;
  const baseAsr = 15.5;
  const baseMaghrib = 18;
  const baseIsha = 19.5;
  
  // Adjust based on latitude and season
  const latSeasonAdjust = latitudeAdjustment * seasonalFactor;
  
  // Calculate adjusted hours
  let fajrHour = Math.floor(baseFajr - latSeasonAdjust);
  let fajrMinute = Math.floor((baseFajr - latSeasonAdjust - fajrHour) * 60);
  
  let sunriseHour = Math.floor(baseSunrise - latSeasonAdjust);
  let sunriseMinute = Math.floor((baseSunrise - latSeasonAdjust - sunriseHour) * 60);
  
  // Dhuhr is always around noon, with minor adjustments for longitude
  let dhuhrHour = Math.floor(baseDhuhr + (longitude % 15) / 15);
  let dhuhrMinute = Math.floor(((baseDhuhr + (longitude % 15) / 15) - dhuhrHour) * 60);
  
  let asrHour = Math.floor(baseAsr + latSeasonAdjust / 2);
  let asrMinute = Math.floor((baseAsr + latSeasonAdjust / 2 - asrHour) * 60);
  
  let maghribHour = Math.floor(baseMaghrib + latSeasonAdjust);
  let maghribMinute = Math.floor((baseMaghrib + latSeasonAdjust - maghribHour) * 60);
  
  let ishaHour = Math.floor(baseIsha + latSeasonAdjust + 0.5);
  let ishaMinute = Math.floor((baseIsha + latSeasonAdjust + 0.5 - ishaHour) * 60);
  
  // Calculate midnight (halfway between maghrib and fajr)
  const maghribMinutes = maghribHour * 60 + maghribMinute;
  const fajrNextDayMinutes = (fajrHour + 24) * 60 + fajrMinute; // Fajr for the next day
  const midnightMinutes = maghribMinutes + (fajrNextDayMinutes - maghribMinutes) / 2;
  
  let midnightHour = Math.floor(midnightMinutes / 60) % 24;
  let midnightMinute = Math.floor(midnightMinutes % 60);
  
  // Calculate last third of night (between midnight and fajr)
  // Fix: Calculate lastThirdStartMinutes correctly using midnightMinutes
  const lastThirdStartMinutes = midnightMinutes + ((fajrNextDayMinutes - midnightMinutes) * 2 / 3);
  
  let lastThirdHour = Math.floor(lastThirdStartMinutes / 60) % 24;
  let lastThirdMinute = Math.floor(lastThirdStartMinutes % 60);
  
  // Format prayer times based on language
  const formatTime = (hour: number, minute: number): string => {
    return language === 'ar' 
      ? formatArabicTime(hour, minute) 
      : formatEnglishTime(hour, minute);
  };
  
  // Create prayer times with proper names and formatting
  const prayerTimes: PrayerTime[] = [
    { name: language === 'ar' ? "الفجر" : "Fajr", time: formatTime(fajrHour, fajrMinute) },
    { name: language === 'ar' ? "الشروق" : "Sunrise", time: formatTime(sunriseHour, sunriseMinute) },
    { name: language === 'ar' ? "الظهر" : "Dhuhr", time: formatTime(dhuhrHour, dhuhrMinute) },
    { name: language === 'ar' ? "العصر" : "Asr", time: formatTime(asrHour, asrMinute) },
    { name: language === 'ar' ? "المغرب" : "Maghrib", time: formatTime(maghribHour, maghribMinute) },
    { name: language === 'ar' ? "العشاء" : "Isha", time: formatTime(ishaHour, ishaMinute) },
    { name: language === 'ar' ? "منتصف الليل" : "Midnight", time: formatTime(midnightHour, midnightMinute) },
    { name: language === 'ar' ? "الثلث الأخير" : "Last Third", time: formatTime(lastThirdHour, lastThirdMinute) }
  ];
  
  // Mark the next prayer time
  // Convert all times to minutes since midnight for easy comparison
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  const prayerMinutes = [
    fajrHour * 60 + fajrMinute,
    sunriseHour * 60 + sunriseMinute,
    dhuhrHour * 60 + dhuhrMinute,
    asrHour * 60 + asrMinute,
    maghribHour * 60 + maghribMinute,
    ishaHour * 60 + ishaMinute,
    midnightHour * 60 + midnightMinute,
    (lastThirdHour + (lastThirdHour < 12 ? 24 : 0)) * 60 + lastThirdMinute // Handle times past midnight
  ];
  
  let nextPrayerIndex = -1;
  
  // Find the next prayer time
  for (let i = 0; i < prayerMinutes.length; i++) {
    if (prayerMinutes[i] > currentTimeMinutes) {
      nextPrayerIndex = i;
      break;
    }
  }
  
  // If no prayer time is found, it means we've passed the last prayer of the day
  // So the next prayer is the first prayer of tomorrow
  if (nextPrayerIndex === -1) {
    nextPrayerIndex = 0;
  }
  
  prayerTimes[nextPrayerIndex].isNext = true;
  
  return prayerTimes;
};

export const getForbiddenPrayerTimes = (language = 'ar'): ForbiddenPrayerTime[] => {
  return [
    {
      description: "من بعد صلاة الفجر إلى ارتفاع الشمس",
      timeRange: "من بعد صلاة الفجر إلى بعد الشروق بثلث ساعة",
      descriptionEn: "After Fajr prayer until the sun rises fully",
      timeRangeEn: "From after Fajr prayer until about 15-20 minutes after sunrise"
    },
    {
      description: "عند قيام الشمس حتى تزول",
      timeRange: "وقت استواء الشمس في منتصف السماء",
      descriptionEn: "When the sun is at its zenith (midday)",
      timeRangeEn: "When the sun is directly overhead until it begins to decline"
    },
    {
      description: "عندما تميل الشمس للغروب",
      timeRange: "من بعد صلاة العصر إلى غروب الشمس",
      descriptionEn: "When the sun begins to set",
      timeRangeEn: "From after Asr prayer until sunset"
    }
  ];
};

export const getTimeToNextPrayer = (language: string = 'ar', includeSeconds: boolean = true): string => {
  const prayerTimes = getPrayerTimes(undefined, undefined, language);
  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);
  
  if (!nextPrayer) {
    return language === 'ar' ? "٠٠:٠٠:٠٠" : "00:00:00";
  }
  
  // Parse the prayer time
  const now = new Date();
  let hour = 0, minute = 0, period = '';
  
  if (language === 'ar') {
    const prayerTimeStr = nextPrayer.time;
    const timeParts = prayerTimeStr.split(' ');
    period = timeParts[0];
    const timePortion = timeParts[1];
    const [hourStr, minuteStr] = timePortion.split(':');
    
    // Convert Arabic numerals to standard numerals
    const arabicToEnglish = (str: string) => {
      return str
        .replace(/[٠]/g, '0')
        .replace(/[١]/g, '1')
        .replace(/[٢]/g, '2')
        .replace(/[٣]/g, '3')
        .replace(/[٤]/g, '4')
        .replace(/[٥]/g, '5')
        .replace(/[٦]/g, '6')
        .replace(/[٧]/g, '7')
        .replace(/[٨]/g, '8')
        .replace(/[٩]/g, '9');
    };
    
    hour = parseInt(arabicToEnglish(hourStr));
    minute = parseInt(arabicToEnglish(minuteStr));
  } else {
    const prayerTimeStr = nextPrayer.time;
    const [timePortion, periodPart] = prayerTimeStr.split(' ');
    period = periodPart;
    const [hourStr, minuteStr] = timePortion.split(':');
    
    hour = parseInt(hourStr);
    minute = parseInt(minuteStr);
  }
  
  // Adjust for AM/PM (ص/م)
  if ((period === 'م' || period === 'PM') && hour !== 12) {
    hour += 12;
  } else if ((period === 'ص' || period === 'AM') && hour === 12) {
    hour = 0;
  }
  
  // Calculate difference from now
  const prayerTime = new Date();
  prayerTime.setHours(hour, minute, 0, 0);
  
  // If the prayer time is earlier today, it must be for tomorrow
  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }
  
  // Calculate difference in milliseconds
  const diffMs = prayerTime.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;
  
  // Convert to appropriate numerals with proper formatting
  if (language === 'ar') {
    if (includeSeconds) {
      return `${toArabicNumerals(hours)}:${minutes < 10 ? `٠${toArabicNumerals(minutes)}` : toArabicNumerals(minutes)}:${seconds < 10 ? `٠${toArabicNumerals(seconds)}` : toArabicNumerals(seconds)}`;
    } else {
      return `${toArabicNumerals(hours)}:${minutes < 10 ? `٠${toArabicNumerals(minutes)}` : toArabicNumerals(minutes)}`;
    }
  } else {
    if (includeSeconds) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }
};

// Get prayer times for a specific date
export const getPrayerTimesForDate = (date: Date, latitude: number = 21.3891, longitude: number = 39.8579, language: string = 'ar'): PrayerTime[] => {
  // Day of year calculation for seasonal adjustment
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  
  // Latitude-based prayer time adjustments
  const latitudeAdjustment = Math.abs(latitude) / 90; // Normalized latitude factor
  
  // Seasonal adjustment based on day of year
  const seasonalFactor = Math.sin((dayOfYear - 80) * Math.PI / 180) * 0.5;
  
  // Base prayer times for equator at equinox
  const baseFajr = 5;
  const baseSunrise = 6.5;
  const baseDhuhr = 12;
  const baseAsr = 15.5;
  const baseMaghrib = 18;
  const baseIsha = 19.5;
  
  // Adjust based on latitude and season
  const latSeasonAdjust = latitudeAdjustment * seasonalFactor;
  
  // Calculate adjusted hours
  let fajrHour = Math.floor(baseFajr - latSeasonAdjust);
  let fajrMinute = Math.floor((baseFajr - latSeasonAdjust - fajrHour) * 60);
  
  let sunriseHour = Math.floor(baseSunrise - latSeasonAdjust);
  let sunriseMinute = Math.floor((baseSunrise - latSeasonAdjust - sunriseHour) * 60);
  
  // Dhuhr is always around noon, with minor adjustments for longitude
  let dhuhrHour = Math.floor(baseDhuhr + (longitude % 15) / 15);
  let dhuhrMinute = Math.floor(((baseDhuhr + (longitude % 15) / 15) - dhuhrHour) * 60);
  
  let asrHour = Math.floor(baseAsr + latSeasonAdjust / 2);
  let asrMinute = Math.floor((baseAsr + latSeasonAdjust / 2 - asrHour) * 60);
  
  let maghribHour = Math.floor(baseMaghrib + latSeasonAdjust);
  let maghribMinute = Math.floor((baseMaghrib + latSeasonAdjust - maghribHour) * 60);
  
  let ishaHour = Math.floor(baseIsha + latSeasonAdjust + 0.5);
  let ishaMinute = Math.floor((baseIsha + latSeasonAdjust + 0.5 - ishaHour) * 60);
  
  // Format prayer times based on language
  const formatTime = (hour: number, minute: number): string => {
    return language === 'ar' 
      ? formatArabicTime(hour, minute) 
      : formatEnglishTime(hour, minute);
  };
  
  // Create prayer times with proper names and formatting
  const prayerTimes: PrayerTime[] = [
    { name: language === 'ar' ? "الفجر" : "Fajr", time: formatTime(fajrHour, fajrMinute) },
    { name: language === 'ar' ? "الشروق" : "Sunrise", time: formatTime(sunriseHour, sunriseMinute) },
    { name: language === 'ar' ? "الظهر" : "Dhuhr", time: formatTime(dhuhrHour, dhuhrMinute) },
    { name: language === 'ar' ? "العصر" : "Asr", time: formatTime(asrHour, asrMinute) },
    { name: language === 'ar' ? "المغرب" : "Maghrib", time: formatTime(maghribHour, maghribMinute) },
    { name: language === 'ar' ? "العشاء" : "Isha", time: formatTime(ishaHour, ishaMinute) }
  ];
  
  return prayerTimes;
};
