import { subirEsquemaMock } from '../api.js';

export function renderSubir(container, onVolver) {
    container.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto; background: var(--panel-bg); padding: 30px; border-radius: 8px; border: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Publicar Nuevo Esquema</h2>
        <button id="btn-volver" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-main);">Volver al Catálogo</button>
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Título de la construcción</label>
        <input type="text" id="subir-titulo" placeholder="Ej: Granja de Oro eficiente" style="width: 100%; padding: 10px;" />
      </div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Categoría</label>
        <select id="subir-cat" style="width: 100%; padding: 10px; background: #121212; color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px;">
          <option value="Granjas">Granjas</option>
          <option value="Construcciones">Construcciones</option>
          <option value="Redstone">Redstone</option>
          <option value="Decoración">Decoración</option>
        </select>
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Archivo (.litematic o .schem)</label>
        <input type="file" id="subir-archivo" accept=".litematic,.schem" style="width: 100%; padding: 10px; background: #121212; border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-muted);" />
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Descripción breve</label>
        <textarea id="subir-desc" rows="3" style="width: 100%; padding: 10px; background: #121212; color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px;"></textarea>
      </div>

      <button id="btn-publicar" style="width: 100%; padding: 12px; font-size: 1rem;">Subir Esquema</button>
      <p id="subir-msg" style="margin-top: 15px; font-size: 0.9rem; text-align: center; font-weight: bold;"></p>
    </div>
  `;

    container.querySelector('#btn-volver').addEventListener('click', onVolver);

    const btnPublicar = container.querySelector('#btn-publicar');
    const msg = container.querySelector('#subir-msg');

    btnPublicar.addEventListener('click', async () => {
        const titulo = container.querySelector('#subir-titulo').value;
        const archivo = container.querySelector('#subir-archivo').files[0];

        if (!titulo || !archivo) {
            msg.style.color = '#ff5252';
            msg.textContent = 'Por favor, introduce un título y selecciona un archivo.';
            return;
        }

        msg.style.color = 'var(--text-main)';
        msg.textContent = 'Subiendo...';
        btnPublicar.disabled = true;

        const res = await subirEsquemaMock(titulo, container.querySelector('#subir-cat').value, null);
        if (res.ok) {
            msg.style.color = '#4caf50';
            msg.textContent = '✔ ¡Esquema publicado con éxito! (Simulado)';
            setTimeout(() => onVolver(), 1500);
        }
    });
}