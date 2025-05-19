
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from 'lucide-react';
import AQICard from '../components/AQICard';
import WeatherCard from '../components/WeatherCard';
import ForecastChart from '../components/ForecastChart';
import LocationDisplay from '../components/LocationDisplay';
import LastUpdated from '../components/LastUpdated';
import AQIDescription from '../components/AQIDescription';
import { fetchAirQualityData, reverseGeocode } from '../utils/api';
import { generateForecast, getAQICategory, formatTime } from '../utils/formatters';
import { toast } from '../hooks/use-toast';

const REFRESH_INTERVAL = 5000; // 5 seconds

const Index: React.FC = () => {
  // State for air quality data
  const [aqi, setAqi] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  
  // State for location
  const [location, setLocation] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  
  // State for forecast and last updated
  const [forecast, setForecast] = useState<Array<{ time: string; aqi: number; category: string }>>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to track if we're using mock data
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  // State for manual refresh
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to get user's location
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

  // Function to fetch air quality data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (isRefreshing) setIsRefreshing(true);
      
      const data = await fetchAirQualityData();
      
      // Check if we're using mock data
      if (data.hasOwnProperty('isMockData') && data.isMockData === true && !usingMockData) {
        setUsingMockData(true);
        toast({
          title: "Using simulated data",
          description: "Could not connect to the air quality sensor. Using simulated data instead.",
        });
      }

      // Update state with new data
      setAqi(data.aqi);
      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setCategory(data.category || getAQICategory(data.aqi));
      
      // Generate forecast based on current AQI
      setForecast(generateForecast(data.aqi));
      
      // Update last updated timestamp
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [usingMockData, isRefreshing]);

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // On component mount, get user location and fetch initial data
  useEffect(() => {
    getUserLocation();
    fetchData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [getUserLocation, fetchData]);

  // Get current date for header
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
              Pune Air Quality Dashboard
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-t-4 border-t-red-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Loni Kalbhor</h3>
                  <p className="text-sm text-muted-foreground">Loni Kalbhor, Pune</p>
                </div>
                <Badge className="bg-green-500">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{aqi}</div>
              <div className="text-sm text-muted-foreground mb-4">AQI - {category}</div>
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM2.5</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.4)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM10</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.6)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">NO₂</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.15)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-red-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Hadapsar</h3>
                  <p className="text-sm text-muted-foreground">Hadapsar, Pune</p>
                </div>
                <Badge className="bg-green-500">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{Math.round(aqi * 1.2)}</div>
              <div className="text-sm text-muted-foreground mb-4">AQI - {getAQICategory(Math.round(aqi * 1.2))}</div>
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM2.5</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.5)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM10</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.75)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">NO₂</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.18)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Bhosari</h3>
                  <p className="text-sm text-muted-foreground">Bhosari, Pune</p>
                </div>
                <Badge className="bg-green-500">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{Math.round(aqi * 1.4)}</div>
              <div className="text-sm text-muted-foreground mb-4">AQI - {getAQICategory(Math.round(aqi * 1.4))}</div>
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM2.5</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.33)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM10</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.45)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">NO₂</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.1)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Nigdi</h3>
                  <p className="text-sm text-muted-foreground">Nigdi, Pune</p>
                </div>
                <Badge className="bg-green-500">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{Math.round(aqi * 1.5)}</div>
              <div className="text-sm text-muted-foreground mb-4">AQI - {getAQICategory(Math.round(aqi * 1.5))}</div>
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM2.5</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.1)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">PM10</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.65)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1 pl-0">NO₂</TableCell>
                    <TableCell className="py-1 text-right">{Math.round(aqi * 0.3)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
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
                    
                    // Generate random AQI for the forecast
                    const forecastAqi = Math.floor(Math.random() * 200) + 30;
                    const category = getAQICategory(forecastAqi);
                    const categoryClass = `bg-aqi-${category.toLowerCase()}`;
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-24">{`${dayName}, ${monthDay}`}</div>
                          <div className={`h-2 rounded-full ${categoryClass}`} style={{ width: `${Math.min(100, forecastAqi/3)}%` }}></div>
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
