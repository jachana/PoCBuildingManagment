import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../services/api';

const styles: Record<string, React.CSSProperties> = {
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

interface CardData {
  label: string;
  value: string | number;
  color: string;
}

export default function Dashboard() {
  const { data: approvals, isLoading: loadingApprovals } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => apiFetch<{ data: any[]; meta: any }>('/admin/pending-approvals'),
  });

  const { data: reports, isLoading: loadingReports } = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<{ data: any[]; meta: any }>('/admin/reports'),
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch<{ data: any[]; meta: any }>('/users'),
  });

  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => apiFetch<{ data: any[]; meta: any }>('/posts'),
  });

  const cards: CardData[] = [
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

  return (
    <div>
      <h1 style={styles.header}>Panel principal</h1>
      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.label} style={styles.card}>
            <div style={styles.cardLabel}>{card.label}</div>
            <div style={{ ...styles.cardValue, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
