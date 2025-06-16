import React, { useState, useRef, useCallback } from 'react';
// The import name has been corrected here
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 40.7128, // Default: New York City
  lng: -74.0060,
};

const libraries = ['places'];

function MapComponent({ friendLocations, visitLocations, onPlaceSelected }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const searchBoxRef = useRef(null);

  const onMapLoad = useCallback(map => {
    setMap(map);
  }, []);

  const onSearchBoxLoad = useCallback(ref => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = useCallback(() => {
    const places = searchBoxRef.current.getPlaces();
    const place = places[0];
    if (place && place.geometry && place.geometry.location) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      onPlaceSelected({
          name: place.formatted_address,
          geometry: place.geometry
      });
    }
  }, [map, onPlaceSelected]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onMapLoad}
    >
      {/* The component tag has been corrected here */}
      <StandaloneSearchBox
        onLoad={onSearchBoxLoad}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search for a location..."
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            marginTop: `10px`,
            marginLeft: `10px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        />
      </StandaloneSearchBox>
      {friendLocations.map((loc, index) => (
        <Marker key={`friend-${index}`} position={loc} label={`F${index + 1}`} />
      ))}
      {visitLocations.map((loc, index) => (
        <Marker key={`visit-${index}`} position={loc} label={`V${index + 1}`} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />
      ))}
    </GoogleMap>
  );
}

export default React.memo(MapComponent);
