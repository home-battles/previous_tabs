const showTabsBtn = document.getElementById('showTabsBtn');
const statusDiv = document.getElementById('status');

function updateStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? '#d93025' : '#1e8e3e';
  
  // Clear status after 2 seconds
  setTimeout(() => {
    statusDiv.textContent = '';
  }, 2000);
}

showTabsBtn.addEventListener('click', async () => {
  try {
    // Open the tabs list window
    await chrome.windows.create({
      url: chrome.runtime.getURL('tabs-list.html'),
      type: 'popup',
      width: 520,
      height: 650,
      focused: true
    });
    
    // Close the extension popup
    window.close();
  } catch (error) {
    console.error('Error opening tabs list:', error);
    updateStatus('Error opening tabs list', true);
  }
});

// Focus the button when popup opens
showTabsBtn.focus();
