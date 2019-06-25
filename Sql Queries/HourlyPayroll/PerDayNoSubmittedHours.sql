select distinct IM.TechCode, TTS.TechName , tjs.CSGLastChangedDate , TTS.Supervisor, TTS1.TechName as 'Supervisor'
from 
tbl_HourlyInvoiceMaster IM
inner join tbl_HourlyInvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_data_job_setup tjs on tjs.WONumber = IL.WoNumber
left join tbl_HourlyInvoiceHoursMaster IHM on (IHM.Date = tjs.CSGLastChangedDate and IHM.InvoiceId = IM.InvoiceId)
inner join tbl_TechTosupervisor TTS on IM.TechCode = TTS.TechCode
inner join tbl_TechTosupervisor TTS1 on TTS.Supervisor = TTS1.TechCode
where
(IM.WeekBeginningDate = '02/04/2009'
or
IM.WeekBeginningDate = '02/11/2009')
and
IHM.InvoiceHoursId Is null
and
IM.TechCode not in (select userid from login where type in ('f' , 'F' ,'s' ,'S'))

select * from 
tbl_HourlyInvoiceMaster IM 
where
(IM.WeekBeginningdate = '02/04/2009'
or 
IM.WeekBeginningDate = '02/11/2009'
)
and
InvoiceId not in (select invoiceid from tbl_HourlyInvoiceHoursMaster)
and
IM.TechCode not in (select userid from login where type in ('f' , 'F' ,'s' ,'S'))



