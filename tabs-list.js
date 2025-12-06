const tabsContainer = document.getElementById('tabsContainer');
const closeBtn = document.getElementById('closeBtn');

let selectedIndex = 0;
let tabItems = [];

// Close the window
function closeWindow() {
  window.close();
}

closeBtn.addEventListener('click', closeWindow);

// Track key states
let altPressed = false;
let wPressed = false;

// Handle keydown events
document.addEventListener('keydown', (e) => {
  if (e.key === 'Alt') {
    altPressed = true;
  }
  if (e.key === 'w' || e.key === 'W') {
    wPressed = true;
  }
  if (e.key === 'Escape') {
    closeWindow();
  }
});

// Handle keyup events - switch tab when both keys are released
document.addEventListener('keyup', (e) => {
  if (e.key === 'Alt') {
    altPressed = false;
  }
  if (e.key === 'w' || e.key === 'W') {
    wPressed = false;
  }
  
  // If both Alt and W are released, switch to selected tab or close popup
  if (!altPressed && !wPressed) {
    if (selectedIndex > 0) {
      switchToSelectedTab();
    } else {
      // If current tab is selected (index 0), just close the popup
      closeWindow();
    }
  }
});

// Load and display tabs
async function loadTabs(initialSelectedIndex = 0) {
  try {
    // Get tab history from background
    const response = await chrome.runtime.sendMessage({ action: 'getTabHistory' });
    const tabHistory = response.tabHistory || [];
    selectedIndex = initialSelectedIndex;
    
    if (tabHistory.length === 0) {
      tabsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p>No tab history available yet.</p>
          <p style="font-size: 11px; margin-top: 10px;">Start browsing to build your tab history!</p>
        </div>
      `;
      return;
    }
    
    // Get current active tab
    const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTabId = currentTab?.id;
    
    // Get details for all tabs in history
    const tabPromises = tabHistory.map(async (tabId, index) => {
      try {
        const tab = await chrome.tabs.get(tabId);
        return { tab, index, exists: true };
      } catch (error) {
        return { tabId, index, exists: false };
      }
    });
    
    const tabResults = await Promise.all(tabPromises);
    
    // Filter out non-existent tabs and the popup itself
    const validTabs = tabResults.filter(result => {
      if (!result.exists) return false;
      // Exclude the popup window's tab (tabs-list.html)
      const tab = result.tab;
      return !tab.url.includes('tabs-list.html');
    });
    
    if (validTabs.length === 0) {
      tabsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p>No tabs found in history.</p>
        </div>
      `;
      return;
    }
    
    // Build the tabs list HTML
    let html = '';
    validTabs.forEach((result, displayIndex) => {
      const tab = result.tab;
      const isCurrent = tab.id === currentTabId;
      const isSelected = displayIndex === selectedIndex;
      const number = displayIndex + 1;
      
      // Use favicon or default icon
      const favicon = tab.favIconUrl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22%3E%3Ctext y=%2214%22 font-size=%2214%22%3E📄%3C/text%3E%3C/svg%3E';
      
      // Truncate title if too long
      const title = tab.title || 'Untitled';
      
      // Format URL for display
      let displayUrl = tab.url || '';
      try {
        const url = new URL(displayUrl);
        displayUrl = url.hostname + url.pathname;
      } catch (e) {
        // Keep original URL if parsing fails
      }
      
      html += `
        <div class="tab-item ${isCurrent ? 'current' : ''} ${isSelected ? 'selected' : ''}" data-tab-id="${tab.id}" data-index="${displayIndex}">
          <div class="tab-number">${number}</div>
          <img class="tab-favicon" src="${favicon}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22%3E%3Ctext y=%2214%22 font-size=%2214%22%3E📄%3C/text%3E%3C/svg%3E'">
          <div class="tab-info">
            <div class="tab-title">${escapeHtml(title)}${isCurrent ? ' (Current)' : ''}</div>
            <div class="tab-url">${escapeHtml(displayUrl)}</div>
          </div>
        </div>
      `;
    });
    
    tabsContainer.innerHTML = html;
    
    // Store tab items for later reference
    tabItems = Array.from(document.querySelectorAll('.tab-item'));
    
    // Scroll selected item into view
    if (tabItems[selectedIndex]) {
      tabItems[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Add click handlers
    document.querySelectorAll('.tab-item').forEach(item => {
      item.addEventListener('click', async () => {
        const tabId = parseInt(item.dataset.tabId);
        try {
          await chrome.tabs.update(tabId, { active: true });
          window.close();
        } catch (error) {
          console.error('Error switching to tab:', error);
        }
      });
    });
    
  } catch (error) {
    console.error('Error loading tabs:', error);
    tabsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Error loading tabs</p>
      </div>
    `;
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Update selection highlight
function updateSelection(newIndex) {
  // Cycle back to 0 if we exceed the number of tabs
  if (tabItems.length > 0) {
    selectedIndex = newIndex % tabItems.length;
  } else {
    selectedIndex = 0;
  }
  
  // Remove previous selection
  tabItems.forEach(item => item.classList.remove('selected'));
  
  // Add new selection
  if (tabItems[selectedIndex]) {
    tabItems[selectedIndex].classList.add('selected');
    tabItems[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Switch to selected tab
async function switchToSelectedTab() {
  if (tabItems[selectedIndex]) {
    const tabId = parseInt(tabItems[selectedIndex].dataset.tabId);
    try {
      await chrome.tabs.update(tabId, { active: true });
      window.close();
    } catch (error) {
      console.error('Error switching to tab:', error);
    }
  }
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateSelection') {
    updateSelection(request.selectedIndex);
    sendResponse({ success: true });
  }
  return true;
});

// Register this window with background script
chrome.windows.getCurrent((window) => {
  chrome.runtime.sendMessage({
    action: 'registerTabsListWindow',
    windowId: window.id
  });
});

// Load tabs when popup opens
loadTabs();
