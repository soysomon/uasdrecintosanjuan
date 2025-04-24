import { useEffect } from "react";
import { buscarEstudianteLogic } from "./meritoriosLogic";
import CountdownInstitucional from "./CountdownInstitucional";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MeritoriosPage() {
    useEffect(() => {
        // Ajustar el padding-top para compensar el nav fijo
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const navHeight = document.querySelector('nav')?.offsetHeight || 0;
            mainContent.setAttribute('style', `padding-top: ${navHeight + 20}px`);
        }

        // Inicializar la lógica de búsqueda
        buscarEstudianteLogic();
    }, []);

    return (
        <div className="bg-white min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated geometric shapes background */}
            <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 45 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-1/4 left-0 w-96 h-96 bg-blue-100/30"
            />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-100/30 rounded-full"
            />
            <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: -45 }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="absolute top-0 right-1/3 w-64 h-64 bg-blue-50/40"
            />
            
            {/* ToastContainer para notificaciones animadas */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Hero Section con ajuste para nav fijo */}
            <section className="main-content w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-9 relative z-10">
                {/* Info & Consulta */}
                <motion.div
                    className="flex-1 flex flex-col items-start justify-center px-4 lg:px-2 py-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col mb-2">
                        <motion.h1
                            className="text-4xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
                            style={{ color: "#234880" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            ¡Descubre si eres
                        </motion.h1>
                        <motion.span
                            className="text-4xl sm:text-4xl lg:text-5xl font-extrabold text-yellow-400 leading-tight "
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Estudiante Meritorio
                        </motion.span>
                    </div>

                    <motion.div
                        className="flex gap-2 items-end mb-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <span className="text-6xl sm:text-7xl lg:text-6xl font-extrabold text-red-500 leading-none">2024-20</span>
                    </motion.div>

                    <motion.p
                        className="text-blue-500 mb-6 font-medium max-w-lg text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        Ingresa tu matrícula y conoce si formas parte de la lista de excelencia académica <b>UASD</b>.
                    </motion.p>

                    {/* Formulario consulta */}
                    <motion.form
                        id="consultaForm"
                        className="w-full max-w-md bg-white/80 border border-blue-100 rounded-2xl shadow-xl px-5 py-8 mb-5"
                        autoComplete="off"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        whileHover={{ scale: 1.015 }}
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
                            className="w-full py-3 font-black text-lg rounded-xl bg-gradient-to-r from-green-600 to-green-400 shadow-xl text-white transition-all duration-150 transform-gpu hover:scale-105 hover:from-green-700 hover:to-green-500 hover:shadow-2xl active:scale-95 focus:ring-2 focus:ring-green-400"
                            onClick={() => buscarEstudianteLogic()}
                        >
                            Consultar
                        </button>

                        {/* Loader animado más pequeño y centrado */}

                        <div id="loading" className="hidden flex-col items-center justify-center w-full mt-4">
                            <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                            <p className="text-blue-900 text-lg animate-pulse">Consultando Datos...</p>  
                        </div>

                        {/* Contenedor para resultados animados */}
                        <div id="resultadoContainer" className="mt-4 w-full">
                            <AnimatePresence>
                                <motion.div
                                    id="resultado"
                                    className="resultado mt-3 hidden w-full"
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{ duration: 0.4 }}
                                ></motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Botones de descarga con animación */}
                        <motion.button
                            id="downloadButton"
                            className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-md shadow-md hidden"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Descargar Certificado
                        </motion.button>

                        <motion.a
                            id="downloadLink"
                            className="w-full mt-3 bg-blue-100 text-blue-700 font-semibold py-2.5 rounded-lg shadow-sm text-center block hidden"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                            download
                        >
                            Descargar
                        </motion.a>
                    </motion.form>

                    {/* Fila de badges con animación */}
                    <motion.div
                        className="flex flex-wrap gap-3 mt-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 font-bold text-yellow-700 shadow-sm text-sm"
                            whileHover={{ scale: 1.05, backgroundColor: "#fef3c7" }}
                        >
                            <span className="text-2xl">🏆</span> Excelencia
                        </motion.span>

                        <motion.span
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 font-bold text-blue-700 shadow-sm text-sm"
                            whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                        >
                            <span className="text-2xl">🎓</span> Mérito
                        </motion.span>

                        <motion.span
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 font-bold text-blue-500 shadow-sm text-sm"
                            whileHover={{ scale: 1.05, backgroundColor: "#eff6ff" }}
                        >
                            <span className="text-2xl">🌟</span> UASD
                        </motion.span>
                    </motion.div>
                </motion.div>

                {/* Sección Afiche/Mérito */}
                <motion.aside
                    className="flex flex-col items-center px-4 py-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <motion.div
                        className="w-full max-w-sm bg-white/80 rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden flex flex-col items-center mb-6"
                        initial={{ y: 30 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                        whileHover={{ scale: 1.03, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    >
                        <img
                            src="https://uasd-recinto-sanjuan-media.s3.us-east-1.amazonaws.com/news_images/MERITO-POST-WEB.jpg"
                            alt="Afiche Meritorio UASD"
                            className="rounded-2xl w-full object-cover object-center bg-blue-50 shadow-md"
                            style={{ minHeight: "240px" }}
                            loading="eager"
                        />
                    </motion.div>

                    {/* Tarjetas horizontales con animación */}
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <motion.div
                            className="w-full flex items-center gap-4 rounded-xl bg-gradient-to-br from-yellow-50 via-blue-50 to-white px-5 py-4 shadow-md"
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <span className="text-3xl bg-yellow-300 rounded-full p-2 text-white drop-shadow">🏆</span>
                            <div>
                                <div className="font-bold text-blue-900">Excelencia Académica</div>
                                <div className="text-blue-400 text-[0.95rem]">Reconoce tu esfuerzo y dedicación.</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="w-full flex items-center gap-4 rounded-xl bg-gradient-to-br from-blue-50 via-yellow-50 to-white px-5 py-4 shadow-md"
                            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <span className="text-3xl bg-blue-400 rounded-full p-2 text-white drop-shadow">🎓</span>
                            <div>
                                <div className="font-bold text-blue-900">Estudiante Meritorio</div>
                                <div className="text-blue-400 text-[0.95rem]">Destaca entre los mejores.</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.aside>
            </section>

            {/* Countdown animado institucional */}
            <CountdownInstitucional />

            {/* Footer institucional */}
            <footer className="max-w-full w-full bg-gradient-to-r from-red-500 via-orange-400 to-orange-500 text-white text-center font-bold py-5 text-lg tracking-wide mt-auto drop-shadow-lg">
                DR. CARLOS SÁNCHEZ DE OLEO · <span className="text-yellow-200">DIRECTOR UASD RECINTO SAN JUAN</span>
            </footer>
        </div>
    );
}