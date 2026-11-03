# Base de datos · MariaDB 11.4 en fimosito

**Estado:** operativa. Pila de Dockge `litecraft-db` (contenedor `litecraft_db`), con las tablas `usuarios`, `categorias` y `esquemas` creadas y las 4 categorías insertadas.

## Datos de conexión (para el equipo)

| Campo | Valor |
|---|---|
| Host | `100.79.155.84` (IP Tailscale de fimosito) |
| Puerto | `3307` |
| Base de datos | `litecraft_db` |
| Usuario | `litecraft_user` |
| Contraseña | **Se pasa por Discord en privado, nunca en el repo** |
| URL JDBC | `jdbc:mariadb://100.79.155.84:3307/litecraft_db` |

Requisito: tener Tailscale encendido y estar en la red de Sandro. Si `ping 100.79.155.84` no responde, no vais a llegar a la BD.

### Conectarse con DBeaver
Nueva conexión → **MariaDB** → Host `100.79.155.84`, Port `3307`, Database `litecraft_db`, usuario y contraseña de arriba → *Test Connection* (si pide descargar el driver, aceptad).

---

## Mantenimiento (Sandro)

Entrar a la consola de MariaDB en fimosito:
```bash
docker exec -it litecraft_db mariadb -u root -p
```

### Cambios aplicados respecto al schema inicial (03/11/2026)
```sql
USE litecraft_db;
ALTER TABLE esquemas ADD COLUMN IF NOT EXISTS nombre_archivo VARCHAR(255) NOT NULL AFTER archivo_url;
DELETE FROM usuarios WHERE username = 'admin';   -- tenía un hash BCrypt inventado
```

### Crear el administrador
Cuando exista el endpoint de registro, registraos normal desde la app y luego:
```sql
UPDATE litecraft_db.usuarios SET rol = 'ADMIN' WHERE username = 'vuestro_usuario';
```

### Montar la BD desde cero (si algún día hace falta)
1. Copiar `docker-compose.yml` como `compose.yaml` en `/opt/stacks/litecraft-db/` y `.env.example` como `.env` con contraseñas reales.
2. Copiar `schema.sql` a `/opt/stacks/litecraft-db/init/`.
3. Con la carpeta `data/` vacía, **Deploy** en Dockge: MariaDB crea la BD, el usuario y ejecuta el schema solo.
