insert into tbl_TechCodeToETALoginId
select UserId, lower( SUBSTRING(u.ETADirectExternalId ,  CHARINDEX('_' , u.ETADirectExternalId , 5) + 1 , 500))  
from tbl_User u where u.ETADirectExternalId is not null and u.ETADirectExternalId <> '' and u.ETADirectExternalId like '%.%'

insert into tbl_TechCodeToETALoginId values ('5351' , 'Jon.Abramczyk')
insert into tbl_TechCodeToETALoginId values ('5367' , 'kris.tomlin')


/*
--Find duplicate external ids
select distinct lower( SUBSTRING(ETADirectExternalId ,  CHARINDEX('_' , ETADirectExternalId , 5) + 1 , 500))   from  tbl_User where ETADirectExternalId is not null and ETADirectExternalId <> '' 
group by lower( SUBSTRING(ETADirectExternalId ,  CHARINDEX('_' , ETADirectExternalId , 5) + 1 , 500))   having 
count(lower( SUBSTRING(ETADirectExternalId ,  CHARINDEX('_' , ETADirectExternalId , 5) + 1 , 500))  ) > 1


*/
