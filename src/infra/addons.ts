// Addons config helpers that use chrome.storage.local
// Provides getAddonsConfig and setAddonsConfig

export type AddonsConfig = {
  // keyed by addon id
  [id: string]: any;
};

export function getAddonsConfig(): Promise<AddonsConfig> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
        // Fallback to localStorage for non-extension dev environments
        const raw = localStorage.getItem('addons_config');
        resolve(raw ? JSON.parse(raw) : {});
        return;
      }
      chrome.storage.local.get(['addons_config'], (res) => {
        const cfg = (res && res.addons_config) ? res.addons_config : {};
        resolve(cfg);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function setAddonsConfig(cfg: AddonsConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
        localStorage.setItem('addons_config', JSON.stringify(cfg));
        resolve();
        return;
      }
      chrome.storage.local.set({ addons_config: cfg }, () => resolve());
    } catch (e) {
      reject(e);
    }
  });
}

export default { getAddonsConfig, setAddonsConfig };
