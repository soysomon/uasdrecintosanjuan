import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Twitter, Youtube, Instagram, Check, Send, MessageCircle, Loader } from 'lucide-react';

// Registrar ScrollTrigger con GSAP
gsap.registerPlugin(ScrollTrigger);

// Información de redes sociales
const socialMedia = [
  { name: 'Facebook', url: 'https://www.facebook.com/uasdrecintosanjuan', icon: Facebook },
  { name: 'Twitter', url: 'https://twitter.com/UASDSanJuan_', icon: Twitter },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCXk2XaQDLJlzZ3JYltFFP4Q', icon: Youtube },
  { name: 'Instagram', url: 'https://www.instagram.com/uasdsanjuan/', icon: Instagram },
];

// Departamentos de la universidad para el dropdown
const departamentos = [
  { value: 'info', label: 'Información General', email: 'info@uasdsanjuan.edu.do' },
  { value: 'admisiones', label: 'Admisiones', email: 'admisiones@uasdsanjuan.edu.do' },
  { value: 'registro', label: 'Registro', email: 'registro@uasdsanjuan.edu.do' },
  { value: 'bienestar', label: 'Bienestar Estudiantil', email: 'bienestar@uasdsanjuan.edu.do' },
  { value: 'economato', label: 'Economato', email: 'economato@uasdsanjuan.edu.do' },
  { value: 'orientacion', label: 'Orientación', email: 'orientacion@uasdsanjuan.edu.do' },
];

// Información de contacto
const contactInfo = {
  mainNumber: '809 557 5575',
  extensions: [
    { department: 'Caja', ext: '109' },
    { department: 'Registro', ext: '128' },
    { department: 'Admisión', ext: '137' },
    { department: 'Bienestar Estudiantil', ext: '136' },
    { department: 'Economato', number: '809 557 5110' },
    { department: 'Orientación', ext: '115, 116, 144, 145, 146' },
  ]
};

// Definir interfaces para el estado del formulario y los errores
interface FormState {
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  emailConfirm: string;
  departamento: string;
  asunto: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  emailConfirm?: string;
  emailMismatch?: string;
  asunto?: string;
  mensaje?: string;
  departamento?: string;
}

