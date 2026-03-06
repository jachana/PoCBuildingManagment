import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../services/api';
const styles = {
    header: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: 32,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
    },
    cardLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: 500,
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 36,
        fontWeight: 700,
        color: '#1e293b',
    },
};
export default function Dashboard() {
    const { data: approvals, isLoading: loadingApprovals } = useQuery({
        queryKey: ['pending-approvals'],
        queryFn: () => apiFetch('/admin/pending-approvals'),
    });
    const { data: reports, isLoading: loadingReports } = useQuery({
        queryKey: ['reports'],
        queryFn: () => apiFetch('/admin/reports'),
    });
    const { data: users, isLoading: loadingUsers } = useQuery({
        queryKey: ['users'],
        queryFn: () => apiFetch('/users'),
    });
    const { data: posts, isLoading: loadingPosts } = useQuery({
        queryKey: ['posts'],
        queryFn: () => apiFetch('/posts'),
    });
    const cards = [
        {
            label: 'Aprobaciones pendientes',
            value: loadingApprovals ? '\u2014' : approvals?.meta?.total ?? approvals?.data?.length ?? '\u2014',
            color: '#f59e0b',
        },
        {
            label: 'Reportes abiertos',
            value: loadingReports ? '\u2014' : reports?.meta?.total ?? reports?.data?.length ?? '\u2014',
            color: '#dc2626',
        },
        {
            label: 'Usuarios totales',
            value: loadingUsers ? '\u2014' : users?.meta?.total ?? users?.data?.length ?? '\u2014',
            color: '#2563eb',
        },
        {
            label: 'Publicaciones activas',
            value: loadingPosts ? '\u2014' : posts?.meta?.total ?? posts?.data?.length ?? '\u2014',
            color: '#16a34a',
        },
    ];
    return (_jsxs("div", { children: [_jsx("h1", { style: styles.header, children: "Panel principal" }), _jsx("div", { style: styles.grid, children: cards.map((card) => (_jsxs("div", { style: styles.card, children: [_jsx("div", { style: styles.cardLabel, children: card.label }), _jsx("div", { style: { ...styles.cardValue, color: card.color }, children: card.value })] }, card.label))) })] }));
}
