select distinct TechCode from 
tbl_HourlyInvoiceMaster
where 
invoiceid in (

select distinct InvoiceId from tbl_HourlyInvoiceHoursMaster where InvoiceHoursId in
(
select InvoiceHoursId from tbl_HourlyInvoiceHoursLine 
group by InvoiceHoursId having count(InvoiceHoursId) > 1 
and InvoiceHoursId in(
select InvoiceHoursId from tbl_HourlyInvoiceHoursMaster 
where
[date] >= convert(datetime,'01/21/2009' ,101)
and
[date] <= convert(datetime,'02/03/2009',101)
 )
)
)


