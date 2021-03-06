USE [Northware]
GO
/****** Object:  StoredProcedure [dbo].[usp_Mobility_GetEquipmentsToCloseJobs]    Script Date: 02/02/2015 14:52:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE  [dbo].[usp_Mobility_GetEquipmentsToCloseJobs]            
@StartDate datetime,
@EndDate datetime 
 AS          

BEGIN           

--set @StartDate = '10/08/2014'
declare @PlaceHolder varchar(2000)
declare @BitPlaceHolder bit =0

 
select
eq.WONumber as WorkOrderNumber, @BitPlaceHolder as IsSerialized  , CONVERT(date, eq.ClosedDate,103) as  ReconciledOn, 
isnull(eq.SerialNumber , '') as SerialNumber , mtct.MasterTechCode as TechCode, CONVERT(date, eq.ClosedDate,103) as CreatedOn , '' as WorkOrderConnectivityTypeName,'' as ConnectivityConfirmationNumber , tdc.InvParticipantId as CustInvParticipantId , u.InvParticipantId as TechInvParticipantId, 
@PlaceHolder as ProductId, 0 as ProductCategoryId, @PlaceHolder as ProductName,tjs.WorkOrderType,tjs.CustomerID,tjs.ServiceCodes,tdc.ACCOUNTNO, isnull(tde.VendorId, '') as VendorId,eq.Model, @BitPlaceHolder as IsBeingTracked, eq.TechExternalId,rtrim(ltrim(eq.InventoryPool)) as InventoryPool , @PlaceHolder as WorkDoneOnInternal, @BitPlaceHolder as IsAutoSerialized,
eq.ReturnReason, tjs.CSGStatus, isnull(mr.ReasonId, 0) as MasterReasonId, eq.Quantity as TechEnteredQuantity
into #JobsToClose
from
tbl_Mobility_EquipmentUtilized eq 
inner join tbl_Data_Job_Setup tjs on EQ.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
--inner join tbl_User u on eq.TechExternalId = u.ETADirectExternalId -- Per Victor use ETADirect TechCode
inner join tbl_MasterTechToChildTech mtct on SUBSTRING(eq.TechExternalId, CHARINDEX('_',eq.TechExternalId , 1) + 1 , 500 ) = mtct.ChildTechCode
inner join tbl_User u on mtct.MasterTechCode = u.UserId
left join tbl_WOTimes wt on eq.WONumber = wt.WONumber  and isnull(wt.UserID, 'EConnect') = 'EConnect'
inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID
inner join  (select WONumber , Max(InsertDate) as MaxInsertDate from tbl_Mobility_EquipmentUtilized where convert(date,ClosedDate,103) >= @StartDate
and CONVERT(date,ClosedDate,103) <= @EndDate group by WONumber  ) as EqMaxHour on eq.WONumber = EqMaxHour.WONumber and  datediff(second ,  EqMaxHour.MaxInsertDate, eq.InsertDate ) between 0 and 2
left join tbl_Master_Reason mr on eq.ReturnReason = mr.ReasonDesc
where
convert(date,eq.ClosedDate,103) >= @StartDate
and
CONVERT(date,eq.ClosedDate,103) <= @EndDate 
and tdc.InvParticipantId is not null 
and eq.WONumber not like 'D%'
and dbo.udf_IsContractor(u.UserId , 0) <> ''

order by convert(date,eq.ClosedDate,103),eq.WONumber desc


--THe job should be marked as Complete in tbl_data_job_setup so as to confirm that it is closed completely in ETADirect 08/17/2011
delete from #JobsToclose where CSGStatus <> 'C'



declare @WorkOrderImports table (SrNo int identity, WONumber varchar(20) , InsertDateTime datetime , EquipmentCount int , CSGStatus varchar(10)) 
insert into @WorkOrderImports
select
eq.WONumber , CONVERT(varchar(16) ,eq.InsertDate , 120) , COUNT(eq.WONumber) , tjs.CSGStatus
from
tbl_Mobility_EquipmentUtilized eq 
inner join tbl_Data_Job_Setup tjs on EQ.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_MasterTechToChildTech mtct on SUBSTRING(eq.TechExternalId, CHARINDEX('_',eq.TechExternalId , 1) + 1 , 500 ) = mtct.ChildTechCode
inner join tbl_User u on mtct.MasterTechCode = u.UserId
inner join tbl_Data_Employees tde on u.UserId = tde.TechNumber

where
convert(date,eq.ClosedDate,103) >= @StartDate
and
CONVERT(date,eq.ClosedDate,103) <= @EndDate 
and tdc.InvParticipantId is not null 
and eq.WONumber not like 'D%'
and dbo.udf_IsContractor(u.UserId , 0) <> ''
group by eq.WONumber,tjs.CSGStatus , CONVERT(varchar(16) ,eq.InsertDate , 120)

--THe job should be marked as Complete in tbl_data_job_setup so as to confirm that it is closed completely in ETADirect 08/17/2011
delete from @WorkOrderImports where CSGStatus <> 'C'

delete WOI 
from @WorkOrderImports  as WOI inner join @WorkOrderImports w on WOI.WONumber = w.WONumber 
where WOI.EquipmentCount = (select min(EquipmentCount) from @WorkOrderImports where WONumber = WOI.WONumber)

delete WOI from @WorkOrderImports as WOI 
inner join tbl_WOTimes wt on WOI.WONumber = wt.WONumber
where WOI.InsertDateTime < wt.LastUpdatedDate

delete  WOI from @WorkOrderImports as WOI 
inner join tbl_WOTimes wt on WOI.WONumber = wt.WONumber where wt.UserId <> 'ETADirect'



insert into #JobsToClose
select
eq.WONumber as WorkOrderNumber, @BitPlaceHolder as IsSerialized  , CONVERT(date, eq.ClosedDate,103) as  ReconciledOn, 
isnull(eq.SerialNumber , '') as SerialNumber , u.UserId as TechCode, CONVERT(date, eq.ClosedDate,103) as CreatedOn , '' as WorkOrderConnectivityTypeName,'' as ConnectivityConfirmationNumber , tdc.InvParticipantId as CustInvParticipantId , u.InvParticipantId as TechInvParticipantId, 
@PlaceHolder as ProductId, 0 as ProductCategoryId, @PlaceHolder as ProductName,tjs.WorkOrderType,tjs.CustomerID,tjs.ServiceCodes,tdc.ACCOUNTNO, isnull(tde.VendorId, '') as VendorId,eq.Model, @BitPlaceHolder as IsBeingTracked, eq.TechExternalId,rtrim(ltrim(eq.InventoryPool)) as InventoryPool , @PlaceHolder as WorkDoneOnInternal, 
@BitPlaceHolder as IsAutoSerialized, eq.ReturnReason, tjs.CSGStatus, isnull(mr.ReasonId , 0) as MasterReasonId, eq.Quantity as TechEnteredQuantity

from
tbl_Mobility_EquipmentUtilized eq 
inner join tbl_Data_Job_Setup tjs on EQ.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_MasterTechToChildTech mtct on SUBSTRING(eq.TechExternalId, CHARINDEX('_',eq.TechExternalId , 1) + 1 , 500 ) = mtct.ChildTechCode
inner join tbl_User u on mtct.MasterTechCode = u.UserId
inner join (select distinct WONumber from @WorkOrderImports) wt on eq.WONumber = wt.WONumber 
inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID
inner join  (select WONumber , Max(InsertDate) as MaxInsertDate from tbl_Mobility_EquipmentUtilized where convert(date,ClosedDate,103) >= @StartDate
and CONVERT(date,ClosedDate,103) <= @EndDate group by WONumber  ) as EqMaxHour on eq.WONumber = EqMaxHour.WONumber and  datediff(second ,  EqMaxHour.MaxInsertDate, eq.InsertDate ) between 0 and 2
left join tbl_Master_Reason mr on eq.ReturnReason = mr.ReasonDesc

where
convert(date,eq.ClosedDate,103) >= @StartDate
and
CONVERT(date,eq.ClosedDate,103) <= @EndDate 
and tdc.InvParticipantId is not null 
and eq.WONumber not like 'D%'

order by convert(date,eq.ClosedDate,103),eq.WONumber desc

--THe job should be marked as Complete in tbl_data_job_setup so as to confirm that it is closed completely in ETADirect 08/17/2011
delete from #JobsToclose where CSGStatus <> 'C'

alter table #JobsToClose add SrNo int identity


update #JobsToClose
set ProductId = l.ProductId,
ProductCategoryId = p.CategoryId,
ProductName = p.ProductName,
IsBeingTracked = 1,
IsSerialized = 1,
IsAutoSerialized = 0
from 
tbl_InvTxnUnit u,
tbl_InvTxnLine l, tbl_Product p  where 
u.SerialNo1 = #JobsToClose.SerialNumber
and u.InvTxnLineId = l.InvTxnLineId and l.ProductId = p.ProductId
and #JobsToClose.SerialNumber is not null and #JobsToClose.SerialNumber <> ''


update #JobsToClose
set ProductId = p.ProductId,
ProductCategoryId = p.CategoryId,
ProductName = p.ProductName,
SerialNumber = ptp.Prefix,
IsBeingTracked = 1,
IsSerialized = 0,
IsAutoSerialized = 1
from tbl_EConnectModelToProductMapping emtp, tbl_Product p, tbl_InvProductToPrefix ptp
where
#JobsToClose.Model = emtp.EConnectModel and emtp.ProductId = p.ProductId  and p.ProductId = ptp.ProductId and ptp.IsActive = 1

/*
--For packaged model mapping to multiple products but not needed yet
if(exists(select * from #JobsToClose j inner join tbl_EConnectModelToProductMapping emtp on j.Model = emtp.EConnectModel where emtp.IsMappedToMultipleProducts = 1))
begin
	insert into #JobsToClose 
	select
	jtc.WorkOrderNumber, 0 as IsSerialized , jtc.ReconciledOn, 
	ptp.Prefix , jtc.TechCode, jtc.CreatedOn , jtc.WorkOrderConnectivityTypeName,jtc.ConnectivityConfirmationNumber , jtc.CustInvParticipantId , jtc.TechInvParticipantId, 
	p.ProductId, p.CategoryId as ProductCategoryId, p.ProductName,jtc.WorkOrderType,jtc.CustomerID,jtc.ServiceCodes,jtc.ACCOUNTNO, jtc.VendorId,jtc.Model, 1 as IsBeingTracked, 
	jtc.TechExternalId,jtc.InventoryPool , jtc.WorkDoneOnInternal, 
	1 as IsAutoSerialized, jtc.ReturnReason, jtc.CSGStatus, jtc.MasterReasonId, jtc.TechEnteredQuantity

	from #JobsToClose jtc 
	inner join tbl_EConnectModelToProductMapping emtp on jtc.Model = emtp.EConnectModel
	inner join tbl_Product p on emtp.ProductId = p.ProductId
	inner join tbl_InvProductToPrefix ptp on p.ProductId = ptp.ProductId and ptp.IsActive = 1
	where
	jtc.ProductId <> emtp.ProductId
	and emtp.IsMappedToMultipleProducts = 1
	
end

*/
update #JobsToClose 
set ProductId = '', ProductName = ''  
where ProductId is null


