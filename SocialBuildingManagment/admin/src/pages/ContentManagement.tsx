import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../services/api';

const styles: Record<string, React.CSSProperties> = {
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
    textAlign: 'center' as const,
    padding: 48,
    color: '#94a3b8',
    fontSize: 15,
  },
};

type TabKey = 'posts' | 'recommendations' | 'entrepreneurs';

const tabConfig: { key: TabKey; label: string; endpoint: string }[] = [
  { key: 'posts', label: 'Publicaciones', endpoint: '/posts' },
  { key: 'recommendations', label: 'Recomendaciones', endpoint: '/recommendations' },
  { key: 'entrepreneurs', label: 'Emprendedores', endpoint: '/entrepreneurs' },
];

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

function ContentTable({ endpoint, tabKey }: { endpoint: string; tabKey: TabKey }) {
  const { data, isLoading } = useQuery({
    queryKey: [tabKey],
    queryFn: () => apiFetch<{ data: any[]; meta: any }>(endpoint),
  });

  const items = data?.data ?? [];

  if (isLoading) {
    return <div style={styles.empty}>Cargando...</div>;
  }

  if (items.length === 0) {
    return <div style={styles.empty}>No hay contenido disponible</div>;
  }

  const getTitle = (item: any): string => {
    return item.title || item.name || item.businessName || item.content?.substring(0, 60) || '\u2014';
  };

  const getAuthor = (item: any): string => {
    if (item.author) {
      if (typeof item.author === 'string') return item.author;
      return `${item.author.firstName || ''} ${item.author.lastName || ''}`.trim();
    }
    if (item.user) {
      if (typeof item.user === 'string') return item.user;
      return `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim();
    }
    return '\u2014';
  };

  const getStatus = (item: any): string => {
    if (item.status) return item.status;
    if (item.isActive === false) return 'Inactivo';
    return 'Activo';
  };

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Titulo / Nombre</th>
          <th style={styles.th}>Autor</th>
          <th style={styles.th}>Estado</th>
          <th style={styles.th}>Fecha</th>
          <th style={styles.th}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item: any) => (
          <tr key={item.id}>
            <td style={styles.td}>{getTitle(item)}</td>
            <td style={styles.td}>{getAuthor(item)}</td>
            <td style={styles.td}>{getStatus(item)}</td>
            <td style={styles.td}>{formatDate(item.createdAt)}</td>
            <td style={styles.td}>
              <button
                style={styles.btnHide}
                onClick={() => alert('Funcionalidad de ocultar pendiente de implementacion')}
              >
                Ocultar
              </button>
              <button
                style={styles.btnDelete}
                onClick={() => alert('Funcionalidad de eliminar pendiente de implementacion')}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<TabKey>('posts');

  const activeConfig = tabConfig.find((t) => t.key === activeTab)!;

  return (
    <div>
      <h1 style={styles.header}>Gestion de contenido</h1>

      <div style={styles.tabs}>
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ContentTable
        key={activeConfig.key}
        endpoint={activeConfig.endpoint}
        tabKey={activeConfig.key}
      />

      <style>{`
        table tbody tr:hover { background-color: #f8fafc; }
      `}</style>
    </div>
  );
}
