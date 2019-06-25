select distinct unit.serialno1,  unit.serialno2 from tbl_InvTxnUnit unit
left join (
select txnunit.serialno1
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
txn.DocNo like 'CTTX%') as closed on unit.SerialNo1 = closed.SerialNo1 
inner join tbl_InvTxnLine line on unit.InvTxnLineId = line.InvTxnLineId
inner join tbl_Product tp on line.ProductId = tp.ProductId
where
closed.SerialNo1 is null
and
tp.CategoryId = 4


select * from tbl_InvTxnUnit where SErialNo1 = 'R0060765927'