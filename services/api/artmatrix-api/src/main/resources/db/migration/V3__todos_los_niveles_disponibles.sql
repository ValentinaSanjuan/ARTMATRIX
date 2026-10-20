-- Todas las salas quedan disponibles, aunque no se haya completado la anterior.
UPDATE progreso_nivel SET estado = 'DISPONIBLE' WHERE estado = 'BLOQUEADO';
