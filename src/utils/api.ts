
// Mock API endpoint for air quality data
export const fetchAirQualityData = async () => {
  try {
    // In a real app, we would use a real API endpoint
    // For this demo, we'll simulate an API call with a short timeout
    return new Promise<{
      aqi: number;
      temperature: number;
      humidity: number;
      category: string;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          aqi: 12,
          temperature: 28.9,
          humidity: 76,
          category: "Good"
        });
      }, 500);
    });
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    throw error;
  }
};

// Reverse geocoding function to get location from coordinates
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "AirQualityDashboard/1.0",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    
    const data = await response.json();
    
    // Extract city and country
    const city = data.address.city || 
                data.address.town || 
                data.address.village || 
                data.address.county ||
                "Unknown";
                
    const country = data.address.country || "Unknown";
    
    return `${city}, ${country}`;
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return "Unknown Location";
  }
};
