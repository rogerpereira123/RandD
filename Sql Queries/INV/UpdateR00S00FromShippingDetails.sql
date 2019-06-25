update tbl_InvTxnUnit set
SerialNo2 = convert(varchar(50),s.R00) , SerialNo3 = convert(varchar(50),s.S00)
from tbl_ShippingDetails s
where
tbl_InvTxnUnit.SerialNo1 = convert(varchar(50), s.[Serial Number])
and
(tbl_InvTxnUnit.SerialNo2 is null
or
tbl_InvTxnUnit.SerialNo3 is null)

select tbl_InvTxnUnit.*
from tbl_ShippingDetails s, tbl_InvTxnUnit
where
tbl_InvTxnUnit.SerialNo1 = convert(varchar(50) , s.[Serial Number])
and
(tbl_InvTxnUnit.SerialNo2 is null
or
tbl_InvTxnUnit.SerialNo3 is null)
