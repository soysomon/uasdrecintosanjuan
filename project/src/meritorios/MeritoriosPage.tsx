import { useState } from "react";
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

interface CertificadoData {
  error?: string;
  pdfUrl?: string;
}

export default function MeritoriosMultiPeriodo() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2025-10");
  const [matricula, setMatricula] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultado, setResultado] = useState<ResultadoBusqueda | null>(null);
  const [generatingCert, setGeneratingCert] = useState<boolean>(false);
  const [certUrl, setCertUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const API_URL = "https://script.google.com/macros/s/AKfycbwDa37z2_erCoWo62cJ5njVEPP3ukmFO4kVu8XQrgFk35neQBXPE0TUFx1CDt3T_Nx0/exec";

  const periods = [
    { id: "2025-10", label: "2025-10", color: "from-blue-500 to-blue-600" },
    { id: "2024-20", label: "2024-20", color: "from-purple-500 to-purple-600" }
  ];

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
    setCertUrl(null);

    jsonp(
      `${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}&periodo=${selectedPeriod}`,
      (data: ResultadoBusqueda) => {
        setLoading(false);
        setResultado(data);
      }
    );
  };

  const generarCertificado = (data: ResultadoBusqueda) => {
    setGeneratingCert(true);

    jsonp(
      `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre || "")}&indice=${encodeURIComponent(data.indice || "")}&facultad=${encodeURIComponent(data.facultad || "")}&periodo=${selectedPeriod}`,
      (certData: CertificadoData) => {
        if (certData.error) {
          setGeneratingCert(false);
          alert("Error al generar certificado");
          return;
        }

        if (certData.pdfUrl) {
          setCertUrl(certData.pdfUrl);
          let count = 3;
          setCountdown(count);

          const interval = setInterval(() => {
            count -= 1;
            if (count > 0) {
              setCountdown(count);
            } else {
              clearInterval(interval);
              setCountdown(null);
              setGeneratingCert(false);
              window.open(certData.pdfUrl, '_blank');
            }
          }, 1000);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Header minimalista */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 py-6 px-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">U</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">UASD San Juan</h1>
              <p className="text-sm text-gray-500">Mérito Estudiantil</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Título */}
          <div className="text-center space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black text-gray-900"
            >
              Consulta tu
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Mérito Estudiantil
              </span>
            </motion.h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Verifica tu estatus de excelencia académica ingresando tu matrícula
            </p>
          </div>

          {/* Selector de período */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Selecciona el período académico
            </label>
            <div className="flex gap-3 justify-center">
              {periods.map((period) => (
                <motion.button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all ${
                    selectedPeriod === period.id
                      ? `bg-gradient-to-r ${period.color} text-white shadow-lg`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {period.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Formulario de consulta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Matrícula universitaria
                </label>
                <input
                  type="text"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarEstudiante()}
                  placeholder="Ej: 100123456"
                  maxLength={15}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <motion.button
                onClick={buscarEstudiante}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Consultando...
                  </div>
                ) : (
                  "Consultar"
                )}
              </motion.button>
            </div>

            {/* Resultados */}
            <AnimatePresence>
              {resultado && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  {resultado.error ? (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <p className="text-red-700 font-semibold">{resultado.error}</p>
                    </div>
                  ) : resultado.encontrado ? (
                    <div className="space-y-4">
                      <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl">
                        <h3 className="text-xl font-bold text-green-800 mb-3">
                          ¡Felicidades! Eres estudiante meritorio
                        </h3>
                        <div className="space-y-2 text-green-700">
                          <p><strong>Nombre:</strong> {resultado.nombre}</p>
                          <p><strong>Índice:</strong> {resultado.indice}</p>
                          <p><strong>Facultad:</strong> {resultado.facultad}</p>
                          <p><strong>Período:</strong> {resultado.periodo}</p>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => generarCertificado(resultado)}
                        disabled={generatingCert}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50"
                      >
                        {generatingCert ? (
                          countdown ? (
                            `Abriendo en ${countdown}...`
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Generando certificado...
                            </div>
                          )
                        ) : certUrl ? (
                          "Ver certificado"
                        ) : (
                          "Generar certificado"
                        )}
                      </motion.button>

                      {certUrl && !generatingCert && (
                        <a
                          href={certUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2.5 text-center bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-all"
                        >
                          Descargar nuevamente
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                      <p className="text-yellow-800 font-semibold">
                        No encontrado en el período {selectedPeriod}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-bold text-lg">
            DR. CARLOS SÁNCHEZ DE OLEO
          </p>
          <p className="text-blue-200 text-sm">
            Director UASD Recinto San Juan
          </p>
        </div>
      </footer>
    </div>
  );
}