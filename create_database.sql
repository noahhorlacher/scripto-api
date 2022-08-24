DROP DATABASE IF EXISTS scripto;
CREATE DATABASE scripto;
USE scripto;

CREATE TABLE writing (
    writing_id INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(60),
    content MEDIUMTEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited DATETIME ON UPDATE CURRENT_TIMESTAMP,
    favourite BOOLEAN DEFAULT 0,
    draft BOOLEAN DEFAULT 1
);

CREATE TABLE writing_tag (
    writings_tags_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    fk_writing_id INT,
    FOREIGN KEY (fk_writing_id) REFERENCES writing(writing_id)
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
    fk_collage_id INT,
    FOREIGN KEY (fk_collage_id) REFERENCES collage(collage_id),
    fk_writing_id INT,
    FOREIGN KEY (fk_writing_id) REFERENCES writing(writing_id)
);

CREATE TABLE collage_tag (
    collage_tag_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    fk_collage_id INT,
    FOREIGN KEY (fk_collage_id) REFERENCES collage(collage_id)
);