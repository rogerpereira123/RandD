select * into #ra from tbl_raed where serialnumber is not null
and
serialnumber not in ( select txnunit.SerialNo1
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
txn.DocNo like 'CTTX%') 
and
serialnumber in (select serialno1 from tbl_InvTxnUnit)
and 
/*name not like '%wild%'
and
name not like '%DP%'and
name not like '%34%'
and
name not like '%Dish%'
and
name not like '%flat%'
and
name not like '%kit%'
and
name not like '%swi%'
and
name not like '%lnbf%'*/
serialnumber like 'D%'



select 
r.SerialNumber, tdc.Name, tdc.Phone, tjs.CSGLastChangedDate as ClosedDAte
from #ra r inner join tbl_data_job_setup tjs on r.WorkOrderNumber= tjs.WoNumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
order by tjs.ClosedDate