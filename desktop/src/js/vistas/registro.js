import { registrarUser } from '../api.js';

export function renderRegistro(container, onRegisterSuccess, onGoToLogin) {
    container.innerHTML = `
    <div style="max-width: 400px; margin: 40px auto; background: var(--panel-bg); padding: 30px; border-radius: 8px; border: 1px solid var(--border-color);">
      <h2>Registro de Usuario</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem;">Crea una nueva cuenta en LiteCraft.</p>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Nombre</label>
        <input type="text" id="reg-nombre" style="width: 100%; padding: 10px;" />
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Correo electrónico</label>
        <input type="text" id="reg-email" style="width: 100%; padding: 10px;" />
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Contraseña</label>
        <input type="password" id="reg-pass" style="width: 100%; padding: 10px; background: var(--panel-bg); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 4px;" />
      </div>

      <button id="btn-registrar" style="width: 100%; padding: 12px; margin-bottom: 10px;">Registrarse</button>
      <button id="btn-ir-login" style="width: 100%; padding: 10px; background: transparent; border: 1px solid var(--border-color); color: var(--text-main);">¿Ya tienes cuenta? Inicia sesión</button>
      
      <p id="error-msg" style="color: #ff5252; margin-top: 12px; font-size: 0.9rem; text-align: center;"></p>
    </div>
  `;

    const nombreInput = container.querySelector('#reg-nombre');
    const emailInput = container.querySelector('#reg-email');
    const passInput = container.querySelector('#reg-pass');
    const btnRegistrar = container.querySelector('#btn-registrar');
    const btnIrLogin = container.querySelector('#btn-ir-login');
    const errorMsg = container.querySelector('#error-msg');

    btnRegistrar.addEventListener('click', async () => {
        if (!nombreInput.value || !emailInput.value || !passInput.value) {
            errorMsg.textContent = 'Por favor, rellena todos los campos.';
            return;
        }
        const res = await registrarUser(nombreInput.value, emailInput.value, passInput.value);
        if (res.ok) {
            onRegisterSuccess(res.token);
        } else {
            errorMsg.textContent = res.mensaje || 'Error en el registro';
        }
    });

    btnIrLogin.addEventListener('click', () => {
        onGoToLogin();
    });
}