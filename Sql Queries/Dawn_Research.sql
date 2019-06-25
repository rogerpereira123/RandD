declare @startDate varchar(10)
declare @endDate varchar(10)
declare @ma varchar(2)

--Set the start date & end date here
set @startDate = '07/01/2007'
set @endDate = '07/31/2007'
set @ma = '8E'

select data.* , tdo.reason as Resolution 
from 
dishtest.dbo.tbl_30_day as data
inner join northware.dbo.tbl_data_job_setup as tjs on data.work_order_number = tjs.wonumber 
left outer join northware.dbo.tbl_daily_opportunities as tdo on tjs.jobid = tdo.jobid
where
data.mgmt_area = @ma
and
data.opportunity = 1
and
data.status = 'X'
and
data.create_date >= @startDate
and
data.create_date <= @endDate

