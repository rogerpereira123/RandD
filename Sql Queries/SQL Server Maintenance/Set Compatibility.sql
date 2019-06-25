SELECT compatibility_level
FROM sys.databases WHERE name = 'Northware';

ALTER DATABASE  Northware
SET COMPATIBILITY_LEVEL =  100  