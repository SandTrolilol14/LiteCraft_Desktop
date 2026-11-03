# Contrato de la API REST · LiteCraft Desktop (v0.1)

Este archivo manda. Backend lo implementa, desktop lo consume. Cualquier cambio → PR que modifique este archivo.

- Base URL en desarrollo: `http://localhost:8080/api` · en el servidor: `http://100.79.155.84:8081/api`
- JSON en **camelCase**. Fechas en ISO-8601 (`2026-11-03T09:54:00`).
- Rutas protegidas: cabecera `Authorization: Bearer <token>`.

## Errores (formato único)
```json
{ "status": 400, "error": "BAD_REQUEST", "mensaje": "El email ya está registrado" }
```
Códigos: `400` validación · `401` sin token / token inválido · `403` sin permiso · `404` no existe · `409` duplicado · `500` interno.

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | `{ "status": "ok" }` — para comprobar que la API está viva |
| POST | `/auth/register` | No | Crear cuenta |
| POST | `/auth/login` | No | Iniciar sesión, devuelve JWT |
| GET | `/auth/me` | Sí | Datos del usuario logueado |
| GET | `/categorias` | No | Lista de categorías |
| GET | `/esquemas` | No | Catálogo paginado y filtrable |
| GET | `/esquemas/{id}` | No | Detalle de un esquema |
| POST | `/esquemas` | Sí | Publicar esquema (multipart) |
| GET | `/esquemas/{id}/descarga` | No | Descarga el archivo y suma 1 a `descargas` |
| GET | `/esquemas/{id}/imagen` | No | Imagen de portada (si tiene) |
| DELETE | `/esquemas/{id}` | Sí | Borrar (solo el autor o un ADMIN) |

### POST /auth/register
Request:
```json
{ "username": "steve", "email": "steve@mail.com", "password": "minimo8chars" }
```
Validación: username 3–50, email válido, password ≥ 8. Respuesta `201`:
```json
{ "id": 1, "username": "steve", "email": "steve@mail.com", "rol": "USER", "avatarUrl": null, "createdAt": "..." }
```

### POST /auth/login
Request (`login` acepta username **o** email):
```json
{ "login": "steve", "password": "minimo8chars" }
```
Respuesta `200`:
```json
{ "token": "eyJhbGciOi...", "tipo": "Bearer", "expiraEn": 86400, "usuario": { "id": 1, "username": "steve", "email": "...", "rol": "USER", "avatarUrl": null } }
```

### GET /categorias
```json
[ { "id": 1, "nombre": "Redstone", "descripcion": "..." } ]
```

### GET /esquemas
Query params (todos opcionales): `q` (busca en título), `categoriaId`, `version` (ej. `1.21`), `orden` (`recientes` | `descargas`), `page` (desde 0), `size` (por defecto 20).
```json
{
  "contenido": [
    {
      "id": 7, "titulo": "Granja de hierro", "descripcion": "...",
      "minecraftVersion": "1.21", "tamanoBytes": 48213, "descargas": 12,
      "nombreArchivo": "granja_hierro.litematic",
      "imagenUrl": "/api/esquemas/7/imagen",
      "categoria": { "id": 3, "nombre": "Granjas" },
      "autor": { "id": 1, "username": "steve" },
      "createdAt": "..."
    }
  ],
  "pagina": 0, "tamano": 20, "totalElementos": 1, "totalPaginas": 1
}
```

### GET /esquemas/{id}
Mismo objeto que cada elemento de `contenido`.

### POST /esquemas (multipart/form-data)
Campos: `archivo` (obligatorio, `.litematic`, `.schem` o `.schematic`, máx. 20 MB), `imagen` (opcional, png/jpg, máx. 5 MB), `titulo`, `descripcion`, `minecraftVersion`, `categoriaId`. Respuesta `201` con el esquema creado.

### GET /esquemas/{id}/descarga
Devuelve el binario con:
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="granja_hierro.litematic"
```
El frontend **usa el `filename` de esa cabecera** para guardarlo en la carpeta schematics del usuario.

## Notas de implementación
- Los archivos se guardan en disco en el servidor (`/data/uploads/esquemas/` y `/data/uploads/imagenes/`), con nombre `UUID + extensión`. En la BD, `archivo_url` guarda esa ruta relativa; `imagen_url` igual; `nombre_archivo` guarda el nombre original del fichero subido, que es el que se manda en la descarga.
