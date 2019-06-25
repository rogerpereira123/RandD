declare @scheduledDateStart varchar(10)
declare @scheduledDateEnd varchar(10)
declare @sp varchar(3000)

set @scheduledDateStart = '08/01/2007'
set @scheduledDateEnd = '08/31/2007'
set @sp = 'SBC'

select
tjs.MgtArea as MA,tjs.techcode,tjs.scheduleddate, tdc.Name as 'Customer Name' , tdc.Phone as PhoneNo , tdc.city , tjs.Segment_Output as SP, tdo.reason , tdc.AccountNo , tjs.CSGStatus , tjs.CSGLastChangedDate 
from tbl_data_job_setup tjs
inner join tbl_data_customers tdc on tjs.customerid = tdc.customerid
left outer join tbl_daily_opportunities tdo on tjs.jobid = tdo.jobid
where 
tjs.scheduleddate >= @scheduledDateStart
and
tjs.scheduleddate >= @scheduledDateEnd
and
tjs.Segment_Output = @sp


