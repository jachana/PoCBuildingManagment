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
    btnReview: {
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#2563eb',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        marginRight: 8,
    },
    btnDismiss: {
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: '#64748b',
        backgroundColor: '#e2e8f0',
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
const reasonLabels = {
    SPAM: 'Spam',
    HARASSMENT: 'Acoso',
    INAPPROPRIATE: 'Contenido inapropiado',
    VIOLENCE: 'Violencia',
    HATE_SPEECH: 'Discurso de odio',
    MISINFORMATION: 'Desinformacion',
    OTHER: 'Otro',
    SCAM: 'Estafa',
    OFFENSIVE: 'Ofensivo',
};
const contentTypeLabels = {
    POST: 'Publicacion',
    COMMENT: 'Comentario',
    USER: 'Usuario',
    RECOMMENDATION: 'Recomendacion',
    MESSAGE: 'Mensaje',
};
export default function Reports() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: () => apiFetch('/admin/reports'),
    });
    const actionMutation = useMutation({
        mutationFn: ({ id, action }) => apiFetch(`/admin/reports/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ action }),
        }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
    });
    const reports = data?.data ?? [];
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
    const getReporterName = (report) => {
        if (report.reporter) {
            return `${report.reporter.firstName} ${report.reporter.lastName}`;
        }
        if (typeof report.reportedBy === 'object' && report.reportedBy) {
            return `${report.reportedBy.firstName} ${report.reportedBy.lastName}`;
        }
        if (typeof report.reportedBy === 'string') {
            return report.reportedBy;
        }
        return '\u2014';
    };
    return (_jsxs("div", { children: [_jsx("h1", { style: styles.header, children: "Reportes" }), isLoading ? (_jsx("div", { style: styles.empty, children: "Cargando..." })) : reports.length === 0 ? (_jsx("div", { style: styles.empty, children: "No hay reportes pendientes" })) : (_jsxs("table", { style: styles.table, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: styles.th, children: "Tipo contenido" }), _jsx("th", { style: styles.th, children: "Razon" }), _jsx("th", { style: styles.th, children: "Descripcion" }), _jsx("th", { style: styles.th, children: "Reportado por" }), _jsx("th", { style: styles.th, children: "Fecha" }), _jsx("th", { style: styles.th, children: "Acciones" })] }) }), _jsx("tbody", { children: reports.map((report) => (_jsxs("tr", { children: [_jsx("td", { style: styles.td, children: contentTypeLabels[report.contentType] || report.contentType }), _jsx("td", { style: styles.td, children: reasonLabels[report.reason] || report.reason }), _jsx("td", { style: styles.td, children: report.description || '\u2014' }), _jsx("td", { style: styles.td, children: getReporterName(report) }), _jsx("td", { style: styles.td, children: formatDate(report.createdAt) }), _jsxs("td", { style: styles.td, children: [_jsx("button", { style: styles.btnReview, onClick: () => actionMutation.mutate({ id: report.id, action: 'REVIEW' }), disabled: actionMutation.isPending, children: "Revisar" }), _jsx("button", { style: styles.btnDismiss, onClick: () => actionMutation.mutate({ id: report.id, action: 'DISMISS' }), disabled: actionMutation.isPending, children: "Descartar" })] })] }, report.id))) })] })), _jsx("style", { children: `
        table tbody tr:hover { background-color: #f8fafc; }
      ` })] }));
}
