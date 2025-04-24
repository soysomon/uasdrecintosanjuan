export const buscarEstudianteLogic = () => {
    const matriculaInput = document.getElementById('matricula') as HTMLInputElement;
    const resultadoDiv = document.getElementById('resultado') as HTMLDivElement;
    const loadingDiv = document.getElementById('loading') as HTMLDivElement;
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
    const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;
  
    if (!matriculaInput || !resultadoDiv || !loadingDiv || !downloadButton || !downloadLink) {
      console.error('Elementos del DOM no encontrados');
      return;
    }
  
    // Ocultar el mensaje de validación al inicio
    // Solo mostrar cuando se hace clic en el botón Consultar
    resultadoDiv.style.display = 'none';
  
    const matricula = matriculaInput.value.trim();
  
    if (!matricula) {
      resultadoDiv.innerHTML = `
        <div class="error">
          <h3>Por favor, ingrese una matrícula</h3>
          <p>Necesitamos tu número de matrícula para verificar si eres estudiante meritorio.</p>
        </div>
      `;
      resultadoDiv.style.display = 'block';
      resultadoDiv.className = 'resultado error';
      return;
    }
  
    // Mostrar animación de carga
    loadingDiv.style.display = 'flex';
    resultadoDiv.style.display = 'none';
    downloadButton.style.display = 'none';
    downloadLink.style.display = 'none';
  
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
          <div class="error">
            <h3>Error de conexión</h3>
            <p>No pudimos conectar con el servidor. Por favor, intenta nuevamente más tarde.</p>
          </div>
        `;
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
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
          <div class="error">
            <h3>Error en la consulta</h3>
            <p>${data.error}</p>
            <p>Si el problema persiste, contacta a la oficina de registro.</p>
          </div>
        `;
        resultadoDiv.className = 'resultado error';
        return;
      }
  
      if (data.encontrado) {
        resultadoDiv.className = 'resultado exito';
        resultadoDiv.innerHTML = `
          <div class="success">
            <h3>¡Felicidades! Eres estudiante meritorio</h3>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Índice:</strong> ${data.indice}</p>
            <p><strong>Facultad:</strong> ${data.facultad}</p>
          </div>
        `;
        downloadButton.style.display = 'block';
        downloadButton.innerText = 'Descargar Certificado';
        downloadButton.className = 'download-btn';
        
        // Manejar la generación del certificado
        downloadButton.onclick = () => {
          // Mostrar feedback visual en el botón
          downloadButton.disabled = true;
          downloadButton.innerText = 'Preparando tu certificado...';
          downloadButton.style.background = '#e53935'; // Rojo durante la generación
          
          // Mostrar animación de carga para el certificado
          loadingDiv.style.display = 'flex';
          
          // Generar certificado mediante JSONP
          jsonp(
            `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre)}&indice=${encodeURIComponent(data.indice)}&facultad=${encodeURIComponent(data.facultad)}`,
            (certData) => {
              // Ocultar animación de carga
              loadingDiv.style.display = 'none';
  
              if (certData.error) {
                // Restaurar estado del botón
                downloadButton.disabled = false;
                downloadButton.innerText = 'Reintentar Descarga';
                downloadButton.style.background = '';
                
                resultadoDiv.innerHTML += `
                  <div class="error">
                    <p>Error generando certificado: ${certData.error}</p>
                    <p>Por favor, intenta nuevamente.</p>
                  </div>
                `;
                return;
              }
  
              if (certData.pdfUrl) {
                // Actualizar botón con feedback visual de éxito
                downloadButton.style.background = '#43a047'; // Verde al finalizar con éxito
                downloadButton.innerText = '¡Certificado listo!';
                
                // Abrir el PDF en una nueva pestaña
                window.open(certData.pdfUrl, '_blank');
                
                // También configurar el enlace por si acaso
                downloadLink.href = certData.pdfUrl;
                downloadLink.style.display = 'block';
                downloadLink.className = 'download-btn';
                downloadLink.innerText = 'Descargar nuevamente';
                
                // Habilitar botón después de 2 segundos
                setTimeout(() => {
                  downloadButton.disabled = false;
                  downloadButton.innerText = 'Descargar Certificado';
                  downloadButton.style.background = '';
                }, 2000);
              }
            }
          );
        };
      } else {
        resultadoDiv.className = 'resultado error';
        resultadoDiv.innerHTML = `
          <div class="error">
            <h3>Estudiante no encontrado</h3>
            <p>La matrícula <strong>${matricula}</strong> no aparece en nuestra lista de estudiantes meritorios.</p>
            <p>Si crees que esto es un error, por favor contacta a la oficina de registro.</p>
          </div>
        `;
        downloadButton.style.display = 'none';
        downloadLink.style.display = 'none';
      }
    });
  };
  
  // Inicializar ocultando el mensaje de error al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    const resultadoDiv = document.getElementById('resultado');
    if (resultadoDiv) {
      resultadoDiv.style.display = 'none';
    }
  });