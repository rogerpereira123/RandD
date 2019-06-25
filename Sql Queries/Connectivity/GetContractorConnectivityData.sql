declare @StartDate date = '05/1/2012'
declare @EndDate date = '05/31/2012'
declare @TechCode varchar(20) = '5183'
declare @ConnectivityPercentage float
declare @NCConnected float


declare @ConnectivityData table
( 
  CustomerId bigint,
  CSGLastChangedDate date,
  WONumber varchar(20),
  ConnectionMethod varchar(50),
  IsConnected int,
  WorkOrderType varchar(20),
  TaskDescription varchar(500),
  CustomerName varchar(500)
)
insert into @ConnectivityData
exec usp_GetConnectivityData @StartDate, @EndDate , @TechCode

declare @CountOfHopperVIPNC float = 0

declare @TotalWorkOrders table (WO varchar(20))


insert into @TotalWorkOrders
select
distinct WONumber
from tbl_Data_Job_Setup tjs
left join @TotalWorkOrders t on tjs.WONumber = t.WO
,
tbl_ReconServiceCodeGrid rsc 
inner join tbl_EConnectModelToProductMapping ec on rsc.StockNo = ec.ProductId
where
tjs.WorkorderType in ('NC' ,'RC', 'RS') 
and 
(ec.EConnectModel like '%vip%' or ec.EConnectModel like '%hpr%')
and 
tjs.ServiceCodes like '%' + rsc.ServiceCode + '%'
and 
rsc.EquipmentReimAmount > 0 and rsc.StockNo <> '' and tjs.CSGLastChangedDate >= @StartDate and tjs.CSGLastChangedDate <= @EndDate 
and tjs.TechCode = @TechCode and t.WO is null and tjs.CSGStatus = 'C'

select @CountOfHopperVIPNC = COUNT(WO) from @TotalWorkOrders


select @NCConnected = COUNT(WOnumber) 
from @ConnectivityData
where ConnectionMethod = 'IP' and WorkOrderType in ('NC'  ,'RC' , 'RS')

select @NCConnected , @CountOfHopperVIPNC 


select round(((@NCConnected / @CountOfHopperVIPNC) * 100.0) , 2) as ConnectivityPercentage