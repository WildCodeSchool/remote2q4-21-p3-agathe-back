-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/XqAiOD
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

SET NAMES utf8;

ALTER TABLE Orders DROP FOREIGN KEY fk_Order_UserID;
ALTER TABLE Orders DROP FOREIGN KEY fk_Order_OrderStatusID;
ALTER TABLE OrderLine DROP FOREIGN KEY fk_OrderLine_OrderID;
ALTER TABLE OrderLine DROP FOREIGN KEY fk_OrderLine_ProductID;
ALTER TABLE Ingredients DROP FOREIGN KEY fk_Ingredients_ProductID;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS OrderLine;
DROP TABLE IF EXISTS OrderStatus;
DROP TABLE IF EXISTS presentation;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS users;

CREATE TABLE orders (
    OrderID int  NOT NULL PRIMARY KEY,
    UserID int  NOT NULL,
    TotalAmount decimal(8,2) NOT NULL,
    OrderStatusID int  NOT NULL,
    UserComments text  NOT NULL
);

CREATE TABLE OrderLine (
    OrderLineID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    OrderID int NOT NULL,
    ProductID int NOT NULL,
    Quantity int NOT NULL,
    Price decimal(8,2) NOT NULL
);

CREATE TABLE OrderStatus (
    OrderStatusID int NOT NULL PRIMARY KEY,
    name varchar(20) NOT NULL ,
    OrderDate date NOT NULL ,
    ShippingDate date --  NOT NULL ,

    -- CONSTRAINT `uc_OrderStatus_Name` UNIQUE (
    --     `Name`
    -- )
);

CREATE TABLE presentation (
    presentation text
);

CREATE TABLE products (
    ProductID int  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(200)  NOT NULL ,
    price decimal(5,2)  NOT NULL ,
    SKU varchar(13)  NOT NULL DEFAULT '',
    characteristic text  NOT NULL ,
    description text  NOT NULL ,
    ingredients_details text NOT NULL ,

    CONSTRAINT `uc_Product_Name` UNIQUE (
        `name`
    )
);

CREATE TABLE Ingredients (
    IngredientID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL,
    description text NOT NULL,
    ProductID int  NOT NULL
);

CREATE TABLE users (
    id int  NOT NULL PRIMARY KEY AUTO_INCREMENT,
    IsAdmin bool  NOT NULL default false,
    `password` varchar(255) NOT NULL,
    email varchar(55) NOT NULL,
    FirstName varchar(80) NOT NULL,
    LastName varchar(80) NOT NULL,
    PhoneNumber varchar(16) NOT NULL,
    Address1 varchar(80) NOT NULL,
    Address2 varchar(80) NULL,
    Address3 varchar(80) NULL,
    postCode int NOT NULL,
    city varchar(80) NOT NULL
);

ALTER TABLE orders ADD CONSTRAINT fk_Order_UserID FOREIGN KEY(UserID)
REFERENCES users(ID);

ALTER TABLE orders ADD CONSTRAINT fk_Order_OrderStatusID FOREIGN KEY(OrderStatusID)
REFERENCES OrderStatus(OrderStatusID);

ALTER TABLE OrderLine ADD CONSTRAINT fk_OrderLine_OrderID FOREIGN KEY(OrderID)
REFERENCES orders(OrderID);

ALTER TABLE OrderLine ADD CONSTRAINT fk_OrderLine_ProductID FOREIGN KEY(ProductID)
REFERENCES products(ProductID);

ALTER TABLE Ingredients ADD CONSTRAINT fk_Ingredients_ProductID FOREIGN KEY(ProductID)
REFERENCES products(ProductID);

CREATE INDEX idx_User_FirstName
ON users(FirstName);

CREATE INDEX idx_User_LastName
ON users(LastName);

-- PRESENTATION
INSERT INTO Presentation(presentation)
VALUES ("Elfenn a été imaginée en Bretagne sud, à la croisée des éléments naturels.\nElle est née de l'intérêt de Pierre pour les huiles végétales et de la volonté de sa fille, Agathe, de vous faire découvrir la caméline et ses innombrables vertus au travers de soins adaptés pour tous.\n\nNos huiles y sont fabriquées artisanalement pour sublimer tous leurs bienfaits.\nLeur composition est à 100% d'origine naturelle, les ingrédients à 98% d'origine bretonne et les flacons sont en verre, zéro-déchet.");

