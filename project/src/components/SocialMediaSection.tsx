// src/components/SocialMediaSection.tsx
import React, { useEffect, useRef } from 'react';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registramos el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/uasdrecintosanjuan', icon: Facebook },
  { name: 'Twitter', url: 'https://twitter.com/UASDSanJuan_', icon: Twitter },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCXk2XaQDLJlzZ3JYltFFP4Q', icon: Youtube },
  { name: 'Instagram', url: 'https://www.instagram.com/uasdsanjuan/', icon: Instagram },
];

export function SocialMediaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dotsRefs = useRef<SVGSVGElement[]>([]);

  // Resetear los refs de los puntos
  dotsRefs.current = [];

  // Función para agregar los SVGs al array de refs
  const addDotRef = (el: SVGSVGElement | null) => {
    if (el && !dotsRefs.current.includes(el)) {
      dotsRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    // Crear animación para el título y subtítulo
    gsap.fromTo(
      titleRef.current,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        }
      }
    );

    gsap.fromTo(
      subtitleRef.current,
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        }
      }
    );

    // Animación de los iconos sociales
    gsap.fromTo(
      '.social-item',
      { y: 40, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: iconsRef.current,
          start: 'top 80%'
        }
      }
    );

    // Animación de los puntos de fondo
    dotsRefs.current.forEach((dot, index) => {
      // Animación inicial de opacidad
      gsap.fromTo(
        dot,
        { opacity: 0 },
        { 
          opacity: 0.2 + (index % 3) * 0.1, 
          duration: 1,
          delay: index * 0.05,
          ease: 'power1.inOut'
        }
      );

      // Animación perpetua de movimiento
      gsap.to(dot, {
        y: `${(index % 2 === 0) ? '+=' : '-='}${10 + (index % 5) * 5}`,
        x: `${(index % 3 === 0) ? '+=' : '-='}${5 + (index % 4) * 5}`,
        rotation: (index % 2 === 0) ? 180 : -180,
        repeat: -1,
        yoyo: true,
        duration: 3 + (index % 5),
        ease: 'sine.inOut'
      });
    });

    // Efecto hover para los iconos de redes sociales
    const socialItems = document.querySelectorAll('.social-item');
    socialItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item.querySelector('.icon-container'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power1.out'
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item.querySelector('.icon-container'), {
          scale: 1,
          duration: 0.3,
          ease: 'power1.in'
        });
      });
    });

  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-[#003087]">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <svg 
            key={i}
            ref={addDotRef}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0,
              width: `${10 + Math.random() * 20}px`,
              height: `${10 + Math.random() * 20}px`,
            }}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" fill="#ffffff" />
          </svg>
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl font-bold text-white">Síguenos en Redes Sociales</h2>
          <p ref={subtitleRef} className="mt-4 text-xl text-blue-100 opacity-90">
            Mantente conectado con nuestra comunidad universitaria
          </p>
        </div>
        <div ref={iconsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {socialLinks.map((social, index) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-item group relative flex flex-col items-center p-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg border border-white border-opacity-20 transition-all duration-300 hover:bg-opacity-15"
            >
              <div className="icon-container p-4 mb-3 rounded-full bg-white bg-opacity-20 transition-all duration-300">
                <social.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white">
                {social.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}