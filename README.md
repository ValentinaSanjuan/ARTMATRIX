# ArtMatrix

Software educativo gamificado para aprender **recorridos en matrices** con Java, guiado por Curi.
Universidad de la Amazonia — Proyectos Software 2026-2 — Binary Girls.

```text
ARTMATRIX/
├── apps/web/                     Frontend  React + TypeScript + Vite (+ intérprete Java limitado)
├── services/api/artmatrix-api/   Backend   Spring Boot 3.3 + Java 17 + MySQL 8.0 (Flyway)
├── infra/mysql/                  Script para crear la base de datos y el usuario
├── scripts/                      crear-base-datos.bat
├── docs/arquitectura.md          Relación con el documento de planificación
├── ARRANCAR-ARTMATRIX.bat        Arranca backend + frontend y abre el navegador
└── render.yaml                   Despliegue del backend en Render
```

## Requisitos
- Java 17 (JDK) · Node.js 20+ · MySQL 8.0 · VS Code

## Primera vez

1. **Base de datos** — doble clic en `scripts/crear-base-datos.bat` (pide la contraseña de root),
   o ejecuta `infra/mysql/crear-base-datos.sql` en MySQL Workbench.
   Crea la base `artmatrix` y el usuario `artmatrix`/`artmatrix`.
   Las tablas y los datos de los 5 niveles se crean solos al arrancar el backend (Flyway).

## Ejecutar en tu PC

Doble clic en **`ARRANCAR-ARTMATRIX.bat`** (desde el Explorador de archivos). Abre dos ventanas
(backend y frontend) y luego el navegador en **http://localhost:5173**. No cierres esas ventanas mientras juegas.

O a mano, en dos terminales:

```powershell
# Backend → http://localhost:8080
cd services/api/artmatrix-api
.\mvnw.cmd spring-boot:run

# Frontend → http://localhost:5173
cd apps/web
npm install
npm run dev
```

## Contenido

- **Tutorial** con Curi (5 pasos).
- **Teoría (opcional)**: matrices, índices, recorridos por filas y columnas, condiciones con `%`,
  recorrido perimetral, dos condiciones a la vez y errores comunes. Se abre desde el inicio, el menú,
  al terminar el tutorial o con **VER TEORÍA** en las instrucciones de cada nivel.
- **5 niveles con 18 misiones**, todos disponibles desde el inicio. Desde el nivel 4 el editor empieza vacío y el nivel 5 trae retos avanzados con menos pistas.
- Diseño adaptable a celulares (la página se desplaza y la barra de botones queda fija abajo).

## Pruebas

```powershell
cd services/api/artmatrix-api; .\mvnw.cmd test      # reglas del dominio
cd apps/web; npm run test:interprete               # intérprete Java
cd apps/web; npm run build                         # verificación de tipos + build
```

## Publicar en la web

| Parte | Servicio | Configuración |
|---|---|---|
| Base de datos | Aiven (MySQL, plan Free) | Copia host, puerto, usuario y contraseña |
| Backend | Render (New → Blueprint, usa `render.yaml`) | Variables `DB_URL`, `DB_USUARIO`, `DB_CLAVE`, `CORS_ORIGENES` |
| Frontend | Vercel (Root Directory `apps/web`) | Variable `VITE_API_URL` = dirección del backend en Render |

- `DB_URL` = `jdbc:mysql://HOST:PUERTO/defaultdb?sslMode=REQUIRED`
- `CORS_ORIGENES` = la dirección que te da Vercel (por ejemplo `https://artmatrix.vercel.app`)
- `JWT_SECRETO` lo genera Render automáticamente.

## Lenguaje del editor

```java
colocar(fila, columna);   // coloca una obra en esa posición
matriz.length             // número de filas
matriz[0].length          // número de columnas
matriz[fila][columna]     // nombre de la obra, o "V" si está vacía
System.out.println(...);  // imprime en la consola
```
