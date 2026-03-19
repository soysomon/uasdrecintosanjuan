/**
 * useScrollReveal — GSAP ScrollTrigger entrance hook
 *
 * Parámetros canonicos:
 *   from : y:80, opacity:0, scale:0.98
 *   to   : y:0,  opacity:1, scale:1
 *   dur  : 0.9s · ease: power4.out · stagger: 0.12
 *
 * Comportamiento por dispositivo:
 *   pointer:fine  → animación completa con profundidad (y+scale)
 *   pointer:coarse → simplificada (y+opacity, sin scale, sin triggers pesados)
 *   prefers-reduced-motion → sin animación
 */
import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface RevealOptions {
  /** Separación entre elementos animados. Default: 0.12 */
  stagger?: number;
  /** ScrollTrigger start. Default: 'top 78%' */
  start?: string;
  /** Delay inicial antes del primer elemento. Default: 0 */
  delay?: number;
}

export function useScrollReveal(
  containerRef: RefObject<HTMLElement>,
  selectors: string | string[],
  options: RevealOptions = {},
  /** Dependencias opcionales para re-inicializar (e.g. contenido async) */
  deps: unknown[] = []
): void {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respeto a prefers-reduced-motion — WCAG 2.3.3
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const selectorStr = Array.isArray(selectors) ? selectors.join(', ') : selectors;
    const elements = el.querySelectorAll<HTMLElement>(selectorStr);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      if (hasFinePointer) {
        // Desktop — profundidad completa: y + opacity + scale
        gsap.fromTo(
          elements,
          { y: 80, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power4.out',
            stagger: options.stagger ?? 0.12,
            delay: options.delay ?? 0,
            clearProps: 'scale', // devuelve compositing a GPU layer natural
            scrollTrigger: {
              trigger: el,
              start: options.start ?? 'top 78%',
              once: true,
            },
          }
        );
      } else {
        // Mobile — simplificado: sin scale, sin triggers pesados
        gsap.fromTo(
          elements,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current, ...deps]);
}
