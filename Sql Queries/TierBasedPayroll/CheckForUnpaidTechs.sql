declare @PayrollStartDate date = '07/15/2015'
declare @PayrollEndDate date = Dateadd(day , 13 , @PayrollStartDate)
select distinct him.TechCode 
from tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join TTSView tts on him.TechCode = tts.TechCode
where
hil.PayStatus <> '11'
and tts.UserLevel in (3,7)
and (WeekBeginningDate = @PayrollStartDate or WeekEndingDate= @PayrollEndDate)
and tts.TechCode <> '0025'

