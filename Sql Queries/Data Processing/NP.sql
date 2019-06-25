select IM.TechCode , IM.WeekBeginningDate, IM.WeekEndingDate,IL.WoNumber ,tdc.Name , IL.ApprovedBy , IL.ApprovedDate , ILTS.InvoiceServiceCode  , ILTS.Count , matrix.value    from 
tbl_InvoiceLineToServicecode ILTS
inner join tbl_InvoiceLine IL on ILTS.InvoiceLineId = IL.InvoiceLineId
inner join tbl_data_job_setup tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_InvoiceMaster IM on IL.InvoiceId  = IM.InvoiceId
inner join tbl_InvoiceServiceCodeMatrix matrix on ILTS.InvoiceServiceCode = Matrix.InvoiceserviceCode
where IL.InvoiceLineId in 
(
select IL.Invoicelineid from tbl_InvoiceLine IL inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoicelineId = ILTS.InvoiceLineId
where
ILTS.InvoiceServiceCode = 'NP'
and
ILTS.Count <>  0
)
and 
ILTS.InvoiceServiceCode <> 'NP'
and
IM.InvoiceClassId = matrix.InvoiceClassId
and
ILTS.[Count] <> 0
and
IL.ApprovalStatus = '11'
and
IL.PayStatus <> '11'

union

select IM.TechCode , IM.WeekBeginningDate, IM.WeekEndingDate, IL.WoNumber ,tdc.Name , IL.ApprovedBy , IL.ApprovedDate  , ILTS.InvoiceServiceCode , ILTS.Count , matrix.value    from 
tbl_InvoiceLineToServicecode ILTS
inner join tbl_InvoiceLine IL on ILTS.InvoiceLineId = IL.InvoiceLineId
inner join internalworkorder tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_InvoiceMaster IM on IL.InvoiceId  = IM.InvoiceId
inner join tbl_InvoiceServiceCodeMatrix matrix on ILTS.InvoiceServiceCode = Matrix.InvoiceserviceCode
where IL.InvoiceLineId in 
(
select IL.Invoicelineid from tbl_InvoiceLine IL inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoicelineId = ILTS.InvoiceLineId
where
ILTS.InvoiceServiceCode = 'NP'
and
ILTS.Count <> 0
)
and 
ILTS.InvoiceServiceCode <> 'NP'
and
IM.InvoiceClassId = matrix.InvoiceClassId
and
ILTS.[Count] <> 0
and
IL.ApprovalStatus = '11'
and
IL.PayStatus <> '11'


