
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Share } from "lucide-react";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useToast } from "@/hooks/use-toast";

interface Name {
  id: string;
  name: string;
  meaning: string;
  meaningEn: string;
}

const allahNames: Name[] = [
  { id: "name-1", name: "الله", meaning: "الله سبحانه وتعالى", meaningEn: "Allah, the Greatest Name" },
  { id: "name-2", name: "الرَّحْمَنُ", meaning: "الذي وسعت رحمته كل شيء", meaningEn: "The Most Compassionate" },
  { id: "name-3", name: "الرَّحِيمُ", meaning: "المنعم أبدا على عباده", meaningEn: "The Most Merciful" },
  { id: "name-4", name: "المَلِكُ", meaning: "المالك للملك كله", meaningEn: "The King, The Sovereign" },
  { id: "name-5", name: "القُدُّوسُ", meaning: "المنزه عن كل نقص", meaningEn: "The Holy One" },
  { id: "name-6", name: "السَّلَامُ", meaning: "الذي سلم من كل عيب ونقص", meaningEn: "The Source of Peace" },
  { id: "name-7", name: "المُؤْمِنُ", meaning: "الذي آمن أولياءه من عذابه", meaningEn: "The Granter of Security" },
  { id: "name-8", name: "المُهَيْمِنُ", meaning: "الرقيب الحافظ لكل شيء", meaningEn: "The Guardian" },
  { id: "name-9", name: "العَزِيزُ", meaning: "الذي لا يُغلب أبدا", meaningEn: "The Almighty" },
  { id: "name-10", name: "الجَبَّارُ", meaning: "القاهر لخلقه بعلو قدرته", meaningEn: "The Compeller" },
  { id: "name-11", name: "المُتَكَبِّرُ", meaning: "المتنزه عن صفات الخلق", meaningEn: "The Supreme" },
  { id: "name-12", name: "الخَالِقُ", meaning: "الموجد للأشياء من العدم", meaningEn: "The Creator" },
  { id: "name-13", name: "البَارِئُ", meaning: "خالق الخلق بلا مثال سابق", meaningEn: "The Evolver" },
  { id: "name-14", name: "المُصَوِّرُ", meaning: "المعطي للموجودات صورها وأشكالها", meaningEn: "The Fashioner" },
  { id: "name-15", name: "الغَفَّارُ", meaning: "الذي يغفر ذنوب عباده", meaningEn: "The All-Forgiving" },
  { id: "name-16", name: "القَهَّارُ", meaning: "القاهر الذي لا يعجزه شيء", meaningEn: "The Subduer" },
  { id: "name-17", name: "الوَهَّابُ", meaning: "المعطي بلا عوض", meaningEn: "The Bestower" },
  { id: "name-18", name: "الرَّزَّاقُ", meaning: "الذي يخلق الأرزاق ويعطيها", meaningEn: "The Provider" },
  { id: "name-19", name: "الفَتَّاحُ", meaning: "المسهل الميسر", meaningEn: "The Opener" },
  { id: "name-20", name: "العَلِيمُ", meaning: "الذي يعلم السر وأخفى", meaningEn: "The All-Knowing" },
  { id: "name-21", name: "القَابِضُ", meaning: "الذي يقبض الرزق والأرواح", meaningEn: "The Constrictor" },
  { id: "name-22", name: "البَاسِطُ", meaning: "الذي يبسط الرزق ويوسعه", meaningEn: "The Expander" },
  { id: "name-23", name: "الخَافِضُ", meaning: "الذي يخفض الظالمين", meaningEn: "The Abaser" },
  { id: "name-24", name: "الرَّافِعُ", meaning: "الذي يرفع المؤمنين", meaningEn: "The Exalter" },
  { id: "name-25", name: "المُعِزُّ", meaning: "الذي يعز من يشاء", meaningEn: "The Giver of Honor" },
  { id: "name-26", name: "المُذِلُّ", meaning: "الذي يذل من يشاء", meaningEn: "The Giver of Dishonor" },
  { id: "name-27", name: "السَّمِيعُ", meaning: "السامع لجميع الأصوات", meaningEn: "The All-Hearing" },
  { id: "name-28", name: "البَصِيرُ", meaning: "المبصر لجميع المرئيات", meaningEn: "The All-Seeing" },
  { id: "name-29", name: "الحَكَمُ", meaning: "الذي يحكم بين الخلق", meaningEn: "The Judge" },
  { id: "name-30", name: "العَدْلُ", meaning: "العادل في حكمه وقضائه", meaningEn: "The Just" },
  { id: "name-31", name: "اللَّطِيفُ", meaning: "البر الرفيق بعباده", meaningEn: "The Subtle One" },
  { id: "name-32", name: "الخَبِيرُ", meaning: "العالم بحقائق الأمور", meaningEn: "The All-Aware" },
  { id: "name-33", name: "الحَلِيمُ", meaning: "الذي لا يعاجل العصاة بالعقوبة", meaningEn: "The Forbearing" },
  { id: "name-34", name: "العَظِيمُ", meaning: "الذي جل عن الإدراك", meaningEn: "The Magnificent" },
  { id: "name-35", name: "الغَفُورُ", meaning: "الذي لا يتعاظمه ذنب أن يغفره", meaningEn: "The All-Forgiving" },
  { id: "name-36", name: "الشَّكُورُ", meaning: "الذي يثيب على العمل القليل بالأجر الكثير", meaningEn: "The Appreciative" },
  { id: "name-37", name: "العَلِيُّ", meaning: "العالي فوق جميع خلقه", meaningEn: "The Most High" },
  { id: "name-38", name: "الكَبِيرُ", meaning: "الكبير الذي لا أكبر منه", meaningEn: "The Most Great" },
  { id: "name-39", name: "الحَفِيظُ", meaning: "الذي يحفظ الأشياء عن العدم", meaningEn: "The Preserver" },
  { id: "name-40", name: "المُقِيتُ", meaning: "المقتدر على إيجاد قوت الخلق", meaningEn: "The Sustainer" },
  { id: "name-41", name: "الحَسِيبُ", meaning: "الكافي الذي منه كفاية العباد", meaningEn: "The Reckoner" },
  { id: "name-42", name: "الجَلِيلُ", meaning: "الموصوف بنعوت الإكرام", meaningEn: "The Majestic" },
  { id: "name-43", name: "الكَرِيمُ", meaning: "الكثير الخير الجواد المعطي", meaningEn: "The Generous" },
  { id: "name-44", name: "الرَّقِيبُ", meaning: "المطلع الذي لا يغيب عنه شيء", meaningEn: "The Watchful" },
  { id: "name-45", name: "المُجِيبُ", meaning: "الذي يجيب دعاء من دعاه", meaningEn: "The Responsive" },
  { id: "name-46", name: "الوَاسِعُ", meaning: "الذي وسع رزقه جميع خلقه", meaningEn: "The All-Encompassing" },
  { id: "name-47", name: "الحَكِيمُ", meaning: "الذي لا يدخل تدبيره خلل", meaningEn: "The Wise" },
  { id: "name-48", name: "الوَدُودُ", meaning: "المحب للصالحين", meaningEn: "The Most Loving" },
  { id: "name-49", name: "المَجِيدُ", meaning: "العظيم الذي جل عن صفات الخلق", meaningEn: "The Most Glorious" },
  { id: "name-50", name: "البَاعِثُ", meaning: "الذي يبعث الخلق يوم القيامة", meaningEn: "The Resurrector" },
  // Rest can be added similarly
];

