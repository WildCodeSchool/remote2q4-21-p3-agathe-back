-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/XqAiOD
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).
ALTER TABLe `Order` DROP FOREIGN KEY fk_Order_UserID;
ALTER TABLE `Order` DROP FOREIGN KEY fk_Order_OrderStatusID;
ALTER TABLE OrderLine DROP FOREIGN KEY fk_OrderLine_OrderID;
ALTER TABLE OrderLine DROP FOREIGN KEY fk_OrderLine_ProductID;

DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS `Order`;
DROP TABLE IF EXISTS OrderLine;
DROP TABLE IF EXISTS OrderStatus;
DROP TABLE IF EXISTS Presentation;
DROP TABLE IF EXISTS Product;

CREATE TABLE User (
    UserID int  NOT NULL PRIMARY KEY,
    IsAdmin bool  NOT NULL,
    Password varchar(20) NOT NULL,
    Email varchar(55) NOT NULL,
    FirstName varchar(80) NOT NULL,
    LastName varchar(80) NOT NULL,
    Address1 varchar(80) NOT NULL,
    Address2 varchar(80) NULL,
    Address3 varchar(80) NULL,
    PostCode int NOT NULL,
    City varchar(80) NOT NULL
);

CREATE TABLE `Order` (
    OrderID int  NOT NULL PRIMARY KEY,
    UserID int  NOT NULL,
    TotalAmount decimal(8,2)  NOT NULL,
    OrderStatusID int  NOT NULL,
    UserComments text  NOT NULL
);

CREATE TABLE OrderLine (
    OrderLineID int NOT NULL PRIMARY KEY,
    OrderID int NOT NULL,
    ProductID int NOT NULL,
    Quantity int NOT NULL,
    Price decimal(8,2) NOT NULL
);

CREATE TABLE OrderStatus (
    OrderStatusID int  NOT NULL PRIMARY KEY,
    Name varchar(20)  NOT NULL ,
    OrderDate date  NOT NULL ,
    ShippingDate date  NOT NULL ,

    CONSTRAINT `uc_OrderStatus_Name` UNIQUE (
        `Name`
    )
);

CREATE TABLE Presentation (
    presentation text
);

CREATE TABLE Product (
    ProductID int  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name varchar(200)  NOT NULL ,
    Price decimal(5,2)  NOT NULL ,
    SKU varchar(13)  NOT NULL DEFAULT '',
    Characteristic text  NOT NULL ,
    Description text  NOT NULL ,
    Ingredient text  NOT NULL ,

    CONSTRAINT `uc_Product_Name` UNIQUE (
        `Name`
    )
);

ALTER TABLE `Order` ADD CONSTRAINT fk_Order_UserID FOREIGN KEY(UserID)
REFERENCES User(UserID);

ALTER TABLE `Order` ADD CONSTRAINT fk_Order_OrderStatusID FOREIGN KEY(OrderStatusID)
REFERENCES OrderStatus(OrderStatusID);

ALTER TABLE OrderLine ADD CONSTRAINT fk_OrderLine_OrderID FOREIGN KEY(OrderID)
REFERENCES `Order`(OrderID);

ALTER TABLE OrderLine ADD CONSTRAINT fk_OrderLine_ProductID FOREIGN KEY(ProductID)
REFERENCES Product(ProductID);

CREATE INDEX idx_User_FirstName
ON User(FirstName);

CREATE INDEX idx_User_LastName
ON User(LastName);

-- PRESENTATION
INSERT INTO Presentation(presentation)
values ("Elfen a été imaginée en Bretagne sud, à la croisée des éléments naturels.\nElle est née de l'intérêt de Pierre pour les huiles végétales et de la volonté de sa fille, Agathe, de vous faire découvrir la caméline et ses innombrables vertus au travers de soins adaptés pour tous.\n\nNos huiles y sont fabriquées artisenalement pour sublimer tous leurs bienfaits.\nLeur composition est à 100% d'origine naturelle, les ingrédients à 98% d'origine bretonne et les flacons sont en verre, zéro-déchet.");

