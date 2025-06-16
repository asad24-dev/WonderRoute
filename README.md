# Wonder Route: AI-Powered London Trip Planner
### 2nd Place, Google EMEA Talent Hunt Hackathon 2025

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Google Maps API](https://img.shields.io/badge/Google_Maps_API-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![Gemini API](https://img.shields.io/badge/Gemini_API-4A8EFF?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/docs/gemini_api_overview)
[![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)](https://mui.com/)

An intelligent multi-person trip planner for London, leveraging AI to create personalized itineraries with map integration and user-defined preferences. This project was created for the "AI for Ease" hackathon.

<!-- Optional: Add a screenshot or GIF of your application here -->
<!-- <p align="center">
  <img src="path/to/your/screenshot.png" alt="Wonder Route Application Screenshot" width="700"/>
</p> -->

## Overview

Wonder Route is a web application designed to simplify and enhance the experience of planning a day trip in London. It uses Google's Gemini AI to generate bespoke itineraries based on user inputs such as points of interest, friend locations, budget, travel preferences, and even individual traveler personas. The application integrates with Google Maps for visual planning and location searching, providing a seamless planning experience.

## Key Features

*   **AI-Powered Itinerary Generation:** Leverages Google Gemini (via [`wonder-route/src/services/geminiService.js`](wonder-route/src/services/geminiService.js)) to create dynamic and personalized day plans.
*   **Interactive Map Interface:** Uses Google Maps ([`MapComponent.js`](wonder-route/src/components/MapComponent.js)) for selecting locations (friend's places, areas to visit) and searching for points of interest.
*   **Multi-Persona Planning:** Allows users to define different traveler personas (e.g., budget, energy levels, interests) using [`PersonaInput.js`](wonder-route/src/components/PersonaInput.js) for more tailored suggestions.
*   **Comprehensive Preference Customization (via [`Sidebar.js`](wonder-route/src/components/Sidebar.js)):**
    *   Trip duration (start and end times).
    *   Budget (low, medium, high).
    *   Travel modes (walking, public transport, driving, cycling).
    *   Interests (architecture, food, museums, parks, Black History Month, etc.).
    *   Dietary needs.
*   **Location Management:** Easily add and remove friend locations and areas to visit directly on the map or via search.
*   **Visual Timeline View:** Displays the generated itinerary in an easy-to-follow timeline format ([`TimelineView.js`](wonder-route/src/components/TimelineView.js)), including activity details, duration, cost, fun facts, and photo opportunities.
*   **Dynamic Content Generation:**
    *   AI-generated Instagram caption ideas for locations.
    *   AI-generated fun facts/trivia for locations.
*   **Responsive Design:** User interface built with Material UI for a clean and modern look, as seen in [`App.js`](wonder-route/src/App.js).

## Tech Stack

*   **Frontend:** React, JavaScript, Material UI, React Google Maps API (`@react-google-maps/api`), Axios
*   **AI:** Google Gemini API (`@google/generative-ai`)
*   **Backend (Optional):** Node.js, Express.js (server setup in [`wonder-route/server/server.js`](wonder-route/server/server.js) for secure API key management and server-side AI calls)
*   **Styling:** CSS ([`App.css`](wonder-route/src/App.css), [`index.css`](wonder-route/src/index.css)), Material UI (Emotion)

## Setup and Installation

### Prerequisites

*   Node.js (v14 or later recommended)
*   npm or yarn

### API Keys

You will need API keys for:
1.  **Google Maps Platform:**
    *   Enable "Maps JavaScript API" and "Places API".
    *   Get your key from [Google Cloud Console](https://console.cloud.google.com/).
2.  **Google Gemini API:**
    *   Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Frontend Setup (`wonder-route` directory)

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-url>/wonder-route
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `wonder-route` directory (see [`wonder-route/.env.local`](wonder-route/.env.local)):
    ```env
    // filepath: wonder-route/.env.local
    REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GOOGLE_MAPS_API_KEY` and `YOUR_GEMINI_API_KEY` with your actual keys.
    *Note: The client-side Gemini API key (`REACT_APP_GEMINI_API_KEY`) is used by default for development convenience. For production, it's highly recommended to proxy requests through your own backend server to protect your Gemini API key.*

4.  **Start the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The application will be available at `http://localhost:3000`.

### Backend Setup (`wonder-route/server` directory - Optional, Recommended for Production)

The backend server (see [`wonder-route/server/server.js`](wonder-route/server/server.js)) is provided as an alternative for handling Gemini API calls securely. The frontend client ([`wonder-route/src/api.js`](wonder-route/src/api.js)) currently uses the client-side SDK. To use this backend:

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install server dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Server Environment Variables:**
    Create a `.env` file in the `wonder-route/server` directory (see [`wonder-route/server/.env`](wonder-route/server/.env)):
    ```env
    // filepath: wonder-route/server/.env
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    PORT=5000
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key.

4.  **Start the backend server:**
    ```bash
    npm start
    # or for development with nodemon
    npm run dev
    ```
    The server will run on `http://localhost:5000` (or the port specified in `wonder-route/server/.env`).
    *To use this backend for AI calls, you would need to modify the frontend's API service ([`wonder-route/src/api.js`](wonder-route/src/api.js)) to make HTTP requests to this server's endpoints (e.g., `/api/generate-itinerary`) instead of using the client-side `GoogleGenerativeAI` SDK directly.*

## Available Scripts

### Frontend (`wonder-route` directory - from [`package.json`](wonder-route/package.json))

*   `npm start` or `yarn start`: Runs the app in development mode.
*   `npm test` or `yarn test`: Launches the test runner (see [`App.test.js`](wonder-route/src/App.test.js)).
*   `npm run build` or `yarn build`: Builds the app for production.
*   `npm run eject` or `yarn eject`: Ejects from Create React App configuration (use with caution).

### Backend (`wonder-route/server` directory - from [`server/package.json`](wonder-route/server/package.json))

*   `npm start`: Starts the server using `node server.js`.
*   `npm run dev`: Starts the server with `nodemon` for automatic restarts during development.

## Project Structure

```
wonder-route/
├── public/             # Static assets, favicons, and index.html
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── server/             # Backend Express server
│   ├── server.js       # Main server logic, API endpoints
│   ├── package.json    # Server dependencies
│   └── .env            # Server environment variables (Gemini API Key)
├── src/                # Frontend React application source
│   ├── api.js          # Client-side API call functions
│   ├── App.css         # Global application styles
│   ├── App.js          # Main application component
│   ├── index.css       # Base CSS styles
│   ├── index.js        # Entry point for React app
│   ├── components/     # Reusable React components
│   │   ├── MapComponent.js
│   │   ├── PersonaInput.js
│   │   ├── Sidebar.js
│   │   └── TimelineView.js
│   └── services/       # Client-side services
│       └── geminiService.js # Gemini API interaction logic
├── .env.local          # Frontend environment variables (API keys)
├── .gitignore          # Files and folders to ignore in git
├── package.json        # Frontend dependencies and scripts
└── README.md           # This file
```

## How It Works

1.  **User Input:** Users interact with the [`Sidebar`](wonder-route/src/components/Sidebar.js) to input their preferences:
    *   Add friend locations and areas to visit using the interactive [`MapComponent`](wonder-route/src/components/MapComponent.js).
    *   Specify start/end times, budget, travel mode, interests, and dietary needs.
    *   Define traveler personas with individual preferences using [`PersonaInput`](wonder-route/src/components/PersonaInput.js).
2.  **AI Processing:**
    *   The collected data is formatted into a detailed prompt.
    *   This prompt is sent to the Google Gemini API via the client-side [`geminiService.js`](wonder-route/src/services/geminiService.js) (or potentially through the backend server if modified).
3.  **Itinerary Display:**
    *   The AI's response (ideally a JSON object) is parsed.
    *   The itinerary is displayed in a user-friendly [`TimelineView`](wonder-route/src/components/TimelineView.js), showing activities, locations, times, costs, fun facts, and photo opportunities.
    *   Users can also generate Instagram captions and trivia for specific locations on the timeline.

## Next Steps / Future Enhancements

*   Improve UI/UX with more animations and smooth transitions.
*   Implement calendar export functionality (e.g., Google Calendar, iCal).
*   Add language translation features for broader accessibility.
*   Enhance error handling and provide more robust fallbacks, especially for API interactions (current error handling in [`App.js`](wonder-route/src/App.js) can be expanded).
*   Expand test coverage with more unit and integration tests.
*   Fully integrate the backend server for all AI calls to secure API keys in a production environment.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can find the standard Create React App documentation below.

## Learn More (Create React App)

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
