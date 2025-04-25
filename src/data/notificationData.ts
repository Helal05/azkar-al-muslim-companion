
import { addMinutes, isAfter, format, addHours, parse, compareAsc, startOfToday } from "date-fns";
import { getPrayerTimesForDate } from "./prayerData";

// أنواع التنبيهات المتاحة
export enum NotificationType {
  PRAYER = "prayer",
  AZKAR_MORNING = "azkar_morning",
  AZKAR_EVENING = "azkar_evening",
  DUHA_PRAYER = "duha_prayer",
  TAHAJJUD = "tahajjud",
  FRIDAY_SUNNAH = "friday_sunnah",
  WHITE_DAYS_FASTING = "white_days_fasting"
}

// واجهة التنبيه
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: {
    ar: string;
    en: string;
  };
  time: Date;
  enabled: boolean;
  sound?: string;
  relatedTo?: string;
  minutesBefore?: number;
  description?: {
    ar: string;
    en: string;
  };
}

// واجهة إعدادات الصوت
export interface SoundOption {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  path: string;
}

// واجهة خيار الوقت
export interface TimeOption {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  time: string;
  relativeTime?: {
    prayer?: string;
    minutes?: number;
  };
}

// الاصوات المتاحة للتنبيهات
export const availableSounds: SoundOption[] = [
  {
    id: "default",
    name: { ar: "صوت المنبه الرئيسي", en: "Default Alert Sound" },
    path: "/sounds/default-notification.mp3"
  },
  {
    id: "adhan-makkah",
    name: { ar: "جزء من الأذان - مكة", en: "Adhan Part - Makkah" },
    path: "/sounds/adhan-makkah.mp3"
  },
  {
    id: "adhan-egypt",
    name: { ar: "جزء من الأذان - مصر", en: "Adhan Part - Egypt" },
    path: "/sounds/adhan-egypt.mp3"
  },
  {
    id: "adhan-emirates",
    name: { ar: "جزء من الأذان - الإمارات", en: "Adhan Part - Emirates" },
    path: "/sounds/adhan-emirates.mp3"
  },
  {
    id: "adhan-afasy",
    name: { ar: "جزء من الأذان - مشاري العفاسي", en: "Adhan Part - Mishary Alafasy" },
    path: "/sounds/adhan-afasy.mp3"
  },
  {
    id: "adhan-fajr",
    name: { ar: "جزء من الأذان - الفجر", en: "Adhan Part - Fajr" },
    path: "/sounds/adhan-fajr.mp3"
  },
  {
    id: "hayya-al-salah",
    name: { ar: "حي على الصلاة", en: "Hayya Alas Salah" },
    path: "/sounds/hayya-al-salah.mp3"
  },
  {
    id: "takbirat-1",
    name: { ar: "تكبيرات 1", en: "Takbirat 1" },
    path: "/sounds/takbirat-1.mp3"
  },
  {
    id: "takbirat-2",
    name: { ar: "تكبيرات 2", en: "Takbirat 2" },
    path: "/sounds/takbirat-2.mp3"
  },
  {
    id: "adhan-qatami",
    name: { ar: "جزء من الأذان - ناصر القطامي", en: "Adhan Part - Nasser Al Qatami" },
    path: "/sounds/adhan-qatami.mp3"
  },
  {
    id: "adhan-haram",
    name: { ar: "جزء من الأذان - الحرم النبوي", en: "Adhan Part - Masjid Nabawi" },
    path: "/sounds/adhan-haram.mp3"
  },
  {
    id: "adhan-saqqaf",
    name: { ar: "جزء من الأذان - هشام السقاف", en: "Adhan Part - Hisham Al Saqqaf" },
    path: "/sounds/adhan-saqqaf.mp3"
  },
  {
    id: "adhan-majid",
    name: { ar: "جزء من الأذان - الشيخ عبدالعزيز بن ماجد", en: "Adhan Part - Sheikh Abdul Aziz bin Majid" },
    path: "/sounds/adhan-majid.mp3"
  },
  {
    id: "its-adhan-time",
    name: { ar: "حان الآن موعد الأذان", en: "It's Adhan Time Now" },
    path: "/sounds/its-adhan-time.mp3"
  },
  {
    id: "its-fajr-time",
    name: { ar: "حان الآن موعد أذان صلاة الفجر", en: "It's Fajr Prayer Adhan Time Now" },
    path: "/sounds/its-fajr-time.mp3"
  },
  {
    id: "asbahna",
    name: { ar: "اصبحنا واصبح الملك لله", en: "Asbahna wa Asbah Almulk Lillah" },
    path: "/sounds/asbahna.mp3"
  },
  {
    id: "amsayna",
    name: { ar: "امسينا و امسى الملك لله", en: "Amsayna wa Amsa Almulk Lillah" },
    path: "/sounds/amsayna.mp3"
  },
  {
    id: "salat-ala-nabi",
    name: { ar: "الصلاة على النبي", en: "Salat Alan Nabi" },
    path: "/sounds/salat-ala-nabi.mp3"
  },
  {
    id: "no-sound",
    name: { ar: "بدون صوت", en: "No Sound" },
    path: ""
  }
];

