import React, { useState } from 'react';

function Sidebar({
  friendLocations,
  visitLocations,
  searchedPlace,
  addLocation,
  removeLocation,
  onGenerate,
  itinerary,
  isLoading,
  view,
  onBack,
}) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [budget, setBudget] = useState('medium');
  const [wantsFood, setWantsFood] = useState(true);
  const [wantsCoffee, setWantsCoffee] = useState(true);

  const handleSubmit = () => {
    onGenerate({ startTime, endTime, budget, food: wantsFood, coffee: wantsCoffee });
  };

  const LocationList = ({ title, locations, type }) => (
    <div className="location-list">
      <h4>{title}</h4>
      {locations.length === 0 ? (
        <p>No locations added yet.</p>
      ) : (
        <ul>
          {locations.map((loc, index) => (
            <li key={index}>
              {loc.name.substring(0, 30)}...
              <button onClick={() => removeLocation(type, index)}>X</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (view === 'result') {
    return (
      <div className="sidebar">
        <h3>Your Itinerary</h3>
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <div className="itinerary-text">
             <pre>{itinerary}</pre>
          </div>
        )}
        <button onClick={onBack} disabled={isLoading}>
          ← Back to Planner
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <h3>Plan Your Day</h3>

      {searchedPlace && (
        <div className="searched-place-actions">
          <p>Add "{searchedPlace.name.substring(0, 40)}..." as:</p>
          <button onClick={() => addLocation('friend')}>Friend's Location</button>
          <button onClick={() => addLocation('visit')}>Area to Visit</button>
        </div>
      )}

      <LocationList title="Friends' Locations" locations={friendLocations} type="friend" />
      <LocationList title="Areas to Visit" locations={visitLocations} type="visit" />

      <div className="form-section">
        <h4>Preferences</h4>
        <label>
          Start Time:
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>
        <label>
          End Time:
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </label>
        <label>
          Budget:
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="low">Low ($)</option>
            <option value="medium">Medium ($$)</option>
            <option value="high">High ($$$)</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={wantsFood} onChange={(e) => setWantsFood(e.target.checked)} />
          Want to get Food?
        </label>
        <label>
          <input type="checkbox" checked={wantsCoffee} onChange={(e) => setWantsCoffee(e.target.checked)} />
          Want to get Coffee?
        </label>
      </div>

      <button className="generate-btn" onClick={handleSubmit}>
        Generate Itinerary
      </button>
    </div>
  );
}

export default Sidebar;
