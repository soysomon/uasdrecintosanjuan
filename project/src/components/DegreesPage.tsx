// src/components/DegreesPage.tsx
// Redesign: moderno, minimalista — colores y logos de facultad preservados.
// Pensums como botones externos; búsqueda funcional; acordeón limpio.
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Clock, BookOpen, Search } from 'lucide-react';
import humanidadesLogo  from '../img/logos-facultades/facultad-humanidades.svg';
import educacionLogo    from '../img/logos-facultades/facultad-educacion.svg';
import economiaLogo     from '../img/logos-facultades/facultad-economia.svg';
import juridicasLogo    from '../img/logos-facultades/facultad-juridicas.svg';
import saludLogo        from '../img/logos-facultades/facultad-medicina.svg';
import cienciasLogo     from '../img/logos-facultades/facultad-ciencias.svg';
import agronomicasLogo  from '../img/logos-facultades/facultad-agronomia.svg';
import ingenieriaLogo   from '../img/logos-facultades/facultad-ingenieria.svg';

/* ── Types ───────────────────────────────────────────── */

interface Pensum {
  label: string;
  url:   string;
}

interface Career {
  id:          string;
  name:        string;
  duration:    string;
  credits:     number;
  description: string;
  imageUrl:    string;
  pensums:     Pensum[];
}

interface Faculty {
  id:       string;
  name:     string;
  color:    string;
  logoUrl:  string;
  careers:  Career[];
}

/* ── Data ────────────────────────────────────────────── */

