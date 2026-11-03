# LiteCraft Desktop

Aplicación de escritorio para explorar, publicar y descargar esquemas de construcción de Minecraft (`.litematic`, `.schem`). Al descargar un esquema, la app lo guarda **directamente en la carpeta `schematics` del usuario**, sin moverlo a mano.

TFG de 2º DAM · Sandro Sanvicente Sánchez · Jose Luis Mba Bechiro Mifumu · Jose Luis Martin Blanco

## Arquitectura

```
┌──────────────────────┐   HTTP/JSON + JWT   ┌──────────────────────┐   JDBC   ┌──────────────────┐
│  desktop/  (Electron)│ ──────────────────▶ │ backend/ (Spring Boot│ ───────▶ │ MariaDB 11.4     │
│  HTML + CSS + JS     │                     │ Java 21, REST API)   │          │ (fimosito :3307) │
│  guarda en           │ ◀── archivo binario │ guarda los ficheros  │          └──────────────────┘
│  .minecraft/schematics│                    │ en un volumen Docker │
└──────────────────────┘                     └──────────────────────┘
```

| Carpeta | Qué hay | Responsable |
|---|---|---|
| `database/` | `docker-compose.yml`, `schema.sql` y guía de conexión | Sandro |
| `backend/` | API REST en Spring Boot (Maven, Java 21) | Jose Luis Mba |
| `desktop/` | App de escritorio Electron (HTML/CSS/JS) | Jose Luis Martin |
| `docs/` | Acta, decisiones técnicas, contrato de la API y prompts | Todos |

**Antes de programar nada, leed [`docs/API.md`](docs/API.md)**: es el contrato entre backend y frontend. Si alguien necesita cambiarlo, se habla en Discord y se cambia ese archivo en una PR.

## Flujo de trabajo (GitFlow)

- `main` → solo versiones entregables.
- `develop` → rama de integración (por defecto).
- `feature/<issue>-<nombre-corto>` → una rama por issue, sale de `develop` y vuelve por **Pull Request** con al menos una revisión de otro miembro.
  - Ej.: `feature/2-backend-init`, `feature/3-frontend-layout`, `feature/4-database-setup`.
- Commits en español y en imperativo: `Añade entidad Usuario`, `Corrige puerto JDBC`.
- **Nunca** se suben contraseñas, tokens ni `.env`. Solo los `*.example`.

## Puesta en marcha rápida

1. Uníos a la red Tailscale del servidor (pedídselo a Sandro) y comprobad que llegáis: `ping 100.79.155.84`.
2. Base de datos → ver [`database/README.md`](database/README.md).
3. Backend → ver `backend/README.md`.
4. Desktop → ver `desktop/README.md`.
