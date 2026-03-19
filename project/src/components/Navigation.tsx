// src/components/Navigation.tsx
// Universidad-grade navigation: utility bar top, clear hierarchy, Admissions as primary CTA.
// Reference: MIT / Princeton / Yale — admissions-first nav architecture.
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ExternalLink, Search, ChevronRight } from 'lucide-react';
import type { NavItem } from '../types';

interface NavChildItem {
  label: string;
  href: string;
}

const baseNavItems: NavItem[] = [
  {
    label: 'La Institución',
    href: '/',
    children: [
      { label: 'Historia', href: '/inicio/historia' },
      { label: 'Filosofía Institucional', href: '/inicio/filosofia' },
      { label: 'Misión, Visión y Valores', href: '/inicio/mision-vision' },
      { label: 'Proyectos y Resoluciones', href: '/inicio/proyectos' },
      { label: 'Nuestro Equipo', href: '/inicio/informes' },
      { label: 'UASD Elías Piña', href: '/inicio/elias-pina' },
      { label: 'Consejo Directivo', href: '/inicio/consejo-directivo' },
      { label: 'Unidades', href: '/inicio/unidades' },
      { label: 'Tour Virtual', href: '/TourVirtual' },
      { label: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
    ],
  },
  {
    label: 'Académico',
    href: '/carreras',
    children: [
      { label: 'Carreras de Grado', href: '/carreras/grado' },
      { label: 'Postgrado y Maestrías', href: '/carreras/postgrado' },
      { label: 'Nuestros Docentes', href: '/docentes-page' },
    ],
  },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Investigación', href: '/inicio/proyectos' },
  { label: 'Contacto', href: '/contacto' },
  {
    label: 'Transparencia',
    href: '/transparencia',
    children: [
      { label: 'Estados Financieros', href: '/transparencia/estados-financieros' },
      { label: 'Memorias Institucionales', href: '/memorias' },
    ],
  },
];

const serviceLinks = [
  {
    id: 'autoservicio',
    label: 'Autoservicio',
    href: 'https://eis.uasd.edu.do/authenticationendpoint/login.do?Name=PreLoginRequestProcessor&commonAuthCallerPath=%252Fcas%252Flogin&forceAuth=true&passiveAuth=false&service=https%3A%2F%2Fssb.uasd.edu.do%3A443%2Fssomanager%2Fc%2FSSB&tenantDomain=carbon.super&sessionDataKey=e0e43776-93ba-4091-b3e5-5b218f8a6d68&relyingParty=SSO+Manager+PROD&type=cas&sp=SSO+Manager+PROD&isSaaSApp=false&authenticators=BasicAuthenticator:LOCAL',
    description: 'Portal de autoservicio estudiantil',
  },
  { id: 'admisiones', label: 'Admisiones', href: 'https://uasd.edu.do/admisiones/', description: 'Proceso de admisión' },
  { id: 'pagos', label: 'Pago en línea', href: 'https://uasd.edu.do/servicios/pago-en-linea/', description: 'Sistema de pagos' },
];

function getFlattenedMenuItems(items: NavItem[]): { label: string; href: string; isSubItem?: boolean; parentLabel?: string }[] {
  const result: { label: string; href: string; isSubItem?: boolean; parentLabel?: string }[] = [];
  items.forEach(item => {
    result.push({ label: item.label, href: item.href });
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {
        result.push({ label: child.label, href: child.href, isSubItem: true, parentLabel: item.label });
      });
    }
  });
  return result;
}

