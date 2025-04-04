import { format } from 'date-fns';

export interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

export interface IslamicDate {
  day: string;
  month: string;
  year: string;
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
  return `${period} ${h}:${formattedMinute}`;
};

export const getCurrentIslamicDate = (): IslamicDate => {
  // In a real app, this would use a proper Hijri calendar library
  const today = new Date();
  
  // This is just a placeholder value for demo purposes
  return {
    day: "٥",
    month: "شوّال",
    year: "١٤٤٦", 
    gregorianDate: today.toLocaleDateString('ar-SA')
  };
};

// Calculate prayer times based on coordinates using simplified formula
// In a real app, this would use a proper prayer time calculation library
export const getPrayerTimes = (latitude: number = 21.3891, longitude: number = 39.8579, language: string = 'ar'): PrayerTime[] => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Adjust times based on location
  // This is a very simplified approach - real calculations would be more complex
  const latOffset = Math.abs(latitude - 21.3891) * 0.016;
  const longOffset = Math.abs(longitude - 39.8579) * 0.008;
  const totalOffset = Math.round((latOffset + longOffset) * 60); // In minutes
  
  // Create more realistic prayer times with location adjustment
  const fajrHour = 4;
  const fajrMinute = Math.max(0, Math.min(59, 11 + (totalOffset % 60)));
  
  const sunriseHour = 5;
  const sunriseMinute = Math.max(0, Math.min(59, 40 + (totalOffset % 60)));
  
  const dhuhrHour = 12;
  const dhuhrMinute = Math.max(0, Math.min(59, 5 + (totalOffset % 30)));
  
  const asrHour = 15;
  const asrMinute = Math.max(0, Math.min(59, 30 + (totalOffset % 30)));
  
  const maghribHour = 18;
  const maghribMinute = Math.max(0, Math.min(59, 15 + (totalOffset % 30)));
  
  const ishaHour = 19;
  const ishaMinute = Math.max(0, Math.min(59, 45 + (totalOffset % 30)));
  
  const midnightHour = 23;
  const midnightMinute = Math.max(0, Math.min(59, 22 + (totalOffset % 30)));
  
  const lastThirdHour = 2;
  const lastThirdMinute = Math.max(0, Math.min(59, 15 + (totalOffset % 30)));
  
  // Format prayer times based on language
  const formatTime = (hour: number, minute: number): string => {
    return language === 'ar' 
      ? formatArabicTime(hour, minute) 
      : formatEnglishTime(hour, minute);
  };
  
  // Placeholder prayer times with proper formatting
  const prayerTimes: PrayerTime[] = [
    { name: "الفجر", time: formatTime(fajrHour, fajrMinute) },
    { name: "الشروق", time: formatTime(sunriseHour, sunriseMinute) },
    { name: "الظهر", time: formatTime(dhuhrHour, dhuhrMinute) },
    { name: "العصر", time: formatTime(asrHour, asrMinute) },
    { name: "المغرب", time: formatTime(maghribHour, maghribMinute) },
    { name: "العشاء", time: formatTime(ishaHour, ishaMinute) },
    { name: "منتصف الليل", time: formatTime(midnightHour, midnightMinute) },
    { name: "الثلث الأخير", time: formatTime(lastThirdHour, lastThirdMinute) }
  ];
  
  // Mark the next prayer time using more accurate calculation
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
    (lastThirdHour + 24) * 60 + lastThirdMinute // Adding 24 to handle times past midnight
  ];
  
  let nextPrayerIndex = 0;
  
  // Find the next prayer time
  for (let i = 0; i < prayerMinutes.length; i++) {
    if (prayerMinutes[i] > currentTimeMinutes) {
      nextPrayerIndex = i;
      break;
    }
  }
  
  // If no prayer time is found, it means we've passed the last prayer of the day
  // So the next prayer is the first prayer of tomorrow
  if (nextPrayerIndex === 0 && currentTimeMinutes > prayerMinutes[prayerMinutes.length - 1]) {
    nextPrayerIndex = 0;
  }
  
  prayerTimes[nextPrayerIndex].isNext = true;
  
  return prayerTimes;
};

