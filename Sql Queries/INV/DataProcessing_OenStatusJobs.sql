select IM.TechCode, IM.WeekBeginningDate, IM.WeekEndingDate, IL.WoNumber, tdc.Name as CustomerName  from 
tbl_InvoiceMaster IM inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_data_job_setup tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
where
IM.WeekBeginningDate >= '01/23/2008'
and
IM.WeekEndingDate <= '02/05/2008'
and
IL.ApprovalStatus not in ('11' , '01')

union

select IM.TechCode, IM.WeekBeginningDate, IM.WeekEndingDate, IL.WoNumber, tdc.Name as CustomerName  from 
tbl_InvoiceMaster IM inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join internalworkorder tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
where
IM.WeekBeginningDate >= '01/23/2008'
and
IM.WeekEndingDate <= '02/05/2008'
and
IL.ApprovalStatus not in ('11' , '01')



/*
select * from 
tbl_InvoiceMaster IM inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId 
 
where
IM.WeekBeginningDate >= '01/23/2008'
and
IM.WeekEndingDate <= '02/05/2008'
and
IL.ApprovalStatus not in ('11' , '01')
