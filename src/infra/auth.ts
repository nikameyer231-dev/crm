// Simple chrome.identity wrapper for drive OAuth usage
export async function getAuthToken(interactive = true): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message))
      resolve(token as string)
    })
  })
}

export async function removeCachedToken(token?: string) {
  return new Promise<void>((resolve) => {
    if (!token) return resolve()
    chrome.identity.removeCachedAuthToken({ token }, () => resolve())
  })
}

export async function getProfile(): Promise<{email?: string, id?: string}> {
  return new Promise(resolve => {
    chrome.identity.getProfileUserInfo((info) => resolve(info || {}))
  })
}