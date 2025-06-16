import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
  position: 'relative' // Needed for positioning child elements
};

const center = {
  lat: 40.7128,
  lng: -74.0060,
};

const libraries = ['places'];

// Different icons for different pin types
const friendIcon = {
  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
};

const visitIcon = {
  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
};

function MapComponent({ friendLocations, visitLocations, addLocation, removeLocation }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [currentCenter, setCurrentCenter] = useState(center);
  
  const onMapLoad = useCallback(map => {
    setMap(map);
  }, []);

  // Update currentCenter state when the map stops moving
  const onIdle = () => {
    if (map) {
      const newCenter = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      };
      setCurrentCenter(newCenter);
    }
  };

  const handleAddPin = (type) => {
    if (!isLoaded || !map) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: currentCenter }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const newLocation = {
          name: results[0].formatted_address,
          ...currentCenter
        };
        addLocation(newLocation, type);
      } else {
        console.error('Geocoder failed due to: ' + status);
        // Add with a default name if geocoding fails
        const newLocation = {
          name: `Location @ ${currentCenter.lat.toFixed(4)}, ${currentCenter.lng.toFixed(4)}`,
          ...currentCenter
        };
        addLocation(newLocation, type);
      }
    });
  };

  const handleMarkerClick = (type, index) => {
    removeLocation(type, index);
  };

  const handleMouseOver = () => {
    if (map) map.getDiv().style.cursor = 'crosshair';
  }
  
  const handleMouseOut = () => {
    if (map) map.getDiv().style.cursor = 'default';
  }

  if (loadError) return <div>Error loading maps. Please check your API key and enabled APIs.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onMapLoad}
        onIdle={onIdle} // Use onIdle to avoid excessive updates
        options={{
          disableDefaultUI: true, // Hides default controls
          zoomControl: true, // Re-enable zoom control
        }}
      >
        {friendLocations.map((loc, index) => (
          <Marker
            key={`friend-${index}`}
            position={loc}
            icon={friendIcon}
            onClick={() => handleMarkerClick('friend', index)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
        ))}
        {visitLocations.map((loc, index) => (
          <Marker
            key={`visit-${index}`}
            position={loc}
            icon={visitIcon}
            onClick={() => handleMarkerClick('visit', index)}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          />
        ))}
      </GoogleMap>
      
      {/* Central Marker */}
      <div className="center-marker">
        +
      </div>

      {/* Buttons at the bottom of the map */}
      <div className="map-button-container">
        <button className="map-button friend" onClick={() => handleAddPin('friend')}>
          Add Friend Location
        </button>
        <button className="map-button visit" onClick={() => handleAddPin('visit')}>
          Add Visit Area
        </button>
      </div>
    </div>
  );
}

export default React.memo(MapComponent);
