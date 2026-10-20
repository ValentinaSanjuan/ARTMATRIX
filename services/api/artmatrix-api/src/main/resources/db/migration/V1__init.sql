-- =====================================================================
-- ArtMatrix — Modelo relacional (Figura 2 del documento de planificación)
-- RDBMS: MySQL 8.0
--
-- Columnas añadidas respecto a la figura (marcadas con "-- [+]"):
--   estudiante.telefono / programa / curso  -> campos del mockup de registro (Fig. 7) y perfil (Fig. 23)
--   estudiante.tutorial_completado           -> RF-03: permitir retomar el tutorial
--   desafio.configuracion (JSON)             -> tamaño de la matriz, solución y modo de validación
--   obra.recurso_url                         -> ruta del sprite; recurso_visual queda opcional
--   progreso_nivel.estrellas / puntos        -> RF-12: recompensas por nivel
-- =====================================================================

CREATE TABLE estudiante (
    id_estudiante       INT AUTO_INCREMENT PRIMARY KEY,
    nombre              VARCHAR(100) NOT NULL,
    correo              VARCHAR(120) NOT NULL UNIQUE,
    usuario             VARCHAR(60)  NOT NULL UNIQUE,
    contrasena_hash     VARCHAR(255) NOT NULL,
    telefono            VARCHAR(30)  NULL,              -- [+]
    programa            VARCHAR(120) NULL,              -- [+]
    curso               VARCHAR(60)  NULL,              -- [+]
    tutorial_completado BOOLEAN      NOT NULL DEFAULT FALSE, -- [+]
    fecha_registro      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE nivel (
    id_nivel          INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    descripcion       TEXT         NOT NULL,
    dificultad        VARCHAR(30)  NOT NULL,
    orden_referencial INT          NOT NULL UNIQUE
) ENGINE = InnoDB;

CREATE TABLE desafio (
    id_desafio    INT AUTO_INCREMENT PRIMARY KEY,
    id_nivel      INT          NOT NULL,
    nombre        VARCHAR(120) NOT NULL,
    descripcion   TEXT         NOT NULL,
    tipo_desafio  VARCHAR(40)  NOT NULL,   -- UBICAR | RECORRIDO | CODIGO
    instrucciones TEXT         NOT NULL,
    orden         INT          NOT NULL DEFAULT 1, -- [+] orden del desafío dentro del nivel
    configuracion JSON         NOT NULL,           -- [+]
    CONSTRAINT fk_desafio_nivel FOREIGN KEY (id_nivel) REFERENCES nivel (id_nivel)
) ENGINE = InnoDB;

CREATE TABLE obra (
    id_obra        INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(120)  NOT NULL,
    autor          VARCHAR(120)  NOT NULL,
    valor          DECIMAL(12,2) NOT NULL DEFAULT 0,
    recurso_visual MEDIUMBLOB    NULL,
    recurso_url    VARCHAR(255)  NULL          -- [+]
) ENGINE = InnoDB;

CREATE TABLE desafio_obra (
    id_desafio_obra INT AUTO_INCREMENT PRIMARY KEY,
    id_desafio      INT NOT NULL,
    id_obra         INT NOT NULL,
    fila_inicial    INT NOT NULL,
    columna_inicial INT NOT NULL,
    CONSTRAINT fk_do_desafio FOREIGN KEY (id_desafio) REFERENCES desafio (id_desafio),
    CONSTRAINT fk_do_obra    FOREIGN KEY (id_obra)    REFERENCES obra (id_obra)
) ENGINE = InnoDB;

CREATE TABLE pista (
    id_pista    INT AUTO_INCREMENT PRIMARY KEY,
    id_desafio  INT  NOT NULL,
    orden_pista INT  NOT NULL,
    contenido   TEXT NOT NULL,
    CONSTRAINT fk_pista_desafio FOREIGN KEY (id_desafio) REFERENCES desafio (id_desafio),
    CONSTRAINT uq_pista UNIQUE (id_desafio, orden_pista)
) ENGINE = InnoDB;

CREATE TABLE mensaje_curi (
    id_mensaje           INT AUTO_INCREMENT PRIMARY KEY,
    id_desafio           INT          NOT NULL,
    tipo                 VARCHAR(30)  NOT NULL,  -- INTRO | EXITO | ERROR | ANIMO
    contenido            TEXT         NOT NULL,
    condicion_activacion VARCHAR(120) NULL,
    CONSTRAINT fk_mensaje_desafio FOREIGN KEY (id_desafio) REFERENCES desafio (id_desafio)
) ENGINE = InnoDB;

CREATE TABLE intento_desafio (
    id_intento    INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT          NOT NULL,
    id_desafio    INT          NOT NULL,
    fecha_inicio  DATETIME     NOT NULL,
    fecha_fin     DATETIME     NULL,
    estado        VARCHAR(30)  NOT NULL,   -- CORRECTO | INCORRECTO
    resultado     DECIMAL(5,2) NOT NULL DEFAULT 0,
    pistas_usadas INT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_intento_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante (id_estudiante),
    CONSTRAINT fk_intento_desafio    FOREIGN KEY (id_desafio)    REFERENCES desafio (id_desafio)
) ENGINE = InnoDB;

CREATE TABLE solucion_codigo (
    id_solucion INT AUTO_INCREMENT PRIMARY KEY,
    id_intento  INT                  NOT NULL,
    lenguaje    ENUM ('Java', 'C++') NOT NULL,
    codigo      TEXT                 NOT NULL,
    salida      TEXT                 NULL,
    es_correcta BOOLEAN              NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_solucion_intento FOREIGN KEY (id_intento) REFERENCES intento_desafio (id_intento)
) ENGINE = InnoDB;

CREATE TABLE detalle_recorrido (
    id_detalle   INT AUTO_INCREMENT PRIMARY KEY,
    id_intento   INT NOT NULL,
    orden_visita INT NOT NULL,
    fila         INT NOT NULL,
    columna      INT NOT NULL,
    CONSTRAINT fk_detalle_intento FOREIGN KEY (id_intento) REFERENCES intento_desafio (id_intento)
) ENGINE = InnoDB;

CREATE TABLE progreso_nivel (
    id_progreso         INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante       INT          NOT NULL,
    id_nivel            INT          NOT NULL,
    estado              VARCHAR(30)  NOT NULL,   -- BLOQUEADO | DISPONIBLE | COMPLETADO
    porcentaje          DECIMAL(5,2) NOT NULL DEFAULT 0,
    estrellas           INT          NOT NULL DEFAULT 0, -- [+]
    puntos              INT          NOT NULL DEFAULT 0, -- [+]
    fecha_actualizacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progreso_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante (id_estudiante),
    CONSTRAINT fk_progreso_nivel      FOREIGN KEY (id_nivel)      REFERENCES nivel (id_nivel),
    CONSTRAINT uq_progreso UNIQUE (id_estudiante, id_nivel)
) ENGINE = InnoDB;

CREATE TABLE recompensa (
    id_recompensa INT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    tipo          VARCHAR(30)  NOT NULL,   -- INSIGNIA | LOGRO
    descripcion   TEXT         NOT NULL,
    criterio      TEXT         NOT NULL    -- regla evaluada por el dominio, p. ej. NIVEL_COMPLETADO:3
) ENGINE = InnoDB;

CREATE TABLE estudiante_recompensa (
    id_estudiante    INT      NOT NULL,
    id_recompensa    INT      NOT NULL,
    fecha_obtencion  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_estudiante, id_recompensa),
    CONSTRAINT fk_er_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante (id_estudiante),
    CONSTRAINT fk_er_recompensa FOREIGN KEY (id_recompensa) REFERENCES recompensa (id_recompensa)
) ENGINE = InnoDB;
