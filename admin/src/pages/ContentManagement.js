import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../services/api';
const styles = {
    header: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: 24,
    },
    tabs: {
        display: 'flex',
        gap: 0,
        marginBottom: 24,
        borderBottom: '2px solid #e2e8f0',
    },
    tab: {
        padding: '12px 24px',
        fontSize: 14,
        fontWeight: 600,
        color: '#64748b',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        cursor: 'pointer',
        marginBottom: -2,
        transition: 'color 0.15s, border-color 0.15s',
    },
    tabActive: {
        color: '#2563eb',
        borderBottomColor: '#2563eb',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    },
    th: {
        textAlign: 'left',
        padding: '14px 16px',
        fontSize: 12,
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #e2e8f0',
    },
    td: {
        padding: '14px 16px',
        fontSize: 14,
        color: '#334155',
        borderBottom: '1px solid #f1f5f9',
    },
    btnHide: {
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: '#d97706',
        backgroundColor: '#fef3c7',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        marginRight: 8,
    },
    btnDelete: {
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#dc2626',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
    },
    empty: {
        textAlign: 'center',
        padding: 48,
        color: '#94a3b8',
        fontSize: 15,
    },
};
const tabConfig = [
    { key: 'posts', label: 'Publicaciones', endpoint: '/posts' },
    { key: 'recommendations', label: 'Recomendaciones', endpoint: '/recommendations' },
    { key: 'entrepreneurs', label: 'Emprendedores', endpoint: '/entrepreneurs' },
];
const formatDate = (dateStr) => {
    try {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
    catch {
        return dateStr;
    }
};
function ContentTable({ endpoint, tabKey }) {
    const { data, isLoading } = useQuery({
        queryKey: [tabKey],
        queryFn: () => apiFetch(endpoint),
    });
    const items = data?.data ?? [];
    if (isLoading) {
        return _jsx("div", { style: styles.empty, children: "Cargando..." });
    }
    if (items.length === 0) {
        return _jsx("div", { style: styles.empty, children: "No hay contenido disponible" });
    }
    const getTitle = (item) => {
        return item.title || item.name || item.businessName || item.content?.substring(0, 60) || '\u2014';
    };
    const getAuthor = (item) => {
        if (item.author) {
            if (typeof item.author === 'string')
                return item.author;
            return `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim();
        }
        if (item.user) {
            if (typeof item.user === 'string')
                return item.user;
            return `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim();
        }
        return '\u2014';
    };
    const getStatus = (item) => {
        if (item.status)
            return item.status;
        if (item.isActive === false)
            return 'Inactivo';
        return 'Activo';
    };
    return (_jsxs("table", { style: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: styles.th, children: "Titulo / Nombre" }), _jsx("th", { style: styles.th, children: "Autor" }), _jsx("th", { style: styles.th, children: "Estado" }), _jsx("th", { style: styles.th, children: "Fecha" }), _jsx("th", { style: styles.th, children: "Acciones" })] }) }), _jsx("tbody", { children: items.map((item) => (_jsxs("tr", { children: [_jsx("td", { style: styles.td, children: getTitle(item) }), _jsx("td", { style: styles.td, children: getAuthor(item) }), _jsx("td", { style: styles.td, children: getStatus(item) }), _jsx("td", { style: styles.td, children: formatDate(item.createdAt) }), _jsxs("td", { style: styles.td, children: [_jsx("button", { style: styles.btnHide, onClick: () => alert('Funcionalidad de ocultar pendiente de implementacion'), children: "Ocultar" }), _jsx("button", { style: styles.btnDelete, onClick: () => alert('Funcionalidad de eliminar pendiente de implementacion'), children: "Eliminar" })] })] }, item.id))) })] }));
}
export default function ContentManagement() {
    const [activeTab, setActiveTab] = useState('posts');
    const activeConfig = tabConfig.find((t) => t.key === activeTab);
    return (_jsxs("div", { children: [_jsx("h1", { style: styles.header, children: "Gestion de contenido" }), _jsx("div", { style: styles.tabs, children: tabConfig.map((tab) => (_jsx("button", { style: {
                        ...styles.tab,
                        ...(activeTab === tab.key ? styles.tabActive : {}),
                    }, onClick: () => setActiveTab(tab.key), children: tab.label }, tab.key))) }), _jsx(ContentTable, { endpoint: activeConfig.endpoint, tabKey: activeConfig.key }, activeConfig.key), _jsx("style", { children: `
        table tbody tr:hover { background-color: #f8fafc; }
      ` })] }));
}
