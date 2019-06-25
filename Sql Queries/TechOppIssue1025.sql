drop table #t
select tdo.jobid , max(tdo.date) date into #t from 
tbl_daily_opportunities tdo,
tbl_data_job_setup tjs
where
tdo.date >= '10/01/2007'
and 
tdo.date <= '10/26/2007'
and
tdo.jobid = tjs.jobid
and
tjs.csglastchangeddate = tjs.OriginalSchDate
and
tjs.ScheduledDate > tjs.CsgLastChangedDate
and
tdo.IsOpportunity = 'YES'
and 
tjs.CSGStatus = 'C'
group by tdo.jobid having count(tdo.jobid) > 1 



update tbl_daily_opportunities set tbl_daily_opportunities.IsOpportunity = 'NO'
from tbl_data_job_setup tjs , #t t

where 
tbl_daily_opportunities.jobid = t.jobid
and
tbl_daily_opportunities.date = t.date
and
t.jobid = tjs.jobid

