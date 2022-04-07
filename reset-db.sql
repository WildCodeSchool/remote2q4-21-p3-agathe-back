-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/XqAiOD
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

SET NAMES utf8;

ALTER TABLE orders DROP FOREIGN KEY fk_Order_UserID; -- to delete
ALTER TABLE orders DROP FOREIGN KEY fk_orders_UserID; -- to delete
ALTER TABLE orders DROP FOREIGN KEY fk_orders_user_id;
ALTER TABLE orders DROP FOREIGN KEY fk_order_OrderStatusID; -- to delete
ALTER TABLE orders DROP FOREIGN KEY fk_orders_status_id;
ALTER TABLE OrderLine DROP FOREIGN KEY fk_orderLine_OrderID; -- to delete
ALTER TABLE orders_lines DROP FOREIGN KEY fk_orders_lines_order_id;
ALTER TABLE OrderLine DROP FOREIGN KEY fk_orderLine_ProductID; -- to delete
ALTER TABLE orders_lines DROP FOREIGN KEY fk_orders_lines_product_id;
ALTER TABLE ingredients DROP FOREIGN KEY fk_Ingredients_ProductID; -- to delete
ALTER TABLE ingredients DROP FOREIGN KEY fk_ingredients_product_id;

DROP VIEW IF EXISTS orders_detail;
DROP VIEW IF EXISTS orders_header;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS OrderLine; -- to delete
DROP TABLE IF EXISTS orders_lines;
DROP TABLE IF EXISTS OrderStates; -- to delete
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS OrderStatus; -- to delete
DROP TABLE IF EXISTS orders_status;
DROP TABLE IF EXISTS presentation;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS calendar;
DROP PROCEDURE IF EXISTS fill_calendar;

CREATE TABLE orders (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL,
    total_amount decimal(8,2) NOT NULL,
    status_id int NOT NULL
);

CREATE TABLE orders_lines (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_id int NOT NULL,
    product_id int NOT NULL,
    quantity int NOT NULL,
    price decimal(8,2) NOT NULL
);

CREATE TABLE orders_status (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_id int not null,
    state_id int not null,
    status_date date NOT NULL
);

-- States of orders
CREATE TABLE states (
    id int NOT NULL PRIMARY KEY,
    state varchar(20) NOT NULL 
);

CREATE TABLE presentation (
    presentation text
);

CREATE TABLE products (
    id int  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(200) NOT NULL,
    price decimal(5,2) NOT NULL,
    sku varchar(13) NOT NULL DEFAULT '',
    characteristic text NOT NULL,
    description text NOT NULL,
    ingredients_details text NOT NULL,
    picture varchar(50),
    active boolean default true,

    CONSTRAINT `uc_products_name` UNIQUE (
        `name`
    )
);

CREATE TABLE Ingredients (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text NOT NULL,
    product_id int  NOT NULL
);

CREATE TABLE users (
    id int  NOT NULL PRIMARY KEY AUTO_INCREMENT,
    is_admin bool  NOT NULL default false,
    password varchar(255) NOT NULL,
    email varchar(55) NOT NULL,
    first_name varchar(80) NOT NULL,
    last_name varchar(80) NOT NULL,
    phone_number varchar(16) NOT NULL,
    address_1 varchar(80) NOT NULL,
    address_2 varchar(80) NULL,
    address_3 varchar(80) NULL,
    post_code int NOT NULL,
    city varchar(80) NOT NULL
);

CREATE TABLE calendar (
    id           INTEGER PRIMARY KEY,  -- year*10000+month*100+day
    db_date      DATE NOT NULL,
    year         INTEGER NOT NULL,
    month        INTEGER NOT NULL, -- 1 to 12
    day          INTEGER NOT NULL, -- 1 to 31
    quarter      INTEGER NOT NULL, -- 1 to 4
    week         INTEGER NOT NULL, -- 1 to 52/53
    day_name     VARCHAR(9) NOT NULL, -- 'Monday', 'Tuesday'...
    month_name   VARCHAR(9) NOT NULL, -- 'January', 'February'...
    weekend_flag CHAR(1) DEFAULT 'f' CHECK (weekend_flag in ('t', 'f')),
    UNIQUE td_ymd_idx (year,month,day),
    UNIQUE td_dbdate_idx (db_date)
);

ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id FOREIGN KEY(user_id)
REFERENCES users(ID);

