# Base de datos · MariaDB 11.4 en fimosito

## Datos de conexión (para el equipo)

| Campo | Valor |
|---|---|
| Host | `100.79.155.84` (IP Tailscale de fimosito) |
| Puerto | `3307` |
| Base de datos | `litecraft_db` |
| Usuario | `litecraft_app` |
| Contraseña | **Se pasa por Discord en privado, nunca en el repo** |
| URL JDBC | `jdbc:mariadb://100.79.155.84:3307/litecraft_db` |

Requisito: tener Tailscale encendido y estar en la red de Sandro. Si `ping 100.79.155.84` no responde, no vais a llegar a la BD.

### Conectarse con DBeaver
Nueva conexión → **MariaDB** → Host `100.79.155.84`, Port `3307`, Database `litecraft_db`, usuario y contraseña de arriba → *Test Connection* (si pide descargar el driver, aceptad).

---

## Para Sandro: comprobar en qué estado quedó la BD

Por SSH en fimosito (Termius):

```bash
# 1. ¿Existe la pila y el contenedor?
ls /opt/stacks/ | grep -i lite
docker ps -a --filter name=litecraft

# 2. Si el contenedor está "Up", ¿qué hay dentro?
docker exec -it litecraft_db mariadb -u root -p -e "SHOW DATABASES; USE litecraft_db; SHOW TABLES; SELECT * FROM categorias; SELECT user,host FROM mysql.user;"
```

Según lo que salga:

| Resultado | Qué hacer |
|---|---|
| No hay pila ni contenedor | **Caso A**: crearla desde cero (abajo) |
| Contenedor existe pero no hay tablas | **Caso B**: ejecutar `schema.sql` a mano |
| Tablas y 4 categorías, pero no existe `litecraft_app` | **Caso C**: crear el usuario de la app |
| Todo está | Solo falta subir esta carpeta al repo y cerrar las issues #1 y #4 |

### Caso A · Crear la pila desde cero
1. En Dockge (`:5001`) → **+ Compose** → nombre `litecraft`.
2. Pegar el contenido de `docker-compose.yml`.
3. En el apartado `.env` de Dockge, pegar `.env.example` con contraseñas reales.
4. Copiar `schema.sql` a `/opt/stacks/litecraft/schema.sql` (con `nano` o subiéndolo).
5. **Deploy**. Como el volumen está vacío, MariaDB ejecuta `schema.sql` y crea `litecraft_app` solo.
6. Comprobar con el comando del paso 2.

### Caso B · Ejecutar el schema a mano
```bash
docker exec -i litecraft_db mariadb -u root -p < /opt/stacks/litecraft/schema.sql
```

### Caso C · Crear el usuario de la app
```bash
docker exec -it litecraft_db mariadb -u root -p
```
```sql
CREATE USER 'litecraft_app'@'%' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON litecraft_db.* TO 'litecraft_app'@'%';
FLUSH PRIVILEGES;
```

### Si las tablas ya existían (esquema antiguo)
El schema nuevo añade la columna `nombre_archivo` a `esquemas`. Si la tabla ya estaba creada:
```sql
ALTER TABLE litecraft_db.esquemas ADD COLUMN IF NOT EXISTS nombre_archivo VARCHAR(255) NOT NULL AFTER archivo_url;
```

> Si había un usuario `admin` con el hash inventado del schema antiguo, borradlo: `DELETE FROM litecraft_db.usuarios WHERE username='admin';`
