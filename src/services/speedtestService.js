// src/services/speedtestService.js

// Base: tomada del .env, sin barras al final
const BASE = (import.meta.env.VITE_SPEEDTEST_API_URL || "").replace(/\/+$/, "");
if (!BASE) throw new Error("Falta VITE_SPEEDTEST_API_URL");

const HEALTH_URL = `${BASE}/health`;
const DL_URL     = `${BASE}/speedtest/download`;
const UL_URL     = `${BASE}/speedtest/upload`;

// Utilidad: timeout para fetch
async function fetchWithTimeout(url, { timeoutMs = 60000, ...opts } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

// bps a Mbps
const toMbps = (bytes, ms) => (bytes * 8) / (ms / 1000) / 1_000_000;

// Ejecuta el test desde el navegador del usuario
export async function ejecutarSpeedtest({
  downloadMB = 25,   // tamaño de descarga
  uploadMB   = 10,   // tamaño de subida
  timeoutMs  = 60000
} = {}) {
  // 1) Latencia (ping) contra el backend
  const t0 = performance.now();
  await fetchWithTimeout(HEALTH_URL, { timeoutMs });
  const latency = performance.now() - t0;

  // 2) Descarga: consumimos el stream por completo
  const t1 = performance.now();
  const r = await fetchWithTimeout(`${DL_URL}?size=${encodeURIComponent(downloadMB)}`, { timeoutMs });
  if (!r.ok) throw new Error(`HTTP ${r.status} en descarga`);
  const reader = r.body.getReader();
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;
  }
  const t2 = performance.now();
  const downloadSpeed = toMbps(received, t2 - t1);

  // 3) Subida: enviamos un buffer de uploadMB
  const payload = new Uint8Array(uploadMB * 1024 * 1024); // zeros (liviano para CPU)
  const u1 = performance.now();
  const upRes = await fetchWithTimeout(UL_URL, {
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/octet-stream" },
    timeoutMs
  });
  if (!upRes.ok) throw new Error(`HTTP ${upRes.status} en subida`);
  const u2 = performance.now();
  const uploadSpeed = toMbps(payload.byteLength, u2 - u1);

  return {
    downloadSpeed: Number(downloadSpeed.toFixed(2)),
    uploadSpeed:   Number(uploadSpeed.toFixed(2)),
    latency:       Number(latency.toFixed(2))
  };
}
