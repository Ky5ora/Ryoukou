/* Mock API - meniru endpoint Node.js/Express dengan penyimpanan localStorage.
   Bentuk data mengikuti tabel SQLite pada docs/ARSITEKTUR_REACT_NODEJS.md. */
import { returnsSeed, rentalsSeed, motorsSeed } from '../data/seed';

const DB_KEY = 'ryokou_react_sqlite_demo_v1';

function readDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* abaikan */ }
  const fresh = {
    returns: structuredClone(returnsSeed),
    rentals: structuredClone(rentalsSeed),
    motors: structuredClone(motorsSeed),
    activity_logs: []
  };
  writeDb(fresh);
  return fresh;
}

function writeDb(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { /* storage penuh */ }
}

const delay = value => Promise.resolve(structuredClone(value));

export const mockApi = {
  // GET /api/returns
  async getReturns() { return delay(readDb().returns); },

  // POST /api/returns/:id/draft
  async saveReturnDraft(payload) {
    const db = readDb();
    const i = db.returns.findIndex(r => r.id === payload.id);
    if (i >= 0) {
      const { status, ...safe } = payload; // status hanya diubah oleh complete
      db.returns[i] = { ...db.returns[i], ...safe };
    }
    writeDb(db);
    return delay(payload);
  },

  // POST /api/returns/:id/complete
  async completeReturn(payload) {
    const db = readDb();
    const i = db.returns.findIndex(r => r.id === payload.id);
    if (i >= 0) db.returns[i] = { ...db.returns[i], ...payload, status: 'Selesai' };
    const motor = db.motors.find(m => m.plate === payload.plate);
    if (motor) motor.status = payload.condition === 'Baik' ? 'Tersedia' : 'Perbaikan';
    db.activity_logs.push({ aksi: 'pengembalian_selesai', entity: 'return', entity_id: payload.id, created_at: new Date().toISOString() });
    writeDb(db);
    return delay(payload);
  },

  // GET /api/rentals
  async getRentals() { return delay(readDb().rentals); },

  // GET /api/motors
  async getMotors() { return delay(readDb().motors); },

  // GET /api/health (dipakai UI untuk menandakan mode demo)
  async health() { return { mode: 'mock-sqlite-demo', version: '0.1.0' }; },

  // Dipakai tombol "Reset data demo" di pengaturan.
  async resetDemo() {
    localStorage.removeItem(DB_KEY);
    return this.health();
  }
};
