import { MOCK_ESQUEMAS } from './mock.js';

// Bandera para alternar entre Mock y API real
const USAR_MOCK = true;

export async function getEsquemas() {
    if (USAR_MOCK) {
        return { ok: true, data: MOCK_ESQUEMAS };
    }
    // Próximamente fetch() real para la Fase 3
}

export async function loginUser(email, password) {
    if (USAR_MOCK) {
        if (email === "test@litecraft.es" && password === "123456") {
            return { ok: true, token: "mock-token-abc123xyz" };
        }
        return { ok: false, mensaje: "Credenciales incorrectas (prueba test@litecraft.es / 123456)" };
    }
}

export async function registrarUser(nombre, email, password) {
    if (USAR_MOCK) {
        return { ok: true, token: "mock-token-nuevo" };
    }
}

export async function descargarEsquemaMock(id) {
    if (USAR_MOCK) {
        const esquema = MOCK_ESQUEMAS.find(e => e.id == id);
        const nombreArchivo = esquema ? esquema.archivoNombre : `esquema_${id}.litematic`;
        const contenidoSimulado = "Contenido binario simulado de Litematic para Minecraft";
        const base64 = btoa(contenidoSimulado);

        return { ok: true, nombreArchivo, bytesBase64: base64 };
    }
}