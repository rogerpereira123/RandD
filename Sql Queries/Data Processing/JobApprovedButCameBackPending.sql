select tjs.WoNumber ,IM.TechCode , IM.WeekBeginningDate , IM.WeekEndingDate, tdc.Name as CustomerName,  tzs.Supervisor , tts.techName as 'SupervisorName' , ILP.Date as 'Date Pended' , tmr.ReasonDesc as Reason  ,  ILP.OtherReason , ILP.UserId 
from tbl_data_job_setup tjs
left outer join tbl_InvoiceLine IL on tjs.WoNumber = IL.WoNumber
left outer join tbl_InvoiceMaster IM on IL.InvoiceId = IM.InvoiceId
left outer join tbl_InvoiceLineToPending ILP on IL.InvoicelineId = ILP.InvoiceLineId
inner join tbl_Master_Reason tmr on ILP.ReasonId = tmr.ReasonId
inner join tbl_ZipToSupervisor tzs on tjs.CustomerZip = tzs.ZipCode
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_TechToSupervisor tts on tzs.Supervisor = tts.TechCode
where
tjs.CSGLastChangedDate >= '02/06/2008'
and
tjs.CSGLastChangedDate <= '02/19/2008'
and
tjs.CSGLastChangedDate <> tjs.ScheduledDate
and
IL.ApprovalStatus = '01'
and
IL.PayStatus = '00'
order by tzs.Supervisor

