import { getAddonsConfig } from '../infra/addons';
import { registeredAddons } from './index';

// Bootloader that loads addonsConfig from chrome.storage.local, dynamic-loads local addons
// and auto-initializes enabled addons on login/startup

export async function initializeAddons() {
  try {
    const cfg = await getAddonsConfig();
    const enabledMap = (cfg && cfg.enabled) || {};

    for (const addon of registeredAddons) {
      try {
        const addonCfg = cfg[addon.id] || {};
        const enabled = addonCfg.enabled || !!addon.defaultEnabled || false;
        if (enabled) {
          if (addon.init) {
            await addon.init();
          } else if (addon.onEnable) {
            await addon.onEnable(addonCfg);
          }
        }
      } catch (e) {
        console.warn(`[addons] failed to initialize addon ${addon.id}`, e);
      }
    }
  } catch (e) {
    console.warn('initializeAddons failed', e);
  }
}

export default { initializeAddons };
