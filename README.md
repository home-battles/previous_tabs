# Previous Tabs - Chrome Extension

A Chrome extension that allows you to navigate to previously opened tabs by clicking a button. Click multiple times quickly to go further back in your tab history.

## Features

- **Simple Navigation**: Click the extension button to go back to your previous tab
- **Multi-Level History**: Click multiple times within 1 second to go back multiple tabs
- **Visual Feedback**: See how many tabs back you're going
- **Automatic History Tracking**: Keeps track of up to 100 recently activated tabs
- **Clean UI**: Simple, intuitive interface

## How to Use

1. Click the "Previous Tabs" extension icon in your Chrome toolbar
2. Click the "Go to Previous Tab" button to switch to your last tab
3. To go back multiple tabs:
   - Click the button multiple times quickly (within 1 second)
   - Each click adds one more tab to go back
   - After 1 second, it will navigate to the nth previously opened tab

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the `previous_tabs` folder

## Example Usage

- **1 click**: Switch to the tab you were just on
- **2 quick clicks**: Go back 2 tabs in history
- **3 quick clicks**: Go back 3 tabs in history
- And so on...

## Files Structure

```
previous_tabs/
├── manifest.json       # Extension configuration
├── background.js       # Background service worker (tracks tab history)
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic and interaction
├── icons/              # Extension icons (you'll need to add these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: 
  - `tabs`: To access and switch between tabs
  - `storage`: To persist tab history across sessions
- **Background Service Worker**: Tracks tab activation and removal events
- **History Limit**: 100 tabs (configurable in `background.js`)

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
