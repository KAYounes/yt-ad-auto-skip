export function setStorageSync(pairs) {
  return chrome.storage.sync.set(pairs);
}
export function getStorageSync(keys) {
  return chrome.storage.sync.get(keys);
}
