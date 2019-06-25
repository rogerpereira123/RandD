insert into tbl_daily_opportunities 

select '11/24/2011' , tjs.jobid , tjs.TechCode , null , 'YES' , 'NO' from 
tbl_data_job_setup tjs 
where 
tjs.ScheduledDate = '11/24/2011'
and
tjs.WorkOrderType in ('NC' , 'RC', 'RS')
and
tjs.jobid not in (select jobid from tbl_daily_opportunities where convert(varchar(10),[date] , 101) = '11/24/2011')

--select tdo.* from tbl_daily_opportunities tdo inner join tbl_data_job_setup tjs on tdo.JobId = tjs.JobId where convert(varchar(10),[date] , 101) = '03/08/2010' and tjs.WorkOrderType in ('NC', 'RC', 'RS')