export function ContactosPage() {
  // Referencias para animaciones GSAP
  const contactFormRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const successMessageRef = useRef<HTMLDivElement>(null);
  
  // Estados para el formulario
  const [formState, setFormState] = useState<FormState>({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    emailConfirm: '',
    departamento: '',
    asunto: '',
    mensaje: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailMismatch, setEmailMismatch] = useState(false);

  // Color principal: Azul constitucional
  const primaryColor = '#003087';
  // Color secundario para el hero
  const heroColor = '#001F54';

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
    
    // Verificar coincidencia de email si es el campo de confirmación
    if (id === 'emailConfirm') {
      setEmailMismatch(value !== formState.email);
    }
    // También verificar si se cambia el email original
    if (id === 'email') {
      setEmailMismatch(value !== formState.emailConfirm && formState.emailConfirm !== '');
    }
  };
  
  // Prevenir pegar en el campo de confirmación de email
  const preventPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    alert('Por favor, escribe tu correo electrónico para confirmarlo');
  };
  
  // Validar formulario
  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formState.nombre) errors.nombre = 'El nombre es requerido';
    if (!formState.email) errors.email = 'El correo electrónico es requerido';
    if (!formState.emailConfirm) errors.emailConfirm = 'Confirma tu correo electrónico';
    if (formState.email !== formState.emailConfirm) errors.emailMismatch = 'Los correos no coinciden';
    if (!formState.asunto) errors.asunto = 'El asunto es requerido';
    if (!formState.mensaje) errors.mensaje = 'El mensaje es requerido';
    if (!formState.departamento) errors.departamento = 'Selecciona un departamento';
    
    return errors;
  };
  
  // Enviar formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Simulación de envío
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Animación del mensaje de éxito
        if (successMessageRef.current) {
          gsap.fromTo(
            successMessageRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
        
        // Reset del formulario después de 5 segundos
        setTimeout(() => {
          setIsSubmitted(false);
          setFormState({
            nombre: '',
            empresa: '',
            telefono: '',
            email: '',
            emailConfirm: '',
            departamento: '',
            asunto: '',
            mensaje: ''
          });
        }, 5000);
      }, 2000);
    }
  };

  useEffect(() => {
    // Animación para el formulario de contacto
    if (contactFormRef.current) {
      gsap.fromTo(
        contactFormRef.current,
        { opacity: 0, x: 50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 1,
          scrollTrigger: {
            trigger: contactFormRef.current,
            start: 'top 80%',
          } 
        }
      );
    }

    // Animación para la información de contacto
    if (contactInfoRef.current) {
      gsap.fromTo(
        contactInfoRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          scrollTrigger: {
            trigger: contactInfoRef.current,
            start: 'top 80%',
          } 
        }
      );
    }

    // Animación para el mapa
    if (mapRef.current) {
      gsap.fromTo(
        mapRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 1.5,
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 90%',
          } 
        }
      );
    }
    
    // Animaciones para los campos del formulario al cargar
    if (contactFormRef.current) {
      const inputs = contactFormRef.current.querySelectorAll('input, textarea, select');
      gsap.fromTo(
        inputs, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.1,
          delay: 0.5
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Espaciador para el nav */}
      <div className="pt-24 md:pt-28">
        {/* Hero Section más pequeño */}
        <div className="relative h-[40vh] bg-[#001F54] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/contacto-hero.jpg"
              alt="UASD Contactos"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#001F54]/70 to-[#001F54]/90" />
          
          {/* Animated geometric shapes */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/4 left-0 w-64 h-64 bg-white/10"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-0 right-0 w-56 h-56 bg-white/10 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: -45 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute top-0 right-1/3 w-40 h-40 bg-white/10"
          />

          <div className="relative z-10 max-w-6xl mx-auto h-full flex items-center">
            <div className="px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-4xl font-light tracking-tight text-white leading-tight mb-4">
                  Contáctanos
                </h1>
                <div className="w-20 h-1 bg-white mb-4"></div>
                <p className="text-lg font-light text-white">
                  Estamos listos para brindarte la solución adecuada según tus necesidades
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Contact Container */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Contact Info Column */}
              <div ref={contactInfoRef} className="bg-[#003087] text-white p-8 lg:p-12">
                <h2 className="text-2xl font-medium mb-6 text-white">Ponte en contacto</h2>
                <p className="text-white/80 mb-8">
                  UASD Recinto San Juan está lista para responder todas tus consultas y atender tus necesidades académicas.
                </p>

                {/* Ubicación */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-2 text-white">Oficina Principal</h3>
                  <p className="text-white/80">Ctra. Francisco del Rosario Sánchez, San Juan de la Maguana</p>
                  <p className="text-white/80">San Juan - República Dominicana</p>
                </div>

                {/* Email */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-2 text-white">Correo Electrónico</h3>
                  <p className="text-white/80">info@uasdsanjuan.edu.do</p>
                  <p className="text-white/80">admisiones@uasdsanjuan.edu.do</p>
                </div>

                {/* Teléfono con extensiones */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-2 text-white">Llámanos</h3>
                  <p className="text-white/80 font-medium">{contactInfo.mainNumber}</p>
                  <div className="mt-2 grid grid-cols-1 gap-1">
                    {contactInfo.extensions.map((item, index) => (
                      <div key={index} className="text-white/80 text-sm flex">
                        <span className="min-w-24">{item.department}:</span>
                        <span>{item.ext ? `Ext. ${item.ext}` : item.number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="font-medium text-lg mb-3 text-white">Síguenos en redes sociales</h3>
                  <div className="flex space-x-4">
                    {socialMedia.map((platform) => (
                      <a 
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full"
                      >
                        <platform.icon size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form Column */}
              <div ref={contactFormRef} className="p-8 lg:p-12 col-span-2 relative">
                {isSubmitted ? (
                  <div 
                    ref={successMessageRef}
                    className="bg-green-50 border border-green-200 rounded-lg p-8 flex flex-col items-center justify-center h-full"
                  >
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                      <Check size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-2xl font-medium text-green-800 mb-2">¡Mensaje enviado con éxito!</h3>
                    <p className="text-green-700 text-center mb-4">
                      Gracias por contactarnos. Te responderemos a la brevedad posible.
                    </p>
                    <p className="text-sm text-green-600">
                      Tu mensaje fue enviado a: {departamentos.find(d => d.value === formState.departamento)?.email || 'info@uasdsanjuan.edu.do'}
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-medium text-gray-900 mb-6 flex items-center">
                      <MessageCircle className="mr-2 text-[#003087]" />
                      Envíanos un mensaje
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                          <input
                            type="text"
                            id="nombre"
                            value={formState.nombre}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border ${formErrors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors`}
                            placeholder="Tu nombre"
                          />
                          {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
                        </div>
                        <div>
                          <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">Empresa/Institución</label>
                          <input
                            type="text"
                            id="empresa"
                            value={formState.empresa}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors"
                            placeholder="Nombre de tu empresa"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                          <input
                            type="tel"
                            id="telefono"
                            value={formState.telefono}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors"
                            placeholder="Tu número telefónico"
                          />
                        </div>
                        <div>
                          <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">Departamento*</label>
                          <select
                            id="departamento"
                            value={formState.departamento}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border ${formErrors.departamento ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors`}
                          >
                            <option value="">Selecciona un departamento</option>
                            {departamentos.map((depto) => (
                              <option key={depto.value} value={depto.value}>{depto.label}</option>
                            ))}
                          </select>
                          {formErrors.departamento && <p className="text-red-500 text-xs mt-1">{formErrors.departamento}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico*</label>
                          <input
                            type="email"
                            id="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors`}
                            placeholder="tucorreo@ejemplo.com"
                          />
                          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="emailConfirm" className="block text-sm font-medium text-gray-700 mb-1">Confirmar correo*</label>
                          <input
                            type="email"
                            id="emailConfirm"
                            value={formState.emailConfirm}
                            onChange={handleInputChange}
                            onPaste={preventPaste}
                            className={`w-full px-4 py-3 border ${emailMismatch || formErrors.emailConfirm ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors`}
                            placeholder="Confirma tu correo"
                          />
                          {formErrors.emailConfirm && <p className="text-red-500 text-xs mt-1">{formErrors.emailConfirm}</p>}
                          {emailMismatch && <p className="text-red-500 text-xs mt-1">Los correos no coinciden</p>}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">Asunto*</label>
                        <input
                          type="text"
                          id="asunto"
                          value={formState.asunto}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${formErrors.asunto ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors`}
                          placeholder="Asunto de tu mensaje"
                        />
                        {formErrors.asunto && <p className="text-red-500 text-xs mt-1">{formErrors.asunto}</p>}
                      </div>

                      <div className="mb-6">
                        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">Mensaje*</label>
                        <textarea
                          id="mensaje"
                          rows={5}
                          value={formState.mensaje}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border ${formErrors.mensaje ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md focus:ring-[#003087] focus:border-[#003087] transition-colors`}
                          placeholder="Escribe tu mensaje aquí..."
                        ></textarea>
                        {formErrors.mensaje && <p className="text-red-500 text-xs mt-1">{formErrors.mensaje}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#003087] hover:bg-[#002266] text-white py-3 px-6 rounded-md transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="animate-spin" size={20} />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Enviar Mensaje
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

        {/* Map Section */}
<div ref={mapRef} className="rounded-lg overflow-hidden shadow-lg h-96">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.527318838438!2d-71.2211011111789!3d18.80671478720885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1511c7a25c947%3A0xf47551e4f91b9ffd!2sUASD%20Recinto%20San%20Juan!5e0!3m2!1ses!2sdo!4v1712753800000!5m2!1ses!2sdo"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Ubicación UASD Recinto San Juan de la Maguana"
  ></iframe>
</div>
        </div>
      </div>
    </div>
  );
}