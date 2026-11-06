import { renderConfiguracion } from './vistas/configuracion.js';

async function init() {
    const appContainer = document.getElementById('app-container');
    const navUser = document.getElementById('nav-user-info');
    const config = await window.litecraft.getConfig();

    if (!config.carpetaSchematics) {
        navUser.textContent = 'Configuración inicial';
        renderConfiguracion(appContainer, () => {
            init();
        });
    } else {
        navUser.textContent = 'Conectado / Configurado';
        appContainer.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; background: var(--panel-bg); padding: 30px; border-radius: 8px; border: 1px solid var(--border-color);">
        <h2>¡Fase 1 completada con éxito!</h2>
        <p style="color: var(--text-muted); margin: 15px 0;">Carpeta schematics configurada:</p>
        <code style="display: block; background: #121212; padding: 10px; border-radius: 4px; word-break: break-all;">${config.carpetaSchematics}</code>
        <p style="margin-top: 20px; color: #4caf50; font-weight: bold;">✔ Preparados para la Fase 2 (Vistas con Mock).</p>
      </div>
    `;
    }
}

init();