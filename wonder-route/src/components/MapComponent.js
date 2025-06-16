import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
  position: 'relative', // Needed for positioning child elements
  flex: 1
};

// Center on London for this London trip planner
const center = {
  lat: 51.5074, // London coordinates
  lng: -0.1278,
};

const libraries = ['places'];

// Different icons for different pin types
const friendIcon = {
  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
};

const visitIcon = {
  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
};

const searchIcon = {
  url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
};

function MapComponent({ friendLocations, visitLocations, addLocation, removeLocation }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [currentCenter, setCurrentCenter] = useState(center);
  const [searchResult, setSearchResult] = useState(null);
  const autocompleteRef = useRef(null);
  const searchInputRef = useRef(null);
  
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

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCurrentCenter(newCenter);
        setSearchResult(newCenter);
        map.panTo(newCenter);
        map.setZoom(15);
        
        // Clear the search input
        if (searchInputRef.current) {
          searchInputRef.current.value = '';
        }
      }
    }
  };

  const handleSearchMarkerClick = () => {
    setSearchResult(null);
  };

  if (loadError) return <div>Error loading maps. Please check your API key and enabled APIs.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;
  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onMapLoad}
        onIdle={onIdle}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
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
        {searchResult && (
          <Marker
            position={searchResult}
            icon={searchIcon}
            onClick={handleSearchMarkerClick}
          />
        )}
      </GoogleMap>
      
      {/* Search Bar */}
      <div className="search-container">
        <Autocomplete
          onLoad={autocomplete => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location..."
            className="search-input"
          />
        </Autocomplete>
      </div>
      
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
