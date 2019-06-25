--select * from tbl_ReconStatusMaster
--select * from tbl_Master_Reason where ReasonCategoryId  = 11
declare @StartDate date = '01/01/2013'
declare @EndDate date = '01/31/2013'
declare @Result table 
(
OENumber varchar(10),
WONumber varchar(20),
AccountNo varchar(20),
ClosedDate date,
ReconType varchar(10),
RANumber varchar(20),
TaskNumber varchar(30),
RequestedAmount float,
ShipDateTrackingNumber varchar(2000),
Errors varchar(10),
WorkOrderType varchar(10),
ShippedAfterClosed int,
ShippedAfterRAReceived int,
IsDOA varchar(20),
DeliveryDate varchar(100))

insert into @Result
select 
'343197', 
tjs.WONumber,
tdc.ACCOUNTNO,
tjs.CSGLastChangedDate,
'R',
r.DishRANumber,
rm.TaskNumber, 
rm.RequestedAmount,

'Ship Date: ' + convert(varchar(10), ft.Date,101) + ' Tracking #:' +ft.FedexTrackingNumber,
'',
tjs.WorkOrderType,
DATEDIFF(DAY,tjs.CSGLastChangedDate , ft.Date),
case when r.RMAReceivedDate is null or r.RMAReceivedDate = '' then 0 else  DATEDIFF(DAY,r.RMAReceivedDate , ft.Date) end,
'' ,
''
from
tbl_ReconMaster
rm inner join tbl_Data_Job_Setup tjs on rm.WONumber = tjs.WONumber 
inner join tbl_ReconReasons rr on rm.ReconId = rr.ReconId
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_RAED r on tjs.WONumber = r.WorkOrderNumber and r.DishRANumber = rm.DishRANumber
inner join tbl_FedexTracking ft on r.FedexId = ft.FedexId
where
tjs.CSGLastChangedDate >=  @StartDate and tjs.CSGLastChangedDate <= @EndDate
and ReconStatusId = 'R0110' and rm.DishRANumber <> '' and rm.DishRANumber is not null and rr.ReasonId = 242 
order by tjs.WONumber asc

update r
set r.IsDOA = 'YES' 
from @Result r
inner join tbl_Wo2InvTxn w on r.WONumber = w.WoNumber
inner join tbl_InvTxnLine tl on w.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = tl.InvTxnLineId
inner join tbl_InvTxnUnit u on r.TaskNumber = u.SerialNo2 and u.InvTxnUnitId = o2iu.InvTxnUnitId

delete r
from @Result r 
inner join tbl_DishPayment dp on r.WONumber = dp.WONumber and r.TaskNumber = dp.TaskDescription
where dp.TaskType = 'E' and dp.PaymentAmount > 0 and r.IsDOA = 'YES'

declare @PaidInEquipmentSection table (WONumber varchar(20))

insert into @PaidInEquipmentSection 
select distinct r.WONumber from @Result r inner join
tbl_DishPayment dp on r.WONumber = dp.WONumber
inner join tbl_InvTxnUnit u on dp.TaskDescription = isnull(u.SerialNo2, '') where dp.TaskType = 'E' and dp.PaymentAmount > 0

delete  r 
from @Result r 
inner join tbl_RAED raed on r.TaskNumber = isnull(raed.TrackingNumber , '')
inner join @PaidInEquipmentSection as paid on r.WONumber = paid.WONumber
where r.WorkOrderType in ('TC' , 'SC' , 'CH') 




update r 
set r.DeliveryDate = d.[Deliver Date]
from @Result r
inner join RAJan2013 d on r.RANumber = d.RANumber

select * from @Result