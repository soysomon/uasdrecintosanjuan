import React, { useState, useMemo, useCallback } from 'react';
import { Search, Clock, GraduationCap, Building2, ArrowRight, BookOpen, X } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  faculty: string;
  duration: string;
  credits: number;
  description: string;
  imageUrl: string;
  status: 'active' | 'development' | 'coming-soon';
  period: string;
}

const programs: Program[] = [
  // Programas de Maestrías que se imparten
  { id: 'orientacion-educativa-2021', title: 'Maestría en Orientación Educativa e Intervención Psicopedagógica', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Formación en orientación y apoyo psicopedagógico', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', status: 'active', period: '2021-2023' },
  { id: 'linguistica-espanol-2021', title: 'Maestría en Lingüística Aplicada a la Enseñanza del Español', faculty: 'Humanidades', duration: '2 años', credits: 60, description: 'Enseñanza avanzada del español, financiada por INAFOCAM', imageUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667', status: 'active', period: '2021-2023' },
  { id: 'salud-publica-2020', title: 'Maestría en Salud Pública', faculty: 'Ciencias de la Salud', duration: '2 años', credits: 60, description: 'Especialización en salud pública', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', status: 'active', period: '2020-2022' },
  { id: 'procesos-pedagogicos-2021', title: 'Maestría en Procesos Pedagógicos y Gestión de la Educación Infantil', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión de educación infantil', imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', status: 'active', period: '2021-2023' },
  { id: 'quimica-docentes-2021', title: 'Maestría en Química para Docentes', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Enseñanza de química, financiada por INAFOCAM', imageUrl: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0', status: 'active', period: '2021-2023' },
  { id: 'matematica-educadores-2018', title: 'Maestría en Matemática para Educadores', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Enseñanza de matemáticas', imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904', status: 'active', period: '2018-2020' },
  { id: 'gestion-centros-2019', title: 'Maestría en Gestión de Centros', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión de centros educativos', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', status: 'active', period: '2019-2021' },
  { id: 'gestion-educacion-fisica-2019', title: 'Maestría en Gestión de la Educación Física', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión de educación física', imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e', status: 'active', period: '2019-2021' },
  { id: 'gerencia-financiera-2020', title: 'Maestría en Gerencia Financiera', faculty: 'Ciencias Económicas', duration: '2 años', credits: 60, description: 'Gestión financiera avanzada', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', status: 'active', period: '2020-2022' },
  { id: 'derecho-constitucional-2020', title: 'Maestría en Derecho Constitucional y Procesal Penal', faculty: 'Ciencias Jurídicas', duration: '2 años', credits: 60, description: 'Especialización en derecho constitucional', imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb', status: 'active', period: '2020-2022' },

  // Programas de Maestría en Desarrollo
  { id: 'procesos-pedagogicos-2022', title: 'Maestría en Procesos Pedagógicos y Gestión de la Educación Infantil', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión de educación infantil', imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', status: 'development', period: '2022-2024' },
  { id: 'gestion-educacion-fisica-2022', title: 'Maestría en Gestión de la Educación Física y el Deporte', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión de educación física y deportes', imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e', status: 'development', period: '2022-2024' },
  { id: 'historia-dominicana-2022', title: 'Maestría en Historia Dominicana', faculty: 'Humanidades', duration: '2 años', credits: 60, description: 'Estudios en historia dominicana', imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1', status: 'development', period: '2022-2024' },
  { id: 'derecho-inmobiliario-2022', title: 'Maestría en Derecho Inmobiliario', faculty: 'Ciencias Jurídicas', duration: '2 años', credits: 60, description: 'Especialización en derecho inmobiliario', imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa', status: 'development', period: '2022-2024' },
  { id: 'auditoria-interna-2022', title: 'Maestría en Auditoría Interna', faculty: 'Ciencias Económicas', duration: '2 años', credits: 60, description: 'Auditoría avanzada', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', status: 'development', period: '2022-2024' },
  { id: 'matematica-educadores-2022', title: 'Maestría en Matemática para Educadores', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Enseñanza de matemáticas', imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904', status: 'development', period: '2022-2024' },
  { id: 'quimica-docentes-2022', title: 'Maestría en Química para Docentes', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Enseñanza de química', imageUrl: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0', status: 'development', period: '2022-2024' },
  { id: 'gestion-centros-dev', title: 'Maestría en Gestión de Centros', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión de centros educativos', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', status: 'development', period: '2022-2024' },
  { id: 'contabilidad-tributaria', title: 'Maestría en Contabilidad Tributaria', faculty: 'Ciencias Económicas', duration: '2 años', credits: 60, description: 'Contabilidad y tributación', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', status: 'development', period: '2022-2024' },
  { id: 'alta-gerencia', title: 'Maestría en Alta Gerencia', faculty: 'Ciencias Económicas', duration: '2 años', credits: 60, description: 'Gestión empresarial avanzada', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', status: 'development', period: '2022-2024' },
  { id: 'investigacion-cientifica', title: 'Maestría en Investigación Científica', faculty: 'Ciencias', duration: '2 años', credits: 60, description: 'Metodología de investigación', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69', status: 'development', period: '2022-2024' },
  { id: 'orientacion-educativa-dev', title: 'Maestría en Orientación Educativa e Intervención Psicopedagógica', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Apoyo psicopedagógico', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', status: 'development', period: '2022-2024' },
  { id: 'gestion-educacion-fisica-2024', title: 'Maestría en Gestión de la Educación Física y el Deporte', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión deportiva', imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e', status: 'development', period: '2024-2026' },
  { id: 'procesos-pedagogicos-2023', title: 'Maestría en Procesos Pedagógicos y Gestión de la Educación Infantil', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Educación infantil', imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', status: 'development', period: '2023-2025' },
  { id: 'gestion-publica', title: 'Maestría en Gestión Pública y Gobernanza', faculty: 'Ciencias Económicas', duration: '2 años', credits: 60, description: 'Gestión pública', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', status: 'development', period: '2022-2024' },
  { id: 'biologia-educadores', title: 'Maestría en Biología para Educadores', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Enseñanza de biología', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69', status: 'development', period: '2022-2024' },

  // Programas de Maestría Próximos a Iniciar
  { id: 'orientacion-educativa-2025', title: 'Maestría en Orientación Educativa e Intervención Psicopedagógica', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Apoyo psicopedagógico', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', status: 'coming-soon', period: '2025-2027' },
  { id: 'derecho-civil-2025', title: 'Maestría en Derecho Civil y Procedimiento Civil', faculty: 'Ciencias Jurídicas', duration: '2 años', credits: 60, description: 'Derecho civil', imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb', status: 'coming-soon', period: '2025-2027' },
  { id: 'ciencia-datos-2025', title: 'Maestría en Ciencia de Datos e Inteligencia Artificial', faculty: 'Ciencias', duration: '2 años', credits: 60, description: 'Ciencia de datos e IA', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', status: 'coming-soon', period: '2025-2027' },
  { id: 'gestion-educacion-fisica-2025', title: 'Maestría en Gestión de la Educación Física y Deporte', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión deportiva', imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e', status: 'coming-soon', period: '2025-2027' },
  { id: 'procesos-pedagogicos-2025', title: 'Maestría en Procesos Pedagógicos y Gestión de la Educación Infantil', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Educación infantil', imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b', status: 'coming-soon', period: '2025-2027' },
  { id: 'biologia-educadores-2025', title: 'Maestría en Biología para Educadores 2da. Cohorte', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Enseñanza de biología', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69', status: 'coming-soon', period: '2025-2027' },
  { id: 'auditoria-interna-2025', title: 'Maestría en Auditoría Interna', faculty: 'Ciencias Económicas', duration: '2 años', credits: 60, description: 'Auditoría avanzada', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', status: 'coming-soon', period: '2025-2027' },
  { id: 'linguistica-ingles-2025', title: 'Maestría en Lingüística Aplicada al Idioma Inglés', faculty: 'Humanidades', duration: '2 años', credits: 60, description: 'Enseñanza del inglés', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', status: 'coming-soon', period: '2025-2027' },
  { id: 'psicologia-clinica-2025', title: 'Maestría en Psicología Clínica', faculty: 'Ciencias de la Salud', duration: '2 años', credits: 60, description: 'Psicología clínica', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', status: 'coming-soon', period: '2025-2027' },
  { id: 'literatura-2025', title: 'Maestría en Literatura', faculty: 'Humanidades', duration: '2 años', credits: 60, description: 'Estudios literarios', imageUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667', status: 'coming-soon', period: '2025-2027' },
  { id: 'gestion-centros-2025', title: 'Maestría en Gestión de Centros Educativos', faculty: 'Ciencias de la Educación', duration: '2 años', credits: 60, description: 'Gestión educativa', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', status: 'coming-soon', period: '2025-2027' },
  { id: 'trabajo-social-2025', title: 'Especialidad en Trabajo Social', faculty: 'Ciencias de la Salud', duration: '1 año', credits: 30, description: 'Trabajo social especializado', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef', status: 'coming-soon', period: '2025-2026' },
  { id: 'derecho-laboral-2025', title: 'Maestría en Derecho Laboral y Seguridad Social', faculty: 'Ciencias Jurídicas', duration: '2 años', credits: 60, description: 'Derecho laboral', imageUrl: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb', status: 'coming-soon', period: '2025-2027' },
];

const faculties = [
  'Todas las Facultades',
  'Ciencias de la Educación',
  'Humanidades',
  'Ciencias de la Salud',
  'Ciencias Económicas',
  'Ciencias Jurídicas',
  'Ciencias',
];

const categories = [
  { id: 'active', title: 'Programas de Maestrías que se Imparten', status: 'active' },
  { id: 'development', title: 'Programas de Maestría en Desarrollo', status: 'development' },
  { id: 'coming-soon', title: 'Programas de Maestría Próximos a Iniciar', status: 'coming-soon' },
];

export function PostgraduatePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState('Todas las Facultades');

  // Memoize filtered programs to optimize performance
  const filteredPrograms = useMemo(() => {
    return programs.filter(program =>
      (selectedFaculty === 'Todas las Facultades' || program.faculty === selectedFaculty) &&
      program.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, selectedFaculty]);

  // Group programs by category
  const groupedPrograms = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = filteredPrograms.filter(program => program.status === category.status);
      return acc;
    }, {} as Record<string, Program[]>);
  }, [filteredPrograms]);

  // Optimize click handler
  const handleProgramClick = useCallback((program: Program) => {
    setSelectedProgram(program);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Hero Section */}
      <div className="relative py-24" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--color-primary) 95%, rgba(0,48,135,0.7))' }} />
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 transform translate-x-1/3 translate-y-1/3 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mt-36">
              Postgrados
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-100">
              Programas de especialización y maestría
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-medium)' }}>
          <div className="flex flex-col gap-6">
            {/* Faculty Filters */}
            <div className="flex flex-wrap gap-2">
              {faculties.map((faculty, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFaculty(faculty)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={selectedFaculty === faculty
                    ? { backgroundColor: 'var(--color-primary)', color: '#ffffff' }
                    : { backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-secondary)' }
                  }
                >
                  {faculty}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Buscar programa de postgrado..."
                className="w-full pl-12 pr-4 py-3 rounded-lg transition-all"
                style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Programs by Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.map(category => (
          groupedPrograms[category.id].length > 0 && (
            <div key={category.id} className="mb-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {category.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedPrograms[category.id].map(program => (
                  <div
                    key={program.id}
                    className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300"
                    style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-subtle)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-elevated)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-subtle)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                    onClick={() => handleProgramClick(program)}
                  >
                    <div className="relative aspect-w-16 aspect-h-9">
                      <img
                        src={program.imageUrl}
                        alt={program.title}
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {program.status === 'coming-soon' && (
                        <div
                          className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium"
                          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary-dark)' }}
                        >
                          Próximamente
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-base font-semibold mb-2 line-clamp-2"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {program.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{program.faculty}</p>
                      <div
                        className="flex items-center justify-between text-sm mb-4"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          <span>{program.credits} cr.</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                          style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-subtle)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                        >
                          <BookOpen className="w-4 h-4" />
                          Ver Plan
                        </button>
                        <a
                          href="https://postgrado.uasd.edu.do/oferta-curricular/?programa%5B%5D=maestria"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                          style={{ backgroundColor: program.status === 'coming-soon' ? 'var(--color-accent)' : 'var(--color-primary)' }}
                        >
                          <ArrowRight className="w-4 h-4" />
                          Inscribirme
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="relative">
              <div className="relative h-64">
                <img
                  src={selectedProgram.imageUrl}
                  alt={selectedProgram.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <div className="max-w-3xl mx-auto">
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {selectedProgram.title}
                  </h2>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedProgram.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                      { Icon: Clock, label: 'Duración', value: selectedProgram.duration },
                      { Icon: GraduationCap, label: 'Créditos', value: String(selectedProgram.credits) },
                      { Icon: Building2, label: 'Facultad', value: selectedProgram.faculty },
                    ].map(({ Icon, label, value }) => (
                      <div
                        key={label}
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: 'var(--color-surface-alt)' }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                          <div>
                            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors"
                      style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-subtle)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <BookOpen className="w-5 h-5" />
                      Ver Plan de Estudios
                    </button>
                    <a
                      href="https://postgrado.uasd.edu.do/oferta-curricular/?programa%5B%5D=maestria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: selectedProgram.status === 'coming-soon' ? 'var(--color-accent)' : 'var(--color-primary)' }}
                    >
                      <ArrowRight className="w-5 h-5" />
                      Inscribirme Ahora
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}