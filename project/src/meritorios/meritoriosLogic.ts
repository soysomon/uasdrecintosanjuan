import { toast } from "react-toastify";

export const buscarEstudianteLogic = () => {
  const matriculaInput = document.getElementById("matricula") as HTMLInputElement;
  const resultadoDiv = document.getElementById("resultado") as HTMLDivElement;
  const loadingDiv = document.getElementById("loading") as HTMLDivElement;
  const downloadButton = document.getElementById("downloadButton") as HTMLButtonElement;
  const downloadLink = document.getElementById("downloadLink") as HTMLAnchorElement;

  if (!matriculaInput || !resultadoDiv || !loadingDiv || !downloadButton || !downloadLink) {
    console.error("Elementos del DOM no encontrados");
    return;
  }

  resultadoDiv.classList.add("hidden");
  const matricula = matriculaInput.value.trim();

  if (!matricula) {
    toast.error("Por favor, ingresa una matrícula válida.");
    return;
  }

  loadingDiv.classList.remove("hidden");
  resultadoDiv.classList.add("hidden");
  downloadButton.classList.add("hidden");
  downloadLink.classList.add("hidden");

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

    script.onerror = () => {
      delete (window as any)[callbackName];
      document.body.removeChild(script);
      loadingDiv.classList.add("hidden");
      toast.error("Error de conexión con el servidor.");
    };
  };

  const API_URL = "https://script.google.com/macros/s/AKfycbxmNKuso8DfeaCZsHqIGAwhivppukwoxtQe0zjNpDo4U46fcmjPaqAxhCpRIlJ_MNM3/exec";

  jsonp(`${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}`, (data) => {
    loadingDiv.classList.add("hidden");

    resultadoDiv.classList.remove("hidden");

    if (data.error) {
      resultadoDiv.className = "resultado error";
      resultadoDiv.innerHTML = `
        <div class="error">
          <h3>Error en la consulta</h3>
          <p>${data.error}</p>
        </div>
      `;
      toast.error("Error en la consulta. Verifica la matrícula.");
      return;
    }

    if (data.encontrado) {
      resultadoDiv.className = "resultado exito";
      resultadoDiv.innerHTML = `
        <div class="success">
          <h3>¡Felicidades! Eres estudiante meritorio</h3>
          <p><strong>Nombre:</strong> ${data.nombre}</p>
          <p><strong>Índice:</strong> ${data.indice}</p>
          <p><strong>Facultad:</strong> ${data.facultad}</p>
        </div>
      `;

      toast.success("Consulta exitosa. ¡Eres estudiante meritorio!");

      downloadButton.classList.remove("hidden");
      downloadButton.innerHTML = "Descargar Certificado";
      downloadButton.style.background = "";
      downloadButton.disabled = false;

      downloadButton.onclick = () => {
        downloadButton.disabled = true;
        downloadButton.innerHTML = `
          <div class="flex items-center justify-center gap-2">
            <div class="w-5 h-5 border-2 border-white border-l-transparent rounded-full animate-spin"></div>
            <span>Preparando tu certificado...</span>
          </div>
        `;
        downloadButton.style.background = "#e53935";
        loadingDiv.classList.remove("hidden");

        jsonp(
          `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre)}&indice=${encodeURIComponent(data.indice)}&facultad=${encodeURIComponent(data.facultad)}`,
          (certData) => {
            loadingDiv.classList.add("hidden");

            if (certData.error) {
              downloadButton.disabled = false;
              downloadButton.innerText = "Reintentar Descarga";
              downloadButton.style.background = "";
              toast.error("Error al generar el certificado.");
              return;
            }

            if (certData.pdfUrl) {
              downloadButton.style.background = "#43a047";
              downloadButton.innerText = "¡Certificado listo!";
              toast.success("Certificado generado exitosamente.");
              window.open(certData.pdfUrl, "_blank");

              downloadLink.href = certData.pdfUrl;
              downloadLink.classList.remove("hidden");
              downloadLink.innerText = "Descargar nuevamente";

              setTimeout(() => {
                downloadButton.disabled = false;
                downloadButton.innerText = "Descargar Certificado";
                downloadButton.style.background = "";
              }, 2000);
            }
          }
        );
      };
    } else {
      resultadoDiv.className = "resultado error";
      resultadoDiv.innerHTML = `
        <div class="error">
          <h3>Estudiante no encontrado</h3>
          <p>La matrícula <strong>${matricula}</strong> no aparece en nuestra lista.</p>
        </div>
      `;
      toast.error("Estudiante no encontrado.");
    }
  });
};
