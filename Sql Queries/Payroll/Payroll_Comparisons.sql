declare @TechCode varchar(20) = '6830'
declare @PayDate date = '07/20/2012'
declare @PayrollStartDate date
set @PayrollStartDate = DATEADD(DAY , -30 , @PayDate )
declare @PayrollEndDate date
set @PayrollEndDate = DATEADD(day, 13 , @PayrollStartDate)


select
@PayrollStartDate as PayrollStartDate , @PayrollEndDate as PayrollEndDate , tjs.WorkorderType ,ILTS.InvoiceServiceCode, m.value,  SUM(ILTS.Count * m.value) as Pay, Count(tjs.WONumber) as Jobs
from
tbl_InvoiceMaster IM
inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
inner join tbl_InvoiceServiceCodeMatrix m on m.InvoiceServiceCode = ILTS.InvoiceServiceCode
inner join tbl_Data_Job_Setup tjs on IL.WONumber = tjs.WONumber
where
IL.PayDate = @PayDate
and IM.TechCode = @TechCode
and m.InvoiceClassId = IM.InvoiceClassId
group by tjs.WorkorderType, ILTS.InvoiceServiceCode, m.value
order by tjs.WorkorderType, ILTS.InvoiceServiceCode


select
@PayrollStartDate as PayrollStartDate , @PayrollEndDate as PayrollEndDate , tjs.WorkorderType, ILTS.InvoiceServiceCode, m.value, SUM(ILTS.Count * m.value) as Pay,  Count(tjs.WONumber) as Jobs
from
tbl_InvoiceMaster IM
inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
inner join tbl_InvoiceServiceCodeMatrix m on m.InvoiceServiceCode = ILTS.InvoiceServiceCode
inner join tbl_Data_Job_Setup tjs on IL.WONumber = tjs.WONumber
where
IL.PayDate = @PayDate
and IM.TechCode = @TechCode
and m.InvoiceClassId = 'M7'
group by tjs.WorkorderType , ILTS.InvoiceServiceCode, m.value
order by tjs.WorkorderType, ILTS.InvoiceServiceCode