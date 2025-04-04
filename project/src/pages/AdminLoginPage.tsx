import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Obtener la ruta de redirección si existe
  const from = (location.state as any)?.from?.pathname || '/admin-panel';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Llamar al método login del AuthContext
      await login(username, password);
      
      // Si el login es exitoso, redirigir
      navigate(from, { replace: true });
    } catch (err: any) {
      // Mostrar mensaje de error
      setError(err.message || 'Usuario o contraseña incorrectos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#003087] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#FFFF00] opacity-20 rounded-full" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#FF0000] opacity-20 rounded-full" />
      
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-sans font-bold text-[#003087] mb-6 text-center tracking-wide">
          Área Administrativa
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              className="w-full p-4 text-[#333333] bg-white border border-[#4C78A8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C78A8] transition-all duration-200"
              required
              disabled={isLoading}
            />
            <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#4C78A8] rounded-full" />
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full p-4 text-[#333333] bg-white border border-[#4C78A8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4C78A8] transition-all duration-200"
              required
              disabled={isLoading}
            />
            <span className="absolute bottom-0 right-0 w-12 h-1 bg-[#4C78A8] rounded-full" />
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-[#4C78A8] text-white rounded-md font-sans font-semibold tracking-wide hover:bg-[#003087] transition-all duration-300 shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          {error && (
            <p className="text-[#FF0000] text-center font-sans text-sm mt-4">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;