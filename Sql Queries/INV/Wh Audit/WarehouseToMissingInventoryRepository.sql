select * from tbl_InvWarehouseToMissingInventoryRepository
select distinct InvParticipantType from tbl_InvParticipant
declare @Warehouse table
(
WarehouseId varchar(50)
)
declare @InvParticipantId bigint
insert into @Warehouse
select WarehouseId from tbl_Warehouse where IsActive = 1
declare @WarehouseId varchar(50)

while(Exists(select * from @Warehouse))
begin
insert into tbl_InvParticipant values(5)
set @InvParticipantId = (select MAX(InvParticipantId) from tbl_InvParticipant where InvParticipantType = 5)
set @WarehouseId = (select top 1 WarehouseId from @Warehouse)
insert into tbl_InvWarehouseToMissingInventoryRepository values(@WarehouseId , @InvParticipantId)

delete from @Warehouse where WarehouseId = @WarehouseId
end
