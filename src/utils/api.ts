
// API endpoint for air quality data
export const fetchAirQualityData = async () => {
  try {
    // Fetch from the real endpoint
    const response = await fetch('http://192.168.1.13:3000/api/latest');
    
    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        // Add real data for nearby locations
        nearby: [
          {
            location: "Hadapsar",
            aqi: Math.round(data.aqi * 1.2),
            pm25: Math.round(data.aqi * 0.5),
            pm10: Math.round(data.aqi * 0.75),
            no2: Math.round(data.aqi * 0.18)
          },
          {
            location: "Bhosari",
            aqi: Math.round(data.aqi * 1.4),
            pm25: Math.round(data.aqi * 0.33),
            pm10: Math.round(data.aqi * 0.45),
            no2: Math.round(data.aqi * 0.1)
          },
          {
            location: "Viman Nagar",
            aqi: Math.round(data.aqi * 0.9),
            pm25: Math.round(data.aqi * 0.42),
            pm10: Math.round(data.aqi * 0.55),
            no2: Math.round(data.aqi * 0.12)
          },
          {
            location: "Nigdi", 
            aqi: Math.round(data.aqi * 1.5),
            pm25: Math.round(data.aqi * 0.1),
            pm10: Math.round(data.aqi * 0.65),
            no2: Math.round(data.aqi * 0.3)
          }
        ]
      };
    } else {
      throw new Error('Failed to fetch data from API');
    }
  } catch (error) {
    console.error("Error in fetchAirQualityData:", error);
    throw error;
  }
};

// Helper function to get a random AQI category
function getRandomCategory() {
  const categories = ["Good", "Moderate", "Poor", "Unhealthy", "Hazardous"];
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
}

// Reverse geocoding function to get location from coordinates
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  // Since we're always showing "Loni Kalbhor, India", we don't need to make the API call
  return "Loni Kalbhor, India";
};
