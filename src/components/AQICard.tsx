
import React from 'react';
import { getAQICategoryClass } from '../utils/formatters';

interface AQICardProps {
  aqi: number;
  category: string;
}

const AQICard: React.FC<AQICardProps> = ({ aqi, category }) => {
  const categoryClass = getAQICategoryClass(category);
  
  return (
    <div className="fade-in w-full glass-card overflow-hidden">
      <div className={`bg-${categoryClass} p-3 text-white font-medium text-center`}>
        Air Quality Index
      </div>
      <div className="p-4 flex flex-col items-center justify-center">
        <div className="text-7xl font-bold mb-3">{aqi}</div>
        <div className={`text-${categoryClass} text-xl font-semibold mb-2`}>
          {category}
        </div>
      </div>
    </div>
  );
};

export default AQICard;
