import React from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PendingApprovals from './pages/PendingApprovals';
import Reports from './pages/Reports';
import Users from './pages/Users';
import ContentManagement from './pages/ContentManagement';

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: 240,
    minWidth: 240,
    backgroundColor: '#1e293b',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #334155',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    color: '#fff',
  },
  sidebarSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  nav: {
    flex: 1,
    padding: '16px 0',
  },
  navLink: {
    display: 'block',
    padding: '12px 20px',
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: 14,
    transition: 'background-color 0.15s, color 0.15s',
  },
  navLinkActive: {
    backgroundColor: '#334155',
    color: '#fff',
    borderRight: '3px solid #2563eb',
  },
  sidebarFooter: {
    padding: '16px 20px',
    borderTop: '1px solid #334155',
  },
  userInfo: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  logoutBtn: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#f87171',
    border: '1px solid #f87171',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 32,
    overflowY: 'auto' as const,
  },
  globalReset: {},
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const navItems = [
  { to: '/dashboard', label: 'Panel principal' },
  { to: '/approvals', label: 'Aprobaciones' },
  { to: '/reports', label: 'Reportes' },
  { to: '/users', label: 'Usuarios' },
  { to: '/content', label: 'Contenido' },
];

export default function App() {
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

  if (!isAuthenticated()) {
    return (
      <>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        `}</style>
        <Routes>
          <Route path="/login" element={<Login onLogin={forceUpdate} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  const user = getCurrentUser();

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        a.nav-link { display: block; padding: 12px 20px; color: #cbd5e1; text-decoration: none; font-size: 14px; transition: background-color 0.15s; }
        a.nav-link:hover { background-color: #334155; color: #fff; }
        a.nav-link.active { background-color: #334155; color: #fff; border-right: 3px solid #2563eb; }
        .logout-btn:hover { background-color: #f87171 !important; color: #fff !important; }
      `}</style>
      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h1 style={styles.sidebarTitle}>Admin Panel</h1>
            <div style={styles.sidebarSubtitle}>Social Building Management</div>
          </div>
          <nav style={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div style={styles.sidebarFooter}>
            {user && (
              <div style={styles.userInfo}>
                {user.firstName} {user.lastName}
              </div>
            )}
            <button
              className="logout-btn"
              style={styles.logoutBtn}
              onClick={logout}
            >
              Cerrar sesion
            </button>
          </div>
        </aside>
        <main style={styles.content}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/approvals" element={<PendingApprovals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
