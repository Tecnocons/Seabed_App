const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,  // Larghezza della finestra
    height: 700,  // Altezza della finestra
    resizable: false,  // Impedisce il ridimensionamento
    minimizable: false,  // Impedisce la minimizzazione
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  //mainWindow.setMenu(null);  // Rimuove il menu standard
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
