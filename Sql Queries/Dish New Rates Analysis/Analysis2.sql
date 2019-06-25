declare @startDate date = '01/01/2014'
declare @EndDate date = '12/31/2014'
declare @result table (WorkType varchar(200) , JobsCount int, NonHopperJobsCount int , Hoppers int, Joeys int, SuperJoeys int ,VipWithHopper int , VipWithoutHopper int,
 TotalVipReceivers int, Dishes int , PlusDishes int ,LegacyWithHopper int, LegacyWithoutHopper int, TotalLegacyReceivers int)

declare @Work table ( WONumber varchar(20) , WorkOrderType varchar(10) , ServiceCodes varchar(2000) , Points int)
insert into @Work
select
tjs.WONumber , tjs.WorkorderType,tjs.ServiceCodes, tjs.WorkUnits as Points
from tbl_Data_Job_Setup tjs
where
tjs.CSGLastChangedDate between @startDate and @EndDate
and tjs.CSGStatus = 'C'
and tjs.WorkUnits > 0

insert into @result 
select 'NC' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'

insert into @result 
select 'CH' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'


insert into @result 
select 'Movers' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where WorkOrderType = 'CH' and ServiceCodes like '%73%' and ServiceCodes not like '%-K%'


insert into @result 
select 'DishNet' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where ServiceCodes like '%-K%'

insert into @result 
select 'Service Calls' , COUNT(r.WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work w 
inner join (select WOnumber , SUM(ApprovedAmount) as Amt from tbl_ReconMaster where RecordTypeId ='L' group by WONumber) r on w.WONumber = r.WONumber and r.Amt > 0
where WorkOrderType in ('TC' , 'SC')

insert into @result 
select 'Pole Mount Video' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'

insert into @result 
select 'Pole Mount BB' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'

insert into @result 
select 'Pole Mount Combined' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 

insert into @result 
select 'Upgrade/Remove Dish' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where 
ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'

insert into @result 
select 'Upgrade/Remove Dish (Stand alone Antenna)' , COUNT(WONumber), 0,0,0,0,0,0,0,0,0,0,0,0
from @Work 
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'

/******NC Equipment**********/

update @result
set NonHopperJobsCount =  d.Qty
from 
(select count(distinct w.WoNumber) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4 and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'NC'


update @result
set Hoppers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'NC'

update @result
set Joeys =  d.Qty
from 
(select sum(isnull(tl.Quantity , 0)) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'NC'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'NC'

update @result
set VipWithHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 

where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
inner join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4
) as  d 
where WorkType = 'NC'

update @result
set VipWithoutHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 

where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4 and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'NC'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4
) as  d 
where WorkType = 'NC'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'NC'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'NC'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'NC'

update @result
set LegacyWithHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
inner join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'NC'

update @result
set LegacyWithoutHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'NC'

/******NC Equipment**********/


/******CH Equipment**********/


update @result
set NonHopperJobsCount =  d.Qty
from 
(select count(distinct w.WoNumber) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4 and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'CH'

update @result
set Hoppers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'CH'

update @result
set Joeys =  d.Qty
from 
(select sum(isnull(tl.Quantity , 0)) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'CH'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'CH'

update @result
set VipWithHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 

where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
inner join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4
) as  d 
where WorkType = 'CH'

update @result
set VipWithoutHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 

where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4 and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'CH'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4
) as  d 
where WorkType = 'CH'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'CH'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'CH'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'CH'

update @result
set LegacyWithHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
inner join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'CH'

update @result
set LegacyWithoutHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'CH'
/******CH Equipment**********/


/******Movers Equipment**********/

update @result
set NonHopperJobsCount =  d.Qty
from 
(select count(distinct w.WoNumber) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4 and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'Movers'

update @result
set Hoppers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'Movers'

update @result
set Joeys =  d.Qty
from 
(select sum(isnull(tl.Quantity , 0)) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Movers'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Movers'

update @result
set VipWithHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 

where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
inner join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4
) as  d 
where WorkType = 'Movers'

update @result
set VipWithoutHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 

where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4 and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'Movers'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and p.CategoryId = 4
) as  d 
where WorkType = 'Movers'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'Movers'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'Movers'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where WorkOrderType = 'CH' and ServiceCodes  like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'Movers'

update @result
set LegacyWithHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
inner join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'Movers'

update @result
set LegacyWithoutHopper =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'CH' and ServiceCodes like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
and tl1.InvTxnLineId is null
) as  d 
where WorkType = 'Movers'

