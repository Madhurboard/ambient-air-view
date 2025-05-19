
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
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
  // Add current AQI to beginning of data for chart
  const chartData = [
    { time: 'Now', aqi: currentAQI, category: data[0]?.category || 'Good' },
    ...data
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const categoryClass = getAQICategoryClass(data.category);
      
      return (
        <div className="glass-card p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p className={`text-${categoryClass} font-semibold`}>
            AQI: {data.aqi} ({data.category})
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="fade-in glass-card p-4 w-full">
      <h3 className="text-lg font-medium mb-4">AQI Forecast</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 'dataMax + 50']}
              tick={{ fontSize: 12 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="aqi" 
              stroke="#3B82F6" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: "#3B82F6" }} 
              dot={{ r: 4, fill: "white", strokeWidth: 2, stroke: "#3B82F6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;
