import { gsap } from 'gsap';

export const buscarEstudianteLogic = () => {
  const matriculaInput = document.getElementById('matricula') as HTMLInputElement;
  const resultadoDiv = document.getElementById('resultado') as HTMLDivElement;
  const loadingDiv = document.getElementById('loading') as HTMLDivElement;
  const certificateLoadingDiv = document.getElementById('certificateLoading') as HTMLDivElement;
  const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
  const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;

  if (!matriculaInput || !resultadoDiv || !loadingDiv || !certificateLoadingDiv || !downloadButton || !downloadLink) {
    console.error('Elementos del DOM no encontrados');
    return;
  }

  // Initialize GSAP animations
const animateMessage = (element: HTMLElement, isError: boolean = false) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      onStart: () => {
        if (isError) {
          gsap.to(element, {
            keyframes: [
              { x: -10 },
              { x: 10 },
              { x: -5 },
              { x: 5 },
              { x: 0 },
            ],
            duration: 0.3,
            ease: 'power1.inOut',
          });
        }
      },
    });
  };
  

  const animateLoading = (element: HTMLElement, show: boolean) => {
    gsap.to(element, {
      opacity: show ? 1 : 0,
      duration: 0.5,
      ease: 'power3.out',
      onStart: () => {
        element.style.display = show ? 'flex' : 'none';
      },
    });
  };

  const animateCertificateSpinner = () => {
    gsap.to('.certificate-spinner', {
      keyframes: [
        { scale: 0.8 },
        { scale: 1.2 },
        { scale: 1 },
      ],
      opacity: 1,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
    });
  };
  

  // Hide messages and buttons initially
  resultadoDiv.style.display = 'none';
  downloadButton.style.display = 'none';
  downloadLink.style.display = 'none';

  // Handle form submission
  downloadButton.onclick = null; // Reset any previous listeners
  const handleSearch = () => {
    const matricula = matriculaInput.value.trim();

    if (!matricula) {
      resultadoDiv.innerHTML = `
        <h3>Oops, falta algo</h3>
        <p>Por favor, ingresa tu número de matrícula para continuar.</p>
      `;
      resultadoDiv.className = 'resultado error';
      resultadoDiv.style.display = 'block';
      animateMessage(resultadoDiv, true);
      return;
    }

    // Show searching animation
    animateLoading(loadingDiv, true);
    resultadoDiv.style.display = 'none';
    downloadButton.style.display = 'none';
    downloadLink.style.display = 'none';

    // JSONP request for searching student
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

      script.onerror = () => {
        delete (window as any)[callbackName];
        document.body.removeChild(script);
        animateLoading(loadingDiv, false);
        resultadoDiv.innerHTML = `
          <h3>Error de conexión</h3>
          <p>No pudimos conectar con el servidor. Intenta de nuevo más tarde.</p>
        `;
        resultadoDiv.className = 'resultado error';
        resultadoDiv.style.display = 'block';
        animateMessage(resultadoDiv, true);
      };
    };

    const API_URL = 'https://script.google.com/macros/s/AKfycbxmNKuso8DfeaCZsHqIGAwhivppukwoxtQe0zjNpDo4U46fcmjPaqAxhCpRIlJ_MNM3/exec';

    jsonp(`${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}`, (data) => {
      animateLoading(loadingDiv, false);
      resultadoDiv.style.display = 'block';

      if (data.error) {
        resultadoDiv.innerHTML = `
          <h3>Error en la consulta</h3>
          <p>${data.error}</p>
          <p>Contacta a la oficina de registro si el problema persiste.</p>
        `;
        resultadoDiv.className = 'resultado error';
        animateMessage(resultadoDiv, true);
        return;
      }

      if (data.encontrado) {
        resultadoDiv.className = 'resultado exito';
        resultadoDiv.innerHTML = `
          <h3>¡Felicidades, ${data.nombre}!</h3>
          <p>Eres estudiante meritorio de la UASD.</p>
          <p><strong>Índice:</strong> ${data.indice}</p>
          <p><strong>Facultad:</strong> ${data.facultad}</p>
        `;
        animateMessage(resultadoDiv);

        // Show download button with animation
        downloadButton.style.display = 'block';
        gsap.fromTo(
          downloadButton,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );

        // Handle certificate generation
        downloadButton.onclick = () => {
          downloadButton.disabled = true;
          downloadButton.innerText = 'Preparando...';
          animateLoading(certificateLoadingDiv, true);
          animateCertificateSpinner();

          jsonp(
            `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre)}&indice=${encodeURIComponent(data.indice)}&facultad=${encodeURIComponent(data.facultad)}`,
            (certData) => {
              animateLoading(certificateLoadingDiv, false);

              if (certData.error) {
                downloadButton.disabled = false;
                downloadButton.innerText = 'Reintentar';
                resultadoDiv.innerHTML += `
                  <p>Error generando certificado: ${certData.error}</p>
                  <p>Por favor, intenta nuevamente.</p>
                `;
                animateMessage(resultadoDiv, true);
                return;
              }

              if (certData.pdfUrl) {
                downloadButton.innerText = '¡Listo!';
                window.open(certData.pdfUrl, '_blank');
                downloadLink.href = certData.pdfUrl;
                downloadLink.style.display = 'block';
                gsap.fromTo(
                  downloadLink,
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
                );

                setTimeout(() => {
                  downloadButton.disabled = false;
                  downloadButton.innerText = 'Descargar Certificado';
                }, 2000);
              }
            }
          );
        };
      } else {
        resultadoDiv.className = 'resultado error';
        resultadoDiv.innerHTML = `
          <h3>Matrícula no encontrada</h3>
          <p>La matrícula <strong>${matricula}</strong> no está en la lista de estudiantes meritorios.</p>
          <p>Contacta a la oficina de registro si crees que es un error.</p>
        `;
        animateMessage(resultadoDiv, true);
      }
    });
  };

  // Attach search handler to button
  const buscarBtn = document.getElementById('buscarBtn') as HTMLButtonElement;
  if (buscarBtn) {
    buscarBtn.onclick = handleSearch;
  }

  // Hide result on page load
  document.addEventListener('DOMContentLoaded', () => {
    resultadoDiv.style.display = 'none';
  });
};