// خيارات وقت التنبيه لأذكار الصباح
export const morningAzkarTimeOptions: TimeOption[] = [
  {
    id: "fajr-30",
    title: { ar: "نصف ساعة بعد الفجر", en: "30 minutes after Fajr" },
    time: "",
    relativeTime: { prayer: "Fajr", minutes: 30 }
  },
  {
    id: "fajr-60",
    title: { ar: "ساعة بعد الفجر", en: "1 hour after Fajr" },
    time: "",
    relativeTime: { prayer: "Fajr", minutes: 60 }
  },
  {
    id: "fajr-120",
    title: { ar: "ساعتان بعد الفجر", en: "2 hours after Fajr" },
    time: "",
    relativeTime: { prayer: "Fajr", minutes: 120 }
  },
  {
    id: "fajr-180",
    title: { ar: "ثلاث ساعات بعد الفجر", en: "3 hours after Fajr" },
    time: "",
    relativeTime: { prayer: "Fajr", minutes: 180 }
  }
];

// خيارات وقت التنبيه لصلاة الضحى
export const duhaPrayerTimeOptions: TimeOption[] = [
  {
    id: "sunrise-15",
    title: { ar: "ربع ساعة بعد الشروق", en: "15 minutes after Sunrise" },
    time: "",
    relativeTime: { prayer: "Sunrise", minutes: 15 }
  },
  {
    id: "sunrise-30",
    title: { ar: "نصف ساعة بعد الشروق", en: "30 minutes after Sunrise" },
    time: "",
    relativeTime: { prayer: "Sunrise", minutes: 30 }
  },
  {
    id: "dhuhr-30",
    title: { ar: "نصف ساعة قبل الظهر", en: "30 minutes before Dhuhr" },
    time: "",
    relativeTime: { prayer: "Dhuhr", minutes: -30 }
  },
  {
    id: "dhuhr-60",
    title: { ar: "ساعة قبل الظهر", en: "1 hour before Dhuhr" },
    time: "",
    relativeTime: { prayer: "Dhuhr", minutes: -60 }
  },
  {
    id: "dhuhr-120",
    title: { ar: "ساعتان قبل الظهر", en: "2 hours before Dhuhr" },
    time: "",
    relativeTime: { prayer: "Dhuhr", minutes: -120 }
  },
  {
    id: "dhuhr-180",
    title: { ar: "ثلاث ساعات قبل الظهر", en: "3 hours before Dhuhr" },
    time: "",
    relativeTime: { prayer: "Dhuhr", minutes: -180 }
  }
];

// خيارات وقت التنبيه للثلث الأخير من الليل
export const lastThirdTimeOptions: TimeOption[] = [
  {
    id: "last-third-1",
    title: { ar: "بداية الثلث الأخير", en: "Start of last third" },
    time: "",
  },
  {
    id: "last-third-2",
    title: { ar: "منتصف الثلث الأخير", en: "Middle of last third" },
    time: "",
  }
];