const facultiesData: Faculty[] = [
  {
    id: 'humanidades',
    name: 'Humanidades',
    color: '#7b56a4',
    logoUrl: humanidadesLogo,
    careers: [
      {
        id: 'letras',
        name: 'Licenciatura en Letras',
        duration: '4 años',
        credits: 180,
        description: 'Formación integral en el estudio de la literatura, lingüística y teoría de la comunicación.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Letras.jpg',
        pensums: [
          { label: 'Pensum P-LET', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-LET&plan=000012&nivel=GR' },
        ],
      },
      {
        id: 'comunicacion-social',
        name: 'Licenciatura en Comunicación Social (Mención Periodismo)',
        duration: '4 años',
        credits: 195,
        description: 'Desarrollo de competencias periodísticas y comunicacionales para medios tradicionales y digitales.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Comunicaci%C3%B3n+Social.jpg',
        pensums: [
          { label: 'Pensum P-CSPE', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-CSPE&plan=000012&nivel=GR' },
        ],
      },
    ],
  },
  {
    id: 'educacion',
    name: 'Ciencias de la Educación',
    color: '#911422',
    logoUrl: educacionLogo,
    careers: [
      {
        id: 'educacion-basica',
        name: 'Licenciatura en Educación Básica',
        duration: '4 años',
        credits: 175,
        description: 'Formación de docentes para la enseñanza en niveles básicos del sistema educativo nacional.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+B%C3%A1sica.jpg',
        pensums: [
          { label: 'Pensum P-EDBA (24355)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-EDBA&plan=201420&nivel=GR' },
          { label: 'Pensum P-EDUB (30955)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-EDUB&plan=201120&nivel=GR' },
        ],
      },
      {
        id: 'educacion-fisica',
        name: 'Licenciatura en Educación Física',
        duration: '4 años',
        credits: 170,
        description: 'Preparación para la enseñanza de actividades físicas, deportivas y recreativas.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+F%C3%ADsica.jpg',
        pensums: [
          { label: 'Pensum P-EDFD (Ed. Física y Deporte)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-EDFD&plan=201420&nivel=GR' },
          { label: 'Pensum P-EDFI (Ed. Física)',            url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-EDFI&plan=201120&nivel=GR' },
        ],
      },
      {
        id: 'educacion-inicial',
        name: 'Licenciatura en Educación Inicial',
        duration: '4 años',
        credits: 175,
        description: 'Formación para la educación en etapas tempranas del desarrollo infantil.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+Inicial.jpg',
        pensums: [
        { label: 'Pensum (30954 - P-EDUI)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-EDUI&plan=201120&nivel=GR' },

        ],
      },
      {
        id: 'orientacion-academica',
        name: 'Licenciatura en Educación (Mención Orientación Académica)',
        duration: '4 años',
        credits: 180,
        description: 'Desarrollo de competencias para guiar el proceso de aprendizaje y desarrollo personal del estudiante.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Educaci%C3%B3n+(Menci%C3%B3n+Orientaci%C3%B3n+Acad%C3%A9mica).jpg',
        pensums: [
           { label: '', url: '' },
        ],
      },
    ],
  },
  {
    id: 'economicas',
    name: 'Ciencias Económicas y Sociales',
    color: '#f47b20',
    logoUrl: economiaLogo,
    careers: [
      {
        id: 'administracion',
        name: 'Licenciatura en Administración de Empresas',
        duration: '4 años',
        credits: 190,
        description: 'Formación en gestión y dirección empresarial para el desarrollo socioeconómico.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Administraci%C3%B3n+de+Empresas.jpg',
        pensums: [
           { label: 'Pensum (50201 - P-ADME)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-ADME&plan=000013&nivel=GR' },
        ],
      },
      {
        id: 'mercadotecnia',
        name: 'Licenciatura en Mercadotecnia',
        duration: '4 años',
        credits: 185,
        description: 'Estudio de estrategias para la comercialización de productos y servicios en diversos mercados.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Mercadotecnia.jpg',
        pensums: [
           { label: 'Pensum (50203 - P-MERC)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-MERC&plan=000013&nivel=GR' },
        ],
      },
      {
        id: 'ciencias-politicas',
        name: 'Licenciatura en Ciencias Políticas',
        duration: '4 años',
        credits: 195,
        description: 'Análisis de sistemas políticos, gobernanza y relaciones de poder en la sociedad.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Ciencias+Pol%C3%ADticas.jpg',
        pensums: [
           { label: 'Pensum (60301 - P-CSPO)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-CSPO&plan=000012&nivel=GR' },
        ],
      },
      {
        id: 'contabilidad',
        name: 'Licenciatura en Contabilidad',
        duration: '4 años',
        credits: 190,
        description: 'Formación en el registro, clasificación y análisis de información financiera y contable.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Contabilidad.jpg',
        pensums: [
           { label: 'Pensum  (50301 - P-CONT)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-CONT&plan=000012&nivel=GR' },
        ],
      },
    ],
  },
  {
    id: 'juridicas',
    name: 'Ciencias Jurídicas y Políticas',
    color: '#ff1c07',
    logoUrl: juridicasLogo,
    careers: [
      {
        id: 'derecho',
        name: 'Licenciatura en Derecho',
        duration: '5 años',
        credits: 220,
        description: 'Formación jurídica integral para el ejercicio profesional en diversas ramas del derecho.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ciencias+Jur%C3%ADdicas+y+Pol%C3%ADticas.jpg',
        pensums: [
           { label: 'Pensum (60202 - P-DERE)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-DERE&plan=000012&nivel=GR' },
        ],
      },
    ],
  },
  {
    id: 'salud',
    name: 'Ciencias de la Salud',
    color: '#d4a800',
    logoUrl: saludLogo,
    careers: [
      {
        id: 'enfermeria',
        name: 'Licenciatura en Enfermería',
        duration: '4 años',
        credits: 200,
        description: 'Formación para el cuidado de la salud y atención integral de pacientes.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Enfermer%C3%ADa.jpg',
        pensums: [
           { label: 'Pensum (80601 - P-ENF1)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-ENF1&plan=000012&nivel=GR' },
           { label: 'Pensum (80603 - P-ENFE)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-ENFE&plan=000013&nivel=GR' },
        ],
      },
      {
        id: 'bioanalisis',
        name: 'Licenciatura en Bioanálisis',
        duration: '4 años',
        credits: 210,
        description: 'Preparación para el análisis clínico y diagnóstico de laboratorio.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Bioan%C3%A1lisis.jpg',
        pensums: [
           { label: 'Pensum (80902 - P-BIOA)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-BIOA&plan=000014&nivel=GR' },
        ],
      },
      {
        id: 'medicina',
        name: 'Doctor en Medicina (Premédica-Internado)',
        duration: '6 años',
        credits: 320,
        description: 'Formación en ciencias médicas para la atención y cuidado de la salud poblacional.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Doctor+en+Medicina+(Prem%C3%A9dica-Internado).jpg',
        pensums: [
           { label: 'Pre-Médica/Medicina - (M0941PMED - P-PMED) ', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-PMED&plan=000014&nivel=GR' },
           { label: 'Pre-Médica/Medicina - (81002 - P-PMED)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-PMED&plan=000014&nivel=GR' },

          ],
      },
      {
        id: 'psicologia-clinica',
        name: 'Licenciatura en Psicología Clínica',
        duration: '5 años',
        credits: 200,
        description: 'Estudio del comportamiento humano orientado a la intervención clínica y terapéutica.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Psicolog%C3%ADa+Cl%C3%ADnica.jpg',
        pensums: [
           { label: 'Pensum Psicología Clínica - (31002 - P-PSIC)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-PSIC&plan=000012&nivel=GR' },
        ],
      },
      {
        id: 'psicologia-escolar',
        name: 'Licenciatura en Psicología Escolar',
        duration: '5 años',
        credits: 195,
        description: 'Especialización en comportamiento y aprendizaje en entornos educativos.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Psicolog%C3%ADa+Escolar.jpg',
        pensums: [
           { label: 'Pensum (31004 - P-PSIE) ', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-PSIE&plan=000012&nivel=GRs' },
        ],
      },
    ],
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    color: '#00a3e6',
    logoUrl: cienciasLogo,
    careers: [
      {
        id: 'informatica',
        name: 'Licenciatura en Informática',
        duration: '4 años',
        credits: 190,
        description: 'Formación en tecnologías de la información, desarrollo de software y sistemas informáticos.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Licenciatura+en+Inform%C3%A1tica.jpg',
        pensums: [
           { label: 'Pensum (P-LINF)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-LINF&plan=202510&nivel=GR' },
        ],
      },
    ],
  },
  {
    id: 'agronomicas',
    name: 'Ciencias Agronómicas y Veterinarias',
    color: '#00a651',
    logoUrl: agronomicasLogo,
    careers: [
      {
        id: 'zootecnia',
        name: 'Ingeniería Zootecnia',
        duration: '5 años',
        credits: 210,
        description: 'Estudio de la producción animal y mejoramiento genético para la industria agropecuaria.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Zootecnia.jpg',
        pensums: [
           { label: 'Pensum (90306 - P-IZOO)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-IZOO&plan=201810&nivel=GR' },
        ],
      },
      {
        id: 'agronomia-suelos',
        name: 'Ingeniería Agronómica (Suelos y Riego)',
        duration: '5 años',
        credits: 215,
        description: 'Especialización en manejo de suelos y sistemas de riego para la producción agrícola.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Agron%C3%B3mica+(Suelos+y+Riego).jpg',
        pensums: [
           { label: 'Pensum (90208 - P-IASR)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-IASR&plan=000012&nivel=GR' },
        ],
      },
      {
        id: 'agronomia-cultivos',
        name: 'Ingeniería Agronómica (Producción de Cultivos)',
        duration: '5 años',
        credits: 215,
        description: 'Formación en técnicas de cultivo, cosecha y manejo post-cosecha de productos agrícolas.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Agron%C3%B3mica+(Producci%C3%B3n+de+Cultivos).jpg',
        pensums: [
           { label: 'Pensum (90209 - P-IAPC)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-IAPC&plan=000012&nivel=GR' },
        ],
      },
      {
        id: 'agronomia-desarrollo',
        name: 'Ingeniería Agronómica (Desarrollo Agrícola)',
        duration: '5 años',
        credits: 215,
        description: 'Enfoque en desarrollo rural y sistemas de producción sostenibles para comunidades agrícolas.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Agron%C3%B3mica+(Desarrollo+Agr%C3%ADcola).jpg',
        pensums: [
           { label: 'Pensum (90210 - P-IADA)', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-IADA&plan=000012&nivel=GR' },
        ],
      },
    ],
  },
  {
    id: 'ingenieria',
    name: 'Ingeniería y Arquitectura',
    color: '#2f5ba7',
    logoUrl: ingenieriaLogo,
    careers: [
      {
        id: 'civil',
        name: 'Ingeniería Civil',
        duration: '5 años',
        credits: 225,
        description: 'Formación en diseño, construcción y mantenimiento de infraestructuras y obras civiles.',
        imageUrl: 'https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imagenes-carreras-de-grado/Ingenier%C3%ADa+Civil.jpg',
        pensums: [
           { label: 'Pensum (70401 - P-ICIV) ', url: 'https://app.uasd.edu.do/PensumGrado/?periodoV=999999&programa=P-ICIV&plan=000012&nivel=GR' },
        ],
      },
    ],
  },
];

/* ── CareerCard ──────────────────────────────────────── */

const CareerCard: React.FC<{ career: Career; facultyColor: string }> = ({ career, facultyColor }) => (
  <div style={{
    backgroundColor: '#ffffff',
    border:          '1px solid var(--color-border-subtle)',
    display:         'flex',
    flexDirection:   'column',
    overflow:        'hidden',
    transition:      'box-shadow 0.2s ease, transform 0.2s ease',
  }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
    }}
  >
    {/* Image */}
    <div style={{ height: '160px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
      <div style={{
        position:        'absolute',
        top:             0,
        left:            0,
        width:           '4px',
        height:          '100%',
        backgroundColor: facultyColor,
        zIndex:          1,
      }} />
      <img
        src={career.imageUrl}
        alt={career.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        loading="lazy"
      />
    </div>

    {/* Content */}
    <div style={{ padding: '1.25rem 1.25rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <h3 style={{
        fontSize:   '0.9375rem',
        fontWeight: 600,
        color:      facultyColor,
        lineHeight: 1.3,
        margin:     0,
      }}>
        {career.name}
      </h3>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem',
          fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          <Clock size={11} />
          {career.duration}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem',
          fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          <BookOpen size={11} />
          {career.credits} créditos
        </span>
      </div>

      <p style={{
        fontSize:   '0.8125rem',
        lineHeight: 1.6,
        color:      'var(--color-text-secondary)',
        margin:     0,
        flex:       1,
      }}>
        {career.description}
      </p>

      {/* Pensum buttons */}
      {career.pensums.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
          {career.pensums.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '0.375rem',
                fontSize:       '0.6875rem',
                fontWeight:     700,
                letterSpacing:  '0.06em',
                textTransform:  'uppercase',
                color:          facultyColor,
                border:         `1px solid ${facultyColor}`,
                padding:        '0.375rem 0.75rem',
                textDecoration: 'none',
                transition:     'background-color 0.18s ease, color 0.18s ease',
                width:          'fit-content',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = facultyColor;
                (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.color = facultyColor;
              }}
            >
              <ExternalLink size={10} />
              {p.label}
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ── FacultySection ──────────────────────────────────── */

const FacultySection: React.FC<{
  faculty:       Faculty;
  isOpen:        boolean;
  toggleSection: () => void;
  filteredCareers: Career[];
}> = ({ faculty, isOpen, toggleSection, filteredCareers }) => {
  if (filteredCareers.length === 0) return null;

  return (
    <section style={{ marginBottom: '0', borderBottom: '1px solid var(--color-border-subtle)' }}>

      {/* Header */}
      <button
        onClick={toggleSection}
        aria-expanded={isOpen}
        style={{
          width:           '100%',
          display:         'flex',
          alignItems:      'center',
          gap:             '1rem',
          padding:         '1.25rem 0',
          background:      'none',
          border:          'none',
          cursor:          'pointer',
          textAlign:       'left',
          borderLeft:      `4px solid ${faculty.color}`,
          paddingLeft:     '1.25rem',
        }}
      >
        {/* Logo */}
        <div style={{
          width:           '48px',
          height:          '48px',
          flexShrink:      0,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          backgroundColor: `${faculty.color}12`,
          padding:         '6px',
        }}>
          <img
            src={faculty.logoUrl}
            alt={`Facultad de ${faculty.name}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Name + count */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize:      '0.5rem',
            fontWeight:    700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         faculty.color,
            margin:        '0 0 0.2rem',
          }}>
            Facultad de
          </p>
          <h2 style={{
            fontFamily:    '"Playfair Display", Georgia, serif',
            fontSize:      'clamp(1rem, 2vw, 1.25rem)',
            fontWeight:    600,
            color:         'var(--color-text-primary)',
            margin:        0,
            lineHeight:    1.2,
          }}>
            {faculty.name}
          </h2>
        </div>

        {/* Career count */}
        <span style={{
          fontSize:        '0.5625rem',
          fontWeight:      700,
          letterSpacing:   '0.1em',
          textTransform:   'uppercase',
          color:           'var(--color-text-muted)',
          marginRight:     '0.5rem',
          whiteSpace:      'nowrap',
        }}>
          {filteredCareers.length} {filteredCareers.length === 1 ? 'carrera' : 'carreras'}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={18}
          style={{
            color:      faculty.color,
            flexShrink: 0,
            transition: 'transform 0.28s ease',
            transform:  isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Careers grid */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="careers"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display:               'grid',
              gridTemplateColumns:   'repeat(auto-fill, minmax(260px, 1fr))',
              gap:                   '1.25rem',
              padding:               '1rem 0 2rem',
            }}>
              {filteredCareers.map((career, i) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CareerCard career={career} facultyColor={faculty.color} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ── DegreesPage ─────────────────────────────────────── */

const DegreesPage: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    facultiesData.reduce((acc, f) => ({ ...acc, [f.id]: false }), {})
  );
  const [query, setQuery] = useState('');

  const toggleSection = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return facultiesData.map(f => ({ faculty: f, careers: f.careers }));
    return facultiesData.map(f => ({
      faculty:  f,
      careers:  f.careers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      ),
    }));
  }, [query]);

  const totalCarreras = facultiesData.reduce((s, f) => s + f.careers.length, 0);

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <div style={{ paddingTop: '108px', position: 'relative', backgroundColor: '#001F54', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/grado.jpg"
            alt="UASD Carreras de Grado"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
          />
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(to bottom, rgba(0,31,84,0.6) 0%, rgba(0,31,84,0.92) 100%)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 2.5rem)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#C9940A', margin: '0 0 0.75rem' }}>
              UASD · Recinto San Juan
            </p>
            <h1 style={{
              fontFamily:    '"Playfair Display", Georgia, serif',
              fontStyle:     'italic',
              fontSize:      'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight:    700,
              letterSpacing: '-0.03em',
              lineHeight:    1.05,
              color:         '#ffffff',
              margin:        '0 0 1rem',
            }}>
              Carreras de Grado
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.72)', maxWidth: '52ch', margin: 0, lineHeight: 1.65 }}>
              {totalCarreras} carreras en {facultiesData.length} facultades — formando profesionales que transforman la región sur.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Contenido principal ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 2.5rem)' }}>

        {/* Búsqueda */}
        <div style={{ padding: '2rem 0 1.5rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.875rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Buscar carrera o facultad…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width:           '100%',
                paddingLeft:     '2.5rem',
                paddingRight:    '1rem',
                paddingTop:      '0.625rem',
                paddingBottom:   '0.625rem',
                fontSize:        '0.875rem',
                border:          '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color:           'var(--color-text-primary)',
                outline:         'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onBlur={e  => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>
        </div>

        {/* Facultades */}
        <main style={{ paddingBottom: '5rem' }}>
          {filtered.map(({ faculty, careers }) => (
            <FacultySection
              key={faculty.id}
              faculty={faculty}
              isOpen={openSections[faculty.id]}
              toggleSection={() => toggleSection(faculty.id)}
              filteredCareers={careers}
            />
          ))}

          {filtered.every(f => f.careers.length === 0) && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <p style={{ fontSize: '0.9375rem' }}>No se encontraron carreras para &ldquo;{query}&rdquo;.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DegreesPage;
