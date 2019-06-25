
declare @TechCode varchar(50)
declare @StartDate varchar(10)
 declare @EndDate varchar(10)
declare @PayDate varchar(10)
 
 set @TechCode ='6111'
 set @PayDate ='11/27/2009'

select IL.WoNumber, ILTS.InvoiceServiceCode,ISCM.InvoiceServiceCodeDesc , ILTS.Count ,convert(varchar(10) , TJS.CSGLastChangedDate , 101) as ClosedDate, tdc.Name as CustomerName ,convert(varchar(10) , IL.PayDate, 101) as PayDate 
from 
tbl_InvoiceLine IL 
inner join tbl_InvoiceMaster IM on IL.InvoiceId = IM.InvoiceId
left outer join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
left outer join tbl_InvoiceServiceCodeMaster ISCM on ILTS.InvoiceServiceCode = ISCM.InvoiceServiceCode
inner join tbl_data_job_setup tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.Customerid = tdc.Customerid
where
IL.PayDate = @PayDate
and
IM.TechCode = @TechCode

union

select IL.WoNumber, ILTS.InvoiceServiceCode,ISCM.InvoiceServiceCodeDesc , ILTS.Count ,convert(varchar(10) , TJS.LastUpdatedDt , 101) as ClosedDate , tdc.Name as CustomerName ,convert(varchar(10) , IL.PayDate, 101) as PayDate
from 
tbl_InvoiceLine IL 
inner join tbl_InvoiceMaster IM on IL.InvoiceId = IM.InvoiceId
left outer join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
left outer join tbl_InvoiceServiceCodeMaster ISCM on ILTS.InvoiceServiceCode = ISCM.InvoiceServiceCode
inner join internalworkorder tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.Customerid = tdc.Customerid
where
IL.PayDate = @PayDate
and
IM.TechCode = @TechCode