select u.UserId as TechCode,emp.LastName +','+ emp.FirstName as TechName , dbo.udf_GetPointsCompletionCountNCPercentage('01/01/2009' , '12/15/2009' , u.UserId) as NC ,(dbo.udf_GetTCCountForHourlyPayroll(12 , '01/01/2009' , '12/15/2009' , u.userid) / dbo.udf_GetCompletedJobsCount('01/01/2009' , '12/15/2009' , u.userid)) * 100 as TC12
into #NC
from 
tbl_Data_Employees emp inner join tbl_User u on emp.TechNumber = u.UserId
where
emp.HireDate < '01/01/2009'
and
u.Active = 1
and
u.userid in (select userid from [login] where type = 't')

select TechCode ,TechName, TC12,substring(NC , 
 charindex('+' , NC , charindex( '+', NC , 0) + 1)+1 , 
 charindex('+' ,NC , charindex('+' , NC , charindex( '+', NC , 0)+1)+1) - (charindex('+' , NC , charindex( '+', NC , 0) + 1)+1)) as NC  
from #NC
where
convert(float, substring(NC , 
 charindex('+' , NC , charindex( '+', NC , 0) + 1)+1 , 
 charindex('+' ,NC , charindex('+' , NC , charindex( '+', NC , 0)+1)+1) - (charindex('+' , NC , charindex( '+', NC , 0) + 1)+1)) ) >= 85
 and
 TC12 <=5
 order by 
 TC12 ASC,
 convert(float, substring(NC , 
 charindex('+' , NC , charindex( '+', NC , 0) + 1)+1 , 
 charindex('+' ,NC , charindex('+' , NC , charindex( '+', NC , 0)+1)+1) - (charindex('+' , NC , charindex( '+', NC , 0) + 1)+1)) ) desc 
 
 
 
 
 
--drop table #nc