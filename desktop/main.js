const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

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

// --- IPC: Configuración y Diálogos ---
ipcMain.handle('config:get', () => {
    try {
        const configPath = getConfigPath();
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch (e) {
        console.error("Error leyendo config:", e);
    }
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

// --- IPC: Guardar esquemas en disco ---
ipcMain.handle('esquema:guardar', async (event, { nombreArchivo, contenidoBase64 }) => {
    try {
        const configPath = getConfigPath();
        if (!fs.existsSync(configPath)) return { ok: false, mensaje: "No hay configuración" };

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const carpeta = config.carpetaSchematics;
        if (!carpeta) return { ok: false, mensaje: "Carpeta schematics no configurada" };

        let rutaFinal = path.join(carpeta, nombreArchivo);

        let contador = 1;
        const ext = path.extname(nombreArchivo);
        const basename = path.basename(nombreArchivo, ext);
        const dir = path.dirname(rutaFinal);

        while (fs.existsSync(rutaFinal)) {
            rutaFinal = path.join(dir, `${basename} (${contador})${ext}`);
            contador++;
        }

        fs.writeFileSync(rutaFinal, Buffer.from(contenidoBase64, 'base64'));
        return { ok: true, ruta: rutaFinal };
    } catch (e) {
        console.error("Error guardando esquema:", e);
        return { ok: false, mensaje: e.message };
    }
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