const NamesOfAllah: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { toast } = useToast();
  const [selectedName, setSelectedName] = useState<Name | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem("allah-names-favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const isArabic = settings.language === "ar";
  
  const toggleFavorite = (nameId: string) => {
    let newFavorites;
    if (favorites.includes(nameId)) {
      newFavorites = favorites.filter(id => id !== nameId);
      toast({
        title: isArabic ? "تمت الإزالة من المفضلة" : "Removed from favorites",
        description: "",
      });
    } else {
      newFavorites = [...favorites, nameId];
      toast({
        title: isArabic ? "تمت الإضافة للمفضلة" : "Added to favorites",
        description: "",
      });
    }
    setFavorites(newFavorites);
    localStorage.setItem("allah-names-favorites", JSON.stringify(newFavorites));
  };
  
  const shareName = (name: Name) => {
    if (navigator.share) {
      navigator.share({
        title: isArabic ? "من أسماء الله الحسنى" : "Names of Allah",
        text: `${name.name} - ${isArabic ? name.meaning : name.meaningEn}`,
        url: window.location.href
      }).catch(err => console.error("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(`${name.name} - ${isArabic ? name.meaning : name.meaningEn}`).then(() => {
        toast({
          title: isArabic ? "تم النسخ" : "Copied to clipboard",
          description: isArabic 
            ? "تم نسخ الاسم إلى الحافظة"
            : "Name was copied to clipboard",
        });
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-arabic font-bold">
          {isArabic ? "أسماء الله الحسنى" : "Names of Allah"}
        </h2>
        <div className="w-5"></div>
      </div>
      
      {/* Names Grid */}
      <div className="flex-1 p-2 pb-20">
        <div className="grid grid-cols-3 gap-2">
          {allahNames.map((name) => (
            <div 
              key={name.id}
              className="bg-gray-800 rounded-lg aspect-square flex flex-col items-center justify-center p-2 relative"
              onClick={() => setSelectedName(name)}
            >
              <div className="font-arabic text-xl font-bold text-white">{name.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Name Detail Modal */}
      {selectedName && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-arabic font-bold text-white mb-4">{selectedName.name}</h2>
              <p className="text-gray-300 font-arabic">
                {isArabic ? selectedName.meaning : selectedName.meaningEn}
              </p>
            </div>
            
            <div className="flex justify-center space-x-6">
              <button 
                onClick={() => toggleFavorite(selectedName.id)}
                className="p-3 rounded-full bg-gray-800"
              >
                <Heart className={`h-6 w-6 ${favorites.includes(selectedName.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              
              <button 
                onClick={() => shareName(selectedName)}
                className="p-3 rounded-full bg-gray-800"
              >
                <Share className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setSelectedName(null)}
                className="px-5 py-2 bg-gray-800 text-white rounded-lg font-arabic"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesOfAllah;
