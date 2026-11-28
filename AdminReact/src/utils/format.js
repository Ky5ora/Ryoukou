export const money = (n = 0) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

export const pad = n => String(n).padStart(2, '0');

export function fmtDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}.${pad(d.getMinutes())}`;
}

export function fmtDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export const toneForStatus = status => ({
  'Terjadwal': 'blue', 'Menunggu Pemeriksaan': 'gold', 'Dalam Pemeriksaan': 'blue',
  'Selesai': 'green', 'Terlambat': 'red', 'Dibatalkan': 'red', 'Dalam Penyewaan': 'gold',
  'Menunggu Verifikasi': 'gold', 'Tersedia': 'green', 'Disewa': 'gold', 'Perbaikan': 'red',
  'Lunas': 'green', 'Belum Lunas': 'gold'
}[status] || 'gray');

// Aturan bisnis RYOKOU: pembulatan keterlambatan ke atas per jam.
export function hitungDenda(deadline, actual, tarifPerJam = 0, luarWilayah = false, biayaKerusakan = 0) {
  let hours = 0;
  if (deadline && actual) {
    const diff = new Date(actual).getTime() - new Date(deadline).getTime();
    if (Number.isFinite(diff) && diff > 0) hours = Math.ceil(diff / 3600000);
  }
  const keterlambatan = hours * Number(tarifPerJam || 0);
  const wilayah = luarWilayah ? 300000 : 0;
  const kerusakan = Math.max(0, Number(biayaKerusakan || 0));
  return {
    hours,
    keterlambatan,
    wilayah,
    kerusakan,
    total: keterlambatan + wilayah + kerusakan
  };
}

export function downloadCsv(filename, header, rows) {
  const sep = '\u0001';
  const lines = [header.join(sep), ...rows.map(r => r.map(v => String(v ?? '').replace(/\t|\n/g, ' ')).join(sep))];
  const blob = new Blob(['\ufeff' + lines.join('\n').replaceAll(sep, ';')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
