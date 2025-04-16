import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';

// Audio de notificación
const notificationSound = new Audio('/src/assets/notification.mp3');

type MenuKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type ResponseKey = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

interface MenuOption {
  key: ResponseKey;
  label: string;
  link?: string;
}

interface Menu {
  title: string;
  options: MenuOption[];
  responses: Partial<{ [key in ResponseKey]: string }>;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  options?: MenuOption[];
  isTyping?: boolean;
  timestamp: Date;
}
interface AgentResponse {
    message: string;
    userId?: string;
  }

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMenu, setCurrentMenu] = useState<MenuKey | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  const welcomeMessage = "¡Bienvenido al asistente virtual de la Universidad Autónoma de Santo Domingo, Campus San Juan! ¿Cómo podemos ayudarte hoy?";
  const welcomeOptions: MenuOption[] = [
    { key: '1', label: 'Consultas y Balance' },
    { key: '2', label: 'Departamento de Admisiones' },
    { key: '3', label: 'Departamento de Registro' },
    { key: '4', label: 'Educación Permanente' },
    { key: '5', label: 'Asistencia Financiera (Becas)' },
    { key: '6', label: 'Plataforma Virtual' },
    { key: '7', label: 'Departamento de Extensión' },
    { key: '8', label: 'Reclamaciones' },
    { key: '9', label: 'Hablar con un Agente' }, // Nueva opción
  ];
  const menus: { [key in MenuKey]: Menu } = {
    '1': {
      title: 'Consultas y Balance',
      options: [
        { key: '1', label: 'Métodos de Pago' },
        { key: '2', label: 'Pago en Línea' },
        { key: '3', label: 'Transferencia Bancaria' },
        { key: '4', label: 'Consultar Balance' },
        { key: '5', label: 'Preguntas Frecuentes' },
        { key: '6', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Métodos de pago disponibles: Pago en línea a través de nuestra plataforma virtual, transferencia bancaria a nuestra cuenta oficial, y pago en persona en nuestras oficinas. <a href="https://app.uasd.edu.do/pagoenlinea/" target="_blank" class="text-[#003087] font-medium hover:underline">Pagar en Linea</a>',
        '2': 'Puedes realizar tu pago en línea a través de nuestra plataforma virtual. <a href="https://app.uasd.edu.do/pagoenlinea/" target="_blank" class="text-[#003087] font-medium hover:underline">Pagar en Linea</a>',
        '3': 'Puedes realizar tu transferencia a nuestra cuenta de banco:<br><br><strong>No. de cuenta:</strong> 100-201587-9<br><strong>Banco:</strong> Banreservas<br><strong>Tipo:</strong>Corriente<br><br>Si necesitas asistencia adicional, no dudes en escribirnos. ¡Gracias por tu apoyo!',
        '4': 'Para consultar tu balance, sigue estos pasos:<br><br>1. Inicia sesión en tu cuenta.<br>2. Dirígete al menú <strong>Alumnos.</strong><br>3. Busca la opción <strong>Cuenta de Alumno.</strong><br>4. Haz clic en <strong>Ver Resumen de Cuenta</strong> para consultar tu balance.<br><br>Si tienes alguna duda o necesitas ayuda adicional, no dudes en contactarnos. ¡Estamos aquí para ayudarte!',
        '5': 'Encuentra respuestas a preguntas frecuentes en nuestro <strong>Sitio Web. </strong><a href="https://uasd.edu.do/faq/" target="_blank" class="text-[#003087] font-medium hover:underline">Ir a Preguntas</a>',
        '6': welcomeMessage,
      },
    },
    '2': {
      title: 'Departamento de Admisiones',
      options: [
        { key: '1', label: 'Requisitos de Admisión' },
        { key: '2', label: 'Solicitud de Admisión' },
        { key: '3', label: 'Ofertas Académicas' },
        { key: '4', label: 'Convalidaciones' },
        { key: '5', label: 'Costo de Admisión' },
        { key: '6', label: 'Calendario de Admisión' },
        { key: '7', label: 'Regresar al Menú Principal' },
      ],
      responses: {
      '1': `
<h3>🎓 Requisitos de Admisión - UASD Recinto San Juan</h3>
<p>Para inscribirte como estudiante de grado en la UASD, debes presentar la siguiente documentación:</p>
<ul>
  <li>✅ Título de bachiller (original).</li>
  <li>✅ Acta de nacimiento certificada.</li>
  <li>✅ Cédula de identidad:
    <ul>
      <li>Fotocopia.</li>
      <li>Documento original para validación.</li>
    </ul>
  </li>
  <li>🖼️ Dos fotografías tamaño 2 x 2.</li>
  <li>📚 Récord de notas de bachillerato (original y dos copias).</li>
  <li>📝 Documento de cita para la prueba de admisión.</li>
  <li>📋 Resumen de solicitud impreso (formulario con tus datos personales).</li>
  <li>✉️ Un sobre de manila tamaño 8½ x 13.</li>
</ul>
<p><strong>⚠️ Importante:</strong> Todos los documentos deben coincidir exactamente en nombres y apellidos, sin abreviaturas ni errores. No se aceptan documentos con tachaduras o deteriorados.</p>
<p>📎 Consulta más detalles en nuestra sección oficial de <a href="https://uasd.edu.do/admisiones" target="_blank" style="color: blue;">Admisiones</a>.</p>`,
        '2': `
<h3>📝 Solicitud de Admisión - UASD Recinto San Juan</h3>
<p>Para ingresar a la UASD, debes seguir estos pasos en el proceso de admisión:</p>

<ol>
  <li><strong>PASO 1:</strong> Creación de la solicitud de admisión.</li>
  <li><strong>PASO 2:</strong> Preselección de carrera (requerido).</li>
  <li><strong>PASO 3:</strong> Pago de solicitud de admisión.</li>
  <li><strong>PASO 4:</strong> Entrega de documentos en físico.</li>
  <li><strong>PASO 5:</strong> Evaluación de pruebas diagnósticas.</li>
  <li><strong>PASO 6:</strong> Confirmación de admisión y selección de asignaturas.</li>
</ol>

<p>🖥️ Puedes iniciar tu solicitud a través de nuestra <a href="https://app.uasd.edu.do/admision_rne/" target="_blank" style="color: blue;">plataforma virtual</a>.</p>
<p>📘 Para más detalles, visita la sección oficial de <a href="https://uasd.edu.do/admisiones-grado/" target="_blank" style="color: blue;">Admisiones de Grado</a>.</p>
`,
        '3': `
<h3>📚 Ofertas Académicas - UASD Recinto San Juan</h3>
<p>Explora todas las carreras y programas académicos disponibles en la UASD. Contamos con una amplia variedad de áreas del conocimiento para que elijas la que más se adapta a tus intereses y metas profesionales.</p>

<p>🔎 Puedes consultar la <strong>oferta académica completa</strong> accediendo al siguiente enlace:</p>
<p><a href="https://uasd.edu.do/oferta-academica/" target="_blank" style="color: blue;">Ver Ofertas Académicas</a></p>`,

        '4': `
<h3>🔄 Convalidación de Asignaturas - UASD</h3>
<p>Si cursaste asignaturas en otra universidad y deseas convalidarlas en la UASD, debes cumplir con los siguientes requisitos:</p>

<ul>
  <li>✍️ Carta de solicitud dirigida a la Directora <strong>Dulce María Casilla Guerrero M.A.</strong>, con tus datos personales (nombre, nacimiento, nacionalidad, domicilio, contacto).</li>
  <li>🪪 Copia de cédula o pasaporte (extranjeros deben incluir residencia actualizada y tarjeta de residente). Original y 2 copias a color.</li>
  <li>📄 Récord de notas original, certificado por el MESCyT y el Ministerio de Educación del país de origen. +10 copias.</li>
  <li>📘 Pensum de tu universidad de origen y pensum UASD (sellados y certificados). 10 copias de cada uno.</li>
  <li>📚 Programas de las asignaturas aprobadas, sellados y certificados. Original (encuadernado) y copia por materia.</li>
  <li>✅ Confirmación de admisión en la carrera UASD.</li>
  <li>🖼️ Dos fotos tamaño 2x2.</li>
  <li>📁 Folder tamaño legal (8½ x 13).</li>
  <li>💵 Recibo de pago por derecho a trámite.</li>
  <li>📝 Formulario de solicitud (entregado en el Departamento DIRRHCE).</li>
</ul>

<p><strong>📌 Importante:</strong></p>
<ul>
  <li>Mínimo a convalidar: 15 créditos. Máximo: 49% del pensum UASD.</li>
  <li>Asignaturas deben tener menos de 5 años de antigüedad y un índice mínimo de 2.0.</li>
  <li>Documentos en otro idioma deben ser traducidos por traductor judicial autorizado.</li>
  <li>No se recibe expediente incompleto.</li>
  <li>Países del Convenio de La Haya deben apostillar documentos en lugar de legalizarlos.</li>
</ul>

<p>📨 Para dudas o asistencia, puedes escribir a <a href="mailto:revalida@uasd.edu.do" style="color: blue;">revalida@uasd.edu.do</a> o llamar al <strong>809-535-8273 ext. 2555-2556</strong>.</p>

<p>📋 Realiza tu solicitud en línea aquí: <a href="https://revalida.uasd.edu.do/formulario/servicios/1" target="_blank" style="color: blue;">Formulario de Convalidación</a></p>

<p><strong>✅ Nota:</strong> Confirma tu correo electrónico correctamente para recibir respuesta del departamento.</p>`,

        '5': `
<h3>💰 Costo de Admisión - UASD</h3>
<p>Los costos de admisión varían según el ciclo y la categoría del estudiante:</p>

<ul>
  <li>📘 <strong>Ciclo Básico:</strong> RD$360.00</li>
  <li>🧪 <strong>Pre-Médica:</strong> RD$560.00</li>
  <li>🌍 <strong>Estudiantes Extranjeros:</strong>
    <ul>
      <li>Admisión: USD$900.00</li>
      <li>Crédito: USD$50.00</li>
      <li><strong><em>Nota:</em></strong> Esta tarifa aplica a todos los extranjeros, excepto venezolanos y haitianos.</li>
    </ul>
  </li>
</ul>

<p>📌 Estos montos deben ser pagados durante el proceso de solicitud de admisión, según aplique.</p>`,


        '6': `
<h3>🗓️ Calendario Académico - UASD</h3>
<p>Consulta las fechas importantes del proceso de admisión, inscripciones, pruebas, selección de materias y más en nuestro calendario académico oficial.</p>

<p>📅 Mantente al día con todas las actividades accediendo al siguiente enlace:</p>
<p><a href="https://uasd.edu.do/calendario-academico/" target="_blank" style="color: blue;">Ver Calendario Académico</a></p>`,
       
        '8': welcomeMessage,
      },
    },
    '3': {
      title: 'Departamento de Registro',
      options: [
        { key: '1', label: 'Inscripción en Asignaturas' },
        { key: '2', label: 'Cambio de Carrera' },
        { key: '3', label: 'Reingreso' },
        { key: '4', label: 'Retiro de Asignatura' },
        { key: '5', label: 'Solicitud de Graduación' },
        { key: '6', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': `
<h3>📝 Inscripción de Asignaturas - UASD</h3>
<p>¡Inscribir tus asignaturas en la UASD nunca había sido tan fácil! Gracias a la actualización del sistema <strong>Banner</strong>, puedes completar el proceso en tan solo 5 minutos.</p>

<h4>Pasos para realizar tu inscripción:</h4>
<ol>
  <li>Ingresa al <a href="https://eis.uasd.edu.do/authenticationendpoint/login.do?Name=PreLoginRequestProcessor&commonAuthCallerPath=%252Fcas%252Flogin&forceAuth=true&passiveAuth=false&service=https%3A%2F%2Fssb.uasd.edu.do%3A443%2Fssomanager%2Fc%2FSSB&tenantDomain=carbon.super&sessionDataKey=2a3ee2c5-831c-47d8-afce-39268b494801&relyingParty=SSO+Manager+PROD&type=cas&sp=SSO+Manager+PROD&isSaaSApp=false&authenticators=BasicAuthenticator:LOCAL" target="_blank" 
  style="color: blue;">Autoservicio</a></li>
  <li>Inicia sesión con tu usuario y contraseña.</li>
  <li>Selecciona la opción <strong>Alumnos</strong> &gt; <strong>Inscripción</strong> &gt; <strong>Agregar o Eliminar Clases</strong>.</li>
  <li>Selecciona el <strong>período de inscripción</strong> correspondiente y haz clic en <strong>Enviar</strong>.</li>
  <li>Haz clic en la opción <strong>Proyecciones</strong> para ver tus asignaturas proyectadas.</li>
  <li>Para inscribir, haz clic en <strong>Ver Secciones</strong> y selecciona la sección de tu preferencia con el botón <strong>Agregar</strong>.</li>
  <li>Una vez seleccionadas tus materias, haz clic en <strong>Enviar</strong> (ubicado en el lateral derecho de la página).</li>
</ol>

<p>📌 La plataforma organiza automáticamente tu horario, así que no tienes que preocuparte por los cruces.</p>
<p>✅ Al finalizar, verás un mensaje de confirmación que indica que la inscripción fue exitosa.</p>
<p>🖥️ Puedes acceder desde cualquier dispositivo con conexión a internet.</p>`,
        '2': `
<h3>🔄 Cambio de Carrera - UASD</h3>
<p>¿Quieres pasar de Ciclo Básico a una carrera, cambiarte de carrera o hacer una transferencia? Aquí te dejamos los pasos esenciales para completar tu proceso sin complicaciones:</p>

<h4>📌 De Ciclo Básico a Carrera:</h4>
<ul>
  <li>Debes haber aprobado al menos 10 créditos.</li>
  <li>Entre las materias aprobadas debe estar <strong>Orientación</strong>, <strong>Lengua Española</strong> y <strong>Matemáticas</strong>.</li>
  <li>Presenta tu <strong>Historial de calificaciones</strong> en Registro para ser promovido a carrera.</li>
</ul>

<h4>📌 Cambio de Carrera o Transferencia:</h4>
<ol>
  <li>Descarga e imprime tu <strong>historial de calificaciones completo</strong>.</li>
  <li>Realiza el pago correspondiente (si tienes materias pendientes de pago, hazlo primero).</li>
  <li>Lleva los documentos a Registro para recibir el formulario y fecha de la <strong>charla de orientación</strong>.</li>
  <li>Asiste a la charla obligatoria a la hora indicada.</li>
  <li>Te entregarán un <strong>cuestionario personal</strong> y una <strong>guía de investigación de carrera</strong> que debes completar.</li>
  <li>Descarga el <strong>pensum</strong> de la carrera a la que deseas ingresar y llévalo impreso.</li>
  <li>Luego tendrás una segunda cita con el orientador para evaluar tus respuestas y motivación.</li>
</ol>

<h4>📄 Documentos requeridos para la segunda cita:</h4>
<ul>
  <li>Copia de la cédula.</li>
  <li>Pensum de la nueva carrera.</li>
  <li>Cuestionario y guía llenos.</li>
  <li>Historial de calificaciones impreso.</li>
  <li>Recibo de pago.</li>
</ul>

<p>✅ Guarda todos tus comprobantes y documentos del proceso. No completar correctamente los pasos puede hacer que debas repetir el trámite y volver a pagar.</p>

<p>💡 Consejo: Imprime tu hoja del historial de calificaciones cada semestre y mantén tus materias selladas y organizadas.</p>`,
        '3': `
¿Estuviste inactivo por uno o más semestres y deseas continuar tus estudios en la UASD?<br><br>

Puedes realizar tu solicitud de <strong>reingreso</strong> en línea de forma rápida y sencilla. Solo sigue estos pasos:

📌 <strong>Pasos para solicitar el reingreso:</strong><br>

1️⃣ <strong>Ingresa al formulario:</strong>  
Accede al enlace 👉 <a href="https://soft.uasd.edu.do/reingreso/" target="_blank" style="color: #007bff;">https://soft.uasd.edu.do/reingreso/</a><br>

2️⃣ <strong>Completa tus datos:</strong><br>
🆔 Matrícula<br> 
🪪 Número de cédula <br> 
📅 Fecha de nacimiento  <br>
📞 Teléfono (residencial y celular)  <br>
📧 Correo electrónico válido<br>

3️⃣ <strong>Verifica la información:</strong>  
Asegúrate de que todos los datos estén correctos antes de enviar.<br>

4️⃣ <strong>Envía tu solicitud:</strong>  <br>
Haz clic en "Enviar" y espera la confirmación con tus datos.<br><br>

✅ ¡Listo! Tu solicitud será procesada y podrás continuar con tu inscripción académica.

Si necesitas ayuda adicional, puedes comunicarte con soporte o visitar el portal de estudiantes de la UASD.`,

'4': `
Has seleccionado <strong>Retiro de Asignatura</strong> 🙋‍♂️  
Aquí te explico cómo hacerlo paso a paso:

<br><br>

1️⃣ <strong>Consulta las fechas oficiales de retiro</strong>  
📅 Puedes verlas en el  
<a href="https://uasd.edu.do/calendario-academico/" target="_blank" style="color: #007bff;">Calendario Académico de la UASD</a>.

<br><br>

2️⃣ <strong>Accede al portal de autoservicio</strong>  
Dirígete a: <br>  
<strong>Alumnos > Inscripción > Agregar o eliminar clases</strong>

<br><br>

3️⃣ <strong>Selecciona el período actual</strong>  
Haz clic en <strong>Enviar</strong> para continuar.

<br><br>

4️⃣ <strong>Busca la materia que deseas retirar</strong>  
En la columna de acción, elige la opción  
<strong>Retiro Oficial por Web</strong>

<br><br>

5️⃣ <strong>Verifica bien antes de confirmar</strong>  
⚠️ Asegúrate de que sea la asignatura correcta.  
Una vez retirada, no podrás restablecerla.

<br><br>

6️⃣ <strong>Haz clic en "Enviar Cambios"</strong>  
✅ Y ¡listo! La materia quedará retirada oficialmente.

<br><br>

Si tienes dudas, puedes acudir al departamento de Registro o tu facultad.  
¡Suerte con el proceso! 💪😊`,
        '5': 'Realiza tu solicitud de graduación a través de nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '6': welcomeMessage,
      },
    },
    '4': {
      title: 'Educación Permanente',
      options: [
        { key: '1', label: 'Cursos de Educación Permanente' },
        { key: '2', label: 'Obtener Certificado' },
        { key: '3', label: 'Información General' },
        { key: '4', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Explora nuestros cursos de educación permanente en nuestro [sitio web](https://uasd.edu.do/educacion-permanente)',
        '2': 'Gestiona tus certificados a través de nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '3': 'Información general sobre educación permanente en nuestro [sitio web](https://uasd.edu.do/info)',
        '4': welcomeMessage,
      },
    },
    '5': {
      title: 'Asistencia Financiera (Becas)',
      options: [
        { key: '1', label: 'Tipos de Becas' },
        { key: '2', label: 'Requisitos para Becas' },
        { key: '3', label: 'Solicitud de Becas' },
        { key: '4', label: 'Información Adicional' },
        { key: '5', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': `
Has seleccionado <strong>Tipos de Becas 🎓</strong>  
Te cuento brevemente cuáles están disponibles:

<br><br>

🌍 <strong>Becas Internacionales</strong>  
Programas para estudios en el extranjero.  
Requieren formulario en línea y documentos validados.

<br><br>

🇩🇴 <strong>Becas Nacionales</strong>  
Disponibles para bachillerato, grado y postgrado en RD.  
Incluyen requisitos académicos y documentación básica.

<br><br>

🌐 <strong>Movilidad Estudiantil</strong>  
Programas como la Red de Macro Universidades permiten estudiar un tiempo fuera del país.

<br><br>

📲 <strong>¿Te interesa aplicar?</strong>  
Revisa el portal oficial:  
<a href="https://becas.gob.do" target="_blank" style="color: #007bff;">becas.gob.do</a>  
y mantente atento a las convocatorias en  
<a href="https://www.instagram.com/mescytrd/?hl=es-la" target="_blank" style="color: #007bff;">@mescytrd</a>.`,

       '2': `
Has seleccionado <strong>Requisitos para Becas 📄</strong>  
Aquí te dejo los principales requisitos que debes cumplir para aplicar:

<br><br>

✅ <strong>Requisitos Generales</strong>  
• Tener nacionalidad dominicana 🇩🇴  
• Índice académico mínimo de <strong>80/100</strong> o <strong>3.0/4.0</strong>  
• Ser estudiante, egresado, docente o empleado de la UASD  
• Contar con récord de notas y certificados legalizados por el <strong>MESCyT</strong>

<br><br>

🎓 <strong>Para Becas de Grado</strong>  
• Promedio mínimo de <strong>80 en bachillerato</strong>  
• Documentos:  
— Foto 2x2  
— Fotocopia de cédula  
— Acta de nacimiento (si aplica)  
— Récord y certificación del bachillerato legalizados

<br><br>

📚 <strong>Para Becas de Postgrado</strong>  
• Título y récord de grado legalizados por el MESCyT  
• Plan de estudio y presupuesto del programa a cursar

<br><br>

📲 Recuerda que cada convocatoria puede tener requisitos adicionales, así que revisa bien cada oferta publicada en  
<a href="https://becas.gob.do" target="_blank" style="color: #007bff;">becas.gob.do</a>  
y sigue a  
<a href="https://www.instagram.com/mescytrd/?hl=es-la" target="_blank" style="color: #007bff;">@mescytrd</a>  
para mantenerte al tanto.`,
        '3': `
Has seleccionado <strong>Solicitud de Becas 📑</strong>  
Aquí te explico cómo hacer la solicitud paso a paso:

<br><br>

1️⃣ <strong>Accede al portal de becas</strong>  
Ingresa a:  
<a href="https://becas.gob.do" target="_blank" style="color: #007bff;">becas.gob.do</a>

<br><br>

2️⃣ <strong>Regístrate en el portal</strong>  
Completa tus datos personales, como cédula y correo, para comenzar con tu solicitud.

<br><br>

3️⃣ <strong>Revisa las convocatorias</strong>  
Asegúrate de verificar las fechas de apertura y los requisitos específicos de cada convocatoria.

<br><br>

4️⃣ <strong>Prepara los documentos requeridos</strong>  
Recuerda que algunos documentos deben ser legalizados, como tu cédula, récord de notas, título de grado, etc.

<br><br>

5️⃣ <strong>Envía tu solicitud</strong>  
Una vez tengas todos los documentos y cumplas con los requisitos, envía tu solicitud a través del portal.

<br><br>

📲 <strong>¡Mantente pendiente!</strong>  
Sigue las redes sociales del MESCyT e INAFOCAM para estar al tanto de las convocatorias y noticias relacionadas:  
<a href="https://www.instagram.com/mescytrd/?hl=es-la" target="_blank" style="color: #007bff;">@mescytrd</a>  
<a href="https://www.instagram.com/inafocamrd/?hl=es" target="_blank" style="color: #007bff;">@inafocamrd</a>

<br><br>

🔎 Consulta más detalles y fechas en el  
<a href="https://becas.gob.do" target="_blank" style="color: #007bff;">portal oficial de becas del MESCyT</a>.`,
        '4': `
Has seleccionado <strong>Información Adicional 📚</strong>  
Aquí te dejo algunos detalles que podrían serte útiles durante el proceso de solicitud de becas:

<br><br>

🔑 <strong>Consejos para una solicitud exitosa:</strong>  
• Asegúrate de cumplir con todos los requisitos antes de enviar tu solicitud.  
• Revisa que todos tus documentos estén correctamente legalizados y actualizados.  
• Prepara una carta de motivación si la convocatoria lo requiere, explicando por qué te gustaría recibir la beca y cómo impactará en tu desarrollo académico.

<br><br>

💡 <strong>Otras becas que podrías considerar:</strong>  
• Becas del <strong>INAFOCAM</strong>: Para estudios de posgrado, formación docente y más. Más información en:  
<a href="https://www.inafocam.gob.do" target="_blank" style="color: #007bff;">inafocam.gob.do</a>  
• Becas del <strong>MESCyT</strong>: Además de las becas nacionales e internacionales, también cuentan con programas de apoyo a investigaciones y programas específicos.  
<a href="https://www.mescyt.gob.do" target="_blank" style="color: #007bff;">mescyt.gob.do</a>

<br><br>

🌟 <strong>Recomendaciones para estar preparado:</strong>  
• Mantén tus documentos organizados y digitalizados para facilitar el proceso de carga en el portal.  
• Revisa las fechas de convocatoria en las redes sociales del MESCyT e INAFOCAM para no perderte ninguna oportunidad.

<br><br>

📲 <strong>¡Síguenos en redes sociales!</strong>  
Recibe actualizaciones y más información en:  
<a href="https://www.instagram.com/mescytrd/?hl=es-la" target="_blank" style="color: #007bff;">@mescytrd</a>  
<a href="https://www.instagram.com/inafocamrd/?hl=es" target="_blank" style="color: #007bff;">@inafocamrd</a>`,
        '5': welcomeMessage,
      },
    },
    '6': {
      title: 'Plataforma Virtual',
      options: [
        { key: '1', label: 'Acceso a Plataforma Virtual' },
        { key: '2', label: 'Ayuda con Plataforma' },
        { key: '4', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Accede a nuestra plataforma virtual <a href="https://app.uasd.edu.do/UASDVirtualGateway/" style="color: blue;" target="_blank">aquí</a>',
        '2': 'En caso de tener problemas con la plataforma, diríjase al recinto a la unidad de UASD Virtual.',
        '4': welcomeMessage,
      },
    },
    '7': {
      title: 'Departamento de Extensión',
      options: [
        { key: '1', label: 'Programas de Extensión' },
        { key: '2', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Actualmente contamos con el programa de extensión: <strong>“UASD San Juan Visita Tu Escuela.',
        '2': welcomeMessage,
      },
    },
     '8': {
      title: 'Reclamaciones',
      options: [
        { key: '1', label: 'Presentar Reclamación' },
        { key: '2', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Para presentar una reclamación, dirígete al recinto UASD y acude al departamento correspondiente: <strong>Bienestar Estudiantil</strong>, <strong>Registro</strong>, <strong>Caja</strong>, entre otros, según el caso.',
        '2': welcomeMessage,
      }
    },
    '9': {
      title: 'Hablar con un Agente',
      options: [],
      responses: {
        '1': 'Espera mientras te ponemos en contacto con un agente...', // Mensaje de espera
      },
    },
  };

  const sendWelcomeMessage = () => {
    if (!hasInteracted) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            text: welcomeMessage,
            isUser: false,
            options: welcomeOptions,
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        setHasInteracted(true);
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


    

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!userInput.trim() && !hasInteracted) {
      sendWelcomeMessage();
      return;
    }

    if (!userInput.trim()) return;

    // Mostrar el mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      text: userInput,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');

    if (!hasInteracted) {
      sendWelcomeMessage();
      return;
    }

    // Simular procesamiento
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Buscar coincidencias en las opciones
    let foundResponse = false;
    let response = '';
    let responseOptions: MenuOption[] = [];

    const lowerInput = userInput.toLowerCase();
    const keywords: Record<string, string[]> = {
      'pago': ['1', '1'],
      'balance': ['1', '4'],
      'admisión': ['2', '1'],
      'costo': ['2', '5'],
      'inscripción': ['3', '1'],
      'asignaturas': ['3', '1'],
      'cambio': ['3', '2'],
      'carrera': ['3', '2'],
      'curso': ['4', '1'],
      'becas': ['5', '1'],
      'beca': ['5', '1'],
      'plataforma': ['6', '1'],
      'virtual': ['6', '1'],
      'extensión': ['7', '1'],
      'reclamación': ['8', '1'],
      'queja': ['8', '1'],
    };

    // Buscar palabras clave
    for (const [keyword, [menuKey, optionKey]] of Object.entries(keywords)) {
      if (lowerInput.includes(keyword)) {
        const menu = menus[menuKey as MenuKey];
        response = menu.responses[optionKey as ResponseKey] || 'No pude encontrar información específica. ¿Podrías ser más específico?';
        responseOptions = welcomeOptions;
        foundResponse = true;
        break;
      }
    }

    // Si no se encontró coincidencia
    if (!foundResponse) {
      response = 'No he entendido completamente tu consulta. ¿Podrías seleccionar una de estas opciones?';
      responseOptions = welcomeOptions;
    }

    // Añadir respuesta del bot
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      options: responseOptions,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev.filter((m) => !m.isTyping), botMessage]);
    setIsTyping(false);

    try {
      notificationSound.play();
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  };

  const handleOptionClick = async (option: MenuOption) => {
    // Mostrar el mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      text: option.label,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
  
    // Determinar la respuesta del bot
    let response = 'Opción no válida. Por favor, seleccione una opción válida.';
    let nextOptions: MenuOption[] = [];
  
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
  
    if (!currentMenu) {
      const menuKey = option.key as MenuKey;
      setCurrentMenu(menuKey);
      response = `Has seleccionado: ${menus[menuKey].title}`;
      nextOptions = menus[menuKey].options;
    } else {
      // Si ya hay un menú seleccionado
      const menuKey = currentMenu;
      const optKey = option.key as ResponseKey;
      
      // Si la opción es "Regresar al Menú Principal"
      if (option.label.includes("Regresar al Menú Principal")) {
        setCurrentMenu(null);
        response = welcomeMessage;
        nextOptions = welcomeOptions;
      } 
      // Si es la opción "Hablar con un Agente"
      else if (menuKey === '9') {
        response = menus[menuKey].responses['1'] || 'Conectando con un agente...';
        nextOptions = [];
      }
      // Para cualquier otra opción de menú
      else {
        response = menus[menuKey].responses[optKey] || 'No hay información disponible para esta opción.';
        nextOptions = menus[menuKey].options;
      }
    }
  
    // Mostrar la respuesta del bot
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      options: nextOptions,
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev.filter((m) => !m.isTyping), botMessage]);
    setIsTyping(false);
  
    try {
      notificationSound.play();
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentMenu(null);
    setHasInteracted(false);
  };

  const renderOptions = (options: MenuOption[] | undefined) => {
    if (!options || options.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => handleOptionClick(opt)}
            className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Backdrop overlay when chat is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="chatbot-icon">
        {/* Chat button */}
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}

        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {currentMenu && (
                    <button
                      onClick={() => {
                        setCurrentMenu(null);
                        handleOptionClick({ key: '6' as ResponseKey, label: 'Regresar al Menú Principal' });
                      }}
                      className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <h3 className="text-lg font-medium text-white">Asistente UASD San Juan</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetChat}
                    className="text-xs bg-white/20 hover:bg-white/30 transition-colors px-2 py-1 rounded-md"
                    title="Reiniciar conversación"
                  >
                    Reiniciar
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 transition-colors p-1 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
  {messages.length === 0 && !isTyping && (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 p-4">
      <MessageCircle className="w-12 h-12 text-blue-200" />
      <p className="text-center">¡Bienvenido al Asistente de UASD San Juan! Envía un mensaje para comenzar.</p>
    </div>
  )}

  <AnimatePresence initial={false}>
    {messages.map((msg) => (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-[80%] ${msg.isUser ? 'order-1' : 'order-0'}`}>
          <div
            className={`px-4 py-2 rounded-2xl shadow-sm ${
              msg.isUser
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none'
            }`}
            dangerouslySetInnerHTML={{ __html: msg.text }} // Cambiado aquí
          />
          {msg.options && renderOptions(msg.options)}
          <div className="text-xs text-gray-500 mt-1 px-1">
            {formatTime(msg.timestamp)}
          </div>
        </div>
      </motion.div>
    ))}
  </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%]">
                      <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="bg-gray-400 rounded-full w-2 h-2 inline-block"
                        />
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          className="bg-gray-400 rounded-full w-2 h-2 inline-block"
                        />
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          className="bg-gray-400 rounded-full w-2 h-2 inline-block"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                  placeholder={messages.length > 0 ? 'Escribe un mensaje...' : 'Envía un mensaje para comenzar...'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                  disabled={isTyping}
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

};

export default ChatBot;