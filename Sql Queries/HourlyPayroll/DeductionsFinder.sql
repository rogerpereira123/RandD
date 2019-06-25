declare @PayrollStartDate date= '02/11/2015'
declare @PayrollEnddate date = dateadd(day, 13 , @PayrollStartDate)
select
m.TechCode , 
m.WeekBeginningDate,
m.WeekEndingDate,
h.Amount,
tts.EmployeeNumber

from tbl_HourlyInvoiceAdditionalCharges h 
inner join tbl_HourlyInvoiceMaster m on h.invoiceid = m.InvoiceId
inner join tbl_InvoicePayrollCodes i on h.InvoicePayrollCode = i.PayrollCode
inner join TTSView tts on m.TechCode = tts.TechCode
where
m.WeekBeginningDate >= @PayrollStartDate and 
m.WeekEndingDate <= @PayrollEnddate
and i.PayrollCodeType = 'DEdUCTION'

select
sum(h.Amount) as TotalAmount
from tbl_HourlyInvoiceAdditionalCharges h 
inner join tbl_HourlyInvoiceMaster m on h.invoiceid = m.InvoiceId
inner join tbl_InvoicePayrollCodes i on h.InvoicePayrollCode = i.PayrollCode
where
m.WeekBeginningDate >= @PayrollStartDate and 
m.WeekEndingDate <=@PayrollEnddate
and i.PayrollCodeType = 'DEdUCTION'