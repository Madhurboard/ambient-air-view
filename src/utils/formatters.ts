
// Utility functions for data formatting and calculations

// Categorize AQI value
export const getAQICategory = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Poor";
  if (aqi <= 200) return "Unhealthy";
  return "Hazardous";
};

// Generate CSS class based on AQI category
export const getAQICategoryClass = (category: string): string => {
  switch (category.toLowerCase()) {
    case "good":
      return "aqi-good";
    case "moderate":
      return "aqi-moderate";
    case "poor":
      return "aqi-poor";
    case "unhealthy":
      return "aqi-unhealthy";
    case "hazardous":
      return "aqi-hazardous";
    default:
      return "aqi-good";
  }
};

// Generate a simulated forecast based on current AQI
export const generateForecast = (currentAQI: number): Array<{ time: string; aqi: number; category: string }> => {
  const forecast = [];
  let baseAQI = currentAQI;
  
  for (let i = 1; i <= 6; i++) {
    // Random variation between -15 and +15
    const variation = Math.floor(Math.random() * 31) - 15;
    const forecastAQI = Math.max(1, baseAQI + variation);
    
    forecast.push({
      time: `+${i}h`,
      aqi: forecastAQI,
      category: getAQICategory(forecastAQI)
    });
    
    // Make the next forecast point be influenced by this one (for more realistic trends)
    baseAQI = forecastAQI;
  }
  
  return forecast;
};

// Format a date to display time as HH:MM:SS
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// Get description text based on AQI category
export const getAQIDescription = (category: string): string => {
  switch (category.toLowerCase()) {
    case "good":
      return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
    case "moderate":
      return "Air quality is acceptable; however, there may be some concern for a small number of people who are sensitive to certain air pollutants.";
    case "poor":
      return "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
    case "unhealthy":
      return "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.";
    case "hazardous":
      return "Health alert: everyone may experience more serious health effects. Avoid outdoor activities.";
    default:
      return "Air quality information unavailable.";
  }
};
