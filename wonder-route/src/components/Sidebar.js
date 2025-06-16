import React, { useState, useEffect } from 'react';
import PersonaInput from './PersonaInput';
import TimelineView from './TimelineView';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  CircularProgress,
  Radio,
  RadioGroup,
  Grid
} from '@mui/material';
import { FaMapMarkerAlt, FaWalking, FaBus, FaCar, FaTrash } from 'react-icons/fa';
import { MdDirectionsBike } from 'react-icons/md';
import { BsFillPeopleFill } from 'react-icons/bs';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '100%' }}
      {...other}
    >
      {value === index && <Box sx={{ p: 2, height: '100%' }}>{children}</Box>}
    </div>
  );
}

// Component for displaying locations
const LocationList = ({ title, locations, type, removeLocation }) => (
  <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
    <Typography variant="h6" fontSize={16} fontWeight="500" sx={{ mb: 1 }}>{title}</Typography>
    {locations.length === 0 ? (
      <Box sx={{
        p: 2,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 1,
        border: '1px dashed #ddd'
      }}>
        <Typography variant="body2" color="text.secondary">No locations added yet.</Typography>
      </Box>
    ) : (
      <List dense sx={{ maxHeight: '200px', overflowY: 'auto' }}>
        {locations.map((loc, index) => (
          <ListItem
            key={index}
            className="location-item"
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => removeLocation(type, index)}
                sx={{
                  color: '#d32f2f',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.1)'
                  }
                }}
              >
                <FaTrash size={16} />
              </IconButton>
            }
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&:hover': { backgroundColor: '#f5f9ff' }
            }}
          >
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{ maxWidth: '300px', textOverflow: 'ellipsis', overflow: 'hidden' }}
                >
                  {loc.name.length > 35 ? `${loc.name.substring(0, 35)}...` : loc.name}
                </Typography>
              }
              secondary={`${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`}
              secondaryTypographyProps={{ fontSize: '12px' }}
            />
          </ListItem>
        ))}
      </List>
    )}
  </Paper>
);


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
  const [tabValue, setTabValue] = useState(0);
  const [travelMode, setTravelMode] = useState('walking');
  const [travelRadius, setTravelRadius] = useState('5km');
  const [preferences, setPreferences] = useState({
    architecture: false,
    food: true,
    entertainment: false,
    museums: false,
    coffee: true,
    parks: false,
    shopping: false,
    markets: false,
    historicalSites: false,
    blackHistoryMonth: false
  });
  const [personas, setPersonas] = useState([]);
  const [dietaryNeeds, setDietaryNeeds] = useState('none');

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle checkbox preference changes
  const handlePreferenceChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.checked,
    });
  };

  // Handle persona changes from the PersonaInput component
  const handlePersonasChange = (newPersonas) => {
    setPersonas(newPersonas);
  };

  // Generate itinerary with all preferences
  const handleSubmit = () => {
    // Convert preferences object to array of selected items
    const preferencesList = Object.keys(preferences).filter(key => preferences[key]);

    onGenerate({
      startTime,
      endTime,
      budget,
      travelMode,
      travelRadius,
      preferences: preferencesList,
      dietaryNeeds,
      personas: personas
    });
  };

  // Ensure the tabs have enough space
  const TAB_HEIGHT = 48; // height of the tab bar
  const BUTTON_HEIGHT = 80; // height of the button container

  // Adjust the TabPanel component to have proper height calculations
  useEffect(() => {
    const adjustTabPanelHeight = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const tabPanels = document.querySelectorAll('.MuiTabPanel-root');
        const windowHeight = window.innerHeight;
        const titleHeight = document.querySelector('.sidebar h5')?.offsetHeight || 0;
        const tabsHeight = TAB_HEIGHT;
        const buttonContainerHeight = BUTTON_HEIGHT;

        // Calculate maximum available height for the tab panel
        const maxHeight = windowHeight - titleHeight - tabsHeight - buttonContainerHeight - 40; // 40px for padding

        tabPanels.forEach(panel => {
          panel.style.maxHeight = `${maxHeight}px`;
        });
      }
    };

    // Run on mount and window resize
    adjustTabPanelHeight();
    window.addEventListener('resize', adjustTabPanelHeight);

    // Clean up
    return () => window.removeEventListener('resize', adjustTabPanelHeight);
  }, []);


  // If we're showing results view
  if (view === 'result') {
    return (
      <div className="sidebar">
        {isLoading ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Generating your perfect London itinerary...</Typography>
          </Box>
        ) : (
          <TimelineView itineraryData={itinerary} onBack={onBack} />
        )}
      </div>
    );
  }

  // Planning view
  return (
    <div className="sidebar">
      <Typography variant="h5" sx={{ mb: 2 }}>Wonder Route: London Planner</Typography>

      {/* Tabs for organizing the sidebar */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Locations" />
          <Tab label="Preferences" />
          <Tab label="Personas" />
        </Tabs>
      </Box>

      {/* Location Tab */}
      <TabPanel value={tabValue} index={0}>
        {searchedPlace && (
          <Paper sx={{ p: 2, mb: 2, background: '#f5f7ff' }}>
            <Typography variant="body1" gutterBottom>
              Add "{searchedPlace.name.substring(0, 40)}..." as:
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<BsFillPeopleFill />}
                onClick={() => addLocation('friend')}
                size="small"
              >
                Friend's Location
              </Button>
              <Button
                variant="outlined"
                startIcon={<FaMapMarkerAlt />}
                onClick={() => addLocation('visit')}
                size="small"
              >
                Area to Visit
              </Button>
            </Box>
          </Paper>
        )}        <div className="location-list-container">
          <LocationList title="Friends' Locations" locations={friendLocations} type="friend" removeLocation={removeLocation} />
          <LocationList title="Areas to Visit" locations={visitLocations} type="visit" removeLocation={removeLocation} />
        </div>

        <Box mt={2}>
          <Typography variant="h6" fontSize={16}>Starting Options</Typography>
          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              value={travelRadius}
              onChange={(e) => setTravelRadius(e.target.value)}
              name="travel-radius"
            >
              <FormControlLabel value="5km" control={<Radio size="small" />} label="5km radius" />
              <FormControlLabel value="10km" control={<Radio size="small" />} label="10km radius" />
              <FormControlLabel value="30min" control={<Radio size="small" />} label="30 min travel time" />
            </RadioGroup>
          </FormControl>
        </Box>        <Box mt={3} mb={4}>
          <Typography variant="h6" fontSize={16} fontWeight="600" gutterBottom className="section-heading">Travel Mode</Typography>
          <div className="travel-mode-container">
            <Chip
              icon={<FaWalking />}
              label="Walking"
              onClick={() => setTravelMode('walking')}
              color={travelMode === 'walking' ? 'primary' : 'default'}
              size="medium"
              className={`travel-mode-chip ${travelMode === 'walking' ? 'selected' : ''}`}
              sx={{ my: 1 }}
            />
            <Chip
              icon={<FaBus />}
              label="Public Transport"
              onClick={() => setTravelMode('transit')}
              color={travelMode === 'transit' ? 'primary' : 'default'}
              size="medium"
              className={`travel-mode-chip ${travelMode === 'transit' ? 'selected' : ''}`}
              sx={{ my: 1 }}
            />
            <Chip
              icon={<FaCar />}
              label="Driving"
              onClick={() => setTravelMode('driving')}
              color={travelMode === 'driving' ? 'primary' : 'default'}
              size="medium"
              className={`travel-mode-chip ${travelMode === 'driving' ? 'selected' : ''}`}
              sx={{ my: 1 }}
            />
            <Chip
              icon={<MdDirectionsBike />}
              label="Cycling"
              onClick={() => setTravelMode('cycling')}
              color={travelMode === 'cycling' ? 'primary' : 'default'}
              size="medium"
              className={`travel-mode-chip ${travelMode === 'cycling' ? 'selected' : ''}`}
              sx={{ my: 1 }}
            />
          </div>
        </Box>
      </TabPanel>

      {/* Preferences Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>

        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Budget</InputLabel>
          <Select
            value={budget}
            label="Budget"
            onChange={(e) => setBudget(e.target.value)}
          >
            <MenuItem value="low">Low Budget ($)</MenuItem>
            <MenuItem value="medium">Medium Budget ($$)</MenuItem>
            <MenuItem value="high">High Budget ($$$)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <InputLabel>Dietary Needs</InputLabel>
          <Select
            value={dietaryNeeds}
            label="Dietary Needs"
            onChange={(e) => setDietaryNeeds(e.target.value)}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="vegetarian">Vegetarian</MenuItem>
            <MenuItem value="vegan">Vegan</MenuItem>
            <MenuItem value="halal">Halal</MenuItem>
            <MenuItem value="glutenFree">Gluten-Free</MenuItem>
            <MenuItem value="dairyFree">Dairy-Free</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h6" fontSize={16} sx={{ mb: 1 }}>Interests</Typography>
        <FormGroup>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={preferences.architecture} onChange={handlePreferenceChange} name="architecture" size="small" />}
                label="Architecture"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.food} onChange={handlePreferenceChange} name="food" size="small" />}
                label="Food & Dining"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.entertainment} onChange={handlePreferenceChange} name="entertainment" size="small" />}
                label="Entertainment"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.museums} onChange={handlePreferenceChange} name="museums" size="small" />}
                label="Museums"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.coffee} onChange={handlePreferenceChange} name="coffee" size="small" />}
                label="Coffee Shops"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={preferences.parks} onChange={handlePreferenceChange} name="parks" size="small" />}
                label="Parks & Nature"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.shopping} onChange={handlePreferenceChange} name="shopping" size="small" />}
                label="Shopping"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.markets} onChange={handlePreferenceChange} name="markets" size="small" />}
                label="Markets"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.historicalSites} onChange={handlePreferenceChange} name="historicalSites" size="small" />}
                label="Historical Sites"
              />
              <FormControlLabel
                control={<Checkbox checked={preferences.blackHistoryMonth} onChange={handlePreferenceChange} name="blackHistoryMonth" size="small" />}
                label="Black History Month"
              />
            </Grid>
          </Grid>
        </FormGroup>
      </TabPanel>

      {/* Personas Tab */}
      <TabPanel value={tabValue} index={2}>
        <PersonaInput onPersonasChange={handlePersonasChange} />
      </TabPanel>      {/* Generate Button - always visible */}      <div className="bottom-button-container">
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
            borderRadius: '8px',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 15px rgba(63, 81, 181, 0.4)',
            },
            transition: 'all 0.2s ease'
          }}
        >
          Generate Trip Plan
        </Button>
      </div>
    </div>
  );
}

