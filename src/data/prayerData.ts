
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

export const getCurrentIslamicDate = (): IslamicDate => {
  // In a real app, this would use a proper Hijri calendar library
  // This is a placeholder that would need to be replaced with actual implementation
  const today = new Date();
  
  // This is just a placeholder value for demo purposes
  return {
    day: "٥",
    month: "شوّال",
    year: "١٤٤٦", 
    gregorianDate: today.toISOString().split('T')[0]
  };
};

export const getPrayerTimes = (latitude: number = 21.3891, longitude: number = 39.8579): PrayerTime[] => {
  // In a real app, this would use a prayer time calculation library or API
  // For now, we'll use fixed times as a placeholder
  
  const now = new Date();
  const hour = now.getHours();
  
  // Placeholder prayer times
  const prayerTimes: PrayerTime[] = [
    { name: "الفجر", time: "ص ٤:١١" },
    { name: "الشروق", time: "ص ٥:٤٠" },
    { name: "الظهر", time: "ص ١١:٥٨" },
    { name: "العصر", time: "م ٣:٣٠" },
    { name: "المغرب", time: "م ٦:١٥" },
    { name: "العشاء", time: "م ٧:٣٥" },
    { name: "منتصف الليل", time: "م ١١:١٢" },
    { name: "الثلث الأخير", time: "ص ١٢:٥١" }
  ];
  
  // Mark the next prayer time
  // This is simplified logic for the demo
  let nextPrayerIndex = 0;
  if (hour >= 4 && hour < 5) nextPrayerIndex = 1;
  else if (hour >= 5 && hour < 12) nextPrayerIndex = 2;
  else if (hour >= 12 && hour < 15) nextPrayerIndex = 3;
  else if (hour >= 15 && hour < 18) nextPrayerIndex = 4;
  else if (hour >= 18 && hour < 19) nextPrayerIndex = 5;
  else if (hour >= 19 && hour < 23) nextPrayerIndex = 6;
  else nextPrayerIndex = 0;
  
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
  // This would normally calculate the actual time remaining
  // For the demo, we'll return a fixed value
  return "٤٦ : ٤٢";
};
