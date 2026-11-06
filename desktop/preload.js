const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('litecraft', {
    elegirCarpeta: () => ipcRenderer.invoke('dialog:elegir-carpeta'),
    getConfig: () => ipcRenderer.invoke('config:get'),
    setConfig: (config) => ipcRenderer.invoke('config:set', config),
    guardarEsquema: (nombreArchivo, contenidoBase64) =>
        ipcRenderer.invoke('esquema:guardar', { nombreArchivo, contenidoBase64 })
});