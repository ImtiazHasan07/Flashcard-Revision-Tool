const {
  contextBridge,
  ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld('electron', {
  default_path: ipcRenderer.invoke('default_path'),
  resolve: (...paths) => ipcRenderer.invoke('resolve', ...paths),
  showOpenDialog: (options) => ipcRenderer.invoke('showOpenDialog', options),
  existsSync: (path) => ipcRenderer.invoke('existsSync', path),
  mkdirSync: (path) => ipcRenderer.invoke('mkdirSync', path),
  writeFileSync: (path, data) => ipcRenderer.invoke('writeFileSync', path, data),
  readFileSync: (path, options) => ipcRenderer.invoke('readFileSync', path, options)
})