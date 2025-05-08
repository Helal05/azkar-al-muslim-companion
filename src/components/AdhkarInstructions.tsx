
import { Hand, ChevronLeft, ChevronRight, Settings } from "lucide-react";

const AdhkarInstructions = () => {
  return (
    <div className="text-right font-arabic space-y-6 py-2">
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="bg-gray-800 p-3 rounded-full">
          <Hand className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold">المس الشاشة مرة واحدة</p>
          <p className="text-gray-400 text-sm">للإنتقال إلى الدعاء التالي</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="bg-gray-800 p-3 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold">حرك من اليسار إلى اليمين</p>
          <p className="text-gray-400 text-sm">للعودة إلى الدعاء السابق</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="bg-gray-800 p-3 rounded-full">
          <Hand className="w-6 h-6 rotate-90" />
        </div>
        <div>
          <p className="font-bold">حرك إلى فوق أو تحت</p>
          <p className="text-gray-400 text-sm">لتغيير صورة الخلفية الثابتة</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="bg-gray-800 p-3 rounded-full">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold">في الإعدادات يمكنك اختيار خلفيات</p>
          <p className="text-gray-400 text-sm">متحركة مع صوت او بدون صوت او بدون خلفية. ويمكنك جعل الأذكار تتغير تلقائيا بعد عدة دقائق</p>
        </div>
      </div>
    </div>
  );
};

export default AdhkarInstructions;
