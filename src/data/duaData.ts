
export interface DuaCategory {
  id: string;
  name: string;
  backgroundColor: string;
  duas: Dua[];
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  translation?: string;
  transliteration?: string;
  reference: string;
  virtue?: string;
  times?: number;
}

export const duaCategories: DuaCategory[] = [
  {
    id: "sick",
    name: "من أتى مريضًا",
    backgroundColor: "bg-green-200",
    duas: [
      {
        id: "sick-visit",
        title: "دعاء من أتى مريضًا",
        arabic: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ البَاسَ، اشْفِ أَنْتَ الشَّافِي، لا شِفَاءَ إِلا شِفَاؤُكَ، شِفَاءً لا يُغَادِرُ سَقَمًا",
        reference: "رواه البخاري",
        times: 7
      }
    ]
  },
  {
    id: "sick-prayer",
    name: "الدعاء للمريض في عيادته",
    backgroundColor: "bg-blue-200",
    duas: [
      {
        id: "sick-prayer-1",
        title: "الدعاء للمريض",
        arabic: "لا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
        reference: "رواه البخاري",
        virtue: "دعاء الرسول صلى الله عليه وسلم للمريض"
      }
    ]
  },
  {
    id: "marriage",
    name: "الدعاء للمتزوج",
    backgroundColor: "bg-gray-200",
    duas: [
      {
        id: "marriage-1",
        title: "الدعاء للمتزوج",
        arabic: "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُما فِي خَيْرٍ",
        reference: "رواه أبو داود والترمذي",
        virtue: "دعاء النبي صلى الله عليه وسلم للمتزوج"
      }
    ]
  },
  {
    id: "new-wife",
    name: "دعاء المتزوج وشراء الدابة",
    backgroundColor: "bg-amber-200",
    duas: [
      {
        id: "new-wife-1",
        title: "دعاء الدخول بالزوجة",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا، وَخَيْرَ مَا جَبَلْتَهَا عَلَيْهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا، وَشَرِّ مَا جَبَلْتَهَا عَلَيْهِ",
        reference: "رواه أبو داود وابن ماجه",
        virtue: "دعاء النبي صلى الله عليه وسلم"
      }
    ]
  },
  {
    id: "children",
    name: "مايعوذ به الأولاد",
    backgroundColor: "bg-pink-200",
    duas: [
      {
        id: "children-protection",
        title: "تعويذ الأطفال",
        arabic: "أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
        reference: "رواه البخاري",
        virtue: "كان إبراهيم يعوذ بها إسماعيل وإسحاق"
      }
    ]
  },
  {
    id: "before-intercourse",
    name: "الدعاء قبل الجماع",
    backgroundColor: "bg-amber-200",
    duas: [
      {
        id: "intercourse-1",
        title: "دعاء الجماع",
        arabic: "بِسْمِ اللَّهِ، اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ، وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا",
        reference: "متفق عليه",
        virtue: "إذا أراد أحدكم أن يأتي أهله فقال... فقضي بينهما ولد لم يضره الشيطان أبداً"
      }
    ]
  },
  {
    id: "love-in-allah",
    name: "الدعاء لمن قال إني أحبك في الله",
    backgroundColor: "bg-sky-200",
    duas: [
      {
        id: "love-in-allah-1",
        title: "الرد على من قال أحبك في الله",
        arabic: "أَحَبَّكَ الَّذِي أَحْبَبْتَنِي لَهُ",
        reference: "رواه أبو داود بإسناد صحيح",
        virtue: "دعاء النبي صلى الله عليه وسلم"
      }
    ]
  },
  // Many more categories would be here
  {
    id: "riding",
    name: "دعاء الركوب (السيارة و ما نحوه)",
    backgroundColor: "bg-blue-200",
    duas: [
      {
        id: "riding-1",
        title: "دعاء ركوب السيارة ونحوها",
        arabic: "بِسْمِ اللَّهِ، الْحَمْدُ لِلَّهِ ﴿سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ * وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ﴾ الْحَمْدُ لِلَّهِ، الْحَمْدُ لِلَّهِ، الْحَمْدُ لِلَّهِ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَكَ اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي، فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
        reference: "رواه أبو داود والترمذي",
        virtue: "دعاء النبي صلى الله عليه وسلم عند السفر"
      }
    ]
  },
  {
    id: "difficulty",
    name: "دعاء من استصعب عليه أمر",
    backgroundColor: "bg-purple-200",
    duas: [
      {
        id: "difficulty-1",
        title: "عند مواجهة الصعوبات",
        arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
        reference: "رواه ابن حبان في صحيحه",
        virtue: "دعاء النبي صلى الله عليه وسلم"
      }
    ]
  }
];

export const quranVerses = [
  {
    verse: "إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
    surah: "الحجرات",
    ayah: 13
  },
  {
    verse: "وَرَبُّكَ يَخْلُقُ مَا يَشَاءُ وَيَخْتَارُ",
    surah: "القصص",
    ayah: 68
  },
  {
    verse: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
    surah: "هود",
    ayah: 88
  },
  {
    verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    surah: "الشرح",
    ayah: 6
  },
  {
    verse: "وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ",
    surah: "يوسف",
    ayah: 21
  }
];

export const nightPrayerDuas = [
  {
    id: "night-1",
    arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ...",
    reference: "رواه البخاري",
    virtue: "دعاء النبي صلى الله عليه وسلم إذا قام من الليل"
  },
  {
    id: "night-2",
    arabic: "اللَّهُمَّ رَبَّنَا لَكَ الْحَمْدُ أَنْتَ نُورُ السَّمَوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ...",
    reference: "رواه مسلم",
    virtue: "دعاء من تعار من الليل"
  }
];

export const naturalBackgrounds = [
  "/lovable-uploads/812d900a-534c-4796-b570-e999efe94886.png",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
];

export const rawathib = [
  {
    prayer: "الفجر",
    before: 2,
    after: 0,
    description: "ركعتان خفيفتان قبل الفريضة"
  },
  {
    prayer: "الظهر",
    before: 4,
    after: 2,
    description: "أربع ركعات قبل الفريضة وركعتان بعدها"
  },
  {
    prayer: "العصر",
    before: 2,
    after: 0,
    description: "ركعتان قبل الفريضة (غير مؤكدة)"
  },
  {
    prayer: "المغرب",
    before: 0,
    after: 2,
    description: "ركعتان بعد الفريضة"
  },
  {
    prayer: "العشاء",
    before: 0,
    after: 2,
    description: "ركعتان بعد الفريضة"
  }
];

export const duha = {
  time: "من ارتفاع الشمس قدر رمح إلى قبيل الزوال",
  rakaat: "من ركعتين إلى ثمان ركعات أو اثنتي عشرة ركعة",
  virtue: "يكتب له أجر صدقة على كل سلامى من جسده، وهي تعدل حجة وعمرة"
};
