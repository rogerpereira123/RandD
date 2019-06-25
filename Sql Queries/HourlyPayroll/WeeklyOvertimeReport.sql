select
round(sum((DATEDIFF(minute,  convert(time , hihl.starttime) , CONVERT(time, hihl.EndTime)) / 60.0)),2) as HoursWorked 
from
tbl_HourlyInvoiceHoursMaster hihm inner join 
tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
where hihm.[Date] >= '10/01/2012' and hihm.[Date] <= '12/31/2012'

