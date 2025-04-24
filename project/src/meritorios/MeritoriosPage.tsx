import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CountdownInstitucional from "./CountdownInstitucional";

// Animation utility function for alerts
const animateAlert = (element: HTMLElement, isSuccess = true) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1.2, 0.5)",
      }
    );
  };
  

export const buscarEstudianteLogic = () => {
  const matriculaInput = document.getElementById('matricula') as HTMLInputElement;
  const resultadoDiv = document.getElementById('resultado') as HTMLDivElement;
  const loadingDiv = document.getElementById('loading') as HTMLDivElement;
  const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
  const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;
  const buscarBtn = document.getElementById('buscarBtn') as HTMLButtonElement;

  if (!matriculaInput || !resultadoDiv || !loadingDiv || !downloadButton || !downloadLink) {
    console.error('Elementos del DOM no encontrados');
    return;
  }

  // Ocultar el mensaje de validación al inicio
  resultadoDiv.style.display = 'none';

  const matricula = matriculaInput.value.trim();

  if (!matricula) {
    resultadoDiv.innerHTML = `
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-lg">
        <h3 class="font-bold text-lg text-yellow-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Por favor, ingrese una matrícula
        </h3>
        <p class="text-yellow-600">Necesitamos tu número de matrícula para verificar si eres estudiante meritorio.</p>
      </div>
    `;
    resultadoDiv.style.display = 'block';
    animateAlert(resultadoDiv, false);
    return;
  }

  // Mostrar animación de carga
  loadingDiv.style.display = 'flex';
  resultadoDiv.style.display = 'none';
  downloadButton.style.display = 'none';
  downloadLink.style.display = 'none';
  
  // Animar botón de búsqueda
  gsap.to(buscarBtn, {
    scale: 0.95,
    duration: 0.2,
    yoyo: true,
    repeat: 1
  });

  // Función para hacer llamadas JSONP
  const jsonp = (url: string, callback: (data: any) => void) => {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      callback(data);
    };

    const script = document.createElement('script');
    url += (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
    script.src = url;
    document.body.appendChild(script);

    // Manejador de error
    script.onerror = () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      loadingDiv.style.display = 'none';
      resultadoDiv.innerHTML = `
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-lg">
          <h3 class="font-bold text-lg text-yellow-700 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Error de conexión
          </h3>
          <p class="text-yellow-600">No pudimos conectar con el servidor. Por favor, intenta nuevamente más tarde.</p>
        </div>
      `;
      resultadoDiv.style.display = 'block';
      animateAlert(resultadoDiv, false);
    };
  };

  // URL del script de Google Apps
  const API_URL = 'https://script.google.com/macros/s/AKfycbxmNKuso8DfeaCZsHqIGAwhivppukwoxtQe0zjNpDo4U46fcmjPaqAxhCpRIlJ_MNM3/exec';
  
  // Búsqueda del estudiante mediante JSONP
  jsonp(`${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}`, (data) => {
    // Ocultar animación de carga
    loadingDiv.style.display = 'none';

    // Asegurarnos de que el div de resultado sea visible
    resultadoDiv.style.display = 'block';

    if (data.error) {
      resultadoDiv.innerHTML = `
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-lg">
          <h3 class="font-bold text-lg text-yellow-700 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Error en la consulta
          </h3>
          <p class="text-yellow-600">${data.error}</p>
          <p class="text-yellow-600 mt-2">Si el problema persiste, contacta a la oficina de registro.</p>
        </div>
      `;
      animateAlert(resultadoDiv, false);
      return;
    }

    if (data.encontrado) {
      resultadoDiv.innerHTML = `
        <div class="bg-white border-l-4 border-green-500 p-5 rounded-xl shadow-lg relative overflow-hidden">
          <div class="absolute -top-12 -right-12 w-24 h-24 bg-green-100 rounded-full opacity-40"></div>
          <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-yellow-100 rounded-full opacity-30"></div>
          <div class="relative z-10">
            <h3 class="font-black text-xl text-green-600 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ¡Felicidades! Eres estudiante meritorio
            </h3>
            <p class="text-blue-700 font-medium text-lg mb-1"><strong>Nombre:</strong> ${data.nombre}</p>
            <p class="text-blue-700 font-medium text-lg mb-1"><strong>Índice:</strong> ${data.indice}</p>
            <p class="text-blue-700 font-medium text-lg"><strong>Facultad:</strong> ${data.facultad}</p>
          </div>
        </div>
      `;
      
      // Animación de confeti
      const confettiCanvas = document.createElement('canvas');
      confettiCanvas.id = 'confetti-canvas';
      confettiCanvas.style.position = 'fixed';
      confettiCanvas.style.top = '0';
      confettiCanvas.style.left = '0';
      confettiCanvas.style.pointerEvents = 'none';
      confettiCanvas.style.zIndex = '100';
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      document.body.appendChild(confettiCanvas);
      
      // Simple confetti animation (would use a library in production)
      const ctx = confettiCanvas.getContext('2d');
      if (ctx) {
        const confettiColors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45aaf2', '#fc427b'];
        for (let i = 0; i < 100; i++) {
          setTimeout(() => {
            ctx.fillStyle = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            ctx.fillRect(
              Math.random() * window.innerWidth, 
              -20, 
              Math.random() * 10 + 5, 
              Math.random() * 10 + 5
            );
          }, i * 20);
        }
        
        // Remove canvas after animation
        setTimeout(() => {
          document.body.removeChild(confettiCanvas);
        }, 3000);
      }
      
      animateAlert(resultadoDiv, true);
      
      downloadButton.style.display = 'block';
      downloadButton.innerText = 'Descargar Certificado';
      downloadButton.className = 'w-full mt-4 py-3.5 font-black text-lg rounded-xl bg-gradient-to-r from-green-600 via-green-500 to-green-400 shadow-xl text-white transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-2xl active:scale-95 focus:ring-2 focus:ring-green-400';
      
      // Animar botón
      gsap.fromTo(
        downloadButton,
        { 
          opacity: 0, 
          y: 20, 
          scale: 0.9 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "elastic.out(1.2, 0.5)" 
        }
      );
      
      // Manejar la generación del certificado
      downloadButton.onclick = () => {
        // Mostrar feedback visual en el botón
        downloadButton.disabled = true;
        downloadButton.innerText = 'Preparando tu certificado...';
        
        // Animar botón mientras procesa
        gsap.to(downloadButton, {
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          repeat: -1,
          yoyo: true,
          duration: 0.8
        });
        
        // Mostrar animación de carga para el certificado
        loadingDiv.style.display = 'flex';
        
        // Generar certificado mediante JSONP
        jsonp(
          `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre)}&indice=${encodeURIComponent(data.indice)}&facultad=${encodeURIComponent(data.facultad)}`,
          (certData) => {
            // Ocultar animación de carga
            loadingDiv.style.display = 'none';
            gsap.killTweensOf(downloadButton);

            if (certData.error) {
              // Restaurar estado del botón
              downloadButton.disabled = false;
              downloadButton.innerText = 'Reintentar Descarga';
              downloadButton.className = 'w-full mt-4 py-3.5 font-bold text-lg rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-xl text-white transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-2xl active:scale-95 focus:ring-2 focus:ring-orange-400';
              
              resultadoDiv.innerHTML += `
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl shadow-lg mt-4">
                  <p class="text-yellow-700">Error generando certificado: ${certData.error}</p>
                  <p class="text-yellow-600 mt-1">Por favor, intenta nuevamente.</p>
                </div>
              `;
              animateAlert(resultadoDiv.lastElementChild as HTMLElement, false);
              return;
            }

            if (certData.pdfUrl) {
              // Actualizar botón con feedback visual de éxito
              gsap.to(downloadButton, {
                backgroundColor: '#10b981',
                duration: 0.3
              });
              
              downloadButton.innerText = '¡Certificado listo!';
              
              // Animar botón con un pulse
              gsap.to(downloadButton, {
                scale: 1.05,
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)",
                duration: 0.5,
                repeat: 3,
                yoyo: true
              });
              
              // Abrir el PDF en una nueva pestaña
              window.open(certData.pdfUrl, '_blank');
              
              // También configurar el enlace por si acaso
              downloadLink.href = certData.pdfUrl;
              downloadLink.style.display = 'block';
              downloadLink.className = 'w-full mt-3 text-center py-2.5 font-semibold text-lg rounded-xl bg-blue-100 text-blue-700 shadow-lg transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-xl active:scale-95 focus:ring-2 focus:ring-blue-300';
              downloadLink.innerText = 'Descargar nuevamente';
              
              // Animar el enlace de descarga
              gsap.fromTo(
                downloadLink,
                { 
                  opacity: 0, 
                  y: 10
                },
                { 
                  opacity: 1, 
                  y: 0,
                  duration: 0.5,
                  delay: 0.8
                }
              );
              
              // Habilitar botón después de 2 segundos
              setTimeout(() => {
                downloadButton.disabled = false;
                downloadButton.innerText = 'Descargar Certificado';
                gsap.to(downloadButton, {
                  backgroundColor: '',
                  boxShadow: '',
                  scale: 1,
                  duration: 0.3
                });
              }, 2000);
            }
          }
        );
      };
    } else {
      resultadoDiv.innerHTML = `
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-lg">
          <h3 class="font-bold text-lg text-yellow-700 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Estudiante no encontrado
          </h3>
          <p class="text-yellow-600">La matrícula <strong>${matricula}</strong> no aparece en nuestra lista de estudiantes meritorios.</p>
          <p class="text-yellow-600 mt-2">Si crees que esto es un error, por favor contacta a la oficina de registro.</p>
        </div>
      `;
      downloadButton.style.display = 'none';
      downloadLink.style.display = 'none';
      animateAlert(resultadoDiv, false);
    }
  });
};

