
import React, { useState } from "react";
import { Heart } from "lucide-react";

const allahNames = [
  { id: "1", name: "الله", meaning: "الله سبحانه وتعالى", meaningEn: "Allah, the Greatest Name" },
  { id: "2", name: "الرَّحْمَنُ", meaning: "الذي وسعت رحمته كل شيء", meaningEn: "The Most Compassionate" },
  { id: "3", name: "الرَّحِيمُ", meaning: "المنعم أبدا على عباده", meaningEn: "The Most Merciful" },
  { id: "4", name: "المَلِكُ", meaning: "المالك للملك كله", meaningEn: "The King, The Sovereign" },
  { id: "5", name: "القُدُّوسُ", meaning: "المنزه عن كل نقص", meaningEn: "The Holy One" },
  { id: "6", name: "السَّلَامُ", meaning: "الذي سلم من كل عيب ونقص", meaningEn: "The Source of Peace" },
  { id: "7", name: "المُؤْمِنُ", meaning: "الذي آمن أولياءه من عذابه", meaningEn: "The Granter of Security" },
  // ... أكمل الأسماء كما تحب
];

const NamesOfAllah = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== "undefined") {
      const fav = localStorage.getItem("allah-names-favorites") || "[]";
      return JSON.parse(fav);
    }
    return [];
  });

  const isArabic = true; // أو حسب اختيارك للغة

  const toggleFavorite = (id: string) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter((fid: string) => fid !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    if (typeof window !== "undefined") {
      localStorage.setItem("allah-names-favorites", JSON.stringify(newFavs));
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[url('/patterns/islamic-pattern.svg')] bg-cover bg-fixed text-white flex flex-col items-center">
      {/* العنوان */}
      <header className="w-full text-center pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-arabic font-bold text-islamic-green shadow-lg">
          أسماء الله الحسنى
        </h1>
        <p className="text-gray-300 mt-2 text-lg tracking-wide">تدبر وتعرف على الأسماء المباركة</p>
      </header>

      {/* الساحة الرئيسية للأسماء */}
      <div className="flex-1 w-full max-w-2xl px-2 md:px-10 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allahNames.map((n) => (
            <div
              key={n.id}
              className="relative group rounded-xl p-4 bg-gradient-to-br from-islamic-green/10 to-black/50 border border-islamic-green/30 hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setSelectedName(n)}
            >
              {/* أيقونة المفضلة */}
              <button
                className="absolute top-2 left-2 z-10"
                onClick={e => {
                  e.stopPropagation();
                  toggleFavorite(n.id);
                }}
              >
                <Heart
                  className={`w-6 h-6 transition-colors duration-200 ${favorites.includes(n.id) ?
                    "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
              {/* الإسم */}
              <div className="font-arabic text-2xl md:text-3xl text-center text-white drop-shadow-lg">
                {n.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة التفاصيل */}
      {selectedName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
          <div className="bg-gradient-to-br from-black/90 via-islamic-green/20 to-gray-900/90 rounded-2xl shadow-2xl p-8 max-w-md w-full relative text-center">
            <button
              className="absolute top-4 right-4 bg-gray-800/40 rounded-full p-1 text-white"
              onClick={() => setSelectedName(null)}
              aria-label="اغلاق"
            >✕</button>
            <div className="text-4xl font-arabic font-bold mt-2 mb-4 text-islamic-green">
              {selectedName.name}
            </div>
            <div className="text-lg font-arabic text-gray-200 mb-1">{selectedName.meaning}</div>
            <div className="italic text-sm text-gray-400 mb-1">{selectedName.meaningEn}</div>
            <button
              className="mt-6 px-6 py-2 bg-islamic-green/80 hover:bg-islamic-green text-white rounded-lg font-arabic shadow"
              onClick={() => setSelectedName(null)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* تأثير زخرفة أسفل الصفحة */}
      <div className="w-full h-24 bg-gradient-to-t from-black via-transparent pointer-events-none"></div>
    </div>
  );
};

export default NamesOfAllah;
