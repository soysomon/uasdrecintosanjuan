// src/pages/DirectorOfficePage.tsx
// Redesign — patrón "Harvard Office of the President / Biography":
// banda gris con título centrado → panel negro foto+nombre → bio con sidebar.
// Refuerza las debilidades del patrón original: jerarquía tipográfica más clara,
// balance de espacio en el panel negro (evita el vacío desproporcionado),
// sidebar con más peso visual (encabezado de color, tarjetas con borde).
import React from 'react';
import { Printer, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERIF = "'Fraunces', 'Libre Baskerville', Georgia, serif";

export function DirectorOfficePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Banda gris — título + breadcrumb, estilo "Biography" ── */}
      {/* pt-[200px]: 108px del nav fijo + aire extra para bajar el título dentro de la banda */}
      <div style={{ backgroundColor: '#e7e6e3' }} className="pt-[200px] pb-16 sm:pb-20 text-center">
        <h1
          style={{
            fontFamily: SERIF, fontWeight: 500, color: '#1a1a1a',
            fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.01em',
          }}
        >
          Despacho de la Directora
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm mt-3" style={{ color: 'rgba(26,26,26,0.55)' }}>
          <Link to="/" className="hover:underline">Inicio</Link>
          <span>/</span>
          <span>Despacho de la Directora</span>
        </div>
      </div>

      {/* ── Panel negro — foto grande + nombre pegado a ella ── */}
      <div style={{ backgroundColor: '#0a1730' }} className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-end gap-0 lg:gap-8">

            {/* Nombre + cargo — pegado al borde izquierdo de la foto */}
            <div className="order-2 lg:order-1 text-center lg:text-right shrink-0">
              <p
                className="uppercase"
                style={{ fontSize: '11px', letterSpacing: '0.22em', color: '#ffffff', fontWeight: 700 }}
              >
                Directora · UASD Recinto San Juan
              </p>
              <h2
                style={{
                  fontFamily: SERIF, fontWeight: 500, color: '#ffffff',
                  fontSize: 'clamp(2rem, 3.6vw, 3.1rem)', letterSpacing: '-0.01em', lineHeight: 1.12,
                }}
                className="mt-2"
              >
                Leonor Taveras
              </h2>

              <div className="flex items-center gap-2 justify-center lg:justify-end mt-6">
                <button className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} aria-label="Imprimir">
                  <Printer className="w-4 h-4" style={{ color: '#fff' }} />
                </button>
                <button className="p-2 rounded-full transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} aria-label="Contactar">
                  <Mail className="w-4 h-4" style={{ color: '#fff' }} />
                </button>
              </div>
            </div>

            {/* Foto — grande, sin bordes redondeados, sin marco */}
            <div className="order-1 lg:order-2 relative overflow-hidden shrink-0" style={{ aspectRatio: '1344 / 1006', width: '100%', maxWidth: 760 }}>
              <img
                src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/fotos-recinto/DR.Carlos+Sanchez+De+Oleo.png"
                alt="Leonor Taveras, Directora UASD Recinto San Juan"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'top center' }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Contenido — biografía centrada, sin sidebar ── */}
      {/*
        Los 4 párrafos de abajo son TEXTO DE EJEMPLO — solo para previsualizar
        la organización de la biografía (mismo patrón que la referencia: 1. rol
        actual y nombramiento, 2. responsabilidades del cargo, 3. trayectoria
        previa, 4. reconocimientos/formación). Reemplazar por el contenido real
        de Leonor Taveras.
      */}
      <div className="max-w-3xl mx-auto px-6 py-14 sm:py-16 text-center">
        <p className="text-base text-gray-700 mb-4 leading-relaxed">
          Leonor Taveras fue designada Directora del Recinto UASD-San Juan de la Maguana el [fecha],
          tras una trayectoria dedicada a la docencia, la investigación y la gestión académica. Desde
          entonces ha impulsado iniciativas orientadas a fortalecer la calidad educativa y la
          vinculación del Recinto con la comunidad de la región sur del país.
        </p>
        <p className="text-base text-gray-700 mb-4 leading-relaxed">
          Como Directora, es responsable de la supervisión de las actividades académicas y
          administrativas del Recinto, con responsabilidad directa sobre el desarrollo docente, la
          política de investigación, las relaciones interinstitucionales y los avances en la oferta
          formativa. Las distintas facultades, unidades académicas y dependencias administrativas del
          Recinto reportan a su despacho.
        </p>
        <p className="text-base text-gray-700 mb-4 leading-relaxed">
          Antes de asumir la dirección del Recinto, Leonor Taveras se desempeñó en distintas
          posiciones dentro de la Universidad Autónoma de Santo Domingo, con experiencia en docencia
          universitaria, coordinación académica e investigación aplicada en su área de especialidad.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          Leonor Taveras cuenta con formación de posgrado y ha participado en reconocimientos y
          actividades académicas nacionales e internacionales a lo largo de su carrera. Es egresada de
          la Universidad Autónoma de Santo Domingo.
        </p>
      </div>

    </div>
  );
}
