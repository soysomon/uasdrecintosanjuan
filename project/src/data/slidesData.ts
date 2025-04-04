import graduacion from "../img/graduacion.jpg"; 
import Postgrado from "../img/postgrado.png"; 
import Informatica from "../img/informatica.jpg";

export const slidesData = [
  {
    id: 1,
    subtitle: "NUEVO",
    title: "LICENCIATURA EN CIBERSEGURIDAD",
    description: "MODALIDAD SEMIPRESENCIAL • UASD San Juan de la Maguana",
    cta: {
      text: "Solicitar información",
      link: "/admisiones"
    },
    image: graduacion,
    color: "#003087"
  },
  {
    id: 2,
    subtitle: "POSGRADOS",
    title: "MAESTRÍA EN GESTIÓN EDUCATIVA",
    description: "Especialización de alto nivel para profesionales de la educación",
    cta: {
      text: "Conocer oferta completa",
      link: "/carreras/postgrado"
    },
    image: Postgrado,
    color: "#45046A"
  },
  {
    id: 3,
    subtitle: "TECNOLOGÍA",
    title: "LICENCIATURA EN INFORMÁTICA",
    description: "Prepárate para liderar la transformación digital del futuro",
    cta: {
      text: "Explorar programa",
      link: "/carreras/grado"
    },
    image: Informatica,
    color: "#004A98"
  }
];