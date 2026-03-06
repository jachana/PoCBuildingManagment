import { apiFetch } from './api';
import { CreateReportData } from '@/models/report';

export function createReport(data: CreateReportData) {
  return apiFetch('/reports', { method: 'POST', body: JSON.stringify(data) });
}
