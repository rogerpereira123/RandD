
--Per POssessor
select
vps1.VehiclePossesionId, vps1.VehicleId , vps1.PossessorInvParticipantId, vps1.PossessionStartDate , vps1.PossessionEndDate , vps2.VehiclePossesionId , vps2.VehicleId , vps2.PossessorInvParticipantId, vps2.PossessionStartDate , vps2.PossessionEndDate  
from tbl_Fleet_VehiclePossession vps1
inner join tbl_Fleet_VehiclePossession vps2 on vps1.PossessorInvParticipantId = vps2.PossessorInvParticipantId
inner join TTSView tts on vps1.PossessorInvParticipantId = tts.TechInvParticipantId

where vps1.VehiclePossesionId <> vps2.VehiclePossesionId
and vps1.PossessionStartDate > vps2.PossessionStartDate and vps1.PossessionStartDate < vps2.PossessionEndDate
and vps1.PossessionEndDate is not null 
and vps2.PossessionEndDate is not  null 

order by vps1.PossessorInvParticipantId, vps1.PossessionStartDate

--Per VEhicle
select
vps1.VehiclePossesionId, vps1.VehicleId , vps1.PossessorInvParticipantId, vps1.PossessionStartDate , vps1.PossessionEndDate , vps2.VehiclePossesionId , vps2.VehicleId , vps2.PossessorInvParticipantId, vps2.PossessionStartDate , vps2.PossessionEndDate  
from tbl_Fleet_VehiclePossession vps1
inner join tbl_Fleet_VehiclePossession vps2 on vps1.VehicleId = vps2.VehicleId

where vps1.VehiclePossesionId <> vps2.VehiclePossesionId
and vps1.PossessionStartDate > vps2.PossessionStartDate and vps1.PossessionStartDate < vps2.PossessionEndDate
and vps1.PossessionEndDate is not  null 
and vps2.PossessionEndDate is not null 

order by vps1.PossessorInvParticipantId, vps1.PossessionStartDate