// حساب وقت الثلث الأخير من الليل
export const calculateLastThirdOfNight = (latitude: number, longitude: number): { start: Date, middle: Date } => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayPrayers = getPrayerTimesForDate(today, latitude, longitude);
  const tomorrowPrayers = getPrayerTimesForDate(tomorrow, latitude, longitude);
  
  // تحويل وقت المغرب اليوم والفجر غدًا إلى كائنات Date
  const maghribTime = parseTimeStringToDate(todayPrayers[4].time, today);
  const fajrTime = parseTimeStringToDate(tomorrowPrayers[0].time, tomorrow);
  
  // حساب المدة بين المغرب والفجر بالدقائق
  const nightDurationMinutes = (fajrTime.getTime() - maghribTime.getTime()) / (1000 * 60);
  
  // حساب بداية الثلث الأخير (بعد مرور ثلثي المدة من المغرب)
  const lastThirdStartMinutes = Math.floor(nightDurationMinutes * (2/3));
  const lastThirdStart = new Date(maghribTime.getTime() + lastThirdStartMinutes * 60 * 1000);
  
  // حساب منتصف الثلث الأخير
  const lastThirdMiddleMinutes = Math.floor(nightDurationMinutes * (5/6)); // 2/3 + (1/3 / 2)
  const lastThirdMiddle = new Date(maghribTime.getTime() + lastThirdMiddleMinutes * 60 * 1000);
  
  return { start: lastThirdStart, middle: lastThirdMiddle };
};

// تحويل وقت من سلسلة نصية إلى كائن Date
const parseTimeStringToDate = (timeStr: string, baseDate: Date): Date => {
  const result = new Date(baseDate);
  const [timeComponent, period] = timeStr.split(' ');
  const [hours, minutes] = timeComponent.split(':').map(Number);
  
  let adjustedHours = hours;
  if (period === 'PM' && hours !== 12) {
    adjustedHours += 12;
  } else if (period === 'AM' && hours === 12) {
    adjustedHours = 0;
  }
  
  result.setHours(adjustedHours, minutes, 0, 0);
  return result;
};

// الحصول على التنبيهات القادمة
export const getUpcomingNotifications = (
  notifications: NotificationItem[],
  language: "ar" | "en" = "ar"
): NotificationItem[] => {
  const now = new Date();
  const enabledNotifications = notifications.filter(notification => notification.enabled);
  
  // ترتيب التنبيهات بناءً على الوقت
  return enabledNotifications
    .filter(notification => isAfter(notification.time, now))
    .sort((a, b) => compareAsc(a.time, b.time));
};

// تنسيق وقت التنبيه بتنسيق مناسب
export const formatNotificationTime = (date: Date, language: "ar" | "en" = "ar"): string => {
  const formattedTime = format(date, 'hh:mm');
  const period = format(date, 'a').toUpperCase();
  const periodText = period === 'AM' ? (language === 'ar' ? 'صباحًا' : 'AM') : (language === 'ar' ? 'مساءً' : 'PM');
  
  return language === 'ar' 
    ? `عند الساعة ${formattedTime} ${periodText}`
    : `at ${formattedTime} ${periodText}`;
};

// الحصول على وصف التنبيه
export const getNotificationDescription = (notification: NotificationItem, language: "ar" | "en" = "ar"): string => {
  if (notification.description) {
    return language === 'ar' ? notification.description.ar : notification.description.en;
  }
  
  return formatNotificationTime(notification.time, language);
};

// تحديث وقت التنبيه بناءً على خيار الوقت والصلاة
export const updateNotificationTimeFromOption = (
  option: TimeOption, 
  latitude: number, 
  longitude: number
): Date => {
  // إذا كان الوقت متعلق بصلاة معينة
  if (option.relativeTime?.prayer) {
    const today = startOfToday();
    const prayers = getPrayerTimesForDate(today, latitude, longitude);
    
    let basePrayerTime: Date | null = null;
    
    // تحديد وقت الصلاة الأساسية
    switch (option.relativeTime.prayer) {
      case 'Fajr':
        basePrayerTime = parseTimeStringToDate(prayers[0].time, today);
        break;
      case 'Sunrise':
        basePrayerTime = parseTimeStringToDate(prayers[1].time, today);
        break;
      case 'Dhuhr':
        basePrayerTime = parseTimeStringToDate(prayers[2].time, today);
        break;
      case 'Asr':
        basePrayerTime = parseTimeStringToDate(prayers[3].time, today);
        break;
      case 'Maghrib':
        basePrayerTime = parseTimeStringToDate(prayers[4].time, today);
        break;
      case 'Isha':
        basePrayerTime = parseTimeStringToDate(prayers[5].time, today);
        break;
    }
    
    if (basePrayerTime && option.relativeTime.minutes) {
      return addMinutes(basePrayerTime, option.relativeTime.minutes);
    }
  }
  
  // في حالة عدم وجود صلاة مرتبطة، استخدم الوقت المحدد
  return option.time ? parse(option.time, 'HH:mm', new Date()) : new Date();
};

