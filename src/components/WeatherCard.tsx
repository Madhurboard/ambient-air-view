
import React from 'react';
import { ThermometerSun, CloudSun } from 'lucide-react';

interface WeatherCardProps {
  type: 'temperature' | 'humidity';
  value: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ type, value }) => {
  const isTemperature = type === 'temperature';
  
  return (
    <div className="fade-in glass-card p-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-3">
        {isTemperature ? (
          <ThermometerSun className="text-orange-500" size={28} />
        ) : (
          <CloudSun className="text-blue-500" size={28} />
        )}
      </div>
      <div className="text-4xl font-bold mb-1">
        {value.toFixed(isTemperature ? 1 : 0)}
        <span className="text-2xl ml-1">{isTemperature ? '°C' : '%'}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {isTemperature ? 'Temperature' : 'Humidity'}
      </div>
    </div>
  );
};

export default WeatherCard;
