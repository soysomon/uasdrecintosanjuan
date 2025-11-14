import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tipos para el sistema
interface ResultadoBusqueda {
  error?: string;
  encontrado?: boolean;
  nombre?: string;
  indice?: string;
  facultad?: string;
  periodo?: string;
}

export default function MeritoriosMultiPeriodo() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2025-10");
  const [matricula, setMatricula] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultado, setResultado] = useState<ResultadoBusqueda | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const API_URL = "https://script.google.com/macros/s/AKfycbwDa37z2_erCoWo62cJ5njVEPP3ukmFO4kVu8XQrgFk35neQBXPE0TUFx1CDt3T_Nx0/exec";

  // Fecha de desbloqueo: Viernes 21 de Febrero 2025, 00:00:00
  const UNLOCK_DATE = new Date("2025-02-21T00:00:00");

  const periods = [
    { id: "2025-10", label: "Ene-Abr 2025" },
    { id: "2024-20", label: "Sep-Dic 2024" }
  ];

  useEffect(() => {
    const checkUnlock = () => {
      const now = new Date();
      if (now >= UNLOCK_DATE) {
        setIsUnlocked(true);
        setTimeRemaining("");
      } else {
        setIsUnlocked(false);
        calculateTimeRemaining();
      }
    };

    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = UNLOCK_DATE.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    checkUnlock();
    const interval = setInterval(checkUnlock, 1000);

    return () => clearInterval(interval);
  }, []);

  const jsonp = (url: string, callback: (data: any) => void) => {
    const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      callback(data);
    };

    const script = document.createElement("script");
    url += (url.includes("?") ? "&" : "?") + "callback=" + callbackName;
    script.src = url;
    document.body.appendChild(script);

    script.onerror = () => {
      delete (window as any)[callbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      callback({ error: "Error de conexión" });
    };
  };

  const buscarEstudiante = () => {
    if (!matricula.trim()) {
      setResultado({ error: "Ingrese su matrícula" });
      return;
    }

    setLoading(true);
    setResultado(null);

    jsonp(
      `${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}&periodo=${selectedPeriod}`,
      (data: ResultadoBusqueda) => {
        setLoading(false);
        setResultado(data);
      }
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Formas decorativas de fondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Círculo verde superior */}
        <motion.div
          className="absolute -top-20 right-1/4 w-32 h-32 rounded-full bg-green-400/40"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Forma rosa */}
        <motion.div
          className="absolute top-32 right-20 w-64 h-48 rounded-full bg-pink-300/30"
          style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Forma coral/roja */}
        <motion.div
          className="absolute top-16 right-10 w-80 h-64 rounded-full bg-red-400/30"
          style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
          animate={{ rotate: [0, -15, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Forma púrpura inferior */}
        <motion.div
          className="absolute bottom-20 right-32 w-96 h-80 rounded-full bg-purple-400/25"
          style={{ borderRadius: "70% 30% 50% 50% / 30% 50% 50% 70%" }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Círculo púrpura adicional */}
        <motion.div
          className="absolute bottom-40 right-16 w-40 h-40 rounded-full bg-purple-500/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Elementos decorativos pequeños */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-pink-400/60"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Línea decorativa */}
        <motion.svg
          className="absolute bottom-1/3 right-1/4 w-24 h-24"
          viewBox="0 0 100 100"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M 20 50 Q 40 20, 60 50 T 100 50"
            stroke="#8b5cf6"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        </motion.svg>
      </div>

      {/* Header minimalista */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 px-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">U</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900 tracking-tight">UASD San Juan</h1>
              <p className="text-xs text-gray-500 font-normal">Sistema de Mérito Académico</p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main content - Layout de dos columnas */}
      <main className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Columna izquierda - Contenido y formulario */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Título hero */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-blue-50 rounded-full border border-blue-100"
                >
                  <span className="text-sm font-semibold text-blue-600">UASD RECINTO SAN JUAN</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                    Consulta tu
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Mérito Estudiantil
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 font-normal max-w-lg">
                    Verifica tu estatus de excelencia académica y descarga tu certificado digital.
                  </p>
                </motion.div>
              </div>

              {/* Selector de período */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="max-w-md"
              >
                <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  Período Académico
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
                  {periods.map((period, index) => (
                    <motion.button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        selectedPeriod === period.id
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {selectedPeriod === period.id && (
                        <motion.div
                          layoutId="periodSelector"
                          className="absolute inset-0 bg-white rounded-xl shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{period.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Formulario de búsqueda */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-md space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Matrícula Universitaria
                  </label>
                  <input
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && buscarEstudiante()}
                    placeholder="100-1234567"
                    maxLength={15}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                  />
                </div>

                <motion.button
                  onClick={buscarEstudiante}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Consultando...</span>
                    </>
                  ) : (
                    <>
                      <span>Consultar Mérito</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Resultados */}
              <AnimatePresence mode="wait">
                {resultado && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md"
                  >
                    {resultado.error ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                        <p className="text-red-700 font-medium text-sm">{resultado.error}</p>
                      </div>
                    ) : resultado.encontrado ? (
                      <div className="space-y-4">
                        <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl">
                          <h3 className="text-xl font-bold text-emerald-800 mb-4">
                            ¡Felicidades! 🎉
                          </h3>
                          <div className="space-y-3">
                            {[
                              { label: "Nombre", value: resultado.nombre },
                              { label: "Índice", value: resultado.indice },
                              { label: "Facultad", value: resultado.facultad },
                              { label: "Período", value: resultado.periodo }
                            ].map((item) => (
                              <div key={item.label} className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-emerald-700 uppercase">{item.label}</span>
                                <span className="text-sm font-semibold text-emerald-900">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* MENSAJE TEMPORAL - Descomentar sección después del 21 de febrero */}
                        <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-3">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-blue-900 mb-1">Descarga Próximamente</h4>
                            <p className="text-xs text-blue-700 mb-2">
                              La descarga de certificados estará disponible el viernes 21 del presente mes
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl">
                              <span className="text-xs font-bold text-blue-900">Viernes 21 de Febrero</span>
                            </div>
                          </div>
                        </div>

                        {/* CÓDIGO PARA ACTIVAR DESPUÉS DEL 21 DE FEBRERO
                        {!isUnlocked ? (
                          <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-3">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-blue-900 mb-1">Descarga Próximamente</h4>
                              <p className="text-xs text-blue-700 mb-2">
                                Disponible después de la entrega presencial
                              </p>
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl">
                                <span className="text-xs font-bold text-blue-900">Viernes 21 de Febrero</span>
                              </div>
                              <div className="mt-3 text-lg font-mono font-bold text-blue-600">
                                {timeRemaining}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                            Descargar Certificado
                          </button>
                        )}
                        */}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                        <p className="text-amber-800 font-medium text-sm">
                          No encontrado en el período {selectedPeriod}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Columna derecha - Imagen/Ilustración */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Elementos flotantes decorativos (como en tu referencia) */}
                <motion.div
                  className="absolute -top-8 left-12 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 z-20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="text-left">
                    <div className="w-20 h-2 bg-gray-200 rounded mb-1" />
                    <div className="w-16 h-2 bg-gray-100 rounded" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-1/4 -right-4 bg-orange-500 rounded-full px-4 py-2 shadow-lg z-20"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <span className="text-white font-semibold text-sm">Mérito</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-32 -right-8 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3 z-20"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="w-24 h-2 bg-blue-500 rounded mb-1" />
                    <div className="w-20 h-1.5 bg-gray-200 rounded" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-12 -left-4 bg-purple-600 rounded-full px-4 py-2 shadow-lg z-20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-white font-semibold text-sm">Excelencia</span>
                </motion.div>

                <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <img 
                    src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imgmeritorios/Post+Web+Merito+Estudiantil+Semestre+2025-10.png" 
                    alt="Estudiante UASD" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      e.currentTarget.style.display = 'none';
                    }}
                  />            
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 mt-20"
      >
        <div className="max-w-7xl mx-auto px-6 text-center space-y-1">
        <p className="font-semibold text-base text-white">DR. CARLOS SÁNCHEZ DE OLEO</p>
        <p className="text-blue-100 text-xs">Director UASD Recinto San Juan</p>
        </div>
      </motion.footer>
    </div>
  );
}