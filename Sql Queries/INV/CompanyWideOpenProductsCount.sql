select 
 p.ProductId ,P.ProductName ,/* Count(p.productName),ITU.SerialNo1,ITU.SerialNo2,ITU.SerialNo3*/ count(itu.serialno1)
--TUSER.UserId , Wh.WarehouseName, ITU.SerialNo1
from 
tbl_InvTxn IT
iNNER JOIN tbl_InvTxnLine ITL ON IT.InvTxnId = ITL.InvTxnId    
INNER JOIN tbl_InvTxnUnit ITU ON ITL.InvTxnLineId=ITU.InvTxnLineId    
INNER JOIN tbl_Product P ON P.ProductId=ITL.ProductId 
left join tbl_InvTxnOut2InUnit O2IU on ITU.InvTxnUnitId = o2IU.InvTxnUnitId
left JOIN tbl_User TUSER ON IT.Consignee = TUSER.InvParticipantId   
left join tbl_Warehouse wh on IT.consignee = wh.InvParticipantId   
where
O2IU.InvTxnUnitId is null

and
P.ProductId in ('PPX-212')
--and P.ProductName like '%922%'

group by p.ProductName , P.ProductId
