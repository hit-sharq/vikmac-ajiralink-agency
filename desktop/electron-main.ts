import { app, BrowserWindow, Menu, dialog, type MenuItemConstructorOptions } from "electron"
import isDev from "electron-is-dev"
import path from "path"

const __dirname = path.dirname(__filename)

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  // Get screen dimensions for responsive sizing
  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  // Calculate responsive window size (80% of screen size for better visibility)
  const windowWidth = Math.floor(screenWidth * 0.8)
  const windowHeight = Math.floor(screenHeight * 0.8)

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 1024,
    minHeight: 768,
    resizable: true,
    maximizable: true,
    fullscreenable: true,
    show: false, // Don't show until ready-to-show
    webPreferences: {
      preload: path.join(__dirname, "../dist-electron/preload.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "../assets/icon.png"),
  })

  // Center the window on screen
  mainWindow.center()

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow!.show()
  })

  const startUrl = isDev ? "http://localhost:5173" : `file://${path.join(__dirname, "../dist/index.html")}`

  mainWindow.loadURL(startUrl)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Menu
const template: MenuItemConstructorOptions[] = [
  {
    label: "File",
    submenu: [
      {
        label: "Exit",
        accelerator: "CmdOrCtrl+Q",
        click: () => {
          app.quit()
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "About",
        click: () => {
          dialog.showMessageBox(mainWindow!, {
            type: "info",
            title: "About Vikmac Ajira Desktop",
            message: "Vikmac Ajira Link Agency",
            detail: "Office Management System v1.0.0",
          })
        },
      },
    ],
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
