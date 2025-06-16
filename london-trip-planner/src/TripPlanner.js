// src/TripPlanner.js

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './TripPlanner.css'; // We will create this CSS file next

// --- Map Configuration ---
const containerStyle = {
  width: '100%',
  height: '100vh' // Make map take the full screen height
};

const londonCenter = {
  lat: 51.5074,
  lng: -0.1278
};

const libraries = ['places']; // Enable the Places API

// --- Main Component ---
function TripPlanner() {
  // State for form inputs
  const [travelMode, setTravelMode] = useState('walking');
  const [preferences, setPreferences] = useState({
    architecture: false,
    food: false,
    entertainment: false,
    museums: false
  });

  // Load the Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  // Handle checkbox changes
  const handlePreferenceChange = (event) => {
    const { name, checked } = event.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  // Function to call the backend (placeholder for now)
  const generateTrip = () => {
    const selectedPreferences = Object.keys(preferences).filter(key => preferences[key]);
    console.log("Generating trip with the following settings:");
    console.log("Travel Mode:", travelMode);
    console.log("Preferences:", selectedPreferences);
    // In the next step, you will use fetch() to send this data to your Node.js backend.
    alert("Check the console! Ready to send this data to the backend.");
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps...";

  return (
    <div className="trip-planner-layout">
      {/* --- CONTROL PANEL --- */}
      <div className="control-panel">
        <h2>AI Trip Planner: London</h2>
        <p>Build your perfect day out in London with Gemini.</p>
        
        <div className="form-group">
          <label>Travel Mode</label>
          <div>
            <input type="radio" id="walking" name="travelMode" value="walking" checked={travelMode === 'walking'} onChange={(e) => setTravelMode(e.target.value)} />
            <label htmlFor="walking">🚶 Walking</label>
          </div>
          <div>
            <input type="radio" id="public_transport" name="travelMode" value="public_transport" checked={travelMode === 'public_transport'} onChange={(e) => setTravelMode(e.target.value)} />
            <label htmlFor="public_transport">🚇 Public Transport</label>
          </div>
        </div>

        <div className="form-group">
          <label>I'm interested in...</label>
          {Object.keys(preferences).map((key) => (
            <div key={key}>
              <input type="checkbox" id={key} name={key} checked={preferences[key]} onChange={handlePreferenceChange} />
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            </div>
          ))}
        </div>

        <button className="generate-button" onClick={generateTrip}>
          ✨ Generate My Trip Plan
        </button>
      </div>

      {/* --- MAP DISPLAY --- */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={londonCenter}
          zoom={12}
          options={{
            disableDefaultUI: true, // cleaner map
            zoomControl: true,
          }}
        >
          {/* Example marker, you will add more dynamically later */}
          <Marker position={londonCenter} title="Central London" />
        </GoogleMap>
      </div>
    </div>
  );
}

export default TripPlanner;