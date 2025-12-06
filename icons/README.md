# Icon Placeholder Files

The extension requires three PNG icon files:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

## Quick Setup

I've included an SVG icon (`icon.svg`) that you can convert to PNG files at different sizes.

### Option 1: Use an online converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Convert to 16x16, 48x48, and 128x128 PNG files
4. Save them with the correct names in this folder

### Option 2: Use ImageMagick (if installed)
```bash
cd icons
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Option 3: Use macOS Preview
1. Open icon.svg in Preview
2. File > Export
3. Format: PNG
4. Resolution: Set to desired size
5. Repeat for each size

The icon design is a simple blue square with a white back arrow, representing going back to previous tabs.
