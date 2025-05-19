import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

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
  // Initialize base data only once
  const [areaData, setAreaData] = useState(() =>
    data.map((point) => ({
      time: point.time,
      "Loni Kalbhor": point.aqi,
      "Hadapsar": point.aqi + 12,
      "Bhosari": point.aqi + 20,
      "Viman Nagar": point.aqi - 10,
    }))
  );

  // Soft update: drift 2–3 points slightly every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setAreaData((prev) => {
        const updated = [...prev];

        const indicesToUpdate = new Set<number>();
        while (indicesToUpdate.size < 3) {
          indicesToUpdate.add(Math.floor(Math.random() * updated.length));
        }

        indicesToUpdate.forEach((i) => {
          const point = { ...updated[i] };

          // Apply gentle ±5 drift
          point["Loni Kalbhor"] += Math.round(Math.random() * 10 - 5);
          point["Hadapsar"] += Math.round(Math.random() * 10 - 5);
          point["Bhosari"] += Math.round(Math.random() * 10 - 5);
          point["Viman Nagar"] += Math.round(Math.random() * 10 - 5);

          // Clamp to 0 minimum
          point["Loni Kalbhor"] = Math.max(0, point["Loni Kalbhor"]);
          point["Hadapsar"] = Math.max(0, point["Hadapsar"]);
          point["Bhosari"] = Math.max(0, point["Bhosari"]);
          point["Viman Nagar"] = Math.max(0, point["Viman Nagar"]);

          updated[i] = point;
        });

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
          <YAxis domain={[0, 'auto']} tick={{ fontSize: 12 }} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" />

          <Line
            type="monotone"
            dataKey="Loni Kalbhor"
            stroke="#3B82F6"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Hadapsar"
            stroke="#10B981"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Bhosari"
            stroke="#EF4444"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Viman Nagar"
            stroke="#8B5CF6"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
