// Converted from original minimal auth.ts
// Small wrapper for chrome.identity.getProfileUserInfo -> Promise

export async function getProfile(): Promise<{email?: string, id?: string}> {
  return new Promise(resolve => {
    try {
      chrome.identity.getProfileUserInfo((info) => {
        resolve(info || {})
      })
    } catch (err) {
      // If chrome.identity is not available in the environment, resolve empty
      resolve({})
    }
  })
}