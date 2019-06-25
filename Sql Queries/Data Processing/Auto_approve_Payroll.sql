

declare @OpenJobs table(WorkOrderNumber varchar(20) , IsContractorJob bit)
declare @ClosedEquipments table( ProductId varchar(100), CategoryId int,SerialNumber varchar(100), ReceiverNumber varchar(100) , IsSerialized bit , IsAutoserialized bit , Price float , ServiceCode varchar(10))
declare @EquipmentPayment table( DishTaskDescription varchar(200), SvcCode varchar(10), StockNo varchar(100), Amount float, CategoryId int,IsSerialized bit , IsAutoserialized bit)
declare @LaborPayment table( DishTaskDescription varchar(200), SvcCode varchar(10), TaskNo varchar(100), Amount float )
declare @ReadyToApprove table(WONumber varchar(20), IsContractorJob bit)
declare @Failed table(WONumber varchar(20), IsContractorJob bit , Reason varchar(500))

insert into @OpenJobs 
/*select top 50 hil.WONumber , 0 from tbl_HourlyInvoiceLine hil
inner join tbl_HourlyInvoiceMaster him on hil.InvoiceId = him.InvoiceId
inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber 
 where ApprovalStatus not in ('11' , '01') and PayStatus <> '11' and tjs.CSGLastChangedDate <= DATEADD(day, -4 , CONVERT(date , getdate()))
 and him.TechCode = tjs.TechCode*/
 
 select '1000184903323012' , 0
 
 
/*insert into @OpenJobs
select top 50 il.WONumber , 1 from tbl_InvoiceLine il
inner join tbl_Data_Job_Setup tjs on il.WONumber = tjs.WONumber 
inner join tbl_InvoiceMaster im on il.InvoiceId = im.InvoiceId
 where ApprovalStatus not in ('11' , '01') and PayStatus <> '11' and tjs.CSGLastChangedDate <= DATEADD(day, -4 , CONVERT(date , getdate())) and im.TechCode = tjs.TechCode*/
 
 
--select '1000099920493012'

declare @WorkOrder varchar(20)
declare @IsContractorJob bit
while(exists(select * from @OpenJobs))
begin
	set @WorkOrder = (select top 1 WorkOrderNumber from @OpenJobs)
	set @IsContractorJob = 	(select top 1 IsContractorJob from @OpenJobs)
	insert into @ClosedEquipments
	select
	distinct  p.ProductId ,p.CategoryId,isnull(u.SerialNo1, ''), isnull(u.SerialNo2, '') , p.IsSerialized , isnull(ptp.IsActive , 0) , p.CostPrice , '' 
	from tbl_Wo2InvTxn wt 
	inner join tbl_InvTxnLine tl on wt.InvTxnId = tl.InvTxnId
	inner join tbl_InvTxnOut2InUnit o2iu on tl.InvTxnLineId = o2iu.InvTxnLineOutId
	inner join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
	inner join tbl_Product p on tl.ProductId = p.ProductId
	left join tbl_InvProductToPrefix ptp on p.ProductId = ptp.ProductId
	left join tbl_RAED r on r.WorkOrderNumber = wt.WoNumber and  u.SerialNo1 = r.SerialNumber
	left join tbl_ReconServiceCodeGrid rsc on p.ProductId = rsc.StockNo and p.CostPrice = rsc.EquipmentReimAmount
	where
	wt.WoNumber = @WorkOrder
	and r.SerialNumber is null
	
	
	update @ClosedEquipments set ServiceCode = rsc.ServiceCode
	from tbl_ReconServiceCodeGrid rsc where ProductId = rsc.StockNo and Price = rsc.EquipmentReimAmount
	
	insert into @EquipmentPayment
	select
	dp.TaskDescription , ISNULL(rsc.ServiceCode, '') , rsc.StockNo , dp.PaymentAmount , p.CategoryId,isnull(p.IsSerialized,0) , isnull(ptp.IsActive , 0)
	from tbl_DishPayment dp 
	left join tbl_ReconServiceCodeGrid rsc on dp.TaskDescription =  rsc.Description
	left join tbl_Product p on rsc.StockNo = p.ProductId 
	left join tbl_InvProductToPrefix ptp on p.ProductId = ptp.ProductId
	where dp.TaskType = 'E' and dp.WONumber = @WorkOrder
	
	update @EquipmentPayment set StockNo = rsc.StockNo, SvcCode = rsc.ServiceCode , CategoryId = p.CategoryId , IsSerialized = p.IsSerialized , IsAutoserialized = isnull(ptp.IsActive , 0)
	from tbl_ReconServiceCodeGrid rsc , tbl_InvTxnUnit u
	inner join tbl_InvTxnLine tl on u.InvTxnLineId = tl.InvTxnLineId
	inner join tbl_Product p on p.ProductId = tl.ProductId
	left join tbl_InvProductToPrefix ptp on p.ProductId = ptp.ProductId
	where
	DishTaskDescription = u.SerialNo2 and tl.ProductId = rsc.StockNo
	and SvcCode = ''
	
	delete @EquipmentPayment 
	from (select SvcCode as DuplicateServiceCode from @EquipmentPayment where IsAutoserialized = 1 group by SvcCode having COUNT(SvcCode) > 1 and SvcCode <> '') dup
	where SvcCode = dup.DuplicateServiceCode  and StockNo not in (select ProductId from @ClosedEquipments where ServiceCode = dup.DuplicateServiceCode)
	
	insert into @LaborPayment
	select
	dp.TaskDescription , isnull(s.ServiceCode, '') , isnull(s.TaskNumber, '') , dp.PaymentAmount
	from tbl_DishPayment dp 
	left join tbl_ServiceCodeToTaskPayment s on dp.TaskDescription = s.Description and dp.PaymentAmount = s.LaborReimAmount
	where 
	dp.WONumber = @WorkOrder
	
	
