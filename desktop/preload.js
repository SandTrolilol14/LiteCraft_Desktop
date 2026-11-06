const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('litecraft', {
    elegirCarpeta: () => ipcRenderer.invoke('dialog:elegir-carpeta'),
    getConfig: () => ipcRenderer.invoke('config:get'),
    setConfig: (config) => ipcRenderer.invoke('config:set', config)
});