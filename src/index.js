import { app, BrowserWindow, Menu, MenuItem, Tray } from 'electron';
import path from 'path';
import Positioner from 'electron-positioner';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  let appWidth = 335
  let enableRiziseWindow = false

  if (process.env.NODE_ENV == 'development') {
    // appWidth = 800
    enableRiziseWindow = true
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: appWidth,
    height: 600,
    resizable: enableRiziseWindow,
    title: "Printer desk client",
    icon: path.join(__dirname, '/assets/icons/png/64x64.png'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true
    },
  });

  const positioner = new Positioner(mainWindow);
  positioner.move('bottomRight');

  const mainMenu = Menu.buildFromTemplate([
    {
      label  : 'File',
      submenu: [
        {
          label: 'Minimize to Tray',
          click () {
            mainWindow.hide()
          },
        },
        { type: 'separator' },
        {
          label: 'Quit',
          click () {
            app.isQuiting = true
            app.quit()
          },
        },
      ],
    },
  ])

  if (process.env.NODE_ENV == 'development') {
    mainMenu.items[0].submenu.insert(1, new MenuItem({ type: 'separator' }))
    mainMenu.items[0].submenu.insert(2, new MenuItem({
      label: 'Toggle Developer Tools',
      role : 'toggledevtools',
    }))
  }

  Menu.setApplicationMenu(mainMenu)

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click () {
        mainWindow.show()
      },
    },
    { type: 'separator' },
    {
      label: 'Start',
      enabled: false,
      click () {
        mainWindow.webContents.send('start')
      },
    },
    {
      label  : 'Stop',
      click () {
        mainWindow.webContents.send('stop')
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click () {
        app.isQuiting = true
        app.quit()
      },
    },
  ])

  const ICON = (() => {
    const icons = {
      linux: './assets/icons/png/64x64.png',
      win32: './assets/icons/win/icon.ico',
    }
  
    return icons[process.platform]
  })()

  tray = new Tray(path.join(__dirname, ICON))
  tray.setToolTip('Recta Print')
  tray.setContextMenu(trayMenu)

  // mainWindow.removeMenu()
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/html/index.html`);

  // Open the DevTools.
  if (process.env.NODE_ENV == 'development') {
    // mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('ready', createWindow);
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
