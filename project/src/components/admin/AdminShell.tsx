// src/components/admin/AdminShell.tsx
// Fixed full-viewport admin shell — overlays the public site nav completely.
// Sidebar: 220px fixed · Topbar: 52px sticky · Main: scrollable fluid area.
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Images,
  BookOpen,
  GraduationCap,
  BarChart3,
  Users,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import '../../styles/admin.css';

interface AdminShellProps {
  children: React.ReactNode;
  /** Shown in the topbar */
  title: string;
  /** Small monospace badge next to the title */
  subtitle?: string;
  /** Extra controls placed at the right of the topbar */
  topbarRight?: React.ReactNode;
}

const AdminShell: React.FC<AdminShellProps> = ({
  children,
  title,
  subtitle,
  topbarRight,
}) => {
  const location = useLocation();
  const { isSuperAdmin, user, logout } = useAuth();
  const path = location.pathname;

  const isActive = (href: string) =>
    path === href || (href !== '/' && path.startsWith(href));

  return (
    <div className="adm adm-shell">
      {/* ════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════ */}
      <nav className="adm-sidebar" aria-label="Navegación del panel de administración">

        {/* Logo */}
        <div className="adm-logo">
          <div className="adm-logo-mark">U</div>
          <div>
            <div className="adm-logo-name">UASD San Juan</div>
            <div className="adm-logo-sub">Panel admin</div>
          </div>
        </div>

        {/* ── Group: Principal ── */}
        <div className="adm-nav-group">
          <div className="adm-nav-group-label">Principal</div>
          <Link
            to="/admin-panel"
            className={`adm-nav-item${isActive('/admin-panel') ? ' active' : ''}`}
          >
            <LayoutDashboard className="adm-nav-item-icon" size={14} />
            Dashboard
          </Link>
        </div>

        {/* ── Group: Contenido ── */}
        <div className="adm-nav-group">
          <div className="adm-nav-group-label">Contenido web</div>
          <Link
            to="/slides-editor"
            className={`adm-nav-item${isActive('/slides-editor') ? ' active' : ''}`}
          >
            <Images className="adm-nav-item-icon" size={14} />
            Slides del carrusel
          </Link>
          <Link
            to="/memorias-editor"
            className={`adm-nav-item${isActive('/memorias-editor') ? ' active' : ''}`}
          >
            <BookOpen className="adm-nav-item-icon" size={14} />
            Memorias
          </Link>
          <Link
            to="/docentes-editor"
            className={`adm-nav-item${isActive('/docentes-editor') ? ' active' : ''}`}
          >
            <GraduationCap className="adm-nav-item-icon" size={14} />
            Docentes
          </Link>
        </div>

        {/* ── Group: Transparencia ── */}
        <div className="adm-nav-group">
          <div className="adm-nav-group-label">Transparencia</div>
          <Link
            to="/estados-financieros"
            className={`adm-nav-item${isActive('/estados-financieros') ? ' active' : ''}`}
          >
            <BarChart3 className="adm-nav-item-icon" size={14} />
            Estados financieros
          </Link>
        </div>

        {/* ── Group: Sistema (superadmin) ── */}
        {isSuperAdmin && (
          <div className="adm-nav-group">
            <div className="adm-nav-group-label">Sistema</div>
            <Link
              to="/admin/users"
              className={`adm-nav-item${isActive('/admin/users') ? ' active' : ''}`}
            >
              <Users className="adm-nav-item-icon" size={14} />
              Usuarios
            </Link>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="adm-sidebar-footer">
          <Link to="/" className="adm-nav-item" style={{ padding: '6px 0', color: 'var(--adm-ink-3)' }}>
            <ArrowLeft size={13} style={{ color: 'var(--adm-ink-4)', flexShrink: 0 }} />
            Volver al sitio
          </Link>

          {user && (
            <>
              <div className="adm-sidebar-user">
                <div className="adm-sidebar-avatar">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="adm-sidebar-username">{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="adm-nav-item"
                style={{ padding: '4px 0', color: 'var(--adm-ink-3)', fontSize: 12 }}
              >
                <LogOut size={12} style={{ color: 'var(--adm-ink-4)', flexShrink: 0 }} />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ════════════════════════════════════════
          BODY — topbar + scrollable main
      ════════════════════════════════════════ */}
      <div className="adm-body">

        {/* Topbar */}
        <header className="adm-topbar">
          <span className="adm-topbar-title">{title}</span>
          {subtitle && <span className="adm-topbar-badge">{subtitle}</span>}
          {topbarRight && (
            <div className="adm-topbar-actions">{topbarRight}</div>
          )}
        </header>

        {/* Main */}
        <main className="adm-main" id="adm-main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
