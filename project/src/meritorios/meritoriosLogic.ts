interface EstudianteResponse {
    encontrado: boolean;
    nombre?: string;
    indice?: string;
    facultad?: string;
    error?: string;
  }
  
  export function setupMeritoriosLogic(): void {
    const buscar = async (): Promise<void> => {
      const matriculaInput = document.getElementById('matricula') as HTMLInputElement | null;
      const matricula: string | undefined = matriculaInput?.value.trim();
  
      if (!matricula) {
        mostrarError('Por favor, ingresa una matrícula válida.');
        return;
      }
  
      const loadingDiv = document.getElementById('loading') as HTMLDivElement | null;
      const buscarBtn = document.getElementById('buscarBtn') as HTMLButtonElement | null;
      const formInputs = document.querySelectorAll('#consultaForm input, #consultaForm button') as NodeListOf<
        HTMLInputElement | HTMLButtonElement
      >;
  
      if (loadingDiv) loadingDiv.style.display = 'block';
      if (buscarBtn) buscarBtn.disabled = true;
      formInputs.forEach((input) => (input.disabled = true));
  
      const resultadoDiv = document.getElementById('resultado') as HTMLDivElement | null;
      if (resultadoDiv) resultadoDiv.style.display = 'none';
  
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyHPkMh7M8jmmVR8VKPDXFnkMSq5S0oaU8R4uhQ4uf5rSlVYN9sgPxYUabfgocQhUT7/exec', {
          method: 'POST',
          body: JSON.stringify({ matricula }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        const result: EstudianteResponse = await response.json();
  
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (buscarBtn) buscarBtn.disabled = false;
        formInputs.forEach((input) => (input.disabled = false));
  
        if (result.encontrado) {
          mostrarExito(result);
        } else {
          mostrarNoEncontrado(matricula);
        }
      } catch (error) {
        console.error('Error:', error);
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (buscarBtn) buscarBtn.disabled = false;
        formInputs.forEach((input) => (input.disabled = false));
        mostrarError(`Error al procesar la solicitud: ${(error as Error).message}`);
      }
    };
  
    const mostrarExito = (data: EstudianteResponse): void => {
      const resultadoDiv = document.getElementById('resultado') as HTMLDivElement | null;
      if (resultadoDiv) {
        resultadoDiv.className = 'resultado exito';
        resultadoDiv.innerHTML = `
          <h3>¡Felicidades! Eres estudiante meritorio</h3>
          <p><strong>Nombre:</strong> ${data.nombre || 'No especificado'}</p>
          <p><strong>Índice:</strong> ${data.indice || 'No especificado'}</p>
          <p><strong>Facultad:</strong> ${data.facultad || 'No especificada'}</p>
          <a id="certificadoLink" class="download-btn" href="#" target="_blank">Descargar Certificado</a>
        `;
        resultadoDiv.style.display = 'block';
        generarCertificado(data.nombre || '', data.indice || '', data.facultad || '');
      }
    };
  
    const mostrarNoEncontrado = (matricula: string): void => {
      const resultadoDiv = document.getElementById('resultado') as HTMLDivElement | null;
      if (resultadoDiv) {
        resultadoDiv.className = 'resultado error';
        resultadoDiv.innerHTML = `
          <h3>Estudiante no encontrado</h3>
          <p>La matrícula <strong>${matricula}</strong> no aparece en nuestra lista de estudiantes meritorios.</p>
          <p>Si crees que esto es un error, por favor contacta a la oficina de registro.</p>
        `;
        resultadoDiv.style.display = 'block';
      }
    };
  
    const mostrarError = (mensaje: string): void => {
      const resultadoDiv = document.getElementById('resultado') as HTMLDivElement | null;
      if (resultadoDiv) {
        resultadoDiv.className = 'resultado error';
        resultadoDiv.innerHTML = `
          <h3>Error</h3>
          <p>${mensaje}</p>
        `;
        resultadoDiv.style.display = 'block';
      }
    };
  
    const generarCertificado = async (nombre: string, indice: string, facultad: string): Promise<void> => {
      const loadingDiv = document.getElementById('loading') as HTMLDivElement | null;
      const certificadoLink = document.getElementById('certificadoLink') as HTMLAnchorElement | null;
  
      if (loadingDiv) loadingDiv.style.display = 'block';
      if (certificadoLink) certificadoLink.style.pointerEvents = 'none';
  
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyHPkMh7M8jmmVR8VKPDXFnkMSq5S0oaU8R4uhQ4uf5rSlVYN9sgPxYUabfgocQhUT7/exec', {
          method: 'POST',
          body: JSON.stringify({ nombre, indice, facultad }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        const url: string = await response.text();
  
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (certificadoLink) {
          certificadoLink.style.pointerEvents = 'auto';
          certificadoLink.href = url;
        }
      } catch (error) {
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (certificadoLink) certificadoLink.style.pointerEvents = 'auto';
        mostrarError(`Error generando el certificado: ${(error as Error).message}`);
      }
    };
  
    const buscarBtn = document.getElementById('buscarBtn');
    const consultaForm = document.getElementById('consultaForm');
  
    buscarBtn?.addEventListener('click', buscar);
    consultaForm?.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      buscar();
    });
  }