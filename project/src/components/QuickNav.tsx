import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle2, GraduationCap, CreditCard, RotateCcw, Key, Car as IdCard, Mail } from 'lucide-react';

interface QuickLink {
  icon: React.ReactNode;
  label: string;
  href: string;
  description: string;
  external?: boolean;
}

const ALLOWED_PATHS = [
  '/inicio/historia',
  '/inicio/filosofia',
  '/inicio/mision-vision',
  '/inicio/proyectos',
  '/inicio/informes',
  '/inicio/elias-pina',
  '/inicio/consejo-directivo',
  '/inicio/unidades',
  '/inicio/faq',
  '/inicio/dispensario'
];

const quickLinks: QuickLink[] = [
  {
    icon: <UserCircle2 className="w-5 h-5" />,
    label: 'Autoservicio',
    href: 'https://eis.uasd.edu.do/authenticationendpoint/login.do?Name=PreLoginRequestProcessor&commonAuthCallerPath=%252Fcas%252Flogin&forceAuth=true&passiveAuth=false&service=https%3A%2F%2Fssb.uasd.edu.do%3A443%2Fssomanager%2Fc%2FSSB&tenantDomain=carbon.super&sessionDataKey=04c32ee3-7749-4e84-a964-76a5de86fd43&relyingParty=SSO+Manager+PROD&type=cas&sp=SSO+Manager+PROD&isSaaSApp=false&authenticators=BasicAuthenticator:LOCAL',
    description: 'Portal de autoservicio estudiantil',
    external: true
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    label: 'Admisiones',
    href: 'https://uasd.edu.do/admisiones/',
    description: 'Proceso de admisión',
    external: true
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    label: 'Pago en Línea',
    href: 'https://soft.uasd.edu.do/pagoenlinea/',
    description: 'Sistema de pagos',
    external: true
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    label: 'Hacer Reingreso',
    href: 'https://soft.uasd.edu.do/reingreso/',
    description: 'Proceso de reingreso',
    external: true
  },
  {
    icon: <Key className="w-5 h-5" />,
    label: 'Recuperación de NIP',
    href: 'https://app.uasd.edu.do/recuperar_nip/',
    description: 'Recuperar contraseña',
    external: true
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Office 365',
    href: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=4765445b-32c6-49b0-83e6-1d93765276ca&redirect_uri=https%3A%2F%2Fwww.office.com%2Flandingv2&response_type=code%20id_token&scope=openid%20profile%20https%3A%2F%2Fwww.office.com%2Fv2%2FOfficeHome.All&response_mode=form_post&nonce=637883063213608107.ZTNhMTZhNzgtODQxNy00M2Q0LWFjNTMtZWEzNTQwNWMxMTdiYmI1OWEyMmEtYTNjMS00YjBmLTkyZTItOTQ3MmUyMzI3Mjlh&ui_locales=es-ES&mkt=es-ES&client-request-id=3a8b15ad-6563-456f-ac93-a8accc5a1836&prompt=select_account&state=7XyOilNbsSfbWVHX8cgDWFGgb4c1ipW1TtW41ZBwwbaz-lanHo79BQZiARtwzJqI-kuCJTg2L1mB72EZK6WnZxBB4g3GUR3nSaPhMvbN293GPO9gyufIZO2Sl4A7tepXQNVeprEfGmCz1rAe-lhf6Kngnv_IK-b-VqTOAY1pIbPb1-zifgkZPcrZJbDIB7A9gQ9IGT3zHRrV4doN454LOcbUCt9SHLCaICra679o_NQ0CKkZRlUmTtkxOXXYTxEoPR1DUE8tg2tKR8ry3Xhpr4eAEm_kagBFjWcpKSy5J7tsm3Vj7-3sBSlVyVsMxOgBJ64C5-wij1JnQIwG1xQKJ2TKWuLdjkndw79t5mz70fT9qZphKLKrqVXCSMkEdkUB&x-client-SKU=ID_NETSTANDARD2_0&x-client-ver=6.12.1.0&sso_reload=true',
    description: 'Acceso a correo institucional',
    external: true
  }
];

export function QuickNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Verificar si la página actual debe mostrar el QuickNav
  const shouldShowQuickNav = ALLOWED_PATHS.includes(location.pathname);

  // Manejo del scroll para ocultar/mostrar el panel
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!shouldShowQuickNav) {
    return null;
  }

  return (
    <nav
      className={`fixed right-4 top-32 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-label="Navegación rápida"
    >
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        <h2 className="text-lg font-semibold text-gray-900 mb-4" id="quick-nav-heading">
          Estudiantes
        </h2>
        <ul
          role="list"
          aria-labelledby="quick-nav-heading"
          className="space-y-2"
        >
          {quickLinks.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a
                  href={link.href}
                  className="flex items-center p-2 text-gray-700 rounded-md hover:bg-blue-50 transition-colors group"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} - ${link.description}`}
                >
                  <span className="text-blue-600 group-hover:text-blue-700">
                    {link.icon}
                  </span>
                  <span className="ml-3">{link.label}</span>
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="flex items-center p-2 text-gray-700 rounded-md hover:bg-blue-50 transition-colors group"
                  aria-label={`${link.label} - ${link.description}`}
                >
                  <span className="text-blue-600 group-hover:text-blue-700">
                    {link.icon}
                  </span>
                  <span className="ml-3">{link.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}