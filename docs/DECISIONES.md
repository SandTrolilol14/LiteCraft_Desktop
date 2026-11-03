# Decisiones técnicas

Registro de decisiones del equipo. Cada una con fecha y motivo, para poder justificarlas en la memoria y la defensa.

| # | Fecha | Decisión | Motivo |
|---|---|---|---|
| 1 | 03/11/2026 | **Backend: Spring Boot 3 + Java 21 + Maven** | El acta dice "Java" para el backend. Spring Boot da la arquitectura en capas (controller/service/repository/model), JPA para MariaDB y Spring Security para JWT + BCrypt. Es lo que se usa en la empresa y en DAM. |
| 2 | 03/11/2026 | **Frontend: Electron (HTML + CSS + JavaScript sin frameworks)** | El acta dice "fast API (html, css y JavaScript)", que se interpreta como una API rápida consumida desde HTML/CSS/JS (no el framework FastAPI de Python). Una web normal en el navegador **no puede escribir en la carpeta `.minecraft/schematics`**; Electron sí, y permite seguir usando HTML/CSS/JS. |
| 3 | 03/11/2026 | **Contrato de API en `docs/API.md`** | Backend y frontend trabajan en paralelo. El frontend usa datos falsos (mock) con la misma forma que la API hasta que el backend esté listo. |
| 4 | 03/11/2026 | **Ficheros en disco, no en la BD** | Los `.litematic` se guardan en un volumen del servidor; la BD solo guarda la ruta, el nombre original y el tamaño. |
| 5 | 03/11/2026 | **Admin no se crea en `schema.sql`** | El hash BCrypt que había era inventado. El admin se crea registrándose y cambiando su `rol` a mano. |
| 6 | 03/11/2026 | **Secretos fuera del repo** | Contraseñas de BD y clave JWT en variables de entorno / `.env`. En el repo solo `*.example`. |

## Nota sobre el acta
- El acta menciona "desde cualquier lugar de forma cómoda gracias al móvil". El MVP es **de escritorio**; el móvil queda como mejora futura.
- Las fechas de los Sprints 3–5 en el acta pone **2026** pero son **2027** (van después de Navidad). Corregir en la próxima versión del acta.
