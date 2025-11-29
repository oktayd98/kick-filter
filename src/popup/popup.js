document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-extension');
  const streamerInput = document.getElementById('streamer-name');
  const addBtn = document.getElementById('add-btn');
  const ignoredList = document.getElementById('ignored-list');

  chrome.storage.sync.get(['enabled', 'ignoredStreamers'], (result) => {
    toggle.checked = result.enabled !== false;
    const streamers = result.ignoredStreamers || [];
    renderList(streamers);
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ enabled: isEnabled });
  });

  addBtn.addEventListener('click', addStreamer);

  streamerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addStreamer();
  });

  function addStreamer() {
    const name = streamerInput.value.trim();

    if (!name) return;

    chrome.storage.sync.get(['ignoredStreamers'], (result) => {
      const streamers = result.ignoredStreamers || [];
      if (!streamers.includes(name)) {
        streamers.push(name);
        chrome.storage.sync.set({ ignoredStreamers: streamers }, () => {
          renderList(streamers);
          streamerInput.value = '';
        });
      }
    });
  }

  function removeStreamer(name) {
    chrome.storage.sync.get(['ignoredStreamers'], (result) => {
      const streamers = result.ignoredStreamers || [];
      const newStreamers = streamers.filter(s => s !== name);
      chrome.storage.sync.set({ ignoredStreamers: newStreamers }, () => {
        renderList(newStreamers);
      });
    });
  }

  function renderList(streamers) {
    ignoredList.innerHTML = '';
    streamers.forEach(name => {
      const li = document.createElement('li');
      li.className = 'streamer-item';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = name;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = () => removeStreamer(name);

      li.appendChild(nameSpan);
      li.appendChild(removeBtn);
      ignoredList.appendChild(li);
    });
  }
});
