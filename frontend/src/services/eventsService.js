// src/services/eventsService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Configuration axios avec token
const getAuthHeader = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const eventsService = {
  // Récupérer tous les événements
  async getAllEvents() {
    try {
      const response = await axios.get(`${API_URL}/api/events/`, getAuthHeader());
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur récupération événements:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur lors du chargement des événements'
      };
    }
  },

  // Participer à un événement (vous devrez créer cette route backend)
  async attendEvent(eventId) {
    try {
      const response = await axios.post(
        `${API_URL}/api/events/${eventId}/attend`,
        {},
        getAuthHeader()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur participation:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur lors de la participation'
      };
    }
  },

  // Annuler la participation (vous devrez créer cette route backend)
  async cancelAttendance(eventId) {
    try {
      const response = await axios.delete(
        `${API_URL}/api/events/${eventId}/attend`,
        getAuthHeader()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur annulation:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur lors de l\'annulation'
      };
    }
  }
};

export default eventsService;