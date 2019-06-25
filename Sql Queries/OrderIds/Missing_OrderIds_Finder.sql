select
tjs.WONumber
from
tbl_Data_Job_Setup tjs
left join tbl_WorkOrderNumberToOrderId o on tjs.WONumber = o.WONumber
where o.OrderId is null and tjs.ScheduledDate >= '01/01/2012' and LEN(tjs.wonumber) =17
order by tjs.ScheduledDate desc