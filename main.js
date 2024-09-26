const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process'); // Aggiunto exec per eseguire script Python

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false,
    minimizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

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

// Esecuzione del processo Python per analizzare il video
ipcMain.handle('run-python', (event, args) => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, 'analyze_video.py');
    const inputVideoPath = args[0];
    const outputVideoPath = args[1];
    
    console.log(`Esecuzione dello script Python con input: ${inputVideoPath} e output: ${outputVideoPath}`);
    
    exec(`python "${pythonScriptPath}" "${inputVideoPath}" "${outputVideoPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante l\'esecuzione dello script Python:', error);
        reject(error.message);
      } else if (stderr) {
        console.error('Errore nello script Python:', stderr);
        reject(stderr);
      } else {
        console.log('Risultato dello script Python:', stdout);
        resolve(stdout);
      }
    });
  });
});


// Salvataggio del video temporaneo nel sistema
ipcMain.handle('save-temp-video', async (event, videoData) => {
  const tempDir = os.tmpdir();
  const tempVideoPath = path.join(tempDir, videoData.name);

  // Creazione del buffer per il video e scrittura nel file temporaneo
  const buffer = Buffer.from(videoData.arrayBuffer);
  fs.writeFileSync(tempVideoPath, buffer);

  console.log(`Video temporaneo salvato in: ${tempVideoPath}`);
  return tempVideoPath;
});

// Mostra la finestra di dialogo per il salvataggio del file
ipcMain.handle('show-save-dialog', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Salva Video Analizzato',
    defaultPath: 'video_analizzato.mp4',
    filters: [{ name: 'Video', extensions: ['mp4'] }]
  });

  return { canceled, filePath };
});

// Funzione per salvare il file finale
ipcMain.handle('save-file', (event, { src, dest }) => {
  try {
    fs.copyFileSync(src, dest);
    console.log(`File copiato da ${src} a ${dest}`);
  } catch (error) {
    console.error('Errore durante il salvataggio del file:', error);
  }
});
