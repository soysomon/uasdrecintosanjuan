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

    // Ocultar el resultado antes de buscar
    resultadoDiv.style.display = "none"; // Usamos style.display en lugar de classList
    const matricula = matriculaInput.value.trim();

    if (!matricula) {
        toast.warning("Por favor, ingresa una matrícula válida.");
        return;
    }

    // Mostrar solo la carga de consulta
    loadingDiv.style.display = "flex"; // Cambiado a flex para centrar mejor
    loadingDiv.querySelector("p")!.textContent = "Consultando Datos...";
    downloadButton.style.display = "none";
    downloadLink.style.display = "none";

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
            loadingDiv.style.display = "none";
            toast.error("Error de conexión con el servidor.");
        };
    };

    const API_URL = "https://script.google.com/macros/s/AKfycbxmNKuso8DfeaCZsHqIGAwhivppukwoxtQe0zjNpDo4U46fcmjPaqAxhCpRIlJ_MNM3/exec";

    jsonp(`${API_URL}?action=buscar&matricula=${encodeURIComponent(matricula)}`, (data) => {
        loadingDiv.style.display = "none";

        // Mostrar el resultado
        resultadoDiv.style.display = "block";

        if (data.error) {
            // Aplicar estilos de error
            resultadoDiv.className = "resultado error p-4 bg-red-50 border-l-4 border-red-500 rounded-md";
            resultadoDiv.innerHTML = `
        <div>
          <h3 class="text-lg font-bold mb-1 text-red-700">Error en la consulta</h3>
          <p class="text-red-600">${data.error}</p>
        </div>
      `;
            toast.error("Error en la consulta. Verifica la matrícula.");
            return;
        }

        if (data.encontrado) {
            // Aplicar estilos de éxito similar a la imagen 3
            resultadoDiv.className = "resultado exito p-4 bg-green-50 border-l-4 border-green-500 rounded-md";
            resultadoDiv.innerHTML = `
         <div>
                <h3 class="text-xl font-extrabold text-green-700">¡Felicidades! Eres estudiante meritorio</h3>
                <p class="mt-2"><strong class="text-green-700">Nombre:</strong> <span class="text-green-700">${data.nombre}</span></p>
                <p><strong class="text-green-700">Índice:</strong> <span class="text-green-700">${data.indice}</span></p>
                <p><strong class="text-green-700">Facultad:</strong> <span class="text-green-700">${data.facultad}</span></p>
            </div>
      `;

            toast.success("Consulta exitosa. ¡Eres estudiante meritorio!");

            downloadButton.style.display = "block";
            downloadButton.innerHTML = "Descargar Certificado";
            downloadButton.className = "w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-md transition-all duration-300";
            downloadButton.disabled = false;

            downloadButton.onclick = () => {
                downloadButton.disabled = true;
                downloadButton.className = "w-full mt-4 bg-red-600 text-white font-bold py-3 rounded-md shadow-md flex items-center justify-center gap-3";
                downloadButton.innerHTML = `
                  <div class="w-5 h-5 border-2 border-white border-l-transparent rounded-full animate-spin flex-shrink-0"></div>
                  <span>Preparando tu certificado...</span>
                `;
              

                loadingDiv.style.display = "none";

                jsonp(
                    `${API_URL}?action=generarCertificado&nombre=${encodeURIComponent(data.nombre)}&indice=${encodeURIComponent(data.indice)}&facultad=${encodeURIComponent(data.facultad)}`,
                    (certData) => {
                        if (certData.error) {
                            downloadButton.disabled = false;
                            downloadButton.innerText = "Reintentar Descarga";
                            downloadButton.className = "w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-md shadow-md";
                            toast.error("Error al generar el certificado.");
                            return;
                        }

                        if (certData.pdfUrl) {
                            downloadButton.className = "w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-md shadow-md";
                            downloadButton.innerText = "¡Certificado listo!";
                            toast.success("Certificado entregado exitosamente.");
                            window.open(certData.pdfUrl, "_blank");

                            downloadLink.href = certData.pdfUrl;
                            downloadLink.style.display = "block";
                            downloadLink.innerText = "Descargar nuevamente";

                            setTimeout(() => {
                                downloadButton.disabled = false;
                                downloadButton.innerHTML = "Descargar Certificado";
                                downloadButton.className = "w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-md";
                            }, 2000);
                        }
                    }
                );
            };
        } else {
            // Aplicar estilos de error para estudiante no encontrado
            resultadoDiv.className = "resultado error p-4 bg-red-50 border-l-4 border-red-500 rounded-md";
            resultadoDiv.innerHTML = `
        <div>
          <h3 class="text-lg font-bold mb-1 text-red-700">Estudiante no encontrado</h3>
          <p class="text-red-600">La matrícula <strong>${matricula}</strong> no aparece en nuestra lista de estudiantes meritorios.</p>
          <p class="text-red-600 mt-2">Si crees que esto es un error, por favor contacta a la oficina de bienestar estudiantil.</p>
        </div>
      `;
            toast.error("Estudiante no encontrado.");
        }
    });
};