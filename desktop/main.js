const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Ruta del archivo de configuración local
const getConfigPath = () => path.join(app.getPath('userData'), 'config.json');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
    mainWindow.webContents.openDevTools();
}

// --- IPC: Manejo de Configuración y Diálogos ---
ipcMain.handle('config:get', () => {
    try {
        const configPath = getConfigPath();
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch (e) {
        console.error("Error leyendo config:", e);
    }
    // Configuración por defecto si no existe
    return { carpetaSchematics: null, apiUrl: "http://localhost:8080/api", token: null };
});

ipcMain.handle('config:set', (event, newConfig) => {
    try {
        fs.writeFileSync(getConfigPath(), JSON.stringify(newConfig, null, 2));
        return true;
    } catch (e) {
        console.error("Error guardando config:", e);
        return false;
    }
});

ipcMain.handle('dialog:elegir-carpeta', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Selecciona la carpeta schematics de Minecraft'
    });
    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});