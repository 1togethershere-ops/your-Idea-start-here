/**
 * Polyfill for `window.storage`, the key-value API this dashboard was originally
 * built against (Claude Artifacts). Outside Claude.ai that API does not exist,
 * so this file re-implements the same shape on top of the browser's
 * localStorage — this makes every existing window.storage.get/set/delete/list
 * call in App.jsx work unmodified.
 *
 * IMPORTANT LIMITATION: localStorage is per-browser, per-device. Data saved by
 * one person on their laptop will NOT be visible to a teammate on a different
 * computer/phone, even though the code has a "shared" flag — there is no real
 * shared backend here. If you need true multi-user shared data, this file is
 * the place to swap in a real backend (Firebase, Supabase, your own API, etc.)
 * — keep the same four function names/signatures and the rest of the app
 * keeps working untouched.
 */

const NS = "salesAuditDashboard";

function storageKey(key, shared) {
  return `${NS}:${shared ? "shared" : "personal"}:${key}`;
}

window.storage = {
  async get(key, shared = false) {
    const raw = localStorage.getItem(storageKey(key, shared));
    if (raw === null) {
      throw new Error(`Key not found: ${key}`);
    }
    return { key, value: raw, shared };
  },

  async set(key, value, shared = false) {
    localStorage.setItem(storageKey(key, shared), value);
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    localStorage.removeItem(storageKey(key, shared));
    return { key, deleted: true, shared };
  },

  async list(prefix = "", shared = false) {
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
