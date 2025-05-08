
import { useState } from "react";

// Define the props interface
interface BackgroundSelectorProps {
  onSelectBackground: (type: string, background?: string, audio?: string) => void;
}

const BackgroundSelector = ({ onSelectBackground }: BackgroundSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Define paths for different types of backgrounds
  const staticBackgrounds = [
    '/lovable-uploads/535c9719-e788-4611-b107-2fc49f2c0c56.png',
    '/lovable-uploads/0692a86f-15d8-46bf-85d7-0fc97ce3484f.png', 
    '/lovable-uploads/816ad513-366d-47f4-95c1-ea09c455455a.png',
    '/lovable-uploads/8d9c3859-03c6-4c4b-b686-71b0fb127cbf.png',
    '/lovable-uploads/4b64305b-bc2c-4b8c-bb49-48364dfb6636.png'
  ];

  // Paths for animated backgrounds and audio
  // You'll need to add these files to your project
  const animatedBackgrounds = [
    {
      path: '/backgrounds/animated1.gif', // This is a placeholder path
      audioPath: '/sounds/nature1.mp3' // This is a placeholder path
    },
    {
      path: '/backgrounds/animated2.gif', // This is a placeholder path
      audioPath: '/sounds/nature2.mp3' // This is a placeholder path
    }
  ];

  return (
    <div className="flex flex-col">
      <p className="font-arabic text-center text-sm mb-4">
        اختر خلفية الأذكار المنوعة. عند اختيارك للخلفية الثابتة يمكنك تغييرها بتحريك أصابعك على الشاشة من فوق لتحت أو العكس
      </p>
      
      {/* Options */}
      <div className="space-y-2">
        <button
          onClick={() => setSelectedOption('animated-with-sound')}
          className={`w-full p-3 font-arabic text-right rounded-md transition ${
            selectedOption === 'animated-with-sound' 
              ? 'bg-indigo-900 border border-indigo-500' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          خلفية متحركة مع صوت
        </button>
        
        <button
          onClick={() => setSelectedOption('animated-without-sound')}
          className={`w-full p-3 font-arabic text-right rounded-md transition ${
            selectedOption === 'animated-without-sound' 
              ? 'bg-indigo-900 border border-indigo-500' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          خلفية متحركة بدون صوت
        </button>
        
        <button
          onClick={() => setSelectedOption('static-image')}
          className={`w-full p-3 font-arabic text-right rounded-md transition ${
            selectedOption === 'static-image' 
              ? 'bg-indigo-900 border border-indigo-500' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          خلفية صور
        </button>
        
        <button
          onClick={() => setSelectedOption('prayer-times')}
          className={`w-full p-3 font-arabic text-right rounded-md transition ${
            selectedOption === 'prayer-times' 
              ? 'bg-indigo-900 border border-indigo-500' 
              : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          خلفية مواقيت الصلاة
        </button>
      </div>
      
      {/* Show static background selection if that option is selected */}
      {selectedOption === 'static-image' && (
        <div className="mt-4">
          <h3 className="font-arabic mb-2 text-center">اختر صورة خلفية</h3>
          <div className="grid grid-cols-2 gap-2">
            {staticBackgrounds.map((bg, index) => (
              <button
                key={index}
                onClick={() => onSelectBackground('image', bg)}
                className="bg-gray-800 rounded-md overflow-hidden h-24 border border-gray-700 hover:border-indigo-500 transition"
              >
                <img 
                  src={bg} 
                  alt={`خلفية ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Show animated background selection if that option is selected */}
      {(selectedOption === 'animated-with-sound' || selectedOption === 'animated-without-sound') && (
        <div className="mt-4 text-center font-arabic">
          <p className="text-amber-300 mb-2">المسارات المطلوبة للخلفيات المتحركة:</p>
          <div className="bg-gray-800 p-3 rounded-md mb-4">
            <p>أضف ملفات الخلفية المتحركة إلى:</p>
            <p className="text-indigo-400">/public/backgrounds/</p>
            
            {selectedOption === 'animated-with-sound' && (
              <>
                <p className="mt-2">أضف ملفات الصوت إلى:</p>
                <p className="text-indigo-400">/public/sounds/</p>
              </>
            )}
          </div>
          
          <p className="mb-2">لاختبار الوظيفة يمكنك استخدام هذه الخلفية المؤقتة:</p>
          <button
            onClick={() => {
              if (selectedOption === 'animated-with-sound') {
                onSelectBackground(
                  'animated-with-sound', 
                  '/lovable-uploads/535c9719-e788-4611-b107-2fc49f2c0c56.png',
                  '/sounds/nature.mp3'
                );
              } else {
                onSelectBackground(
                  'animated-without-sound', 
                  '/lovable-uploads/535c9719-e788-4611-b107-2fc49f2c0c56.png'
                );
              }
            }}
            className="bg-indigo-700 py-2 px-4 rounded-md hover:bg-indigo-600 transition"
          >
            {selectedOption === 'animated-with-sound' ? 'طبق خلفية مؤقتة مع صوت' : 'طبق خلفية مؤقتة بدون صوت'}
          </button>
        </div>
      )}
      
      {selectedOption === 'prayer-times' && (
        <div className="mt-4 text-center font-arabic">
          <button
            onClick={() => onSelectBackground('prayer-times')}
            className="bg-indigo-700 py-2 px-4 rounded-md hover:bg-indigo-600 transition"
          >
            تطبيق خلفية مواقيت الصلاة
          </button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => onSelectBackground('none')}
          className="text-gray-400 text-sm hover:text-white transition"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
};

export default BackgroundSelector;
