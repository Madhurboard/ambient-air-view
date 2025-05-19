
import React from 'react';
import { getAQIDescription, getAQICategoryClass } from '../utils/formatters';
import { Info } from 'lucide-react';

interface AQIDescriptionProps {
  category: string;
}

const AQIDescription: React.FC<AQIDescriptionProps> = ({ category }) => {
  const description = getAQIDescription(category);
  const categoryClass = getAQICategoryClass(category);
  
  return (
    <div className="fade-in glass-card p-4 mt-4 flex items-start">
      <Info className={`text-${categoryClass} mr-3 mt-0.5 flex-shrink-0`} size={20} />
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default AQIDescription;
