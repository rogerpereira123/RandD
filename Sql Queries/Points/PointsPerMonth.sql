select
datepart(year,  tjs.CSGLastChangedDate) as [Year] ,datename(month,  tjs.CSGLastChangedDate) as [Month]  , w.WarehouseName, Count(tjs.WONumber) as CompletedJobs
from 
tbl_Data_Job_Setup tjs
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_InvParticipant2User ip2u on zts.Supervisor = ip2u.UserId
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
where
tjs.CSGStatus in ('C' , 'D')
and
tjs.CSGLastChangedDate >= '01/01/2011'

group by datepart(year,  tjs.CSGLastChangedDate), datename(month,  tjs.CSGLastChangedDate)  ,datepart(month,  tjs.CSGLastChangedDate) , w.WarehouseName
order by datepart(year,  tjs.CSGLastChangedDate), datepart(month,  tjs.CSGLastChangedDate)

