export const buscarEstudianteLogic = async () => {
    const matriculaInput = document.getElementById('matricula') as HTMLInputElement;
    const resultadoDiv = document.getElementById('resultado') as HTMLDivElement;
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
    const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;
  
    if (!matriculaInput || !resultadoDiv || !downloadButton || !downloadLink) {
      console.error('Elementos del DOM no encontrados');
      return;
    }
  
    const matricula = matriculaInput.value.trim();
  
    if (!matricula) {
      resultadoDiv.innerHTML = '<p class="error">Por favor, ingrese una matrícula válida.</p>';
      return;
    }
  
    resultadoDiv.innerHTML = '<p>Buscando...</p>';
  
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbycUBevt0P0mfvSzijkV6jALUblvsKkxzGEssLePWE5u397ES-Z1QwpBnje9woE87tR/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'buscar', matricula })
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
  
      const data: { encontrado: boolean; nombre?: string; indice?: string; facultad?: string; error?: string } = await response.json();
  
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
            const certResponse = await fetch('https://script.google.com/macros/s/AKfycbycUBevt0P0mfvSzijkV6jALUblvsKkxzGEssLePWE5u397ES-Z1QwpBnje9woE87tR/exec', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'generarCertificado', nombre: data.nombre, indice: data.indice, facultad: data.facultad })
            });
  
            if (!certResponse.ok) {
              throw new Error(`Error generando certificado: ${certResponse.status}`);
            }
  
            const certData: { pdfUrl?: string; error?: string } = await certResponse.json();
  
            if (certData.error) {
              resultadoDiv.innerHTML = `<p class="error">Error generando certificado: ${certData.error}</p>`;
              return;
            }
  
            if (certData.pdfUrl) {
              downloadLink.href = certData.pdfUrl;
              downloadLink.style.display = 'block';
              downloadLink.click();
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            resultadoDiv.innerHTML = `<p class="error">Error generando certificado: ${errorMessage}</p>`;
          }
        };
      } else {
        resultadoDiv.innerHTML = '<p class="error">Estudiante no encontrado</p>';
        downloadButton.style.display = 'none';
        downloadLink.style.display = 'none';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      resultadoDiv.innerHTML = `<p class="error">Error: ${errorMessage}</p>`;
      downloadButton.style.display = 'none';
      downloadLink.style.display = 'none';
    }
  };