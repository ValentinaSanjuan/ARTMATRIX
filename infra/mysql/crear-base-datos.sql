-- Ejecutar UNA SOLA VEZ como root (MySQL Workbench o la consola de MySQL).
-- Crea la base de datos y el usuario que usa el backend de ArtMatrix.
-- Las tablas y los datos los crea Flyway automáticamente al arrancar el backend.

CREATE DATABASE IF NOT EXISTS artmatrix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'artmatrix'@'localhost' IDENTIFIED BY 'artmatrix';
GRANT ALL PRIVILEGES ON artmatrix.* TO 'artmatrix'@'localhost';
FLUSH PRIVILEGES;
