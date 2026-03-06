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
    btnApprove: {
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#16a34a',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        marginRight: 8,
    },
    btnReject: {
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
    loading: {
        textAlign: 'center',
        padding: 48,
        color: '#94a3b8',
        fontSize: 15,
    },
};
export default function PendingApprovals() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['pending-approvals'],
        queryFn: () => apiFetch('/admin/pending-approvals'),
    });
    const approveMutation = useMutation({
        mutationFn: (userId) => apiFetch(`/admin/approve/${userId}`, { method: 'POST' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-approvals'] }),
    });
    const rejectMutation = useMutation({
        mutationFn: (userId) => apiFetch(`/admin/reject/${userId}`, { method: 'POST' }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-approvals'] }),
    });
    const users = data?.data ?? [];
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
    return (_jsxs("div", { children: [_jsx("h1", { style: styles.header, children: "Aprobaciones pendientes" }), isLoading ? (_jsx("div", { style: styles.loading, children: "Cargando..." })) : users.length === 0 ? (_jsx("div", { style: styles.empty, children: "No hay usuarios pendientes" })) : (_jsxs("table", { style: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: styles.th, children: "Nombre" }), _jsx("th", { style: styles.th, children: "Email" }), _jsx("th", { style: styles.th, children: "Unidad" }), _jsx("th", { style: styles.th, children: "Fecha registro" }), _jsx("th", { style: styles.th, children: "Acciones" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { style: { transition: 'background-color 0.15s' }, children: [_jsxs("td", { style: styles.td, children: [user.firstName, " ", user.lastName] }), _jsx("td", { style: styles.td, children: user.email }), _jsx("td", { style: styles.td, children: user.unit || user.apartmentNumber || '\u2014' }), _jsx("td", { style: styles.td, children: formatDate(user.createdAt) }), _jsxs("td", { style: styles.td, children: [_jsx("button", { style: styles.btnApprove, onClick: () => approveMutation.mutate(user.id), disabled: approveMutation.isPending, children: "Aprobar" }), _jsx("button", { style: styles.btnReject, onClick: () => rejectMutation.mutate(user.id), disabled: rejectMutation.isPending, children: "Rechazar" })] })] }, user.id))) })] })), _jsx("style", { children: `
        table tbody tr:hover { background-color: #f8fafc; }
      ` })] }));
}
