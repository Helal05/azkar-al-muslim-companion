export interface Dua {
  title: string;
  arabic: string;
  translation: string;
  source: string;
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
        title: "دعاء الصباح 1",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        translation: "We have entered a new day and with it all dominion belongs to Allah.",
        source: "صحيح البخاري"
      },
      {
        title: "دعاء الصباح 2",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
        translation: "O Allah, by Your grace we have entered a new day, and by Your grace we enter the evening.",
        source: "سنن الترمذي"
      }
    ]
  },
  {
    id: "evening",
    name: "أذكار المساء",
    backgroundColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    duas: [
      {
        title: "دعاء المساء 1",
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
        translation: "We have entered the evening and with it all dominion belongs to Allah.",
        source: "صحيح البخاري"
      },
      {
        title: "دعاء المساء 2",
        arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ",
        translation: "O Allah, whatever blessing I have this evening.",
        source: "سنن أبي داود"
      }
    ]
  },
  {
    id: "beforeSleep",
    name: "أذكار قبل النوم",
    backgroundColor: "bg-gradient-to-br from-purple-500 to-purple-700",
    duas: [
      {
        title: "دعاء قبل النوم 1",
        arabic: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي",
        translation: "In Your name, my Lord, I lie down.",
        source: "صحيح البخاري"
      },
      {
        title: "دعاء قبل النوم 2",
        arabic: "اللَّهُمَّ إِنِّي أَسْلَمْتُ نَفْسِي إِلَيْكَ",
        translation: "O Allah, I have submitted myself to You.",
        source: "صحيح البخاري"
      }
    ]
  },
  {
    id: "afterPrayer",
    name: "أذكار بعد الصلاة",
    backgroundColor: "bg-gradient-to-br from-green-500 to-green-700",
    duas: [
      {
        title: "دعاء بعد الصلاة 1",
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        translation: "I seek forgiveness from Allah.",
        source: "صحيح مسلم"
      },
      {
        title: "دعاء بعد الصلاة 2",
        arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ",
        translation: "O Allah, You are Peace.",
        source: "صحيح مسلم"
      }
    ]
  },
  {
    id: "general",
    name: "أدعية عامة",
    backgroundColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    duas: [
      {
        title: "دعاء عام 1",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً",
        translation: "Our Lord, give us good in this world.",
        source: "سورة البقرة"
      },
      {
        title: "دعاء عام 2",
        arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا",
        translation: "Our Lord, do not take us to task if we forget.",
        source: "سورة البقرة"
      }
    ]
  },
  {
    id: "forForgiveness",
    name: "أدعية طلب المغفرة",
    backgroundColor: "bg-gradient-to-br from-gray-500 to-gray-700",
    duas: [
      {
        title: "دعاء طلب المغفرة 1",
        arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ",
        translation: "My Lord, forgive me and my parents.",
        source: "سورة نوح"
      },
      {
        title: "دعاء طلب المغفرة 2",
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ",
        translation: "O Allah, You are forgiving and love forgiveness.",
        source: "سنن الترمذي"
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
