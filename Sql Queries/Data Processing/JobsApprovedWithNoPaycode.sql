select IL.WoNumber, tjs.WOrkOrderType , tdc.Name , IM.TechCode , IM.WeekBeginningDate, IM.WeekEndingDate, convert(varchar(10) , IL.ApprovedDate ,101) as ApprovedDate , IL.ApprovedBy , 
case when IL.PayStatus =  '11' then 'Paid' else 'Not Paid' end as [Payment Status]
from tbl_InvoiceLine IL
inner join tbl_InvoiceMaster IM on IL.InvoiceId = IM.InvoiceId
left outer join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
inner join tbl_data_job_setup tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
where
ILTS.InvoiceServiceCode is null
and
IL.ApprovalStatus = '11'


union

select IL.WoNumber, tjs.WOrkOrderType , tdc.Name , IM.TechCode , IM.WeekBeginningDate, IM.WeekEndingDate, convert(varchar(10) , IL.ApprovedDate ,101) as ApprovedDate , IL.ApprovedBy , 
case when IL.PayStatus =  '11' then 'Paid' else 'Not Paid' end as [Payment Status]
from tbl_InvoiceLine IL
inner join tbl_InvoiceMaster IM on IL.InvoiceId = IM.InvoiceId
left outer join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
inner join internalworkorder tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
where
ILTS.InvoiceServiceCode is null
and
IL.ApprovalStatus = '11'
order by IM.TechCode , tdc.NAme



