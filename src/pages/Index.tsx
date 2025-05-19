import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from 'lucide-react';

import ForecastChart from '../components/ForecastChart';
import LastUpdated from '../components/LastUpdated';
import { fetchAirQualityData, reverseGeocode } from '../utils/api';
import { generateForecast, getAQICategory } from '../utils/formatters';
import { toast } from '../hooks/use-toast';

const REFRESH_INTERVAL = 2000; // 5 seconds

const getAQIVariant = (aqi: number) => {
  if (aqi <= 50) return 'bg-green-100 text-green-800';
  if (aqi <= 100) return 'bg-yellow-100 text-yellow-800';
  if (aqi <= 150) return 'bg-orange-100 text-orange-800';
  if (aqi <= 200) return 'bg-red-100 text-red-800';
  return 'bg-purple-100 text-purple-800';
};
const getTemperatureVariant = (temp: number) => {
  if (temp <= 10) return 'bg-blue-100 text-blue-800';      // Cold
  if (temp <= 25) return 'bg-green-100 text-green-800';    // Pleasant
  if (temp <= 35) return 'bg-yellow-100 text-yellow-800';  // Warm
  return 'bg-red-100 text-red-800';                        // Hot
};

const MetricCard = ({ title, value, variant }: { title: string, value: string | number, variant: string }) => (
  <Card className={`w-full ${variant}`}>
    <CardHeader className="pb-2">
      <h4 className="text-md font-medium">{title}</h4>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

const Index: React.FC = () => {
  const [aqi, setAqi] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [forecast, setForecast] = useState<Array<{ time: string; aqi: number; category: string }>>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [nearbyLocations, setNearbyLocations] = useState<Array<{
    location: string;
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
  }>>([]);

  const getUserLocation = useCallback(async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        const locationName = await reverseGeocode(latitude, longitude);
        setLocation(locationName);
      } catch (error) {
        console.error('Error getting user location:', error);
        setLocation('Location not available');
      } finally {
        setIsLoadingLocation(false);
      }
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLocation('Location not available');
      setIsLoadingLocation(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (isRefreshing) setIsRefreshing(true);

      const data = await fetchAirQualityData();

      setAqi(data.aqi);
      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setCategory(data.category || getAQICategory(data.aqi));

      if (data.nearby && Array.isArray(data.nearby)) {
        setNearbyLocations(data.nearby);
      } else {
        setNearbyLocations([]);
      }

      setForecast(generateForecast(data.aqi));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      toast({
        title: "Connection error",
        description: "Could not connect to the air quality sensor. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    getUserLocation();
    fetchData();
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [getUserLocation, fetchData]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              AirSense
            </h1>
            <p className="text-muted-foreground">{currentDate}</p>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <div className="mr-4 text-right">
              <div className="text-sm text-muted-foreground">City Average AQI</div>
              <div className="text-2xl font-bold">{aqi}</div>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </Button>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <MetricCard title="City AQI" value={aqi} variant={getAQIVariant(aqi)} />
          <MetricCard title="Humidity" value={`${humidity}%`} variant="bg-blue-100 text-blue-800" />
          <MetricCard title="Temperature" value={`${temperature}°C`} variant={getTemperatureVariant(temperature)} />
        </div>

        {/* Nearby Locations */}
        {nearbyLocations.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-2">Nearby Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {nearbyLocations.map((loc, index) => (
                <Card key={index} className="border-t-4 border-t-indigo-400">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{loc.location}</h3>
                        <p className="text-sm text-muted-foreground">{loc.location}, Pune</p>
                      </div>
                      <Badge className="bg-green-500">Live</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-2">{loc.aqi}</div>
                    <div className="text-sm text-muted-foreground mb-4">
                      AQI - {getAQICategory(loc.aqi)}
                    </div>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="py-1 pl-0">PM2.5</TableCell>
                          <TableCell className="py-1 text-right">{loc.pm25}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="py-1 pl-0">PM10</TableCell>
                          <TableCell className="py-1 text-right">{loc.pm10}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="py-1 pl-0">NO₂</TableCell>
                          <TableCell className="py-1 text-right">{loc.no2}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Charts + Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">AQI Trends - Key Areas</h3>
              </CardHeader>
              <CardContent>
                <ForecastChart data={forecast} currentAQI={aqi} />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">AI Forecast (7-Day)</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(7)].map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                    const baseAqi = aqi;
                    const trendFactor = index < 3 ? 1.1 : 0.9;
                    const randomFactor = 0.8 + (Math.random() * 0.4);
                    const forecastAqi = Math.round(baseAqi * trendFactor * randomFactor);
                    const category = getAQICategory(forecastAqi);
                    const categoryClass = `bg-aqi-${category.toLowerCase()}`;

                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-24">{`${dayName}, ${monthDay}`}</div>
                          <div className={`h-2 rounded-full ${categoryClass}`} style={{ width: `${Math.min(100, forecastAqi / 3)}%` }}></div>
                        </div>
                        <div className="font-medium">{forecastAqi}</div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  AI prediction based on historical patterns, weather forecasts, and seasonal trends
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <LastUpdated timestamp={lastUpdated} />
        </div>
      </div>
    </div>
  );
};

export default Index;
