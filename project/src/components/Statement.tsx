// src/components/Statement.tsx
import React from 'react';

const Statement: React.FC = () => {
  return (
    <div className="statement flex justify-between items-center p-5 bg-gray-50 border border-gray-200 m-10">
      <div>
        <strong>Transformando el Futuro</strong>
        <div>Construye tu camino con UASD San Juan #VamosPorMás.</div>
      </div>
      <a href="#" className="statement-link text-[#003087] flex items-center gap-2">
        Conoce más →
      </a>
    </div>
  );
};

export default Statement;