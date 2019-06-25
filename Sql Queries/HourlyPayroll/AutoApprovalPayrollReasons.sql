declare @PayrollStartDate date = '07/31/2013'
declare @PayrollEndDate date = '08/06/2013'
declare @Reason varchar(2000) = 'Equipment closed in Northware but not paid by Dish.'

select 
case when  charindex('Another job for the same customer found', hilc.Comments ,  1) = 0 then hilc.Comments else
substring(hilc.Comments, 0, charindex('Another job for the same customer found', hilc.Comments ,  1)  -1 ) end as Reason
, COUNT(hilc.WONumber) JobsCount
from tbl_HourlyInvoiceLineComments hilc 
inner join tbl_HourlyInvoiceLine hil on hil.WoNumber = hilc.WoNumber
inner join tbl_HourlyInvoiceMaster him on hil.InvoiceId =  him.InvoiceId
inner join tbl_User u on him.TechCode = u.UserId

where hilc.UserId = 'AutoApprovalProcess'
and (him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
and u.UserLevel = 3 
group by 
case when  charindex('Another job for the same customer found', hilc.Comments ,  1) = 0 then hilc.Comments else
substring(hilc.Comments, 0, charindex('Another job for the same customer found', hilc.Comments ,  1) - 1)  end
order by COUNT(hil.WONumber) desc


select w.WarehouseName,  hilc.* , tjs.TechCode, tjs.WorkorderType , tjs.CSGLastChangedDate as ClosedDate from 
tbl_HourlyInvoiceLineComments hilc
inner join  tbl_Data_Job_Setup tjs on hilc.WoNumber = tjs.WONumber
inner join tbl_HourlyInvoiceLine hil on hil.WoNumber = hilc.WoNumber
inner join tbl_HourlyInvoiceMaster him on hil.InvoiceId =  him.InvoiceId
inner join IP2UView ip2v on tjs.TechCode = ip2v.UserId
inner join tbl_User u on ip2v.UserId = u.UserId
inner join tbl_Warehouse w on ip2v.InvParticipantId = w.InvParticipantId
where Comments like @Reason + '%'
and u.UserLevel = 3 and
hilc.UserId = 'AutoApprovalProcess'
and (him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
 
order by w.WarehouseName , tjs.TechCode, tjs.CSGLastChangedDate asc

