let clickCount = 0;
let clickTimer = null;
const CLICK_TIMEOUT = 1000; // 1 second window for multiple clicks

const goBackBtn = document.getElementById('goBackBtn');
const clickCounter = document.getElementById('clickCounter');
const statusDiv = document.getElementById('status');

function updateClickCounter() {
  if (clickCount > 0) {
    clickCounter.textContent = `Going back ${clickCount} tab${clickCount > 1 ? 's' : ''}...`;
  } else {
    clickCounter.textContent = '';
  }
}

function updateStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? '#d93025' : '#1e8e3e';
  
  // Clear status after 2 seconds
  setTimeout(() => {
    statusDiv.textContent = '';
  }, 2000);
}

function executePreviousTab() {
  const index = clickCount;
  
  chrome.runtime.sendMessage(
    { action: 'switchToPreviousTab', index: index },
    (response) => {
      if (response && response.success) {
        updateStatus(`Switched to tab ${index} back`);
      } else {
        const error = response?.error || 'Unknown error';
        updateStatus(error, true);
      }
      
      // Reset click count
      clickCount = 0;
      updateClickCounter();
    }
  );
}

goBackBtn.addEventListener('click', () => {
  clickCount++;
  updateClickCounter();
  
  // Clear existing timer
  if (clickTimer) {
    clearTimeout(clickTimer);
  }
  
  // Set new timer
  clickTimer = setTimeout(() => {
    executePreviousTab();
  }, CLICK_TIMEOUT);
});

// Keyboard support - press Enter or Space
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    goBackBtn.click();
  }
});

// Focus the button when popup opens
goBackBtn.focus();
