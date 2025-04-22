
import { Shield } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ size = 'md' }: LogoProps) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-2">
      <Shield className={`text-amber-500 ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'}`} />
      <h1 className={`font-arabic ${sizes[size]} bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent font-bold`}>
        حِصنُك
      </h1>
    </div>
  );
};

export default Logo;
