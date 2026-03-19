// src/components/SocialMediaSection.tsx
// Redesign: sección institucional minimalista — editorial header + 4 columnas limpias.
// Sin glassmorfismo ni puntos flotantes. Framer Motion para entradas suaves.
import { motion } from 'framer-motion';
import { Facebook, Twitter, Youtube, Instagram, ArrowRight } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    name:    'Facebook',
    handle:  '@uasdrecintosanjuan',
    url:     'https://www.facebook.com/uasdrecintosanjuan',
    Icon:    Facebook,
  },
  {
    name:    'Twitter / X',
    handle:  '@UASDSanJuan_',
    url:     'https://twitter.com/UASDSanJuan_',
    Icon:    Twitter,
  },
  {
    name:    'YouTube',
    handle:  'UASD Recinto San Juan',
    url:     'https://www.youtube.com/channel/UCXk2XaQDLJlzZ3JYltFFP4Q',
    Icon:    Youtube,
  },
  {
    name:    'Instagram',
    handle:  '@uasdsanjuan',
    url:     'https://www.instagram.com/uasdsanjuan/',
    Icon:    Instagram,
  },
];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.10 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.64, ease: [0.16, 1, 0.3, 1] } },
};

export function SocialMediaSection() {
  return (
    <section
      aria-labelledby="social-heading"
      style={{ backgroundColor: '#FAFAF8', padding: 'clamp(4rem, 8vw, 6rem) 0' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-10"
          style={{ borderBottom: '2px solid #0A0A14' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{
              fontSize:      '0.625rem',
              fontWeight:    700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         '#003087',
              margin:        '0 0 0.75rem 0',
            }}>
              Comunidad Digital
            </p>
            <h2
              id="social-heading"
              style={{
                fontFamily:    '"Playfair Display", Georgia, serif',
                fontStyle:     'italic',
                fontSize:      'clamp(1.875rem, 3vw, 2.5rem)',
                fontWeight:    700,
                letterSpacing: '-0.028em',
                lineHeight:    1.06,
                color:         '#0A0A14',
                margin:        0,
              }}
            >
              Síguenos en Redes Sociales
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize:      '0.875rem',
              color:         'rgba(10,10,20,0.46)',
              margin:        0,
              paddingBottom: '0.25rem',
            }}
          >
            Mantente conectado con nuestra comunidad universitaria
          </motion.p>
        </div>

        {/* ── Social link columns ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 md:grid-cols-4"
        >
          {SOCIAL_LINKS.map((social, i) => (
            <motion.a
              key={social.name}
              variants={itemVariants}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden"
              style={{
                display:       'flex',
                flexDirection: 'column',
                padding:       'clamp(1.5rem, 3vw, 2rem)',
                paddingLeft:   i % 2 === 0 ? 0 : undefined,
                borderLeft:    i > 0 ? '1px solid rgba(10,10,20,0.09)' : 'none',
                textDecoration:'none',
              }}
            >
              {/* Gold top accent — slide en hover */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ height: '2px', backgroundColor: '#C9940A' }}
              />

              {/* Icon + arrow row */}
              <div style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                marginBottom:   '1.5rem',
              }}>
                <div
                  style={{
                    width:           '44px',
                    height:          '44px',
                    backgroundColor: 'rgba(0,48,135,0.07)',
                    display:         'flex',
                    alignItems:      'center',
                    justifyContent:  'center',
                    transition:      'background-color 0.22s ease',
                  }}
                  className="group-hover:!bg-[rgba(201,148,10,0.09)]"
                >
                  <social.Icon
                    size={20}
                    style={{ color: '#003087' }}
                    aria-hidden="true"
                  />
                </div>

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                  style={{ color: '#C9940A', flexShrink: 0 }}
                  aria-hidden="true"
                />
              </div>

              {/* Platform name */}
              <p style={{
                fontSize:      '0.9375rem',
                fontWeight:    700,
                color:         '#0A0A14',
                margin:        '0 0 0.3rem 0',
                letterSpacing: '-0.012em',
                lineHeight:    1.2,
              }}>
                {social.name}
              </p>

              {/* Handle */}
              <p style={{
                fontSize:    '0.75rem',
                color:       'rgba(10,10,20,0.42)',
                margin:      0,
                fontFamily:  '"JetBrains Mono", "Fira Mono", monospace',
                letterSpacing: '0.01em',
              }}>
                {social.handle}
              </p>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
