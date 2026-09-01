chrome.runtime.onInstalled.addListener(() => {
    console.log('Kicker extension installed');
    chrome.storage.sync.set({ enabled: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOGGLE_EXTENSION') {
        console.log('Extension enabled state changed:', message.enabled);
    }
});
