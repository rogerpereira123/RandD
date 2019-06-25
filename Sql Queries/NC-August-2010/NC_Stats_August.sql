declare @StartDate datetime
declare @EndDate datetime
set @StartDate = '08/01/2010'
set @EndDate = '08/31/2010'
select
 tjs.WONumber,tjs.WorkorderType,tjs.CSGStatus,tjs.techcode,tdc.NAME as CustomerName, tdc.PHONE, tjs.SaleDate as CreateDate,tjs.ScheduledDate,tjs.CSGLastChangedDate,zts.Supervisor,
ttsSup.TechName as SupervisorName
into #TotalCreated
from 
tbl_Data_Job_Setup tjs
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_TechtoSupervisor ttsSup on zts.Supervisor = ttsSup.TechCode
left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode

where
tjs.CSGStatus <> 'G'
and
tjs.SaleDate >= @StartDate
and
tjs.SaleDate <= @EndDate
and
tjs.WorkorderType in ('NC','RC')
and
oom.TechCode is null
and 
tjs.techcode not like 'ret%'


delete #TotalCreated
from 
tbl_Data_Job_Setup tjs
where 
#TotalCreated.WoNumber = tjs.WONumber
and
tjs.CSGLastChangedDate = tjs.SaleDate
and tjs.CSGStatus in ('X')


select
tjs1.WONumber as WoNumber1,tjs1.SaleDate as SaleDate1,tjs1.ScheduledDate as ScheduledDate1,tjs1.CSGStatus as CSGStatus1,tjs1.TechCode as TechCode1, tjs2.WONumber as WONumber2,tjs2.SaleDate as SAleDate2,tjs2.ScheduledDate as ScheduledDate2
,tjs2.CSGStatus as CSGStatus2,tjs2.TechCode as TechCode2
into #multipleJobs
from
tbl_Data_Job_Setup tjs1
inner join tbl_Data_Job_Setup tjs2 on tjs1.CustomerID = tjs2.CustomerID
where
tjs1.WONumber <> tjs2.WONumber 
and
tjs1.ScheduledDate = tjs2.ScheduledDate
and
tjs1.SaleDate >=@StartDate
and
tjs1.SaleDate <=@EndDate
and
tjs2.WONumber > tjs1.WONumber
and
tjs1.WorkorderType in ('NC','RC')
and
tjs2.WorkorderType in ('NC','RC')
and
tjs1.CSGStatus <> 'G'
and
tjs2.CSGStatus <> 'G'


delete #TotalCreated
from #MultipleJobs
where
#MultipleJobs.WOnumber1 = #TotalCreated.WONumber
and
#MultipleJobs.CSGStatus1 in ('C' , 'D')
and
#MultipleJobs.CSGStatus2 in ('C','D')
and
#MultipleJobs.WONumber2 in (select WONumber from #TotalCreated)

delete #TotalCreated
from #MultipleJobs
where
#MultipleJobs.WOnumber1 = #TotalCreated.WONumber
and
#MultipleJobs.CSGStatus1 in ('X')
and
#MultipleJobs.CSGStatus2 in ('C','D')
and
#MultipleJobs.WONumber2 in (select WONumber from #TotalCreated)

delete #TotalCreated
from #MultipleJobs
where
#MultipleJobs.WOnumber2 = #TotalCreated.WONumber
and
#MultipleJobs.CSGStatus1 in ('C')
and
#MultipleJobs.CSGStatus2 in ('X')
and
#MultipleJobs.WONumber1 in (select WONumber from #TotalCreated)

delete #TotalCreated
from #MultipleJobs
where
#MultipleJobs.WOnumber1 = #TotalCreated.WONumber
and
#MultipleJobs.CSGStatus1 in ('X')
and
#MultipleJobs.CSGStatus2 in ('X')
and
#MultipleJobs.WONumber2 in (select WONumber from #TotalCreated)

delete #TotalCreated
from #MultipleJobs
where
#MultipleJobs.WOnumber1 = #TotalCreated.WONumber
and
#MultipleJobs.CSGStatus1 in ('X')
and
#MultipleJobs.CSGStatus2 in ('O')
and
#MultipleJobs.WONumber2 in (select WONumber from #TotalCreated)

delete #TotalCreated
from #MultipleJobs
where
#MultipleJobs.WOnumber2 = #TotalCreated.WONumber
and
#MultipleJobs.CSGStatus1 in ('O')
and
#MultipleJobs.CSGStatus2 in ('X')
and
#MultipleJobs.WONumber1 in (select WONumber from #TotalCreated)


select * from #TotalCreated
where
CSGStatus = 'C'
and WOnumber  not in (select work_order_number from dish where opportunity = 1 and completed = 1)

select * from #TotalCreated



drop table #TotalCreated
drop table #MultipleJobs
