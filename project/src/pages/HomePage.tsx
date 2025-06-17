// src/pages/HomePage.tsx
import React from 'react';
import Header from '../components/Header/Header';
import QuickLinks from '../components/QuickLinks';
import RecentNews from '../components/RecentNews'; 
import Statement from '../components/Statement';
import NewsSection from '../components/NewsSection';
import UniversityInfo from '../components/UniversityInfo';
import Sustainability from '../components/Sustainability';
import Events from '../components/Events';
import StatsSection from '../components/StatsSection';
import { SocialMediaSection } from '../components/SocialMediaSection';
import ChatBot from '../components/ChatBot';
import Innovations from '../components/Innovations'; // Added Innovations import
import PublicActivitiesCalendar from '../components/PublicActivitiesCalendar'; // Added Calendar import

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <QuickLinks />
      <RecentNews /> 
      <Statement />
      <UniversityInfo />
      <Events />
      <Innovations />
      <PublicActivitiesCalendar />
      <Sustainability />
      <StatsSection />
      <SocialMediaSection />
      <ChatBot />
    </div>
  );
};

export default HomePage;