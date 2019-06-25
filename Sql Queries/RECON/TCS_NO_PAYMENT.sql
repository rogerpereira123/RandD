
declare @startDate date = '01/01/2013'
declare @enddate date = '01/31/2013'

select
sum(case when a.AmountPaid < 100 then 1 else 0 end) as [TC/SC Not Paid]

from
tbl_Data_Job_Setup tjs
inner join (
select WONumber, SUM(rminner.ApprovedAmount) as AmountPaid
from tbl_ReconMaster rminner where rminner.RecordTypeId='L' group by rminner.WONumber 
) as a on a.WONumber = tjs.WONumber
where
tjs.CSGStatus = 'C'
and tjs.CSGLastChangedDate >= @startDate
and tjs.CSGLastChangedDate <= @enddate
and tjs.WorkorderType in ('TC' ,'SC')



--group by rm.WONumber


select
COUNT(tjs.WONumber)
from
tbl_Data_Job_Setup tjs
where
tjs.CSGStatus = 'C'
and tjs.CSGLastChangedDate >= @startDate
and tjs.CSGLastChangedDate <= @enddate
--and tjs.WorkorderType in ('TC' ,'SC')