/******Movers Equipment**********/



/******DishNet Equipment**********/
update @result
set Hoppers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%-K%'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'DishNet'

update @result
set Joeys =  d.Qty
from 
(select sum(isnull(tl.Quantity , 0)) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%-K%'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'DishNet'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%-K%'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'DishNet'


update @result
set TotalVipReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%-K%'
and p.CategoryId = 4
) as  d 
where WorkType = 'DishNet'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%-K%'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'DishNet'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%-K%'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'DishNet'


update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'DishNet'

/******DishNet Equipment**********/



/******Pole Mount Video Equipment**********/
update @result
set Hoppers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Video'

update @result
set Joeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Video'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Video'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'
and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Video'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'Pole Mount Video'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'Pole Mount Video'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%2~%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'Pole Mount Video'

/******Pole Mount Video Equipment**********/

/******Pole Mount BB Equipment**********/
update @result
set Hoppers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount BB'

update @result
set Joeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount BB'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount BB'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'
and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount BB'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'Pole Mount BB'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'Pole Mount BB'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'Pole Mount BB'

/******Pole Mount BB Equipment**********/



/******Pole Mount Combined Equipment**********/
update @result
set Hoppers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Combined'

update @result
set Joeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Combined'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Combined'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 
and p.CategoryId = 4
) as  d 
where WorkType = 'Pole Mount Combined'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'Pole Mount Combined'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'Pole Mount Combined'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%P2%' and ServiceCodes like '%R=%' and ServiceCodes like '%2~%' 
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'Pole Mount Combined'

/******Pole Mount Combined Equipment**********/



/******Upgrade/Remove Dish Equipment**********/
update @result
set Hoppers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish'

update @result
set Joeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'
and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'Upgrade/Remove Dish'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'Upgrade/Remove Dish'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%;2%' and ServiceCodes not like '%P2%' and WorkOrderType = 'CH'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'Upgrade/Remove Dish'

/******Upgrade/Remove Dish Equipment**********/




/******Upgrade/Remove Dish (Stand alone Antenna) Equipment**********/
update @result
set Hoppers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'
and p.ProductName like '%hopper%' and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish (Stand alone Antenna)'

update @result
set Joeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'
and p.ProductId in ('187894' , '199924' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish (Stand alone Antenna)'

update @result
set SuperJoeys =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'
and p.ProductId in ('203904' , '200438' ) and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish (Stand alone Antenna)'

update @result
set TotalVipReceivers =  d.Qty
from 
(select isnull(sum(tl.Quantity) , 0) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'
and p.CategoryId = 4
) as  d 
where WorkType = 'Upgrade/Remove Dish (Stand alone Antenna)'

update @result
set Dishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'
and ServiceCodes like '%;K%'
) as  d 
where WorkType = 'Upgrade/Remove Dish (Stand alone Antenna)'

update @result
set PlusDishes =  d.Qty
from 
(select count(tjs.WONumber) as Qty from @Work tjs
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'
and ServiceCodes like '%;P%'
) as  d 
where WorkType = 'Upgrade/Remove Dish (Stand alone Antenna)'

update @result
set TotalLegacyReceivers =  d.Qty
from 
(select sum(tl.Quantity) as Qty from @Work tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
where ServiceCodes like '%;2%' and ServiceCodes like '%P2%' and WorkOrderType = 'CH'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
) as  d 
where WorkType = 'Upgrade/Remove Dish (Stand alone Antenna)'
/******Upgrade/Remove Dish (Stand alone Antenna)**********/


select * from @result