import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button,
  IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Typography, Box, Snackbar, Alert,
  CircularProgress, Card, CardContent,
  Chip, Avatar, Grid, CardActionArea,
  useTheme, alpha, Container
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  Public as PublicIcon,
  Groups as GroupsIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Composant de remplacement pour motion.div
const MotionDiv = ({ children, initial, animate, transition, whileHover, whileTap, ...props }) => {
  const style = {
    transition: transition?.duration ? `all ${transition.duration}s ${transition.ease || 'ease'}` : undefined,
    ...(animate || {})
  };
  
  return (
    <div {...props} style={style}>
      {children}
    </div>
  );
};

const EventsPage = () => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });

  // Configuration Axios
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events/');
      setEvents(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async () => {
    try {
      console.log('Données envoyées:', formData);
      console.log('Token actuel:', localStorage.getItem('authToken'));
      
      const response = await api.post('/api/events/', formData);
      console.log('Réponse du serveur:', response.data);
      
      setSnackbar({
        open: true,
        message: 'Événement créé avec succès',
        severity: 'success'
      });
      setOpenDialog(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Réponse d\'erreur:', err.response?.data);
      
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || 'Erreur lors de la création',
        severity: 'error'
      });
    }
  };

  // Handle edit event
  const handleEditEvent = async () => {
    try {
      await api.put(`/api/events/${currentEvent.id}`, formData);
      setSnackbar({
        open: true,
        message: 'Événement modifié avec succès',
        severity: 'success'
      });
      setOpenEditDialog(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la modification',
        severity: 'error'
      });
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await api.delete(`/api/events/${id}`);
        setSnackbar({
          open: true,
          message: 'Événement supprimé avec succès',
          severity: 'success'
        });
        fetchEvents();
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Erreur lors de la suppression',
          severity: 'error'
        });
      }
    }
  };

  // Open edit dialog
  const openEdit = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description
    });
    setOpenEditDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: ''
    });
    setCurrentEvent(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Format short date
  const formatShortDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE dd MMMM', { locale: fr });
    } catch {
      return dateString;
    }
  };

  // Get event color based on date
  const getEventColor = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#9ca3af'; // Past event - gray
    if (diffDays === 0) return '#ef4444'; // Today - red
    if (diffDays <= 7) return '#10b981'; // This week - green
    return '#10b981'; // Future - green
  };

  // Get gradient based on event
  const getEventGradient = (event) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];
    return colors[event.id % colors.length];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column">
        <Box sx={{ 
          animation: 'spin 2s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#667eea' }} />
        </Box>
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary', fontFamily: 'Inter, sans-serif' }}>
          Chargement des événements...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' ? '#111827' : '#f9fafb',
      p: { xs: 2, md: 3 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Header with Stats - PLUS PETIT */}
        <MotionDiv
          style={{ 
            opacity: 0, 
            transform: 'translateY(-20px)',
            animation: 'fadeInUp 0.5s forwards'
          }}
        >
          <Card sx={{ 
            mb: 4, 
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : 'white',
            color: theme.palette.mode === 'dark' ? 'white' : '#111827',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 4px 20px rgba(0,0,0,0.3)' 
              : '0 4px 20px rgba(0,0,0,0.08)',
            border: theme.palette.mode === 'dark' ? '1px solid #374151' : 'none'
          }}>
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={2} gap={2}>
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Sora, sans-serif' }}>
                    Événements
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.7, fontFamily: 'Inter, sans-serif' }}>
                    Gérez et organisez vos événements
                  </Typography>
                </Box>
                <Avatar sx={{ 
                  width: 50, 
                  height: 50,
                  bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#f3f4f6',
                  color: theme.palette.mode === 'dark' ? '#d1d5db' : '#6b7280'
                }}>
                  <EventIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#f9fafb',
                    borderRadius: 2,
                    p: 2,
                    border: theme.palette.mode === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb'
                  }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.mode === 'dark' ? '#4b5563' : '#e5e7eb',
                        color: theme.palette.mode === 'dark' ? '#d1d5db' : '#6b7280',
                        width: 40, 
                        height: 40 
                      }}>
                        <CalendarIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          {events.length}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          Événements
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#f9fafb',
                    borderRadius: 2,
                    p: 2,
                    border: theme.palette.mode === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb'
                  }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ 
                        bgcolor: theme.palette.mode === 'dark' ? '#065f46' : '#d1fae5',
                        color: theme.palette.mode === 'dark' ? '#6ee7b7' : '#047857',
                        width: 40, 
                        height: 40 
                      }}>
                        <TrophyIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          {events.filter(e => new Date(e.date) >= new Date()).length}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          À venir
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </MotionDiv>

        {/* Action Bar */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={4} gap={3}>
          <Box display="flex" gap={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              startIcon={<EventIcon />}
              sx={{ 
                borderRadius: 2,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                ...(viewMode === 'grid' && {
                  bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#111827',
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#1f2937'
                  }
                })
              }}
            >
              Grille
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('list')}
              startIcon={<GroupsIcon />}
              sx={{ 
                borderRadius: 2,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                ...(viewMode === 'list' && {
                  bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#111827',
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#1f2937'
                  }
                })
              }}
            >
              Liste
            </Button>
          </Box>
          
          <MotionDiv
            style={{
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
              '&:active': { transform: 'scale(0.95)' }
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#111827',
                color: 'white',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#1f2937'
                }
              }}
            >
              Nouvel Événement
            </Button>
          </MotionDiv>
        </Box>

        {/* Error Message */}
        {error && (
          <MotionDiv
            style={{
              opacity: 0,
              transform: 'scale(0.9)',
              animation: 'scaleIn 0.3s forwards',
              marginBottom: '24px'
            }}
          >
            <Alert severity="error" sx={{ borderRadius: 2, fontFamily: 'Inter, sans-serif' }}>
              {error}
            </Alert>
          </MotionDiv>
        )}

        {/* Events Display */}
        {events.length === 0 ? (
          <MotionDiv
            style={{
              opacity: 0,
              animation: 'fadeIn 0.5s forwards'
            }}
          >
            <Card sx={{ 
              textAlign: 'center', 
              p: { xs: 4, md: 8 }, 
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : 'white',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 4px 20px rgba(0,0,0,0.3)' 
                : '0 4px 20px rgba(0,0,0,0.08)',
              border: theme.palette.mode === 'dark' ? '1px solid #374151' : 'none'
            }}>
              <EventIcon sx={{ fontSize: 80, color: theme.palette.mode === 'dark' ? '#4b5563' : '#d1d5db', mb: 3 }} />
              <Typography variant="h5" color="textSecondary" gutterBottom sx={{ fontFamily: 'Sora, sans-serif', mb: 2 }}>
                Aucun événement pour le moment
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4, fontFamily: 'Inter, sans-serif' }}>
                Créez votre premier événement et commencez à organiser
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#111827',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#1f2937'
                  }
                }}
              >
                Créer un événement
              </Button>
            </Card>
          </MotionDiv>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW - CARDS PLUS LARGES */
          <Grid container spacing={3}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={event.id}>
                <MotionDiv
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: `fadeInUp 0.3s ${index * 0.1}s forwards`,
                    height: '100%'
                  }}
                >
                  <Card sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 4px 15px rgba(0,0,0,0.3)' 
                      : '0 4px 15px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                    bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : 'white',
                    '&:hover': {
                      boxShadow: theme.palette.mode === 'dark' 
                        ? '0 8px 25px rgba(0,0,0,0.4)' 
                        : '0 8px 25px rgba(0,0,0,0.12)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    {/* Header avec date */}
                    <Box sx={{ 
                      height: '100px',
                      background: getEventGradient(event),
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      p: 2
                    }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'Sora, sans-serif', fontSize: '1.75rem' }}>
                        {new Date(event.date).getDate()}
                      </Typography>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
                        {format(new Date(event.date), 'MMM', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.8 }}>
                        {format(new Date(event.date), 'yyyy', { locale: fr })}
                      </Typography>
                    </Box>
                    
                    <CardContent sx={{ 
                      p: 3, 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Titre */}
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        gutterBottom 
                        sx={{ 
                          fontFamily: 'Sora, sans-serif',
                          mb: 2,
                          lineHeight: 1.3,
                          minHeight: '56px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {event.title}
                      </Typography>
                      
                      {/* Informations */}
                      <Box sx={{ mb: 3, flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                          <LocationIcon fontSize="small" color="action" sx={{ mt: 0.5, flexShrink: 0 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
                            {event.location}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <ScheduleIcon fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif' }}>
                            {event.time}
                          </Typography>
                        </Box>

                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            fontFamily: 'Inter, sans-serif',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mt: 1.5
                          }}
                        >
                          {event.description}
                        </Typography>
                      </Box>

                      {/* Footer avec actions */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                        <Chip 
                          label={new Date(event.date) >= new Date() ? "À venir" : "Passé"}
                          size="small"
                          sx={{
                            bgcolor: getEventColor(event.date),
                            color: 'white',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif',
                            height: '26px'
                          }}
                        />
                        
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => openEdit(event)}
                            sx={{ 
                              bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#f3f4f6',
                              color: theme.palette.mode === 'dark' ? '#d1d5db' : '#4b5563',
                              '&:hover': { 
                                bgcolor: theme.palette.mode === 'dark' ? '#4b5563' : '#e5e7eb'
                              },
                              width: 36,
                              height: 36
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteEvent(event.id)}
                            sx={{ 
                              bgcolor: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' },
                              width: 36,
                              height: 36
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </MotionDiv>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* LIST VIEW */
          <Box>
            {events.map((event, index) => (
              <MotionDiv
                key={event.id}
                style={{
                  opacity: 0,
                  transform: 'translateX(-20px)',
                  animation: `slideInLeft 0.3s ${index * 0.05}s forwards`
                }}
              >
                <Card sx={{ 
                  mb: 2, 
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                  bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : 'white',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 6px 20px rgba(0,0,0,0.3)' 
                      : '0 6px 20px rgba(0,0,0,0.08)'
                  }
                }}>
                  <Box sx={{ 
                    p: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    gap: 3
                  }}>
                    {/* Date Badge */}
                    <Box sx={{ 
                      minWidth: '100px',
                      textAlign: 'center',
                      bgcolor: getEventColor(event.date),
                      color: 'white',
                      py: 2,
                      px: 1,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'Sora, sans-serif' }}>
                        {new Date(event.date).getDate()}
                      </Typography>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                        {format(new Date(event.date), 'MMM', { locale: fr })}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.9 }}>
                        {format(new Date(event.date), 'yyyy', { locale: fr })}
                      </Typography>
                    </Box>

                    {/* Event Info */}
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} gap={1}>
                        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Sora, sans-serif' }}>
                          {event.title}
                        </Typography>
                        <Chip 
                          label={new Date(event.date) >= new Date() ? "À venir" : "Passé"}
                          size="small"
                          sx={{
                            bgcolor: getEventColor(event.date),
                            color: 'white',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif'
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'Inter, sans-serif' }}>
                        {event.description.length > 120 
                          ? `${event.description.substring(0, 120)}...` 
                          : event.description}
                      </Typography>
                      
                      <Box display="flex" flexWrap="wrap" gap={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>{event.location}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ScheduleIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>{event.time}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>{formatShortDate(event.date)}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box display="flex" gap={1} justifyContent={{ xs: 'flex-end', md: 'flex-start' }}>
                      <IconButton
                        onClick={() => openEdit(event)}
                        sx={{ 
                          bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#f3f4f6',
                          color: theme.palette.mode === 'dark' ? '#d1d5db' : '#4b5563',
                          '&:hover': { 
                            bgcolor: theme.palette.mode === 'dark' ? '#4b5563' : '#e5e7eb'
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteEvent(event.id)}
                        sx={{ 
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </MotionDiv>
            ))}
          </Box>
        )}

        {/* Create Event Dialog - CLEAN & COHESIVE 🎯 */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
              border: theme.palette.mode === 'dark' ? '1px solid #374151' : 'none',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
                : '0 10px 25px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          {/* Simple Clean Header */}
          <Box sx={{
            bgcolor: theme.palette.mode === 'dark' ? '#111827' : '#f9fafb',
            p: 4,
            borderBottom: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                width: 48, 
                height: 48
              }}>
                <AddIcon sx={{ fontSize: 24, color: theme.palette.mode === 'dark' ? '#d1d5db' : '#6b7280' }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ 
                  color: theme.palette.mode === 'dark' ? 'white' : '#111827',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: '-0.02em'
                }}>
                  Nouvel événement
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                  mt: 0.5,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Créez un événement mémorable
                </Typography>
              </Box>
            </Box>
          </Box>

          <DialogContent sx={{ p: 4, bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Titre */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Titre de l'événement
                </Typography>
                <TextField
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Conférence annuelle..."
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                      },
                      '&.Mui-focused': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af',
                          borderWidth: 2,
                        }
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                        borderWidth: 1,
                      }
                    }
                  }}
                />
              </Box>

              {/* Date et Heure */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="600" sx={{ 
                    mb: 1.5, 
                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Date
                  </Typography>
                  <TextField
                    fullWidth
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                        },
                        '&.Mui-focused': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                          '& fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af',
                            borderWidth: 2,
                          }
                        },
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                          borderWidth: 1,
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" sx={{ 
                    mb: 1.5, 
                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Heure
                  </Typography>
                  <TextField
                    fullWidth
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                        },
                        '&.Mui-focused': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                          '& fieldset': {
                            borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af',
                            borderWidth: 2,
                          }
                        },
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                          borderWidth: 1,
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Lieu */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Lieu
                </Typography>
                <TextField
                  fullWidth
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Paris, Salle A..."
                  InputProps={{
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af' }} />
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                      fontFamily: 'Inter, sans-serif',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                      },
                      '&.Mui-focused': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af',
                          borderWidth: 2,
                        }
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                        borderWidth: 1,
                      }
                    }
                  }}
                />
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  placeholder="Décrivez votre événement..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                      fontFamily: 'Inter, sans-serif',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                      },
                      '&.Mui-focused': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#9ca3af',
                          borderWidth: 2,
                        }
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                        borderWidth: 1,
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            p: 4, 
            pt: 2,
            bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
            borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
            gap: 2
          }}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.25,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '0.9375rem',
                color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleCreateEvent} 
              variant="contained"
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#111827',
                borderRadius: 2,
                px: 4,
                py: 1.25,
                fontWeight: 600,
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? '#374151' : '#1f2937',
                  boxShadow: 'none',
                }
              }}
            >
              Créer l'événement
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Event Dialog - CLEAN & COHESIVE 🎯 */}
        <Dialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
              border: theme.palette.mode === 'dark' ? '1px solid #374151' : 'none',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
                : '0 10px 25px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          {/* Simple Clean Header - Green */}
          <Box sx={{
            bgcolor: '#10b981',
            p: 4,
          }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 48, 
                height: 48
              }}>
                <EditIcon sx={{ fontSize: 24, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ 
                  color: 'white',
                  fontFamily: 'Sora, sans-serif',
                  letterSpacing: '-0.02em'
                }}>
                  Modifier l'événement
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  mt: 0.5,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Mettez à jour les détails
                </Typography>
              </Box>
            </Box>
          </Box>

          <DialogContent sx={{ p: 4, bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Titre */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Titre de l'événement
                </Typography>
                <TextField
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Conférence annuelle..."
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                      },
                      '&.Mui-focused': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                        '& fieldset': {
                          borderColor: '#10b981',
                          borderWidth: 2,
                        }
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                        borderWidth: 1,
                      }
                    }
                  }}
                />
              </Box>

              {/* Date et Heure */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="600" sx={{ 
                    mb: 1.5, 
                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Date
                  </Typography>
                  <TextField
                    fullWidth
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                        },
                        '&.Mui-focused': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                          '& fieldset': {
                            borderColor: '#10b981',
                            borderWidth: 2,
                          }
                        },
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                          borderWidth: 1,
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" sx={{ 
                    mb: 1.5, 
                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Heure
                  </Typography>
                  <TextField
                    fullWidth
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                        fontFamily: 'Inter, sans-serif',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                        },
                        '&.Mui-focused': {
                          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                          '& fieldset': {
                            borderColor: '#10b981',
                            borderWidth: 2,
                          }
                        },
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                          borderWidth: 1,
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Lieu */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Lieu
                </Typography>
                <TextField
                  fullWidth
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Paris, Salle A..."
                  InputProps={{
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, fontSize: 20, color: '#10b981' }} />
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                      fontFamily: 'Inter, sans-serif',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                      },
                      '&.Mui-focused': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                        '& fieldset': {
                          borderColor: '#10b981',
                          borderWidth: 2,
                        }
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                        borderWidth: 1,
                      }
                    }
                  }}
                />
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="body2" fontWeight="600" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  placeholder="Décrivez votre événement..."
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#111827' : 'white',
                      fontFamily: 'Inter, sans-serif',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb',
                      },
                      '&.Mui-focused': {
                        bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : 'white',
                        '& fieldset': {
                          borderColor: '#10b981',
                          borderWidth: 2,
                        }
                      },
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb',
                        borderWidth: 1,
                      }
                    }
                  }}
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            p: 4, 
            pt: 2,
            bgcolor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
            borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e5e7eb'}`,
            gap: 2
          }}>
            <Button 
              onClick={() => setOpenEditDialog(false)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.25,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '0.9375rem',
                color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleEditEvent} 
              variant="contained"
              sx={{
                bgcolor: '#10b981',
                borderRadius: 2,
                px: 4,
                py: 1.25,
                fontWeight: 600,
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#059669',
                  boxShadow: 'none',
                }
              }}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              alignItems: 'center',
              fontFamily: 'Inter, sans-serif'
            }}
            icon={snackbar.severity === 'success' ? <StarIcon /> : undefined}
          >
            <Typography fontWeight="medium" sx={{ fontFamily: 'Inter, sans-serif' }}>
              {snackbar.message}
            </Typography>
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default EventsPage;