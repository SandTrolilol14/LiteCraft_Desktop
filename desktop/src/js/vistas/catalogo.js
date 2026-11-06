import { getEsquemas, descargarEsquemaMock } from '../api.js';

export async function renderCatalogo(container, onLogout) {
    const res = await getEsquemas();
    const esquemas = res.ok ? res.data : [];

    container.innerHTML = `
    <div style="max-width: 1000px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Catálogo de Esquemas</h2>
        <button id="btn-logout" style="background: #d32f2f; padding: 6px 12px; font-size: 0.85rem;">Cerrar sesión</button>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 25px;">Explora y descarga construcciones directamente a tu carpeta de Minecraft.</p>
      
      <div id="mensaje-aviso" style="display: none; padding: 12px; margin-bottom: 20px; background: #1b5e20; color: #a5d6a7; border-radius: 4px;"></div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
        ${esquemas.map(e => `
          <div style="background: var(--panel-bg); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
            <img src="${e.imagen}" alt="${e.titulo}" style="width: 100%; height: 150px; object-fit: cover;" />
            <div style="padding: 15px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 0.75rem; background: var(--accent-color); padding: 2px 6px; border-radius: 4px; color: white;">${e.categoria}</span>
                <h3 style="margin: 8px 0 5px 0; font-size: 1.05rem;">${e.titulo}</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 8px;">Por ${e.autor} · v${e.versionMinecraft}</p>
                <p style="font-size: 0.85rem; color: #ccc;">${e.descripcion}</p>
              </div>
              <button class="btn-descargar" data-id="${e.id}" style="margin-top: 15px; width: 100%;">Descargar</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

    container.querySelector('#btn-logout').addEventListener('click', onLogout);
    const mensajeAviso = container.querySelector('#mensaje-aviso');

    container.querySelectorAll('.btn-descargar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const resultadoDescarga = await descargarEsquemaMock(id);

            if (resultadoDescarga.ok) {
                const guardado = await window.litecraft.guardarEsquema(
                    resultadoDescarga.nombreArchivo,
                    resultadoDescarga.bytesBase64
                );

                if (guardado.ok) {
                    mensajeAviso.style.display = 'block';
                    mensajeAviso.textContent = `✔ ¡Guardado con éxito en: ${guardado.ruta}`;
                } else {
                    alert("Error al guardar: " + guardado.mensaje);
                }
            }
        });
    });
}