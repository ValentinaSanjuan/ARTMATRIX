# Arquitectura de ArtMatrix

Este documento relaciona el código con el **1er Entregable – Planificación del proyecto** (Binary Girls).

## 1. Entornos (Fig. 3 – Diagrama de arquitectura)

| Entorno del documento | Dónde está en el código |
|---|---|
| **Entorno cliente** – Navegador web | `apps/web` (React + TypeScript + Vite) |
| Galería / niveles | `presentation/pages/InicioPage.tsx`, `NivelPage.tsx`, `components/galeria/TableroGaleria.tsx` |
| Curi – guía virtual | `presentation/components/curi/Curi.tsx` + mensajes `mensaje_curi` |
| Editor de código Java | `presentation/components/editor/EditorCodigo.tsx` (Monaco) |
| Progreso y recompensas | `presentation/pages/PerfilPage.tsx`, `PanelNivelCompletado.tsx` |
| Tutorial interactivo | `presentation/pages/TutorialPage.tsx` |
| **Entorno de aplicación** – Servidor ArtMatrix | `services/api/artmatrix-api` (Spring Boot 3.3, Java 17) |
| API / Controlador de aplicación | `presentation/controller/*` |
| Servicio de usuarios y autenticación | `application/service/AutenticacionService` + JWT (`infrastructure/security`) |
| Servicio de niveles y desafíos | `application/service/NivelDesafioService` |
| Motor de aprendizaje | `domain/rule/ValidadorRecorrido`, `domain/model/*` |
| Servicio de orientación | `application/service/OrientacionService` (Curi, pistas, retroalimentación) |
| Servicio de evaluación | `application/service/EvaluacionService` |
| Servicio de progreso y recompensas | `application/service/ProgresoRecompensaService`, `domain/rule/CalculadoraRecompensas` |
| **Entorno de ejecución de código** | `apps/web/src/infrastructure/interprete` (ver nota) |
| **Entorno de datos** – Base de datos relacional | MySQL 8.0, migraciones en `src/main/resources/db/migration` |
| Repositorio de contenido (obras, recursos) | `apps/web/public/img` + tabla `obra.recurso_url` |

**Nota sobre la ejecución de código.** El diagrama de arquitectura muestra un sandbox; el
diagrama de despliegue (Fig. 5) lo concreta como *“Intérprete propio v1.0 – Ejecución limitada de Java”*
dentro del navegador. Se implementó esta segunda opción: el intérprete ejecuta un subconjunto
de Java (variables, `for`, `while`, `if/else`, `%`, `&&`, `||`, `System.out.println`, `matriz.length`)
y produce la secuencia de posiciones que se anima sobre la galería (RF-11). El servidor recibe ese
recorrido y lo valida con el motor de aprendizaje, por lo que el resultado no depende del cliente.
El valor `C++` del ENUM `solucion_codigo.lenguaje` queda reservado.

## 2. Capas (iguales en frontend y backend)

| Capa | Responsabilidad | Depende de |
|---|---|---|
| `presentation` | Pantallas, componentes, controladores REST, DTOs | application |
| `application` | Casos de uso / servicios, estado, puertos | domain |
| `domain` | Modelos y reglas puras (sin Spring, sin React) | — |
| `infrastructure` | MySQL/JPA, JWT, Axios, intérprete, recursos | application, domain |

## 3. Modelo relacional (Fig. 2)

Tablas creadas tal como en la figura: `estudiante`, `nivel`, `desafio`, `obra`, `desafio_obra`,
`intento_desafio`, `solucion_codigo`, `detalle_recorrido`, `pista`, `mensaje_curi`,
`progreso_nivel`, `recompensa`, `estudiante_recompensa`.

Columnas añadidas (marcadas con `[+]` en `V1__init.sql`) y por qué:

| Columna | Motivo |
|---|---|
| `estudiante.telefono`, `programa`, `curso` | Campos del mockup de registro (Fig. 7) y perfil (Fig. 23) |
| `estudiante.tutorial_completado` | RF-03: retomar el tutorial si se abandona |
| `desafio.orden`, `desafio.configuracion` (JSON) | Orden dentro de la sala; tamaño de la matriz, solución y modo de validación |
| `obra.recurso_url` | Ruta del sprite (`recurso_visual` MEDIUMBLOB queda opcional) |
| `progreso_nivel.estrellas`, `puntos` | RF-12: recompensas por sala |

## 4. Requisitos funcionales → implementación

| RF | Dónde |
|---|---|
| RF-01 Registrar estudiante | `POST /api/auth/registro` · `RegistroPage` |
| RF-02 Iniciar sesión | `POST /api/auth/login` · `LoginPage` |
| RF-03 Tutorial | `TutorialPage` · `POST /api/progreso/tutorial` |
| RF-04 Avanzar nivel | `GET /api/niveles` · `ReglaDesbloqueo` (todas las salas abiertas) · `InicioPage` |
| RF-05 Representar matrices | `TableroGaleria` (índices, obras, celdas vacías) |
| RF-06 Manipular obras | Desafíos `UBICAR`: arrastrar y soltar o flechas + COLOCAR AQUÍ |
| RF-07 Recorrer matrices | Desafíos `RECORRIDO`: selección en orden, resaltado y señal del paso erróneo |
| RF-08 Desafíos gamificados | `POST /api/desafios/{id}/evaluar` · `EvaluacionService` |
| RF-09 Pistas progresivas | `GET /api/desafios/{id}/pistas/{n}` · panel AYUDA |
| RF-10 Editor de código | `EditorCodigo` (Monaco, Java) |
| RF-11 Visualizar el código | Intérprete + animación secuencial + validación en servidor |
| RF-12 Recompensas | `CalculadoraRecompensas`, `estudiante_recompensa`, panel de nivel completado |
| RF-13 Seguimiento del progreso | `GET /api/progreso` · `PerfilPage` |
| RF-14 Curi | `Curi.tsx`, `mensaje_curi`, `OrientacionService` |
| Teoría (opcional) | `TeoriaPage` (`/teoria`) · `contenido/teoria.ts` · botón VER TEORÍA en las instrucciones de cada nivel |

## 5. Contenido de los niveles (Fig. 11–22, ampliado)

| Nivel | Misiones | Tipo |
|---|---|---|
| 1 Sala de Iniciación | *La noche estrellada* en `[2][3]`; *El grito* en `[4][1]`; *El beso* en la primera fila y última columna | UBICAR |
| 2 Llenado de espacios | Fila 1; columna 3; fila 5 de derecha a izquierda; diagonal principal | RECORRIDO |
| 3 Condiciones pares | Fila 2 con un `for`; columna 4 en filas pares; columnas impares de la fila 1 | CÓDIGO (con código inicial) |
| 4 Recorrido perimetral | Bordes; cuatro esquinas; solo el interior | CÓDIGO (editor vacío) |
| 5 Exposición Maestra | Múltiplos de 2; serpiente; diagonales cruzadas; ronda en sentido horario; llenar huecos leyendo la matriz | CÓDIGO (editor vacío, máximo 1–2 pistas) |

Cada nivel tiene su propio fondo (`public/img/fondos/nivel1..5.jpg`), generado con Gemini en el mismo estilo pixel art.

Estrellas: 3 sin pistas ni errores; 2 con hasta 1 pista y 2 errores; 1 en otro caso.
