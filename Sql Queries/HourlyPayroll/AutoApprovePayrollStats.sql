declare @StartDate date = '08/07/2013'
declare @Enddate date = '08/11/2013'

select 
count(hil.WONumber ) as ApprovedJobs
from 
tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId 
inner join tbl_EventLog e on hil.WONumber = e.BasicKey
left join tbl_User u on isnull(hil.ApprovedBy , '') = u.UserId
inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber
where  tjs.CSGLastChangedDate between @StartDate and @Enddate  and e.UserId = 'AutoApprovalProcess' and e.UserRemark like '%auto approved%'
and u.UserId is null


select count(hil.wonumber) as TotalUntouchedJobs
from 
tbl_HourlyInvoiceMaster him 
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId  
left join tbl_User u on isnull(hil.ApprovedBy , '') = u.UserId
inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber

where  tjs.CSGLastChangedDate between @StartDate and @Enddate
and u.UserId is null