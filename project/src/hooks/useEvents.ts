// src/hooks/useEvents.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  date: string;
  details: string;
  location: string;
  tag: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return events;
};