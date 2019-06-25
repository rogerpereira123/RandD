declare @stDate date
declare @edDate date
set @stDate = '01/01/2010'
set @edDate = '04/30/2011'
declare @report table
(
[Year] int,
[Month] varchar(50),
TotalHours Decimal(18,2),
TotalPoints int,
PointsPerHour decimal(18,2),
TotalJobs int,
NoOfTechs int,
JobsPerTech decimal(18,2)
)
insert into @report ([Year],[Month] , TotalHours)
select datepart(YEAR,him.Date) , datename(month,him.Date) , round(sum((DATEDIFF(minute,  convert(time , hil.starttime) , CONVERT(time, hil.EndTime)) / 60.0)),2)
from tbl_HourlyInvoiceHoursMaster
him inner join tbl_HourlyInvoiceHoursLine hil on him.InvoiceHoursId = hil.InvoiceHoursId
where
him.Date >= @stDate
and
him.Date <= @edDate
group by datepart(YEAR,him.Date), datename(month,him.Date),datepart(month,him.Date) 
order by datepart(YEAR,him.Date), datepart(month,him.Date)

update @report 
set TotalPoints = Jobs.Points , 
PointsPerHour = round(Jobs.Points / TotalHours , 2),
TotalJobs = Jobs.Wos,
NoOfTechs = Jobs.Techs,
JobsPerTech = round((Jobs.Wos * 1.0) / Jobs.Techs,2)
from 
(select datepart(YEAR,tjs.CSGLastChangedDate) as [YearName], datename(month,tjs.CSGLastChangedDate) as [MonthName],  SUM(WorkUnits) as Points , COUNT (distinct techcode) as Techs , count(woNumber) as Wos from tbl_Data_Job_Setup tjs where CSGStatus in ('C' , 'D') and TechCode not like 'ret%' 
and TechCode in (select distinct TechCode from tbl_TechToPayrollClass) and 
TechCode not in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT' , 'ME' , 'M2' , 'M3' , 'M4' , 'M5') )
and tjs.CSGLastChangedDate >= @stDate and tjs.CSGLastChangedDate <= @edDate
and TechCode not in (select userid from login where type in ('f','s'))
group by datepart(YEAR,tjs.CSGLastChangedDate), datename(month,tjs.CSGLastChangedDate)) as Jobs
where
Month = Jobs.MonthName and Year = Jobs.YearName

select * from @report 