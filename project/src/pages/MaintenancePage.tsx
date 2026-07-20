import React from 'react';

const LOGO_URL =
  'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/LOGO-RECINTO-UASD-SAN-JUAN-AZUL-2.png';

const SOCIALS = [
  {
    name: 'Instagram',
    handle: '@uasdrecintosanjuan',
    href: 'https://www.instagram.com/uasdrecintosanjuan?igsh=MWY5YWJrYWVnb253Mw==',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    handle: 'UASD Recinto San Juan',
    href: 'https://www.facebook.com/profile.php?id=61592162753357',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 8.5h2.5V5H14c-2.2 0-4 1.8-4 4v2H8v3.5h2V21h3.5v-6.5H16l.7-3.5h-3.2V9c0-.55.45-.5 1-.5z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: 'UASD Recinto San Juan',
    href: 'https://www.youtube.com/@UASDRecintoSanJuan',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2.5" y="6" width="19" height="12" rx="3" />
        <path d="M10.5 9.7v4.6l4-2.3-4-2.3z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Canal de WhatsApp',
    handle: 'Únete a nuestro canal oficial',
    href: 'https://whatsapp.com/channel/0029VbCizn1J93wMYUHoSI1N',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20 12a8 8 0 1 1-3.6-6.7" />
        <path d="M20 12a8 8 0 0 0-8-8" />
        <path d="M12 12l6 5" />
      </svg>
    ),
  },
];

export default function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background:
          'radial-gradient(circle at 15% 10%, #eef2fb 0%, #f7f8fc 45%, #ffffff 100%)',
        color: '#0f172a',
        fontFamily:
          "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ilustración abstracta discreta, inspirada en arquitectura universitaria */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 400"
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1100px, 160vw)',
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      >
        <g stroke="#003087" strokeWidth="2" fill="none">
          <rect x="80" y="180" width="40" height="140" />
          <rect x="140" y="140" width="40" height="180" />
          <rect x="200" y="200" width="40" height="120" />
          <polygon points="260,180 420,60 580,180" />
          <rect x="280" y="180" width="280" height="140" />
          <line x1="280" y1="220" x2="560" y2="220" />
          <line x1="320" y1="180" x2="320" y2="320" />
          <line x1="380" y1="180" x2="380" y2="320" />
          <line x1="440" y1="180" x2="440" y2="320" />
          <line x1="500" y1="180" x2="500" y2="320" />
          <rect x="620" y="220" width="40" height="100" />
          <rect x="680" y="160" width="40" height="160" />
        </g>
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 560,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={LOGO_URL}
          alt="Recinto UASD San Juan de la Maguana"
          style={{ height: 64, marginBottom: 28, objectFit: 'contain' }}
        />

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#003087',
            background: '#e8edfa',
            padding: '6px 14px',
            borderRadius: 999,
            marginBottom: 20,
          }}
        >
          Actualización institucional
        </span>

        <h1
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: 'clamp(28px, 5vw, 38px)',
            lineHeight: 1.25,
            margin: '0 0 16px',
            color: '#0f172a',
          }}
        >
          Sitio temporalmente en mantenimiento
        </h1>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: '#475569',
            margin: '0 0 8px',
            maxWidth: 460,
          }}
        >
          Estamos actualizando la plataforma digital del Recinto UASD San Juan de la
          Maguana para ofrecer una experiencia más moderna, segura y accesible para
          toda nuestra comunidad universitaria.
        </p>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: '#475569',
            margin: '0 0 8px',
          }}
        >
          Pronto estaremos nuevamente disponibles.
        </p>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: '#64748b',
            margin: '0 0 36px',
          }}
        >
          Mientras completamos este proceso, mantente informado a través de nuestras
          redes sociales oficiales.
        </p>

        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 12,
                border: '1px solid #dde3f0',
                background: '#ffffff',
                textDecoration: 'none',
                color: '#0f172a',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#003087';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#dde3f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 9,
                  background: '#eef2fb',
                  color: '#003087',
                }}
              >
                {s.icon}
              </span>
              <span style={{ textAlign: 'left', minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>
                  {s.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 12.5,
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.handle}
                </span>
              </span>
            </a>
          ))}
        </div>

        <p
          style={{
            marginTop: 40,
            fontSize: 12.5,
            color: '#94a3b8',
          }}
        >
          Universidad Autónoma de Santo Domingo · Recinto San Juan de la Maguana
        </p>
      </div>
    </div>
  );
}
