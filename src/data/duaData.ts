
export interface Dua {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  source: string;
  reference?: string;
  virtue?: string;
  times?: number;
}

export interface DuaCategory {
  id: string;
  name: string;
  backgroundColor: string;
  duas: Dua[];
}

export const duaCategories: DuaCategory[] = [
  {
    id: "morning",
    name: "أذكار الصباح",
    backgroundColor: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    duas: [
      {
        id: "morning-1",
        title: "دعاء الصباح 1",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        translation: "We have entered a new day and with it all dominion belongs to Allah.",
        source: "صحيح البخاري",
        reference: "رواه البخاري",
        virtue: "من قالها حين يصبح أو حين يمسي كتب له أجر من قالها من أمته"
      },
      {
        id: "morning-2",
        title: "دعاء الصباح 2",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
        translation: "O Allah, by Your grace we have entered a new day, and by Your grace we enter the evening.",
        source: "سنن الترمذي",
        reference: "رواه الترمذي",
        times: 1
      }
    ]
  },
  {
    id: "evening",
    name: "أذكار المساء",
    backgroundColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    duas: [
      {
        id: "evening-1",
        title: "دعاء المساء 1",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
        translation: "We have entered the evening and with it all dominion belongs to Allah.",
        source: "صحيح البخاري",
        reference: "رواه البخاري",
        times: 1
      },
      {
        id: "evening-2",
        title: "دعاء المساء 2",
        arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ",
        translation: "O Allah, whatever blessing I have this evening.",
        source: "سنن أبي داود",
        reference: "رواه أبو داود",
        times: 3
      }
    ]
  },
  {
    id: "beforeSleep",
    name: "أذكار قبل النوم",
    backgroundColor: "bg-gradient-to-br from-purple-500 to-purple-700",
    duas: [
      {
        id: "sleep-1",
        title: "دعاء قبل النوم 1",
        arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي",
        translation: "In Your name, my Lord, I lie down.",
        source: "صحيح البخاري",
        reference: "رواه البخاري"
      },
      {
        id: "sleep-2",
        title: "دعاء قبل النوم 2",
        arabic: "اللَّهُمَّ إِنِّي أَسْلَمْتُ نَفْسِي إِلَيْكَ",
        translation: "O Allah, I have submitted myself to You.",
        source: "صحيح البخاري",
        reference: "رواه البخاري"
      }
    ]
  },
  {
    id: "afterPrayer",
    name: "أذكار بعد الصلاة",
    backgroundColor: "bg-gradient-to-br from-green-500 to-green-700",
    duas: [
      {
        id: "prayer-1",
        title: "دعاء بعد الصلاة 1",
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        translation: "I seek forgiveness from Allah.",
        source: "صحيح مسلم",
        reference: "رواه مسلم",
        times: 3
      },
      {
        id: "prayer-2",
        title: "دعاء بعد الصلاة 2",
        arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ",
        translation: "O Allah, You are Peace.",
        source: "صحيح مسلم",
        reference: "رواه مسلم"
      }
    ]
  },
  {
    id: "general",
    name: "أدعية عامة",
    backgroundColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    duas: [
      {
        id: "general-1",
        title: "دعاء عام 1",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
        translation: "Our Lord, give us good in this world.",
        source: "سورة البقرة",
        reference: "سورة البقرة: 201"
      },
      {
        id: "general-2",
        title: "دعاء عام 2",
        arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا",
        translation: "Our Lord, do not take us to task if we forget.",
        source: "سورة البقرة",
        reference: "سورة البقرة: 286"
      }
    ]
  },
  {
    id: "forForgiveness",
    name: "أدعية طلب المغفرة",
    backgroundColor: "bg-gradient-to-br from-gray-500 to-gray-700",
    duas: [
      {
        id: "forgive-1",
        title: "دعاء طلب المغفرة 1",
        arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ",
        translation: "My Lord, forgive me and my parents.",
        source: "سورة نوح",
        reference: "سورة نوح: 28"
      },
      {
        id: "forgive-2",
        title: "دعاء طلب المغفرة 2",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ",
        translation: "O Allah, You are forgiving and love forgiveness.",
        source: "سنن الترمذي",
        reference: "رواه الترمذي"
      }
    ]
  }
];

// Add natural background images
export const naturalBackgrounds = [
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80",
];

// Add more Quranic verses
export const quranVerses = [
  {
    verse: "إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
    surah: "الحجرات",
    ayah: 13
  },
  {
    verse: "وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ",
    surah: "البقرة",
    ayah: 216
  },
  {
    verse: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    surah: "هود",
    ayah: 88
  },
  {
    verse: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    surah: "البقرة",
    ayah: 153
  },
  {
    verse: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
    surah: "ق",
    ayah: 16
  },
  {
    verse: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ",
    surah: "الإخلاص",
    ayah: "1-2"
  },
  {
    verse: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
    surah: "البقرة",
    ayah: 163
  },
  {
    verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    surah: "الشرح",
    ayah: 6
  },
  {
    verse: "وَإِنْ تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا",
    surah: "إبراهيم",
    ayah: 34
  },
  {
    verse: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    surah: "الطلاق",
    ayah: 3
  }
];

// Adding the missing duha data
export const duha = {
  time: "من ارتفاع الشمس قدر رمح (بعد شروق الشمس بربع ساعة تقريبًا) إلى قبل الزوال (قبل أذان الظهر بربع ساعة)",
  rakaat: "أقلها ركعتان، وأكثرها ثمان ركعات، والأفضل أربع ركعات",
  virtue: "صلاة الضحى من أعظم النوافل وأجلها، وفيها أجر عظيم لمن داوم عليها"
};

// Adding the missing rawathib data
export const rawathib = [
  {
    prayer: "الفجر",
    before: 2,
    after: 0,
    description: "ركعتا الفجر من أهم السنن الرواتب، وكان النبي ﷺ لا يدعهما سفراً ولا حضراً"
  },
  {
    prayer: "الظهر",
    before: 4,
    after: 2,
    description: "أربع ركعات قبل الظهر وركعتان بعدها من السنن المؤكدة"
  },
  {
    prayer: "العصر",
    before: 2,
    after: 0,
    description: "ركعتان قبل العصر سنة غير مؤكدة"
  },
  {
    prayer: "المغرب",
    before: 0,
    after: 2,
    description: "ركعتان بعد المغرب من السنن المؤكدة"
  },
  {
    prayer: "العشاء",
    before: 0,
    after: 2,
    description: "ركعتان بعد العشاء من السنن المؤكدة"
  }
];
