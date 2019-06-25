select distinct tts.TechCode , tts.TechName, tts.Supervisor,ttp.InvoiceClassId ,hihm.date,hihm.InvoiceHoursId from tbl_HourlyInvoiceHoursLine hihl
inner join tbl_HourlyInvoiceHoursMaster HIHM on hihl.InvoiceHoursId = hihm.InvoiceHoursId
inner join tbl_HourlyInvoiceMaster him on hihm.InvoiceId = him.InvoiceId
inner join tbl_TechToSupervisor tts on him.TechCode = tts.TechCode
inner join tbl_TechtoPayrollClass ttp on tts.TechCode = ttp.TechCode and ttp.STartDate in ('02/03/2010' , '02/17/2010')
where hihl.InvoiceHoursId in (
select l.InvoiceHoursId
from tbl_HourlyInvoiceHoursMaster m 
inner join tbl_HourlyInvoiceHoursLine l on m.InvoiceHoursId = l.InvoiceHoursId
where
/*l.OtherDescription like '%timeclock%'
and*/
m.Date > '02/09/2010'
group by l.InvoiceHoursId having count(l.InvoiceHoursID) > 1)
and
TimeDescriptionId  = 0
and
hihl.InvoiceHoursId in (select InvoiceHoursId from tbl_hourlyInvoiceHoursLine where OtherDescription like '%timeclock%')