// إنشاء معرف فريد للتنبيه
export const generateNotificationId = (): string => {
  return 'notif_' + Math.random().toString(36).substr(2, 9);
};

// الحصول على صوت التنبيه الافتراضي
export const getDefaultSound = (): SoundOption => {
  return availableSounds[0];
};

// حساب وتنسيق وقت التنبيه لعرضه
export const formatTimeOption = (option: TimeOption, latitude: number, longitude: number, language: "ar" | "en" = "ar"): string => {
  if (option.relativeTime?.prayer) {
    const today = startOfToday();
    const prayers = getPrayerTimesForDate(today, latitude, longitude);
    
    let basePrayerTime: Date | null = null;
    let prayerName = '';
    
    // تحديد اسم الصلاة ووقتها
    switch (option.relativeTime.prayer) {
      case 'Fajr':
        basePrayerTime = parseTimeStringToDate(prayers[0].time, today);
        prayerName = language === 'ar' ? 'الفجر' : 'Fajr';
        break;
      case 'Sunrise':
        basePrayerTime = parseTimeStringToDate(prayers[1].time, today);
        prayerName = language === 'ar' ? 'الشروق' : 'Sunrise';
        break;
      case 'Dhuhr':
        basePrayerTime = parseTimeStringToDate(prayers[2].time, today);
        prayerName = language === 'ar' ? 'الظهر' : 'Dhuhr';
        break;
      case 'Asr':
        basePrayerTime = parseTimeStringToDate(prayers[3].time, today);
        prayerName = language === 'ar' ? 'العصر' : 'Asr';
        break;
      case 'Maghrib':
        basePrayerTime = parseTimeStringToDate(prayers[4].time, today);
        prayerName = language === 'ar' ? 'المغرب' : 'Maghrib';
        break;
      case 'Isha':
        basePrayerTime = parseTimeStringToDate(prayers[5].time, today);
        prayerName = language === 'ar' ? 'العشاء' : 'Isha';
        break;
    }
    
    if (basePrayerTime && option.relativeTime.minutes !== undefined) {
      const notificationTime = addMinutes(basePrayerTime, option.relativeTime.minutes);
      const formattedTime = format(notificationTime, 'hh:mm');
      const period = format(notificationTime, 'a').toUpperCase();
      const periodText = period === 'AM' ? (language === 'ar' ? 'صباحًا' : 'AM') : (language === 'ar' ? 'مساءً' : 'PM');
      
      // تنسيق النص المعروض حسب اللغة
      if (language === 'ar') {
        if (option.relativeTime.minutes > 0) {
          return `عند الساعة ${formattedTime} ${periodText}`;
        } else {
          return `عند الساعة ${formattedTime} ${periodText}`;
        }
      } else {
        if (option.relativeTime.minutes > 0) {
          return `at ${formattedTime} ${periodText}`;
        } else {
          return `at ${formattedTime} ${periodText}`;
        }
      }
    }
  }
  
  return '';
};

// Play notification sound
export const playNotificationSound = async (soundId: string): Promise<void> => {
  const sound = availableSounds.find(s => s.id === soundId);
  if (sound && sound.path) {
    const audio = new Audio(sound.path);
    try {
      await audio.play();
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }
};

// Test notification
export const testNotification = async (title: string, body: string, soundId?: string): Promise<boolean> => {
  try {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications");
      return false;
    }

    // Request permission if needed
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.error("Notification permission denied");
        return false;
      }
    }

    // Create and show notification
    const notification = new Notification(title, {
      body,
      icon: "/app-icon-192.png",
    });

    // Play sound if provided
    if (soundId) {
      await playNotificationSound(soundId);
    }

    return true;
  } catch (error) {
    console.error("Error showing test notification:", error);
    return false;
  }
};
