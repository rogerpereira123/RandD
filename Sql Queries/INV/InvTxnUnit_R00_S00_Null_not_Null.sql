select * from tbl_InvTxnUnit where SerialNo2 is null and serialno3 is null
and
serialno1 in (select serialno1 from tbl_InvTxnUnit where serialno2 is not null)


select serialno1 , serialno2,serialno3 into #s from tbl_InvTxnUnit where serialno2 is not null
update tbl_InvTxnUnit set
serialno2 = s.Serialno2,
serialno3 = s.serialno3
from #s s
where
s.SerialNo1 = tbl_InvTxnUnit.SerialNo1
and 
tbl_InvTxnUnit.SerialNo2 is null
