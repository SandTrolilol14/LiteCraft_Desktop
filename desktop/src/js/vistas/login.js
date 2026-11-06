import { loginUser } from '../api.js';

export function renderLogin(container, onLoginSuccess, onGoToRegister) {
    container.innerHTML = `
    <div style="max-width: 400px; margin: 40px auto; background: var(--panel-bg); padding: 30px; border-radius: 8px; border: 1px solid var(--border-color);">
      <h2>Iniciar Sesión</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem;">Accede con tu cuenta de LiteCraft.</p>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Correo electrónico</label>
        <input type="text" id="login-email" value="test@litecraft.es" style="width: 100%; padding: 10px;" />
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-size: 0.9rem;">Contraseña</label>
        <input type="password" id="login-pass" value="123456" style="width: 100%; padding: 10px; background: var(--panel-bg); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 4px;" />
      </div>

      <button id="btn-login" style="width: 100%; padding: 12px; margin-bottom: 10px;">Entrar</button>
      <button id="btn-ir-registro" style="width: 100%; padding: 10px; background: transparent; border: 1px solid var(--border-color); color: var(--text-main);">¿No tienes cuenta? Regístrate</button>
      
      <p id="error-msg" style="color: #ff5252; margin-top: 12px; font-size: 0.9rem; text-align: center;"></p>
    </div>
  `;

    const emailInput = container.querySelector('#login-email');
    const passInput = container.querySelector('#login-pass');
    const btnLogin = container.querySelector('#btn-login');
    const btnIrRegistro = container.querySelector('#btn-ir-registro');
    const errorMsg = container.querySelector('#error-msg');

    btnLogin.addEventListener('click', async () => {
        const res = await loginUser(emailInput.value, passInput.value);
        if (res.ok) {
            onLoginSuccess(res.token);
        } else {
            errorMsg.textContent = res.mensaje;
        }
    });

    btnIrRegistro.addEventListener('click', () => {
        onGoToRegister();
    });
}