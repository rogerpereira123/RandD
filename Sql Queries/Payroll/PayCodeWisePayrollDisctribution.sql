declare @StartDate date = '07/04/2012'
declare @EndDate date
declare @PayDate date
set @EndDate = DATEADD(day , 13, @StartDate)
set @PayDate = DATEADD(day, 17  , @EndDate)


declare @TechCode varchar(20) = '6830'

select 
@StartDate as PayrollStartDate , @EndDate as PayrollEndDate , @PayDate as PayDate , ILTS.InvoiceServiceCode as PayCode, m.value as PayCodeValue , sum(ILTS.Count) as NumberOfJobsDone , SUM(ILTS.Count * m.value) as AmountPaid
from tbl_InvoiceMaster IM
inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
inner join tbl_InvoiceServiceCodeMatrix m on IM.InvoiceClassId = m.InvoiceClassId and ILTS.InvoiceServiceCode = m.InvoiceServiceCode 
where
IL.PayDate = @PayDate
and
IM.TechCode = @TechCode
group by ILTS.InvoiceServiceCode, m.value
