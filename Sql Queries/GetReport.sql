select b.phone,a.WONumber,a.TechCode,a.ScheduledDate,a.JobType,a.CustomerZip,a.WorkorderType  from tbl_data_job_setup a,tbl_data_customers b where convert(char(8),convert(char(8), a.ScheduledDate,10),10) >= convert(char(8),convert(char(8), getdate(),10),10) and (a.ServiceCodes like '%UE%' or a.ServiceCodes = '%ue%') and a.CSGStatus = 'O' and b.customerid = a.customerid order by a.ScheduledDate asc