select * from @EquipmentPayment
select * from @ClosedEquipments
	
	/*Receivers Validation*/
	--Closed In Northware But Not Paid By Dish
	if( exists(select * from 
	@ClosedEquipments c left join @EquipmentPayment p on c.ReceiverNumber = p.DishTaskDescription
	where c.IsSerialized = 1 and c.IsAutoserialized = 0 and p.DishTaskDescription is null))
	begin 
		delete from @OpenJobs where WorkOrderNumber = @WorkOrder
		delete from @ClosedEquipments
		delete from @EquipmentPayment 
		insert into @Failed
		select @WorkOrder,@IsContractorJob, 'Failed In the test of receivers - Closed In Northware But Not Paid By Dish'
		continue 
	end
	
	--Paid By Dish But Not Closed In Northware
	if( exists(select * from 
	@EquipmentPayment p left join @ClosedEquipments c on p.DishTaskDescription = c.ReceiverNumber
	where p.IsSerialized = 1 and p.IsAutoserialized = 0 and c.ReceiverNumber is null and p.CategoryId <> 2))
	begin 
		delete from @OpenJobs where WorkOrderNumber = @WorkOrder
		delete from @ClosedEquipments
		delete from @EquipmentPayment 
		insert into @Failed
		select @WorkOrder,@IsContractorJob, 'Failed In the test of receivers - Paid By Dish But Not Closed In Northware'
		continue 
	end
	/*Receivers Validation Ends */
		
	/*Non Receivers Validation  -- These are Echo Non Recs Category 2. Match these only for quantities and price*/
	--Check if total amount paid by Dish matches the total amount of category 2 equipments installed 
	if((select isnull(SUM(Price),0) from @ClosedEquipments where IsAutoserialized = 1 and CategoryId = 2) <> 
		(select isnull(SUM(isnull(Amount,0)), 0) from @EquipmentPayment where IsAutoserialized = 1 and CategoryId = 2))
	begin
		delete from @OpenJobs where WorkOrderNumber = @WorkOrder
		delete from @ClosedEquipments
		delete from @EquipmentPayment 
		insert into @Failed
		select @WorkOrder,@IsContractorJob, 'Failed In the test of Non Receivers Validation'
		continue 
	end 
	/*Non Receivers Validation Ends*/
	
	--Per Victor do not check for connectivity equipment because it should be added by the time job is ready for auto approved. ALso the payment comes after 3 week for connectivity
	
	/*Check for all the other equipments*/
	--Closed In Northware But Not Paid By Dish
	if(exists(select *
	from @ClosedEquipments c left join @EquipmentPayment p on c.ProductId = p .StockNo 
	where c.IsSerialized = 1 and c.CategoryId not in (2 , 4, 26) and c.IsAutoserialized = 1 and p.DishTaskDescription is null))
	begin
		--Check if the equipment is paid in labor -- for Screen Cleaners and mounts
		if(exists(select * from @ClosedEquipments c left join tbl_ReconServiceCodeGrid rsc on c.ProductId = rsc.StockNo
		left join @LaborPayment l on rsc.ServiceCode = l.SvcCode where c.IsSerialized = 1 and c.CategoryId not in (2 , 4, 26) and c.IsAutoserialized = 1 and l.SvcCode is null))
		begin
			delete from @OpenJobs where WorkOrderNumber = @WorkOrder
			delete from @ClosedEquipments
			delete from @EquipmentPayment 
			insert into @Failed
			select @WorkOrder,@IsContractorJob, 'Failed In the test of all the other equipments - Closed In Northware But Not Paid By Dish'
			continue 
		end
	end 
	
	--Paid By Dish But Not Closed In Northware
	if(exists(select *
	from @EquipmentPayment p left join @ClosedEquipments c on p .StockNo = c.ProductId 
	where p.IsSerialized = 1 and p.CategoryId not in (2 , 4 , 26) and p.IsAutoserialized = 1 and c.ProductId is null))
	begin
		delete from @OpenJobs where WorkOrderNumber = @WorkOrder
		delete from @ClosedEquipments
		delete from @EquipmentPayment 
		insert into @Failed
		select @WorkOrder,@IsContractorJob, 'Failed In the test of all the other equipments - Paid By Dish But Not Closed In Northware'
		continue 
	end 
	/*Check for all the other equipments Ends*/
	
	
	
	if(not exists(select * from @ClosedEquipments where CategoryId <> 26) and not exists(select * from @EquipmentPayment))
	begin
		if(not exists(select * from tbl_DishPayment where WONumber = @WorkOrder and TaskType = 'L' and PaymentAmount > 0))
		begin
			if(exists(select * from tbl_Data_Job_Setup where WONumber = @WorkOrder and WorkorderType in ('TC' , 'SC')))
			begin
				if(not exists(
				select *
				from tbl_Data_Job_Setup tjs1 
				inner join tbl_Data_Job_Setup tjs2 on tjs1.CustomerID = tjs2.CustomerID
				where
				tjs2.WONumber = @WorkOrder
				and
				DATEDIFF(DAY ,  tjs1.CSGLastChangedDate , tjs2.SaleDate) <= 60
				and
				DATEDIFF(DAY , tjs1.CSGLastChangedDate , tjs2.SaleDate ) > 0
				and 
				tjs1.WONumber <> tjs2.WONumber
				and 
				tjs1.CSGStatus = 'C'))
				begin
					delete from @OpenJobs where WorkOrderNumber = @WorkOrder
					delete from @ClosedEquipments
					delete from @EquipmentPayment 
					insert into @Failed
					select @WorkOrder,@IsContractorJob, 'No Equipments  / No Labor Payment and not a TC / SC within 60 days either. Cant make a decision.'
					continue 
				end
				else if(@IsContractorJob = 1)
				begin
					delete from @OpenJobs where WorkOrderNumber = @WorkOrder
					delete from @ClosedEquipments
					delete from @EquipmentPayment 
					insert into @Failed
					select @WorkOrder,@IsContractorJob, 'A TC/SC for contractor within 60 days. Left open for no pay.'
					continue 
				end
			end
			else
			begin
				delete from @OpenJobs where WorkOrderNumber = @WorkOrder
				delete from @ClosedEquipments
				delete from @EquipmentPayment 
				insert into @Failed
				select @WorkOrder,@IsContractorJob, 'No Equipments  / No Labor Payment'
				continue 
			end
			
		end
		
	end
	
	
	insert into @ReadyToApprove select @WorkOrder,@IsContractorJob
	
	
		
	delete from @OpenJobs where WorkOrderNumber = @WorkOrder
	delete from @ClosedEquipments
	delete from @EquipmentPayment 
	
end

select * from @ReadyToApprove
select * from @Failed

