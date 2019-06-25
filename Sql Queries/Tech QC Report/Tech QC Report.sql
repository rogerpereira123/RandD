declare @assignedBy varchar(10)
declare @startDate datetime
declare @enddate datetime

set @assignedBy = '1378'
set @startDate = '04/28/2010'
set @enddate = '05/11/2010'

select 
tjs.TechCode, tts.TechName, tdc.Name as CustomerName, qcs.Inspector,  convert(varchar(10) , qcs.ScheduledDate , 101) as ScheduledDate , case when qcs.Status = '000' then 'OPEN' when status = '111' then 'CLOSED' end as Status , isnull(qc.OverallScore , '') as QCResult,tjs.WONumber
from tbl_QCSchedule qcs 
inner join tbl_data_job_setup tjs on qcs.WOToQc = tjs.WoNumber
inner join tbl_TechTOSupervisor tts on tjs.TechCode = tts.TechCode
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
left join tbl_RevisedQC_QCMaster qc on qc.WONumber = qcs.WoToQc
where 
QCS.AssignedBy = @AssignedBy
and
QCS.ScheduledDate >= @StartDate
and
QCS.ScheduledDate <= @EndDate

union

select 
tjs.TechCode, tts.TechName, tdc.Name as CustomerName, qc.Inspector,  '' as ScheduledDate ,  'CLOSED' as Status , isnull(qc.OverallScore , '') as QCResult,tjs.WONumber
from tbl_RevisedQC_QCMaster qc
inner join tbl_data_job_setup tjs on qc.WONumber = tjs.WoNumber
inner join tbl_TechTOSupervisor tts on tjs.TechCode = tts.TechCode
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_TechToLocation ttl on ttl.techcode = tjs.TechCode
inner join tbl_TechToLocation ttlSup on ttl.location_id = ttlSup.location_id
left join tbl_QCSchedule QCS on qc.WONumber = QCS.WOToQC
where 
ttlSup. techcode = @AssignedBy
and
QC.InspectDate >= @StartDate
and
QC.InspectDate <= @EndDate
and
QCS.WOToQC is null
order by tjs.TechCode , QC.ScheduledDate