export default function MeritoriosPage() {
  useEffect(() => {
    // Initialize animation effects
    const animateElements = () => {
      // Hero section animation
      gsap.from(".hero-title", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out"
      });
      
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
      });
      
      gsap.from(".form-container", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: "power2.out"
      });
      
      gsap.from(".year-badge", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "back.out(1.7)"
      });
      
      gsap.from(".merit-card", {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out"
      });
      
      gsap.from(".info-card", {
        opacity: 0,
        x: 20,
        duration: 0.7,
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out"
      });
      
      // Add hover animations for buttons
      document.querySelectorAll(".hover-animate").forEach(btn => {
        btn.addEventListener("mouseenter", () => {
          gsap.to(btn, {
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
            duration: 0.3
          });
        });
        
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, {
            scale: 1,
            boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)",
            duration: 0.3
          });
        });
      });
    };
    
    // Run animations after DOM is loaded
    setTimeout(animateElements, 100);
    
    // Set up event listener for button
    const buscarBtn = document.getElementById("buscarBtn");
    if (buscarBtn) {
      buscarBtn.addEventListener("click", buscarEstudianteLogic);
    }
    
    return () => {
      // Clean up event listener
      const buscarBtn = document.getElementById("buscarBtn");
      if (buscarBtn) {
        buscarBtn.removeEventListener("click", buscarEstudianteLogic);
      }
    };
  }, []);

  return (
    <div className="pt-[99px] bg-gradient-to-tr from-white via-blue-50 to-yellow-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-9">
        {/* Info & Consulta */}
        <div className="flex-1 flex flex-col items-start justify-center px-4 lg:px-2 py-5">
          <h1 className="hero-title text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-blue-800 mb-2 leading-tight">
            ¡Descubre si eres
            <br />
            <span className="text-yellow-400 drop-shadow">Estudiante Meritorio</span>
          </h1>
          <div className="year-badge flex gap-2 items-end mb-3">
            <span className="text-4xl font-black text-orange-500 leading-none">2024-20</span>
          </div>
          <p className="hero-subtitle text-blue-500 mb-6 font-medium max-w-lg">
            Ingresa tu matrícula y conoce si formas parte de la lista de excelencia académica <b>UASD</b>.
          </p>
          {/* Formulario consulta */}
          <form
            id="consultaForm"
            className="form-container w-full max-w-md bg-white/80 border border-blue-100 rounded-2xl shadow-xl px-5 py-8 mb-5 transition-all hover:scale-[1.015] will-change-transform"
            autoComplete="off"
          >
            <label
              htmlFor="matricula"
              className="block text-blue-800 text-[1.10rem] font-bold mb-1 pl-1"
            >
              Matrícula universitaria
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              maxLength={15}
              className="block w-full text-lg font-medium border-2 border-blue-100 bg-blue-50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 focus:bg-white transition-all placeholder:text-blue-200 tracking-widest mb-4"
              placeholder="Ej: 100123456"
              required
            />
            <button
              type="button"
              id="buscarBtn"
              className="hover-animate w-full py-3 font-black text-lg rounded-xl bg-gradient-to-r from-blue-700 via-blue-500 to-yellow-400 shadow-xl text-white transition-all duration-150 transform-gpu hover:scale-105 hover:from-blue-800 hover:to-yellow-500 hover:shadow-2xl active:scale-95 focus:ring-2 focus:ring-yellow-400"
            >
              Consultar
            </button>
            {/* Loader */}
            <div id="loading" className="loading flex-col justify-center items-center mt-4" style={{ display: "none" }}>
              <div className="w-8 h-8 border-[4px] border-yellow-200 border-l-orange-600 animate-spin rounded-full mb-2"></div>
              <p className="font-bold text-blue-700 text-sm">Consultando datos...</p>
            </div>
            {/* Resultados */}
            <div id="resultado" className="resultado mt-3"></div>
            <button
              id="downloadButton"
              className="w-full mt-4 py-3.5 font-black text-lg rounded-xl bg-gradient-to-r from-green-600 via-green-500 to-green-400 shadow-xl text-white transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-2xl active:scale-95 focus:ring-2 focus:ring-green-400"
              style={{ display: "none" }}
            >
              Descargar Certificado
            </button>
            <a
              id="downloadLink"
              className="w-full mt-3 text-center py-2.5 font-semibold text-lg rounded-xl bg-blue-100 text-blue-700 shadow-lg transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-xl active:scale-95 focus:ring-2 focus:ring-blue-300"
              style={{ display: "none" }}
              download
            >
              Descargar
            </a>
          </form>
          {/* Fila de badges */}
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 font-bold text-yellow-700 shadow-sm text-sm">
              <span className="text-2xl">🏆</span> Excelencia
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 font-bold text-blue-700 shadow-sm text-sm">
              <span className="text-2xl">🎓</span> Mérito
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 font-bold text-blue-500 shadow-sm text-sm">
              <span className="text-2xl">🌟</span> UASD
            </span>
          </div>
        </div>
        {/* Sección Afiche/Mérito */}
        <aside className="flex flex-col items-center px-4 py-4">
          <div className="merit-card w-full max-w-sm bg-white/80 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden flex flex-col items-center mb-6">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/MERITO-POST-WEB.jpg"
              alt="Afiche Meritorio UASD"
              className="rounded-2xl w-full object-cover object-center bg-blue-50 shadow-md"
              style={{ minHeight: "240px" }}
            />
          </div>
          {/* Tarjetas horizontales */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="info-card w-full flex items-center gap-4 rounded-xl bg-gradient-to-br from-yellow-50 via-orange-50 to-white px-5 py-4 shadow-md hover:shadow-lg transition-all duration-300">
              <span className="text-3xl bg-yellow-400 rounded-full p-2 text-white drop-shadow">🏆</span>
              <div>
                <div className="font-bold text-blue-900">Excelencia Académica</div>
                <div className="text-blue-500 text-[0.95rem]">Reconoce tu esfuerzo y dedicación.</div>
              </div>
            </div>
            <div className="info-card w-full flex items-center gap-4 rounded-xl bg-gradient-to-br from-blue-50 via-yellow-50 to-white px-5 py-4 shadow-md hover:shadow-lg transition-all duration-300">
              <span className="text-3xl bg-blue-500 rounded-full p-2 text-white drop-shadow">🎓</span>
              <div>
                <div className="font-bold text-blue-900">Estudiante Meritorio</div>
                <div className="text-blue-500 text-[0.95rem]">Destaca entre los mejores.</div>
              </div>
            </div>
          </div>
        </aside>
      </section>
      {/* Countdown animado institucional */}
      <CountdownInstitucional />
      {/* Footer institucional */}
      <footer className="max-w-full w-full bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-400 text-white text-center font-bold py-5 text-[1.07rem] tracking-wide mt-auto drop-shadow-lg">
        DR. CARLOS SÁNCHEZ DE OLEO · <span className="text-yellow-200">DIRECTOR UASD RECINTO SAN JUAN</span>
      </footer>
    </div>
  );
}