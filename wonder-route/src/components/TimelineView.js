import React, { useState } from 'react';
import { 
  VerticalTimeline, 
  VerticalTimelineElement 
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { 
  FaWalking, 
  FaCoffee, 
  FaUtensils, 
  FaCamera, 
  FaMapMarkerAlt,
  FaInfoCircle,
  FaInstagram,
  FaCalendarPlus,
  FaStar, FaStarHalfAlt, FaRegStar // Added for star ratings
} from 'react-icons/fa';
import { MdAttachMoney, MdDirectionsTransit } from 'react-icons/md';
import { Button, Paper, Typography, Box, Chip, Divider, Tooltip, Modal, Rating } from '@mui/material'; // Added Rating
import { getCaption, getTrivia } from '../api';

// Styles for the timeline component
const styles = {
  timelineContainer: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    margin: '20px 0',
    overflowY: 'auto',
    maxHeight: '80vh'
  },
  header: {
    textAlign: 'center',
    margin: '0 0 20px 0',
    color: '#3f51b5'
  },
  meetingPoint: {
    backgroundColor: '#e8f5e9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  summary: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px'
  },
  chip: {
    margin: '0 5px 5px 0'
  },
  caption: {
    fontStyle: 'italic',
    backgroundColor: '#fff8e1',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px'
  },
  funFact: {
    padding: '10px',
    backgroundColor: '#e8eaf6',
    borderRadius: '5px',
    marginTop: '10px'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    padding: '20px'
  }
};

// Function to get icon based on activity type
const getActivityIcon = (activity) => {
  const activityLower = activity.toLowerCase();
  
  if (activityLower.includes('coffee') || activityLower.includes('café')) {
    return <FaCoffee />;
  } else if (activityLower.includes('lunch') || activityLower.includes('dinner') || activityLower.includes('food')) {
    return <FaUtensils />;
  } else if (activityLower.includes('walk') || activityLower.includes('stroll')) {
    return <FaWalking />;
  } else if (activityLower.includes('train') || activityLower.includes('bus') || activityLower.includes('tube')) {
    return <MdDirectionsTransit />;
  } else {
    return <FaMapMarkerAlt />;
  }
};

// Function to format cost display
const formatCost = (cost) => {
  if (!cost) return 'Free';
  return typeof cost === 'string' ? cost : `£${cost}`;
};

// Function to generate random star rating
const generateRandomRating = () => {
  const ratings = [4,4.1,4.2,4.3,4.4,4.5,4.8];
  return ratings[Math.floor(Math.random() * ratings.length)];
};

// New component for individual timeline items
const TimelineItem = ({ item, index, handleOpenMaps, handleGenerateTrivia, handleGenerateCaption }) => {
  const itemType = item.activity ? item.activity.toLowerCase() : "";
  const isRestaurant = itemType.includes('lunch') || itemType.includes('dinner') || itemType.includes('food') || itemType.includes('coffee') || itemType.includes('café');
  const [rating] = useState(isRestaurant ? generateRandomRating() : null);
  return (
    <VerticalTimelineElement
      key={index} // It's better to pass key from parent when mapping
      date={item.time}
      icon={getActivityIcon(item.activity)}
      iconStyle={{ background: '#3f51b5', color: '#fff' }}
    >
      <Typography variant="h6" className="vertical-timeline-element-title">
        {item.activity}
      </Typography>
      <Typography variant="subtitle1" className="vertical-timeline-element-subtitle">
        {item.location}
      </Typography>
      {isRestaurant && rating !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Rating name={`rating-${index}`} value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>({rating})</Typography>
        </Box>
      )}
      <Typography variant="body2" color="textSecondary">
        Duration: {item.duration}
      </Typography>
      
      <Box mt={1} mb={1} display="flex" flexWrap="wrap" alignItems="center">
        <Chip
          icon={<MdAttachMoney />}
          label={formatCost(item.cost)}
          size="small"
          style={styles.chip}
          color="primary"
          variant="outlined"
        />
        
        {isRestaurant && (
        <Chip
          label="Sponsored"
          size="small"
          style={styles.chip}
          color="primary"
          variant="outlined"
        />
      )}
        {item.mapsUrl && (
            <Tooltip title="View on Map">
                <Chip
                icon={<FaMapMarkerAlt />}
                label="Map"
                size="small"
                style={styles.chip}
                onClick={() => handleOpenMaps(item.mapsUrl)}
                color="secondary"
                variant="outlined"
                />
            </Tooltip>
        )}
      </Box>
      
      <Divider style={{ margin: '10px 0' }}/>
      <Typography variant="body1">{item.description}</Typography>
      
      <Box mt={2} display="flex" justifyContent="space-between" flexWrap="wrap">
        <Button 
          size="small" 
          variant="outlined"
          startIcon={<FaInfoCircle />}
          onClick={() => handleGenerateTrivia(item.location)}
        >
          Fun Fact
        </Button>
        
        <Button 
          size="small" 
          variant="outlined"
          startIcon={<FaInstagram />}
          onClick={() => handleGenerateCaption(item.location, item.activity)}
        >
          Photo Caption
        </Button>
        
        {item.photoOpp && (
          <Tooltip title={item.photoOpp}>
            <Chip
              icon={<FaCamera />}
              label="Photo Spot"
              size="small"
              style={styles.chip}
            />
          </Tooltip>
        )}
      </Box>
    </VerticalTimelineElement>
  );
};

