declare @WoNumber varchar(20) = '1001628113013010'
declare @result bit = 1;

if(exists(select * from tbl_RAED where WorkOrderNumber = @WONumber))
begin
	set @result = 0;
	select 'RA Exists'
end

declare @ExpectedLaborPayments table (WONumber varchar(20) ,ServiceCode varchar(20),Description varchar(2000)  ,TaskNumber varchar(200), Amount float)
declare @PaidLaborPayments table (WONumber varchar(20) ,ServiceCode varchar(20),Description varchar(2000)  ,TaskNumber varchar(200), Amount float)
declare @ReconMasterLaborPayments table (WONumber varchar(20) ,ServiceCode varchar(20),Description varchar(2000)  ,TaskNumber varchar(200), Amount float)
declare @ReconMasterEquipmentPayments table (WONumber varchar(20) ,ServiceCode varchar(20),Description varchar(2000)  ,TaskNumber varchar(200), Amount float)

insert into @ExpectedLaborPayments
select @WONumber, * from dbo.udf_Recon_getExpectedLaborPayments(@WONumber)

insert into @PaidLaborPayments
select WONumber , Task , TaskDescription, Task , PaymentAmount from tbl_DishPayment where WONumber = @WONumber and TaskType = 'L'

insert into @ReconMasterLaborPayments 
select WONumber , ServiceCode , Description, TaskNumber , RequestedAmount from tbl_ReconMaster where WONumber = @WONumber and RecordTypeId = 'L' and ReconStatusId = 'R0101'

insert into @ReconMasterEquipmentPayments
select WONumber , ServiceCode , Description, TaskNumber , RequestedAmount from tbl_ReconMaster where WONumber = @WONumber and RecordTypeId = 'E' and ReconStatusId = 'R0101'

if(exists(select * from @PaidLaborPayments dp left join @ExpectedLaborPayments e on dp.WONumber = e.WONumber and dp.Description = e.Description where e.Description is null))
begin
	set @result = 0;
	 
	select * from @PaidLaborPayments dp left join @ExpectedLaborPayments e on dp.WONumber = e.WONumber and dp.Description = e.Description where e.Description is null
end
if(exists(select * from @PaidLaborPayments dp right join @ExpectedLaborPayments e on dp.Description = e.Description and dp.WONumber = e.WONumber where dp.Description is null))
begin
	set @result = 0;
	select * from @PaidLaborPayments dp right join @ExpectedLaborPayments e on dp.Description = e.Description and dp.WONumber = e.WONumber where dp.Description is null
end
if(exists(select * from @PaidLaborPayments dp left join @ReconMasterLaborPayments e on dp.WONumber = e.WONumber and dp.Description = e.Description where e.Description is null))
begin
	set @result = 0;
	select * from @PaidLaborPayments dp left join @ReconMasterLaborPayments e on dp.WONumber = e.WONumber and dp.Description = e.Description where e.Description is null
end

declare @PaidEquipmentAmt float = (select sum(PaymentAmount)from tbl_DishPayment where WONumber = @WONumber and TaskType = 'E')
declare @ExpectedEquipmentAmt float = (
select isnull(SUM(p.CostPrice * tl.Quantity), 0) as SerializedItemsPrice
from tbl_Wo2InvTxn w 
inner join tbl_Data_Job_Setup tjs on w.WoNumber = tjs.WONumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where tjs.WONumber = @WONumber
)

set @ExpectedEquipmentAmt = @ExpectedEquipmentAmt + (select isnull(SUM(sctp.EquipmentReimAmount) , 0) as OTher
from tbl_ReconServiceCodeGrid sctp 
left join tbl_InvProductToPrefix ptp on sctp.StockNo = ptp.ProductId
inner join tbl_Product p on p.ProductId = sctp.StockNo , tbl_Data_Job_Setup tjs
where tjs.WONumber = @WONumber
and tjs.ServiceCodes like '%' + sctp.ServiceCode+ '%' and ISNULL(ptp.IsActive , 0) = 0
and p.CategoryId not in (4))

if(@PaidEquipmentAmt <> @ExpectedEquipmentAmt)
begin
	set @result = 0;
	select 'Equipment Payment Mismatch'
end

declare @ReconMasterApprovedAmount float = (select isnull(SUM(amount), 0) from @ReconMasterEquipmentPayments)

if(@ReconMasterApprovedAmount <> @ExpectedEquipmentAmt)
begin
	set @result = 0;
	select 'Equipment Payment Not Approved All'
end
