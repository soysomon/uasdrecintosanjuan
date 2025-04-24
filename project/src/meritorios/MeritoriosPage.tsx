import { useEffect } from "react";
import { buscarEstudianteLogic } from "./meritoriosLogic";
import CountdownInstitucional from "./CountdownInstitucional";

export default function MeritoriosPage() {
  useEffect(() => {
    buscarEstudianteLogic();
  }, []);
  return (
    <div className="pt-[99px] bg-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-9">
        {/* Info & Consulta */}
        <div className="flex-1 flex flex-col items-start justify-center px-4 lg:px-2 py-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-blue-800 mb-2 leading-tight">
            ¡Descubre si eres
            <br />
            <span className="text-yellow-400 drop-shadow">Estudiante Meritorio</span>
          </h1>
          <div className="flex gap-2 items-end mb-1">
            <span className="text-4xl font-black text-red-500 leading-none">2024-20</span>
          </div>
          <p className="text-gray-600 mb-6 font-medium max-w-lg">
            Ingresa tu matrícula y conoce si formas parte de la lista de excelencia académica <b>UASD</b>.
          </p>
          {/* Formulario consulta */}
          <form
            id="consultaForm"
            className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md px-5 py-8 mb-5 transition-all hover:scale-[1.015] will-change-transform group"
            autoComplete="off"
          >
            <label
              htmlFor="matricula"
              className="block text-gray-800 text-[1.10rem] font-bold mb-1 pl-1"
            >
              Matrícula universitaria
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              maxLength={15}
              className="block w-full text-lg font-medium border-2 border-gray-200 bg-gray-50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-300 tracking-widest mb-4"
              placeholder="Ej: 100123456"
              required
            />
            <button
              type="button"
              id="buscarBtn"
              className="w-full py-3 font-black text-lg rounded-xl bg-gray-700 text-white transition-all duration-150 transform-gpu hover:scale-105 hover:bg-gray-800 hover:shadow-lg active:scale-95 focus:ring-2 focus:ring-gray-400"
            >
              Consultar
            </button>
            {/* Loader */}
            <div id="loading" className="loading flex-col justify-center items-center mt-4" style={{ display: "none" }}>
              <div className="w-8 h-8 border-[4px] border-gray-200 border-l-gray-600 animate-spin rounded-full mb-2"></div>
              <p className="font-bold text-gray-700 text-sm">Consultando datos...</p>
            </div>
            {/* Resultados */}
            <div id="resultado" className="resultado mt-3">
              <div id="successAlert" className="hidden bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg shadow-md">
                <p className="font-bold">¡Felicidades!</p>
                <p>Eres un estudiante meritorio.</p>
              </div>
              <div id="errorAlert" className="hidden bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg shadow-md">
                <p className="font-bold">Lo sentimos</p>
                <p>No estás en la lista de estudiantes meritorios.</p>
              </div>
            </div>
            <button
              id="downloadButton"
              className="w-full mt-3 bg-gray-300 text-gray-900 font-semibold py-2.5 rounded-lg shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              style={{ display: "none" }}
            >
              Descargar Certificado
            </button>
            <a
              id="downloadLink"
              className="w-full mt-2 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg shadow-sm transition-all hover:shadow-lg hover:scale-105 active:scale-95 text-center block"
              style={{ display: "none" }}
              download
            >
              Descargar
            </a>
          </form>
          {/* Fila de badges */}
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 font-bold text-gray-700 shadow-sm text-sm">
              <span className="text-2xl">🏆</span> Excelencia
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 font-bold text-gray-700 shadow-sm text-sm">
              <span className="text-2xl">🎓</span> Mérito
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 font-bold text-gray-700 shadow-sm text-sm">
              <span className="text-2xl">🌟</span> UASD
            </span>
          </div>
        </div>
        {/* Sección Afiche/Mérito */}
        <aside className="flex flex-col items-center px-4 py-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-md border-2 border-gray-200 overflow-hidden flex flex-col items-center mb-6">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/MERITO-POST-WEB.jpg"
              alt="Afiche Meritorio UASD"
              className="rounded-2xl w-full object-cover object-center bg-gray-50 shadow-md"
              style={{ minHeight: "240px" }}
            />
          </div>
          {/* Tarjetas horizontales */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="w-full flex items-center gap-4 rounded-xl bg-gray-50 px-5 py-4 shadow-md">
              <span className="text-3xl bg-gray-300 rounded-full p-2 text-white drop-shadow">🏆</span>
              <div>
                <div className="font-bold text-gray-900">Excelencia Académica</div>
                <div className="text-gray-500 text-[0.95rem]">Reconoce tu esfuerzo y dedicación.</div>
              </div>
            </div>
            <div className="w-full flex items-center gap-4 rounded-xl bg-gray-50 px-5 py-4 shadow-md">
              <span className="text-3xl bg-gray-300 rounded-full p-2 text-white drop-shadow">🎓</span>
              <div>
                <div className="font-bold text-gray-900">Estudiante Meritorio</div>
                <div className="text-gray-500 text-[0.95rem]">Destaca entre los mejores.</div>
              </div>
            </div>
          </div>
        </aside>
      </section>
      {/* Countdown animado institucional */}
      <CountdownInstitucional />
      {/* Footer institucional */}
      <footer className="max-w-full w-full bg-gray-800 text-white text-center font-bold py-5 text-[1.07rem] tracking-wide mt-auto drop-shadow-lg">
        DR. CARLOS SÁNCHEZ DE OLEO · <span className="text-gray-300">DIRECTOR UASD RECINTO SAN JUAN</span>
      </footer>
    </div>
  );
}