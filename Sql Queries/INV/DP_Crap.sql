
select IL.InvoiceLineId
from 
tbl_InvoiceLine IL Left Join tbl_InvoiceLineToServiceCode ILS on IL.InvoiceLineId = ILS.InvoiceLineId 
left join tbl_InvoiceLineToPending ILP on IL.InvoiceLineId = ILP.InvoiceLineId 
where IL.WoNumber
in
(select  WoNumber  from tbl_InvoiceLine where wonumber in (select WoNumber from tbl_InvoiceLine group by WoNumber having count(WoNumber) > 1) group by InvoiceId, WoNumber having count(InvoiceId) > 1 and count(WoNumber) > 1)
and
ILS.InvoiceLineId is null
and
ILP.ReasonId is not null

select WoNumber from tbl_Invoiceline group by WoNumber having count(wonumber) > 1


select * into #d from tbl_InvoiceLine where WoNumber in 

(
select  WoNumber  
from tbl_InvoiceLine IL
inner join tbl_InvoiceMaster IM on IL.InvoiceId = IM.InvoiceId
where 
IM.WeekBeginningDate = '01/30/2008'
and
IM.WeekEndingDate = '02/05/2008'
and
approvalstatus = ''
and
wonumber in 
(select WoNumber from tbl_InvoiceLine group by WoNumber having count(WoNumber) > 1) group by IL.InvoiceId, WoNumber having count(IL.InvoiceId) > 1 and count(WoNumber) > 1
)
and
ApprovalStatus = ''
order by WoNumber


select InvoiceId , WONumber , count(WoNumber) from tbl_InvoiceLine group by InvoiceId , WoNumber, approvalstatus having count(WoNumber) > 1 and ApprovalStatus not in ('00', '11')





select * from tbl_InvoiceLine where WONumber = '43460110500035002' order by InvoiceLineID

select * from tbl_InvoiceLineToServiceCode where InvoiceLineId = 'L20080207-641'










select * from tbl_InvoiceLine where WoNumber = '15214113200232008'

select * from tbl_InvoiceLine where InvoiceLineId = 'L20080129-1176'

delete from tbl_InvoiceLine where InvoiceLineId in ('L20080129-1192')

select * from tbl_InvoiceMaster where techcode = '2692'


/*delete from tbl_InvoiceLine where InvoiceLineId in 
(
select IL.InvoiceLineId from 
tbl_InvoiceMaster IM 
inner join tbl_InvoiceLine IL on IM.InvoiceId  = IL.InvoiceId
left join tbl_InvoiceLineToServiceCode ILS on IL.InvoiceLineId = ILS.InvoiceLineId
inner join tbl_data_job_setup tjs on IL.WoNumber = tjs.WoNumber
inner join tbl_data_Customers tdc on tjs.CustomerId = tdc.CustomerId
where
IM.InvoiceId = '20080130-3097-1'
and
tjs.CSGLastChangedDate > '01/29/2008'
)


delete from tbl_InvoiceLine where InvoiceLineId in 
('L20080129-193')
select IL.InvoiceLineId from 
tbl_InvoiceMaster IM 
inner join tbl_InvoiceLine IL on IM.InvoiceId  = IL.InvoiceId
left join tbl_InvoiceLineToServiceCode ILS on IL.InvoiceLineId = ILS.InvoiceLineId
inner join internalworkorder iwo on IL.WoNumber = iwo.WoNumber
inner join tbl_data_Customers tdc on iwo.CustomerId = tdc.CustomerId
where
IM.InvoiceId = '20080130-3097-1'
and
iwo.LastupdatedDt > '01/29/2008'

)*/
--select * from tbl_data_job_setup where WoNumber = '43009973905045004'

