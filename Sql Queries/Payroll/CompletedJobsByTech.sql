select tjs.techcode , tts.TechName , count(jobid) as jobs
into #ext
from tbl_data_job_setup tjs
inner join tbl_techtosupervisor tts on tjs.TechCode = tts.TechCode
where
CSGLastChangedDate >= '08/01/2007'
and
CSGLastChangedDate <= '10/14/2008'
and
CSGStatus in ('C' , 'D')
group by tjs.TechCode ,tts.TechName  

select * into #t from #ext
delete from #t



select tjs.techcode , tts.TechName , count(tjs.WoNumber) as jobs into #int 
from internalworkorder tjs
inner join tbl_techtosupervisor tts on tjs.TechCode = tts.TechCode
where
LastUpdateddt >= '08/01/2007'
and
LastUpdatedDt <= '10/14/2008'
and
Status in ('C')
group by tjs.TechCode ,tts.TechName  
order by tjs.techcode

insert into #t
select * from #ext 
union all select * from #int


select techcode , techname , sum(jobs)
from #t
group by techcode, techname


drop table #ext
drop table #int
drop table #t
