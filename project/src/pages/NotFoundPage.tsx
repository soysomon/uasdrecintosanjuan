import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Banner superior con colores de Heidelberg (azul marino) */}
        <div className="h-20 bg-gradient-to-r from-blue-900 to-blue-800 flex items-center justify-center">
          <h1 className="text-white text-3xl font-serif">Página no encontrada</h1>
        </div>
        
        {/* Contenido principal */}
        <div className="p-8 flex flex-col md:flex-row items-center">
          {/* Número 404 grande */}
          <div className="text-center md:w-1/3">
            <div className="text-9xl font-bold text-blue-900">404</div>
          </div>
          
          {/* Mensaje y contador */}
          <div className="md:w-2/3 md:pl-8 md:border-l border-gray-200">
            <h2 className="text-2xl font-serif text-blue-900 mb-4">Lo sentimos, esta página no existe</h2>
            <p className="text-gray-700 mb-6">
              La página que estás intentando visitar no está disponible o ha sido movida. 
              Serás redirigido a la página principal en <span className="font-bold text-blue-900">{countdown}</span> segundos.
            </p>
            
            {/* Enlaces útiles */}
            <div className="mt-6 space-y-4">
              <Link 
                to="/" 
                className="flex items-center text-blue-900 hover:text-blue-700 transition-colors"
              >
                → Ir a la página principal ahora
              </Link>
              
              <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
                Si crees que esto es un error, por favor contacta al administrador en 
                <a href="mailto:info@uasd.edu.do" className="text-blue-900 hover:underline mx-1">info@uasd.edu.do</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 px-8 py-4 text-center text-gray-600 text-sm">
          <p>© 2025 UASD Recinto San Juan. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;