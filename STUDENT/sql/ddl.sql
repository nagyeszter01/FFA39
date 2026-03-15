-- ============================================
-- Fagyizó Nyilvántartó Rendszer - DDL
-- MSSQL
-- ============================================

IF DB_ID(N'FagyizoDB') IS NULL
BEGIN
    CREATE DATABASE FagyizoDB;
END
GO

USE FagyizoDB;
GO

-- Ha újra szeretnéd futtatni
IF OBJECT_ID(N'dbo.Fagylaltok', N'U') IS NOT NULL
    DROP TABLE dbo.Fagylaltok;
GO

IF OBJECT_ID(N'dbo.Tipusok', N'U') IS NOT NULL
    DROP TABLE dbo.Tipusok;
GO

CREATE TABLE dbo.Tipusok
(
    tipus_id INT IDENTITY(1,1) PRIMARY KEY,
    tipus_kod NVARCHAR(50) NOT NULL UNIQUE,
    tipus_nev NVARCHAR(100) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Fagylaltok
(
    fagylalt_id INT IDENTITY(1,1) PRIMARY KEY,
    nev NVARCHAR(150) NOT NULL,
    tipus_id INT NOT NULL,
    ar INT NOT NULL,
    leiras NVARCHAR(500) NULL,
    elerheto BIT NOT NULL CONSTRAINT DF_Fagylaltok_Elerheto DEFAULT (1),
    nepszerusegi_pont INT NOT NULL CONSTRAINT DF_Fagylaltok_Nepszeruseg DEFAULT (0),
    letrehozva DATETIME2 NOT NULL CONSTRAINT DF_Fagylaltok_Letrehozva DEFAULT (SYSDATETIME()),

    CONSTRAINT FK_Fagylaltok_Tipusok
        FOREIGN KEY (tipus_id) REFERENCES dbo.Tipusok(tipus_id),

    CONSTRAINT CHK_Fagylaltok_Ar
        CHECK (ar > 0),

    CONSTRAINT CHK_Fagylaltok_Nepszeruseg
        CHECK (nepszerusegi_pont >= 0)
);
GO

CREATE INDEX IX_Fagylaltok_Nev
    ON dbo.Fagylaltok(nev);
GO

CREATE INDEX IX_Fagylaltok_Tipus
    ON dbo.Fagylaltok(tipus_id);
GO

CREATE INDEX IX_Fagylaltok_Elerheto
    ON dbo.Fagylaltok(elerheto);
GO