
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen pattern-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-islamic-green-dark/30 rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-4xl font-bold text-islamic-green-dark dark:text-islamic-neutral mb-2">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-arabic mb-6">
          الصفحة غير موجودة
        </p>
        <Button onClick={() => navigate("/")} className="bg-islamic-green hover:bg-islamic-green-dark text-white">
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
