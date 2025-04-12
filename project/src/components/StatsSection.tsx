// src/components/StatsSection.tsx
import React, { useEffect, useRef } from 'react';
import { institutionalStats } from '../data/staticData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registramos el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Resetear los refs
  statsRefs.current = [];

  useEffect(() => {
    // Aseguramos que los refs estén disponibles
    if (!sectionRef.current) return;

    // Animación para el título
    gsap.fromTo(
      '.stats-title',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      }
    );

    // Animación para los stats individuales con efecto escalonado
    gsap.fromTo(
      statsRefs.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        }
      }
    );

    // Animamos cada contador individualmente
    institutionalStats.forEach((stat, index) => {
      const statElement = statsRefs.current[index];
      const valueElement = statElement?.querySelector('.stat-value');
      
      if (!valueElement) return;
      
      // Extraemos solo los números de la cifra
      const numericPart = stat.figure.replace(/[^\d]/g, '');
      const endValue = parseInt(numericPart, 10);
      const suffix = stat.figure.replace(/[\d,]/g, ''); // Guardamos el "+" u otros caracteres
      
      // Establecer un valor inicial de cero
      valueElement.textContent = '0';
      
      // Animamos el contador
      gsap.to(valueElement, {
        duration: 2,
        scrollTrigger: {
          trigger: statElement,
          start: 'top 80%'
        },
        onUpdate: function() {
          const progress = this.progress();
          const currentValue = Math.floor(endValue * progress);
          valueElement.textContent = currentValue.toLocaleString() + suffix;
        },
        onComplete: function() {
          // Aseguramos que el valor final sea exactamente el especificado
          valueElement.textContent = stat.figure;
        }
      });
    });
  }, []);

  // Función para agregar elementos al array de refs
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el) {
      statsRefs.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="stats-title text-3xl font-bold text-center mb-16 text-gray-800">
          <span className="inline-block border-b-2 border-[#003087] pb-2">UASD EN CIFRAS</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {institutionalStats.map((stat, index) => (
            <div 
              key={index} 
              ref={addToRefs}
              className="text-center relative group"
            >
              <div className="h-1 w-0 bg-[#003087] absolute -top-2 left-1/2 transform -translate-x-1/2 group-hover:w-16 transition-all duration-300"></div>
              <div className="stat-value text-5xl font-light text-[#003087] mb-3">{stat.figure}</div>
              <p className="text-sm uppercase tracking-wider text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;