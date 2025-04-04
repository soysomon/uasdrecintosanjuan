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
        '1': 'Métodos de pago disponibles: Pago en línea a través de nuestra plataforma virtual, transferencia bancaria a nuestra cuenta oficial, y pago en persona en nuestras oficinas. [Más información](https://uasd.edu.do/finanzas)',
        '2': 'Puedes realizar tu pago en línea a través de nuestra plataforma virtual. Si necesitas ayuda, contacta soporte: [Soporte](tel:18095358273)',
        '3': 'Puedes realizar transferencias a nuestra cuenta oficial. [Ver detalles bancarios](https://uasd.edu.do/finanzas)',
        '4': 'Consulta tu balance actual en nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '5': 'Encuentra respuestas a preguntas frecuentes en nuestro [sitio web](https://uasd.edu.do/faq)',
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
        { key: '7', label: 'Guías de Examen' },
        { key: '8', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Consulta todos los requisitos de admisión en nuestra sección de [admisiones](https://uasd.edu.do/admisiones)',
        '2': 'Realiza tu solicitud de admisión en nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '3': 'Explora nuestras ofertas académicas en nuestro [sitio web oficial](https://uasd.edu.do/ofertas)',
        '4': 'Para convalidaciones, contacta directamente al departamento de [admisiones](tel:18095358273)',
        '5': 'Información detallada sobre costos de admisión en nuestro [sitio web](https://uasd.edu.do/costos)',
        '6': 'Consulta nuestro calendario actualizado de admisiones en nuestro [sitio web](https://uasd.edu.do/calendario)',
        '7': 'Descarga las guías de preparación para exámenes de admisión en nuestro [sitio web](https://uasd.edu.do/guias)',
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
        '1': 'Realiza tu inscripción en asignaturas a través de nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '2': 'Para cambio de carrera, completa el formulario disponible en nuestro [sitio web](https://uasd.edu.do/registro)',
        '3': 'Para solicitar reingreso, contacta al departamento de [registro](tel:18095358273)',
        '4': 'Gestiona el retiro de asignaturas a través de nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
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
        '1': 'Conoce los diferentes tipos de becas disponibles en nuestro [sitio web](https://uasd.edu.do/becas)',
        '2': 'Consulta los requisitos para aplicar a becas en nuestro [sitio web](https://uasd.edu.do/becas-requisitos)',
        '3': 'Realiza tu solicitud de beca a través de nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '4': 'Para información adicional, contacta a nuestro departamento de becas: [tel:18095358273](mailto:[email protected])',
        '5': welcomeMessage,
      },
    },
    '6': {
      title: 'Plataforma Virtual',
      options: [
        { key: '1', label: 'Acceso a Plataforma Virtual' },
        { key: '2', label: 'Ayuda con Plataforma' },
        { key: '3', label: 'Recursos en Línea' },
        { key: '4', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Accede a nuestra plataforma virtual [aquí](https://virtual.uasd.edu.do)',
        '2': 'Para soporte técnico con la plataforma: [tel:18095358273](mailto:[email protected])',
        '3': 'Explora nuestros recursos en línea a través de nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '4': welcomeMessage,
      },
    },
    '7': {
      title: 'Departamento de Extensión',
      options: [
        { key: '1', label: 'Programas de Extensión' },
        { key: '2', label: 'Eventos Comunitarios' },
        { key: '3', label: 'Voluntariado' },
        { key: '4', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Conoce nuestros programas de extensión en nuestro [sitio web](https://uasd.edu.do/extension)',
        '2': 'Mantente informado sobre eventos comunitarios en nuestro [sitio web](https://uasd.edu.do/eventos)',
        '3': 'Para participar como voluntario, contacta: [tel:18095358273](mailto:[email protected])',
        '4': welcomeMessage,
      },
    },
    '8': {
      title: 'Reclamaciones',
      options: [
        { key: '1', label: 'Presentar Reclamación' },
        { key: '2', label: 'Estatus de Reclamación' },
        { key: '3', label: 'Políticas de Reclamaciones' },
        { key: '4', label: 'Regresar al Menú Principal' },
      ],
      responses: {
        '1': 'Presenta tu reclamación a través de nuestro [sitio web](https://uasd.edu.do/reclamaciones)',
        '2': 'Consulta el estatus de tu reclamación en nuestra [plataforma virtual](https://virtual.uasd.edu.do)',
        '3': 'Conoce nuestras políticas de reclamaciones en nuestro [sitio web](https://uasd.edu.do/politicas)',
        '4': welcomeMessage,
      },
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

      <div className="fixed bottom-4 right-4 z-50">
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
                  <h3 className="text-lg font-medium">Asistente UASD San Juan</h3>
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
                        >
                          {msg.text}
                        </div>
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