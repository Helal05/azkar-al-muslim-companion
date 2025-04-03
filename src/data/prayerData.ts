
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

export const getPrayerTimes = (latitude: number = 21.3891, longitude: number = 39.8579): PrayerTime[] => {
  // In a real app, this would use a prayer time calculation library or API
  // For now, we'll use more realistic fixed times
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Create more realistic prayer times
  const fajrHour = 4;
  const fajrMinute = 11;
  
  const sunriseHour = 5;
  const sunriseMinute = 40;
  
  const dhuhrHour = 12;
  const dhuhrMinute = 5;
  
  const asrHour = 15;
  const asrMinute = 30;
  
  const maghribHour = 18;
  const maghribMinute = 15;
  
  const ishaHour = 19;
  const ishaMinute = 45;
  
  const midnightHour = 23;
  const midnightMinute = 22;
  
  const lastThirdHour = 2;
  const lastThirdMinute = 15;
  
  // Placeholder prayer times with proper Arabic formatting
  const prayerTimes: PrayerTime[] = [
    { name: "الفجر", time: formatArabicTime(fajrHour, fajrMinute) },
    { name: "الشروق", time: formatArabicTime(sunriseHour, sunriseMinute) },
    { name: "الظهر", time: formatArabicTime(dhuhrHour, dhuhrMinute) },
    { name: "العصر", time: formatArabicTime(asrHour, asrMinute) },
    { name: "المغرب", time: formatArabicTime(maghribHour, maghribMinute) },
    { name: "العشاء", time: formatArabicTime(ishaHour, ishaMinute) },
    { name: "منتصف الليل", time: formatArabicTime(midnightHour, midnightMinute) },
    { name: "الثلث الأخير", time: formatArabicTime(lastThirdHour, lastThirdMinute) }
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
      description: "أوقات النهي عن الصلاة",
      timeRange: "من بعد صلاة الفجر إلى بعد الشروق بثلث ساعة"
    },
    {
      description: "عند قيام الشمس حتى تزول",
      timeRange: "وقت استواء الشمس في منتصف السماء"
    },
    {
      description: "عندما تميل الشمس للغروب",
      timeRange: "من بعد صلاة العصر إلى غروب الشمس"
    }
  ];
};

export const getTimeToNextPrayer = (): string => {
  const prayerTimes = getPrayerTimes();
  const nextPrayer = prayerTimes.find(prayer => prayer.isNext);
  
  if (!nextPrayer) {
    return "٠٠:٠٠";
  }
  
  // Parse the prayer time
  const [period, timeStr] = nextPrayer.time.split(' ');
  const [hourStr, minuteStr] = timeStr.split(':');
  
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
  
  let hour = parseInt(arabicToEnglish(hourStr));
  const minute = parseInt(arabicToEnglish(minuteStr));
  
  // Adjust for AM/PM (ص/م)
  if (period === 'م' && hour !== 12) {
    hour += 12;
  } else if (period === 'ص' && hour === 12) {
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
  
  // Convert to Arabic numerals with proper formatting
  return `${toArabicNumerals(hours)}:${toArabicNumerals(minutes)}`;
};
