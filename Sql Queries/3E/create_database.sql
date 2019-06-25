--DB Creation
create database DBRecipes;

--Login Creation
create login user1 with password = 'pword1';

--User creation
use DBRecipes;
create user user1 for login user1

--Grant access to user1 for DBRecipes

EXEC sp_addrolemember 'db_ddladmin', 'user1'
EXEC sp_addrolemember 'db_datawriter', 'user1'
EXEC sp_addrolemember 'db_datareader', 'user1'