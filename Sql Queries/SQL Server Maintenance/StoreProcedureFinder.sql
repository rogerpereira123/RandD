SELECT  distinct name , text
FROM syscomments sc
INNER JOIN sysobjects so ON sc.id=so.id
WHERE sc.TEXT LIKE '%tbl_DishCustomerSurveyData%'  ESCAPE '\'

--For Table
/*
Select * From INFORMATION_SCHEMA.COLUMNS Where column_name like '%Use%' 
and DATA_TYPE like '%varchar%' and CHARACTER_MAXIMUM_LENGTH < 50
*/

