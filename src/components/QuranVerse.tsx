
import { useState, useEffect } from "react";
import { quranVerses, islamicBackgrounds } from "../data/quranVerses";

const QuranVerse = () => {
  const [currentVerse, setCurrentVerse] = useState(0);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  useEffect(() => {
    const verseInterval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % quranVerses.length);
    }, 30000);

    const bgInterval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % islamicBackgrounds.length);
    }, 60000);

    return () => {
      clearInterval(verseInterval);
      clearInterval(bgInterval);
    };
  }, []);

  return (
    <div 
      className="relative w-full h-[200px] md:h-[250px] text-white py-6 px-4 overflow-hidden rounded-xl"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${islamicBackgrounds[backgroundIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div 
        className="absolute inset-0 opacity-15" 
        style={{
          backgroundImage: "url('/patterns/islamic-pattern.svg')",
          backgroundSize: '300px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <p className="text-white text-xl md:text-2xl font-arabic font-bold text-center leading-relaxed mb-4 animate-fade-in">
          {quranVerses[currentVerse].verse}
        </p>
        <p className="text-white/70 text-sm text-center mt-2 font-arabic animate-fade-in">
          {quranVerses[currentVerse].surah}
        </p>
      </div>
    </div>
  );
};

export default QuranVerse;
