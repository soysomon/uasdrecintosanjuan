import React, { useState } from 'react';

const Frequentquestions = () => {
  // Estado para controlar qué preguntas están expandidas
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  // Función para expandir/colapsar preguntas
  const toggleQuestion = (index: number) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter(i => i !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };

  // Lista de preguntas frecuentes más importantes
  const faqs = [
    {
      pregunta: "¿Cómo puedo solicitar admisión a la universidad?",
      respuesta: "El proceso de admisión se realiza a través del portal web institucional. Debes completar el formulario en línea, adjuntar los documentos requeridos (certificado de bachillerato, documento de identidad y fotografía) y pagar la cuota de inscripción. Una vez completado este proceso, deberás presentar la Prueba de Orientación y Aptitud Académica (POMA) en la fecha asignada."
    },
    {
      pregunta: "¿Cuándo inician las inscripciones para el próximo semestre?",
      respuesta: "Las inscripciones para estudiantes de nuevo ingreso generalmente comienzan dos meses antes del inicio del semestre académico. Para estudiantes activos, el período de selección de asignaturas se abre aproximadamente un mes antes. Consulta el calendario académico actualizado en la página web oficial para fechas específicas."
    },
    {
      pregunta: "¿Qué documentos necesito para inscribirme como estudiante de nuevo ingreso?",
      respuesta: "Necesitarás: certificado oficial de bachillerato legalizado por el Ministerio de Educación, acta de nacimiento certificada, fotocopia de tu documento de identidad, fotografías recientes tamaño 2x2, comprobante de pago de la cuota de inscripción y resultados de la Prueba de Orientación y Aptitud Académica (POMA)."
    },
    {
      pregunta: "¿Cómo puedo solicitar una beca o ayuda financiera?",
      respuesta: "Las solicitudes de becas deben presentarse en el Departamento de Bienestar Estudiantil. Los requisitos incluyen demostrar necesidad económica, mantener un índice académico mínimo de 3.0 y presentar documentación que respalde tu situación socioeconómica. Las convocatorias se publican al inicio de cada semestre académico."
    },
    {
      pregunta: "¿Qué opciones tengo para pagar la matrícula y cuotas?",
      respuesta: "Puedes realizar pagos a través de transferencia bancaria, depósito directo en las cuentas institucionales, o mediante tarjeta de crédito/débito en la plataforma de pagos en línea. También existe la posibilidad de solicitar un plan de pago fraccionado, que debe gestionarse en el Departamento de Finanzas antes del inicio del período de inscripción."
    },
    {
      pregunta: "¿Cómo puedo obtener mi horario de clases?",
      respuesta: "Tu horario de clases está disponible en tu portal estudiantil después de completar el proceso de selección de asignaturas. Debes iniciar sesión con tus credenciales, dirigirte a la sección 'Académico' y seleccionar 'Horario actual'."
    },
    {
      pregunta: "¿Cuál es el procedimiento para cambiar de carrera?",
      respuesta: "Para solicitar un cambio de carrera, debes presentar una solicitud formal en la Oficina de Registro. El proceso requiere tener al menos un semestre cursado, mantener un índice académico mínimo de 2.0, y cumplir con los requisitos específicos de la carrera a la que deseas cambiarte. Las solicitudes se evalúan al final de cada semestre."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-40 px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-8">
    <h1 className="text-3xl font-light text-gray-900 mb-2">Preguntas Frecuentes</h1>
    <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
  </div>

  <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left focus:outline-none"
              onClick={() => toggleQuestion(index)}
            >
              <h3 className="text-lg font-medium text-gray-900">{faq.pregunta}</h3>
              <span className="ml-6 flex-shrink-0">
                {expandedQuestions.includes(index) ? (
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            </button>
            {expandedQuestions.includes(index) && (
              <div className="mt-4 prose prose-blue">
                <p className="text-gray-600">{faq.respuesta}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm">
          ¿No encuentras lo que buscas? 
          <a href="/contacto" className="text-blue-600 hover:text-blue-800 ml-1">
            Contáctanos directamente
          </a>
        </p>
      </div>
    </div>
  );
};

export default Frequentquestions;