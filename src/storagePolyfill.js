/**
 * Polyfill for `window.storage`, the key-value API this dashboard was originally
 * built against (Claude Artifacts). Outside Claude.ai that API does not exist,
 * so this file re-implements the same shape — personal data on localStorage
 * (fast, per-device, no setup needed), and SHARED data optionally bridged to a
 * small Google Apps Script "cloud KV store" so it's visible to every teammate,
 * on any device — not just the browser that created it.
 *
 * HOW TO ENABLE REAL CROSS-DEVICE SHARING:
 * Open the dashboard → YOUR SOURCE → "เชื่อมต่อ Cloud Storage (ข้อมูลที่ใช้ร่วมกัน)"
 * and paste in the Apps Script Web App URL (see the setup instructions Claude
 * gave you). Until that's configured, shared data silently falls back to
 * localStorage (per-device only) — the app keeps working either way.
 */

const NS = "salesAuditDashboard";
const CLOUD_URL_KEY = `${NS}:config:cloudStorageUrl`;

function storageKey(key, shared) {
  return `${NS}:${shared ? "shared" : "personal"}:${key}`;
}

/* Default Cloud Storage backend — every device uses this automatically so
   nobody has to manually paste the URL in on each new phone/computer. It can
   still be overridden per-device from YOUR SOURCE if you ever need to point
   at a different backend (e.g. testing a new Apps Script deployment). */
const DEFAULT_CLOUD_URL = "https://script.google.com/macros/s/AKfycbw5xkummk6JOp69L3vkFC8j9O7YJTyT7YDXK_Yy_H_4m_D17BCrN9c5uplYYEndJYMt/exec";

function getCloudUrl() {
  try {
    const stored = localStorage.getItem(CLOUD_URL_KEY);
    if (stored) return stored;
  } catch (e) { /* ignore */ }
  return DEFAULT_CLOUD_URL;
}

/* JSONP GET — the only reliably CORS-free way to read a response back from a
   Google Apps Script Web App from a different origin. */
function jsonpFetch(url, params) {
  return new Promise((resolve, reject) => {
    const cbName = `__ksb_cb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const qs = new URLSearchParams({ ...params, callback: cbName }).toString();
    const script = document.createElement("script");
    const cleanup = () => {
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
      clearTimeout(timer);
    };
    const timer = setTimeout(() => { cleanup(); reject(new Error("cloud storage request timed out")); }, 15000);
    window[cbName] = (data) => { cleanup(); resolve(data); };
    script.src = `${url}?${qs}`;
    script.onerror = () => { cleanup(); reject(new Error("cloud storage request failed")); };
    document.head.appendChild(script);
  });
}

async function cloudGet(key) {
  const url = getCloudUrl();
  if (!url) throw new Error("cloud storage not configured");
  const data = await jsonpFetch(url, { action: "get", key });
  if (!data || data.ok !== true) throw new Error("not found");
  return data.value;
}

async function cloudList(prefix) {
  const url = getCloudUrl();
  if (!url) return [];
  try {
    const data = await jsonpFetch(url, { action: "list", prefix });
    return (data && data.ok && data.keys) || [];
  } catch (e) { return []; }
}

/* Fetches every key AND its value under a prefix in a single round trip —
   used by list() so widgets that do "list keys, then get() each one" (nearly
   all of them) only ever make one network call instead of N+1. */
async function cloudGetMany(prefix) {
  const url = getCloudUrl();
  if (!url) return [];
  try {
    const data = await jsonpFetch(url, { action: "getMany", prefix });
    return (data && data.ok && data.items) || [];
  } catch (e) { return []; }
}

/* Short-lived cache populated by list()'s batch fetch, so the individual
   get() calls that widgets make right after list() resolve instantly from
   memory instead of hitting the network again for every single key. */
const recentCache = new Map();
const RECENT_CACHE_MS = 20000;
function cacheGet(key) {
  const hit = recentCache.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.ts > RECENT_CACHE_MS) { recentCache.delete(key); return undefined; }
  return hit.value;
}
function cacheSet(key, value) {
  recentCache.set(key, { value, ts: Date.now() });
}

function cloudSet(key, value) {
  const url = getCloudUrl();
  if (!url) return;
  cacheSet(key, value);
  // fire-and-forget: Apps Script Web Apps don't reliably expose readable
  // cross-origin responses for POST, so we don't await/read the result here.
  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "set", key, value }),
  }).catch(() => {});
}

function cloudDelete(key) {
  const url = getCloudUrl();
  if (!url) return;
  recentCache.delete(key);
  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "delete", key }),
  }).catch(() => {});
}

function safeLocalSet(fullKey, value, mustSucceed) {
  try {
    localStorage.setItem(fullKey, value);
    return true;
  } catch (e) {
    // Quota exceeded — very common once a few photo/file attachments pile up,
    // since localStorage typically caps out around 5–10MB total. This is
    // fine for shared data (the cloud copy is the real source of truth), so
    // we swallow the error there; for personal data localStorage IS the
    // store, so that failure has to be surfaced.
    if (mustSucceed) throw e;
    return false;
  }
}

window.storage = {
  async get(key, shared = false) {
    if (shared && getCloudUrl()) {
      const cached = cacheGet(key);
      if (cached !== undefined) {
        safeLocalSet(storageKey(key, shared), cached, false);
        return { key, value: cached, shared };
      }
      try {
        const value = await cloudGet(key);
        cacheSet(key, value);
        safeLocalSet(storageKey(key, shared), value, false); // best-effort local cache
        return { key, value, shared };
      } catch (e) {
        // fall through to local cache below if the cloud read fails
      }
    }
    const raw = localStorage.getItem(storageKey(key, shared));
    if (raw === null) throw new Error(`Key not found: ${key}`);
    return { key, value: raw, shared };
  },

  async set(key, value, shared = false) {
    safeLocalSet(storageKey(key, shared), value, !shared);
    if (shared) cloudSet(key, value);
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    localStorage.removeItem(storageKey(key, shared));
    if (shared) cloudDelete(key);
    return { key, deleted: true, shared };
  },

  async list(prefix = "", shared = false) {
    if (shared && getCloudUrl()) {
      try {
        const items = await cloudGetMany(prefix);
        if (items.length) {
          const keys = [];
          for (const it of items) {
            cacheSet(it.key, it.value);
            safeLocalSet(storageKey(it.key, shared), it.value, false); // best-effort
            keys.push(it.key);
          }
          return { keys, prefix, shared };
        }
      } catch (e) { /* fall through to local */ }
    }
    const fullPrefix = storageKey(prefix, shared);
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(fullPrefix)) {
        keys.push(k.slice(storageKey("", shared).length));
      }
    }
    return { keys, prefix, shared };
  },
};

window.__setCloudStorageUrl = function (url) {
  try { localStorage.setItem(CLOUD_URL_KEY, url || ""); } catch (e) {}
};
window.__getCloudStorageUrl = function () {
  return getCloudUrl();
};
