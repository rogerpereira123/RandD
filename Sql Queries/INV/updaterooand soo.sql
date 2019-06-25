
select * from serial
update tbl_ra set tbl_ra.[Tracking Number] = s.[Tracking Number] , tbl_ra.[Smart Card #] = s.[Smart Card #] 
from serial s
where
s.[Dish Serial #] = tbl_ra.[Dish Serial #]
and 
s.[Tracking Number] is not null


update tbl_raed set tbl_raed.[TrackingNumber] = s.[Tracking Number] , tbl_raed.[SmartCardNumber] = s.[Smart Card #] 
from serial s
where
s.[Dish Serial #] = tbl_raed.[SerialNumber]
and 
s.[Tracking Number]is not null

delete from tbl_raed
from serial s
where
s.[Dish Serial #] = tbl_raed.[SerialNumber]
and 
s.[Tracking Number] is null


delete from tbl_ra
from serial s
where
s.[Dish Serial #] = tbl_ra.[Dish Serial #]
and 
s.[Tracking Number] is null



update tbl_ra set status = '000'
from serial s
where
s.[Dish Serial #] = tbl_ra.[Dish Serial #]
and 
s.[Tracking Number] is not null
and
tbl_ra.Status = '101'


update tbl_InvTxnUnit set SerialNo2 = s.[Tracking Number], Serialno3 = s.[Smart Card #]
from serial s
where
s.[Dish Serial #] = tbl_InvTxnUnit.[SerialNo1]
and 
s.[Tracking Number] is not null



drop table serial


