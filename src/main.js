const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

// Microsoft Store Add-on Product ID
const STORE_ADDON_ID = 'zaappdo_pro_weekly';

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 620,
    minWidth: 360,
    minHeight: 500,
    resizable: true,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#FAFAF9',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: load tasks
ipcMain.handle('get-tasks', () => {
  return store.get('tasks', []);
});

// IPC: save tasks
ipcMain.handle('save-tasks', (_, tasks) => {
  store.set('tasks', tasks);
  return true;
});

// IPC: get subscription status
// Checks local cache; real license verified via Store API in renderer
ipcMain.handle('get-sub', () => {
  return store.get('subscription', { active: false, trial: false });
});

// IPC: save subscription after Store purchase confirmed in renderer
ipcMain.handle('save-sub', (_, subData) => {
  store.set('subscription', subData);
  return true;
});

// IPC: activate 7-day trial
ipcMain.handle('start-trial', () => {
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  store.set('subscription', { active: true, trial: true, expires });
  return true;
});

// IPC: window controls
ipcMain.on('win-close', () => BrowserWindow.getFocusedWindow()?.close());
ipcMain.on('win-minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
