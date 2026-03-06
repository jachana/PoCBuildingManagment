import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PendingApprovals from './pages/PendingApprovals';
import Reports from './pages/Reports';
import Users from './pages/Users';
import ContentManagement from './pages/ContentManagement';
const styles = {
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
        overflowY: 'auto',
    },
    globalReset: {},
};
function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
const navItems = [
    { to: '/dashboard', label: 'Panel principal' },
    { to: '/approvals', label: 'Aprobaciones' },
    { to: '/reports', label: 'Reportes' },
    { to: '/users', label: 'Usuarios' },
    { to: '/content', label: 'Contenido' },
];
export default function App() {
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    if (!isAuthenticated()) {
        return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        ` }), _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, { onLogin: forceUpdate }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] })] }));
    }
    const user = getCurrentUser();
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        a.nav-link { display: block; padding: 12px 20px; color: #cbd5e1; text-decoration: none; font-size: 14px; transition: background-color 0.15s; }
        a.nav-link:hover { background-color: #334155; color: #fff; }
        a.nav-link.active { background-color: #334155; color: #fff; border-right: 3px solid #2563eb; }
        .logout-btn:hover { background-color: #f87171 !important; color: #fff !important; }
      ` }), _jsxs("div", { style: styles.layout, children: [_jsxs("aside", { style: styles.sidebar, children: [_jsxs("div", { style: styles.sidebarHeader, children: [_jsx("h1", { style: styles.sidebarTitle, children: "Admin Panel" }), _jsx("div", { style: styles.sidebarSubtitle, children: "Social Building Management" })] }), _jsx("nav", { style: styles.nav, children: navItems.map((item) => (_jsx(NavLink, { to: item.to, className: ({ isActive }) => `nav-link${isActive ? ' active' : ''}`, children: item.label }, item.to))) }), _jsxs("div", { style: styles.sidebarFooter, children: [user && (_jsxs("div", { style: styles.userInfo, children: [user.firstName, " ", user.lastName] })), _jsx("button", { className: "logout-btn", style: styles.logoutBtn, onClick: logout, children: "Cerrar sesion" })] })] }), _jsx("main", { style: styles.content, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/approvals", element: _jsx(PendingApprovals, {}) }), _jsx(Route, { path: "/reports", element: _jsx(Reports, {}) }), _jsx(Route, { path: "/users", element: _jsx(Users, {}) }), _jsx(Route, { path: "/content", element: _jsx(ContentManagement, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) })] })] }));
}
