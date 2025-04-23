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
  
    const matricula = matriculaInput.value.trim();
  
    if (!matricula) {
      resultadoDiv.innerHTML = '<p class="error">Por favor, ingrese una matrícula válida.</p>';
      resultadoDiv.style.display = 'block'; // Mostrar el contenedor de resultado
      resultadoDiv.className = 'resultado error'; // Aplicar la clase correcta
      return;
    }
  
    // Mostrar animación de carga
    loadingDiv.style.display = 'flex';
    resultadoDiv.innerHTML = '';
    resultadoDiv.style.display = 'none'; // Ocultar resultados mientras se carga
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
        resultadoDiv.innerHTML = '<p class="error">Error al conectar con el servidor</p>';
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
        resultadoDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        resultadoDiv.className = 'resultado error';
        return;
      }
  
      if (data.encontrado) {
        resultadoDiv.className = 'resultado exito'; // Usar la clase 'exito' que está en el CSS
        resultadoDiv.innerHTML = `
          <h3>¡Felicidades! Eres estudiante meritorio</h3>
          <p><strong>Nombre:</strong> ${data.nombre}</p>
          <p><strong>Índice:</strong> ${data.indice}</p>
          <p><strong>Facultad:</strong> ${data.facultad}</p>
        `;
        downloadButton.style.display = 'block';
        
        // Manejar la generación del certificado
        downloadButton.onclick = () => {
          // Mostrar animación de carga para el certificado
          loadingDiv.style.display = 'flex';
          resultadoDiv.innerHTML += '<p>Generando certificado...</p>';
          
          // Generar certificado mediante JSONP
          jsonp(
            `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre)}&indice=${encodeURIComponent(data.indice)}&facultad=${encodeURIComponent(data.facultad)}`,
            (certData) => {
              // Ocultar animación de carga
              loadingDiv.style.display = 'none';
  
              if (certData.error) {
                resultadoDiv.innerHTML += `<p class="error">Error generando certificado: ${certData.error}</p>`;
                return;
              }
  
              if (certData.pdfUrl) {
                // Configurar y mostrar el enlace de descarga
                downloadLink.href = certData.pdfUrl;
                downloadLink.textContent = 'Descargar Certificado';
                downloadLink.className = 'download-btn';
                downloadLink.style.display = 'block';
                downloadLink.target = '_blank'; // Abrir en nueva pestaña
                // No hacer click automático para mejor experiencia de usuario
              }
            }
          );
        };
      } else {
        resultadoDiv.className = 'resultado error';
        resultadoDiv.innerHTML = '<h3>Lo sentimos</h3><p>No formas parte de la lista de estudiantes meritorios para el período actual.</p>';
        downloadButton.style.display = 'none';
        downloadLink.style.display = 'none';
      }
    });
  };