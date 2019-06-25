select 
tjs.WoNumber , tdc.Name as CustomerName, tdc.Phone ,tts.TechCode, tts.TechName,  tw.Clock_In as [Clock In Time]  
from
tbl_data_job_setup tjs 
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.Customerid
inner join tbl_WoTimes tw on tjs.WoNumber = tw.WoNumber
inner join tbl_TechTosupervisor tts on tjs.TechCode = tts.TechCode
where
tjs.ScheduledDate >= '08/05/2008' 
and
tjs.ScheduledDate <= '08/05/2008' 
and
tjs.TOD = '8AM-12 PM'
and
tjs.CSgStatus in ('O' , 'R')
and
convert(datetime,tw.Clock_In , 108) >  convert(datetime , '08:30:00' , 108)
order by tts.TechCode

select 
tjs.WoNumber , tdc.Name as CustomerName, tdc.Phone ,tts.TechCode, tts.TechName,  tw.Clock_In as [Clock In Time]  
from
internalworkorder tjs 
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.Customerid
inner join tbl_WoTimes tw on tjs.WoNumber = tw.WoNumber
inner join tbl_TechTosupervisor tts on tjs.TechCode = tts.TechCode
where
tjs.ScheduledDate >= '08/05/2008' 
and
tjs.ScheduledDate <= '08/05/2008' 
and
tjs.ScheduledTime = 'AM'
and
tjs.Status in ('O' , 'R')
and
convert(datetime,tw.Clock_In , 108) >  convert(datetime , '08:30:00' , 108)
order by tts.TechCode



select 
tjs.WoNumber , tdc.Name as CustomerName, tdc.Phone ,tts.TechCode, tts.TechName, isnull(tw.Clock_In, '') as [Clock In Time]  
from
tbl_data_job_setup tjs 
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.Customerid
left join tbl_WoTimes tw on tjs.WoNumber = tw.WoNumber
inner join tbl_TechTosupervisor tts on tjs.TechCode = tts.TechCode
where
tjs.ScheduledDate >= '08/05/2008' 
and
tjs.ScheduledDate <= '08/05/2008' 
and
tjs.TOD = '8AM-12 PM'
and
tw.Clock_In is null
and
tjs.CSgStatus in ('O' , 'R')
union
select 
tjs.WoNumber , tdc.Name as CustomerName, tdc.Phone ,tts.TechCode, tts.TechName, isnull(tw.Clock_In, '') as [Clock In Time]  
from
internalworkorder tjs 
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.Customerid
left join tbl_WoTimes tw on tjs.WoNumber = tw.WoNumber
inner join tbl_TechTosupervisor tts on tjs.TechCode = tts.TechCode
where
tjs.ScheduledDate >= '08/05/2008' 
and
tjs.ScheduledDate <= '08/05/2008' 
and
tjs.ScheduledTime = 'AM'
and
tw.Clock_In is null
and
tjs.Status in ('O' , 'R')


select * from #FisrtAMjobClockedInAfter0830Econnect
union
select * from #FisrtAMjobClockedInAfter0830Internal




union 
select * from #NoJobClockedInYet
where TechCode not in (select TechCode from #FisrtAMjobClockedInAfter0830)
order by TechCode

drop table #FisrtAMjobClockedInAfter0830
drop table #NoJobClockedInYet





