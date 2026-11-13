import { renderConfiguracion } from './vistas/configuracion.js';
import { renderLogin } from './vistas/login.js';
import { renderRegistro } from './vistas/registro.js';
import { renderCatalogo } from './vistas/catalogo.js';
import { renderSubir } from './vistas/subir.js';

async function init() {
    const appContainer = document.getElementById('app-container');
    const navUser = document.getElementById('nav-user-info');
    const config = await window.litecraft.getConfig();

    // 1. Configuración de carpeta
    if (!config.carpetaSchematics) {
        navUser.textContent = 'Configuración inicial';
        renderConfiguracion(appContainer, () => init());
        return;
    }

    // 2. Autenticación (Login / Registro)
    if (!config.token) {
        navUser.textContent = 'Autenticación';
        renderLogin(
            appContainer,
            async (token) => {
                await window.litecraft.setConfig({ ...config, token });
                init();
            },
            () => {
                renderRegistro(
                    appContainer,
                    async (token) => {
                        await window.litecraft.setConfig({ ...config, token });
                        init();
                    },
                    () => init()
                );
            }
        );
        return;
    }

    // 3. Catálogo principal y Navegación
    const mostrarCatalogo = () => {
        navUser.textContent = 'Catálogo activo';
        renderCatalogo(
            appContainer,
            async () => { // Lógica Cerrar Sesión
                await window.litecraft.setConfig({ ...config, token: null });
                init();
            },
            () => { // Lógica Ir a Subir Esquema
                navUser.textContent = 'Publicar Esquema';
                renderSubir(appContainer, mostrarCatalogo);
            }
        );
    };

    mostrarCatalogo();
}

init();