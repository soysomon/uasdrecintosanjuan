// src/components/Footer.tsx
// Redesign: footer institucional minimalista.
// Estructura: regla dorada → fila meta → grid 4 col (marca 35% + 3 nav 65%) → bottom bar.
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

/* ── Palette ─────────────────────────────────────────────────────── */
const BG      = '#08112b';
const GOLD    = '#C9940A';
const DIM     = 'rgba(255,255,255,0.50)';
const MUTED   = 'rgba(255,255,255,0.26)';

/* ── Link data ───────────────────────────────────────────────────── */
const NAV_LINKS = [
  { name: 'Inicio',        href: '/' },
  { name: 'Admisiones',    href: 'https://uasd.edu.do/admisiones/', external: true },
  { name: 'Carreras',      href: '/carreras/grado' },
  { name: 'Postgrado',     href: '/carreras/postgrado' },
  { name: 'Investigación', href: '/inicio/proyectos' },
  { name: 'Contacto',      href: '/contacto' },
];

const ACADEMIC_LINKS = [
  { name: 'Biblioteca',           href: '#' },
  { name: 'Calendario Académico', href: '#' },
  { name: 'Oferta Académica',     href: '/carreras/grado' },
  { name: 'Becas',                href: '#' },
];

const STUDENT_LINKS = [
  { name: 'Portal Estudiantil',   href: 'https://eis.uasd.edu.do',                external: true },
  { name: 'Correo Institucional', href: 'https://login.microsoftonline.com',       external: true },
  { name: 'Pago en Línea',        href: 'https://soft.uasd.edu.do/pagoenlinea/',   external: true },
  { name: 'Recuperar NIP',        href: 'https://app.uasd.edu.do/recuperar_nip/', external: true },
];

const SOCIAL = [
  { Icon: Facebook,  href: 'https://www.facebook.com/uasdrecintosanjuan', label: 'Facebook'  },
  { Icon: Twitter,   href: 'https://twitter.com/UASDSanJuan_',            label: 'Twitter'   },
  { Icon: Youtube,   href: 'https://www.youtube.com/channel/UCXk2XaQDLJlzZ3JYltFFP4Q', label: 'YouTube' },
  { Icon: Instagram, href: 'https://www.instagram.com/uasdsanjuan/',      label: 'Instagram' },
];

/* ── Sub-components ──────────────────────────────────────────────── */
function ColLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize:      '0.5625rem',
      fontWeight:    700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color:         GOLD,
      margin:        '0 0 1.375rem 0',
    }}>
      {children}
    </p>
  );
}

function FooterLink({ href, external, children }: {
  href: string; external?: boolean; children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    gap:            '0.375rem',
    fontSize:       '0.8125rem',
    color:          DIM,
    textDecoration: 'none',
    transition:     'color 0.16s ease',
    lineHeight:     1,
  };
  const hoverOn  = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = '#FFFFFF');
  const hoverOff = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = DIM);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        style={style} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        {children}
        <ExternalLink style={{ width: 10, height: 10, opacity: 0.35, flexShrink: 0 }} aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link to={href} style={style} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
      {children}
    </Link>
  );
}

/* ── Component ───────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer style={{ backgroundColor: BG }}>

      {/* ── Gold top rule ── */}
      <div aria-hidden="true" style={{ height: '2px', backgroundColor: GOLD }} />

      {/* ── Meta row: Est. + redes ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ paddingTop: '0.875rem', paddingBottom: '0.875rem' }}>
            <p style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTED, margin: 0 }}>
              UASD · Recinto San Juan de la Maguana · Est. 1995
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ color: MUTED, transition: 'color 0.16s ease', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                >
                  <Icon style={{ width: 14, height: 14 }} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(3rem, 6vw, 4.5rem)', paddingBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1 — Marca + Contacto (4/12 = 33%) */}
          <div className="lg:col-span-4" style={{ paddingRight: 'clamp(0rem, 2vw, 2rem)' }}>
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/LOGO-RECINTO-UASD-SAN-JUAN-AZUL-2.png"
              alt="UASD Recinto San Juan de la Maguana"
              style={{ height: '52px', width: 'auto', marginBottom: '1.25rem', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
              loading="lazy"
            />

            <p style={{ fontSize: '0.8125rem', lineHeight: 1.72, color: DIM, margin: '0 0 2rem 0', maxWidth: '28ch' }}>
              Extensión regional de la primera universidad del Nuevo Mundo, al servicio de la Región Sur.
            </p>

            {/* Separador */}
            <div aria-hidden="true" style={{ width: '32px', height: '1px', backgroundColor: GOLD, marginBottom: '1.5rem', opacity: 0.6 }} />

            {/* Contacto */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <MapPin style={{ width: 12, height: 12, color: GOLD, marginTop: '0.125rem', flexShrink: 0 }} aria-hidden="true" />
                <span style={{ fontSize: '0.75rem', color: DIM, lineHeight: 1.6 }}>
                  Ciudad Universitaria,<br />San Juan de la Maguana, RD
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Phone style={{ width: 12, height: 12, color: GOLD, flexShrink: 0 }} aria-hidden="true" />
                <a href="tel:+18095572299"
                  style={{ fontSize: '0.75rem', color: DIM, textDecoration: 'none', transition: 'color 0.16s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={e => (e.currentTarget.style.color = DIM)}>
                  (809) 557-2299
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Mail style={{ width: 12, height: 12, color: GOLD, flexShrink: 0 }} aria-hidden="true" />
                <a href="mailto:info@uasd.edu.do"
                  style={{ fontSize: '0.75rem', color: DIM, textDecoration: 'none', transition: 'color 0.16s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={e => (e.currentTarget.style.color = DIM)}>
                  info@uasd.edu.do
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 — Navegación (8/12 dividido en 3) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

              {/* Navegación */}
              <div>
                <ColLabel>Navegación</ColLabel>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {NAV_LINKS.map(link => (
                    <li key={link.name}>
                      <FooterLink href={link.href} external={link.external}>{link.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recursos Académicos */}
              <div>
                <ColLabel>Recursos Académicos</ColLabel>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ACADEMIC_LINKS.map(link => (
                    <li key={link.name}>
                      <FooterLink href={link.href}>{link.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Servicios Estudiantiles */}
              <div>
                <ColLabel>Servicios Estudiantiles</ColLabel>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {STUDENT_LINKS.map(link => (
                    <li key={link.name}>
                      <FooterLink href={link.href} external>{link.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ paddingTop: '1.125rem', paddingBottom: '1.125rem' }}>

            <p className="text-center md:text-left order-2 md:order-1"
              style={{ fontSize: '0.6875rem', color: MUTED, margin: 0 }}>
              © {new Date().getFullYear()} Universidad Autónoma de Santo Domingo — Recinto San Juan de la Maguana.
              Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-5 order-1 md:order-2">
              {['Política de Privacidad', 'Términos de Uso', 'Mapa del Sitio'].map(item => (
                <a key={item} href="#"
                  style={{ fontSize: '0.6875rem', color: MUTED, textDecoration: 'none', transition: 'color 0.16s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}>
                  {item}
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
