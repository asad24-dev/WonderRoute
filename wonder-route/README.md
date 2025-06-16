# Wonder Route: AI-Assisted Trip Planner for London

A multi-person, AI-assisted trip planner for London with map integration and user preferences. This project is created for the "AI for Ease" hackathon.

## Project Overview

Wonder Route is an intelligent trip planning application that uses AI (Google's Gemini) to create personalized itineraries for tourists in London. The app considers multiple starting points, personal preferences, travel modes, and more to suggest optimized day plans.

## Key Features

- **Map Integration**: London map with starting point selection
- **Multi-Person Planning**: Find converging routes or optimal meetup points
- **AI-Powered Recommendations**: Personalized suggestions based on preferences
- **Smart Itinerary Generation**: Logical routes with activity timing
- **Preference Customization**: Architecture, food, entertainment, museums, etc.
- **Accessibility Options**: Budget, energy level, and dietary considerations

## Project Roadmap

### Phase 1: Core Functionality
- Map Interface with Google Maps API
- User preference collection
- Gemini AI integration
- Basic itinerary display

### Phase 2: Smart Personalization
- Persona input for each traveler
- Advanced prompt engineering for Gemini
- JSON-structured itineraries

### Phase 3: Advanced Features
- LangChain/Tools integration
- Language & accessibility options
- Multiple people sync with meetup optimization
- Fun Gemini add-ons (captions, trivia)
- Calendar export options

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Setup

### Frontend Setup
1. Clone the repository
2. Install frontend dependencies with `npm install`
3. Create a `.env` file in the root directory based on `.env.example`
4. Add your API keys:
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Get a Gemini API key from [AI Studio](https://aistudio.google.com/)
5. Run the frontend app with `npm start`

### Backend Setup (Optional)
If you want to use the backend server instead of client-side API calls:

1. Navigate to the server directory: `cd server`
2. Install server dependencies: `npm install`
3. Create a `.env` file in the server directory based on `.env.example`
4. Add your Gemini API key
5. Run the server with `npm start` or `npm run dev` for development with auto-reload

The backend server provides additional security by keeping your API keys private and offers enhanced performance for complex requests.

## Implementation Progress

### ✅ Phase 1: Core Functionality
- **Map Interface**: Integrated Google Maps with location selection
- **Preferences Panel**: Travel radius, mode, and interest selection
- **Gemini Integration**: AI-powered itinerary generation
- **Timeline View**: Visualized itinerary with activities, times, and locations

### ✅ Phase 2: Smart Personalization
- **Persona Input**: Multiple traveler profiles with budget, energy, interests
- **Smart Prompt Engineering**: Structured prompts for Gemini
- **JSON Itineraries**: Structured data format for display
- **Meetup Optimization**: Central location finding for multiple travelers

### 🔄 Phase 3: Advanced Features (Partially Implemented)
- **Instagram Captions**: AI-generated photo captions
- **Fun Facts**: Location trivia generation
- **Map Integration**: View locations on map
- **Backend Option**: Server setup for enhanced security

## Next Steps
- Improve UI/UX with animations and transitions
- Add calendar export functionality
- Implement language translation features
- Enhance error handling and fallbacks
- Add unit and integration tests

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
