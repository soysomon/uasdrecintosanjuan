import React from 'react';

interface Report {
  id: string;
  title: string;
  period: string;
  department: string;
  downloadUrl?: string;
}

const reports: Report[] = [
  {
    id: 'physical-plant',
    title: 'Empleados',
    period: '2018 - 2023',
    department: 'Departamento de Planta Física',
    downloadUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdfs/INFORME+PLANTA+F%C3%8DSICA+AGOSTO+2023.pdf'
  }
];

const primaryColor = '#A51E37'; // Rojo 
const secondaryColor = '#00316E'; // Azul institucional como alternativa

export function ReportsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Espaciador para compensar la barra de navegación fija */}
      <div className="pt-24 md:pt-28">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl mb-2">
            Empleados de la Institución
            </h1>
            <div className="w-16 h-1 bg-red-700 mb-6"></div>
            <p className="mt-4 max-w-2xl text-lg text-gray-500">
              Personal administrativo y académico de la UASD Recinto San Juan de la Maguana
            </p>

          </div>
        </div>

        {/* Reports Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-gray-200 hover:border-red-700 transition-colors duration-200"
              >
                <div className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-1">{report.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{report.period}</p>
                  <p className="text-gray-600 mb-6">{report.department}</p>

                  {report.downloadUrl && (
                    <a
                      href={report.downloadUrl}
                      className="inline-block text-red-700 hover:text-red-800 font-medium transition-colors"
                    >
                      Descargar informe →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}