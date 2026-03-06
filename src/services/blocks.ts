import { apiFetch } from './api';

export function blockUser(blockedUserId: string) {
  return apiFetch('/blocks', { method: 'POST', body: JSON.stringify({ blockedUserId }) });
}

export function unblockUser(blockedUserId: string) {
  return apiFetch(`/blocks/${blockedUserId}`, { method: 'DELETE' });
}

export function getBlocks() {
  return apiFetch<{ id: string; blockedUserId: string }[]>('/blocks');
}
