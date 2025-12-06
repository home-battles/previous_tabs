# Previous Tabs - Chrome Extension

A Chrome extension that displays all your previously opened tabs in a visual list. Quick access via keyboard shortcut or extension button.

## Features

- **Visual Tab List**: See all your previously opened tabs in an organized, clickable list
- **Keyboard Shortcut**: Press `Alt+W` to instantly open the tabs list
- **Quick Access**: Click the extension icon to view all previous tabs
- **Tab Information**: View tab titles, URLs, and favicons
- **Current Tab Indicator**: Easily identify which tab you're currently on
- **Automatic History Tracking**: Keeps track of up to 100 recently activated tabs
- **Clean UI**: Modern, intuitive interface

## How to Use

### Using Keyboard Shortcut (Recommended)

1. Press `Alt+W` to open the previous tabs list
2. Browse through all your previously opened tabs
3. Click on any tab to switch to it
4. Press `Esc` to close the list

### Using Extension Icon

1. Click the "Previous Tabs" extension icon in your Chrome toolbar
2. Click "Show All Previous Tabs" button
3. Browse and click on any tab to switch to it

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the `previous_tabs` folder

## Example Usage

- Press `Alt+W` → Opens a popup window showing all previous tabs
- Click on any tab in the list → Instantly switches to that tab
- Numbers next to each tab show the order (1 = most recent, 2 = second most recent, etc.)
- Current tab is highlighted for easy reference

## Files Structure

```
previous_tabs/
├── manifest.json       # Extension configuration
├── background.js       # Background service worker (tracks tab history)
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic
├── tabs-list.html      # Visual tabs list window
├── tabs-list.js        # Tabs list logic
├── icons/              # Extension icons (you'll need to add these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Keyboard Shortcut**: `Alt+W` (customizable in Chrome settings at `chrome://extensions/shortcuts`)
- **Permissions**: 
  - `tabs`: To access and switch between tabs
  - `storage`: To persist tab history across sessions
- **Background Service Worker**: Tracks tab activation and removal events
- **History Limit**: 100 tabs (configurable in `background.js`)
- **UI**: Popup window showing visual list of all previous tabs with titles, URLs, and favicons

## Privacy

This extension:
- Only stores tab IDs locally on your device
- Does not collect or transmit any data
- Does not access tab content or URLs
- Uses Chrome's local storage only

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
