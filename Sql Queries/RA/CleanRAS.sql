--select * from tbl_Ra_status
--Receivers
select raed.* from 
tbL_raed raed inner join tbl_ra ra on raed.SerialNumber = ra.[Dish Serial #] 
where
raed.IsReceived = 0 and
ra.Status in ('011' , '100')
and
ra.[Dish Serial #] is not null

update tbl_raed
set IsReceived = 1 
from 
tbl_ra ra
where
IsReceived = 0 
and
ra.Status in ('011' , '100')
and
ra.[Dish Serial #] is not null
and
ra.[Dish Serial #] = tbl_raed.SerialNumber
/*******************************/



--Accessories

select raed.* from 
tbl_raed raed inner join tbl_ra ra on raed.WorkOrderNumber = ra.[Dish Wo Number] 
where
raed.IsReceived = 0 and
ra.Status in ('011' , '100')
and
ra.[Dish Serial #] is null
and
convert(varchar , ra.Desc1) = raed.Name

update tbl_raed
set IsReceived = 1 
from 
tbl_ra ra
where
IsReceived = 0 
and
ra.Status in ('011' , '100')
and
ra.[Dish Serial #] is null
and
convert(varchar , ra.Desc1) = tbl_raed.Name
and
ra.[Dish Wo Number] = WorkOrderNumber 
/*******************************/












select tr.*
from tbl_InvoiceLine IL
inner join tbl_raed tr on IL.WONumber = tr.WorkOrderNumber
where
IL.ApprovalStatus = '11'
and
tr.IsReceived = 0

update tbl_raed
set 
IsReceived = 1
from tbl_InvoiceLine IL 
where
IL.WoNumber = tbl_raed.WorkOrderNumber
and
IL.ApprovalStatus = '11'
and
IsReceived = 0
