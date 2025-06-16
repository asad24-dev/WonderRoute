import React, { useState, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import { mockApiCall } from './api';
import './App.css';

function App() {
  const [friendLocations, setFriendLocations] = useState([]);
  const [visitLocations, setVisitLocations] = useState([]);
  const [searchedPlace, setSearchedPlace] = useState(null);

  const [itinerary, setItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('form');

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

  const removeLocation = useCallback((type, index) => {
    if (type === 'friend') {
      setFriendLocations(prev => prev.filter((_, i) => i !== index));
    } else {
      setVisitLocations(prev => prev.filter((_, i) => i !== index));
    }
  }, []);

  const handleGenerate = async (options) => {
    setIsLoading(true);
    setView('result');

    const payload = {
      friends: friendLocations,
      visits: visitLocations,
      preferences: options,
    };

    try {
      const response = await mockApiCall(payload);
      setItinerary(response);
    } catch (error) {
      setItinerary('Sorry, something went wrong. Please try again.');
      console.error("Failed to generate itinerary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setView('form');
    setItinerary('');
  };

  return (
    <div className="app-container">
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
    </div>
  );
}

export default App;
