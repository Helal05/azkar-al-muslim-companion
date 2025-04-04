
type TranslationKey = 
  | 'appName'
  | 'prayerTimes'
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha'
  | 'midnight'
  | 'lastThird'
  | 'settings'
  | 'location'
  | 'notifications'
  | 'darkMode'
  | 'fontSize'
  | 'language'
  | 'share'
  | 'currentCity'
  | 'changeLocation'
  | 'calculationMethod'
  | 'currentMethod'
  | 'changeMethod'
  | 'enableNotifications'
  | 'reminderForAzkar'
  | 'soundEnabled'
  | 'playSoundOnTap'
  | 'vibrationEnabled'
  | 'enableVibration'
  | 'darkModeLabel'
  | 'changeAppearance'
  | 'morningAzkar'
  | 'eveningAzkar'
  | 'afterPrayerAzkar'
  | 'sleepAzkar'
  | 'wakeupAzkar'
  | 'quranDuas'
  | 'prophetDuas'
  | 'namesOfAllah'
  | 'quranRuqyah'
  | 'sunnahRuqyah'
  | 'tasbeeh'
  | 'more'
  | 'nextPrayer'
  | 'timeUntilNextPrayer'
  | 'prayerTime'
  | 'forbiddenPrayerTimes'
  | 'sunnahPrayers'
  | 'duhaPrayer'
  | 'islamicDate'
  | 'gregorianDate'
  | 'timeRemaining'
  | 'favorites'
  | 'azkar'
  | 'home'
  | 'qibla'
  | 'counter'
  | 'shareApp'
  | 'appLanguage'
  | 'additionalOptions'
  | 'helpAndSupport'
  | 'importantNotes'
  | 'nafilahProhibitedTimes'
  | 'search'
  | 'searchResults'
  | 'noResults'
  | 'monthlyPrayerTimes'
  | 'nightDuas'
  | 'adhanNotifications'
  | 'beforeAdhan'
  | 'atAdhan'
  | 'iqamah'
  | 'turnOffNotifications'
  | 'today'
  | 'locationUpdateSuccessful'
  | 'addedToFavorites'
  | 'removedFromFavorites';

