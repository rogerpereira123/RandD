select
tjs.TechCode ,W.WarehouseName, COUNT(tjs.wonumber) ClosedJobs , sum(case when (ivr.workordernumber is null) then 0 else 1 end) as ClockedInJobs 
from
tbl_Data_Job_Setup tjs
left join tbl_IVR_ClockIn ivr on tjs.WONumber = ivr.WorkOrderNumber
inner join tbl_InvParticipant2User ip2u on tjs.TechCode = ip2u.UserId
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
where
tjs.CSGLastChangedDate >='12/06/2010'
and
tjs.CSGLastChangedDate <= '12/06/2010'
and tjs.CSGStatus = 'C'

group by tjs.TechCode,w.WarehouseName
order by w.WarehouseName, tjs.TechCode


select * from tbl_Data_Job_Setup where CSGLastChangedDate = '12/06/2010' and TechCode = '2706'
select * from tbl_IVR_ClockIn where convert(date,CreatedOn) = '12/06/2010' and TechCode = '2706'
