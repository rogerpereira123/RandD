
select
im.WeekBeginningDate , im.WeekEndingDate , im.TechCode , iac.InvoicePayrollCode , ipc.PayrollCodeDesc, ipc.PayrollCodeType  , iac.Amount , iac.Comments  
 from tbl_InvoicePayrollCodes ipc 
inner join tbl_InvoiceAdditionalCharges iac on ipc.PayrollCode = iac.InvoicePayrollCode
inner join tbl_InvoiceMaster im on iac.InvoiceId = im.InvoiceId
where im.WeekBeginningDate >= '04/10/2013' and ipc.PayrollCodeType = 'DEDUCTION'
and datediff(day , '04/10/2013' , im.WeekBeginningDate) % 14 <> 0
order by WeekBeginningDate asc

