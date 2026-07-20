// src/components/Footer.tsx
// Redesign — patrón "Harvard University" footer: 3 columnas de enlaces centradas,
// logo institucional centrado debajo, barra inferior con copyright a la izquierda
// y redes sociales a la derecha.
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram, Linkedin } from 'lucide-react';

const BG    = '#08112b';
const DIM   = 'rgba(255,255,255,0.55)';
const MUTED = 'rgba(255,255,255,0.32)';

const COLUMNS: { title: string; links: { name: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'Navegación',
    links: [
      { name: 'Inicio', href: '/' },
      { name: 'Carreras', href: '/carreras/grado' },
      { name: 'Postgrado', href: '/carreras/postgrado' },
      { name: 'Contacto', href: '/contacto' },
    ],
  },
  {
    title: 'Recursos Académicos',
    links: [
      { name: 'Oferta Académica', href: '/carreras/grado' },
      { name: 'Investigación', href: '/inicio/proyectos' },
      { name: 'Memorias Institucionales', href: '/memorias' },
      { name: 'Transparencia', href: '/transparencia/estados-financieros' },
    ],
  },
  {
    title: 'Servicios Estudiantiles',
    links: [
      { name: 'Portal Estudiantil', href: 'https://eis.uasd.edu.do', external: true },
      { name: 'Correo Institucional', href: 'https://login.microsoftonline.com', external: true },
      { name: 'Pago en Línea', href: 'https://soft.uasd.edu.do/pagoenlinea/', external: true },
      { name: 'Recuperar NIP', href: 'https://app.uasd.edu.do/recuperar_nip/', external: true },
    ],
  },
];

const SOCIAL = [
  { Icon: Instagram, href: 'https://www.instagram.com/uasdrecintosanjuan', label: 'Instagram' },
  { Icon: Facebook,  href: 'https://www.facebook.com/profile.php?id=61592162753357', label: 'Facebook' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
  { Icon: Youtube,   href: 'https://www.youtube.com/@UASDRecintoSanJuan', label: 'YouTube' },
];

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1.125rem 0' }}>
      {children}
    </p>
  );
}

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const style: React.CSSProperties = {
    display: 'block', fontSize: '0.9375rem', color: DIM, textDecoration: 'none', transition: 'color 0.16s ease',
  };
  const hoverOn  = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = '#ffffff');
  const hoverOff = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = DIM);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} style={style} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: BG }} className="pt-16 pb-8">

      {/* ── 3 columnas de enlaces, centradas como grupo ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-center gap-12 sm:gap-20 text-center">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <ColTitle>{col.title}</ColTitle>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {col.links.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href} external={link.external}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Logo institucional, centrado, sin filtros ── */}
      <div className="flex flex-col items-center" style={{ marginTop: '4.5rem', marginBottom: '2.5rem' }}>
        <img
          src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/LOGO-RECINTO-UASD-SAN-JUAN-AZUL-2.png"
          alt="UASD Recinto San Juan de la Maguana"
          style={{ height: '110px', width: 'auto' }}
          loading="lazy"
        />
      </div>

      {/* ── Barra inferior — copyright izquierda, redes derecha ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ fontSize: '0.75rem', color: MUTED, margin: 0 }}>
            Copyright © {new Date().getFullYear()} Universidad Autónoma de Santo Domingo — Recinto San Juan de la Maguana
          </p>
          <div className="flex items-center gap-5">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ color: MUTED, transition: 'color 0.16s ease', display: 'flex' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
              >
                <Icon style={{ width: 18, height: 18 }} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
