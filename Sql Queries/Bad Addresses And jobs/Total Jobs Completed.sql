select tts.TechCode, tts.TechName , 	count(tjs.WONumber) 
  
	from tbl_data_job_setup tjs
	inner join tbl_ziptosupervisor tzs on tjs.Customerzip = tzs.ZipCode
	inner join tbl_TechToLocation ttl on tzs.supervisor = ttl.TechCode
	inner join tbl_TechToSupervisor tts on tts.TechCode = tzs.Supervisor
	where
	tjs.CSGStatus in ('C' , 'D')
	and
	tjs.CSGLastChangedDate >= '02/01/2008'
	and
	tjs.CSGLastChangedDate <= '02/29/2008'
	group by tts.TechCode, tts.TechName 


select tts.TechCode, tts.TechName ,
 count(tjs.WONumber)
from internalworkorder tjs
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_ziptosupervisor tzs on tdc.zipcode = tzs.ZipCode
inner join tbl_TechToLocation ttl on tzs.supervisor = ttl.TechCode
inner join tbl_TechToSupervisor tts on tts.TechCode = tzs.Supervisor
where
tjs.Status in ('C' , 'D')
and
tjs.LastUpdatedDt >= '02/01/2008'
and
tjs.LastUpdatedDt <= '02/29/2008'
group by tts.TechCode, tts.TechName

