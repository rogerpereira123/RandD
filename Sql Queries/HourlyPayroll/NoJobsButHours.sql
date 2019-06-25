select distinct him.TechCode,hihm.Date
from 
tbl_HourlyInvoiceMaster him 
left join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
left join tbl_HourlyInvoiceHoursMaster hihm on him.InvoiceId = hihm.InvoiceId
left join Trainee t on him.TechCode = t.TechCode
where
hil.WoNumber is null
and
hihm.InvoiceHoursId is not null
and
(him.WeekBeginningDate = '01/19/2011' or him.WeekBeginningDate = '01/26/2011')
and
him.TechCode not in (select techcode from tbl_techtosupervisor where techcode = supervisor)
and t.TechCode is null
order by him.TechCode

delete from Trainee where TechCode in (

select  distinct him.TechCode
from tbl_HourlyInvoiceMaster him
inner join Trainee t on him.TechCode = t.TechCode
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
where
(him.WeekBeginningDate = '06/22/2011'
or
him.WeekBeginningDate = '06/29/2011'))

