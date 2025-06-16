import { generateItinerary, generateCaption, generateTrivia } from './services/geminiService';

// Main API function to get AI-generated itinerary
export const getItinerary = async (payload) => {
  console.log("Sending data to Gemini API:", payload);
  
  try {
    // If the API key isn't set, fall back to mock data
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.warn("No Gemini API key found, using mock data instead");
      return mockApiCall(payload);
    }
    
    // Call Gemini service to get the itinerary
    const response = await generateItinerary(payload);
    return response;
  } catch (error) {
    console.error("Failed to generate itinerary:", error);
    // If API fails, fall back to mock data
    return mockApiCall(payload);
  }
};

// Get a caption suggestion for a location
export const getCaption = async (location, activity) => {
  if (!process.env.REACT_APP_GEMINI_API_KEY) {
    return `Exploring ${location} in London! #LondonCalling`;
  }
  
  return generateCaption(location, activity);
};

// Get a trivia fact about a location
export const getTrivia = async (location) => {
  if (!process.env.REACT_APP_GEMINI_API_KEY) {
    return `Did you know? ${location} has a fascinating history in London!`;
  }
  
  return generateTrivia(location);
};

// Mock function as fallback if API key is not available or request fails
const mockApiCall = (payload) => {
  console.log("Using mock data for itinerary");

  // Destructure payload for easy use in the template string
  const { friends, visits, preferences, startTime, endTime, budget } = payload;
  const friendNames = friends.map(f => f.name).join(', ') || 'your friends';
  const visitNames = visits.map(v => v.name).join(', ') || 'the recommended areas';
  
  // Check if specific preferences are in the array
  const hasFood = preferences.includes('food');
  const hasCoffee = preferences.includes('coffee');
  const hasBlackHistory = preferences.includes('blackHistoryMonth');
  
  // Format as JSON to match real API
  return {
    format: "json",
    meetingPoint: {
      name: friends[0]?.name || "Piccadilly Circus",
      location: "Central London",
      time: startTime,
      reason: "Central location accessible for everyone"
    },
    itinerary: [
      {
        time: startTime,
        activity: "Meet & Greet",
        location: friends[0]?.name || "Piccadilly Circus",
        duration: "30 mins",
        cost: "£0",
        description: "Meet up with your friends to start the day",
        funFact: "Piccadilly Circus was built in 1819 to connect Regent Street with Piccadilly",
        photoOpp: "Group photo by the famous Eros statue",
        mapsUrl: "https://maps.google.com/?q=Piccadilly+Circus,London"
      },
      {
        time: "10:30",
        activity: hasCoffee ? "Coffee Break" : "Morning Stroll",
        location: hasCoffee ? "Monmouth Coffee" : "Covent Garden",
        duration: "45 mins",
        cost: hasCoffee ? "£5" : "£0",
        description: hasCoffee ? "Enjoy a morning coffee at one of London's best cafes" : "Take a pleasant morning walk",
        funFact: hasCoffee ? "Monmouth Coffee has been roasting coffee in London since 1978" : "Covent Garden used to be London's main fruit and vegetable market",
        photoOpp: hasCoffee ? "Artsy coffee cup shot with London backdrop" : "Street performers at Covent Garden make for great photos",
        mapsUrl: hasCoffee ? "https://maps.google.com/?q=Monmouth+Coffee,London" : "https://maps.google.com/?q=Covent+Garden,London"
      },
      {
        time: "12:00",
        activity: hasFood ? "Lunch" : "Cultural Visit",
        location: hasFood ? "Borough Market" : "British Museum",
        duration: "1 hour",
        cost: hasFood ? `£${budget === 'low' ? '10' : budget === 'medium' ? '20' : '35'}` : "£0",
        description: hasFood ? "Enjoy diverse food options at London's oldest food market" : "Explore one of the world's finest museums",
        funFact: hasFood ? "Borough Market has existed in some form since at least the 12th century" : "The British Museum houses over 8 million works",
        photoOpp: hasFood ? "Colorful food stalls make for great Instagram content" : "The Great Court's stunning glass ceiling",
        mapsUrl: hasFood ? "https://maps.google.com/?q=Borough+Market,London" : "https://maps.google.com/?q=British+Museum,London"
      },
      {
        time: "15:00",
        activity: hasBlackHistory ? "Black History Tour" : "Main Attraction",
        location: hasBlackHistory ? "Black Cultural Archives" : (visits[0]?.name || "Tower of London"),
        duration: "2 hours",
        cost: `£${budget === 'low' ? '15' : budget === 'medium' ? '25' : '40'}`,
        description: hasBlackHistory ? "Explore London's rich Black history and cultural heritage" : "Explore this historic castle on the north bank of the River Thames",
        funFact: hasBlackHistory ? "The Black Cultural Archives is the first national heritage center dedicated to Black British history" : "The Tower of London has served as a royal palace, prison, treasury, and zoo",
        photoOpp: hasBlackHistory ? "The beautiful Georgian architecture of the Black Cultural Archives" : "The Crown Jewels exhibition or with a Yeoman Warder (Beefeater)",
        mapsUrl: hasBlackHistory ? "https://maps.google.com/?q=Black+Cultural+Archives,London" : `https://maps.google.com/?q=${visits[0]?.name || "Tower+of+London"},London`
      },
      {
        time: endTime,
        activity: "Day Wrap-up",
        location: "South Bank",
        duration: "Until dinner",
        cost: "£0",
        description: "Enjoy the riverside views and street performances as the day ends",
        funFact: "The South Bank was the site of the 1951 Festival of Britain",
        photoOpp: "Sunset shots of the Thames with London Eye and Parliament in view",
        mapsUrl: "https://maps.google.com/?q=South+Bank,London"
      }
    ],
    summary: `A day exploring London with ${friendNames}, featuring ${visits.length > 0 ? visitNames : 'the best attractions'} and activities suitable for a ${budget} budget.`,
    totalCost: budget === 'low' ? "£25-35" : budget === 'medium' ? "£45-60" : "£75-100"
  };
};
