/* Satu lapisan API untuk seluruh halaman.
   Sekarang: mock API (SQLite demo di localStorage).
   Nanti: ubah VITE_USE_MOCK=false dan isi VITE_API_BASE=http://localhost:3000/api
   lalu backend Node.js/Express + SQLite yang nyata akan dipakai tanpa mengubah komponen. */
import { mockApi } from './mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

const httpApi = {
  getReturns: () => request('/returns'),
  saveReturnDraft: payload => request(`/returns/${payload.id}/draft`, { method: 'POST', body: JSON.stringify(payload) }),
  completeReturn: payload => request(`/returns/${payload.id}/complete`, { method: 'POST', body: JSON.stringify(payload) }),
  getRentals: () => request('/rentals'),
  getMotors: () => request('/motors'),
  health: () => request('/health'),
  resetDemo: () => request('/demo/reset', { method: 'POST' })
};

export const api = USE_MOCK ? mockApi : httpApi;
export const API_MODE = USE_MOCK ? 'Demo SQLite (mock API)' : `Node.js API (${API_BASE})`;