-- insert des 4 articles de base
INSERT INTO products(ProductID, name, price, SKU, characteristic, description, ingredients_details)
VALUES (1, "HUILE BIO DEMAQUILLANTE", 17, "HDEM21", "Contenance : 50 mL\nDurée d'utilisation : environ 2 mois (50 utilisations)","Grande incontournable de nombreuses routines beauté, l'huile démaquillante vous débarrasse de tous types de maquillage sans agresser la peau. Elle laisse une sensation de douceur et de peau nourrie..", "PALMARIA PALMATA EXTRACT and CAMELINA SATIVA SEED OIL, COCO-GLUCOSIDE, PARFUM, TOCOPHEROL, HELIANTHUS ANUUS OIL, PELARGONIUM GRAVEOLENS FLOWER OIL, COUMARIN*, GERANIOL*, LINALOOL*, CITRONELLOL*"),
(2, "HUILE SÈCHE VISAGE BIO", 21, "HVIS21", "Contenance : 50 mL\nDurée d'utilisation : environ 3 mois (90 utilisations)","Rituel du matin ou du soir, l'huile nourrie la peau sans laisser de film gras.\nLes propriétés de ses ingrédients lui permette de renforcer la protection naturelle de la peau contre les agressions extérieures (pollution, soleil, froid, vent,…), de laisser une peau douce, lissée et un léger hâle pour un effet bonne mine. Utilisable pour tous les types de peau (peau sèche, mixte, grasse, jeune ou plus âgée), hommes et femmes", "CAMELINA SATIVA SEED OIL and UNDARIA PINNATIFADA EXTRACT, CAMELINA SATIVA SEED OIL and DAUCUS CAROTA SATIVA ROOT EXTRACT, PARFUM, TOCOPHEROL, PELARGONUM GRAVELOENS FLOWER OIL, HELIANTHUS ANNUUS SEED OIL, CITRONELLOL*, GERANIOL*, LINALOOL*"),
(3, "HUILE DE MASSAGE BIO", 34, "HMAS21", "Contenance : 50 mL\nDurée d'utilisation : 1 mois et demi environ", "Si l’huile de massage est un réflexe des sportifs, elle conviendra tout aussi bien aux personnes cherchant à prendre soin d’elles pour un moment de détente. L’action mêlée du CBD à celle du fucus et de la criste marine permet à l’huile de massage d’à la fois soulager vos douleurs (articulaires, musculaires,…) tout en activant la microcirculation, drainant et éliminant les toxines. Bien-être assuré!", "FUCUS VESICULOSUS EXTRACT and CAMELINA SATIVA SEED OIL, CANABIDIOL, PARFUM, TOCOPHEROL, CRITHMUM MARITIMUM OIL, HELIANTHUS ANUUS OIL"),
(4, "HUILE SECHE CORPS & CHEVEUX BIO", 20, "HCOCH21", "Contenance : 50 mL\nDurée d'utilisation : 2 mois environ (40 utilisations)", "L’huile sèche corps et cheveux est enrichie en Chondrus Crispus (goëmon blanc). Elle vous apportera une nutrition intense de la peau ou des cheveux tout en laissant un toucher doux et doyeux accompagné d'une délicate odeur de vanille", "CHONDRUS CRISPUS EXTRACT and CAMELINA SATIVA SEED OIL, PARFUM, TOCOPHEROL, HELIANTHUS ANUUS OIL");

INSERT INTO users(id, firstname, lastname, phonenumber, `password`, email, isadmin, Address1, postCode, city)
VALUES ( 1, 'admin', '', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'admin@example.com', true, '', 0 ,''),
 ( 2, 'test', '', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'test@example.com', false, '', 0 ,''),
 ( 3, 'Jean', 'Dupont', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'jean.dupont@example.com', false, '', 0 ,''),
 ( 4, 'Pierre', 'Martin', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'pierre.martin@example.com', false, '', 0 ,''),
 ( 5, 'Franck', 'Thomas', '0123456789', '$argon2i$v=19$m=4096,t=3,p=1$wkqEhPhX1FZ9ZHdLinesLw$G5UATWBEKq++UpMHK2CnvNYnnbCANu06mVzGv7dX/94', 'franck.thomas@example.com', false, '', 0 ,'')
 ;

-- Insert ingrédients
INSERT INTO ingredients(ProductID, name, description) VALUES
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

INSERT INTO OrderStatus(OrderStatusID, name, OrderDate, ShippingDate) VALUES
(1, 'En attente', '20220120', null),
(2, 'En attente', '20220125', null),
(3, 'En attente', '20220125', null),
(4, 'En attente', '20220126', null),
(5, 'En attente', '20220131', null)
;

INSERT INTO orders (OrderID, UserID, TotalAmount, OrderStatusID, UserComments) VALUES
(1, 3,  17, 1, ''),
(2, 4,  68, 2, 'Merci'),
(3, 5, 100, 3, ''),
(4, 3,  20, 4, ''),
(5, 5,  41, 5, '')
;

INSERT INTO OrderLine (OrderID, ProductID, Quantity, Price) VALUES
(1, 1, 1,  17),
(2, 3, 1,  34),
(2, 1, 2,  17),
(3, 4, 5, 100),
(4, 4, 1,  20),
(5, 2, 1,  21),
(5, 4, 1,  20)
;