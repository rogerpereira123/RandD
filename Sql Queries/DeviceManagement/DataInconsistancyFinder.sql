select
iptd1.InvParticipantToDeviceId, iptd1.DeviceId , iptd1.InvParticipantId, iptd1.PossessionStartDate , iptd1.PossessionEndDate , iptd2.InvParticipantToDeviceId , iptd2.DeviceId , iptd2.InvParticipantId, iptd2.PossessionStartDate , iptd2.PossessionEndDate  
from tbl_Mobility_InvParticipantToDevice iptd1
inner join tbl_Mobility_InvParticipantToDevice iptd2 on iptd1.InvParticipantId = iptd2.InvParticipantId
inner join TTSView tts on iptd1.InvParticipantId = tts.TechInvParticipantId

where iptd1.InvParticipantToDeviceId <> iptd2.InvParticipantToDeviceId
and iptd1.PossessionStartDate > iptd2.PossessionStartDate and iptd1.PossessionStartDate < iptd2.PossessionEndDate
and iptd1.PossessionEndDate is not null 
and iptd2.PossessionEndDate is not  null 

order by iptd1.InvParticipantId, iptd1.PossessionStartDate

select
iptd1.InvParticipantToDeviceId, iptd1.DeviceId , iptd1.InvParticipantId, iptd1.PossessionStartDate , iptd1.PossessionEndDate , iptd2.InvParticipantToDeviceId , iptd2.DeviceId , iptd2.InvParticipantId, iptd2.PossessionStartDate , iptd2.PossessionEndDate  
from tbl_Mobility_InvParticipantToDevice iptd1
inner join tbl_Mobility_InvParticipantToDevice iptd2 on iptd1.DeviceId = iptd2.DeviceId
inner join TTSView tts on iptd1.InvParticipantId = tts.TechInvParticipantId

where iptd1.InvParticipantToDeviceId <> iptd2.InvParticipantToDeviceId
and iptd1.PossessionStartDate > iptd2.PossessionStartDate and iptd1.PossessionStartDate < iptd2.PossessionEndDate
and iptd1.PossessionEndDate is not null 
and iptd2.PossessionEndDate is not  null 

order by iptd1.InvParticipantId, iptd1.PossessionStartDate