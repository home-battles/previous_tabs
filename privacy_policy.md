# Privacy Policy for Previous Tabs

**Last Updated:** December 7, 2025

## Overview

Previous Tabs is a Chrome browser extension that helps you navigate through your tab history. This privacy policy explains how the extension handles data.

## Data Collection

**Previous Tabs does NOT collect, store, or transmit any personal data.**

The extension does not:
- Collect personally identifiable information
- Track your browsing history
- Send any data to external servers
- Use analytics or tracking services
- Share data with third parties

## Data Storage

The extension stores the following information **locally on your device only**:

- **Tab IDs**: Internal Chrome browser identifiers (e.g., numeric IDs like "12345") used to track which tabs you've recently visited
- This data is stored using `chrome.storage.local` and never leaves your device
- Maximum of 100 tab IDs are stored to prevent memory issues
- Data is automatically cleaned up when tabs are closed

## Data Usage

The extension temporarily accesses the following information to display in the popup:
- Tab titles
- Tab URLs
- Tab favicons

This information is **only used for display purposes** and is **NOT stored or transmitted**. It is accessed in real-time when you open the extension popup.

## Permissions

The extension requires the following permissions:

### Tabs Permission
Required to:
- Detect when you switch between tabs
- Get tab information (title, URL, favicon) for display
- Switch to tabs when you select them

### Storage Permission
Required to:
- Save the list of tab IDs locally on your device
- Persist tab history between browser sessions

## Data Retention

- Tab history is stored locally until tabs are closed or the extension is uninstalled
- No data is retained on any external servers (because no data is sent externally)

## Children's Privacy

This extension does not knowingly collect information from children under 13 years of age. The extension does not collect personal information from any users.

## Changes to This Privacy Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date above.

## Contact

If you have questions about this privacy policy, please contact us through the GitHub repository:
https://github.com/home-battles/previous_tabs

## Your Rights

Since no personal data is collected or stored externally:
- There is no data to request access to
- There is no data to request deletion of
- All locally stored data is automatically removed when you uninstall the extension

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies

By using Previous Tabs, you agree to this privacy policy.