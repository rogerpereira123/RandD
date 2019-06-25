
drop table #temp1
select distinct txnUnit.SerialNo1 , txnLine.ProductId , tp.ProductName 
into #temp1
 from
tbl_InvTxnUnit txnUnit,
tbl_invTxnLine txnLine,
tbl_InvTxn txn,
tbl_Product tp 
where
txnLine.InvTxnId =  txn.InvTxnId
and
txnLine.InvTxnLineId = txnUnit.InvTxnLineId
and
tp.ProductId = txnLine.ProductId
and
txnUnit.SerialNo1 not in
(
select distinct txnUnit.SerialNo1 as SerialNumber 
from 
tbl_InvTxnOut2InUnit O2IUnit,
tbl_InvTxnUnit txnUnit,
tbl_invTxnLine txnLine,
tbl_InvTxn txn 
where
--(txnUnit.SerialNo1 = @serialNumber or txnUnit.SerialNo2 = @serialNumber)
--and
O2IUnit.InvTxnUnitId = txnUnit.InvTxnUnitId
and
O2IUnit.InvTxnLineOutId = txnLine.InvTxnLineId
and
txnLine.InvTxnId =  txn.InvTxnId
and
txn.DocNo like '%CTTX%'

)
and 
txnUnit.SerialNo1 not like '%GRN%'



select * from #temp1 where serialno1 in (
select SerialNo1 from #temp1 group by SerialNo1 having count(serialno1) > 1)


/*update tbl_InvTxnLine 
set
ProductId = unit2.ProductId*/

select distinct IL.InvTxnLineId, IL.ProductId , tp1.ProductName LineProductName, unit1.StockNo , tp2.ProductName UnitProductName , unit1.SerialNo1
into #dup
from 
tbl_InvTxnLine IL, tbl_InvTxnUnit unit1 , tbl_Product tp1 , tbl_Product tp2
where
unit1.StockNo <> IL.ProductId
and
IL.InvTxnLineId = unit1.InvTxnLineId
and
unit1.StockNo <> ''
and
tp1.ProductId = IL.ProductId
and
tp2.ProductId = unit1.StockNo




--select * from #temp1 where SerialNo1 = 'DPPTC40621'

