
update tbl_InvoiceLine set ApprovalStatus = '11' , ApprovedBy = 'racheld' where WoNumber in 
(
select IL.WoNumber 
from tbl_TCSCPayment tc inner join tbl_InvoiceLine IL on tc.WoNumber = IL.WoNumber
left join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
where
IL.ApprovalStatus not in ('11' ,'01', '00')
)

select tc.TechPayCode from tbl_TCSCPayment tc inner join tbl_InvoiceLine IL on tc.WoNumber = IL.WoNumber where IL.InvoiceLineId = 'L20080213-2557'

insert into tbl_InvoiceLineToServiceCode
select IL.InvoiceLineId,  tc.TechPayCode , 1 
from tbl_TCSCPayment tc inner join tbl_InvoiceLine IL on tc.WoNumber = IL.WoNumber
left join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
where
--ILTS.InvoiceLineId not in (select InvoiceLineId from tbl_InvoiceLineToServiceCode where InvoiceServiceCode in ('SVC', 'NP' , 'NTC', 'CSC')) 
ILTS.InvoiceLineId is null


select * from tbl_InvoiceLine where WONumber = '43223350000003007'
select * from tbl_InvoiceMaster where InvoiceId = '20080214-5183-1'
select * from tbl_InvoiceLine where InvoiceLineId = 'L20080130-1285'
select * from tbl_TcScPayment where WONumber = '43223350000003007'
select * from tbl_InvoiceLineToServiceCode where InvoiceLineId = 'L20080214-822'
select * from internalworkorder where wonumber = 'DD000000000028599'
select * from tbl_data_customers where phone = '3308669239'

--Duplicate Invoices

delete from tbl_InvoiceMaster where InvoiceId in
(
select distinct IM.InvoiceId from tbl_InvoiceMaster IM Left join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
where 
IL.InvoiceLineId is null
)
select * from tbl_InvoiceLine where InvoiceId = '20080214-3308-1'
select * from tbl_InvoiceMaster where InvoiceId = '20080214-3308-1'
select * from tbl_WoTimes where WoNumber = '45640936900000010'

select * from tbl_InvoiceLine where InvoiceLineId = 'L20080219-390'

select * from tbl_InvoiceLinetoServiceCode where InvoiceLineId = 'L20080219-390'