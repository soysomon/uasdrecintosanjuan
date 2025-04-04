import React from 'react';
import { FileText, Download, Building2, Users, ClipboardList } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  period: string;
  department: string;
  icon: React.ReactNode;
  downloadUrl?: string;
}

const reports: Report[] = [
  {
    id: 'physical-plant',
    title: 'Informe Planta Física',
    period: '2018 - 2023',
    department: 'Departamento de Planta Física',
    icon: <Building2 className="w-6 h-6" />,
    downloadUrl: '#'
  },
  {
    id: 'ucotesis',
    title: 'Informe UCOTESIS',
    period: '2018 - 2023',
    department: 'Unidad de Coordinación de Tesis',
    icon: <ClipboardList className="w-6 h-6" />,
    downloadUrl: '#'
  },
  {
    id: 'human-resources',
    title: 'Informe Recursos Humanos',
    period: '2018 - 2023',
    department: 'Departamento de Recursos Humanos',
    icon: <Users className="w-6 h-6" />,
    downloadUrl: '#'
  }
];

export function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#2f2382] py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f2382]/95 to-[#2f2382]/70" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform translate-x-1/3 translate-y-1/3 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Informes Institucionales
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
              Informes presentados por las distintas unidades de UASD Recinto San Juan de la Maguana
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <div
              key={report.id}
              className="relative group bg-white rounded-lg shadow-xl overflow-hidden border border-[#2f2382]/10 hover:border-[#2f2382]/30 transition-all duration-300"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-[#2f2382] transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#2f2382] transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#2f2382] transform -translate-x-1/2 translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#2f2382] transform translate-x-1/2 translate-y-1/2" />

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#2f2382]/10 rounded-lg text-[#2f2382]">
                    {report.icon}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-[#2f2382]">{report.title}</h2>
                    <p className="text-sm text-gray-500">{report.period}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{report.department}</p>

                {report.downloadUrl && (
                  <a
                    href={report.downloadUrl}
                    className="inline-flex items-center px-4 py-2 border border-[#2f2382] text-sm font-medium rounded-md text-[#2f2382] hover:bg-[#2f2382] hover:text-white transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Informe
                  </a>
                )}
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f2382]/0 to-[#2f2382]/0 group-hover:from-[#2f2382]/5 group-hover:to-[#2f2382]/10 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}