export const translations: Record<"ar" | "en", Record<TranslationKey, string>> = {
  ar: {
    appName: "أذكاري",
    prayerTimes: "مواقيت الصلاة",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    midnight: "منتصف الليل",
    lastThird: "الثلث الأخير",
    settings: "الإعدادات",
    location: "الموقع",
    notifications: "الإشعارات",
    darkMode: "الوضع الداكن",
    fontSize: "حجم الخط",
    language: "اللغة",
    share: "مشاركة",
    currentCity: "المدينة الحالية",
    changeLocation: "تغيير الموقع",
    calculationMethod: "طريقة الحساب",
    currentMethod: "الطريقة الحالية",
    changeMethod: "تغيير الطريقة",
    enableNotifications: "تفعيل الإشعارات",
    reminderForAzkar: "تذكير بأوقات الأذكار",
    soundEnabled: "الصوت",
    playSoundOnTap: "تشغيل صوت عند الضغط",
    vibrationEnabled: "الاهتزاز",
    enableVibration: "تفعيل الاهتزاز عند الضغط",
    darkModeLabel: "الوضع الداكن",
    changeAppearance: "تغيير مظهر التطبيق",
    morningAzkar: "أذكار الصباح",
    eveningAzkar: "أذكار المساء",
    afterPrayerAzkar: "أذكار بعد الصلاة",
    sleepAzkar: "أذكار النوم",
    wakeupAzkar: "أذكار الاستيقاظ",
    quranDuas: "أدعية من القرآن",
    prophetDuas: "من دعاء الرسول ﷺ",
    namesOfAllah: "أسماء الله الحسنى",
    quranRuqyah: "الرقية بالقرآن",
    sunnahRuqyah: "الرقية بالسنة",
    tasbeeh: "تسابيح",
    more: "المزيد",
    nextPrayer: "الصلاة القادمة",
    timeUntilNextPrayer: "متبقي للصلاة",
    prayerTime: "وقت الصلاة",
    forbiddenPrayerTimes: "أوقات النهي عن الصلاة",
    sunnahPrayers: "السنن الرواتب",
    duhaPrayer: "صلاة الضحى",
    islamicDate: "التاريخ الهجري",
    gregorianDate: "التاريخ الميلادي",
    timeRemaining: "الوقت المتبقي",
    favorites: "المفضلة",
    azkar: "الأذكار",
    home: "الرئيسية",
    qibla: "القبلة",
    counter: "العداد",
    shareApp: "مشاركة التطبيق",
    appLanguage: "لغة التطبيق",
    additionalOptions: "خيارات إضافية",
    helpAndSupport: "المساعدة والدعم",
    importantNotes: "ملاحظات هامة",
    nafilahProhibitedTimes: "أوقات لا تجوز فيها صلاة النافلة",
    search: "البحث",
    searchResults: "نتائج البحث",
    noResults: "لا توجد نتائج",
    monthlyPrayerTimes: "جدول مواقيت الصلاة الشهري",
    nightDuas: "دعاء من تعار من الليل",
    adhanNotifications: "إشعارات الأذان",
    beforeAdhan: "قبل الأذان",
    atAdhan: "عند الأذان",
    iqamah: "عند الإقامة",
    turnOffNotifications: "إيقاف الإشعارات",
    today: "اليوم",
    locationUpdateSuccessful: "تم تحديث الموقع بنجاح",
    addedToFavorites: "تمت الإضافة للمفضلة",
    removedFromFavorites: "تمت الإزالة من المفضلة"
  },
  en: {
    appName: "Azkari",
    prayerTimes: "Prayer Times",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    midnight: "Midnight",
    lastThird: "Last Third",
    settings: "Settings",
    location: "Location",
    notifications: "Notifications",
    darkMode: "Dark Mode",
    fontSize: "Font Size",
    language: "Language",
    share: "Share",
    currentCity: "Current City",
    changeLocation: "Change Location",
    calculationMethod: "Calculation Method",
    currentMethod: "Current Method",
    changeMethod: "Change Method",
    enableNotifications: "Enable Notifications",
    reminderForAzkar: "Azkar Time Reminders",
    soundEnabled: "Sound",
    playSoundOnTap: "Play Sound On Tap",
    vibrationEnabled: "Vibration",
    enableVibration: "Enable Vibration On Tap",
    darkModeLabel: "Dark Mode",
    changeAppearance: "Change App Appearance",
    morningAzkar: "Morning Azkar",
    eveningAzkar: "Evening Azkar",
    afterPrayerAzkar: "After Prayer Azkar",
    sleepAzkar: "Sleep Azkar",
    wakeupAzkar: "Wake-up Azkar",
    quranDuas: "Duas from Quran",
    prophetDuas: "Prophet's Duas ﷺ",
    namesOfAllah: "Names of Allah",
    quranRuqyah: "Ruqyah from Quran",
    sunnahRuqyah: "Ruqyah from Sunnah",
    tasbeeh: "Tasbeeh",
    more: "More",
    nextPrayer: "Next Prayer",
    timeUntilNextPrayer: "Time Until Next Prayer",
    prayerTime: "Prayer Time",
    forbiddenPrayerTimes: "Forbidden Prayer Times",
    sunnahPrayers: "Sunnah Prayers",
    duhaPrayer: "Duha Prayer",
    islamicDate: "Hijri Date",
    gregorianDate: "Gregorian Date",
    timeRemaining: "Time Remaining",
    favorites: "Favorites",
    azkar: "Azkar",
    home: "Home",
    qibla: "Qibla",
    counter: "Counter",
    shareApp: "Share App",
    appLanguage: "App Language",
    additionalOptions: "Additional Options",
    helpAndSupport: "Help & Support",
    importantNotes: "Important Notes",
    nafilahProhibitedTimes: "Times When Nafilah Prayers Are Prohibited",
    search: "Search",
    searchResults: "Search Results",
    noResults: "No Results",
    monthlyPrayerTimes: "Monthly Prayer Times",
    nightDuas: "Night Duas",
    adhanNotifications: "Adhan Notifications",
    beforeAdhan: "Before Adhan",
    atAdhan: "At Adhan Time",
    iqamah: "At Iqamah Time",
    turnOffNotifications: "Turn Off Notifications",
    today: "Today",
    locationUpdateSuccessful: "Location updated successfully",
    addedToFavorites: "Added to favorites",
    removedFromFavorites: "Removed from favorites"
  }
};

// Helper function to get translation
export const getTranslation = (key: TranslationKey, language: "ar" | "en"): string => {
  return translations[language][key] || key;
};

// Hook to easily use translations with the current language
export const useTranslation = (language: "ar" | "en") => {
  return {
    t: (key: TranslationKey) => getTranslation(key, language)
  };
};
