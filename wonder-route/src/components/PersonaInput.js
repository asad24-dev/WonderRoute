import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  Grid,
  Tooltip,
  Divider,
  Badge,
  Avatar
} from '@mui/material';
import { FaUserPlus, FaUserMinus, FaUser } from 'react-icons/fa';

// Interests for the multi-select
const INTERESTS = [
  "History",
  "Art",
  "Food",
  "Architecture",
  "Shopping",
  "Museums",
  "Parks",
  "Theatre",
  "Music",
  "Markets",
  "Nightlife",
  "Photography",
  "Sightseeing",
  "Hidden Gems",
  "Local Experience"
];

// Function to generate a random avatar color
const getRandomColor = () => {
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
                  '#8bc34a', '#cddc39', '#ffc107', '#ff9800', '#ff5722'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Main Personas component
function PersonaInput({ onPersonasChange }) {
  // Default first persona
  const defaultPersona = {
    id: 1,
    name: "Traveler 1",
    budget: "medium",
    energy: 5,
    interests: ["History", "Food"],
    color: getRandomColor()
  };

  const [personas, setPersonas] = useState([defaultPersona]);
  const [nextId, setNextId] = useState(2);
  const [activePersona, setActivePersona] = useState(defaultPersona.id);
  
  // Update parent component when personas change
  React.useEffect(() => {
    onPersonasChange(personas);
  }, [personas, onPersonasChange]);
  
  // Add a new persona
  const addPersona = () => {
    const newPersona = {
      id: nextId,
      name: `Traveler ${nextId}`,
      budget: "medium",
      energy: 5,
      interests: [],
      color: getRandomColor()
    };
    
    setPersonas([...personas, newPersona]);
    setActivePersona(newPersona.id);
    setNextId(nextId + 1);
  };
  
  // Remove a persona
  const removePersona = (id) => {
    // Don't allow removing the only persona
    if (personas.length <= 1) return;
    
    const newPersonas = personas.filter(p => p.id !== id);
    setPersonas(newPersonas);
    
    // If the active persona was removed, set the first one as active
    if (activePersona === id) {
      setActivePersona(newPersonas[0].id);
    }
  };
  
  // Update a persona property
  const updatePersona = (id, field, value) => {
    setPersonas(personas.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };
  
  // Get the active persona object
  const getActivePersona = () => {
    return personas.find(p => p.id === activePersona) || personas[0];
  };
  
  // Handle interest selection/deselection
  const handleInterestsChange = (event) => {
    const selectedInterests = event.target.value;
    updatePersona(activePersona, 'interests', selectedInterests);
  };

  return (
    <Box>
      <Typography variant="h6">Traveler Personas</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Add details about each traveler to personalize the itinerary
      </Typography>      {/* Persona Selector */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#f8fbff' }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>Travel Group Members</Typography>
        <div className="persona-avatar-container">
          {personas.map((persona) => (
            <Box key={persona.id}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  personas.length > 1 && (
                    <IconButton 
                      size="small" 
                      onClick={() => removePersona(persona.id)}
                      sx={{ 
                        backgroundColor: 'white', 
                        width: 22, 
                        height: 22,
                        border: '1px solid #ddd',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          borderColor: '#ff4444'
                        } 
                      }}
                    >
                      <FaUserMinus size={12} color="error" />
                    </IconButton>
                  )
                }
              >
                <Avatar 
                  sx={{ 
                    bgcolor: persona.color,
                    cursor: 'pointer',
                    width: 50,
                    height: 50,
                    fontSize: '1.4rem',
                    boxShadow: activePersona === persona.id ? '0 0 0 4px #3f51b5' : '0 2px 5px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                  onClick={() => setActivePersona(persona.id)}
                >
                  {persona.name.substring(0, 1)}
                </Avatar>
              </Badge>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, fontSize: '0.7rem' }}>
                {persona.name.length > 10 ? `${persona.name.substring(0, 10)}...` : persona.name}
              </Typography>
            </Box>
          ))}
          
          <Tooltip title="Add Traveler">
            <Box sx={{ textAlign: 'center' }}>
              <IconButton 
                onClick={addPersona} 
                color="primary"
                sx={{
                  border: '2px dashed #3f51b5',
                  borderRadius: '50%',
                  width: 50,
                  height: 50,
                  '&:hover': {
                    backgroundColor: 'rgba(63, 81, 181, 0.1)'
                  }
                }}
              >
                <FaUserPlus size={20} />
              </IconButton>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, fontSize: '0.7rem' }}>
                Add Person
              </Typography>
            </Box>
          </Tooltip>
        </div>
      </Paper>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Active Persona Form */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Traveler Name"
            variant="outlined"
            size="small"
            value={getActivePersona().name}
            onChange={(e) => updatePersona(activePersona, 'name', e.target.value)}
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Budget</InputLabel>
              <Select
                value={getActivePersona().budget}
                onChange={(e) => updatePersona(activePersona, 'budget', e.target.value)}
                label="Budget"
              >
                <MenuItem value="low">Low Budget ($)</MenuItem>
                <MenuItem value="medium">Medium Budget ($$)</MenuItem>
                <MenuItem value="high">High Budget ($$$)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
            <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Energy Level</Typography>            <Box sx={{ px: 1, pt: 1, pb: 2 }} className="energy-slider-container">
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }} className="energy-slider-labels">
                <Typography variant="body2" fontWeight="500" color="textSecondary">Chill</Typography>
                <Typography variant="body2" fontWeight="500" color="textSecondary">Active</Typography>
              </Box>
              <Slider
                value={getActivePersona().energy}
                min={1}
                max={10}
                step={1}
                marks
                size="medium"
                onChange={(_, value) => updatePersona(activePersona, 'energy', value)}
                className="persona-slider"
                sx={{ 
                  '& .MuiSlider-thumb': {
                    width: 20,
                    height: 20
                  },
                  '& .MuiSlider-track': {
                    height: 10
                  },
                  '& .MuiSlider-rail': {
                    height: 10
                  },
                  '& .MuiSlider-mark': {
                    backgroundColor: '#bfbfbf',
                    height: 8,
                    width: 4,
                    marginTop: -3
                  },
                  '& .MuiSlider-markActive': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Interests</InputLabel>
              <Select
                multiple
                value={getActivePersona().interests}
                onChange={handleInterestsChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                label="Interests"
              >
                {INTERESTS.map((interest) => (
                  <MenuItem key={interest} value={interest}>
                    {interest}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default PersonaInput;
