
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getAQICategoryClass } from '../utils/formatters';

interface ForecastData {
  time: string;
  aqi: number;
  category: string;
}

interface ForecastChartProps {
  data: ForecastData[];
  currentAQI: number;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data, currentAQI }) => {
  // Generate multiple trend lines for different locations with more natural patterns
  const getAreaData = () => {
    return data.map((point, index) => {
      // Create fluctuations that are consistent for each location across time
      const hadapsarFactor = 0.9 + (Math.sin(index * 0.5) * 0.2);
      const bhosariFactor = 1.2 + (Math.cos(index * 0.4) * 0.3);
      const vimanNagarFactor = 0.8 + (Math.sin(index * 0.7 + 2) * 0.25);
      
      return {
        time: point.time,
        "Loni Kalbhor": point.aqi,
        "Hadapsar": Math.round(point.aqi * hadapsarFactor),
        "Bhosari": Math.round(point.aqi * bhosariFactor),
        "Viman Nagar": Math.round(point.aqi * vimanNagarFactor)
      };
    });
  };

  const areaData = getAreaData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={areaData}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" />
          
          <Line 
            type="monotone" 
            dataKey="Loni Kalbhor" 
            stroke="#3B82F6" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="Hadapsar" 
            stroke="#10B981" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="Bhosari" 
            stroke="#EF4444" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="Viman Nagar" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
