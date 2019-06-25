select
w.WoNumber,tjs.CSGLastChangedDate , tjs.TechCode , u.SerialNo1 , p.ProductId, tin.DocDate
from 
tbl_Wo2InvTxn w
inner join tbl_Data_Job_Setup tjs on w.WoNumber = tjs.WONumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = tl.InvTxnLineId
inner join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
inner join tbl_InvTxnLine lineIn on lineIn.InvTxnLineId = o2iu.InvTxnLineInId
inner join tbl_InvTxn tin on lineIn.InvTxnId = tin.InvTxnId
where
p.CategoryId = 28
and tjs.CSGLastChangedDate >= '07/02/2014'
and dbo.udf_IsContractor(tjs.TechCode, 0) <> ''
and tin.DocDate >=  '07/02/2014'
and tin.DocType =26
