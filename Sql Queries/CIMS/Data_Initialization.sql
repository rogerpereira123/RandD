--tbl_Clothing_ParticipantTypeMaster
insert into tbl_Clothing_ParticipantTypeMaster values('Vendor')
insert into tbl_Clothing_ParticipantTypeMaster values('Warehouse')
insert into tbl_Clothing_ParticipantTypeMaster values('User')

--Warehouse Participant Generation
declare @Warehouses table (WarehouseId varchar(200))
declare @WarehouseId varchar(200)
insert into @Warehouses 
select WarehouseId from tbl_Warehouse 
declare @WarehouseParticipantTypeId int = (select ParticipantTypeId from tbl_Clothing_ParticipantTypeMaster where ParticipantType = 'Warehouse')
while(exists(select * from @Warehouses))
begin
	select top 1 @WarehouseId =  WarehouseId from @Warehouses
	insert into tbl_Clothing_ParticipantIdMaster values(@WarehouseParticipantTypeId)
	
	insert into tbl_Clothing_WarehouseToParticipantId 
	select @WarehouseId , MAX(ParticipantId) from tbl_Clothing_ParticipantIdMaster
	
	delete from @Warehouses where WarehouseId = @WarehouseId
	
end

--User particiapnt creation
declare @Users table (UserId varchar(50))
declare @UserId varchar(50)
insert into @Users
select UserId from tbl_User where Active = 1
declare @UserParticipantTypeId int = (select ParticipantTypeId from tbl_Clothing_ParticipantTypeMaster where ParticipantType = 'User')
while(exists(select * from @Users))
begin
	select top 1 @UserId =  UserId from @Users
	insert into tbl_Clothing_ParticipantIdMaster values(@UserParticipantTypeId)
	
	insert into tbl_Clothing_UserToParticipantId 
	select @UserId , MAX(ParticipantId) from tbl_Clothing_ParticipantIdMaster
	
	delete from @Users where UserId = @UserId
	
end



