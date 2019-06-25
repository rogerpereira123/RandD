declare @Date1 datetime
declare @date2 datetime
set @Date1 = '05/27/2009'
set @date2 = DATEADD(DAY ,13, @Date1 )







/* Hours
select    
sum((DATEDIFF(minute,  convert(time , hihl.starttime) , CONVERT(time, hihl.EndTime)) / 60.0))
from
tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
where
him.WeekBeginningDate = @Date1
or
him.WeekEndingDate = @date2*/

--Points
select distinct him.TechCode from
tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
--inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber
where
him.WeekBeginningDate = @Date1
or
him.WeekEndingDate = @date2

select Count(tjs.WONumber) from
tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join InternalWorkOrder tjs on hil.WONumber = tjs.WONumber
where
him.WeekBeginningDate = @Date1
or
him.WeekEndingDate = @date2