ALTER TABLE orders ADD CONSTRAINT fk_orders_status_id FOREIGN KEY(status_id)
REFERENCES states(id);

ALTER TABLE orders_lines ADD CONSTRAINT fk_orders_lines_order_id FOREIGN KEY(order_id)
REFERENCES orders(id);

ALTER TABLE orders_lines ADD CONSTRAINT fk_orders_lines_product_id FOREIGN KEY(product_id)
REFERENCES products(id);

ALTER TABLE ingredients ADD CONSTRAINT fk_ingredients_product_id FOREIGN KEY(product_id)
REFERENCES products(id);

CREATE INDEX idx_users_first_name
ON users(first_name);

CREATE INDEX idx_users_last_name
ON users(last_name);

CREATE VIEW orders_header as
SELECT o.id, o.total_amount,
    u.id as user_id, u.first_name, u.last_name, concat(u.first_name, ' ', u.last_name) as user_name, u.email,
    sc.status_date as creation_date,
    sp.status_date as payment_date,
    se.status_date as expedition_date,
    s.status_date as date, os.id as status_id, os.state
FROM orders AS o
    JOIN orders_status AS s ON s.order_id=o.id and o.status_id=s.state_id
    JOIN orders_status AS sc ON sc.order_id=o.id and sc.state_id=1
    LEFT JOIN orders_status AS sp ON sp.order_id=o.id and sp.state_id=2
    LEFT JOIN orders_status AS se ON se.order_id=o.id and se.state_id=3
    JOIN states os ON os.id=o.status_id
    JOIN users AS u on u.id=o.user_id
;

CREATE VIEW orders_detail as
SELECT o.id, 
    u.id as user_id, concat(u.first_name," ", u.last_name) as user_name, 
    p.id as product_id,
    concat(p.sku, "-", p.name) as product,
    l.quantity,
    l.price,
    l.price * l.quantity as amount,
    s.status_date as order_date,
    sp.status_date as payment_date,
    se.status_date as expedition_date,
    os.id as status_id, os.state,
    p.picture
FROM orders o
    JOIN orders_lines l on l.order_id=o.id
    JOIN products p on p.id=l.product_id
    JOIN users u on u.id=o.user_id
    JOIN states os ON os.id=o.status_id
    JOIN orders_status s on s.order_id=o.id and s.state_id=1
    LEFT JOIN orders_status sp on sp.order_id=o.id and sp.state_id=2
    LEFT JOIN orders_status se on se.order_id=o.id and se.state_id=3
;

-- PRESENTATION
INSERT INTO Presentation(presentation)
VALUES ("Elfenn a été imaginée en Bretagne sud, à la croisée des éléments naturels.\nElle est née de l'intérêt de Pierre pour les huiles végétales et de la volonté de sa fille, Agathe, de vous faire découvrir la caméline et ses innombrables vertus au travers de soins adaptés pour tous.\n\nNos huiles y sont fabriquées artisanalement pour sublimer tous leurs bienfaits.\nLeur composition est à 100% d'origine naturelle, les ingrédients à 98% d'origine bretonne et les flacons sont en verre, zéro-déchet.");

