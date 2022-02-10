DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(255) NOT NULL
);

INSERT INTO users
VALUES (
    1,
    'admin',
    'test',
    'admin@example.com'
);