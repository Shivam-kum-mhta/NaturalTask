// filepath: /workspaces/NaturalTask/frontend/src/utils/isExtensionMode.js
export function isExtensionMode() {
    return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
}