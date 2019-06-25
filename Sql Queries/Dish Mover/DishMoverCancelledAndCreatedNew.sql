declare @StartDate date = '07/30/2012'
declare @EndDate date = '08/05/2012'



select
tdc.NAME as Customer, tdc.PHONE, tjsMover.WONumber as 'Mover', tjsMover.WorkorderType as MoverWorkOrderType , tjsMover.CSGStatus as MoverStatus , tjsMover.CSGLastChangedDate  as MoverLastChangedDate
,tjsNew.WONumber as 'New', tjsNew.WorkorderType as NewWorkOrderType , tjsNew.SaleDate as NewCreateDate , tjsNew.CSGStatus as NewCSGStatus
into #mover
from 
tbl_Data_Job_Setup tjsMover 
inner join tbl_Data_Job_Setup tjsNew on tjsMover.CustomerID = tjsNew.CustomerID
inner join tbl_Data_Customers tdc on tjsMover.CustomerID = tdc.CUSTOMERID
where
tjsMover.ServiceCodes like '%~G%' and  tjsMover.ServiceCodes like '%P2%'
and tjsMover.CSGLastChangedDate >= @StartDate and tjsMover.CSGLastChangedDate <= @EndDate
and tjsMover.CSGStatus = 'X' and tjsMover.CSGLastChangedDate = tjsNew.SaleDate
and CONVERT(bigint, tjsNew.WONumber) > convert(bigint,tjsMover.WONumber ) 
and tjsNew.CSGStatus = 'C'
/*delete from #mover 
		from (select t.Mover as MoverFilter , MIN(convert(bigint, t.New )) as MinNew from #Mover as t  group by t.Mover having COUNT(t.Mover) > 1) as filter
		where convert(bigint, New) > convert(bigint,filter.MinNew) and Mover = filter.MoverFilter*/
		
select * from #Mover
		
drop table #mover
