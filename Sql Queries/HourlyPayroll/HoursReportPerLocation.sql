
declare @PlaceHolder float = 0
select
w.WarehouseName, him.TechCode, tts.TechName,convert(varchar(10), him.WeekBeginningDate,101) as PayWeekStartDate  , converT(varchar(10),him.WeekEndingDate,101) as PayWeekEndDate,  round(sum((DATEDIFF(minute,  convert(time , hihl.starttime) , CONVERT(time, hihl.EndTime)) / 60.0)),2)  as TotalHours,
case when round(sum((DATEDIFF(minute,  convert(time , hihl.starttime) , CONVERT(time, hihl.EndTime)) / 60.0)),2) - 40 < 0 then 0 else round(sum((DATEDIFF(minute,  convert(time , hihl.starttime) , CONVERT(time, hihl.EndTime)) / 60.0)),2) - 40 end as Overtime,
@PlaceHolder as Points, @PlaceHolder as PointsPerHour
into #OT
from 
tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
inner join tbl_InvParticipant2User ip2u on ip2u.UserId = him.TechCode
inner join tbl_Warehouse w on w.InvParticipantId = ip2u.InvParticipantId
inner join tbl_TechtoSupervisor tts on him.TechCode = tts.TechCode
where
him.WeekBeginningDate >= '01/01/2013'

group by w.WarehouseName, him.TechCode,tts.TechName , him.WeekBeginningDate ,him.WeekEndingDate having round(sum((DATEDIFF(minute,  convert(time , hihl.starttime) , CONVERT(time, hihl.EndTime)) / 60.0)),2) > 55
order by him.TechCode, WeekBeginningDate


update o
set o.Points = js.Points
from #OT as o 
inner join
(
select ot.TechCode, ot.PayWeekStartDate, sum(tjs.WOrkUnits) as Points
from #OT as ot
inner join  tbl_HourlyInvoiceMaster him on ot.TechCode = him.TechCode and ot.PayWeekStartDate = him.WeekBeginningDate
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber
group by ot.TechCode, ot.PayWeekStartDate
) as js on o.TechCode = js.TechCode and o.PayWeekStartDate = js.PayWeekStartDate

update o
set o.Points = o.Points + js.Points
from #OT as o 
inner join
(
select ot.TechCode, ot.PayWeekStartDate, sum(tjs.Points) as Points
from #OT as ot
inner join  tbl_HourlyInvoiceMaster him on ot.TechCode = him.TechCode and ot.PayWeekStartDate = him.WeekBeginningDate
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join InternalWorkOrder tjs on hil.WONumber = tjs.WONumber
group by ot.TechCode, ot.PayWeekStartDate
) as js on o.TechCode = js.TechCode and o.PayWeekStartDate = js.PayWeekStartDate


update #OT
set PointsPerHour= ROUND( Points / TotalHours,2)


select o.* , tde.HireDate, DATEDIFF(day, tde.HireDate , '01/01/2013') as NumberOfDaysInCompanyAsOff01012013 from #OT o
inner join tbl_Data_Employees tde on o.TechCode = tde.TechNumber and DATEDIFF(day, tde.HireDate , '01/01/2013') > 90
where PointsPerHour < 6 
and o.WarehouseName = 'GALION'
 order by WarehouseName, TechCode

drop table #OT
