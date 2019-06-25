select * into #sd  from tbl_raed   where Name like 'SUPERDISH TO D1000 REPOINT KIT'
delete from tbl_raed   where Name like 'SUPERDISH TO D1000 REPOINT KIT'


select * from tbl_product where ProductId = '123826'


insert into tbl_ra
select 
'DP DUAL-NO SHELL ' , 
[S/O type Desc] , 
[Equip. Fail?] , 
Reason , 
[Tracking Number], 
[Smart Card #] , 
[Dish Serial #] , 
[Dish Wo Number] , 
Name, 
[Dish Customer #] ,
[Service Tech - 01043] , 
[SO Number],
null,
[Product Category],
[Qty/ Units],
[Date Closed],
'123826',
[Line Number],
[Loc-ation],
'000' , 
LastSubmitted,
RMAReceivedDAte,
'',
FedexId,
ReadyToshipDate,
ReceiverComments
from #sd



insert into tbl_ra
select 
'DUAL LNB - DISH PRO' , 
[S/O type Desc] , 
[Equip. Fail?] , 
Reason , 
[Tracking Number], 
[Smart Card #] , 
[Dish Serial #] , 
[Dish Wo Number] , 
Name, 
[Dish Customer #] ,
[Service Tech - 01043] , 
[SO Number],
null,
[Product Category],
[Qty/ Units],
[Date Closed],
'120810',
[Line Number],
[Loc-ation],
'000' , 
LastSubmitted,
RMAReceivedDAte,
'',
FedexId,
ReadyToshipDate,
ReceiverComments
from #sd



insert into tbl_ra
select 
'SD 105 Feed Bracket' , 
[S/O type Desc] , 
[Equip. Fail?] , 
Reason , 
[Tracking Number], 
[Smart Card #] , 
[Dish Serial #] , 
[Dish Wo Number] , 
Name, 
[Dish Customer #] ,
[Service Tech - 01043] , 
[SO Number],
null,
[Product Category],
[Qty/ Units],
[Date Closed],
'127499',
[Line Number],
[Loc-ation],
'000' , 
LastSubmitted,
RMAReceivedDAte,
'',
FedexId,
ReadyToshipDate,
ReceiverComments
from #sd

/*****************************************************************************************************/
--tbl_raed
select * from #sd
insert into tbl_raed
select 
WorkOrderNumber , 
(select isnull(max(srno ) , 0) from tbl_raed where WorkOrderNumber = #sd.WorkOrderNumber) + 1  , 
'SD 105 Feed Bracket' , 
SerialNumber,
SmartCardNumber,
TrackingNumber,
MasterReasonId,
IsReceived,
DishRaNumber,
Status,
LastSumitted,
RMAReceivedDate,
ErrorString,
FedexId,
ReadyToShipDate
from #sd




insert into tbl_raed
select 
WorkOrderNumber , 
(select isnull(max(srno ) , 0) from tbl_raed where WorkOrderNumber = #sd.WorkOrderNumber) + 1 , 
'DUAL LNB - DISH PRO' , 
SerialNumber,
SmartCardNumber,
TrackingNumber,
MasterReasonId,
IsReceived,
DishRaNumber,
Status,
LastSumitted,
RMAReceivedDate,
ErrorString,
FedexId,
ReadyToShipDate
from #sd



insert into tbl_raed
select 
WorkOrderNumber , 
(select isnull(max(srno ) , 0) from tbl_raed where WorkOrderNumber = #sd.WorkOrderNumber) + 1 , 

'DP DUAL-NO SHELL' , 
SerialNumber,
SmartCardNumber,
TrackingNumber,
MasterReasonId,
IsReceived,
DishRaNumber,
Status,
LastSumitted,
RMAReceivedDate,
ErrorString,
FedexId,
ReadyToShipDate
from #sd

select * from tbl_raed where WOrkOrderNumber in (select WorkOrderNumber from #sd) 