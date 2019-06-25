--select * from tbl_raed
--drop table #tempRA
select 
distinct
ranw.Name as ProductName,
tjs.WorkOrderType,
'Y' as EquipmentFailure,
tmr.ReasonDesc,
ranw.TrackingNumber,
ranw.SmartCardNumber,
ranw.SerialNumber,
tjs.WONumber,
tdc.Name,
tdc.AccountNo,
tjs.TechCode,
null as SONumber,
ranw.DishRANumber,
null as Cat,
-1 as Qty,
tjs.CsgLastChangedDate,
tp.ProductId,
1 as Line,
0 as Loc,
'000' as Status,
null as LastSubmitted,
null as RMAReceived,
null as ErrorString,
0 as FedexId,
null as ReadyToShipDate,
' ' as ReceiverComments

into #tempRA
from 
tbl_raed ranw
inner join tbl_data_Job_setup tjs on ranw.WorkOrderNumber = tjs.WONumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_Master_Reason tmr on ranw.MasterReasonId = tmr.ReasonId 
left join tbl_Product tp on ranw.Name = tp.ProductName
where 
tjs.CSGLastChangedDate >= '08/01/2008'
and
/*tjs.CSGLastChangedDate <= '02/14/2008'
and*/
ranw.SerialNumber is null
order by WONumber, ProductName




select 
distinct
ranw.Name as ProductName,
tjs.WorkOrderType,
'Y' as EquipmentFailure,
tmr.ReasonDesc,
ranw.TrackingNumber,
ranw.SmartCardNumber,
ranw.SerialNumber,
tjs.WONumber,
tdc.Name,
tdc.AccountNo,
tjs.TechCode,
null as SONumber,
ranw.DishRANumber,
null as Cat,
-1 as Qty,
tjs.LastUpdatedDt,
tp.ProductId,
1 as Line,
0 as Loc,
'000' as Status,
null as LastSubmitted,
null as RMAReceived,
null as ErrorString,
0 as FedexId,
null as ReadyToShipDate,
' ' as ReceiverComments

into #tempRA
from 
tbl_raed ranw
inner join internalworkorder tjs on ranw.WorkOrderNumber = tjs.WONumber
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_Master_Reason tmr on ranw.MasterReasonId = tmr.ReasonId 
left join tbl_Product tp on ranw.Name = tp.ProductName
where 
tjs.LastUpdatedDt >= '08/01/2008'
and
/*tjs.CSGLastChangedDate <= '02/14/2008'
and*/
ranw.SerialNumber is null
order by WONumber, ProductName



delete from #tempRA where SerialNumber in (select [dish Serial #] from tbl_ra where [dish Serial #] is not null)


update #tempRA set status = '110' where DishRANumber is not null




update #tempRA set #tempRA.ProductId = R.StockNo
from R
where 
#tempRA.ProductId is null
and 
#tempRA.ProductName = R.Name



delete from #tempRA where ProductName is null and TrackingNumber is null and SmartCardNumber is null and SerialNumber is null



update #tempRa set EquipmentFailure = 'N', ReasonDesc = 'Upgrade' where (WorkOrderType = 'CH' and ReasonDesc not like '%dea%')
update #tempRa set EquipmentFailure = 'Y', ReasonDesc = 'Signal' where (WorkOrderType = 'CH' and ReasonDesc like '%dea%')
update #tempRA set EquipmentFailure = 'Y' , ReasonDesc = 'Signal' where workOrderType in ('NC' , 'SC') and ReasonDesc like '%dea%'



insert into tbl_ra
select #tempRA.* from #tempRA 

delete from #tempRA where ProductId in ('125587','126479','144823')
delete from #tempRA where Name = 'SUPERDISH TO D1000 REPOINT KIT'
delete from #tempRa where name like '%bolt%'
delete from tbl_raed where Name = 'SUPERDISH TO D1000 REPOINT KIT'
delete from tbl_raed where name like '%bolt%'





update tbl_raed set name = 'SD 121 Feed Assembly' where Name like '%121 Superdish LNB%'
update #tempRA set name = 'SD 121 Feed Assembly' where Name like '%121 Superdish LNB%'



/*For Getting the ones which are there in tbl_raed on a job but not there in tbl_ra*/
drop table #insert

select 
distinct
source.ProductName,
source.WorkOrderType,
Source.EquipmentFailure,
source.ReasonDesc,
source.TrackingNumber,
source.SmartCardNumber,
source.SerialNumber,
source.WoNumber,
source.Name,
source.AccountNo,
source.TechCode,
source.SONumber,
source.DishRANumber,
source.Cat,
source.Qty,
source.CSGLastChangedDate,
source.ProductId,
source.Line,
source.Loc,
source.Status,
source.LastSubmitted,
source.RMAReceived,
source.ErrorString,
source.FedexId,
source.ReadyToShipDate,
source.ReceiverComments
into #insert
from 
#tempRA source left join tbl_ra ra on source.WoNumber = ra.[dish wo number]
where 
source.ProductName not in (select convert(varchar ,[Desc1]) from tbl_ra where [dish wo number] = source.WoNumber)
and
source.ProductId not in (select convert(varchar ,[Item Id]) from tbl_ra where [dish wo number] = source.WoNumber)


--For Internal jobs
select 
distinct
source.ProductName,
source.WorkOrderType,
Source.EquipmentFailure,
source.ReasonDesc,
source.TrackingNumber,
source.SmartCardNumber,
source.SerialNumber,
source.WoNumber,
source.Name,
source.AccountNo,
source.TechCode,
source.SONumber,
source.DishRANumber,
source.Cat,
source.Qty,
source.LastUpdatedDt,
source.ProductId,
source.Line,
source.Loc,
source.Status,
source.LastSubmitted,
source.RMAReceived,
source.ErrorString,
source.FedexId,
source.ReadyToShipDate,
source.ReceiverComments
into #insert
from 
#tempRA source left join tbl_ra ra on source.WoNumber = ra.[dish wo number]
where 
source.ProductName not in (select convert(varchar ,[Desc1]) from tbl_ra where [dish wo number] = source.WoNumber)
and
source.ProductId not in (select convert(varchar ,[Item Id]) from tbl_ra where [dish wo number] = source.WoNumber)


insert into tbl_ra
select #insert.* from #insert 

