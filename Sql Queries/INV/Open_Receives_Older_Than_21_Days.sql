declare @OldSerialNumbers table
(
SerialNumber varchar(50)
)

--Find all the open serial numbers received before 21 days
insert into @OldSerialNumbers
select
 distinct ITU.SerialNo1 
from tbl_InvTxnLinePOLine tlpl
inner join tbl_InvTxnLine itl on tlpl.InvTxnLineId = itl.InvTxnLineId
inner join tbl_InvTxn txn on itl.InvTxnId = txn.InvTxnId
INNER JOIN tbl_InvTxnUnit ITU ON ITL.InvTxnLineId=ITU.InvTxnLineId    
left join (select txnunit.serialno1
from 
tbl_InvTxnOut2InUnit O2IUnit,
tbl_InvTxnUnit txnUnit,
tbl_invTxnLine txnLine,
tbl_InvTxn txn 
where
O2IUnit.InvTxnUnitId = txnUnit.InvTxnUnitId
and
O2IUnit.InvTxnLineOutId = txnLine.InvTxnLineId
and
txnLine.InvTxnId =  txn.InvTxnId
and
txn.DocNo like 'CTTX%') as closed on itu.SerialNo1 = closed.SerialNo1 
inner join tbl_Product p on itl.ProductId = p.ProductId
where
datediff(day,txn.DocDate,GETDATE() -1) > 365
and
closed.SerialNo1 is null
and p.CategoryId = 4



--find the current consignee

select ITU.SerialNo1 as SrNo, P.ProductName , P.ProductId , TUSER.UserId as Tech# , tts.TechName , w.WarehouseName  from 
		tbl_InvTxn IT
	INNER JOIN tbl_InvTxnLine ITL ON IT.InvTxnId = ITL.InvTxnId    
   	INNER JOIN tbl_InvTxnUnit ITU ON ITL.InvTxnLineId=ITU.InvTxnLineId    
   	INNER JOIN tbl_Product P ON P.ProductId=ITL.ProductId 
	INNER JOIN tbl_User TUSER ON IT.Consignee = TUSER.InvParticipantId   
    inner join tbl_InvParticipant2User ip2u on TUSER.UserId = ip2u.UserId
    inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
    inner join tbl_TechtoSupervisor tts on TUSER.UserId = tts.TechCode
	inner join @OldSerialNumbers s on ITU.SerialNo1 = s.SerialNumber
	where
	ITU.InvTxnUnitId not in(Select distinct InvTxnUnitId from tbl_InvTxnOut2InUnit) 
order by tuser.UserId, ProductName


select ITU.SerialNo1 as SrNo, P.ProductName , P.ProductId ,  w.WarehouseName  from 
		tbl_InvTxn IT
	INNER JOIN tbl_InvTxnLine ITL ON IT.InvTxnId = ITL.InvTxnId    
   	INNER JOIN tbl_InvTxnUnit ITU ON ITL.InvTxnLineId=ITU.InvTxnLineId    
   	INNER JOIN tbl_Product P ON P.ProductId=ITL.ProductId 
    inner join tbl_Warehouse w on IT.Consignee = w.InvParticipantId
	inner join @OldSerialNumbers s on ITU.SerialNo1 = s.SerialNumber
	where
	ITU.InvTxnUnitId not in(Select distinct InvTxnUnitId from tbl_InvTxnOut2InUnit) 
order by w.WarehouseName, ProductName
