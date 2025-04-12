import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, ExternalLink, Search } from 'lucide-react';
import axios from 'axios';
import type { NavItem } from '../types';

// Interfaces para typings
interface MemoriaItem {
  _id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  order: number; 
}

interface NavChildItem {
  label: string;
  href: string;
}

const baseNavItems: NavItem[] = [
  {
    label: 'General',
    href: '/',
    children: [
      { label: 'Historia', href: '/inicio/historia' },
      { label: 'Filosofía', href: '/inicio/filosofia' },
      { label: 'Misión, Visión y Valores', href: '/inicio/mision-vision' },
      { label: 'Proyectos y Resoluciones', href: '/inicio/proyectos' },
      { label: 'Informes', href: '/inicio/informes' },
      { label: 'UASD Elías Piña', href: '/inicio/elias-pina' },
      { label: 'Consejo Directivo', href: '/inicio/consejo-directivo' },
      { label: 'Unidades', href: '/inicio/unidades' },
      { label: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
     // { label: 'Dispensario Médico', href: '/inicio/dispensario' },
    ],
  },
  { label: 'Noticias', href: '/noticias' },
  {
    label: 'Carreras',
    href: '/carreras',
    children: [
      { label: 'Grado', href: '/carreras/grado' },
      { label: 'Postgrado', href: '/carreras/postgrado' },
     /* { label: 'Doctorado', href: '/carreras/doctorado' }, */
    ],
  },
  { label: 'Tour Virtual', href: '/TourVirtual' },
  { label: 'Docentes', href: '/docentes-page' },
  { label: 'Contacto', href: '/contacto' },
  {
    label: 'Transparencia',
    href: '/transparencia',
    children: [
      { label: 'Estados Financieros', href: '/transparencia/estados-financieros' },
      { label: 'Memorias', href: '/memorias' },
    ],
  },
];

const serviceLinks = [
  { id: 'autoservicio', label: 'Autoservicio', href: 'https://eis.uasd.edu.do/authenticationendpoint/login.do?Name=PreLoginRequestProcessor&commonAuthCallerPath=%252Fcas%252Flogin&forceAuth=true&passiveAuth=false&service=https%3A%2F%2Fssb.uasd.edu.do%3A443%2Fssomanager%2Fc%2FSSB&tenantDomain=carbon.super&sessionDataKey=e0e43776-93ba-4091-b3e5-5b218f8a6d68&relyingParty=SSO+Manager+PROD&type=cas&sp=SSO+Manager+PROD&isSaaSApp=false&authenticators=BasicAuthenticator:LOCAL', description: 'Portal de autoservicio estudiantil' },
  { id: 'admisiones', label: 'Admisiones', href: 'https://uasd.edu.do/admisiones/', description: 'Proceso de admisión' },
  { id: 'pagos', label: 'Pago en línea', href: 'https://soft.uasd.edu.do/pagoenlinea/', description: 'Sistema de pagos' },
];

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navItems, setNavItems] = useState<NavItem[]>(baseNavItems);



  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!activeDropdown) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  return (
    <nav className="fixed top-0 left-0 right-0" style={{ zIndex: 9999 }}>
    {/* Barra de Servicios */}
<div className={`transition-all duration-300 ${isScrolled ? 'bg-[#003087] py-0.5' : 'bg-[#003087] py-1'} border-b border-[#003087]`}>
  <div className="max-w-7xl mx-auto px-4 flex justify-end">
    {serviceLinks.map((link) => (
      <a 
        key={link.id} 
        href={link.href} 
        className="text-sm text-white hover:text-gray-200 px-3 py-0 flex items-center transition-colors" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {link.label}
        <ExternalLink size={14} className="ml-1 opacity-75" />
      </a>
    ))}
  </div>
</div>


      {/* Barra de Navegación Principal */}
      <div className={`transition-all duration-300 ${isScrolled ? 'py-2 bg-white shadow-sm' : 'py-3 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
         {/* Logo */}
<Link to="/" className="flex-shrink-0 mx-auto lg:-ml-8 lg:mx-0">
  <img
    src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/LOGO-RECINTO-UASD-SAN-JUAN-AZUL-2.png"
    alt="UASD Recinto San Juan"
    className="h-14 md:h-16 lg:h-18 transition-all"
  />
</Link>

          {/* Menú Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Búsqueda */}
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
            
            {/* Ítems de navegación */}
            {navItems.map((item) => (
              <div key={item.href} className="relative group dropdown-container">
                {item.children ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#003087] hover:bg-gray-50 transition-colors flex items-center"
                    aria-expanded={activeDropdown === item.label}
                    aria-controls={`dropdown-${item.label}`}
                  >
                    {item.label}
                    <ChevronDown 
                      size={16} 
                      className={`ml-1 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                    />
                  </button>
                ) : (
                  <Link 
                    to={item.href} 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#003087] hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && activeDropdown === item.label && (
                  <div 
                    id={`dropdown-${item.label}`}
                    className="absolute z-50 left-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all animate-fadeIn"
                  >
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link 
                          key={child.href} 
                          to={child.href} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#003087] transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Botones CTA */}
            <div className="flex items-center ml-6 space-x-2">
              <a 
                href={serviceLinks[0].href}
                className="px-3 py-2 text-sm font-medium text-[#003087] border border-[#003087] rounded-md hover:bg-[#003087]/5 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Autoservicio
              </a>
              
              <a 
                href={serviceLinks[1].href}
                className="px-3 py-2 text-sm font-medium text-white bg-[#003087] rounded-md hover:bg-[#00246b] transition-colors shadow-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Admisiones
              </a>
            </div>
          </div>

          {/* Botón de Menú Móvil */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-fadeIn">
          <div className="py-2 px-4">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003087] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-[#003087] hover:bg-gray-50 rounded-md"
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {activeDropdown === item.label && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-[#003087] rounded-md"
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsOpen(false);
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#003087] hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex flex-col space-y-2">
              {serviceLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-center rounded-md transition-colors border"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: link.id === 'admisiones' ? '#003087' : 'white',
                    color: link.id === 'admisiones' ? 'white' : '#003087',
                    borderColor: '#003087'
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;