select distinct IL.WoNumber, tjs.TechCode , tr.Name as ProductName, tr.SerialNumber, tr.TrackingNumber, tr.SmartCardNumber , tr.dishRANumber
from tbl_InvoiceLine IL
inner join tbl_data_job_setup tjs on IL.WONumber = tjs.WoNumber
inner join tbl_raed tr on tjs.jobId = tr.JobId
where
IL.ApprovalStatus = '11'
and
tr.IsReceived = 0
