select 
tjs.WoNumber,
tjs.CSGLastChangedDate,
tjs.TechCode,
tts.TechName,
tdc.Name,
tjs.WorkOrderType,
tjs.JobOrder,
twt.Clock_In,
twt.Clock_Out,
twt.UserId
from
tbl_data_job_setup tjs
inner join tbl_TechToSupervisor tts on tjs.TechCode = tts.TechCode
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
left join tbl_Wotimes twt on tjs.WoNumber = twt.WoNumber
where
tjs.CSGLastChangedDate >= '01/23/2008'
and
tjs.TechCode in ('3291' ,'2440' )
and
tjs.csgstatus in ('C' , 'D')
order by tjs.techcode

	
