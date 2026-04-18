# PseudoRun Firefox Extension - Offline Version

A Firefox extension that provides the complete PseudoRun IGCSE/A-LEVELS pseudocode editor and simulator for offline use.

## Installation Instructions

### Option 1: Install the Pre-built Extension (Easy)

1. **Download the extension**: `pseudorun-extension.zip` (already created)
2. **Extract the zip file** to a folder
3. **Open Firefox** and go to `about:debugging` in the address bar
4. **Click "This Firefox"** on the left sidebar
5. **Click "Load Temporary Add-on"**
6. **Select the `manifest.json` file** from the extracted folder
7. **Done!** The extension is now installed and ready to use

### Option 2: Build from Source

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the extension**:
   ```bash
   npm run build-extension
   ```
   This creates `pseudorun-extension.zip` in the current directory.

3. **Follow Option 1** steps to install the built extension.

### Option 1a: Install Directly from Source (Quickest)

1. **Open Firefox** and go to `about:debugging` in the address bar
2. **Click "This Firefox"** on the left sidebar
3. **Click "Load Temporary Add-on"**
4. **Navigate to** this directory and select `manifest.json`
5. **Done!** The extension is now installed and ready to use

## How to Use

1. **Click the PseudoRun icon** in the Firefox toolbar
2. **A new tab opens** with the complete pseudocode editor
3. **Write and execute** IGCSE pseudocode without internet connection
4. **Access all features**: Tutorial, Examples, Practice Problems, Debug Mode

## Features Available Offline

✅ **Complete Pseudocode Interpreter**
- Full IGCSE/A-LEVELS syntax support
- Real-time syntax validation
- Error detection and highlighting

✅ **Educational Tools**
- 22 built-in example programs
- Interactive tutorial
- Syntax reference guide
- Practice problems
- Exam mode with timer

✅ **Advanced Features**
- CodeMirror editor with syntax highlighting
- Step-by-step debugging
- Variable state visualization
- File upload/download
- Export to PDF/DOCX
- Local program storage

✅ **Offline Storage**
- Programs saved in browser localStorage
- No network connection required
- Auto-save functionality

## Removed Features (For Offline Use)

❌ **Firebase Authentication** - Always in guest mode
❌ **Cloud Storage** - Programs saved locally only
❌ **Code Sharing** - Network sharing disabled
❌ **Analytics** - No tracking or analytics

## File Structure

```
pseudorun-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── index.html            # Main entry point
├── icons/                # Extension icons
├── dist/                 # Built React application
└── README.md             # This file
```

## Permissions Used

- `storage`: For saving programs locally
- `tabs`: For opening new tabs

## Privacy & Data Collection

This extension **does not collect or transmit any user data**:

✅ **100% Offline Operation** - No network requests made
✅ **Local Storage Only** - Programs saved in browser localStorage
✅ **No Analytics** - No tracking or analytics data collected
✅ **No Authentication** - No user accounts or personal data required
✅ **No Telemetry** - No usage statistics or crash reports sent

All user data remains on the user's device and is completely under their control.

### Firefox Extension ID
- **Extension ID**: `pseudorun-offline@pseudorun.extension`
- **Data Collection**: None - uses Firefox's built-in consent with `required: ["none"]`
- **Firefox Compatibility**: Version 115.0+ (supports built-in data consent)

## Development

To modify the extension:

1. **Install dependencies**: `npm install`
2. **Development mode**: `npm run dev` (starts local dev server)
3. **Build for production**: `npm run build`
4. **Package extension**: `npm run build-extension`

## Browser Compatibility

- ✅ Firefox (all versions)
- ✅ Firefox Developer Edition (recommended for development)
- ✅ Private browsing mode

## Support

For issues or questions about the extension, please refer to the original PseudoRun project documentation.

---

**Note**: This is an offline version of PseudoRun. All cloud-dependent features have been disabled to ensure complete offline functionality.