-- insert des 4 articles de base
INSERT INTO Product (Name, Price, Characteristic, Description, Ingredient)
VALUES ("HUILE BIO DEMAQUILLANTE", 17, "Contenance : 50 mL\nDurée d'utilisation : environ 2 mois (50 utilisations)","Grande incontournable de nombreuses routines beauté, l'huile démaquillante vous débarrasse de tous types de maquillage sans agresser la peau. Elle laisse une sensation de douceur et de peau nourrie..", "L'huile de caméline : Huile anti-âge (très riche en oméga 3, 6 et 9), régule le sébum, lutte contre l'apparition des ridules liées à la déshydratation, apporte éclat et souplesse à la peau.\nLa palmaria (algue rouge) : Elimine les toxines, défatigue le regard, active la microcirculation cutanée.\nL'huile essentielle de géranium rosat : Equilibrante, astringente, calmante et apaisante."),
("HUILE SÈCHE VISAGE BIO", 21, "Contenance : 50 mL\nDurée d'utilisation : environ 3 mois (90 utilisations)","Rituel du matin ou du soir, l'huile nourrie la peau sans laisser de film gras.\nLes propriétés de ses ingrédients lui permette de renforcer la protection naturelle de la peau contre les agressions extérieures (pollution, soleil, froid, vent,…), de laisser une peau douce, lissée et un léger hâle pour un effet bonne mine. Utilisable pour tous les types de peau (peau sèche, mixte, grasse, jeune ou plus âgée), hommes et femmes","L'huile de caméline : Huile anti-âge (très riche en oméga 3, 6 et 9), régule le sébum, lutte contre l'apparition des ridules liées à la déshydratation, apporte éclat et souplesse à la peau.\nLa wakamé (algue) : Unifie et dégrise le teint, protège la peau des dommages induits par les UV, les conditions climatiques rudes, la pollution.\nL'huile de carotte : Illumine la peau, donne un effet bonne mine, protège votre peau des attaques extérieures et la prépare au soleil.\nL'huile essentielle de géranium rosat : Equilibrante, astringente, calmante et apaisante."),
("HUILE DE MASSAGE BIO", 34, "Contenance : 50 mL\nDurée d'utilisation : 1 mois et demi environ", "Si l’huile de massage est un réflexe des sportifs, elle conviendra tout aussi bien aux personnes cherchant à prendre soin d’elles pour un moment de détente. L’action mêlée du CBD à celle du fucus et de la criste marine permet à l’huile de massage d’à la fois soulager vos douleurs (articulaires, musculaires,…) tout en activant la microcirculation, drainant et éliminant les toxines. Bien-être assuré!","L'huile de caméline : Assouplissante et adoucissante, apporte de l'élasticité à la peau. Apaise les peaux irritées et protège les peaux sensibles.\nLe fucus : Draine et ellimine les toxines. Propriétés anti-inflammatoires pour les articulations douloureuses.\nLe CBD : Apaisant, anti-inflammatoire, émollient, cicatrisant.\nL'huile essentielle de criste marine : Raffermissante, régénérante, anti-cellulitique."),
("HUILE SECHE CORPS & CHEVEUX BIO", 20, "Contenance : 50 mL\nDurée d'utilisation : 2 mois environ (40 utilisations)", "L’huile sèche corps et cheveux est enrichie en Chondrus Crispus (goëmon blanc). Elle vous apportera une nutrition intense de la peau ou des cheveux tout en laissant un toucher doux et soyeux accompagné d’une délicate odeur de vanille.", "L'huile de caméline : Assouplissante et adoucissante, apporte de
l'élasticité à la peau. Apaise les peaux irritées et protège les peaux sensibles.\nNourrit et apporte brillance aux cheveux. Protège les cheveux fins et agressés. Assouplit les cheveux épais.\nLe chondrus crispus (goëmon blanc) : Nourrit la peau en profondeur et apporte de la vitalité à l'épiderme")
;