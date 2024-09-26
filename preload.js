const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  execPython: (filePath) => ipcRenderer.invoke('run-python', filePath),

  saveFile: (src, dest) => {
    ipcRenderer.invoke('save-file', { src, dest });
  },

  saveTempVideo: (videoData) => {
    return ipcRenderer.invoke('save-temp-video', videoData);
  },

  showSaveDialog: () => {
    return ipcRenderer.invoke('show-save-dialog');
  }
});
