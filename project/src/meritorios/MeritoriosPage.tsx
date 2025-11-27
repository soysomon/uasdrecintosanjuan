import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [downloadState, setDownloadState] = useState<"idle" | "preparing" | "ready">("idle");

  // Feedback
  const [rating, setRating] = useState<number>(0);
  const [comentario, setComentario] = useState<string>("");

  const API_URL = "https://script.google.com/macros/s/AKfycbyETmNfiy_Nq0i5yFI6pooxAl8jdMZUOXt_eWf-M28kDtm9GWEAqbOKfpWTeBs_IhIa/exec";
  const UNLOCK_DATE = new Date("2025-11-26T00:00:00");

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
        const diff = UNLOCK_DATE.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };
    checkUnlock();
    const interval = setInterval(checkUnlock, 1000);
    return () => clearInterval(interval);
  }, []);

  const jsonp = (url: string, callback: (data: any) => void) => {
    const callbackName = "jsonp_" + Math.round(1000000 * Math.random());
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      callback(data);
    };
    const script = document.createElement("script");
    script.src = url + (url.includes("?") ? "&" : "?") + "callback=" + callbackName;
    document.body.appendChild(script);
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

  const descargarCertificado = () => {
    if (!resultado || !resultado.encontrado || downloadState !== "idle") return;
    setDownloadState("preparing");

    jsonp(
      `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(resultado.nombre || '')}&indice=${encodeURIComponent(resultado.indice || '')}&facultad=${encodeURIComponent(resultado.facultad || '')}`,
      (certData) => {
        if (certData.error) {
          alert("Error al generar el certificado: " + certData.error);
          setDownloadState("idle");
          return;
        }
        if (certData.pdfUrl) {
          const win = window.open('about:blank', 'certificado_meritorio');
          if (win) win.location.href = certData.pdfUrl;
          else window.location.href = certData.pdfUrl;

          setDownloadState("ready");
          // NO desaparece solo → el popup de feedback se encarga ahora
        }
      }
    );
  };

  const enviarFeedback = async () => {
    if (!rating) return;

    await fetch(`${API_URL}?action=feedback&matricula=${matricula}&periodo=${selectedPeriod}&estrellas=${rating}&comentario=${encodeURIComponent(comentario)}`)
      .catch(() => {});

    localStorage.setItem(`feedback_${matricula}_${selectedPeriod}`, "sent");
    alert("¡Gracias por tu valoración! ❤️");
    setRating(0);
    setComentario("");
    setDownloadState("idle");
  };

  const omitirFeedback = () => {
    localStorage.setItem(`feedback_${matricula}_${selectedPeriod}`, "skipped");
    setDownloadState("idle");
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute -top-20 right-1/4 w-32 h-32 rounded-full bg-green-400/40" animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-32 right-20 w-64 h-48 rounded-full bg-pink-300/30" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }} animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-16 right-10 w-80 h-64 rounded-full bg-red-400/30" style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }} animate={{ rotate: [0, -15, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        <motion.div className="absolute bottom-20 right-32 w-96 h-80 rounded-full bg-purple-400/25" style={{ borderRadius: "70% 30% 50% 50% / 30% 50% 50% 70%" }} animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        <motion.div className="absolute bottom-40 right-16 w-40 h-40 rounded-full bg-purple-500/30" animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      {/* Header */}
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.01 }} className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-base sm:text-lg font-bold">U</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">UASD RECINTO SAN JUAN</h1>
              <p className="text-xs text-gray-500 font-normal">Sistema de Mérito Académico</p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start lg:items-center">
            {/* Izquierda */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 rounded-full border border-blue-100">
                  <span className="text-xs sm:text-sm font-semibold text-blue-600">UASD RECINTO SAN JUAN</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4">
                    Consulta tu
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Mérito Estudiantil</span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 font-normal max-w-lg">
                    Verifica tu estatus de excelencia académica y descarga tu certificado digital.
                  </p>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="max-w-md">
                <label className="block text-xs font-semibold text-gray-500 mb-2 sm:mb-3 uppercase tracking-wide">Período Académico</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl sm:rounded-2xl">
                  {periods.map((period) => (
                    <motion.button key={period.id} onClick={() => setSelectedPeriod(period.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`relative py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${selectedPeriod === period.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                      {selectedPeriod === period.id && (
                        <motion.div layoutId="periodSelector" className="absolute inset-0 bg-white rounded-lg sm:rounded-xl shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                      )}
                      <span className="relative z-10">{period.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="max-w-md space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Matrícula Universitaria</label>
                  <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} onKeyPress={(e) => e.key === "Enter" && buscarEstudiante()} placeholder="100-1234567" maxLength={15} className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200" />
                </div>
                <motion.button onClick={buscarEstudiante} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Consultando...</span>
                    </>
                  ) : (
                    <>
                      <span>Consultar Mérito</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.div>

              <AnimatePresence mode="wait">
                {resultado && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="max-w-md">
                    {resultado.error ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl">
                        <p className="text-red-700 font-medium text-sm">{resultado.error}</p>
                      </div>
                    ) : resultado.encontrado ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl sm:rounded-2xl">
                          <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-3 sm:mb-4">¡Felicidades!</h3>
                          <div className="space-y-2.5 sm:space-y-3">
                            {[{ label: "Nombre", value: resultado.nombre }, { label: "Índice", value: resultado.indice }, { label: "Facultad", value: resultado.facultad }, { label: "Período", value: resultado.periodo }].map((item) => (
                              <div key={item.label} className="flex justify-between items-center gap-2">
                                <span className="text-xs font-semibold text-emerald-700 uppercase">{item.label}</span>
                                <span className="text-xs sm:text-sm font-semibold text-emerald-900 text-right">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {!isUnlocked ? (
                          <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl text-center space-y-2.5 sm:space-y-3">
                            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg sm:rounded-xl">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-blue-900 mb-1">Descarga Próximamente</h4>
                              <p className="text-xs text-blue-700 mb-2">Disponible después de la entrega presencial</p>
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg sm:rounded-xl">
                                <span className="text-xs font-bold text-blue-900">Jueves 27 de Noviembre</span>
                              </div>
                              <div className="mt-2 sm:mt-3 text-base sm:text-lg font-mono font-bold text-blue-600">{timeRemaining}</div>
                            </div>
                          </div>
                        ) : (
                          <motion.button
                            onClick={descargarCertificado}
                            disabled={downloadState !== "idle"}
                            className={`relative w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex items-center justify-center gap-3 text-white font-semibold text-sm sm:text-base transition-all duration-300 ${
                              downloadState === "idle" ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-xl" :
                              downloadState === "preparing" ? "bg-gray-400 cursor-not-allowed" :
                              "bg-gradient-to-r from-emerald-500 to-green-500"
                            }`}
                            whileHover={downloadState === "idle" ? { scale: 1.02 } : {}}
                            whileTap={downloadState === "idle" ? { scale: 0.98 } : {}}
                          >
                            <motion.div className="absolute inset-0 bg-white opacity-0" animate={{ opacity: downloadState === "ready" ? 0.2 : 0 }} transition={{ duration: 0.4 }} />

                            <AnimatePresence mode="popLayout">
                              {downloadState === "idle" && (
                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>Descargar Certificado</span>
                                </motion.div>
                              )}
                              {downloadState === "preparing" && (
                                <motion.div key="preparing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.3" />
                                    <path stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M4 12a8 8 0 018-8" />
                                  </svg>
                                  <span>Preparando tu certificado...</span>
                                </motion.div>
                              )}
                              {downloadState === "ready" && (
                                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Tu certificado está listo</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl">
                        <p className="text-amber-800 font-medium text-sm">No encontrado en el período {selectedPeriod}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Derecha - Imagen */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative w-full mt-8 lg:mt-0">
              <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <img src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/imgmeritorios/Post+Web+Merito+Estudiantil+Semestre+2025-10.png" alt="Estudiante UASD" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="relative z-10 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-5 sm:py-6 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-1">
          <p className="font-semibold text-sm sm:text-base text-white">DR. CARLOS MANUEL SÁNCHEZ DE ÓLEO</p>
          <p className="text-blue-100 text-xs">Director General</p>
        </div>
      </motion.footer>

      {/* POPUP FEEDBACK - PERSISTENTE */}
      <AnimatePresence>
        {resultado?.encontrado && !localStorage.getItem(`feedback_${matricula}_${selectedPeriod}`) && downloadState === "ready" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-900">¡Gracias por descargar tu certificado!</h3>
              <p className="text-center text-gray-600 mb-8">¿Cómo calificarías tu experiencia con el sistema?</p>

              <div className="flex justify-center gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} className="transition-all hover:scale-125">
                    <span className={`text-5xl ${rating >= n ? "text-yellow-400 drop-shadow-lg" : "text-gray-300"}`}>★</span>
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="¿Quieres dejarnos un comentario? (Opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 resize-none mb-6"
              />

              <div className="flex gap-4">
                <button
                  onClick={enviarFeedback}
                  disabled={!rating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Enviar valoración
                </button>
                <button
                  onClick={omitirFeedback}
                  className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-300 transition-all"
                >
                  Omitir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}