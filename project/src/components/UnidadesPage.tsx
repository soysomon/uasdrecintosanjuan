// src/components/UnidadesPage.tsx
// Redesign: directorio institucional — lista agrupada por letra, ordenada alfabéticamente.
import React, { useState, useMemo } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import '../UnidadesPage.css';

interface Unit {
  id: string;
  name: string;
  description: string;
  location: string;
  category: 'academic' | 'administrative' | 'student-services' | 'research';
  rector?: string;
}

const units: Unit[] = [
  {
    id: 'direccion-general',
    name: 'Dirección General',
    description: 'Dirección general del recinto universitario',
    location: 'Edificio Administrativo, 3er Nivel',
    category: 'administrative',
    rector: 'Dr. Carlos Manuel Sánchez De Óleo',
  },
  {
    id: 'admisiones',
    name: 'Admisiones',
    description: 'Gestión de procesos de admisión y nuevo ingreso de estudiantes',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'student-services',
  },
  {
    id: 'almacen',
    name: 'Almacén',
    description: 'Administración de inventario y suministros',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative',
  },
  {
    id: 'sub-direccion-administrativa',
    name: 'Sub-Dirección Administrativa',
    description: 'Gestión de procesos administrativos del recinto',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'sub-direccion-academica',
    name: 'Sub-Dirección Académica',
    description: 'Supervisión y gestión de procesos académicos',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic',
  },
  {
    id: 'archivo',
    name: 'Archivo',
    description: 'Gestión y conservación de documentos históricos y administrativos',
    location: 'Edificio Administrativo, Sótano',
    category: 'administrative',
  },
  {
    id: 'auditoria',
    name: 'Auditoría',
    description: 'Control y supervisión de procesos financieros',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'bedeleria',
    name: 'Bedelería',
    description: 'Control docente y gestión de aulas',
    location: 'Edificio Académico, 1er Nivel',
    category: 'academic',
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca',
    description: 'Servicios bibliotecarios y recursos de investigación',
    location: 'Edificio de Biblioteca',
    category: 'academic',
  },
  {
    id: 'bienestar-estudiantil',
    name: 'Bienestar Estudiantil',
    description: 'Servicios de apoyo y asistencia para el bienestar del estudiante',
    location: 'Edificio de Servicios Estudiantiles, 2do Nivel',
    category: 'student-services',
  },
  {
    id: 'comedor',
    name: 'Comedor',
    description: 'Servicios de alimentación para la comunidad universitaria',
    location: 'Edificio del Comedor',
    category: 'student-services',
  },
  {
    id: 'caja-general',
    name: 'Caja General',
    description: 'Gestión de pagos y transacciones financieras',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative',
  },
  {
    id: 'compras',
    name: 'Compras',
    description: 'Adquisición de bienes y servicios para la universidad',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative',
  },
  {
    id: 'consultoria-juridica',
    name: 'Consultoría Jurídica',
    description: 'Asesoría legal y representación jurídica de la institución',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'consultorio-medico',
    name: 'Consultorio Médico',
    description: 'Servicios de salud y atención médica',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services',
  },
  {
    id: 'contabilidad',
    name: 'Contabilidad',
    description: 'Registro y control de operaciones financieras',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'coordinacion-administrativa',
    name: 'Coordinación Administrativa',
    description: 'Coordinación de procesos administrativos',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'coordinacion-academica',
    name: 'Coordinación Académica',
    description: 'Coordinación de programas y actividades académicas',
    location: 'Edificio Académico, 3er Nivel',
    category: 'academic',
  },
  {
    id: 'cursos-optativos',
    name: 'Cursos Optativos de Tesis',
    description: 'Gestión y coordinación de cursos optativos y tesis',
    location: 'Edificio Académico, 3er Nivel',
    category: 'academic',
  },
  {
    id: 'deportes',
    name: 'Deportes',
    description: 'Coordinación de actividades deportivas y recreativas',
    location: 'Complejo Deportivo',
    category: 'student-services',
  },
  {
    id: 'economato',
    name: 'Economato',
    description: 'Gestión de recursos económicos y materiales',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative',
  },
  {
    id: 'educacion-continuada',
    name: 'Educación Continuada',
    description: 'Programas de formación y actualización profesional',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic',
  },
  {
    id: 'extension',
    name: 'Extensión',
    description: 'Vinculación universidad-comunidad y actividades de extensión',
    location: 'Edificio Académico, 1er Nivel',
    category: 'academic',
  },
  {
    id: 'finca-experimental',
    name: 'Finca Experimental',
    description: 'Espacio para prácticas e investigación agrícola',
    location: 'Campus Externo',
    category: 'research',
  },
  {
    id: 'gerencia-financiera',
    name: 'Gerencia Financiera',
    description: 'Administración de recursos financieros',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'investigacion',
    name: 'Investigación',
    description: 'Coordinación de proyectos de investigación',
    location: 'Edificio de Investigación',
    category: 'research',
  },
  {
    id: 'mayordoma',
    name: 'Mayordomía',
    description: 'Gestión de servicios generales y mantenimiento',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative',
  },
  {
    id: 'ars-uasd',
    name: 'ARS UASD',
    description: 'Administradora de Riesgos de Salud de la universidad',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services',
  },
  {
    id: 'multimedia',
    name: 'Multimedia',
    description: 'Recursos audiovisuales y servicios multimedia',
    location: 'Edificio Académico, 1er Nivel',
    category: 'academic',
  },
  {
    id: 'orientacion',
    name: 'Orientación',
    description: 'Servicios de orientación académica y profesional',
    location: 'Edificio de Servicios Estudiantiles, 2do Nivel',
    category: 'student-services',
  },
  {
    id: 'ornato',
    name: 'Ornato',
    description: 'Cuidado y mantenimiento de áreas verdes',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative',
  },
  {
    id: 'planificacion',
    name: 'Planificación',
    description: 'Desarrollo de planes estratégicos y proyectos institucionales',
    location: 'Edificio Administrativo, 3er Nivel',
    category: 'administrative',
  },
  {
    id: 'planta-fisica',
    name: 'Planta Física',
    description: 'Mantenimiento y desarrollo de infraestructura',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative',
  },
  {
    id: 'postgrado',
    name: 'Postgrado',
    description: 'Coordinación de programas de postgrado',
    location: 'Edificio Académico, 3er Nivel',
    category: 'academic',
  },
  {
    id: 'protocolo',
    name: 'Protocolo',
    description: 'Organización de eventos y ceremonias institucionales',
    location: 'Edificio Administrativo, 3er Nivel',
    category: 'administrative',
  },
  {
    id: 'recursos-humanos',
    name: 'Recursos Humanos',
    description: 'Gestión del personal y relaciones laborales',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'redes-sistemas',
    name: 'Redes y Sistemas',
    description: 'Soporte técnico e infraestructura tecnológica',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative',
  },
  {
    id: 'registro',
    name: 'Registro',
    description: 'Gestión de inscripciones y expedientes académicos',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative',
  },
  {
    id: 'seguridad',
    name: 'Seguridad',
    description: 'Servicios de seguridad y vigilancia del campus',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'administrative',
  },
  {
    id: 'transportacion',
    name: 'Transportación',
    description: 'Servicio de transporte para estudiantes y personal',
    location: 'Edificio de Servicios, Planta Baja',
    category: 'student-services',
  },
  {
    id: 'uasd-virtual',
    name: 'UASD Virtual',
    description: 'Gestión de plataformas y cursos virtuales',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic',
  },
  {
    id: 'plan-retiro',
    name: 'Plan de Retiro',
    description: 'Administración de planes de jubilación del personal',
    location: 'Edificio Administrativo, 2do Nivel',
    category: 'administrative',
  },
  {
    id: 'inclusion-accesibilidad',
    name: 'Inclusión y Accesibilidad',
    description: 'Programas y servicios para estudiantes con necesidades especiales',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services',
  },
  {
    id: 'caja',
    name: 'Caja',
    description: 'Gestión de pagos y cobros diarios',
    location: 'Edificio Administrativo, 1er Nivel',
    category: 'administrative',
  },
  {
    id: 'apoyo-docente',
    name: 'Apoyo Docente',
    description: 'Servicios de apoyo para la actividad docente',
    location: 'Edificio Académico, 2do Nivel',
    category: 'academic',
  },
  {
    id: 'ofic-adm-elias-pina',
    name: 'Oficina Administrativa Elías Piña',
    description: 'Coordinación administrativa de la extensión en Elías Piña',
    location: 'Extensión Elías Piña',
    category: 'administrative',
  },
  {
    id: 'laboratorio',
    name: 'Laboratorio',
    description: 'Espacios para prácticas y experimentos científicos',
    location: 'Edificio de Ciencias',
    category: 'academic',
  },
  {
    id: 'enfermeria',
    name: 'Enfermería',
    description: 'Servicios de primeros auxilios y atención básica en salud',
    location: 'Edificio de Servicios Estudiantiles, 1er Nivel',
    category: 'student-services',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  academic:         { label: 'Académica',            color: '#003087' },
  administrative:   { label: 'Administrativa',        color: '#1a1a1a' },
  'student-services': { label: 'Serv. Estudiantil',  color: '#2d6a2d' },
  research:         { label: 'Investigación',         color: '#7B3F00' },
};

function normalizeLetter(name: string): string {
  // Strip accents for sorting, keep original for grouping label
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .charAt(0)
    .toUpperCase();
}

function groupByLetter(list: Unit[]): { letter: string; items: Unit[] }[] {
  const sorted = [...list].sort((a, b) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
  );
  const map: Record<string, Unit[]> = {};
  sorted.forEach(unit => {
    const letter = normalizeLetter(unit.name);
    if (!map[letter]) map[letter] = [];
    map[letter].push(unit);
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([letter, items]) => ({ letter, items }));
}

// ── Component ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all',             name: 'Todas' },
  { id: 'academic',        name: 'Académicas' },
  { id: 'administrative',  name: 'Administrativas' },
  { id: 'student-services',name: 'Serv. Estudiantiles' },
  { id: 'research',        name: 'Investigación' },
];

export function UnidadesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const direccionGeneral = units.find(u => u.id === 'direccion-general')!;

  const filtered = useMemo(() => {
    return units.filter(
      u => u.id !== 'direccion-general' &&
        (selectedCategory === 'all' || u.category === selectedCategory)
    );
  }, [selectedCategory]);

  const groups = useMemo(() => groupByLetter(filtered), [filtered]);

  const totalCount = filtered.length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>

      {/* ── Page header ── */}
      <header
        className="nav-offset"
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #E0DDD8',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '2.5rem', paddingBottom: '2rem' }}>
          <p style={{
            fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#003087', marginBottom: '0.5rem',
          }}>
            Recinto UASD San Juan
          </p>
          <h1 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#0A0A14',
            margin: 0,
          }}>
            Unidades del Recinto
          </h1>
          <p style={{ marginTop: '0.75rem', fontSize: '0.9375rem', color: '#666', lineHeight: 1.7, maxWidth: '60ch' }}>
            Cada unidad es responsable de un área específica dentro de la gestión académica y administrativa de la institución.
          </p>
        </div>
      </header>

      {/* ── Dirección General destacada ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '2.5rem', paddingBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          border: '1px solid #E0DDD8',
          backgroundColor: '#fff',
        }}
          className="flex-col sm:flex-row"
        >
          {/* Photo */}
          <div style={{ flex: '0 0 220px', maxWidth: 220, overflow: 'hidden' }}
            className="w-full sm:w-auto"
          >
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
              alt="Director General"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', minHeight: 200 }}
              loading="lazy"
            />
          </div>
          {/* Info */}
          <div style={{
            flex: 1,
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            borderLeft: '1px solid #E0DDD8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.75rem',
          }}>
            <p style={{
              fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#1a1a1a', margin: 0,
            }}>
              Unidad Administrativa
            </p>
            <h2 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
              fontWeight: 700,
              color: '#0A0A14',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              {direccionGeneral.name}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#555', margin: 0 }}>
              <strong style={{ color: '#0A0A14' }}>Director:</strong> {direccionGeneral.rector}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#888', fontSize: '0.8125rem' }}>
              <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} />
              <span>{direccionGeneral.location}</span>
            </div>
          </div>
          {/* Resources panel */}
          <div style={{
            flex: '0 0 240px',
            borderLeft: '1px solid #E0DDD8',
            display: 'flex',
            flexDirection: 'column',
          }}
            className="hidden lg:flex"
          >
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #E0DDD8',
              fontSize: '0.5625rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#888',
            }}>
              Recursos institucionales
            </div>
            <a
              href="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/pdf-Proyectos+y+Resoluciones/Ley+de+Creacio%CC%81n+de+la+UASD.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1.25rem', borderBottom: '1px solid #E0DDD8',
                textDecoration: 'none', color: '#333', fontSize: '0.8125rem',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F3EF')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span>Ley de Creación de la UASD</span>
              <ExternalLink style={{ width: 12, height: 12, color: '#aaa', flexShrink: 0 }} />
            </a>
            <a
              href="#"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                textDecoration: 'none', color: '#999', fontSize: '0.8125rem',
              }}
            >
              <span>Informe anual 2023</span>
              <ExternalLink style={{ width: 12, height: 12, color: '#ccc', flexShrink: 0 }} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E0DDD8', marginTop: '1.5rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.875rem 1.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderBottom: active ? '2px solid #003087' : '2px solid transparent',
                    backgroundColor: 'transparent',
                    color: active ? '#003087' : '#888',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Directory list ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* Count row */}
        <p style={{
          fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#aaa', marginBottom: '1.5rem',
        }}>
          {totalCount} unidad{totalCount !== 1 ? 'es' : ''}
        </p>

        {/* Grouped alpha list */}
        {groups.map(({ letter, items }) => (
          <div key={letter} style={{ marginBottom: '0.25rem' }}>
            {/* Letter heading */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem 0',
              borderBottom: '1px solid #E0DDD8',
              marginBottom: 0,
            }}>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#003087',
                minWidth: '1.5rem',
              }}>
                {letter}
              </span>
            </div>

            {/* Unit rows */}
            {items.map(unit => {
              const meta = CATEGORY_META[unit.category];
              return (
                <div
                  key={unit.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 0.5rem',
                    borderBottom: '1px solid #F0EDE8',
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F3EF')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Name + location */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#0A0A14',
                    }}>
                      {unit.name}
                    </span>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      fontSize: '0.75rem', color: '#aaa',
                    }}>
                      <MapPin style={{ width: 11, height: 11, flexShrink: 0 }} />
                      {unit.location}
                    </span>
                  </div>

                  {/* Category badge */}
                  <span style={{
                    fontSize: '0.5625rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: meta.color,
                    backgroundColor: meta.color + '12',
                    padding: '0.25rem 0.625rem',
                    whiteSpace: 'nowrap',
                  }}>
                    {meta.label}
                  </span>

                  {/* Color dot */}
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: meta.color,
                    flexShrink: 0,
                  }} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
