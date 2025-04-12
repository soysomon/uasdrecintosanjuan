import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

const statistics = [
  { value: "500+", label: "Estudiantes" },
  { value: "10", label: "Programas Académicos" },
  { value: "50+", label: "Docentes" },
  { value: "1", label: "Campus" },
  { value: "2020", label: "Año de Fundación" }
];

const academicPrograms = [
  "Educación",
  "Psicología",
  "Derecho",
  "Contabilidad",
  "Administración de Empresas",
  "Mercadotecnia"
];

export function EliasPinaPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const aboutRef = useRef(null);
  const programsRef = useRef(null);
  const statItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    // Stats card animation
    gsap.fromTo(
      statsRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "back.out(1.7)" }
    );

    // Animate stat items one by one
    gsap.fromTo(
      statItemsRef.current,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1, 
        opacity: 1, 
        duration: 0.4, 
        stagger: 0.15, 
        delay: 1,
        ease: "power1.out"
      }
    );

    // About section animation on scroll
    gsap.fromTo(
      aboutRef.current,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
        }
      }
    );

    // Programs section animation on scroll
    gsap.fromTo(
      programsRef.current,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: programsRef.current,
          start: "top 80%",
        }
      }
    );

    // Program items staggered animation
    gsap.fromTo(
      "#program-items li",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: {
          trigger: programsRef.current,
          start: "top 70%",
        }
      }
    );

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with minimalist design */}
      <div className="relative h-screen bg-gray-50 overflow-hidden">
        {/* Minimalist background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-indigo-50 to-transparent opacity-50" />
        </div>

        {/* Content */}
        <div ref={heroRef} className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="w-full lg:w-1/2 pr-0 lg:pr-12">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              UASD <span className="text-indigo-600">Elías Piña</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl mb-12">
              Expandiendo las fronteras del conocimiento en la región fronteriza,
              llevando educación superior de calidad a nuevos horizontes.
            </p>
            <div className="flex space-x-4">
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                Explorar
              </button>
              <button className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                Contacto
              </button>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/uasd-elias-pi%C3%B1a.jpg"
                alt="UASD Elías Piña"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 -mt-12 lg:-mt-24">
        <div 
          ref={statsRef} 
          className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {statistics.map((stat, index) => (
              <div
                key={index}
                ref={el => statItemsRef.current[index] = el}
                className="p-4 text-center border-b-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-300"
              >
                <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* About Section */}
          <div ref={aboutRef} className="relative">
            <div className="h-1 w-24 bg-indigo-600 mb-8"></div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Sobre Nosotros</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              El SubCentro UASD Elías Piña representa la expansión estratégica de la 
              Universidad Autónoma de Santo Domingo hacia la región fronteriza, 
              brindando acceso a educación superior de calidad a las comunidades 
              de la provincia y áreas circundantes.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nuestro compromiso es formar profesionales competentes que contribuyan 
              al desarrollo socioeconómico de la región, fortaleciendo los lazos 
              comunitarios y promoviendo la excelencia académica.
            </p>
            <div className="mt-10">
              <button className="px-8 py-3 border-b-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                Conoce nuestra historia
              </button>
            </div>
          </div>

          {/* Programs Section */}
          <div ref={programsRef} className="relative">
            <div className="h-1 w-24 bg-indigo-600 mb-8"></div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Oferta Académica</h2>
            <ul id="program-items" className="space-y-5">
              {academicPrograms.map((program, index) => (
                <li key={index} className="group flex py-3 border-b border-gray-200 hover:border-indigo-600 transition-colors">
                  <span className="text-lg text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {program}
                  </span>
                  <span className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <button className="px-8 py-3 border-b-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors">
                Ver todos los programas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}