export const buscarEstudianteLogic = () => {
    const matriculaInput = document.getElementById('matricula') as HTMLInputElement;
    const resultadoDiv = document.getElementById('resultado') as HTMLDivElement;
    const loadingDiv = document.getElementById('loading') as HTMLDivElement;
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
    const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;
    const instructionText = document.getElementById('instructionText') as HTMLParagraphElement;
  
    if (!matriculaInput || !resultadoDiv || !loadingDiv || !downloadButton || !downloadLink) {
      console.error('Elementos del DOM no encontrados');
      return;
    }
  
    // Ocultar el mensaje de validación al inicio
    resultadoDiv.style.display = 'none';
    
    // Cambiar el texto de instrucción a verde
    if (instructionText) {
      instructionText.innerHTML = 'Necesitamos tu número de matrícula para verificar si eres estudiante meritorio.';
      instructionText.style.color = '#43a047';
    }
  
    const matricula = matriculaInput.value.trim();
  
    if (!matricula) {
      // Mostrar animación suave para el error
      resultadoDiv.style.opacity = '0';
      resultadoDiv.style.display = 'block';
      resultadoDiv.innerHTML = `
        <div class="error">
          <h3>Por favor, ingrese una matrícula</h3>
          <p>Necesitamos tu número de matrícula para verificar si eres estudiante meritorio.</p>
        </div>
      `;
      resultadoDiv.className = 'resultado error';
      
      // Animar la aparición del mensaje
      setTimeout(() => {
        resultadoDiv.style.opacity = '1';
        resultadoDiv.style.transition = 'opacity 0.3s ease-in-out';
      }, 10);
      return;
    }
  
    // Mostrar animación de carga
    loadingDiv.style.display = 'flex';
    loadingDiv.style.opacity = '0';
    setTimeout(() => {
      loadingDiv.style.opacity = '1';
      loadingDiv.style.transition = 'opacity 0.3s ease-in-out';
    }, 10);
    
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
        
        // Animación para el mensaje de error
        resultadoDiv.style.opacity = '0';
        resultadoDiv.innerHTML = `
          <div class="error">
            <h3>Error de conexión</h3>
            <p>No pudimos conectar con el servidor. Por favor, intenta nuevamente más tarde.</p>
          </div>
        `;
        resultadoDiv.style.display = 'block';
        resultadoDiv.className = 'resultado error';
        
        setTimeout(() => {
          resultadoDiv.style.opacity = '1';
          resultadoDiv.style.transition = 'opacity 0.3s ease-in-out';
        }, 10);
      };
    };
  
    // URL del script de Google Apps
    const API_URL = 'https://script.google.com/macros/s/AKfycbxmNKuso8DfeaCZsHqIGAwhivppukwoxtQe0zjNpDo4U46fcmjPaqAxhCpRIlJ_MNM3/exec';
    
    // Búsqueda del estudiante mediante JSONP
    jsonp(`${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}`, (data) => {
      // Ocultar animación de carga con transición
      loadingDiv.style.opacity = '0';
      loadingDiv.style.transition = 'opacity 0.3s ease-in-out';
      setTimeout(() => {
        loadingDiv.style.display = 'none';
      }, 300);
  
      // Preparar el div de resultado con animación
      resultadoDiv.style.opacity = '0';
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
        
        setTimeout(() => {
          resultadoDiv.style.opacity = '1';
          resultadoDiv.style.transition = 'opacity 0.3s ease-in-out';
        }, 10);
        return;
      }
  
      if (data.encontrado) {
        // Nuevo diseño moderno para el mensaje de éxito
        resultadoDiv.className = 'resultado exito';
        resultadoDiv.innerHTML = `
          <div class="success">
            <div class="success-icon">✓</div>
            <div class="success-content">
              <h3>¡Felicidades! Eres estudiante meritorio</h3>
              <div class="student-info">
                <p><strong>Nombre:</strong> ${data.nombre}</p>
                <p><strong>Índice:</strong> ${data.indice}</p>
                <p><strong>Facultad:</strong> ${data.facultad}</p>
              </div>
            </div>
          </div>
        `;
        
        // Configurar el botón de descarga con microinteracciones
        downloadButton.style.display = 'block';
        downloadButton.style.opacity = '0';
        downloadButton.innerText = 'Descargar Certificado';
        downloadButton.className = 'download-btn';
        
        setTimeout(() => {
          resultadoDiv.style.opacity = '1';
          downloadButton.style.opacity = '1';
          resultadoDiv.style.transition = 'opacity 0.3s ease-in-out';
          downloadButton.style.transition = 'opacity 0.3s ease-in-out, background-color 0.3s ease';
        }, 10);
        
        // Manejar la generación del certificado
        downloadButton.onclick = () => {
          // Eliminar cualquier enlace anterior
          downloadLink.style.display = 'none';
          
          // Mostrar feedback visual en el botón
          downloadButton.disabled = true;
          downloadButton.innerText = 'Preparando tu certificado...';
          downloadButton.style.background = '#e53935'; // Rojo durante la generación
          
          // Pequeña animación de pulso en el botón
          downloadButton.classList.add('pulse-animation');
          
          // Mostrar animación de carga para el certificado (sin texto adicional)
          loadingDiv.style.display = 'flex';
          loadingDiv.style.opacity = '1';
          
          // Generar certificado mediante JSONP
          jsonp(
            `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre)}&indice=${encodeURIComponent(data.indice)}&facultad=${encodeURIComponent(data.facultad)}`,
            (certData) => {
              // Ocultar animación de carga
              loadingDiv.style.opacity = '0';
              setTimeout(() => {
                loadingDiv.style.display = 'none';
              }, 300);
  
              if (certData.error) {
                // Restaurar estado del botón
                downloadButton.classList.remove('pulse-animation');
                downloadButton.disabled = false;
                downloadButton.innerText = 'Reintentar Descarga';
                downloadButton.style.background = '';
                
                // Mostrar toast de error en lugar de modificar el resultado
                mostrarToast('Error generando certificado. Por favor, intenta nuevamente.', 'error');
                return;
              }
  
              if (certData.pdfUrl) {
                // Actualizar botón con feedback visual de éxito
                downloadButton.classList.remove('pulse-animation');
                downloadButton.style.background = '#43a047'; // Verde al finalizar con éxito
                downloadButton.innerText = '¡Certificado listo!';
                
                // Descargar el PDF automáticamente mediante un enlace en lugar de window.open
                const a = document.createElement('a');
                a.href = certData.pdfUrl;
                a.download = `certificado_meritorio_${data.nombre.replace(/\s+/g, '_')}.pdf`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // Mostrar toast de éxito
                mostrarToast('¡Certificado descargado correctamente!', 'success');
                
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
            <div class="error-icon">!</div>
            <div class="error-content">
              <h3>Estudiante no encontrado</h3>
              <p>La matrícula <strong>${matricula}</strong> no aparece en nuestra lista de estudiantes meritorios.</p>
              <p>Si crees que esto es un error, por favor contacta a la oficina de registro.</p>
            </div>
          </div>
        `;
        downloadButton.style.display = 'none';
        downloadLink.style.display = 'none';
        
        setTimeout(() => {
          resultadoDiv.style.opacity = '1';
          resultadoDiv.style.transition = 'opacity 0.3s ease-in-out';
        }, 10);
      }
    });
  };
  
  // Función para mostrar toast
  const mostrarToast = (mensaje: string, tipo: 'success' | 'error' | 'info') => {
    // Crear elemento toast si no existe
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    
    // Configurar el toast
    toast.className = `toast ${tipo}`;
    toast.innerHTML = mensaje;
    toast.style.display = 'block';
    
    // Animar entrada
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        toast.style.display = 'none';
      }, 300);
    }, 3000);
  };
  
  // Inicializar ocultando el mensaje de error y configurando los estilos del toast al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    const resultadoDiv = document.getElementById('resultado');
    if (resultadoDiv) {
      resultadoDiv.style.display = 'none';
    }
    
    // Crear estilos para el toast
    if (!document.getElementById('toastStyles')) {
      const style = document.createElement('style');
      style.id = 'toastStyles';
      style.innerHTML = `
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          padding: 12px 24px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-width: 80%;
          text-align: center;
        }
        
        .toast.success {
          background-color: #43a047;
        }
        
        .toast.error {
          background-color: #e53935;
        }
        
        .toast.info {
          background-color: #1976d2;
        }
        
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .success-icon, .error-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-right: 16px;
        }
        
        .success-icon {
          background-color: #43a047;
          color: white;
        }
        
        .error-icon {
          background-color: #e53935;
          color: white;
        }
        
        .success, .error {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .success {
          background-color: rgba(67, 160, 71, 0.1);
          border-left: 4px solid #43a047;
        }
        
        .error {
          background-color: rgba(229, 57, 53, 0.1);
          border-left: 4px solid #e53935;
        }
        
        .success-content, .error-content {
          flex: 1;
        }
        
        .student-info {
          background-color: rgba(255, 255, 255, 0.5);
          padding: 12px;
          border-radius: 6px;
          margin-top: 10px;
        }
        
        .download-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .download-btn:before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.7s;
        }
        
        .download-btn:hover:before {
          left: 100%;
        }
        
        /* Estilos compatibles con Dark Mode */
        @media (prefers-color-scheme: dark) {
          .success {
            background-color: rgba(67, 160, 71, 0.2);
            color: #e0e0e0;
          }
          
          .error {
            background-color: rgba(229, 57, 53, 0.2);
            color: #e0e0e0;
          }
          
          .student-info {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      `;
      document.head.appendChild(style);
    }
  });