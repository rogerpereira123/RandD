select distinct
tdc.Name,tdc.Phone,tjs.WoNumber as OriginalWO, tjs.CsgLastChangedDate as OriginalClosedDate , tc.WONumber as TroubleCall , tc.SaleDate as TCCreatedDate-- , notes.DDAdditionalNote as  NorthwareNote
from 
tbl_Wo2InvTxn wo2txn 
inner join tbl_InvTxn txn on wo2txn.InvTxnId = txn.InvTxnId
inner join tbl_InvtxnLine txnLine on txn.InvTxnId = txnLine.InvTxnId
inner join tbl_data_job_setup tjs on wo2txn.WoNumber = tjs.WONumber
inner join tbl_data_customers tdc on tjs.CUstomerId = tdc.CustomerId
inner join tbl_data_job_setup tc on tjs.CustomerId = tc.CustomerId
--inner join tbl_acct_notes notes on notes.CustomerId = tdc.CustomerId
where
/*txnLine.ProductId in (select productId from tbl_Product where categoryid = 4)
and*/
txnLine.ProductId in ('159186' , '160183')
and
tjs.CSgLastChangedDate >= '02/01/2009'
and
tjs.CSGLastChangedDate <= '02/28/2009'
and
Datediff(day , tjs.CSgLastChangedDate , tc.SaleDate) <= 12
and
Datediff(day , tjs.CSgLastChangedDate , tc.SaleDate) > 0
and
tc.WorkorderType in ('TC','SC')
/*and
convert(datetime,notes.[date],101) > tjs.CSgLastChangedDate*/

