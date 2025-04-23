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
      return;
    }
  
    // Mostrar animación de carga
    loadingDiv.style.display = 'flex';
    resultadoDiv.innerHTML = '';
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
      };
    };
  
    // URL del script de Google Apps
    const API_URL = 'https://script.google.com/macros/s/AKfycbxmNKuso8DfeaCZsHqIGAwhivppukwoxtQe0zjNpDo4U46fcmjPaqAxhCpRIlJ_MNM3/exec';
    
    // Búsqueda del estudiante mediante JSONP
    jsonp(`${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}`, (data) => {
      // Ocultar animación de carga
      loadingDiv.style.display = 'none';
  
      if (data.error) {
        resultadoDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        return;
      }
  
      if (data.encontrado) {
        resultadoDiv.innerHTML = `
          <p class="success">¡Felicidades! Eres estudiante meritorio</p>
          <p>Nombre: ${data.nombre}</p>
          <p>Índice: ${data.indice}</p>
          <p>Facultad: ${data.facultad}</p>
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
                downloadLink.href = certData.pdfUrl;
                downloadLink.style.display = 'block';
                downloadLink.click();
              }
            }
          );
        };
      } else {
        resultadoDiv.innerHTML = '<p class="error">Estudiante no encontrado</p>';
        downloadButton.style.display = 'none';
        downloadLink.style.display = 'none';
      }
    });
  };