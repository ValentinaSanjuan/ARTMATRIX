# ArtMatrix

Software educativo gamificado para aprender **recorridos en matrices** con Java, guiado por Curi.
Universidad de la Amazonia — Proyectos Software 2026-2 — Binary Girls.

```text
ARTMATRIX/
├── apps/web/                     Frontend  React + TypeScript + Vite (+ intérprete Java limitado)
├── services/api/artmatrix-api/   Backend   Spring Boot 3.3 + Java 17 + MySQL 8.0 (Flyway)
├── infra/                        Script SQL y docker-compose de MySQL
├── scripts/                      Utilidades (copiar fondos de ImagenesArtMatrix)
└── docs/arquitectura.md          Relación con el documento de planificación
```

## Requisitos
- Java 17 (JDK) · Node.js 20+ · MySQL 8.0 · VS Code

## Primera vez

1. **Base de datos** — abre MySQL Workbench como `root` y ejecuta
   `infra/mysql/crear-base-datos.sql` (crea la base `artmatrix` y el usuario `artmatrix`/`artmatrix`).
   Las tablas y los datos de los 5 niveles se crean solos al arrancar el backend (Flyway).
   *Si prefieres usar tu usuario root:* define las variables `DB_USUARIO` y `DB_CLAVE` antes de arrancar.
2. **Fondos** — doble clic en `scripts/copiar-imagenes.bat` (copia `fondo1` y `fondo3` del Escritorio).

## Ejecutar (dos terminales o doble clic en los .bat)

```powershell
# Backend → http://localhost:8080
cd services/api/artmatrix-api
.\mvnw.cmd spring-boot:run

# Frontend → http://localhost:5173
cd apps/web
npm install
npm run dev
```

O simplemente: `iniciar-backend.bat` y `iniciar-frontend.bat`.

## Pruebas

```powershell
cd services/api/artmatrix-api; .\mvnw.cmd test      # reglas del dominio
cd apps/web; npm run test:interprete               # intérprete Java (19 casos)
cd apps/web; npm run build                         # verificación de tipos + build
```

## Lenguaje del editor

```java
colocar(fila, columna);   // coloca una obra en esa posición
matriz.length             // número de filas
matriz[0].length          // número de columnas
matriz[fila][columna]     // nombre de la obra, o "V" si está vacía
System.out.println(...);  // imprime en la consola
```
