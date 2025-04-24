import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Fecha objetivo: 2 de mayo del año actual
const deadline = new Date(new Date().getFullYear(), 4, 2, 0, 0, 0); // mes 0-based

function calculateTimeLeft() {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  return { days };
}

export default function CountdownInstitucional() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const prevDays = useRef(timeLeft.days);

  // Animación GSAP en los días
  const digitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000 * 60 * 60); // actualiza cada hora
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (digitRef.current && prevDays.current !== timeLeft.days) {
      gsap.fromTo(
        digitRef.current,
        { rotateX: 90, opacity: 0, scale: 1.1 },
        {
          rotateX: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );
    }
    prevDays.current = timeLeft.days;
  }, [timeLeft.days]);

  // Genera días para la fila animada inferior (últimos 7 días antes del evento)
  const daysRow = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(deadline);
    d.setDate(deadline.getDate() - (6 - i));
    return d;
  });

  return (
    <section className="w-full max-w-2xl mx-auto flex flex-col items-center mb-8">
      <div className="relative w-full bg-white/80 rounded-2xl shadow-xl px-6 py-8 flex flex-col items-center border border-blue-100 backdrop-blur-lg">
        <div className="text-lg font-extrabold text-blue-800 mb-4 uppercase tracking-widest">
          Entrega oficial de certificados en:
        </div>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-3xl text-blue-400 font-semibold">Faltan</span>
          <div
            ref={digitRef}
            className="bg-gradient-to-br from-yellow-400 via-blue-400 to-blue-600 text-white text-6xl lg:text-7xl font-black px-7 py-3 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-blue-200"
            style={{ minWidth: "100px", minHeight: "74px", letterSpacing: "0.07em" }}
          >
            {String(timeLeft.days).padStart(2, "0")}
          </div>
          <span className="text-blue-700 ml-2 font-bold text-2xl">días</span>
        </div>
        {/* Barra de días */}
        <div className="flex justify-center gap-3 mt-2">
          {daysRow.map((d, i) => {
            const isTarget =
              d.getDate() === deadline.getDate() &&
              d.getMonth() === deadline.getMonth();
            return (
              <div
                key={i}
                className={`flex flex-col items-center transition-all duration-300 ${
                  isTarget
                    ? "scale-110 bg-yellow-400/90 shadow-lg"
                    : "bg-blue-50"
                } rounded-xl px-3 py-2 border ${
                  isTarget ? "border-yellow-600" : "border-blue-100"
                }`}
              >
                <span
                  className={`font-bold text-xl ${
                    isTarget ? "text-white drop-shadow" : "text-blue-800"
                  }`}
                >
                  {d.getDate()}
                </span>
                <span
                  className={`text-xs mt-1 font-semibold ${
                    isTarget ? "text-yellow-900" : "text-blue-400"
                  }`}
                >
                  {isTarget ? "Entrega" : d.toLocaleDateString("es-ES", { weekday: "short" })}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-7 text-center text-blue-700 font-medium">
          <span className="inline-flex items-center gap-2">
            <svg width={22} fill="currentColor" className="text-blue-700 inline" viewBox="0 0 24 24"><path d="M16 2v2h5v2H3V4h5V2h2v2h6V2h2zm2 7v11a2 2 0 01-2 2H8a2 2 0 01-2-2V9h12zm-2 2H8v9h8v-9z"/></svg>
            Ceremonia:&nbsp;
          </span>
          Viernes 2 de mayo, Auditorio Ing. Senecio Ramírez · 10:00 AM
        </p>
      </div>
    </section>
  );
}