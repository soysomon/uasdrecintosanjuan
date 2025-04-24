import { useEffect } from "react";
import { buscarEstudianteLogic } from "./meritoriosLogic";
import CountdownInstitucional from "./CountdownInstitucional";

export default function MeritoriosPage() {
  useEffect(() => {
    buscarEstudianteLogic();
  }, []);
  return (
    <div className="pt-[99px] bg-gradient-to-tr from-white via-blue-50 to-yellow-50 min-h-screen flex flex-col">
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
            <span className="text-2xl font-black text-red-500 leading-none">2024-20</span>
          </div>
          <p className="text-blue-500 mb-6 font-medium max-w-lg">
            Ingresa tu matrícula y conoce si formas parte de la lista de excelencia académica <b>UASD</b>.
          </p>
          {/* Formulario consulta */}
          <form
            id="consultaForm"
            className="w-full max-w-md bg-white/80 border border-blue-100 rounded-2xl shadow-xl px-5 py-8 mb-5 transition-all hover:scale-[1.015] will-change-transform group"
            autoComplete="off"
          >
            <label
              htmlFor="matricula"
              className="block text-blue-800 text-[1.10rem] font-bold mb-1 pl-1"
            >
              Matrícula universitaria
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              maxLength={15}
              className="block w-full text-lg font-medium border-2 border-blue-100 bg-blue-50 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 focus:bg-white transition-all placeholder:text-blue-200 tracking-widest mb-4"
              placeholder="Ej: 100123456"
              required
            />
            <button
              type="button"
              id="buscarBtn"
              className="w-full py-3 font-black text-lg rounded-xl bg-gradient-to-r from-blue-700 via-blue-500 to-yellow-400 shadow-xl text-white transition-all duration-150 transform-gpu hover:scale-105 hover:from-blue-800 hover:to-yellow-500 hover:shadow-2xl active:scale-95 focus:ring-2 focus:ring-yellow-400"
              onClick={buscarEstudianteLogic}
            >
              Consultar
            </button>
            {/* Loader */}
            <div id="loading" className="loading flex-col justify-center items-center mt-4" style={{ display: "none" }}>
              <div className="w-8 h-8 border-[4px] border-yellow-200 border-l-blue-600 animate-spin rounded-full mb-2"></div>
              <p className="font-bold text-blue-700 text-sm">Consultando datos...</p>
            </div>
            {/* Resultados */}
            <div id="resultado" className="resultado mt-3"></div>
            <button
              id="downloadButton"
              className="w-full mt-3 bg-yellow-400 text-blue-900 font-semibold py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              style={{ display: "none" }}
            >
              Descargar Certificado
            </button>
            <a
              id="downloadLink"
              className="w-full mt-2 bg-blue-100 text-blue-700 font-semibold py-2.5 rounded-lg shadow-sm transition-all hover:shadow-lg hover:scale-105 active:scale-95 text-center block"
              style={{ display: "none" }}
              download
            >
              Descargar
            </a>
          </form>
          {/* Fila de badges */}
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 font-bold text-yellow-700 shadow-sm text-sm">
              <span className="text-2xl">🏆</span> Excelencia
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 font-bold text-blue-700 shadow-sm text-sm">
              <span className="text-2xl">🎓</span> Mérito
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 font-bold text-blue-500 shadow-sm text-sm">
              <span className="text-2xl">🌟</span> UASD
            </span>
          </div>
        </div>
        {/* Sección Afiche/Mérito */}
        <aside className="flex flex-col items-center px-4 py-4">
          <div className="w-full max-w-sm bg-white/80 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden flex flex-col items-center mb-6">
            <img
              src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/MERITO-POST-WEB.jpg"
              alt="Afiche Meritorio UASD"
              className="rounded-2xl w-full object-cover object-center bg-blue-50 shadow-md"
              style={{ minHeight: "240px" }}
            />
          </div>
          {/* Tarjetas horizontales */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="w-full flex items-center gap-4 rounded-xl bg-gradient-to-br from-yellow-50 via-blue-50 to-white px-5 py-4 shadow-md">
              <span className="text-3xl bg-yellow-300 rounded-full p-2 text-white drop-shadow">🏆</span>
              <div>
                <div className="font-bold text-blue-900">Excelencia Académica</div>
                <div className="text-blue-400 text-[0.95rem]">Reconoce tu esfuerzo y dedicación.</div>
              </div>
            </div>
            <div className="w-full flex items-center gap-4 rounded-xl bg-gradient-to-br from-blue-50 via-yellow-50 to-white px-5 py-4 shadow-md">
              <span className="text-3xl bg-blue-400 rounded-full p-2 text-white drop-shadow">🎓</span>
              <div>
                <div className="font-bold text-blue-900">Estudiante Meritorio</div>
                <div className="text-blue-400 text-[0.95rem]">Destaca entre los mejores.</div>
              </div>
            </div>
          </div>
        </aside>
      </section>
      {/* Countdown animado institucional */}
      <CountdownInstitucional />
      {/* Footer institucional */}
      <footer className="max-w-full w-full bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-400 text-white text-center font-bold py-5 text-[1.07rem] tracking-wide mt-auto drop-shadow-lg">
        DR. CARLOS SÁNCHEZ DE OLEO · <span className="text-yellow-200">DIRECTOR UASD RECINTO SAN JUAN</span>
      </footer>
    </div>
  );
}