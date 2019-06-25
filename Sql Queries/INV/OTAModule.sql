select
WONumber , DocDate , u.SerialNo1
from tbl_Wo2InvTxn
w inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine l on t.InvTxnId = l.InvTxnId
inner join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = l.InvTxnLineId
inner join tbl_InvTxnUnit u on u.InvTxnUnitId = o2iu.InvTxnUnitId
where
u.SerialNo1 like 'GRNO%'
and
DocDate > '01/01/2011'
order by DocDate desc


select distinct  p.ProductName, u.SerialNo1 from 
tbl_InvTxn t
inner join tbl_InvTxnLine l on t.InvTxnId = l.InvTxnId
left join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = l.InvTxnLineId
inner join tbl_InvTxnUnit u on u.InvTxnLineId = l.InvTxnLineId
inner join tbl_InvProductToPrefix ptp on l.ProductId = ptp.ProductId
inner join tbl_Product p on ptp.ProductId = p.ProductId
where
o2iu.InvTxnLineOutId is null

and u.SerialNo1 like 'GRNO%'
order by SerialNo1





