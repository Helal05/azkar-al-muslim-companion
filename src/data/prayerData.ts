
import { differenceInMinutes, format, addMinutes } from "date-fns";

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

// Calculate prayer times for a given location
export const getPrayerTimes = (
  latitude: number, 
  longitude: number, 
  language: string = 'ar'
): PrayerTime[] => {
  const now = new Date();
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
    const prayerTime = new Date();
    const [hours, minutes] = prayer.time.replace(' AM', '').replace(' PM', '').split(':');
    prayerTime.setHours(
      prayer.time.includes('PM') ? parseInt(hours) + 12 : parseInt(hours),
      parseInt(minutes)
    );
    return prayerTime > now;
  });

  if (nextPrayerIndex !== -1) {
    prayerTimes[nextPrayerIndex].isNext = true;
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

  const [hours, minutes] = nextPrayer.time.replace(' AM', '').replace(' PM', '').split(':');
  const nextPrayerTime = new Date();
  nextPrayerTime.setHours(
    nextPrayer.time.includes('PM') ? parseInt(hours) + 12 : parseInt(hours),
    parseInt(minutes)
  );

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

// Get current Islamic date
export const getCurrentIslamicDate = (language: string = 'ar'): IslamicDate => {
  const gregorianDate = new Date();
  const monthNames = language === 'ar' 
    ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = language === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    day: language === 'ar' 
      ? gregorianDate.getDate().toLocaleString('ar-EG') 
      : gregorianDate.getDate().toString(),
    month: monthNames[gregorianDate.getMonth()],
    year: language === 'ar' 
      ? (gregorianDate.getFullYear() - 578).toString() 
      : gregorianDate.getFullYear().toString(),
    dayOfWeek: dayNames[gregorianDate.getDay()],
    gregorianDate: format(gregorianDate, 'dd/MM/yyyy')
  };
};

// Additional utility functions can be added here...

export const getForbiddenPrayerTimes = () => {
  return [
    {
      description: "عند شروق الشمس",
      descriptionEn: "After sunrise",
      timeRange: "من شروق الشمس حتى ترتفع",
      timeRangeEn: "From sunrise until it rises"
    },
    // Add other forbidden prayer times here
  ];
};

export const calculateHijriDate = (date: Date = new Date()): HijriDate => {
  // Simplified Hijri date calculation
  const hijriMonths = [
    { name: "محرم", nameEn: "Muharram" },
    { name: "صفر", nameEn: "Safar" },
    // Add other months
  ];

  // For calculation purposes, determine the month number (1-12)
  const monthNumber = date.getMonth() % 12 + 1;

  return {
    day: date.getDate(),
    month: monthNumber,
    year: date.getFullYear() - 578
  };
};

export const getPrayerTimesForDate = (
  date: Date, 
  latitude: number, 
  longitude: number, 
  language: string = 'ar'
): PrayerTime[] => {
  // Logic to get prayer times for a specific date
  return getPrayerTimes(latitude, longitude, language);
};
