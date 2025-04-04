import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const quickLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Admisiones', href: 'https://uasd.edu.do/admisiones/', external: true },
  { name: 'Carreras', href: '/carreras/grado' },
  { name: 'Postgrado', href: '/carreras/postgrado' },
  { name: 'Investigación', href: '/inicio/proyectos' },
  { name: 'Contacto', href: '/contacto' },
];

const academicLinks = [
  { name: 'Biblioteca', href: '#' },
  { name: 'Calendario Académico', href: '#' },
  { name: 'Oferta Académica', href: '/carreras/grado' },
  { name: 'Becas', href: '#' },
];

const studentLinks = [
  { name: 'Portal Estudiantil', href: 'https://eis.uasd.edu.do', external: true },
  { name: 'Correo Institucional', href: 'https://login.microsoftonline.com', external: true },
  { name: 'Pago en Línea', href: 'https://soft.uasd.edu.do/pagoenlinea/', external: true },
  { name: 'Recuperar NIP', href: 'https://app.uasd.edu.do/recuperar_nip/', external: true },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact Information */}
          <div>
            <div className="mb-6">
              <img
                src="https://i.ibb.co/ksnpGmqH/LOGO-RECINTO-UASD-SAN-JUAN-AZUL-2.png"
                alt="UASD Recinto San Juan"
                className="h-24 w-auto"
              />
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-[#2f2382] mt-1 mr-3" />
                <span className="text-gray-600">
                  Ciudad Universitaria,<br />
                  San Juan de la Maguana,<br />
                  Rep. Dom.
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-[#2f2382] mr-3" />
                <span className="text-gray-600">809-557-2299</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-[#2f2382] mr-3" />
                <span className="text-gray-600">info@uasd.edu.do</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#2f2382] transition-colors flex items-center"
                    >
                      {link.name}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-[#2f2382] transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recursos Académicos</h3>
            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#2f2382] transition-colors flex items-center"
                    >
                      {link.name}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-[#2f2382] transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Servicios Estudiantiles</h3>
            <ul className="space-y-3">
              {studentLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#2f2382] transition-colors flex items-center"
                  >
                    {link.name}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-6 space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} UASD Recinto San Juan. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-[#2f2382] text-sm">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-500 hover:text-[#2f2382] text-sm">
                Términos de Uso
              </a>
              <a href="#" className="text-gray-500 hover:text-[#2f2382] text-sm">
                Mapa del Sitio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}