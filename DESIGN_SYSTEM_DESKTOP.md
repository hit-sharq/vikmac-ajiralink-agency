# Vikmac Ajira Desktop Application Design Guide

## Overview

This document provides specific guidelines for desktop application implementations of Vikmac Ajira, including Electron-based clients for Windows, macOS, and Linux.

---

## 1. Window Management

### Window Sizing
- **Minimum Window Size**: 800x600px
- **Recommended Window Size**: 1200x800px
- **Titlebar Height**: 32px (custom) or 22px (native)
- **Status Bar Height**: 24px (if included)

### Window Chrome

#### macOS
- Native window controls (top-left)
- System traffic light buttons
- Transparent titlebar with content behind
- Native rounded corners

#### Windows
- Custom window controls (top-right)
- Caption buttons: Minimize, Maximize, Close
- System menu icon (top-left)

#### Linux
- Platform-specific window manager
- Standard minimize/maximize/close buttons
- Follows GTK/Qt conventions

---

## 2. Navigation Patterns

### Main Navigation Structure
\`\`\`
┌─────────────────────────────────────┐
│  ⊕  Window Title           [ _ □ X] │  ← Titlebar
├─────────────────────────────────────┤
│  File  Edit  View  Tools  Help      │  ← Menu bar (if used)
├──────────────┬──────────────────────┤
│              │                      │
│  Sidebar     │   Main Content       │
│  Navigation  │                      │
│              │                      │
├──────────────┴──────────────────────┤
│  Status bar or footer               │
└─────────────────────────────────────┘
\`\`\`

### Sidebar Navigation
- **Width**: 240px (fixed) or 60px (collapsed icon-only)
- **Toggle Button**: Top-left or left edge
- **Vertical Scroll**: For menu items exceeding viewport
- **Hover States**: Highlight with background color
- **Active State**: Blue accent (#5b4bd9) with bold text

### Top Menu Bar
- **File**: New, Open, Save, Save As, Close, Exit
- **Edit**: Undo, Redo, Cut, Copy, Paste, Select All
- **View**: Zoom In/Out, Fullscreen, Sidebar, Status Bar
- **Tools**: Settings, Preferences, Extensions
- **Help**: Documentation, About, Check Updates

---

## 3. File Operations

### File Picker Dialogs
- Use native OS file dialogs (Electron: dialog.showOpenDialog)
- Support drag-and-drop onto application window
- Show file type filters
- Remember last used directory
- Proper error handling for restricted paths

### File Handling
\`\`\`tsx
// Open file dialog
const openFile = async () => {
  const result = await window.electronAPI.selectFile()
  if (result && !result.canceled) {
    const [filePath] = result.filePaths
    // Process file
  }
}

// Drag and drop
element.addEventListener('drop', (e) => {
  e.preventDefault()
  const files = e.dataTransfer.files
  // Handle multiple files
})
\`\`\`

---

## 4. System Integration

### Taskbar/Dock

#### Windows Taskbar
- App icon with badge for notifications
- Preview thumbnail on hover
- Jump list for quick actions
- Progress indicator for long operations

#### macOS Dock
- App icon with label
- Badge for count/notifications
- Bounce animation for alerts
- Context menu on long press

#### Linux Indicators
- Icon in application menu
- Status indicator if available

### Notifications
\`\`\`tsx
// Native desktop notifications
const notify = (title, options) => {
  const notification = new Notification(title, {
    icon: '/assets/icon.png',
    body: options.body,
    tag: options.tag || 'default',
    requireInteraction: options.persistent || false
  })
}
\`\`\`

### Keyboard Shortcuts

#### Global Shortcuts
- **Cmd/Ctrl + N**: New document/window
- **Cmd/Ctrl + O**: Open file
- **Cmd/Ctrl + S**: Save file
- **Cmd/Ctrl + W**: Close window
- **Cmd/Ctrl + Q**: Quit application
- **Cmd/Ctrl + ,**: Preferences
- **F1**: Help/Documentation
- **F11**: Fullscreen toggle

#### Application Shortcuts
- **Cmd/Ctrl + 1-9**: Switch tabs/workspaces
- **Cmd/Ctrl + Tab**: Next tab
- **Cmd/Ctrl + Shift + Tab**: Previous tab
- **Cmd/Ctrl + L**: Focus location/search bar

---

## 5. Context Menus

### Right-Click Menu Structure
\`\`\`
├─ Edit
│  ├─ Undo
│  ├─ Redo
│  ├─ ──────
│  ├─ Cut
│  ├─ Copy
│  └─ Paste
├─ ──────
├─ Select All
├─ ──────
└─ Inspect Element (dev only)
\`\`\`

### Custom Context Menu Styling
- **Background**: #f5f7fa
- **Text Color**: #1a1a1a
- **Item Padding**: 12px 16px
- **Hover Background**: #e5e5e5
- **Separator**: #e5e5e5, 1px solid
- **Border Radius**: 6px
- **Shadow**: 0 4px 12px rgba(0, 0, 0, 0.15)

---

## 6. Settings/Preferences

### Preferences Window
- Modeless dialog or dedicated settings window
- Tab-based organization (General, Advanced, About)
- Real-time settings application
- "Restore Defaults" button
- Search functionality for settings

### Common Preferences

#### General
- Startup behavior (auto-launch, restore windows)
- Theme (Light/Dark/System)
- Language selection
- Auto-update check

#### Advanced
- Cache settings
- Database optimization
- Logging level
- Developer options

#### About
- Version number
- Build info
- License information
- Check for updates button

---

## 7. Performance Considerations

### Memory Management
- Lazy load heavy components
- Unload background processes
- Proper cleanup on window close
- Use Web Workers for heavy computation

### Startup Time
- **Target**: < 3 seconds to interactive
- **Goals**: 
  - Show window within 500ms
  - Load UI shell within 1s
  - Populate data within 3s

### Persistent Storage
- Use IndexedDB for large datasets
- SQLite for structured data
- File system for binary data
- Auto-save drafts every 30 seconds

---

## 8. Error Handling

### Error Dialog

\`\`\`tsx
const showErrorDialog = (title, message, details) => {
  // Modal dialog with error details
  // Log action and stack trace
  // Suggest recovery options
}
\`\`\`

### Error States
1. **Connection Errors**
   - Show offline indicator
   - Queue operations for sync
   - Provide retry button

2. **Validation Errors**
   - Inline form feedback
   - Red border on invalid field
   - Clear error message

3. **System Errors**
   - Modal dialog with details
   - Log to crash reporter
   - Provide support contact

---

## 9. Accessibility in Desktop Apps

### Keyboard Navigation
- All UI elements reachable via Tab
- Logical tab order (left-to-right, top-to-bottom)
- Enter/Space for buttons
- Arrow keys for lists and menus
- Escape to close dialogs

### Screen Reader Support
- Use native ARIA labels
- Announce status changes
- Describe icons with alt text
- Announce loading states

### Visual Accessibility
- Minimum 1.4x font size for 16px base
- 4.5:1 contrast for text
- High visibility focus indicator
- Don't rely on color alone

---

## 10. Testing Checklist

### Functional Testing
- [ ] All menu items work
- [ ] File operations complete successfully
- [ ] Keyboard shortcuts work
- [ ] Settings persist after restart
- [ ] Window state remembered (size, position)

### Performance Testing
- [ ] Startup time < 3 seconds
- [ ] Smooth scrolling in lists
- [ ] No UI lag with large datasets
- [ ] Memory stable over time

### Compatibility Testing
- [ ] Windows 10/11
- [ ] macOS 10.15+
- [ ] Ubuntu 20.04 LTS+
- [ ] All keyboard layouts
- [ ] Multiple monitor setup

### Accessibility Testing
- [ ] Tab navigation works
- [ ] Screen reader announces content
- [ ] High contrast mode works
- [ ] Keyboard-only navigation possible

---

## 11. Distribution & Updates

### Installers
- Windows: MSI or NSIS installer
- macOS: DMG with drag-to-install
- Linux: AppImage, Snap, or DEB package

### Auto-Update
- Check for updates on startup
- Seamless background updates
- Notify user with install prompt
- Restart after install
- Rollback on failure

### Code Signing
- Sign executable files
- Notarize for macOS
- Digital signatures for Windows
- Update manifest signed

---

## 12. Platform-Specific Considerations

### macOS
- Respect native look and feel
- Support Touch Bar (if available)
- Implement native menu bar
- Use system fonts (San Francisco)
- Support trackpad gestures

### Windows
- Support Windows 11 features
- Snap Layouts support
- Fluent Design principles
- System tray integration
- Windows Terminal integration

### Linux
- Follow FreeDesktop standards
- Support multiple desktop environments
- Use system theme
- Keyboard-first workflow
- Wayland compatibility

---

## 13. Code Examples

### Electron Main Process
\`\`\`javascript
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.loadFile('src/index.html')
  
  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

// Custom menu
const template = [
  {
    label: 'File',
    submenu: [
      { label: 'New', accelerator: 'CmdOrCtrl+N' },
      { label: 'Open', accelerator: 'CmdOrCtrl+O' },
      { label: 'Save', accelerator: 'CmdOrCtrl+S' },
      { type: 'separator' },
      { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
    ]
  }
]

Menu.setApplicationMenu(Menu.buildFromTemplate(template))
\`\`\`

### IPC Communication
\`\`\`javascript
// Preload script
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content)
})

// Renderer process
const content = await window.electronAPI.selectFile()
\`\`\`

---

## 14. Quality Assurance

### Testing Matrix
| Feature | Windows | macOS | Linux |
|---------|---------|-------|-------|
| Startup | ✓ | ✓ | ✓ |
| File Operations | ✓ | ✓ | ✓ |
| Keyboard Shortcuts | ✓ | ✓ | ✓ |
| Notifications | ✓ | ✓ | ✓ |
| Auto-Update | ✓ | ✓ | ✓ |

---

## Last Updated
November 27, 2025

## Version
1.0.0
