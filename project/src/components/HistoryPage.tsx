import React from 'react';
import { Calendar, GraduationCap, Building2, Globe2 } from 'lucide-react';

const stats = [
  { label: 'Espacios para Docencia', value: '72' },
  { label: 'Provincias Atendidas', value: '3' },
  { label: 'Años de Servicio', value: '27+' },
  { label: 'Programas Académicos', value: '20+' },
];

export function HistoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Bauhaus-inspired design */}
      <div className="relative h-screen bg-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Geometric shapes inspired by Bauhaus */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600 transform translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-yellow-400 transform rotate-45" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <h1 className="text-6xl font-bold tracking-tighter text-gray-900 leading-none">
                Nuestra
                <span className="block text-blue-600">Historia</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Más de dos décadas formando profesionales y contribuyendo al desarrollo 
                de la región sur, con un compromiso inquebrantable con la excelencia académica.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent rounded-lg transform -rotate-6" />
              <img
                src="https://i.ibb.co/p6WHvyXS/uasd.jpg"
                alt="UASD San Juan Campus"
                className="relative rounded-lg shadow-2xl transform rotate-3 transition-transform hover:rotate-0 duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Bauhaus-inspired design */}
      <div className="relative bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`relative overflow-hidden rounded-lg p-8 ${
                  index % 4 === 0 ? 'bg-red-600' :
                  index % 4 === 1 ? 'bg-blue-600' :
                  index % 4 === 2 ? 'bg-yellow-400' :
                  'bg-black'
                }`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 transform translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full" />
                <dt className="text-lg font-medium text-white">{stat.label}</dt>
                <dd className="mt-4 text-4xl font-extrabold text-white">{stat.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200" />
          
          {/* Timeline items */}
          <div className="space-y-24">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="lg:text-right">
                  <h3 className="text-2xl font-bold text-gray-900">1996</h3>
                  <p className="mt-3 text-gray-600">
                    Fundación del Recinto UASD San Juan, marcando el inicio de una nueva era
                    en la educación superior de la región sur.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-0 w-4 h-4 bg-red-600 transform rotate-45" />
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900">Hitos Iniciales</h4>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li>• Primeras aulas inauguradas</li>
                      <li>• Inicio de programas académicos básicos</li>
                      <li>• Establecimiento de la estructura administrativa</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full border-4 border-white" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="lg:text-right order-2 lg:order-1">
                  <div className="relative">
                    <div className="absolute -right-8 top-0 w-4 h-4 bg-blue-600 transform rotate-45" />
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900">Expansión Académica</h4>
                      <ul className="mt-4 space-y-2 text-gray-600">
                        <li>• Ampliación de oferta académica</li>
                        <li>• Nuevas instalaciones y laboratorios</li>
                        <li>• Fortalecimiento de la investigación</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl font-bold text-gray-900">2010</h3>
                  <p className="mt-3 text-gray-600">
                    Período de significativa expansión y modernización de las instalaciones
                    del recinto.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                <div className="w-6 h-6 bg-red-600 rounded-full border-4 border-white" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="lg:text-right">
                  <h3 className="text-2xl font-bold text-gray-900">Actualidad</h3>
                  <p className="mt-3 text-gray-600">
                    Centro de excelencia académica y referente en la formación profesional
                    de la región sur.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-0 w-4 h-4 bg-yellow-400 transform rotate-45" />
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900">Logros Actuales</h4>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li>• Más de 20 programas académicos</li>
                      <li>• Infraestructura moderna y equipada</li>
                      <li>• Impacto significativo en el desarrollo regional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}