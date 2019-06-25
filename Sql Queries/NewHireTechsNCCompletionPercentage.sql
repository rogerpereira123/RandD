declare @data table
(
TechNumber varchar(10),
hireDate date,
TechName varchar(50),
NCCompletedCount int,
NCJobsAssigned int,
NCPercentages float 

)
insert into @data
select 
tde.TechNumber , tde.HireDate , tde.Lastname + ',' + tde.Firstname as TechName , COUNT(WoNumber) as NCCompletedCount , 0 , 0
from
tbl_Data_Job_Setup tjs
inner join tbl_Data_Employees tde on tjs.TechCode = tde.TechNumber
where
tde.HireDate >= DATEADD(DAY , -180,CONVERT(date, GETDATE()))
and
tjs.WorkorderType in ('NC' , 'RC' , 'RS')
and
tjs.CSGLastChangedDate >= '06/29/2011'
and
tjs.CSGLastChangedDate <= '07/05/2011'
and tjs.CSGStatus = 'C'
and tde.TechNumber not in ( select TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT', 'ME' ,'M2' , 'M3' , 'M4'))
group by tde.TechNumber , tde.HireDate , tde.Lastname + ',' + tde.Firstname

update @data
set NCJobsAssigned = c.TotalJobsCompleted
from
(select tde.TechNumber as Tech , COUNT(WoNumber) as TotalJobsCompleted
from 
tbl_daily_opportunities tdo 
inner join tbl_Data_Job_Setup tjs on tdo.JobId = tjs.JobID
inner join tbl_Data_Employees tde on tdo.TechCode = tde.TechNumber
where
tde.HireDate >= '01/01/2011'
and
tdo.[date] >= '06/29/2011'
and
tdo.[date] <= '07/05/2011' and tdo.IsOpportunity = 'YES'
and tjs.WorkorderType in ('NC' , 'RC', 'RS')
and tde.TechNumber not in ( select TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT', 'ME' ,'M2' , 'M3' , 'M4'))
group by tde.TechNumber , tde.HireDate , tde.Lastname + ',' + tde.Firstname) as c 
where
c.Tech = TechNumber

update @data 
set NCPercentages = round((NCCompletedCount * 1.0 / NCJobsAssigned) * 100 , 2)
where NCJobsAssigned >0

select * from @data