function Navigation() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navItems] = useState<NavItem[]>(baseNavItems);
  const [flatMobileItems] = useState(getFlattenedMenuItems(baseNavItems));

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const navigateToMobile = (href: string) => {
    setIsOpen(false);
    navigate(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0" style={{ zIndex: 9999 }}>

      {/* ── Utility bar — top strip ── */}
      <div
        className="border-b border-[#002070]/20 transition-all duration-300"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left: institution name abbreviation */}
          <span
            className="text-[10px] font-semibold uppercase tracking-widest hidden sm:block"
            style={{ color: 'rgba(255,255,255,0.40)', letterSpacing: '0.14em' }}
          >
            UASD · Recinto San Juan de la Maguana
          </span>
          {/* Right: service links */}
          <div className="flex ml-auto">
            {serviceLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-xs font-medium text-white/75 hover:text-white px-3 py-1.5 flex items-center gap-1 transition-colors duration-150"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <ExternalLink size={10} className="opacity-50" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Primary navigation bar ── */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'py-2 nav-blur shadow-nav'
            : 'py-3 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 mx-auto lg:-ml-0 lg:mx-0">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/LOGO-RECINTO-UASD-SAN-JUAN-AZUL-2.png"
              alt="UASD Recinto San Juan"
              className={`w-auto transition-all duration-300 ${isScrolled ? 'h-12' : 'h-14 md:h-16'}`}
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Search */}
            <div className="relative mr-3">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 px-4 py-2 pl-9 text-sm rounded-lg border border-[#e2e8f0] bg-[#f8f9fc]
                           focus:outline-none focus:ring-2 focus:ring-[#003087]/20 focus:border-[#003087]/40
                           transition-all duration-200 placeholder:text-[#94a3b8]"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94a3b8]" />
            </div>

            {/* Nav items */}
            {navItems.map((item) => (
              <div key={item.href} className="relative dropdown-container">
                {item.children ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className="px-3 py-2 rounded-md text-sm font-medium text-[#475569] hover:text-[#003087]
                               hover:bg-[#f8f9fc] transition-all duration-150 flex items-center gap-1"
                    aria-expanded={activeDropdown === item.label}
                    aria-controls={`dropdown-${item.label}`}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 opacity-50 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-[#475569] hover:text-[#003087]
                               hover:bg-[#f8f9fc] transition-all duration-150 block"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && activeDropdown === item.label && (
                  <div
                    id={`dropdown-${item.label}`}
                    className="absolute z-50 left-0 mt-2 w-64 nav-dropdown"
                  >
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="flex items-center px-4 py-2.5 text-sm text-[#475569]
                                     hover:bg-[#f8f9fc] hover:text-[#003087]
                                     transition-colors duration-100"
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

            {/* Primary CTAs — Autoservicio + Admisiones */}
            <div className="flex items-center gap-2 ml-4 pl-4" style={{ borderLeft: '1px solid #e2e8f0' }}>
              <a
                href={serviceLinks[0].href}
                className="px-4 py-2 text-sm font-medium text-[#003087] border border-[#003087]/25
                           rounded-lg hover:bg-[#003087]/5 hover:border-[#003087]/50
                           transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portal
              </a>
              <a
                href={serviceLinks[1].href}
                className="px-5 py-2 text-sm font-semibold text-white rounded-lg
                           transition-all duration-200 hover:-translate-y-px"
                style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 2px 8px rgba(0,48,135,0.30)' }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
              >
                Admisiones
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-[#475569] hover:bg-[#f8f9fc]
                       hover:text-[#003087] transition-all duration-150"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-[#f1f5f9] shadow-elevated
                        fixed top-[calc(var(--nav-h,108px))] left-0 right-0 bottom-0 overflow-auto
                        animate-fade-in">

          {/* Search */}
          <div className="sticky top-0 bg-white p-4 border-b border-[#f1f5f9]">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-9 text-sm rounded-lg border border-[#e2e8f0]
                           bg-[#f8f9fc] focus:outline-none focus:ring-2 focus:ring-[#003087]/20
                           focus:border-[#003087]/40 transition-all placeholder:text-[#94a3b8]"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            </div>
          </div>

          {/* Admissions banner — mobile first */}
          <div
            className="mx-4 mt-4 rounded-xl px-5 py-4 flex items-center justify-between"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-0.5">
                Matrícula abierta
              </p>
              <p className="text-sm font-bold text-white">Admisiones 2025–2026</p>
            </div>
            <a
              href={serviceLinks[1].href}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary-dark)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Aplicar
            </a>
          </div>

          {/* Nav items list */}
          <div className="p-3 mt-2">
            {flatMobileItems.map((item, index) => (
              <button
                key={`${item.href}-${index}`}
                onClick={() => navigateToMobile(item.href)}
                className={`flex w-full justify-between items-center px-4 py-3 text-sm rounded-lg
                            transition-all duration-150 mb-0.5
                            ${item.isSubItem
                              ? 'text-[#475569] pl-8 ml-2 border-l-2 border-[#e2e8f0] rounded-l-none'
                              : 'text-[#0f172a] font-medium'
                            }
                            hover:bg-[#f8f9fc] active:bg-[#eef2fb]`}
              >
                <span>{item.label}</span>
                <ChevronRight size={14} className="text-[#94a3b8]" />
              </button>
            ))}

            {/* Other service links */}
            <div className="mt-6 px-1 space-y-2">
              {serviceLinks
                .filter(l => l.id !== 'admisiones')
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium
                               rounded-lg transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color:  'var(--color-primary)',
                      border: `1.5px solid var(--color-primary)`,
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