// Main Timeline component
function TimelineView({ itineraryData, onBack }) {
  const [activeCaption, setActiveCaption] = useState("");
  const [activeFact, setActiveFact] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  
  const handleGenerateCaption = async (location, activity) => {
    try {
      setModalTitle("Instagram Caption");
      setModalContent("Generating caption...");
      setModalOpen(true);
      const caption = await getCaption(location, activity);
      setModalContent(caption);
    } catch (error) {
      setModalContent("Failed to generate caption. Please try again.");
    }
  };
  
  const handleGenerateTrivia = async (location) => {
    try {
      setModalTitle("Fun Fact");
      setModalContent("Loading fun fact...");
      setModalOpen(true);
      const fact = await getTrivia(location);
      setModalContent(fact);
    } catch (error) {
      setModalContent("Failed to load trivia. Please try again.");
    }
  };
  
  const handleOpenMaps = (mapsUrl) => {
    window.open(mapsUrl, '_blank');
  };
  
  const exportToCalendar = () => {
    // This would be implemented with Google Calendar API
    alert("Calendar export feature coming soon!");
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  // If there's no itinerary data yet
  if (!itineraryData) {
    return (
      <div style={styles.timelineContainer}>
        <Typography variant="h5">No itinerary available yet.</Typography>
        <Button onClick={onBack} variant="contained" color="primary">
          Back to Planning
        </Button>
      </div>
    );
  }
  
  // If the data is in text format rather than structured JSON
  if (itineraryData.format === 'text') {
    return (
      <div style={styles.timelineContainer}>
        <Typography variant="h4" style={styles.header}>Your London Itinerary</Typography>
        <Paper elevation={2} style={{ padding: '20px', whiteSpace: 'pre-line' }}>
          {itineraryData.itinerary}
        </Paper>
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button onClick={onBack} variant="contained" color="primary">
            Back to Planning
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<FaCalendarPlus />}
            onClick={exportToCalendar}
          >
            Export to Calendar
          </Button>
        </Box>
      </div>
    );
  }
  
  // For structured JSON format
  return (
    <div style={styles.timelineContainer}>
      <Typography variant="h4" style={styles.header}>Your London Adventure</Typography>
      
      {/* Meeting Point Section */}
      {itineraryData.meetingPoint && (
        <Paper elevation={3} style={styles.meetingPoint}>
          <Typography variant="h6">Meeting Point: {itineraryData.meetingPoint.name}</Typography>
          <Typography variant="body1">{itineraryData.meetingPoint.location}</Typography>
          <Typography variant="body1">Time: {itineraryData.meetingPoint.time}</Typography>
          <Typography variant="body2" color="textSecondary">{itineraryData.meetingPoint.reason}</Typography>
          
          {itineraryData.meetingPoint.mapsUrl && (
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<FaMapMarkerAlt />}
              onClick={() => handleOpenMaps(itineraryData.meetingPoint.mapsUrl)}
              style={{ marginTop: '10px' }}
            >
              View on Map
            </Button>
          )}
        </Paper>
      )}
      
      {/* Timeline */}
      <VerticalTimeline layout="1-column-left">
        {itineraryData.itinerary && itineraryData.itinerary.map((item, index) => (
          <TimelineItem 
            key={index} 
            item={item} 
            index={index} 
            handleOpenMaps={handleOpenMaps} 
            handleGenerateTrivia={handleGenerateTrivia}
            handleGenerateCaption={handleGenerateCaption}
          />
        ))}
      </VerticalTimeline>
      
      {/* Summary */}
      {itineraryData.summary && (
        <Paper elevation={3} style={styles.summary}>
          <Typography variant="h6">Trip Summary</Typography>
          <Typography variant="body1">{itineraryData.summary}</Typography>
          <Typography variant="body1" style={{ marginTop: '10px' }}>
            <strong>Estimated Total Cost:</strong> {itineraryData.totalCost}
          </Typography>
        </Paper>
      )}
      
      {/* Action Buttons */}
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button onClick={onBack} variant="contained" color="primary">
          Back to Planning
        </Button>
        <Button 
          variant="outlined" 
          color="secondary"
          startIcon={<FaCalendarPlus />}
          onClick={exportToCalendar}
        >
          Export to Calendar
        </Button>
      </Box>
      
      {/* Modal for captions and trivia */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={styles.modal}>
          <Typography id="modal-title" variant="h6" component="h2">
            {modalTitle}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalContent}
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={closeModal}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default TimelineView;
