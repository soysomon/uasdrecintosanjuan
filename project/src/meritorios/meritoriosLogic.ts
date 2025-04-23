export const buscarEstudianteLogic = async () => {
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
  
    try {
      const API_URL = 'https://script.google.com/macros/s/AKfycbzMxE6E_AmVKoi5leK9DJIiebLxYTPSdSdu8c6eT4s770HLjPSmdXYpTjPu8FwNj1-e/exec';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'buscar', 
          matricula,
          origin: window.location.origin 
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
  
      const data: { encontrado: boolean; nombre?: string; indice?: string; facultad?: string; error?: string } = await response.json();
  
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
        downloadButton.onclick = async () => {
          try {
            // Mostrar animación de carga para el certificado
            loadingDiv.style.display = 'flex';
            resultadoDiv.innerHTML += '<p>Generando certificado...</p>';
            
            const certResponse = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                action: 'generarCertificado', 
                nombre: data.nombre, 
                indice: data.indice, 
                facultad: data.facultad,
                origin: window.location.origin 
              })
            });
  
            // Ocultar animación de carga
            loadingDiv.style.display = 'none';
  
            if (!certResponse.ok) {
              throw new Error(`Error generando certificado: ${certResponse.status}`);
            }
  
            const certData: { pdfUrl?: string; error?: string } = await certResponse.json();
  
            if (certData.error) {
              resultadoDiv.innerHTML += `<p class="error">Error generando certificado: ${certData.error}</p>`;
              return;
            }
  
            if (certData.pdfUrl) {
              downloadLink.href = certData.pdfUrl;
              downloadLink.style.display = 'block';
              downloadLink.click();
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            resultadoDiv.innerHTML += `<p class="error">Error generando certificado: ${errorMessage}</p>`;
          }
        };
      } else {
        resultadoDiv.innerHTML = '<p class="error">Estudiante no encontrado</p>';
        downloadButton.style.display = 'none';
        downloadLink.style.display = 'none';
      }
    } catch (error) {
      // Ocultar animación de carga
      loadingDiv.style.display = 'none';
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      resultadoDiv.innerHTML = `<p class="error">Error: ${errorMessage}</p>`;
      downloadButton.style.display = 'none';
      downloadLink.style.display = 'none';
    }
  };