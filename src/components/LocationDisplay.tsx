
import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationDisplayProps {
  location: string;
  isLoading: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ location, isLoading }) => {
  // Always show "Loni Kalbhor, India" regardless of the location prop
  const displayLocation = "Loni Kalbhor, India";
  
  return (
    <div className="flex items-center justify-center text-lg text-muted-foreground mb-4">
      <MapPin className="mr-2" size={20} />
      {isLoading ? (
        <span className="animate-pulse">Detecting location...</span>
      ) : (
        <span>{displayLocation}</span>
      )}
    </div>
  );
};

export default LocationDisplay;
