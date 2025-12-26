import { getAddonsConfig, setAddonsConfig } from '../infra/addons';

const ALARM_NAME = 'auto_process_patches_sync';
let alarmListenerRegistered = false;

async function triggerSync() {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'RUN_SYNC' }, () => {});
    }
  } catch (e) {
    console.warn('autoProcessPatches: failed to trigger RUN_SYNC', e);
  }
}

export const autoProcessPatches = {
  id: 'autoProcessPatches',
  name: 'Auto Process Patches',
  async init() {
    const cfg = await getAddonsConfig();
    const myCfg = cfg[this.id] || {};
    const enabled = !!myCfg.enabled;
    const periodInMinutes = myCfg.periodInMinutes || 15;

    if (enabled) {
      // Trigger an immediate sync
      triggerSync();

      // Create/ensure alarm
      try {
        if (typeof chrome !== 'undefined' && chrome.alarms && chrome.alarms.create) {
          chrome.alarms.create(ALARM_NAME, { periodInMinutes });

          if (!alarmListenerRegistered && chrome.alarms && chrome.alarms.onAlarm && chrome.alarms.onAlarm.addListener) {
            chrome.alarms.onAlarm.addListener((alarm) => {
              if (alarm && alarm.name === ALARM_NAME) {
                triggerSync();
              }
            });
            alarmListenerRegistered = true;
          }
        }
      } catch (e) {
        console.warn('autoProcessPatches: failed to create alarm', e);
      }
    } else {
      // disabled - clear alarm
      try {
        if (typeof chrome !== 'undefined' && chrome.alarms && chrome.alarms.clear) {
          chrome.alarms.clear(ALARM_NAME, () => {});
        }
      } catch (e) {
        console.warn('autoProcessPatches: failed to clear alarm', e);
      }
    }
  },

  async onEnable(options?: any) {
    const cfg = await getAddonsConfig();
    cfg[this.id] = Object.assign({}, cfg[this.id] || {}, { enabled: true, ...(options || {}) });
    await setAddonsConfig(cfg);
    await this.init();
  },

  async onDisable() {
    const cfg = await getAddonsConfig();
    cfg[this.id] = Object.assign({}, cfg[this.id] || {}, { enabled: false });
    await setAddonsConfig(cfg);
    await this.init();
  }
};

export default autoProcessPatches;