update tbl_Data_Job_Setup
set TechCode = t.TechCode
from #JobsToClose t 
where t.WorkOrderNumber = tbl_Data_Job_Setup.WONumber 
and t.TechCode <> tbl_Data_Job_Setup.TechCode




/*************************************************/

declare @MultipleEquipmentsOnSameWorkOrder table
(
 WO varchar(20),
 ProductId varchar(50),
 ServiceCode varchar(20),
 EquipmentOccurence int,
 ServiceCodeOccurence int
)

--Get the multiple equipments on the same work order along with the serivce code representing the equipment
insert into @MultipleEquipmentsOnSameWorkOrder
select
WorkOrderNumber, 
ProductId,
ServiceCode,
COUNT(ProductId),
0
from #JobsToClose t
left join (select distinct * from tbl_ReconServiceCodeGrid) rs on t.ProductId = rs.StockNo
where IsSerialized = 0 and t.ProductId <> '' and t.InventoryPool = 'install' and ProductCategoryId <> 28 
group by WorkOrderNumber , ProductId , rs.ServiceCode having COUNT(ProductId) > 1 
 
 
 
 
--update the serivce code occurence in the job for the specific service code
  
update @MultipleEquipmentsOnSameWorkOrder 
set ServiceCodeOccurence = isnull((LEN(t.ServiceCodes) -  len(REPLACE(t.ServiceCodes , ServiceCode , ''))) / LEN(ServiceCode) , 0)
from #JobsToClose t 
where
t.WorkOrdernumber = WO




