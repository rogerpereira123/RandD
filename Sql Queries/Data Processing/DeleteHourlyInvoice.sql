declare @TechCode varchar(50) = '010440245'
declare @WeekBeginningDate date = '04/30/2014'

/*
select cin.*
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
inner join tbl_OutTechClockIn cin on cin.InvoiceHoursId = hihm.InvoiceHoursId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

select cout.*
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
inner join tbl_OutTechClockOut cout on cout.InvoiceHoursId = hihm.InvoiceHoursId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate


select hihl.*
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

select hihm.*
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

select hil.*
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate


select him.*
from tbl_HourlyInvoiceMaster him 
 where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

*/



delete cout
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
inner join tbl_OutTechClockOut cout on cout.InvoiceHoursId = hihm.InvoiceHoursId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

delete cin
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
inner join tbl_OutTechClockIn cin on cin.InvoiceHoursId = hihm.InvoiceHoursId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate



delete hihl
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

delete hihm
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

delete hil
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate


delete him
from tbl_HourlyInvoiceMaster him 
 where him.TechCode = @TechCode
and him.WeekBeginningDate = @WeekBeginningDate

