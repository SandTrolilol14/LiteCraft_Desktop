-- LiteCraft Desktop · Esquema de la base de datos
-- Se ejecuta solo la PRIMERA vez que arranca el contenedor (volumen vacío).
-- Para aplicarlo a mano: mariadb -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS litecraft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE litecraft_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    avatar_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS esquemas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    archivo_url VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,          -- nombre original (ej. granja_hierro.litematic) para la descarga
    imagen_url VARCHAR(255) DEFAULT NULL,
    minecraft_version VARCHAR(20) NOT NULL,
    tamano_bytes BIGINT NOT NULL DEFAULT 0,
    descargas INT NOT NULL DEFAULT 0,
    usuario_id BIGINT NOT NULL,
    categoria_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_esquemas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_esquemas_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO categorias (nombre, descripcion) VALUES
('Redstone', 'Granjas técnicas, mecanismos y puertas lógicas'),
('Construcción', 'Casas, castillos y decoración survival'),
('Granjas', 'Diseños de granjas automáticas y semi-automáticas'),
('Pixel Art', 'Estructuras y murales 2D/3D');

-- El usuario ADMIN ya NO se crea aquí (el hash anterior era inventado y nadie conocía su contraseña).
-- Cuando exista el endpoint de registro: registraos normal y luego ejecutad:
--   UPDATE usuarios SET rol = 'ADMIN' WHERE username = 'vuestro_usuario';
