/*Query For IVR
select cout.workorderno WoNumber,date(cout.clockout) ClockOutDate,time(cout.clockout) ClockOutTime, cout.technumber TechCode 
from clockout cout 
where 
date(cout.clockout) >= '2008-02-25'
and
date(cout.clockout) <= '2008-03-02'
and 
cout.ivrcompleted = 1
*/

drop table ivr


select tjs.TechCode , Count(tjs.WoNumber) as [Total Completed Jobs], sum(case when ivr.WoNumber is not null then 1 else 0 end) as [Total Completed in IVR]  from tbl_data_job_setup tjs
left outer join ivr on tjs.WoNumber = ivr.WoNumber
where tjs.CSGLastCHangedDate >= '03/30/2008'
and
tjs.CSGLastChangedDate <= '04/06/2008'
and
tjs.CSGStatus in ('C' , 'D')
and
tjs.WorkOrderType in ('NC', 'RC', 'RS')
group by tjs.techcode 


select tjs.CSGLastChangedDate , Count(tjs.WoNumber) as [Total Completed NC Jobs], sum(case when ivr.WoNumber is not null then 1 else 0 end) as [Total Completed in IVR]  from tbl_data_job_setup tjs
left outer join ivr on tjs.WoNumber = ivr.WoNumber
where tjs.CSGLastCHangedDate >= '03/23/2008'
and
tjs.CSGLastChangedDate <= '04/06/2008'
and
tjs.CSGStatus in ('C' , 'D')
and
tjs.WorkOrderType in ('NC', 'RC', 'RS')
group by tjs.CSGLastChangedDate 
order by tjs.CSGLastChangedDate asc



