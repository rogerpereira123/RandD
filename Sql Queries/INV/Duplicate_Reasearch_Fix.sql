
declare @InvTxnUnitId varchar(50) = 'M8815ZMBU78'
declare @InvTxnLineInId varchar(50) = 'M8815ZMBL23'
declare @InvTxnOldLineId varchar(50) = 'I8804Z4DL13'

delete u from tbl_InvTxnUnit u where InvTxnUnitId = @InvTxnUnitId

delete i2ou 
--select i2ou.*
from tbl_InvTxnIn2OutUnit i2ou 
where i2ou.InvTxnUnitId = @InvTxnUnitId and i2ou.InvTxnLineInId = @InvTxnLineInId 

update tbl_InvTxnIn2Out set 
Quantity  = Quantity - 1 where InvTxnLineInId = @InvTxnLineInId and InvTxnOldLineId = @InvTxnOldLineId

delete tbl_InvTxnIn2Out where InvTxnLineInId = @InvTxnLineInId and InvTxnOldLineId = @InvTxnOldLineId and Quantity = 0
update tbl_InvTxnLine set Quantity = Quantity - 1 where InvTxnLineId = @InvTxnLineInId
delete tbl_InvTxnLine where InvTxnLineId = @InvTxnLineInId and Quantity = 0

----------------------------------------------

declare @InvTxnUnitIdOut varchar(50) = 'M8815ZMBU78'
declare @InvTxnLineOutId varchar(50) = 'K8815ZMIL48'
declare @InvTxnLineInId1 varchar(50) = 'M8815ZMBL23'

delete o2iu 
--select i2ou.*
from tbl_InvTxnOut2InUnit o2iu 
inner join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId 
where u.InvTxnUnitId = @InvTxnUnitIdOut and o2iu.InvTxnLineOutId = @InvTxnLineOutId 

update tbl_InvTxnOut2In set 
Quantity  = Quantity - 1 where InvTxnLineInId = @InvTxnLineInId1 and InvTxnLineOutId = @InvTxnLineOutId
delete tbl_InvTxnOut2In where InvTxnLineInId = @InvTxnLineInId1 and InvTxnLineOutId = @InvTxnLineOutId and Quantity = 0

update tbl_InvTxnLine set Quantity = Quantity - 1 where InvTxnLineId = @InvTxnLineOutId
delete tbl_InvTxnLine where InvTxnLineId = @InvTxnLineOutId and Quantity = 0