// Ensure the tabs have enough space
// const TAB_HEIGHT = 48; // height of the tab bar
// const BUTTON_HEIGHT = 80; // height of the button container

// Adjust the TabPanel component to have proper height calculations
// React.useEffect(() => {
//   const adjustTabPanelHeight = () => {
//     const sidebar = document.querySelector('.sidebar');
//     if (sidebar) {
//       const tabPanels = document.querySelectorAll('.MuiTabPanel-root');
//       const windowHeight = window.innerHeight;
//       const titleHeight = document.querySelector('.sidebar h5')?.offsetHeight || 0;
//       const tabsHeight = TAB_HEIGHT; 
//       const buttonContainerHeight = BUTTON_HEIGHT;
      
//       // Calculate maximum available height for the tab panel
//       const maxHeight = windowHeight - titleHeight - tabsHeight - buttonContainerHeight - 40; // 40px for padding
      
//       tabPanels.forEach(panel => {
//         panel.style.maxHeight = `${maxHeight}px`;
//       });
//     }
//   };
  
//   // Run on mount and window resize
//   adjustTabPanelHeight();
//   window.addEventListener('resize', adjustTabPanelHeight);
  
//   // Clean up
//   return () => window.removeEventListener('resize', adjustTabPanelHeight);
// }, []);

export default Sidebar;
