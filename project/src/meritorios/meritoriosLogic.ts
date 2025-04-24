import gsap from "gsap";

export const buscarEstudianteLogic = () => {
  const matriculaInput = document.getElementById("matricula") as HTMLInputElement;
  const resultadoDiv = document.getElementById("resultado") as HTMLDivElement;
  const successAlert = document.getElementById("successAlert") as HTMLDivElement;
  const errorAlert = document.getElementById("errorAlert") as HTMLDivElement;
  const loadingDiv = document.getElementById("loading") as HTMLDivElement;
  const downloadButton = document.getElementById("downloadButton") as HTMLButtonElement;
  const downloadLink = document.getElementById("downloadLink") as HTMLAnchorElement;

  if (
    !matriculaInput ||
    !resultadoDiv ||
    !successAlert ||
    !errorAlert ||
    !loadingDiv ||
    !downloadButton ||
    !downloadLink
  ) {
    console.error("Elementos del DOM no encontrados");
    return;
  }

  // Ocultar alertas al inicio
  successAlert.style.display = "none";
  errorAlert.style.display = "none";
  downloadButton.style.display = "none";
  downloadLink.style.display = "none";

  const matricula = matriculaInput.value.trim();

  if (!matricula) {
    errorAlert.innerHTML = `
      <p class="font-bold">Por favor, ingrese una matrícula</p>
      <p>Necesitamos tu número de matrícula para verificar si eres estudiante meritorio.</p>
    `;
    errorAlert.style.display = "block";
    gsap.fromTo(
      errorAlert,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    return;
  }

  // Mostrar animación de carga
  loadingDiv.style.display = "flex";

  // Función para hacer llamadas JSONP
  const jsonp = (url: string, callback: (data: any) => void) => {
    const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      callback(data);
    };

    const script = document.createElement("script");
    url += (url.includes("?") ? "&" : "?") + "callback=" + callbackName;
    script.src = url;
    document.body.appendChild(script);

    // Manejador de error
    script.onerror = () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      loadingDiv.style.display = "none";
      errorAlert.innerHTML = `
        <p class="font-bold">Error de conexión</p>
        <p>No pudimos conectar con el servidor. Por favor, intenta nuevamente más tarde.</p>
      `;
      errorAlert.style.display = "block";
      gsap.fromTo(
        errorAlert,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    };
  };

  // URL del script de Google Apps
  const API_URL =
    "https://script.google.com/macros/s/AKfycbxmNKuso8DfeaCZsHqIGAwhivppukwoxtQe0zjNpDo4U46fcmjPaqAxhCpRIlJ_MNM3/exec";

  // Búsqueda del estudiante mediante JSONP
  console.log("Consultando estudiante con matrícula:", matricula);
  jsonp(
    `${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}`,
    (data) => {
      console.log("Respuesta de la API:", data);
      // Ocultar animación de carga
      loadingDiv.style.display = "none";

      if (data.error) {
        errorAlert.innerHTML = `
          <p class="font-bold">Error en la consulta</p>
          <p>${data.error}</p>
          <p>Si el problema persiste, contacta a la oficina de registro.</p>
        `;
        errorAlert.style.display = "block";
        gsap.fromTo(
          errorAlert,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
        return;
      }

      if (data.encontrado) {
        successAlert.innerHTML = `
          <p class="font-bold">¡Felicidades! Eres estudiante meritorio</p>
          <p><strong>Nombre:</strong> ${data.nombre}</p>
          <p><strong>Índice:</strong> ${data.indice}</p>
          <p><strong>Facultad:</strong> ${data.facultad}</p>
        `;
        successAlert.style.display = "block";
        gsap.fromTo(
          successAlert,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
        downloadButton.style.display = "block";

        // Manejar la generación del certificado
        downloadButton.onclick = () => {
          // Mostrar feedback visual en el botón
          downloadButton.disabled = true;
          downloadButton.innerText = "Preparando tu certificado...";
          downloadButton.className = "w-full mt-3 bg-red-500 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all";

          // Mostrar animación de carga para el certificado
          loadingDiv.style.display = "flex";

          // Generar certificado mediante JSONP
          console.log("Generando certificado para:", data.nombre);
          jsonp(
            `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(
              data.nombre
            )}&indice=${encodeURIComponent(
              data.indice
            )}&facultad=${encodeURIComponent(data.facultad)}`,
            (certData) => {
              console.log("Respuesta de generación de certificado:", certData);
              // Ocultar animación de carga
              loadingDiv.style.display = "none";

              if (certData.error) {
                // Restaurar estado del botón
                downloadButton.disabled = false;
                downloadButton.innerText = "Reintentar Descarga";
                downloadButton.className = "w-full mt-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95";

                errorAlert.innerHTML = `
                  <p class="font-bold">Error</p>
                  <p>Error generando certificado: ${certData.error}</p>
                  <p>Por favor, intenta nuevamente.</p>
                `;
                errorAlert.style.display = "block";
                gsap.fromTo(
                  errorAlert,
                  { x: 100, opacity: 0 },
                  { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
                );
                return;
              }

              if (certData.pdfUrl) {
                // Actualizar botón con feedback visual de éxito
                downloadButton.innerText = "¡Certificado listo!";
                downloadButton.className = "w-full mt-3 bg-green-500 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all";

                // Abrir el PDF en una nueva pestaña
                window.open(certData.pdfUrl, "_blank");

                // También configurar el enlace por si acaso
                downloadLink.href = certData.pdfUrl;
                downloadLink.style.display = "block";

                // Habilitar botón después de 2 segundos
                setTimeout(() => {
                  downloadButton.disabled = false;
                  downloadButton.innerText = "Descargar Certificado";
                  downloadButton.className = "w-full mt-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95";
                }, 2000);
              }
            }
          );
        };
      } else {
        errorAlert.innerHTML = `
          <p class="font-bold">Estudiante no encontrado</p>
          <p>La matrícula <strong>${matricula}</strong> no aparece en nuestra lista de estudiantes meritorios.</p>
          <p>Si crees que esto es un error, por favor contacta a la oficina de registro.</p>
        `;
        errorAlert.style.display = "block";
        gsap.fromTo(
          errorAlert,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
        downloadButton.style.display = "none";
        downloadLink.style.display = "none";
      }
    }
  );
};

// Inicializar ocultando el mensaje de error al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const successAlert = document.getElementById("successAlert");
  const errorAlert = document.getElementById("errorAlert");
  if (successAlert && errorAlert) {
    successAlert.style.display = "none";
    errorAlert.style.display = "none";
  }
});