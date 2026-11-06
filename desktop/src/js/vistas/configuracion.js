export async function renderConfiguracion(container, onSaved) {
    const config = await window.litecraft.getConfig();

    container.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto; background: var(--panel-bg); padding: 30px; border-radius: 8px; border: 1px solid var(--border-color);">
      <h2>Configuración de Schematics</h2>
      <p style="color: var(--text-muted); margin: 10px 0 20px 0;">
        Selecciona tu carpeta <code>schematics</code> de Minecraft para que las descargas se guarden automáticamente allí.
      </p>
      
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <input type="text" id="input-carpeta" readonly value="${config.carpetaSchematics || ''}" placeholder="Ninguna carpeta seleccionada..." style="flex: 1; padding: 10px;" />
        <button id="btn-explorar">Examinar...</button>
      </div>

      <button id="btn-guardar" style="width: 100%; padding: 12px;">Guardar y continuar</button>
      <p id="error-msg" style="color: #ff5252; margin-top: 12px; font-size: 0.9rem;"></p>
    </div>
  `;

    const inputCarpeta = container.querySelector('#input-carpeta');
    const btnExplorar = container.querySelector('#btn-explorar');
    const btnGuardar = container.querySelector('#btn-guardar');
    const errorMsg = container.querySelector('#error-msg');

    let carpetaSeleccionada = config.carpetaSchematics;

    btnExplorar.addEventListener('click', async () => {
        const ruta = await window.litecraft.elegirCarpeta();
        if (ruta) {
            carpetaSeleccionada = ruta;
            inputCarpeta.value = ruta;
            errorMsg.textContent = '';
        }
    });

    btnGuardar.addEventListener('click', async () => {
        if (!carpetaSeleccionada) {
            errorMsg.textContent = 'Por favor, selecciona una carpeta de schematics antes de continuar.';
            return;
        }

        const exito = await window.litecraft.setConfig({ ...config, carpetaSchematics: carpetaSeleccionada });
        if (exito) {
            onSaved();
        } else {
            errorMsg.textContent = 'Error al guardar la configuración en disco.';
        }
    });
}