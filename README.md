# CI/CD App

![CI Pipeline](https://github.com/nando-hn/ci-cd-app/actions/workflows/ci.yml/badge.svg)

## Descripción

Aplicación backend desarrollada con **Node.js + Express** que implementa operaciones CRUD sobre una base de datos **PostgreSQL**. Incluye pruebas unitarias con Jest + Supertest, contenedorización con Docker, y un pipeline de integración continua con GitHub Actions.

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Docker Compose                     │
│                                                      │
│  ┌────────────────┐       ┌────────────────────┐    │
│  │  app_backend    │──────▶│     app_db          │    │
│  │  (Node.js)      │       │   (PostgreSQL 15)   │    │
│  │  Port: 3000     │       │   Port: 5432        │    │
│  └────────────────┘       └────────────────────┘    │
│                                  │                   │
│                             ┌────┴──────┐            │
│                             │  Volume   │            │
│                             │ postgres  │            │
│                             │  _data    │            │
│                             └───────────┘            │
└─────────────────────────────────────────────────────┘
```

## Stack Tecnológico

| Tecnología | Uso |
|-----------|-----|
| Node.js + Express | Backend API |
| PostgreSQL | Base de datos |
| Jest + Supertest | Testing |
| ESLint | Linting |
| Docker + Docker Compose | Contenedorización |
| GitHub Actions | CI Pipeline |

## Instalación Local

### Prerrequisitos

- Node.js 18+
- npm

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/nando-hn/ci-cd-app.git
cd ci-cd-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
npm start
```

## Docker

### Levantar con Docker Compose

```bash
# Configurar variables de entorno
cp .env.example .env

# Levantar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (reset de datos)
docker-compose down -v
```

### Construir imagen individual

```bash
docker build -t ci-cd-app .
```

## Endpoints

| Método | Ruta | Descripción | Body | Response |
|--------|------|-------------|------|----------|
| `GET` | `/items` | Listar todos los items | — | `[{ "id": 1, "name": "Item 1" }]` |
| `POST` | `/items` | Crear un nuevo item | `{ "name": "Nuevo item" }` | `{ "id": 1, "name": "Nuevo item" }` (201) |
| `POST` | `/items` | Error: name faltante | `{}` | `{ "error": "Name is required" }` (400) |
| `DELETE` | `/items/:id` | Eliminar item por ID | — | `{ "message": "Deleted" }` (200) |
| `DELETE` | `/items/:id` | Error: item no existe | — | `{ "error": "Item not found" }` (404) |

### Ejemplos con curl

```bash
# Listar items
curl http://localhost:3000/items

# Crear item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi item"}'

# Eliminar item
curl -X DELETE http://localhost:3000/items/1
```

## Tests

```bash
# Ejecutar tests con cobertura
npm test

# Los tests requieren PostgreSQL corriendo
# Usar docker-compose para levantar la DB antes de testear
```

Cobertura mínima requerida: **≥ 70%** en líneas, ramas y funciones.

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de PostgreSQL | `db` / `localhost` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `password` |
| `DB_NAME` | Nombre de la base de datos | `app_db` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |

## Pipeline CI

El pipeline se ejecuta automáticamente en cada **push** y **pull request** a `main`:

1. **Lint** — Verifica estilo de código con ESLint
2. **Tests** — Ejecuta 6 tests unitarios contra PostgreSQL real
3. **Coverage** — Genera reporte de cobertura (umbral ≥ 70%)

## Pipeline CD

El pipeline de **Continuous Deployment (CD)** se ejecuta automáticamente en cada **push a la rama `main`**.

Este pipeline se encarga de:

1. Construir la imagen Docker de la aplicación
2. Autenticarse en Docker Hub mediante secrets del repositorio
3. Publicar la imagen en Docker Hub

### Imagen Docker

La imagen generada está disponible en:

https://hub.docker.com/r/nathanalegria/ci-cd-app

### Funcionamiento

- Se ejecuta automáticamente después de hacer merge a `main`
- Utiliza el archivo `.github/workflows/cd.yml`
- Usa Docker Buildx para construir la imagen
- Publica la imagen con el tag `latest`

### Secrets utilizados

Para el funcionamiento del CD pipeline se requieren los siguientes secrets en GitHub:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Autores

- **Luis Garcia** — Backend Developer
- **Hector Enriquez** — QA / Testing
- **Jonnathan Alegria** — DevOps / Infra
- **Beyson Martinez** — CI/CD + Documentación

## Licencia

ISC


