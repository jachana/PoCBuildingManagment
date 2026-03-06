import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../services/api';

const styles: Record<string, React.CSSProperties> = {
  header: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 24,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  th: {
    textAlign: 'left' as const,
    padding: '14px 16px',
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
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
    textAlign: 'center' as const,
    padding: 48,
    color: '#94a3b8',
    fontSize: 15,
  },
  loading: {
    textAlign: 'center' as const,
    padding: 48,
    color: '#94a3b8',
    fontSize: 15,
  },
};

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  unit?: string;
  apartmentNumber?: string;
  createdAt: string;
}

export default function PendingApprovals() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => apiFetch<{ data: User[]; meta: any }>('/admin/pending-approvals'),
  });

  const approveMutation = useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/admin/approve/${userId}`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-approvals'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/admin/reject/${userId}`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-approvals'] }),
  });

  const users = data?.data ?? [];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <h1 style={styles.header}>Aprobaciones pendientes</h1>

      {isLoading ? (
        <div style={styles.loading}>Cargando...</div>
      ) : users.length === 0 ? (
        <div style={styles.empty}>No hay usuarios pendientes</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Unidad</th>
              <th style={styles.th}>Fecha registro</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ transition: 'background-color 0.15s' }}>
                <td style={styles.td}>
                  {user.firstName} {user.lastName}
                </td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.unit || user.apartmentNumber || '\u2014'}</td>
                <td style={styles.td}>{formatDate(user.createdAt)}</td>
                <td style={styles.td}>
                  <button
                    style={styles.btnApprove}
                    onClick={() => approveMutation.mutate(user.id)}
                    disabled={approveMutation.isPending}
                  >
                    Aprobar
                  </button>
                  <button
                    style={styles.btnReject}
                    onClick={() => rejectMutation.mutate(user.id)}
                    disabled={rejectMutation.isPending}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>{`
        table tbody tr:hover { background-color: #f8fafc; }
      `}</style>
    </div>
  );
}
