USE [Northware]
GO
/****** Object:  StoredProcedure [dbo].[usp_Mobility_insUpdateDevicePossession]    Script Date: 03/21/2014 15:03:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
alter procedure [dbo].[usp_Mobility_insUpdateDevicePossessionV1]
@DeviceId varchar(100),
@NewPossessorInvParticipantId bigint,
@PossessionStartDate datetime = null,
@PossessionEndDate datetime = null,
@UserId varchar(50),
@Status varchar(2000) = '' out 
as
begin

declare @NewPossessorType varchar(500) = (select t.InvParticipantTypeDescription from tbl_InvParticipant ip inner join tbl_InvParticipantTypeMaster t on ip.InvParticipantType = t.InvParticipantType where InvParticipantId = @NewPossessorInvParticipantId )
declare @NewPossessorStringIdentifier varchar(500) = ''
if(not exists(select * from tbl_Mobility_Device where DeviceId = @DeviceId))
begin

	set @Status = 'ERROR: This Device does not exist in system.'
	return;
	
end
if(@NewPossessorType = 'Technician')
begin
	if(not exists(select * from tbl_User where InvParticipantId = @NewPossessorInvParticipantId and Active = 1))
	begin
		set @Status = 'ERROR: This possessor is not active in Northware. Cannot assign device to an inactive user.'
		return;
	end
	
	set @NewPossessorStringIdentifier = (select UserId from tbl_User where InvParticipantId = @NewPossessorInvParticipantId)
end
if(@NewPossessorType = 'Warehouse')
begin
	if(not exists(select * from tbl_Warehouse where InvParticipantId = @NewPossessorInvParticipantId and IsActive = 1))
	begin
		set @Status = 'ERROR: This possessor is not active in Northware. Cannot assign device to an inactive warehouse.'
		return;
	end
	
	set @NewPossessorStringIdentifier = (select WarehouseName from tbl_Warehouse where InvParticipantId = @NewPossessorInvParticipantId)
end
if(@NewPossessorType = 'Truck')
begin
	if(not exists(select * from tbl_Fleet_VehicleMaster where InvParticipantId = @NewPossessorInvParticipantId and IsActive = 1))
	begin
		set @Status = 'ERROR: This possessor is not active in Northware. Cannot assign device to an inactive truck.'
		return;
	end
	
	set @NewPossessorStringIdentifier = (select VehicleNumber from tbl_Fleet_VehicleMaster where InvParticipantId = @NewPossessorInvParticipantId)
end

if(@NewPossessorInvParticipantId > 0 and @NewPossessorStringIdentifier = '') 
begin
	set @Status = 'ERROR: Unknown possessor'
	return;
end

if(@PossessionStartDate is null)
begin

	set @Status = 'ERROR: Possession start date cannot be null'
	return;
	
end
if(@PossessionEndDate is not null)
begin
	if(@PossessionStartDate = @PossessionEndDate)
	begin
	
		set @Status = 'ERROR: Possession start date and end date cannot be same'
		return;
		
	end 
	
	if(@PossessionEndDate < @PossessionStartDate)
	begin
	
		set @Status = 'ERROR: Possession end date has to be greater than possession start date'
		return;
		
	end
end

declare @userWorking varchar(50) = ''
declare @MaxPossessionStartDate datetime
declare @CurrentPossesor bigint = 0
declare @CurrentPossesorName varchar(50) = ''

declare @CurrentDeviceIdentifierString varchar(500) =''
declare @LastModifiedDate datetime
declare @InvParticipantToDeviceId bigint = 0

declare @TempDeviceId varchar(20) = ''

select @userWorking = ModifiedBy, @LastModifiedDate = DateModified , @MaxPossessionStartDate = maxiptd.MaxStartDate , @CurrentPossesor = InvParticipantId from tbl_Mobility_InvParticipantToDevice 
	iptd inner join (select MAX(possessionstartDate) as MaxStartDate from tbl_Mobility_InvParticipantToDevice where DeviceId = @DeviceId) as maxiptd on iptd.PossessionStartDate = maxiptd.MaxStartDate
	and iptd.DeviceId =  @DeviceId
	
if(exists(select * from tbl_Warehouse where InvParticipantId = @CurrentPossesor))
begin
	set @CurrentPossesorName = (select WarehouseName from tbl_Warehouse where InvParticipantId = @CurrentPossesor)
end	
if(exists(select * from TTSView where TechInvParticipantId = @CurrentPossesor))
begin
	set @CurrentPossesorName = (select TechCode + ' - '+ TechName from TTSView where TechInvParticipantId = @CurrentPossesor)
end	
if(exists(select * from tbl_Fleet_VehicleMaster where InvParticipantId = @CurrentPossesor))
begin
	set @CurrentPossesorName = (select 'Truck# - '+ VehicleNumber from tbl_Fleet_VehicleMaster where InvParticipantId = @CurrentPossesor)
end	


if(@POssessionStartDate <= (select MAX(possessionstartDate) from tbl_Mobility_InvParticipantToDevice where DeviceId = @DeviceId) )
begin
	
	if(@PossessionEndDate is null)
	begin
		set @status = 'ERROR: This device has assignment in future. You need to enter possession start and end date to assign this device in the past.'
		return;
	end
	
	if(exists(select * from tbl_Mobility_InvParticipantToDevice where DeviceId = @DeviceId and @PossessionStartDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionStartDate) ) or 
	   (@PossessionEndDate is not null and (exists(select * from tbl_Mobility_InvParticipantToDevice where DeviceId = @DeviceId and @PossessionEndDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionEndDate) )) )) 
	begin	
		
		if(exists(select * from tbl_Mobility_InvParticipantToDevice where DeviceId = @DeviceId and @PossessionStartDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionStartDate)))
		begin
			select @userWorking = ModifiedBy, @LastModifiedDate = DateModified ,  @CurrentPossesor = InvParticipantId from tbl_Mobility_InvParticipantToDevice 
			where DeviceId = @DeviceId and @PossessionStartDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionStartDate)
		end
		if(@PossessionEndDate is not null and (exists(select * from tbl_Mobility_InvParticipantToDevice where DeviceId = @DeviceId and @PossessionEndDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionEndDate) )) )
		begin
			select @userWorking = ModifiedBy, @LastModifiedDate = DateModified ,  @CurrentPossesor = InvParticipantId from tbl_Mobility_InvParticipantToDevice 
			where DeviceId = @DeviceId and @PossessionEndDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionEndDate)
		end
		if(exists(select * from tbl_Warehouse where InvParticipantId = @CurrentPossesor))
		begin
			set @CurrentPossesorName = (select WarehouseName from tbl_Warehouse where InvParticipantId = @CurrentPossesor)
		end	
		if(exists(select * from TTSView where TechInvParticipantId = @CurrentPossesor))
		begin
			set @CurrentPossesorName = (select TechCode + ' - '+ TechName from TTSView where TechInvParticipantId = @CurrentPossesor)
		end	
		if(exists(select * from tbl_Fleet_VehicleMaster where InvParticipantId = @CurrentPossesor))
		begin
			set @CurrentPossesorName = (select 'Truck# - '+ VehicleNumber from tbl_Fleet_VehicleMaster where InvParticipantId = @CurrentPossesor)
		end	
		
		if(DATEDIFF(minute , @LastModifiedDate , GETDATE()) > 1)
		begin
			set @Status = 'ERROR: This device was assigned to ' + @CurrentPossesorName + ' during this time frame. Cannot alter this assignment in the past.'
			return;
		end 
		if(@UserId <> @userWorking)
		begin
				set @Status =  'WARNING: ' + @userWorking + ' just reassigned this device less than a minute back. ' + ' Please search again and confirm your move.'
				return;
				
		end
		else
		begin
				set @Status = 'WARNING: ' + ' Slow down tiger. You are switching devices way to fast. Please wait for a minute before reassigning this device.'
				return;
		end
	end
	
	
end	

set @TempDeviceId = ''
select @userWorking = ModifiedBy, @LastModifiedDate = DateModified , @MaxPossessionStartDate = maxvp.MaxStartDate , @TempDeviceId = DeviceId from tbl_Mobility_InvParticipantToDevice 
	vp inner join (select MAX(possessionstartDate) as MaxStartDate from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId) as maxvp on vp.PossessionStartDate = maxvp.MaxStartDate
	and vp.InvParticipantId = @NewPossessorInvParticipantId
	
	set @CurrentDeviceIdentifierString = (select dm.ManufacturerName + ' '+ mtd.DeviceName + ' SN# ' + d.DeviceSerialNo from tbl_Mobility_Device d 
												inner join tbl_Mobility_ManufacturerToDevice mtd on mtd.ManufacturerToDeviceId = d.ManufacturerToDeviceId
												inner join tbl_Mobility_DeviceManufacturer dm on mtd.ManufacturerId = dm.ManufacturerId
												where DeviceId = @TempDeviceId)
	
if(@NewPossessorType = 'Technician' and @POssessionStartDate <= (select MAX(possessionstartDate) from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId) )
begin
	if(@PossessionEndDate is null)
	begin
		set @status = 'ERROR: This tech has device assigned in future. You need to enter possession start and end date to assign a device to this tech in the past.'
		return;
	end
	if(exists(select * from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId and @PossessionStartDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionStartDate) ) or 
	(@PossessionEndDate is not null and (exists(select * from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId and @PossessionEndDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionEndDate) )) )) 
	begin	
		if(exists(select * from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId and @PossessionStartDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionStartDate)))
		begin
			select @userWorking = ModifiedBy, @LastModifiedDate = DateModified ,  @TempDeviceId = DeviceId from tbl_Mobility_InvParticipantToDevice 
			where InvParticipantId = @NewPossessorInvParticipantId and @PossessionStartDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionStartDate)
		end
		if(@PossessionEndDate is not null and (exists(select * from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId and @PossessionEndDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionEndDate) )) )
		begin
			select @userWorking = ModifiedBy, @LastModifiedDate = DateModified ,   @TempDeviceId = DeviceId from tbl_Mobility_InvParticipantToDevice 
			where InvParticipantId = @NewPossessorInvParticipantId and @PossessionEndDate between PossessionStartDate and isnull(PossessionEndDate,@PossessionEndDate)
		end
		set @CurrentDeviceIdentifierString = (select dm.ManufacturerName + ' '+ mtd.DeviceName + ' SN# ' + d.DeviceSerialNo from tbl_Mobility_Device d 
												inner join tbl_Mobility_ManufacturerToDevice mtd on mtd.ManufacturerToDeviceId = d.ManufacturerToDeviceId
												inner join tbl_Mobility_DeviceManufacturer dm on mtd.ManufacturerId = dm.ManufacturerId
												where DeviceId = @TempDeviceId)
		if(DATEDIFF(minute , @LastModifiedDate , GETDATE()) > 1)
		begin
			set @Status = 'ERROR: This tech was assigned to device ' + @CurrentDeviceIdentifierString + ' during this time frame. Cannot alter this assignment in the past.'
			return;
		end		
	
		if(@UserId <> @userWorking)
		begin
			set @Status =  'WARNING: ' + @userWorking + ' just reassigned a device to this employee less than a minute back. ' + ' Please search again and confirm your move.'
			return;
			
		end
		else
		begin
			set @Status = 'WARNING: ' + ' Slow down tiger. You are switching devices way to fast. Please wait for a minute before assigning a device to this employee.'
			return;
		end
	end
	
	
end


if(@NewPossessorType = 'Technician' and exists(select * from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId and @PossessionStartDate between PossessionStartDate and ISNULL(PossessionEndDate , DATEADD(day,1, @PossessionStartDate))))

begin

	if((select COUNT(*) from tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId and @PossessionStartDate between PossessionStartDate and ISNULL(PossessionEndDate , DATEADD(day,1, @PossessionStartDate))) > 1)
	begin
	
		set @Status = 'ERROR: Multiple vehicles found assigned to the possessor. Please check data consistency.'
		return;
		
	end
	
	
	
	set @InvParticipantToDeviceId = 0
	set @TempDeviceId = 0
	set @LastModifiedDate  = null
	select @InvParticipantToDeviceId = InvParticipantToDeviceId , @TempDeviceId = DeviceId, @LastModifiedDate = DateModified from  tbl_Mobility_InvParticipantToDevice where InvParticipantId = @NewPossessorInvParticipantId and @PossessionStartDate between PossessionStartDate and ISNULL(PossessionEndDate , DATEADD(day,1, @PossessionStartDate)) 
	
	if(@DeviceId = @TempDeviceId)
	begin
	
		set @Status = 'Device is already assigned to this employee. No chnages done.'
		return;
		
	end
	
	if(@LastModifiedDate is not null and DATEDIFF(minute , @LastModifiedDate , getdate()) <= 1)
	begin
		set @userWorking  = (select ModifiedBy from tbl_Mobility_InvParticipantToDevice where VehiclePossesionId = @VehiclePossesionId)
		if(@UserId <> @userWorking)
		begin
			set @Status =  'WARNING: ' + @userWorking + ' just reassigned this vehicle less than a minute back. ' + ' Please search again and confirm your move.'
			return;
			
		end
		else
		begin
			set @Status = 'ERROR: ' + ' Slow down tiger. You are switching vehicles way to fast. Please wait for a minute before reassigning this vehicle.'
			return;
		end
		
		set @Status = 'ERROR: Cannot change the possession of this vehicle in the past. Data consistency will be broken if done.'
		return;
		
	end
	
	update tbl_Mobility_InvParticipantToDevice
	set PossessionEndDate = DATEADD(minute, -1, @PossessionStartDate),
	DateModified = GETDATE(),
	ModifiedBy = @UserId
	where VehiclePossesionId = @VehiclePossesionId
	
	set @CurrentVehicleNumber = (select VehicleNumber from tbl_Fleet_VehicleMaster where VehicleId = @CurrentVehicleId)
	declare @CurrentEmp varchar(50)= (select UserId from tbl_User where InvParticipantId = @NewPossessorInvParticipantId)
	declare @HomeLocation varchar(100) = (select WarehouseName from tbl_Warehouse where InvParticipantId = @NewPossessorWhInvParticipantId)
	declare @VarcharPossesionEndDate varchar(50) = converT(varchar(50) , DATEADD(minute, -1, @PossessionStartDate) , 101)
	set @Log = 'Ended the possesion of existing vehicle no: ' + @CurrentVehicleNumber + ' of user ' + @CurrentEmp + ' by setting possession end date ' +  @VarcharPossesionEndDate + '.'
	insert into tbl_Mobility_InvParticipantToDevice values (@CurrentVehicleId , @NewPossessorWhInvParticipantId , @PossessionStartDate , null , @UserId, GETDATE() ,@UserId , GETDATE())
	set @Log = @Log + 'Reassigned the existing vehicle no: ' + @CurrentVehicleNumber + ' of user ' + @CurrentEmp + ' to his home location ' + @HomeLocation + ' starting from ' +  converT(varchar(50) , @PossessionStartDate) + '.'
	
	set @SystemLog =@SystemLog + 'Existing vehicle found assigned to this possessor and is reassigned to home location.'
	
end

if(exists(select * from tbl_Mobility_InvParticipantToDevice where VehicleId = @VehicleId and @PossessionStartDate between PossessionStartDate and ISNULL(PossessionEndDate , DATEADD(day,1, @PossessionStartDate))))
begin
	if((select COUNT(*) from tbl_Mobility_InvParticipantToDevice where VehicleId = @VehicleId and @PossessionStartDate between PossessionStartDate and ISNULL(PossessionEndDate , DATEADD(day,1, @PossessionStartDate))) > 1)
	begin
	
		set @Status = 'ERROR: Multiple possessors found for the vehicle and given dates. Please check data consistency.'
		return;
		
	end
	
	set @VehiclePossesionId = 0
	set @CurrentPossesor = 0
	set @LastModifiedDate  = null
	select @VehiclePossesionId = VehiclePossesionId , @CurrentPossesor = InvParticipantId, @LastModifiedDate = DateModified from  tbl_Mobility_InvParticipantToDevice where VehicleId = @VehicleId and @PossessionStartDate between PossessionStartDate and ISNULL(PossessionEndDate , DATEADD(day,1, @PossessionStartDate)) 
	
	if(@CurrentPossesor = @NewPossessorInvParticipantId)
	begin
	
		set @Status = 'Vehicle is already assigned to this warehouse. No chnages done.'
		return;
		
	end
	
	if(@LastModifiedDate is not null and DATEDIFF(minute , @LastModifiedDate , getdate()) <= 1)
	begin
		set @userWorking = (select ModifiedBy from tbl_Mobility_InvParticipantToDevice where VehiclePossesionId = @VehiclePossesionId)
		if(@UserId <> @userWorking)
		begin
			set @Status ='WARNING: ' +  @userWorking + ' just reassigned this vehicle a minute back. ' + ' Please search again and confirm your move.'
			return;
			
		end
		else
		begin
			set @Status = 'WARNING: ' + ' Slow down tiger. You are switching vehicles way to fast. Please wait for a minute before reassigning this vehicle.'
			return;
		end
		
		set @Status = 'ERROR: Cannot change the possession of this vehicle in the past. Data consistency will be broken if done.'
		return;
		
	end
	
	update tbl_Mobility_InvParticipantToDevice
	set PossessionEndDate = DATEADD(minute, -1, @PossessionStartDate),
	DateModified = GETDATE(),
	ModifiedBy = @UserId
	where
	VehiclePossesionId = @VehiclePossesionId
	
	set @Log = @Log +  'Updated the possesion end date of vehicle no: ' + @VehicleNo + ' to ' + CONVERT(varchar(200) , DATEADD(minute, -1, @PossessionStartDate)) + ' [VehiclePossesionId : '+ rtrim(ltrim(str(@VehiclePossesionId))) + ']'
	set @SystemLog = @SystemLog +'Existing possessor found for this vehicle. Updated the possession end date.'
	
end

insert into tbl_Mobility_InvParticipantToDevice values (@VehicleId , @NewPossessorInvParticipantId , @PossessionStartDate , @PossessionEndDate , @UserId, GETDATE() ,@UserId , GETDATE())

set @Log = @Log + ' Inserted the new assignment for vehicle no: ' + @VehicleNo + ' to ' + @NewPossessor + ' start date : ' + CONVERT(varchar(200) , @PossessionStartDate , 101) + ' End Date ' + isnull(CONVERT(varchar(200) , @PossessionEndDate , 101) , 'NULL')
set @SystemLog  = @SystemLog + 'Inserted the new assignment.'

declare @currentDateTime datetime = getdate()
exec usp_insEventLog 0 , @UserId , 'U' , @currentDateTime , @Log , @SystemLog , @VehicleNo

set @Status = 'OK'


end

