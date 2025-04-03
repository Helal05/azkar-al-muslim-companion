
import { motion } from "framer-motion";
import { azkarCategories } from "../data/azkarData";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Index = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pattern-bg">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {azkarCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={item}
              className={`category-card ${category.color || ""}`}
              onClick={() => navigate(`/category/${category.id}`)}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h2 className="text-xl font-arabic font-bold text-islamic-green-dark dark:text-islamic-neutral">
                {category.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-arabic">
                {category.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-islamic-green-dark/70 dark:text-islamic-neutral/70 text-sm font-arabic">
            "مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ"
          </p>
          <p className="text-islamic-green-dark/60 dark:text-islamic-neutral/60 text-xs mt-2">
            رواه البخاري ومسلم
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
