select
tts.TechName, count(WoNumber)
from 
tbl_data_job_setup tjs
inner join tbl_ZipToSupervisor tzs on tjs.CustomerZip = tzs.ZipCode
inner join tbl_TechToSupervisor tts on tzs.Supervisor = tts.TechCode 
where
tjs.CSGLastChangedDate >= '10/01/2008'
and
tjs.CSGLastChangedDate <= '10/31/2008'
and
tjs.CSGStatus in ('C' , 'D')
group by tts.TEchName


