DROP DATABASE IF EXISTS scripto;
CREATE DATABASE scripto;
USE scripto;

CREATE TABLE writing (
    writing_id INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(60),
    content MEDIUMTEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    favourite BOOLEAN DEFAULT 0,
    draft BOOLEAN DEFAULT 1
);

CREATE TABLE writing_tag (
    writing_tag_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    fk_writing INT,
    FOREIGN KEY (fk_writing) REFERENCES writing(writing_id)
);

CREATE TABLE link_type (
    link_type_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(20) NOT NULL
);

INSERT INTO link_type(title) VALUES (
    ('Music'), ('Wiki'), ('Tips'), ('Inspiration'), ('Other')
);

CREATE TABLE writing_link (
    writing_song_id INT PRIMARY KEY AUTO_INCREMENT,
    fk_link_type INT DEFAULT 5,
    FOREIGN KEY (fk_link_type) REFERENCES link_type(link_type_id),
    title VARCHAR(30),
    link VARCHAR(256) NOT NULL,
    fk_writing INT,
    FOREIGN KEY (fk_writing) REFERENCES writing(writing_id)
);

CREATE TABLE collage (
    collage_id INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(60),
    description MEDIUMTEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE collage_writing (
    collage_writing_id INT PRIMARY KEY AUTO_INCREMENT,
    fk_collage INT,
    FOREIGN KEY (fk_collage) REFERENCES collage(collage_id),
    fk_writing INT,
    FOREIGN KEY (fk_writing) REFERENCES writing(writing_id)
);

CREATE TABLE collage_tag (
    collage_tag_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    fk_collage INT,
    FOREIGN KEY (fk_collage) REFERENCES collage(collage_id)
);