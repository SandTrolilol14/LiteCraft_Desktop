# Prompt para Jose Luis Mba · Backend (Issue #2)

**Cómo usarlo:** abre un chat nuevo con tu IA, **adjunta estos 3 archivos del repo** (`docs/API.md`, `database/schema.sql`, `docs/DECISIONES.md`) y pega todo lo que hay debajo de la línea.

---

Eres mi tutor y compañero de programación para el backend de nuestro TFG de 2º de DAM. Soy estudiante: explícame cada paso de forma clara y breve, y no avances al siguiente hasta que te confirme que el anterior funciona.

## El proyecto
**LiteCraft Desktop**: app de escritorio para publicar, buscar y descargar esquemas de construcción de Minecraft (`.litematic`, `.schem`). Al descargar, la app de escritorio (Electron, la hace otro compañero) guarda el archivo directamente en la carpeta `schematics` del usuario. Yo hago **la API REST** que esa app consume.

Repo: https://github.com/SandTrolilol14/LiteCraft_Desktop (monorepo: `backend/`, `desktop/`, `database/`, `docs/`). Te adjunto `docs/API.md` (contrato de la API, **es obligatorio cumplirlo tal cual**), `database/schema.sql` (tablas reales) y `docs/DECISIONES.md`.

## Stack obligatorio
- Java 21, **Spring Boot 3.x**, **Maven** (con Maven Wrapper `mvnw`).
- Dependencias: Spring Web, Spring Data JPA, Validation, Spring Security, driver **MariaDB** (`org.mariadb.jdbc:mariadb-java-client`), Lombok, JJWT (`io.jsonwebtoken`) para JWT. BCrypt para contraseñas.
- groupId `com.litecraft`, artifactId `litecraft-api`, paquete base `com.litecraft.api`.
- El proyecto va en la carpeta `backend/` del repo (no en la raíz).

## Estructura de paquetes
```
com.litecraft.api
├── controller   (REST, solo reciben y devuelven DTOs)
├── service      (lógica de negocio)
├── repository   (interfaces JpaRepository)
├── model        (entidades JPA: Usuario, Categoria, Esquema; enum Rol)
├── dto          (request/response; NUNCA devolver entidades ni password_hash)
├── security     (JwtService, filtro JWT, SecurityConfig)
├── config       (CORS, almacenamiento de ficheros)
└── exception    (GlobalExceptionHandler con @RestControllerAdvice y el formato de error de API.md)
```

## Base de datos (ya existe, NO la generes con Hibernate)
- MariaDB 11.4 en el servidor del equipo, accesible por Tailscale.
- URL: `jdbc:mariadb://100.79.155.84:3307/litecraft_db` · usuario `litecraft_app` · la contraseña me la pasa Sandro.
- `spring.jpa.hibernate.ddl-auto=validate` (las entidades deben coincidir EXACTAMENTE con `schema.sql`: nombres de tabla y columna en snake_case, `rol` es ENUM('USER','ADMIN'), `categorias.id` es INT y el resto BIGINT).
- Las credenciales van en variables de entorno: `application.yml` usa `${DB_URL}`, `${DB_USER}`, `${DB_PASSWORD}`, `${JWT_SECRET}`, `${UPLOAD_DIR:./uploads}`. Crea también `application-example.yml` documentado. **Ningún secreto en el código** (el repo es compartido).

## Reglas del equipo (GitFlow)
- Trabajo en la rama `feature/2-backend-init` creada desde `develop`. Al terminar, PR a `develop` para que la revise un compañero.
- Commits pequeños, en español e imperativo ("Añade entidad Usuario").
- Respeta el `.gitignore` de la raíz (`target/`, `.idea/`, `.env`...).

## Qué quiero hacer, en este orden (una fase cada vez)
**Fase 1 · Esqueleto (cierra la issue #2):**
1. Generar el proyecto (dime exactamente qué marcar en https://start.spring.io o dame el `pom.xml`).
2. Crear los paquetes y `application.yml` con variables de entorno.
3. Endpoint `GET /api/health` → `{"status":"ok"}`.
4. Probar que conecta a MariaDB: entidad `Categoria` + `GET /api/categorias` que devuelva las 4 categorías que ya hay en la BD.
5. Explicarme cómo ejecutarlo en IntelliJ con las variables de entorno y cómo probarlo con Postman o el navegador.

**Fase 2 · Autenticación (Sprint 1):** entidades `Usuario` y `Esquema`, `POST /api/auth/register`, `POST /api/auth/login` (devuelve JWT, `login` acepta username o email), `GET /api/auth/me`, contraseñas con BCrypt, `SecurityConfig` stateless, CORS abierto para la app de escritorio, errores con el formato de `API.md`.

**Fase 3 · CRUD de esquemas (Sprint 1):** `GET /api/esquemas` (paginado, filtros `q`, `categoriaId`, `version`, `orden`), `GET /api/esquemas/{id}`, `POST /api/esquemas` multipart (guardar fichero en `UPLOAD_DIR` con nombre UUID, validar extensión `.litematic/.schem/.schematic` y tamaño ≤ 20 MB), `GET /api/esquemas/{id}/descarga` (con `Content-Disposition` y sumando 1 a `descargas`), `GET /api/esquemas/{id}/imagen`, `DELETE /api/esquemas/{id}` (solo autor o ADMIN).

Empieza por la **Fase 1, paso 1**. Si ves algo en el contrato o en el schema que no cuadra, avísame antes de inventarte nada: cualquier cambio en `API.md` lo tengo que hablar con el equipo.
