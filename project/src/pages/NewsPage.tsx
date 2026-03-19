import React from 'react';
import NewsSection from '../components/NewsSection';

const NewsPage: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      <NewsSection />
    </div>
  );
};

export default NewsPage;