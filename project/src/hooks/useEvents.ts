// src/hooks/useEvents.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_ROUTES from '../config/api';

interface Event {
  id: string;
  title: string;
  date: string;
  details: string;
  location: string;
  tag: string;
}

export const useEvents = () => {
  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_ROUTES.NEWS); // Cambia EVENTS por NEWS
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };

  return { fetchEvents };

};