--delete the ones where service code occurence is higher or equal to equipment occurence. Nothing to do anything there.
delete from @MultipleEquipmentsOnSameWorkOrder where EquipmentOccurence <= ServiceCodeOccurence

--update the ones where service code occurence is 0 to make sure that atleast 1 equipment of such type gets closed with work order 
update @MultipleEquipmentsOnSameWorkOrder set ServiceCodeOccurence = 1 where ServiceCodeOccurence = 0



declare @W varchar(20)
declare @P varchar(100)
create table #UpdateTable(
Id int identity,
SrNoToUpdate int
)
declare @EO int
declare @SCO int

--go through the individual multiple equipment record and delete the equipments where service code occurence is less. 
while  exists(select WO, ProductId from @MultipleEquipmentsOnSameWorkOrder where EquipmentOccurence > ServiceCodeOccurence) 
begin
	select top 1 @W = Wo , @P = ProductId , @EO = EquipmentOccurence , @SCO = ServiceCodeOccurence from @MultipleEquipmentsOnSameWorkOrder where EquipmentOccurence > ServiceCodeOccurence
	insert into #UpdateTable
	select SrNo from #JobsToClose where ProductId = @P and WorkOrderNumber = @W 
	
	delete #JobsToClose 
	from #UpdateTable 
	where Id > @SCO and SrNoToUpdate = SrNo
	
	
	delete from @MultipleEquipmentsOnSameWorkOrder where WO = @W and ProductId = @P
	truncate  table #UpdateTable
	
