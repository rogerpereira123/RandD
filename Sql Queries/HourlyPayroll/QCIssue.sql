--select * from tbl_Location
select distinct tjs.TechCode 
into #FailedQCTechs
from tbl_RevisedQC_QCMaster q inner join tbl_Data_Job_Setup tjs on q.WONumber = tjs.WONumber where
q.InspectDate >= '04/28/2010'
and
q.InspectDate <= '05/11/2010'
and
q.OverallScore = 'FAIL'
and tjs.TechCode in (

select tjs.TechCode
,tts.TechName, ttsSup.TechName as Supervisor , COUNT(q.WONumber) as QCCount 
--into #QC
from tbl_Data_Job_Setup tjs
--inner join  tbl_QCSchedule qcs on tjs.WONumber = qcs.WOToQC
left join tbl_RevisedQC_QCMaster q on tjs.WONumber = q.WONumber
inner join tbl_TechToLocation ttl on tjs.TechCode = ttl.techcode
inner join tbl_TechToLocation ttlSup on ttl.location_id = ttlSup.location_id
inner join tbl_TechtoSupervisor ttsSup on ttlSup.techcode = ttsSup.TechCode and ttsSup.TechCode in (select techcode from tbl_TechtoSupervisor where techcode = Supervisor and techcode <> 'jackb')
inner join tbl_TechtoSupervisor tts on tjs.TechCode = tts.TechCode

where
/*tjs.TechCode = '3103'
and*/
q.InspectDate >= '04/28/2010'
and
q.InspectDate <= '05/14/2010'
and
tjs.TechCode not like '5%' and tjs.TechCode not like '6%' and tjs.TechCode not in (select userid from login where type = 'f')
group by tjs.TechCode , tts.TechName , ttsSup.TechName  having count(q.WONumber) <  3  
order by ttsSup.TechName
)

drop table #points

select q.TechCode , SUM(isnull(tjs.WorkUnits, 0 )) as Points
into #points
 from 
#QC q
left join tbl_Data_Job_Setup tjs on q.TechCode = tjs.TechCode
where
(tjs.CSGLastChangedDate >='05/05/2010'
and
tjs.CSGLastChangedDate <='05/11/2010')
group by q.TechCode

insert into #points
select q.TechCode , SUM(isnull(iwo.Points , 0 ))  as Points from 
#QC q
left join InternalWorkOrder iwo on q.TechCode = iwo.TechCode
where
(iwo.LastupdatedDt >='05/05/2010'
and
iwo.LastupdatedDt <='05/11/2010')
group by q.TechCode


insert into #points
select q.TechCode , SUM(isnull(a.value , 0 ))  as Points from 
#QC q
left join tbl_HourlyInvoiceMaster him on q.TechCode = him.TechCode
left join tbl_InvoiceToPayrollParametersAdditionsDeductions a on him.InvoiceId = a.InvoiceId
where
him.WeekBeginningDate = '05/05/2010'
group by q.TechCode


select TechCode , SUM(points) from #points
group by TechCode having SUM(points) >= 250


select 
distinct him.TechCode , tts.TechName , tts.Supervisor , ttsSup.TechName as SupervisorName
from 
tbl_HourlyInvoiceMaster him 
inner join tbl_TechtoSupervisor tts on him.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on tts.Supervisor = ttsSup.TechCode
where
(him.WeekBeginningDate = '04/28/2010'
or
him.WeekBeginningDate = '05/05/2010')
and
him.TechCode not in (select tjs.techcode from tbl_RevisedQC_QCMaster q inner join tbl_Data_Job_Setup tjs on q.WONumber = tjs.WONumber where
q.InspectDate >='04/28/2010' and q.InspectDate <='05/11/2010')
and
him.TechCode not like '5%' and him.TechCode not in (select userid from login where type in ('f' , 's'))
and 
him.TechCode not in ('3049','3893','4259','4508','4519','4561','4661')
order by ttsSup.TechName asc



/*Reverification

select * from tbl_RevisedQC_QCMaster q
inner join tbl_Data_Job_Setup tjs on q.WONumber = tjs.WONumber
where
tjs.TechCode = '4582'
and
q.InspectDate >= '04/28/2010'
and
q.InspectDate <='05/11/2010'

select
*
from tbl_Data_Job_Setup where 
TechCode = '4582'
and
CSGLastChangedDate >='04/28/2010'
and
CSGLastChangedDate <='05/11/2010'
and CSGStatus = 'C'

*/