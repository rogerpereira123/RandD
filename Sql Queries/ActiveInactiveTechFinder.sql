drop table #tech
select distinct techcode,techname,supervisor into #tech from tbl_techtosupervisor where techcode <> supervisor

select distinct techcode , techname into #supervisor from tbl_techtosupervisor where techcode = supervisor

select t.techcode,t.techname,s.techname as supervisor from #tech t , #supervisor s
where
t.techcode not in (
select techcode from tbl_data_job_setup tjs
where
tjs.scheduleddate > @startDate
and
tjs.scheduleddate < @endDate
and
t.supervisor = s.techcode



