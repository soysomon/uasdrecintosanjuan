// src/pages/MemoriasPage.tsx
// Redesign: layout editorial minimalista — lista ordenada alfabéticamente.
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_ROUTES from '../config/api';
import { MemoriaItem } from '../components/MemoriasManager';

const ITEM_VARIANTS = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.50, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 },
  }),
};

const MemoriasPage: React.FC = () => {
  const [memorias, setMemorias]   = useState<MemoriaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    const fetchMemorias = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_ROUTES.MEMORIAS);
        setMemorias(
          (response.data as MemoriaItem[])
            .filter((m) => m.isPublished)
            .sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }))
        );
        setError(null);
      } catch (err) {
        console.error('Error cargando memorias:', err);
        setError('No se pudieron cargar las memorias. Por favor, intente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemorias();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '100vh', paddingTop: '108px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 2.5rem)' }}>

        {/* ── Encabezado ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding:      'clamp(3rem, 6vw, 4.5rem) 0 2rem',
            borderBottom: '2px solid var(--color-text-primary)',
          }}
        >
          <p style={{
            fontSize:      '0.5625rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--color-primary)',
            marginBottom:  '0.75rem',
          }}>
            UASD · Recinto San Juan
          </p>
          <h1 style={{
            fontFamily:    '"Playfair Display", Georgia, serif',
            fontStyle:     'italic',
            fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight:    700,
            letterSpacing: '-0.03em',
            lineHeight:    1.05,
            color:         'var(--color-text-primary)',
            marginBottom:  '1.25rem',
          }}>
            Memorias Institucionales
          </h1>
          <p style={{
            fontSize:   '0.9375rem',
            lineHeight: 1.7,
            color:      'var(--color-text-secondary)',
            maxWidth:   '56ch',
          }}>
            Documentación histórica y reportes de los diferentes departamentos y unidades
            de la Universidad Autónoma de Santo Domingo, Recinto San Juan.
          </p>
        </motion.div>

        {/* ── Cuerpo ── */}
        <div style={{ padding: '2rem 0 5rem' }}>

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '3rem 0' }}>
              <Loader
                size={20}
                className="animate-spin"
                style={{ color: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Cargando memorias…
              </span>
            </div>
          )}

          {!isLoading && error && (
            <div style={{
              padding:      '2.5rem',
              border:       '1px solid #fca5a5',
              backgroundColor: '#fff5f5',
              textAlign:    'center',
            }}>
              <FileText size={36} style={{ color: '#f87171', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.9375rem', color: '#dc2626' }}>{error}</p>
            </div>
          )}

          {!isLoading && !error && memorias.length === 0 && (
            <div style={{
              padding:   '4rem 0',
              textAlign: 'center',
              borderTop: '1px solid var(--color-border-subtle)',
            }}>
              <FileText size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
                Las memorias institucionales estarán disponibles próximamente.
              </p>
            </div>
          )}

          {!isLoading && !error && memorias.length > 0 && (
            <>
              {/* Contador */}
              <p style={{
                fontSize:      '0.625rem',
                fontWeight:    600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         'var(--color-text-muted)',
                marginBottom:  '0',
              }}>
                {memorias.length} {memorias.length === 1 ? 'memoria' : 'memorias'} · Orden alfabético
              </p>

              {/* Lista */}
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {memorias.map((memoria, i) => (
                  <motion.li
                    key={memoria._id}
                    custom={i}
                    variants={ITEM_VARIANTS}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-24px' }}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                  >
                    <Link
                      to={`/memorias/${memoria.slug}`}
                      className="group"
                      style={{
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'space-between',
                        gap:            '1.5rem',
                        padding:        'clamp(1rem, 2.5vw, 1.375rem) 0',
                        textDecoration: 'none',
                        position:       'relative',
                        overflow:       'hidden',
                      }}
                    >
                      {/* Hover sweep */}
                      <span
                        aria-hidden="true"
                        className="group-hover:[transform:translateX(0)]"
                        style={{
                          position:        'absolute',
                          inset:           0,
                          backgroundColor: 'rgba(0, 48, 135, 0.035)',
                          transform:       'translateX(-101%)',
                          transition:      'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
                          pointerEvents:   'none',
                        }}
                      />

                      {/* Izquierda: índice + título + descripción */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                        <span style={{
                          fontSize:      '0.5rem',
                          fontWeight:    800,
                          letterSpacing: '0.12em',
                          color:         'var(--color-primary)',
                          minWidth:      '1.75rem',
                          paddingTop:    '0.25rem',
                        }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            fontFamily:    '"Playfair Display", Georgia, serif',
                            fontSize:      'clamp(1rem, 1.75vw, 1.1875rem)',
                            fontWeight:    600,
                            color:         'var(--color-text-primary)',
                            margin:        0,
                            lineHeight:    1.25,
                            whiteSpace:    'nowrap',
                            overflow:      'hidden',
                            textOverflow:  'ellipsis',
                          }}>
                            {memoria.title}
                          </p>
                          {memoria.description && (
                            <p style={{
                              fontSize:     '0.8125rem',
                              color:        'var(--color-text-muted)',
                              margin:       '0.3rem 0 0',
                              lineHeight:   1.5,
                              overflow:     'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace:   'nowrap',
                            }}>
                              {memoria.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Derecha: badges + flecha */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        {memoria.pdfUrl && (
                          <span style={{
                            display:       'inline-flex',
                            alignItems:    'center',
                            gap:           '0.3rem',
                            fontSize:      '0.5625rem',
                            fontWeight:    700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color:         'var(--color-primary)',
                            border:        '1px solid var(--color-primary)',
                            padding:       '0.2rem 0.5rem',
                          }}>
                            <FileText size={10} />
                            PDF
                          </span>
                        )}
                        {memoria.videoUrl && (
                          <span style={{
                            display:       'inline-flex',
                            alignItems:    'center',
                            gap:           '0.3rem',
                            fontSize:      '0.5625rem',
                            fontWeight:    700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color:         '#dc2626',
                            border:        '1px solid #dc2626',
                            padding:       '0.2rem 0.5rem',
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                            Video
                          </span>
                        )}
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                          style={{ color: 'var(--color-text-muted)' }}
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default MemoriasPage;
