select tjs.techcode , tjs.CSGLastChangedDate as ClosedDate
into #ext
from tbl_data_job_setup tjs
inner join tbl_techtosupervisor tts on tjs.TechCode = tts.TechCode
where
/*CSGLastChangedDate >= '01/08/2008'
and
CSGLastChangedDate <= '05/13/2008'
and*/
CSGStatus in ('C' , 'D')
and
tjs.TechCode = '3400'
--group by tjs.TechCode ,tts.TechName  
order by tjs.CSGLastChangedDate

select * into #t from #ext
delete from #t



select tjs.techcode , tjs.LastUpdatedDt as ClosedDate into #int 
from internalworkorder tjs
inner join tbl_techtosupervisor tts on tjs.TechCode = tts.TechCode
where
/*LastUpdateddt >= '01/08/2008'
and
LastUpdatedDt <= '05/13/2008'
and*/
Status in ('C')
and
tjs.TechCode = '3400'
--group by tjs.TechCode ,tts.TechName  
order by tjs.LastUpdatedDt
--order by tjs.techcode

insert into #t
select * from #ext 
union all select * from #int


select techcode ,ClosedDate
from #t
order by ClosedDate

drop table #ext
drop table #int
drop table #t
