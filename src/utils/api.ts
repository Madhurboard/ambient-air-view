// API endpoint for air quality data
export const fetchAirQualityData = async () => {
  try {
    const response = await fetch('http://192.168.1.13:3000/api/latest');
    
    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }
    
    const data = await response.json();
    return data;
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
  // Since we're always showing "Loni Kalbhor, India", we don't need to make the API call
  // But we'll keep the function for compatibility with the existing code
  return "Loni Kalbhor, India";
};
