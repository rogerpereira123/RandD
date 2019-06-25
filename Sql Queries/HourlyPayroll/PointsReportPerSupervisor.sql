select zts.Supervisor, tts.TechName as SupervisorName, sum(tjs.WorkUnits) as Points
into #points
from tbl_data_job_setup tjs
inner join tbl_ZipToSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_TechTosupervisor tts on zts.Supervisor = tts.TechCode
where
tjs.CSGLastChangedDate >= '08/17/2009'
and
tjs.CSGLastChangedDate <= '08/23/2009'
and
tjs.CSGStatus in ('C' , 'D')
group by zts.Supervisor,tts.TechName

insert into #points
select zts.Supervisor,  tts.TechName as SupervisorName, sum(tjs.Points)
from internalworkorder tjs
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_ZipToSupervisor zts on tdc.zipcode = zts.ZipCode
inner join tbl_TechTosupervisor tts on zts.Supervisor = tts.TechCode
where
tjs.LastUpdatedDt >= '08/17/2009'
and
tjs.LastUpdatedDt <= '08/23/2009'
and
tjs.Status in ('C')
group by zts.Supervisor,tts.TechName



select supervisor,SupervisorName, sum(points) as Points
from
#points
group by supervisor,supervisorname
order by supervisor


drop table #points