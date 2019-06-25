
declare @PayrollStartDate date  = '10/23/2013'
declare @PayDate date = '11/22/2013'

/*select * from tbl_ManagementSummary where PayrollStartDate = @PayrollStartDate

select * from tbl_HourlyInvoiceLine where PayDate = @PayDate and PayStatus = '11'

select * from tbl_InvoiceLine where PayDate = @PayDate and PayStatus = '11'

select * from tbl_TrainerPayment where PayDate = @PayDate*/
--select * from tbl_SmallPartsTransactionToContractorInvoice where PayDate = @PayDate



delete from tbl_ManagementSummary where PayrollStartDate = @PayrollStartDate
update tbl_HourlyInvoiceLine set PayStatus = '00'  where PayDate = @PayDate
update tbl_InvoiceLine set PayStatus = '00'  where PayDate = @PayDate
delete from tbl_TrainerPayment where PayDate = @PayDate
delete  from tbl_HourlyWOConnectivityPay where PayDate = @PayDate
delete from tbl_InvoiceToPayrollParametersAdditionsDeductions where AddedBy = 'Payroll' and CONVERT(date, DateAdded) = '11/13/2013'
delete from tbl_SmallPartsTransactionToContractorInvoice where PayDate = @PayDate