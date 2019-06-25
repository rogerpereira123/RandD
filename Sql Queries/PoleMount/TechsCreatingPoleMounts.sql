select
tjsNc.WONumber as OrgWO,tjsNc.CSGStatus as OrgWOStatus , tjsNc.CSGLastChangedDate as OrgWOCompletedDate, tjsNC.TechCode as OrgTechCode, tjsPM.WONumber as PMWO ,tjspm.SaleDate as PMCreateDate, tjsPM.ScheduledDate as PMScheduledDate
from
tbl_Data_Job_Setup tjsNc
inner join tbl_InvParticipant2User ip2u on tjsNc.TechCode = ip2u.UserId
inner join tbl_Data_Job_Setup tjsPM on tjsNc.CustomerID = tjsPM.CustomerID
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
where
tjsNc.TechCode = '9131'
and tjsNc.WONumber <> tjsPM.WONumber
and
tjsNc.CSGStatus = 'C'
and tjsPM.ServiceCodes like '%2~%'
and tjsNc.CSGLastChangedDate >= '08/01/2014'
and tjsNc.CSGLastChangedDate <= '09/30/2014'
and tjsPM.ScheduledDate > tjsNc.CSGLastChangedDate