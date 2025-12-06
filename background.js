// Track tab history - stores tab IDs in order of activation
let tabHistory = [];

// Maximum history size to prevent memory issues
const MAX_HISTORY_SIZE = 100;

// Track keyboard shortcut presses
let shortcutClickCount = 0;
let shortcutTimer = null;
const SHORTCUT_TIMEOUT = 500; // 1 second window for multiple presses

// Listen to tab activation events
chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  
  // Remove the tab from history if it already exists (to avoid duplicates)
  tabHistory = tabHistory.filter(id => id !== tabId);
  
  // Add the current tab to the front of history
  tabHistory.unshift(tabId);
  
  // Limit history size
  if (tabHistory.length > MAX_HISTORY_SIZE) {
    tabHistory = tabHistory.slice(0, MAX_HISTORY_SIZE);
  }
  
  // Store in chrome.storage for persistence
  chrome.storage.local.set({ tabHistory: tabHistory });
});

// Listen to tab removal events to clean up history
chrome.tabs.onRemoved.addListener((tabId) => {
  // Remove closed tab from history
  tabHistory = tabHistory.filter(id => id !== tabId);
  chrome.storage.local.set({ tabHistory: tabHistory });
});

// Initialize history from storage when extension loads
chrome.storage.local.get(['tabHistory'], (result) => {
  if (result.tabHistory) {
    tabHistory = result.tabHistory;
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabHistory') {
    sendResponse({ tabHistory: tabHistory });
  } else if (request.action === 'switchToPreviousTab') {
    const index = request.index || 1;
    
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTabId = tabs[0]?.id;
      
      // Find the index of current tab in history
      const currentIndex = tabHistory.indexOf(currentTabId);
      
      // Calculate target index (skip the current tab which should be at index 0)
      let targetIndex = index;
      if (currentIndex === 0) {
        targetIndex = index; // Current tab is at top, so nth previous is at index n
      } else {
        targetIndex = currentIndex + index;
      }
      
      // Get the target tab ID
      if (targetIndex < tabHistory.length) {
        const targetTabId = tabHistory[targetIndex];
        
        // Verify the tab still exists and switch to it
        chrome.tabs.get(targetTabId, (tab) => {
          if (chrome.runtime.lastError) {
            // Tab doesn't exist, clean up history
            tabHistory = tabHistory.filter(id => id !== targetTabId);
            chrome.storage.local.set({ tabHistory: tabHistory });
            sendResponse({ success: false, error: 'Tab no longer exists' });
          } else {
            // Switch to the tab
            chrome.tabs.update(targetTabId, { active: true });
            sendResponse({ success: true });
          }
        });
      } else {
        sendResponse({ success: false, error: 'No more tabs in history' });
      }
    });
    
    return true; // Keep message channel open for async response
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'go-to-previous-tab') {
    shortcutClickCount++;
    
    // Clear existing timer
    if (shortcutTimer) {
      clearTimeout(shortcutTimer);
    }
    
    // Set new timer to execute after timeout
    shortcutTimer = setTimeout(() => {
      const index = shortcutClickCount;
      
      // Get the current active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTabId = tabs[0]?.id;
        
        // Find the index of current tab in history
        const currentIndex = tabHistory.indexOf(currentTabId);
        
        // Calculate target index
        let targetIndex = index;
        if (currentIndex === 0) {
          targetIndex = index;
        } else {
          targetIndex = currentIndex + index;
        }
        
        // Get the target tab ID
        if (targetIndex < tabHistory.length) {
          const targetTabId = tabHistory[targetIndex];
          
          // Verify the tab still exists and switch to it
          chrome.tabs.get(targetTabId, (tab) => {
            if (!chrome.runtime.lastError) {
              // Switch to the tab
              chrome.tabs.update(targetTabId, { active: true });
            } else {
              // Tab doesn't exist, clean up history
              tabHistory = tabHistory.filter(id => id !== targetTabId);
              chrome.storage.local.set({ tabHistory: tabHistory });
            }
          });
        }
      });
      
      // Reset counter
      shortcutClickCount = 0;
    }, SHORTCUT_TIMEOUT);
  }
});
