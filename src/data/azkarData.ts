
export interface AzkarItem {
  id: number;
  category: string;
  text: string;
  count: number;
  reference?: string;
  transliteration?: string;
  translation?: string;
}

export interface AzkarCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color?: string;
}

export const azkarCategories: AzkarCategory[] = [
  {
    id: "morning",
    name: "أذكار الصباح",
    icon: "🕊️",
    description: "الأذكار التي تقال في الصباح",
    color: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "evening",
    name: "أذكار المساء",
    icon: "🌙",
    description: "الأذكار التي تقال في المساء",
    color: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    id: "prayer",
    name: "أذكار بعد الصلاة",
    icon: "🙏",
    description: "الأذكار التي تقال بعد الصلاة",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: "sleep",
    name: "أذكار النوم",
    icon: "🛌",
    description: "الأذكار التي تقال قبل النوم",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "travel",
    name: "أذكار السفر",
    icon: "✈️",
    description: "الأذكار التي تقال أثناء السفر",
    color: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    id: "tasbih",
    name: "المسبحة الإلكترونية",
    icon: "🧿",
    description: "مسبحة إلكترونية للتسبيح والذكر",
    color: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    id: "qibla",
    name: "القبلة",
    icon: "🧭",
    description: "تحديد اتجاه القبلة",
    color: "bg-rose-100 dark:bg-rose-900/30",
  }
];

export const azkarItems: AzkarItem[] = [
  // أذكار الصباح
  {
    id: 1,
    category: "morning",
    text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    count: 1,
    reference: "رواه أبو داود",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner, to Him belongs all sovereignty and praise and He is capable of all things."
  },
  {
    id: 2,
    category: "morning",
    text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
    count: 1,
    reference: "رواه الترمذي",
    translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection."
  },
  {
    id: 3,
    category: "morning",
    text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ، وَقَهْرِ الرِّجَالِ.",
    count: 1,
    reference: "رواه البخاري",
    translation: "O Allah, I seek refuge in You from grief and sadness, from weakness and from laziness, from miserliness and from cowardice, from being overcome by debt and overpowered by men."
  },

  // أذكار المساء
  {
    id: 4,
    category: "evening",
    text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
    count: 1,
    reference: "رواه أبو داود"
  },
  {
    id: 5,
    category: "evening",
    text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
    count: 1,
    reference: "رواه الترمذي"
  },
  {
    id: 6,
    category: "evening",
    text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
    count: 1,
    reference: "رواه البخاري"
  },

  // أذكار بعد الصلاة
  {
    id: 7,
    category: "prayer",
    text: "أَسْتَغْفِرُ اللهَ (ثلاثاً) اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
    count: 1,
    reference: "رواه مسلم"
  },
  {
    id: 8,
    category: "prayer",
    text: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.",
    count: 1,
    reference: "متفق عليه"
  },
  {
    id: 9,
    category: "prayer",
    text: "سُبْحَانَ اللهِ",
    count: 33,
    reference: ""
  },
  {
    id: 10,
    category: "prayer",
    text: "الْحَمْدُ لِلَّهِ",
    count: 33,
    reference: ""
  },
  {
    id: 11,
    category: "prayer",
    text: "اللهُ أَكْبَرُ",
    count: 33,
    reference: ""
  },

  // أذكار النوم
  {
    id: 12,
    category: "sleep",
    text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
    count: 1,
    reference: "رواه البخاري"
  },
  {
    id: 13,
    category: "sleep",
    text: "اللَّهُمَّ إِنِّي أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.",
    count: 1,
    reference: "متفق عليه"
  },

  // أذكار السفر
  {
    id: 14,
    category: "travel",
    text: "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ.",
    count: 1,
    reference: "رواه مسلم"
  },

  // تسبيحات للمسبحة
  {
    id: 15,
    category: "tasbih",
    text: "سُبْحَانَ اللهِ",
    count: 33,
    reference: ""
  },
  {
    id: 16,
    category: "tasbih",
    text: "الْحَمْدُ لِلَّهِ",
    count: 33,
    reference: ""
  },
  {
    id: 17,
    category: "tasbih",
    text: "اللهُ أَكْبَرُ",
    count: 33,
    reference: ""
  },
  {
    id: 18,
    category: "tasbih",
    text: "لا إِلَٰهَ إِلَّا اللهُ",
    count: 100,
    reference: ""
  }
];
