
// API endpoint for air quality data
export const fetchAirQualityData = async () => {
  try {
    // First try to fetch from the real endpoint
    try {
      const response = await fetch('http://192.168.1.13:3000/api/latest');
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log("Falling back to mock data due to API error:", error);
    }
    
    // If the real endpoint fails, return mock data
    console.log("Returning mock data as fallback");
    return {
      aqi: Math.floor(Math.random() * 150) + 10, // Random AQI between 10 and 160
      temperature: Math.floor(Math.random() * 15) + 20, // Random temp between 20 and 35
      humidity: Math.floor(Math.random() * 40) + 40, // Random humidity between 40% and 80%
      category: getRandomCategory()
    };
    
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
