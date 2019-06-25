update tbl_data_job_setup set CSGStatus = 'C' where 
wonumber
in
(
select distinct tjs.WONumber from tbl_data_job_setup tjs
inner join 
tbl_WoTimes tw on tjs.WoNumber = tw.WoNumber
where
tw.Clock_Out is not null
and
tjs.ScheduledDAte >= '01/23/2008'
and 
tjs.CSGStatus in ('O' , 'R')
)


