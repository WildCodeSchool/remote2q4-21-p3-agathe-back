-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/XqAiOD
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE `User` (
    `UserID` int  NOT NULL ,
    `IsAdmin` bool  NOT NULL ,
    `Password` varchar(20)  NOT NULL ,
    `Email` varchar(55)  NOT NULL ,
    `FirstName` string  NOT NULL ,
    `LastName` string  NOT NULL ,
    `Address1` string  NOT NULL ,
    `Address2` string  NULL ,
    `Address3` string  NULL ,
    `PostCode` int  NOT NULL ,
    `City` varchar(  NOT NULL ,
    PRIMARY KEY (
        `UserID`
    )
);

CREATE TABLE `Order` (
    `OrderID` int  NOT NULL ,
    `UserID` int  NOT NULL ,
    `TotalAmount` money  NOT NULL ,
    `OrderStatusID` int  NOT NULL ,
    `UserComments` text  NOT NULL ,
    PRIMARY KEY (
        `OrderID`
    )
);

CREATE TABLE `OrderLine` (
    `OrderLineID` int  NOT NULL ,
    `OrderID` int  NOT NULL ,
    `ProductID` int  NOT NULL ,
    `Quantity` int  NOT NULL ,
    `Price` decimal(8,2)  NOT NULL ,
    PRIMARY KEY (
        `OrderLineID`
    )
);

CREATE TABLE `Product` (
    `ProductID` int  NOT NULL ,
    `Name` varchar(200)  NOT NULL ,
    `Price` money  NOT NULL ,
    `SKU` varchar(13)  NOT NULL ,
    `Characteristic` text  NOT NULL ,
    `Description` text  NOT NULL ,
    `Ingredient` text  NOT NULL ,
    PRIMARY KEY (
        `ProductID`
    ),
    CONSTRAINT `uc_Product_Name` UNIQUE (
        `Name`
    )
);

CREATE TABLE `OrderStatus` (
    `OrderStatusID` int  NOT NULL ,
    `Name` string  NOT NULL ,
    `OrderDate` date  NOT NULL ,
    `ShippingDate` date  NOT NULL ,
    PRIMARY KEY (
        `OrderStatusID`
    ),
    CONSTRAINT `uc_OrderStatus_Name` UNIQUE (
        `Name`
    )
);

ALTER TABLE `Order` ADD CONSTRAINT `fk_Order_UserID` FOREIGN KEY(`UserID`)
REFERENCES `User` (`UserID`);

ALTER TABLE `Order` ADD CONSTRAINT `fk_Order_OrderStatusID` FOREIGN KEY(`OrderStatusID`)
REFERENCES `OrderStatus` (`OrderStatusID`);

ALTER TABLE `OrderLine` ADD CONSTRAINT `fk_OrderLine_OrderID` FOREIGN KEY(`OrderID`)
REFERENCES `Order` (`OrderID`);

ALTER TABLE `OrderLine` ADD CONSTRAINT `fk_OrderLine_ProductID` FOREIGN KEY(`ProductID`)
REFERENCES `Product` (`ProductID`);

CREATE INDEX `idx_User_FirstName`
ON `User` (`FirstName`);

CREATE INDEX `idx_User_LastName`
ON `User` (`LastName`);

