
--This need to be changed to fix Per Vehicle or Per Possessor data inconsistencies. Please refer to Vehicle_Assignment_Data_Inconsistency_Finder.sql

declare @Count int = 1

while exists(
select
iptd1.InvParticipantToDeviceId, iptd1.DeviceId , iptd1.InvParticipantId, iptd1.PossessionStartDate , iptd1.PossessionEndDate , iptd2.InvParticipantToDeviceId , iptd2.DeviceId , iptd2.InvParticipantId, iptd2.PossessionStartDate , iptd2.PossessionEndDate  
from tbl_Mobility_InvParticipantToDevice iptd1
inner join tbl_Mobility_InvParticipantToDevice iptd2 on iptd1.DeviceId = iptd2.DeviceId
inner join TTSView tts on iptd1.InvParticipantId = tts.TechInvParticipantId

where iptd1.InvParticipantToDeviceId <> iptd2.InvParticipantToDeviceId
and iptd1.PossessionStartDate > iptd2.PossessionStartDate and iptd1.PossessionStartDate < iptd2.PossessionEndDate
and iptd1.PossessionEndDate is not null 
and iptd2.PossessionEndDate is not  null 
)

begin

declare @VPS1VPId bigint
declare @VPS2VPID bigint
declare @VPS1PSD datetime
declare @VPS2PSD datetime
declare @VPS2PED datetime


select top 1 
@VPS1VPId = iptd1.InvParticipantToDeviceId, 
@VPS1PSD = iptd1.PossessionStartDate , 
@VPS2VPID = iptd2.InvParticipantToDeviceId , 
@VPS2PSD = iptd2.PossessionStartDate , 
@VPS2PED = iptd2.PossessionEndDate 
from tbl_Mobility_InvParticipantToDevice iptd1
inner join tbl_Mobility_InvParticipantToDevice iptd2 on  iptd1.DeviceId = iptd2.DeviceId
inner join TTSView tts on iptd1.InvParticipantId = tts.TechInvParticipantId
where iptd1.InvParticipantToDeviceId <> iptd2.InvParticipantToDeviceId
and iptd1.PossessionStartDate > iptd2.PossessionStartDate and iptd1.PossessionStartDate < iptd2.PossessionEndDate
and iptd1.PossessionEndDate is not null 
and iptd2.PossessionEndDate is not  null 
order by iptd1.InvParticipantId, iptd1.PossessionStartDate

if(@VPS1VPId > @VPS2VPID)
begin
	if(@VPS2PSD <= @VPS1PSD)
	begin
	 update tbl_Mobility_InvParticipantToDevice set PossessionEndDate = @VPS1PSD where InvParticipantToDeviceId = @VPS2VPID
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
if(@Count =10)
begin
	break;
end
else begin set @Count = @Count + 1 end

end



