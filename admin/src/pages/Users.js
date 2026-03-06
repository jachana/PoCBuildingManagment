import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../services/api';
const styles = {
    header: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: 24,
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
    badge: {
        display: 'inline-block',
        padding: '3px 10px',
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 20,
    },
    btnBlock: {
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#dc2626',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
    },
    btnUnblock: {
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#16a34a',
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
const roleBadgeColors = {
    ADMIN: { bg: '#ede9fe', color: '#7c3aed' },
    USER: { bg: '#e0f2fe', color: '#0284c7' },
    ENTREPRENEUR: { bg: '#fef3c7', color: '#d97706' },
};
const statusBadgeColors = {
    APPROVED: { bg: '#dcfce7', color: '#16a34a', label: 'Aprobado' },
    PENDING: { bg: '#fef9c3', color: '#ca8a04', label: 'Pendiente' },
    BLOCKED: { bg: '#fee2e2', color: '#dc2626', label: 'Bloqueado' },
    REJECTED: { bg: '#f1f5f9', color: '#64748b', label: 'Rechazado' },
};
export default function Users() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => apiFetch('/users'),
    });
    const blockMutation = useMutation({
        mutationFn: (userId) => apiFetch(`/admin/block/${userId}`, { method: 'POST' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
    const unblockMutation = useMutation({
        mutationFn: (userId) => apiFetch(`/admin/unblock/${userId}`, { method: 'POST' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
    const users = data?.data ?? [];
    const getUserStatus = (user) => {
        if (user.status)
            return user.status;
        if (user.isBlocked)
            return 'BLOCKED';
        if (user.isApproved)
            return 'APPROVED';
        return 'PENDING';
    };
    const isBlocked = (user) => {
        return user.isBlocked === true || user.status === 'BLOCKED';
    };
    return (_jsxs("div", { children: [_jsx("h1", { style: styles.header, children: "Usuarios" }), isLoading ? (_jsx("div", { style: styles.empty, children: "Cargando..." })) : users.length === 0 ? (_jsx("div", { style: styles.empty, children: "No hay usuarios registrados" })) : (_jsxs("table", { style: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: styles.th, children: "Nombre" }), _jsx("th", { style: styles.th, children: "Email" }), _jsx("th", { style: styles.th, children: "Unidad" }), _jsx("th", { style: styles.th, children: "Rol" }), _jsx("th", { style: styles.th, children: "Estado" }), _jsx("th", { style: styles.th, children: "Acciones" })] }) }), _jsx("tbody", { children: users.map((user) => {
                            const status = getUserStatus(user);
                            const roleColors = roleBadgeColors[user.role] || { bg: '#f1f5f9', color: '#64748b' };
                            const statusInfo = statusBadgeColors[status] || {
                                bg: '#f1f5f9',
                                color: '#64748b',
                                label: status,
                            };
                            return (_jsxs("tr", { children: [_jsxs("td", { style: styles.td, children: [user.firstName, " ", user.lastName] }), _jsx("td", { style: styles.td, children: user.email }), _jsx("td", { style: styles.td, children: user.unit || user.apartmentNumber || '\u2014' }), _jsx("td", { style: styles.td, children: _jsx("span", { style: {
                                                ...styles.badge,
                                                backgroundColor: roleColors.bg,
                                                color: roleColors.color,
                                            }, children: user.role }) }), _jsx("td", { style: styles.td, children: _jsx("span", { style: {
                                                ...styles.badge,
                                                backgroundColor: statusInfo.bg,
                                                color: statusInfo.color,
                                            }, children: statusInfo.label }) }), _jsx("td", { style: styles.td, children: user.role !== 'ADMIN' && (isBlocked(user) ? (_jsx("button", { style: styles.btnUnblock, onClick: () => unblockMutation.mutate(user.id), disabled: unblockMutation.isPending, children: "Desbloquear" })) : (_jsx("button", { style: styles.btnBlock, onClick: () => blockMutation.mutate(user.id), disabled: blockMutation.isPending, children: "Bloquear" }))) })] }, user.id));
                        }) })] })), _jsx("style", { children: `
        table tbody tr:hover { background-color: #f8fafc; }
      ` })] }));
}
