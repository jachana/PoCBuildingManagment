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
    textAlign: 'center' as const,
    padding: 48,
    color: '#94a3b8',
    fontSize: 15,
  },
};

const roleBadgeColors: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: '#ede9fe', color: '#7c3aed' },
  USER: { bg: '#e0f2fe', color: '#0284c7' },
  ENTREPRENEUR: { bg: '#fef3c7', color: '#d97706' },
};

const statusBadgeColors: Record<string, { bg: string; color: string; label: string }> = {
  APPROVED: { bg: '#dcfce7', color: '#16a34a', label: 'Aprobado' },
  PENDING: { bg: '#fef9c3', color: '#ca8a04', label: 'Pendiente' },
  BLOCKED: { bg: '#fee2e2', color: '#dc2626', label: 'Bloqueado' },
  REJECTED: { bg: '#f1f5f9', color: '#64748b', label: 'Rechazado' },
};

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  unit?: string;
  apartmentNumber?: string;
  role: string;
  status?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
}

export default function Users() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch<{ data: User[]; meta: any }>('/users'),
  });

  const blockMutation = useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/admin/block/${userId}`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const unblockMutation = useMutation({
    mutationFn: (userId: string) =>
      apiFetch(`/admin/unblock/${userId}`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const users = data?.data ?? [];

  const getUserStatus = (user: User): string => {
    if (user.status) return user.status;
    if (user.isBlocked) return 'BLOCKED';
    if (user.isApproved) return 'APPROVED';
    return 'PENDING';
  };

  const isBlocked = (user: User): boolean => {
    return user.isBlocked === true || user.status === 'BLOCKED';
  };

  return (
    <div>
      <h1 style={styles.header}>Usuarios</h1>

      {isLoading ? (
        <div style={styles.empty}>Cargando...</div>
      ) : users.length === 0 ? (
        <div style={styles.empty}>No hay usuarios registrados</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Unidad</th>
              <th style={styles.th}>Rol</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const status = getUserStatus(user);
              const roleColors = roleBadgeColors[user.role] || { bg: '#f1f5f9', color: '#64748b' };
              const statusInfo = statusBadgeColors[status] || {
                bg: '#f1f5f9',
                color: '#64748b',
                label: status,
              };

              return (
                <tr key={user.id}>
                  <td style={styles.td}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.unit || user.apartmentNumber || '\u2014'}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: roleColors.bg,
                        color: roleColors.color,
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {user.role !== 'ADMIN' && (
                      isBlocked(user) ? (
                        <button
                          style={styles.btnUnblock}
                          onClick={() => unblockMutation.mutate(user.id)}
                          disabled={unblockMutation.isPending}
                        >
                          Desbloquear
                        </button>
                      ) : (
                        <button
                          style={styles.btnBlock}
                          onClick={() => blockMutation.mutate(user.id)}
                          disabled={blockMutation.isPending}
                        >
                          Bloquear
                        </button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <style>{`
        table tbody tr:hover { background-color: #f8fafc; }
      `}</style>
    </div>
  );
}