export const getForbiddenPrayerTimes = (): ForbiddenPrayerTime[] => {
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

export const getTimeToNextPrayer = (language: string = 'ar'): string => {
  const prayerTimes = getPrayerTimes(undefined, undefined, language);
  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);
  
  if (!nextPrayer) {
    return language === 'ar' ? "٠٠:٠٠" : "00:00";
  }
  
  // Parse the prayer time
  let hourStr, minuteStr, period;
  
  if (language === 'ar') {
    [period, timeStr] = nextPrayer.time.split(' ');
    [hourStr, minuteStr] = timeStr.split(':');
    
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
    
    hourStr = arabicToEnglish(hourStr);
    minuteStr = arabicToEnglish(minuteStr);
  } else {
    [period, timeStr] = nextPrayer.time.split(' ');
    [hourStr, minuteStr] = timeStr.split(':');
  }
  
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  
  // Adjust for AM/PM (ص/م)
  if ((period === 'م' || period === 'PM') && hour !== 12) {
    hour += 12;
  } else if ((period === 'ص' || period === 'AM') && hour === 12) {
    hour = 0;
  }
  
  // Calculate difference from now
  const now = new Date();
  const prayerTime = new Date();
  prayerTime.setHours(hour, minute, 0, 0);
  
  // If the prayer time is earlier today, it must be for tomorrow
  if (prayerTime < now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }
  
  // Calculate difference in minutes
  const diffMs = prayerTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  // Convert to appropriate numerals with proper formatting
  if (language === 'ar') {
    // Convert to Arabic numerals with proper formatting
    return `${toArabicNumerals(hours)}:${minutes < 10 ? `٠${toArabicNumerals(minutes)}` : toArabicNumerals(minutes)}`;
  } else {
    // Format with leading zeros for English
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
};

// Get prayer times for a specific date
export const getPrayerTimesForDate = (date: Date, latitude: number = 21.3891, longitude: number = 39.8579, language: string = 'ar'): PrayerTime[] => {
  // Adjust times based on location and date
  // This is a simplified approach - real calculations would be more complex
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const seasonalOffset = Math.sin((dayOfYear / 365) * Math.PI * 2) * 10; // Seasonal variation in minutes
  
  const latOffset = Math.abs(latitude - 21.3891) * 0.016;
  const longOffset = Math.abs(longitude - 39.8579) * 0.008;
  const totalOffset = Math.round((latOffset + longOffset + seasonalOffset) * 60) % 30; // In minutes
  
  // Create prayer times with location and date adjustment
  const fajrHour = 4;
  const fajrMinute = Math.max(0, Math.min(59, 11 + (totalOffset % 15) - (date.getDate() % 2)));
  
  const sunriseHour = 5;
  const sunriseMinute = Math.max(0, Math.min(59, 40 + (totalOffset % 10) - (date.getDate() % 2)));
  
  const dhuhrHour = 12;
  const dhuhrMinute = Math.max(0, Math.min(59, 5 + (totalOffset % 5)));
  
  const asrHour = 15;
  const asrMinute = Math.max(0, Math.min(59, 30 + (totalOffset % 10) + (date.getDate() % 2)));
  
  const maghribHour = 18;
  const maghribMinute = Math.max(0, Math.min(59, 15 + (totalOffset % 10) + (date.getDate() % 2)));
  
  const ishaHour = 19;
  const ishaMinute = Math.max(0, Math.min(59, 45 + (totalOffset % 10) + (date.getDate() % 2)));
  
  // Format prayer times based on language
  const formatTime = (hour: number, minute: number): string => {
    return language === 'ar' 
      ? formatArabicTime(hour, minute) 
      : formatEnglishTime(hour, minute);
  };
  
  // Placeholder prayer times with proper formatting
  const prayerTimes: PrayerTime[] = [
    { name: "الفجر", time: formatTime(fajrHour, fajrMinute) },
    { name: "الشروق", time: formatTime(sunriseHour, sunriseMinute) },
    { name: "الظهر", time: formatTime(dhuhrHour, dhuhrMinute) },
    { name: "العصر", time: formatTime(asrHour, asrMinute) },
    { name: "المغرب", time: formatTime(maghribHour, maghribMinute) },
    { name: "العشاء", time: formatTime(ishaHour, ishaMinute) }
  ];
  
  return prayerTimes;
};
