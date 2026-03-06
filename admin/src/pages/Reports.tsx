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
    textAlign: 'center' as const,
    padding: 48,
    color: '#94a3b8',
    fontSize: 15,
  },
};

const reasonLabels: Record<string, string> = {
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

const contentTypeLabels: Record<string, string> = {
  POST: 'Publicacion',
  COMMENT: 'Comentario',
  USER: 'Usuario',
  RECOMMENDATION: 'Recomendacion',
  MESSAGE: 'Mensaje',
};

interface Report {
  id: string;
  contentType: string;
  reason: string;
  description?: string;
  reportedBy?: { firstName: string; lastName: string } | string;
  reporter?: { firstName: string; lastName: string };
  createdAt: string;
  status?: string;
}

export default function Reports() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<{ data: Report[]; meta: any }>('/admin/reports'),
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'REVIEW' | 'DISMISS' }) =>
      apiFetch(`/admin/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reports'] }),
  });

  const reports = data?.data ?? [];

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

  const getReporterName = (report: Report): string => {
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

  return (
    <div>
      <h1 style={styles.header}>Reportes</h1>

      {isLoading ? (
        <div style={styles.empty}>Cargando...</div>
      ) : reports.length === 0 ? (
        <div style={styles.empty}>No hay reportes pendientes</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tipo contenido</th>
              <th style={styles.th}>Razon</th>
              <th style={styles.th}>Descripcion</th>
              <th style={styles.th}>Reportado por</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td style={styles.td}>
                  {contentTypeLabels[report.contentType] || report.contentType}
                </td>
                <td style={styles.td}>
                  {reasonLabels[report.reason] || report.reason}
                </td>
                <td style={styles.td}>{report.description || '\u2014'}</td>
                <td style={styles.td}>{getReporterName(report)}</td>
                <td style={styles.td}>{formatDate(report.createdAt)}</td>
                <td style={styles.td}>
                  <button
                    style={styles.btnReview}
                    onClick={() => actionMutation.mutate({ id: report.id, action: 'REVIEW' })}
                    disabled={actionMutation.isPending}
                  >
                    Revisar
                  </button>
                  <button
                    style={styles.btnDismiss}
                    onClick={() => actionMutation.mutate({ id: report.id, action: 'DISMISS' })}
                    disabled={actionMutation.isPending}
                  >
                    Descartar
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
