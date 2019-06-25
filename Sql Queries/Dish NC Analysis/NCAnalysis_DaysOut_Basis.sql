declare @DaysOut int = 6

while(@DaysOut >= 0)
begin
declare @Output table
(
 DaysOut int,
 [Total Jobs] int,
 [Cancel Jobs] int,
 [Open Jobs] float,
 [Closed Within 30 days] float,
 [NC 30%] float
 )

insert into @Output 
select
@DaysOut , COUNT(*) , 0, 0 ,0 ,0
from TEMP_JAN_NC_30
where
datediff(day,create_date , original_scheduled_date) = @DaysOut and opportunity = 1 

update o
set [Cancel Jobs] = r.C
from  
@Output o,
(
select COUNT(*) as C
from TEMP_JAN_NC_30
where
datediff(day,create_date , original_scheduled_date) = @DaysOut and status = 'X' and opportunity = 1) as r
where o.DaysOut = @DaysOut

update o
set [Open Jobs]  = r.C
from  
@Output o,
(
select COUNT(*) as C
from TEMP_JAN_NC_30
where
datediff(day,create_date , original_scheduled_date) = @DaysOut and status = 'O' and opportunity = 1) as r
where o.DaysOut = @DaysOut


update o
set [Closed Within 30 days]  = r.C
from  
@Output o,
(
select COUNT(*) as C
from TEMP_JAN_NC_30
where
datediff(day,create_date , original_scheduled_date) = @DaysOut and completed= 1 and datediff(day,create_date , last_changed_date) <= 30
and opportunity = 1) as r
where o.DaysOut = @DaysOut

update o
set [NC 30%] = round((([Closed Within 30 days] / [Total Jobs]) * 100) , 2)
from @Output o
where o.DaysOut = @DaysOut

set @DaysOut = @DaysOut - 1

end

select * from @Output