-- insert des 4 articles de base
INSERT INTO products(id, name, price, sku, characteristic, description, ingredients_details, picture)
VALUES (1, "HUILE BIO DEMAQUILLANTE", 17, "HDEM21", "Contenance : 50 mL\nDurée d'utilisation : environ 2 mois (50 utilisations)","Grande incontournable de nombreuses routines beauté, l'huile démaquillante vous débarrasse de tous types de maquillage sans agresser la peau. Elle laisse une sensation de douceur et de peau nourrie..", "PALMARIA PALMATA EXTRACT and CAMELINA SATIVA SEED OIL, COCO-GLUCOSIDE, PARFUM, TOCOPHEROL, HELIANTHUS ANUUS OIL, PELARGONIUM GRAVEOLENS FLOWER OIL, COUMARIN*, GERANIOL*, LINALOOL*, CITRONELLOL*", 'a192cfc1b16f87b3b5b15858614ed823'),
(2, "HUILE SÈCHE VISAGE BIO", 21, "HVIS21", "Contenance : 50 mL\nDurée d'utilisation : environ 3 mois (90 utilisations)","Rituel du matin ou du soir, l'huile nourrie la peau sans laisser de film gras.\nLes propriétés de ses ingrédients lui permette de renforcer la protection naturelle de la peau contre les agressions extérieures (pollution, soleil, froid, vent,…), de laisser une peau douce, lissée et un léger hâle pour un effet bonne mine. Utilisable pour tous les types de peau (peau sèche, mixte, grasse, jeune ou plus âgée), hommes et femmes", "CAMELINA SATIVA SEED OIL and UNDARIA PINNATIFADA EXTRACT, CAMELINA SATIVA SEED OIL and DAUCUS CAROTA SATIVA ROOT EXTRACT, PARFUM, TOCOPHEROL, PELARGONUM GRAVELOENS FLOWER OIL, HELIANTHUS ANNUUS SEED OIL, CITRONELLOL*, GERANIOL*, LINALOOL*",'a292cfc1b16f87b3b5b15858614ed823'),
(3, "HUILE DE MASSAGE BIO", 34, "HMAS21", "Contenance : 50 mL\nDurée d'utilisation : 1 mois et demi environ", "Si l’huile de massage est un réflexe des sportifs, elle conviendra tout aussi bien aux personnes cherchant à prendre soin d’elles pour un moment de détente. L’action mêlée du CBD à celle du fucus et de la criste marine permet à l’huile de massage d’à la fois soulager vos douleurs (articulaires, musculaires,…) tout en activant la microcirculation, drainant et éliminant les toxines. Bien-être assuré!", "FUCUS VESICULOSUS EXTRACT and CAMELINA SATIVA SEED OIL, CANABIDIOL, PARFUM, TOCOPHEROL, CRITHMUM MARITIMUM OIL, HELIANTHUS ANUUS OIL", 'a392cfc1b16f87b3b5b15858614ed823'),
(4, "HUILE SECHE CORPS & CHEVEUX BIO", 20, "HCOCH21", "Contenance : 50 mL\nDurée d'utilisation : 2 mois environ (40 utilisations)", "L’huile sèche corps et cheveux est enrichie en Chondrus Crispus (goëmon blanc). Elle vous apportera une nutrition intense de la peau ou des cheveux tout en laissant un toucher doux et doyeux accompagné d'une délicate odeur de vanille", "CHONDRUS CRISPUS EXTRACT and CAMELINA SATIVA SEED OIL, PARFUM, TOCOPHEROL, HELIANTHUS ANUUS OIL", 'a4192cfc1b16f87b3b5b15858614ed823');

INSERT INTO users(id, first_name, last_name, phone_number, password, email, is_admin, address_1, post_code, city)
VALUES ( 1, 'admin', '', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'admin@example.com', true, '', 0 ,''),
 ( 2, 'test', '', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'test@example.com', false, '', 0 ,''),
 ( 3, 'Jean', 'Dupont', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'jean.dupont@example.com', false, '', 0 ,''),
 ( 4, 'Pierre', 'Martin', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'pierre.martin@example.com', false, '', 0 ,''),
 ( 5, 'Franck', 'Thomas', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'franck.thomas@example.com', false, '', 0 ,''),
 ( 6, 'Peter', 'Parker', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'peter.parker@buggle.com', false, '', 0 ,'')
 ;

