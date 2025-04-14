import React from 'react';
import { Award, GraduationCap, BookOpen, Beaker, Building2, MapPin, ExternalLink, Printer, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DirectorOfficePage() {
  return (
    <div className="min-h-screen bg-white">
   {/* Header más alto */}
   <br></br>
<div className="relative bg-[#1e429a] py-20 mt-09 z-10 shadow-md min-h-[100px] flex items-center">
  <div className="max-w-6xl mx-auto px-6 lg:px-8">
    <br></br>
    <br></br>
    <br></br>
    <h1 className="text-2xl sm:text-3xl font-bold text-white">
      DESPACHO DEL RECTOR
    </h1>
    <div className="flex text-white/80 text-sm mt-2">
      <Link to="/" className="hover:text-white">Inicio</Link>
      <span className="mx-2">/</span>
      <Link to="/sobre-nosotros" className="hover:text-white">Sobre Nosotros</Link>
      <span className="mx-2">/</span>
      <span>Despacho del Rector</span>
    </div>
  </div>
</div>



      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <br></br>
          <br></br>
          <h2 className="text-2xl font-bold text-[#003366] mb-4 pb-2 border-b-2 border-[#003366]">
            Despacho del Rector
          </h2>
          <div className="flex gap-2 mb-6">
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded">
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded">
              <Mail className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column with main content */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-[#003366] mb-4">
              Dr. Carlos Manuel Sánchez De Óleo
            </h3>
            <p className="text-lg text-[#333333] font-medium mb-4">
              Rector UASD-Recinto San Juan de la Maguana
            </p>

            <p className="text-base text-gray-700 mb-4">
              Carlos Manuel Sánchez De Óleo es un reconocido académico, matemático e investigador que se ha destacado por su trabajo en el ámbito científico y universitario. Con un Doctorado en Matemáticas y amplia experiencia en investigación, el Dr. Sánchez De Óleo fue designado Director del Recinto UASD-San Juan de la Maguana en 2018.
            </p>
            
            <p className="text-base text-gray-700 mb-6">
              El 15 de enero de 2018 fue designado mediante resolución del Consejo Universitario como Director del Recinto UASD-San Juan, convirtiéndose en uno de los gestores académicos más destacados de la región sur.
            </p>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#003366] mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Educación
              </h3>
              <ul className="list-none space-y-2">
                {[
                  'Doctorado en Matemáticas, Universidad Politécnica de Valencia, España (2015)',
                  'Maestría en Física, UASD (2010)',
                  'Maestría en Matemáticas, UASD (2008)',
                  'Ingeniería Civil, INTEC-INCE (2005)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#003366] mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#003366] mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Idiomas
              </h3>
              <p className="text-gray-700">Español • Inglés • Francés</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#003366] mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Experiencia Profesional
              </h3>
              <ul className="list-none space-y-3">
                {[
                  'Director UASD-Recinto San Juan (desde 2018)',
                  'Profesor-Investigador UASD (desde 2004)',
                  'Investigador FONDOCYT (desde 2018)',
                  'Profesor ISFODOSU (desde 2016)',
                  'Coordinador de Investigación, Facultad de Ciencias (2012-2018)',
                  'Consejero en proyectos nacionales e internacionales de investigación científica',
                  'Secretario de Asuntos Académicos, Asociación de Profesores (2010-2012)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#003366] mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#003366] mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Reconocimientos
              </h3>
              <ul className="list-none space-y-3">
                {[
                  'Medalla al Mérito Científico, Ministerio de Educación Superior, Ciencia y Tecnología (2020)',
                  'Premio Nacional de Matemáticas Aplicadas (2018)',
                  'Reconocimiento a la Excelencia Académica, UASD (2016)',
                  'Investigador Destacado del Año, FONDOCYT (2019)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#003366] mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column with photo and events */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <div className="bg-gray-100 p-1">
                <img
                  src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
                  alt="Dr. Carlos Manuel Sánchez De Óleo"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 mb-8">
              <h3 className="text-lg font-bold text-[#003366] p-4 border-b border-gray-200 bg-gray-100">
                Participación en Eventos Internacionales
              </h3>
              <div className="p-4">
                <ul className="list-none space-y-4">
                  {[
                    {
                      event: 'Foro Internacional sobre Matemáticas Aplicadas',
                      location: 'Madrid, España',
                      year: '2023'
                    },
                    {
                      event: 'Conferencia Internacional de Física Teórica',
                      location: 'Ginebra, Suiza',
                      year: '2022'
                    },
                    {
                      event: 'Congreso Latinoamericano de Educación Superior',
                      location: 'Lima, Perú',
                      year: '2021'
                    },
                    {
                      event: 'Simposio de Investigación Científica',
                      location: 'Valencia, España',
                      year: '2020'
                    },
                    {
                      event: 'Congreso Internacional de Matemáticas',
                      location: 'Toronto, Canadá',
                      year: '2019'
                    }
                  ].map((item, index) => (
                    <li key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                      <p className="font-medium text-gray-800 mb-1">{item.event}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </p>
                      <p className="text-sm text-gray-600">({item.year})</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200">
              <h3 className="text-lg font-bold text-[#003366] p-4 border-b border-gray-200 bg-gray-100">
                Investigaciones Destacadas
              </h3>
              <div className="p-4">
                <ul className="list-none space-y-4">
                  {[
                    {
                      title: 'Modelos matemáticos para el estudio de la propagación de enfermedades',
                      journal: 'Journal of Mathematical Biology',
                      year: '2022'
                    },
                    {
                      title: 'Análisis numérico de ecuaciones diferenciales parciales',
                      journal: 'Applied Mathematics and Computation',
                      year: '2020'
                    },
                    {
                      title: 'Métodos computacionales en física de partículas',
                      journal: 'Physical Review D',
                      year: '2018'
                    }
                  ].map((item, index) => (
                    <li key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                      <p className="font-medium text-gray-800 mb-1">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.journal}</p>
                      <p className="text-sm text-gray-600">({item.year})</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-[#003366] py-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          ¡Vamos por Más!
        </h2>
      </div>

    </div>
  );
}