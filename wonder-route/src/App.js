import React, { useState, useCallback, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Alert, Snackbar } from '@mui/material';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import { getItinerary } from './api';
import './App.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [friendLocations, setFriendLocations] = useState([]);
  const [visitLocations, setVisitLocations] = useState([]);
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('form');
  const [error, setError] = useState(null);
  
  // Check for API key on load
  useEffect(() => {
    if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key is missing. Set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file.");
    }
    
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.warn("Gemini API key is missing. App will use mock data instead of AI-generated content.");
    }
  }, []);

  // A more generic function to add any location
  const addLocation = useCallback((location, type) => {
    if (type === 'friend') {
      setFriendLocations(prev => [...prev, location]);
    } else {
      setVisitLocations(prev => [...prev, location]);
    }
  }, []);

  // This function is specifically for the search bar result
  const addSearchedLocation = useCallback((type) => {
    if (!searchedPlace) return;
    
    const newLocation = {
      name: searchedPlace.name,
      lat: searchedPlace.geometry.location.lat(),
      lng: searchedPlace.geometry.location.lng(),
    };
    
    addLocation(newLocation, type);
    setSearchedPlace(null); // Clear after adding
  }, [searchedPlace, addLocation]);

  // Remove a location from the list
  const removeLocation = useCallback((type, index) => {
    if (type === 'friend') {
      setFriendLocations(prev => prev.filter((_, i) => i !== index));
    } else {
      setVisitLocations(prev => prev.filter((_, i) => i !== index));
    }
  }, []);

  // Generate itinerary with the provided options
  const handleGenerate = async (options) => {
    setIsLoading(true);
    setView('result');
    setError(null);

    const payload = {
      friends: friendLocations,
      visits: visitLocations,
      preferences: options,
      personas: options.personas || []
    };

    try {
      const response = await getItinerary(payload);
      setItinerary(response);
    } catch (error) {
      setError("Failed to generate itinerary. Please try again.");
      console.error("Error generating itinerary:", error);
      // Stay on result view but with error message
    } finally {
      setIsLoading(false);
    }
  };

  // Return to planning view
  const handleBack = () => {
    setView('form');
    // Don't clear the itinerary so it can be viewed again if the user goes back to results
  };

  // Close error message
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-container">
        <MapComponent
          friendLocations={friendLocations}
          visitLocations={visitLocations}
          onPlaceSelected={setSearchedPlace}
          addLocation={addLocation}
          removeLocation={removeLocation}
        />
        <Sidebar
          friendLocations={friendLocations}
          visitLocations={visitLocations}
          searchedPlace={searchedPlace}
          addLocation={addSearchedLocation} // Sidebar uses the search-specific add function
          removeLocation={removeLocation}
          onGenerate={handleGenerate}
          itinerary={itinerary}
          isLoading={isLoading}
          view={view}
          onBack={handleBack}
        />
        
        {/* Error message */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