end 

--Per Victor on 11/20/2012......All the techs should be using Northware mobile for clock out and nothing should be closed from ETADirect except for contractors


	delete JTC
	from #JobsToClose as JTC
	--inner join tbl_Mobility_InternalWorkOrderClosing WT on JTC.WorkOrderNumber = WT.WONumber
	inner join tbl_InvParticipant2User ip2u on JTC.TechCode = ip2u.UserId
	inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
	where
	dbo.udf_IsContractor(JTC.TechCode , 0) = ''


declare @SHSWithMoreQuantity table (SrNo int , TechEnteredQuantity int)
insert into @SHSWithMoreQuantity
select SrNo, TechEnteredQuantity from #JobsToClose where TechEnteredQuantity > 1 and ProductCategoryId = 28
declare @i int
declare @q int
while(exists(select * from @SHSWithMoreQuantity))
begin
	select top 1 @i = SRno, @q = TechEnteredQuantity from @SHSWithMoreQuantity
	declare @j int = 1
	while (@j <= @q - 1)
	begin
		insert into #JobsToClose
		select  WorkOrderNumber, IsSerialized  , ReconciledOn,SerialNumber , TechCode, CreatedOn , WorkOrderConnectivityTypeName,ConnectivityConfirmationNumber , CustInvParticipantId , 
		TechInvParticipantId, ProductId, ProductCategoryId, ProductName,WorkOrderType,CustomerID,ServiceCodes,ACCOUNTNO, VendorId,Model,IsBeingTracked,TechExternalId,
		InventoryPool , WorkDoneOnInternal, IsAutoSerialized, ReturnReason, CSGStatus, MasterReasonId, TechEnteredQuantity from #JobsToClose where SrNo = @i
		set @j = @j + 1;
			
	end
	delete from @SHSWithMoreQuantity where SrNo =@i
end



select  * from #JobsToClose 

 

drop table #JobsToClose
 drop table #UpdateTable

END
