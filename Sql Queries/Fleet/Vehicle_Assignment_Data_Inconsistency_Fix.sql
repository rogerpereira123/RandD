
--This need to be changed to fix Per Vehicle or Per Possessor data inconsistencies. Please refer to Vehicle_Assignment_Data_Inconsistency_Finder.sql

declare @Count int = 1

while exists(

select
vps1.VehiclePossesionId, vps1.VehicleId , vps1.PossessorInvParticipantId, vps1.PossessionStartDate , vps1.PossessionEndDate , vps2.VehiclePossesionId , vps2.VehicleId , vps2.PossessorInvParticipantId, vps2.PossessionStartDate , vps2.PossessionEndDate  
from tbl_Fleet_VehiclePossession vps1
inner join tbl_Fleet_VehiclePossession vps2 on vps1.PossessorInvParticipantId = vps2.PossessorInvParticipantId
inner join TTSView tts on vps1.PossessorInvParticipantId = tts.TechInvParticipantId

where vps1.VehiclePossesionId <> vps2.VehiclePossesionId
and vps1.PossessionStartDate > vps2.PossessionStartDate and vps1.PossessionStartDate < vps2.PossessionEndDate
and vps1.PossessionEndDate is  null 
and vps2.PossessionEndDate is not null 
)

begin

declare @VPS1VPId bigint
declare @VPS2VPID bigint
declare @VPS1PSD datetime
declare @VPS2PSD datetime
declare @VPS2PED datetime


select top 1 
@VPS1VPId = vps1.VehiclePossesionId, 
@VPS1PSD = vps1.PossessionStartDate , 
@VPS2VPID = vps2.VehiclePossesionId , 
@VPS2PSD = vps2.PossessionStartDate , 
@VPS2PED = vps2.PossessionEndDate  
from tbl_Fleet_VehiclePossession vps1
inner join tbl_Fleet_VehiclePossession vps2 on vps1.PossessorInvParticipantId = vps2.PossessorInvParticipantId
inner join TTSView tts on vps1.PossessorInvParticipantId = tts.TechInvParticipantId

where vps1.VehiclePossesionId <> vps2.VehiclePossesionId
and vps1.PossessionStartDate > vps2.PossessionStartDate and vps1.PossessionStartDate < vps2.PossessionEndDate
and vps1.PossessionEndDate is  null 
and vps2.PossessionEndDate is not null 
order by vps1.PossessorInvParticipantId, vps1.PossessionStartDate


if(@VPS1VPId > @VPS2VPID)
begin
	if(@VPS2PSD <= @VPS1PSD)
	begin
	 update tbl_Fleet_VehiclePossession set PossessionEndDate = @VPS1PSD where VehiclePossesionId = @VPS2VPID
	 print 'Updated'
	end
	else
	begin
		print 'VPS1 Start Date it smaller than vps2 start date for VPS1Id '  + @VPS1VPId
	end
	
end
else
begin
	print 'VPS1 ID is smaller. VPS1ID: ' + str(@VPS1VPId) + ' VPS2Id:' + str(@VPS2VPID)
end
if(@Count =50)
begin
	break;
end
else begin set @Count = @Count + 1 end

end



