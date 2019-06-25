
select 
tjs.TechCode,tts.TechName,
sum(tjs.workunits) as Points
into #tec
from
tbl_data_job_setup tjs
inner join tbl_TechToSupervisor tts on tjs.TechCode = tts.TechCode
where
ScheduledDate >= '04/22/2009'
and
Scheduleddate <= '05/05/2009'
and
tjs.Techcode in (select TechCode from tbl_TechToSupervisor where Supervisor = '1314')
and
tjs.csgstatus in ('C','D')
group by tjs.TechCode,tts.TechName
order by tjs.techcode


select 
tjs.TechCode,tts.TechName,
sum(tjs.points) as Points
into #hwtc
from
internalworkorder tjs
inner join tbl_TechToSupervisor tts on tjs.TechCode = tts.TechCode
where
ScheduledDate >= '04/22/2009'
and
Scheduleddate <= '05/05/2009'
and
tjs.Techcode in (select TechCode from tbl_TechToSupervisor where Supervisor = '1314')
and
tjs.status in ('C' )
group by tjs.TechCode,tts.TechName
order by tjs.techcode


select #tec.TechCode , #tec.TechName, sum(isnull(#tec.Points , 0) +  isnull(#hwtc.Points , 0)) as Points
from
#tec left join #hwtc on #tec.TechCode = #hwtc.TechCode
group by #tec.TechCode , #tec.TechName

drop table #tec
drop table #hwtc