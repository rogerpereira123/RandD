
delete from tbl_HourlyInvoiceHoursLine where SrNo in (
select hihl.srno 
from tbl_HourlyInvoiceHoursLine hihl
inner join tbl_HourlyInvoiceHoursMaster hihm on hihl.InvoiceHoursId = hihm.InvoiceHoursId
inner join tbl_HourlyInvoiceMaster him on hihm.InvoiceId = him.InvoiceId
where
hihm.Date < him.WeekBeginningDate
)



delete from tbl_HourlyInvoiceHoursMaster 
where InvoiceHoursId not in (select InvoiceHoursId from tbl_HourlyInvoiceHoursLine)



select * from tbl_HourlyInvoiceMaster where TechCode = '4396'
select * from 
tbl_HourlyInvoiceLine  
hil inner join tbl_data_job_setup tjs on hil.WoNumber = tjs.wonumber
where 
hil.InvoiceId = '20100217-4396-1'
and 
tjs.CSGLastChangedDate = '02/16/2010'


select * from tbl_HourlyInvoiceHoursMaster where InvoiceId = '20100211-4450-1'

select * from tbl_HourlyInvoiceLine where InvoiceId = '20100218-4450-1'


select * from tbl_EventLog where BasicKey = '44663315200033004'
select * from tbl_data_job_setup where wonumber in ('44646268000021033',
'44646786500015013',
'44663315200033004')
select * from tbl_HourlyInvoiceHoursMaster where InvoiceId = '20100210-4396-1'

select * from tbl_HourlyInvoiceHoursLine where InvoiceHoursId = 'H-4396-20100216'


select * from tbl_data_job_setup where wonumber = '44663315200033004'



select him.*, hil.* , tjs.*
from tbl_HourlyInvoiceLine hil inner join tbl_data_job_setup tjs on hil.wonumber = tjs.wonumber
inner join tbl_HourlyInvoiceMaster him on hil.InvoiceId = him.InvoiceId
where
(tjs.CSGLastChangedDate < him.WeekBeginningDate
or
tjs.CSGLastCHangedDate > him.WeekEndingDate)
and
(him.WeekBeginningDate >= '01/27/2010'
)

select * from tbl_EventLog where BasicKey = '43964796905137019'