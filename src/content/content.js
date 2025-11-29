let ignoredStreamers = [];

chrome.storage.sync.get(['enabled', 'ignoredStreamers'], (result) => {
    if (result.enabled !== false) {
        ignoredStreamers = result.ignoredStreamers || [];
        init();
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.ignoredStreamers) {
            ignoredStreamers = changes.ignoredStreamers.newValue || [];
            processStreamers();
        }
        if (changes.enabled) {
            if (changes.enabled.newValue === false) {
                showAllStreamers();
            } else {
                processStreamers();
            }
        }
    }
});

function init() {
    processStreamers();

    const observer = new MutationObserver((mutations) => {
        processStreamers();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function processStreamers() {
    const cards = document.querySelectorAll('div.group\\/card');

    cards.forEach(card => {
        const anchor = card.querySelector('a[href]');
        if (anchor) {
            const href = anchor.getAttribute('href');
            const streamerName = href.replace('/', '');

            if (ignoredStreamers.some(s => s.toLowerCase() === streamerName.toLowerCase())) {
                card.style.display = 'none';
            } else {
                if (card.style.display === 'none') {
                    card.style.display = '';
                }
                if (!card.querySelector('.kick-filter-hide-btn')) {
                    addHideButton(card, streamerName);
                }
            }
        }
    });
}

function addHideButton(card, streamerName) {
    const btn = document.createElement('button');
    btn.className = 'kick-filter-hide-btn';
    btn.textContent = 'Hide';
    btn.style.position = 'absolute';
    btn.style.top = '5px';
    btn.style.right = '5px';
    btn.style.zIndex = '1000';
    btn.style.backgroundColor = '#ef4444';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.padding = '2px 6px';
    btn.style.fontSize = '12px';
    btn.style.cursor = 'pointer';
    btn.style.display = 'none';

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!ignoredStreamers.includes(streamerName)) {
            const newIgnored = [...ignoredStreamers, streamerName];
            chrome.storage.sync.set({ ignoredStreamers: newIgnored });
        }
    });

    card.addEventListener('mouseenter', () => {
        btn.style.display = 'block';
    });

    card.addEventListener('mouseleave', () => {
        btn.style.display = 'none';
    });

    card.appendChild(btn);
}

function showAllStreamers() {
    const cards = document.querySelectorAll('div.group\\/card');
    cards.forEach(card => {
        card.style.display = '';
    });
}
