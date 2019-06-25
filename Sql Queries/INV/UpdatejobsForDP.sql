update tbl_data_job_setup set CSGLastChangedDate = '01/29/2008' where wonumber in
(
select tjs.WoNumber/* , tjs.ScheduledDate , tjs.CSGLastChangedDate , tjs.CSGStatus , tw.Clock_Out*/
from tbl_data_job_setup tjs
inner join tbl_WoTimes tw on tjs.WoNumber= tw.WoNumber
where
ScheduledDate >= '01/23/2008'
and
ScheduledDate <= '01/29/2008'
and
CSGStatus in ('C' , 'D')
and
CSGLastChangedDate > '01/29/2008')


update internalworkorder set LastUpdatedDt = '01/29/2008' where wonumber in
(
select iwo.WoNumber/* , tjs.ScheduledDate , tjs.CSGLastChangedDate , tjs.CSGStatus , tw.Clock_Out*/
from InternalWorkOrder iwo
inner join tbl_WoTimes tw on iwo.WoNumber= tw.WoNumber
where
ScheduledDate >= '01/23/2008'
and
ScheduledDate <= '01/29/2008'
and
Status in ('C' , 'D')
and
LastUpdatedDt > '01/29/2008')


--Find Sunday Jobs
select tjs.WoNumber/* , tjs.ScheduledDate , tjs.CSGLastChangedDate , tjs.CSGStatus , tw.Clock_Out*/
from tbl_data_job_setup tjs
inner join tbl_WoTimes tw on tjs.WoNumber= tw.WoNumber
where
ScheduledDate = '01/27/2008'
and
CSGStatus in ('C' , 'D')
and
CSGLastChangedDate = '01/29/2008'


update tbl_data_job_setup set CSGLastChangedDate = '01/27/2008' where 
wonumber in 
(select tjs.WoNumber/* , tjs.ScheduledDate , tjs.CSGLastChangedDate , tjs.CSGStatus , tw.Clock_Out*/
from tbl_data_job_setup tjs
inner join tbl_WoTimes tw on tjs.WoNumber= tw.WoNumber
--inner join tbl_InvoiceLine il on tjs.WoNumber = il.WoNumber
where
ScheduledDate = '01/27/2008'
and
CSGStatus in ('C' , 'D')

)

delete from tbl_InvoiceLine where WoNumber = '44102611800014012'