-- Insert ingrédients
INSERT INTO ingredients(product_id, name, description) VALUES
(1, "L'huile de caméline", "Huile anti-âge (très riche en oméga 3, 6 et 9), régule le sébum, lutte contre l'apparition des ridules liées à la déshydratation, apporte éclat et souplesse à la peau."),
(1, "La palmaria (algue rouge)", "Elimine les toxines, défatigue le regard, active la microcirculation cutanée."),
(1, "L'huile essentielle de géranium rosat", "Equilibrante, astringente, calmante et apaisante."),
(2, "L'huile de caméline", "Huile anti-âge (très riche en oméga 3, 6 et 9), régule le sébum, lutte contre l'apparition des ridules liées à la déshydratation, apporte éclat et souplesse à la peau."),
(2, "L'huile essentielle de géranium rosat", "Equilibrante, astringente, calmante et apaisante."),
(2, "La wakamé (algue)", "Unifie et dégrise le teint, protège la peau des dommages induits par les UV, les conditions climatiques rudes, la pollution."),
(2, "L'huile de carotte", "Illumine la peau, donne un effet bonne mine, protège votre peau des attaques extérieures et la prépare au soleil."),
(3, "L'huile de caméline", "Assouplissante et adoucissante, apporte de l'élasticité à la peau. Apaise les peaux irritées et protège les peaux sensibles."),
(3, "Le fucus", "Draine et ellimine les toxines. Propriétés anti-inflammatoires pour les articulations douloureuses."),
(3, "Le CBD", "Apaisant, anti-inflammatoire, émollient, cicatrisant."),
(3, "L'huile essentielle de criste marine", "Raffermissante, régénérante, anti-cellulitique."),
(4, "L'huile de caméline", "Assouplissante et adoucissante, apporte de l'élasticité à la peau. Apaise les peaux irritées et protège les peaux sensibles."),
(4, "Le chondrus crispus (goëmon blanc)", "Nourrit la peau en profondeur et apporte de la vitalité à l'épiderme.")
;

-- -------------------------------------------
-- Orders
-- -------------------------------------------
INSERT INTO states(id, state) VALUES
(1, 'En attente'),
(2, 'Payé'),
(3, 'Envoyé')
;

INSERT INTO orders_status(order_id, state_id, status_date) VALUES
(1, 1, '20220220'),
(1, 2, '20220220'),
(1, 3, '20220220'),
(2, 1, '20220316'),
(2, 2, '20220317'),
(3, 1, '20220317'),
(4, 1, '20220318'),
(4, 2, '20220324'),
(5, 1, '20220324'),
(5, 2, '20220330'),
(6, 1, '20220331'),
(6, 2, '20220331'),
(7, 1, '20220401'),
(7, 2, '20220401')
;

INSERT INTO orders(id, user_id, total_amount, status_id) VALUES
(1, 3,  17, 3),
(2, 4,  68, 2),
(3, 5, 100, 1),
(4, 3,  20, 2),
(5, 5,  41, 2),
(6, 6,  17, 2),
(7, 6,  21, 2)
;

INSERT INTO orders_lines(order_id, product_id, quantity, price) VALUES
(1, 1, 1,  17),
(2, 3, 1,  34),
(2, 1, 2,  17), 
(3, 4, 5,  20),
(4, 4, 1,  20),
(5, 2, 1,  21),
(5, 4, 1,  20),
(6, 1, 1,  17),
(7, 2, 1,  21)
;

DELIMITER //
SET lc_time_names = 'fr_FR';
CREATE PROCEDURE fill_calendar(IN startdate DATE,IN stopdate DATE)
BEGIN
    DECLARE currentdate DATE;
    SET currentdate = startdate;
    WHILE currentdate < stopdate DO
        INSERT INTO calendar VALUES (
                        YEAR(currentdate)*10000+MONTH(currentdate)*100 + DAY(currentdate), currentdate,
                        YEAR(currentdate),
                        MONTH(currentdate),
                        DAY(currentdate),
                        QUARTER(currentdate),
                        WEEKOFYEAR(currentdate),
                        DATE_FORMAT(currentdate,'%W'),
                        DATE_FORMAT(currentdate,'%M'),
                        CASE DAYOFWEEK(currentdate) WHEN 1 THEN 't' WHEN 7 then 't' ELSE 'f' END);
        SET currentdate = ADDDATE(currentdate,INTERVAL 1 DAY);
    END WHILE;
END
//
DELIMITER ;

TRUNCATE TABLE calendar;

CALL fill_calendar('2022-01-01','2032-01-01');