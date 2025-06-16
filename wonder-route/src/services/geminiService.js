import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Generative AI API with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Main function to generate an itinerary
export const generateItinerary = async (payload) => {
  try {
    // Extract data from payload for prompt construction
    const { friends, visits, preferences, personas } = payload;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Construct a detailed prompt for the AI
    const prompt = constructPrompt(friends, visits, preferences, personas);
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    // Parse the response to extract JSON if available
    try {
      // Look for JSON in the response
      const jsonMatch = response.text().match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      } else {
        // Return plain text response if no JSON found
        return {
          itinerary: response.text(),
          format: "text"
        };
      }
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      return {
        itinerary: response.text(),
        format: "text"
      };
    }
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary with Gemini API");
  }
};

// Helper function to construct a detailed prompt
const constructPrompt = (friends, visits, preferences, personas = []) => {
  // Format friends' locations
  const friendsText = friends.length > 0 
    ? friends.map((f, i) => `Friend ${i + 1}: ${f.name} (${f.lat}, ${f.lng})`).join('\n')
    : "No specific friend locations provided";

  // Format areas to visit
  const visitsText = visits.length > 0
    ? visits.map((v, i) => `Location ${i + 1}: ${v.name} (${v.lat}, ${v.lng})`).join('\n')
    : "No specific areas to visit provided";

  // Format preferences
  const { startTime, endTime, budget, travelMode = 'walking', preferences: prefList = [] } = preferences;
  
  // Format personas if available
  const personasText = personas.length > 0
    ? personas.map((p, i) => 
        `Person ${i + 1}:\n- Budget: ${p.budget}\n- Energy: ${p.energy}\n- Interests: ${p.interests.join(', ')}`
      ).join('\n\n')
    : "No specific personas provided";

  // Current date for context
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Construct the prompt
  return `
You are a professional London travel agent and AI assistant specialized in creating personalized itineraries.

Today is ${currentDate}.

Your task is to create an optimized day trip plan in London for a group, considering the following:

STARTING LOCATIONS:
${friendsText}

POTENTIAL AREAS TO VISIT:
${visitsText}

PREFERENCES:
- Start time: ${startTime}
- End time: ${endTime}
- Budget: ${budget}
- Travel mode: ${travelMode}
- Interests: ${prefList.join(', ')}

${personas.length > 0 ? `PERSONAS OF TRAVELERS:\n${personasText}` : ''}

Please create a detailed itinerary with the following requirements:
1. Suggest an optimal meeting point for all travelers (if multiple starting points)
2. Plan a logical route that efficiently covers the locations
3. Include specific places to visit, each with:
   - Name and brief description
   - Estimated duration of visit
   - Approximate cost (respecting the budget)
4. Account for travel time between locations
5. Include food/coffee stops aligned with the preferences
6. Ensure the plan fits within the specified start and end times
7. For each location, include a fun historical fact or trivia
8. If the group has different personas, suggest activities that accommodate different interests
9. Offer at least one "Instagram-worthy" photo opportunity with a caption idea

Return your response in this JSON format:
\`\`\`json
{
  "meetingPoint": { "name": "", "location": "", "time": "", "reason": "" },
  "itinerary": [
    {
      "time": "",
      "activity": "",
      "location": "",
      "duration": "",
      "cost": "",
      "description": "",
      "funFact": "",
      "photoOpp": "",
      "mapsUrl": ""
    }
  ],
  "summary": "",
  "totalCost": ""
}
\`\`\`

Make sure your suggestions are realistic for London, open during the planned hours, and aligned with the specified budget.
`;
};

// Function to generate a caption or Instagram post idea
export const generateCaption = async (location, activity) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
Create a creative, engaging Instagram caption for a post about visiting "${location}" in London.
Activity: ${activity}

The caption should:
1. Be witty or clever
2. Include 1-2 relevant hashtags
3. Be under 100 characters
4. Have a London or British flavor to it
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating caption:", error);
    return "Exploring the wonders of London! #LondonCalling";
  }
};

// Function to generate a trivia fact about a location
export const generateTrivia = async (location) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
Share one interesting historical fact or trivia about "${location}" in London.
The fact should be:
1. Concise (under 100 characters)
2. Interesting or surprising
3. Historically accurate
4. Something most tourists wouldn't know
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating trivia:", error);
    return "An interesting fact about this location...";
  }
};
