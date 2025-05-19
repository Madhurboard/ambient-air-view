
import React, { useState, useEffect, useCallback } from 'react';
import AQICard from '../components/AQICard';
import WeatherCard from '../components/WeatherCard';
import ForecastChart from '../components/ForecastChart';
import LocationDisplay from '../components/LocationDisplay';
import LastUpdated from '../components/LastUpdated';
import AQIDescription from '../components/AQIDescription';
import { fetchAirQualityData, reverseGeocode } from '../utils/api';
import { generateForecast, getAQICategory } from '../utils/formatters';

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
      const data = await fetchAirQualityData();
      
      // Update state with new data
      setAqi(data.aqi);
      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setCategory(data.category);
      
      // Generate forecast based on current AQI
      setForecast(generateForecast(data.aqi));
      
      // Update last updated timestamp
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On component mount, get user location and fetch initial data
  useEffect(() => {
    getUserLocation();
    fetchData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [getUserLocation, fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Air Quality Dashboard
        </h1>
        
        <LocationDisplay location={location} isLoading={isLoadingLocation} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <AQICard aqi={aqi} category={category} />
          </div>
          
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <WeatherCard type="temperature" value={temperature} />
            <WeatherCard type="humidity" value={humidity} />
          </div>
        </div>
        
        <ForecastChart data={forecast} currentAQI={aqi} />
        
        <AQIDescription category={category} />
        
        <LastUpdated timestamp={lastUpdated} />
      </div>
    </div>
  );
};

export default Index;
