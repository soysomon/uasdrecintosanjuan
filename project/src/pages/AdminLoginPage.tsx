import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import gsap from 'gsap';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordContainerRef = useRef<HTMLDivElement>(null);
  
  // Obtener la ruta de redirección si existe
  const from = (location.state as any)?.from?.pathname || '/admin-panel';

  // Animación inicial al cargar - con un pequeño retraso para evitar flashes del diseño antiguo
  useEffect(() => {
    // Aseguramos que los elementos estén inicialmente ocultos para evitar flashes
    if (formRef.current) {
      gsap.set(formRef.current, { opacity: 0, y: 30 });
    }
    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
    }
    
    // Pequeño retraso para asegurar que el DOM esté completamente cargado
    const timer = setTimeout(() => {
      const tl = gsap.timeline();
      
      tl.to(logoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      });
      
      tl.to(formRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          // Focus en el campo de usuario al cargar
          if (usernameInputRef.current) {
            usernameInputRef.current.focus();
          }
        }
      }, "-=0.3");
    }, 100); // Pequeño retraso
    
    return () => clearTimeout(timer);
  }, []);

  // Animación para mostrar el campo de contraseña
  const animatePasswordField = (show: boolean) => {
    if (passwordContainerRef.current) {
      if (show) {
        gsap.fromTo(passwordContainerRef.current,
          { 
            height: 0, 
            opacity: 0,
            marginTop: 0
          },
          {
            height: 'auto',
            opacity: 1,
            marginTop: 16,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              if (passwordInputRef.current) {
                passwordInputRef.current.focus();
              }
            }
          }
        );
      } else {
        gsap.to(passwordContainerRef.current, {
          height: 0,
          opacity: 0,
          marginTop: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            if (usernameInputRef.current) { // usernameInputRef can keep its name
              usernameInputRef.current.disabled = false;
              usernameInputRef.current.focus();
            }
          }
        });
      }
    }
  };

  // Animación para error de contraseña
  const animateError = () => {
    gsap.to(formRef.current, {
      keyframes: {
        x: [-10, 10, -10, 10, -5, 5, -5, 5, 0]
      },
      duration: 0.5,
      ease: "power2.inOut"
    });
    
    gsap.to(".input-field", {
      borderColor: "#FF3B30",
      boxShadow: "0 0 5px rgba(255, 59, 48, 0.5)",
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });
  };

  // Animación para login exitoso
  const animateSuccess = () => {
    setIsSuccess(true);
    
    const tl = gsap.timeline();
    
    tl.to(formRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in"
    });
    
    tl.to(logoRef.current, {
      scale: 1.2,
      duration: 0.6,
      ease: "power1.inOut"
    }, "-=0.3");
    
    tl.to(containerRef.current, {
      backgroundColor: "rgba(0, 122, 255, 0.1)",
      duration: 1,
      ease: "power1.out",
      onComplete: () => {
        // Redirigir después de la animación
        navigate(from, { replace: true });
      }
    }, "-=0.3");
  };

  // Función para avanzar al campo de contraseña
  const handleNextStep = () => {
    if (email.trim() !== '') {
      setShowPasswordField(true);
      setTimeout(() => {
        animatePasswordField(true);
      }, 50);
    }
  };

  // Función para volver al campo de usuario
  const handleBackToUsername = () => {
    setShowPasswordField(false);
    setPassword('');
    setError('');
    animatePasswordField(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showPasswordField) {
      handleNextStep();
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      // Llamar al método login del AuthContext
      await login(email, password);
      
      // Si el login es exitoso, iniciar animación
      animateSuccess();
    } catch (err: any) {
      // Mostrar mensaje de error y animar
      setError(err.message || 'Usuario o contraseña incorrectos');
      animateError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNextStep();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center min-h-screen bg-[#FAFAFA] relative overflow-hidden transition-colors duration-500"
      style={{ fontSize: '16px' }}
    >
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#007AFF] opacity-5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#5AC8FA] opacity-10 rounded-full blur-2xl" />
      
      {/* Contenedor principal - Aumentado de tamaño */}
      <div className="relative bg-white rounded-2xl shadow-xl p-12 w-full max-w-lg transform transition-all duration-500 scale-110 my-8">
        
        {/* Logo UASD - Ajustado para mejor visibilidad */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            {/* Círculo de puntos de colores estilo Apple - Ahora más amplio */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'scale(1.6)', zIndex: 1 }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="85" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="2,3" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF9500" />
                    <stop offset="25%" stopColor="#5AC8FA" />
                    <stop offset="50%" stopColor="#007AFF" />
                    <stop offset="75%" stopColor="#AF52DE" />
                    <stop offset="100%" stopColor="#FF2D55" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Logo asegurado que se muestre por encima del círculo decorativo */}
            <img 
              ref={logoRef}
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/Logo+UASD/logo+login.png" 
              alt="Logo UASD" 
              className="h-32 w-auto relative z-20"  
              style={{ 
                transform: 'scale(1.3)',
                filter: 'none',
                opacity: 0  // Inicialmente invisible para la animación
              }}
            />
          </div>
        </div>
        
        <h2 className="text-3xl font-sans font-bold text-[#1D1D1F] mb-4 text-center tracking-tight" style={{ fontSize: '2.25rem' }}>
          Panel Administrativo
        </h2>
        
        <p className="text-center text-[#86868B] mb-10" style={{ fontSize: '1.25rem' }}>
          Acceso exclusivo para personal autorizado
        </p>

        <form 
          ref={formRef} 
          onSubmit={handleSubmit} 
          className="space-y-6"
          style={{ opacity: 0 }}  // Inicialmente invisible para la animación
        >
          {/* Campo de usuario con flecha - siempre editable */}
          <div className="relative">
            <input
              ref={usernameInputRef} // Ref can keep its name, or change to emailInputRef
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleUsernameKeyDown}
              placeholder="Correo electrónico"
              className="input-field w-full p-6 pr-14 text-[#1D1D1F] bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-[#0071E3] transition-all duration-200"
              style={{ fontSize: '1.2rem' }}
              required
              disabled={isLoading || isSuccess}
              onClick={() => {
                if (showPasswordField) {
                  handleBackToUsername();
                }
              }}
            />
            {!showPasswordField && (
              <button 
                type="button" 
                onClick={handleNextStep}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#0071E3] hover:text-[#0077ED]"
                disabled={email.trim() === '' || isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Campo de contraseña que aparece después - más grande */}
          <div 
            ref={passwordContainerRef} 
            className="relative" 
            style={{ height: 0, opacity: 0, overflow: 'hidden' }}
          >
            <div className="flex items-center justify-between mb-2">
              <button 
                type="button" 
                onClick={handleBackToUsername} 
                className="text-[#0071E3] hover:text-[#0077ED] flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Cambiar usuario</span>
              </button>
            </div>
            
            <div className="relative">
              <input
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="input-field w-full p-6 pr-14 text-[#1D1D1F] bg-white border border-[#D2D2D7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-[#0071E3] transition-all duration-200"
                style={{ fontSize: '1.2rem' }}
                required
                disabled={isLoading || isSuccess}
              />
              <button 
                type="submit" 
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#0071E3] hover:text-[#0077ED]"
                disabled={password.trim() === '' || isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Checkbox estilo Apple */}
            <div className="flex items-center mt-5">
              <input
                type="checkbox"
                id="remember-me"
                className="h-6 w-6 text-[#0071E3] border-[#D2D2D7] rounded focus:ring-[#0071E3]"
              />
              <label htmlFor="remember-me" className="ml-3 block text-[#86868B]" style={{ fontSize: '1.1rem' }}>
                Mantener la sesión iniciada
              </label>
            </div>
          </div>

          {error && (
            <div className="animate-fadeIn">
              <p className="text-[#FF3B30] text-center font-sans mt-3" style={{ fontSize: '1.1rem' }}>
                {error}
              </p>
              <p className="text-[#86868B] text-center font-sans mt-2" style={{ fontSize: '0.95rem' }}>
                Si no tienes acceso autorizado, sal de esta página.
              </p>
            </div>
          )}
        </form>
        
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-2xl" style={{ zIndex: 30 }}>
            <div className="text-center">
              <svg className="mx-auto h-20 w-20 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="mt-3 text-[#1D1D1F] font-medium" style={{ fontSize: '1.4rem' }}>Acceso correcto</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-6 text-center w-full text-[#86868B]" style={{ fontSize: '1rem', bottom:'2rem' }}>
        <p>Esta sección está reservada exclusivamente para el personal autorizado.
           Si no dispone de los permisos correspondientes, le solicitamos salir de esta página.</p>
      </div>
    </div>
  );
};

export default AdminLoginPage;