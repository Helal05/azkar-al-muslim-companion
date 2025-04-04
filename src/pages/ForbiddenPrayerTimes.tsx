
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, AlertCircle, Info } from "lucide-react";
import { getCurrentIslamicDate, getPrayerTimes, getForbiddenPrayerTimes } from "../data/prayerData";
import Header from "../components/Header";
import { useAppSettings } from "../contexts/AppSettingsContext";
import { useTranslation } from "../utils/translations";

const ForbiddenPrayerTimes = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const { t } = useTranslation(settings.language);
  
  const [islamicDate, setIslamicDate] = useState(getCurrentIslamicDate());
  const [prayerTimes, setPrayerTimes] = useState(getPrayerTimes(settings.location.latitude, settings.location.longitude));
  const [forbiddenTimes, setForbiddenTimes] = useState(getForbiddenPrayerTimes());
  
  // Update prayer times based on location
  useEffect(() => {
    setPrayerTimes(getPrayerTimes(settings.location.latitude, settings.location.longitude));
  }, [settings.location]);

  const getForbiddenTimesContent = () => {
    if (settings.language === "ar") {
      return {
        title: "أوقات لا تجوز فيها صلاة النافلة",
        description: "هناك ثلاثة أوقات نهى النبي ﷺ عن الصلاة فيها، ولا تُصَلَّى فيها إلا الفرائض والصلوات ذات السبب",
        notes: "ملاحظات هامة",
        notesList: [
          "الصلوات ذات السبب: هي الصلوات التي لها سبب يوجبها مثل صلاة الكسوف وتحية المسجد وسجود التلاوة.",
          "يجوز قضاء الفرائض الفائتة في هذه الأوقات.",
          "لا يجوز تأخير الفريضة حتى يدخل وقت النهي."
        ],
        hadithTitle: "من السنة النبوية",
        hadithText: "\"نهى رسول الله ﷺ أن نصلي فيهن أو أن نقبر فيهن موتانا: حين تطلع الشمس بازغة حتى ترتفع، وحين يقوم قائم الظهيرة حتى تزول الشمس، وحين تتضيف الشمس للغروب حتى تغرب\"",
        hadithSource: "رواه مسلم"
      };
    } else {
      return {
        title: "Times When Voluntary Prayers Are Prohibited",
        description: "There are three times when the Prophet ﷺ prohibited prayer, and no voluntary prayers should be performed during these times except obligatory prayers and prayers with specific reasons.",
        notes: "Important Notes",
        notesList: [
          "Prayers with specific reasons include: eclipse prayer, greeting the mosque (Tahiyyatul Masjid), and prostration of recitation.",
          "It is permissible to make up missed obligatory prayers during these times.",
          "It is not permissible to delay obligatory prayers until these forbidden times."
        ],
        hadithTitle: "From the Prophetic Sunnah",
        hadithText: "\"The Prophet ﷺ prohibited us from praying or burying our dead during three times: when the sun is rising until it has fully risen, when the sun is at its zenith until it passes the meridian, and when the sun begins to set until it has completely set.\"",
        hadithSource: "Narrated by Muslim"
      };
    }
  };
  
  const content = getForbiddenTimesContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="relative py-4 border-b border-white/10">
        <button 
          onClick={() => navigate("/prayer-times")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <ChevronLeft className="h-6 w-6 text-white/80" />
        </button>
        <h1 className="text-xl font-bold text-center font-arabic text-amber-400">{t('forbiddenPrayerTimes')}</h1>
      </div>
      
      {/* Islamic Date Display */}
      <div className="bg-slate-800/50 border-b border-white/10 p-3">
        <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse">
          <div className="text-center">
            <p className="text-white font-arabic">
              {islamicDate.day} {islamicDate.month} {islamicDate.year}هـ
            </p>
            <p className="text-white/50 text-xs">{islamicDate.gregorianDate}</p>
          </div>
        </div>
      </div>
      
      {/* Forbidden Prayer Times */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-arabic font-bold text-red-400">{content.title}</h3>
          </div>
          
          <p className="text-center text-sm text-white/70 mb-8 font-arabic leading-relaxed">
            {content.description}
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {forbiddenTimes.map((time, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="bg-gradient-to-r from-slate-800/90 to-slate-800/50 backdrop-blur-sm border border-red-800/30 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-red-400 mt-1 ml-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-arabic text-lg text-red-400">
                      {settings.language === "ar" ? time.description : time.descriptionEn || time.description}
                    </h4>
                    <p className="text-sm text-white/70 font-arabic mt-1">
                      {settings.language === "ar" ? time.timeRange : time.timeRangeEn || time.timeRange}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-4"
          >
            <h3 className="flex items-center font-arabic font-bold text-amber-400 mb-3">
              <Info className="w-4 h-4 ml-1.5" />
              {content.notes}
            </h3>
            <ul className="text-sm text-white/70 font-arabic space-y-2 pr-5 rtl:pr-5 rtl:pl-0 list-disc list-inside">
              {content.notesList.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </motion.div>
          
          {/* Hadith Source */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-slate-800/40 to-slate-800/20 backdrop-blur-sm rounded-lg p-4 border-r-4 border-green-700"
          >
            <h3 className="text-center font-arabic font-bold text-green-400 mb-3">{content.hadithTitle}</h3>
            <div className="text-sm text-white/80 font-arabic text-right">
              <p className="mb-2 leading-relaxed">{content.hadithText}</p>
              <p className="text-xs text-white/50 mt-1">{content.hadithSource}</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-slate-900/90 text-white py-2.5 flex justify-around border-t border-white/10 backdrop-blur-md">
        <button 
          onClick={() => navigate("/more")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">{settings.language === "ar" ? "المزيد" : "More"}</span>
        </button>
        <button 
          onClick={() => navigate("/favorites")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">{settings.language === "ar" ? "المفضلة" : "Favorites"}</span>
        </button>
        <button 
          onClick={() => navigate("/qibla")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">{settings.language === "ar" ? "القبلة" : "Qibla"}</span>
        </button>
        <button 
          onClick={() => navigate("/prayer-times")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-amber-400 font-arabic">{settings.language === "ar" ? "الصلاة" : "Prayer"}</span>
        </button>
        <button 
          onClick={() => navigate("/tasbih")}
          className="flex flex-col items-center text-xs"
        >
          <span className="text-gray-400 font-arabic">{settings.language === "ar" ? "العداد" : "Counter"}</span>
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPrayerTimes;
