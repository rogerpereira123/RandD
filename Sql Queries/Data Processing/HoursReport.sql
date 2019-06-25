select
HIM.TechCode ,HIHM.Date, HIHL.StartTime, HIHL.EndTime  from 
tbl_HourlyInvoiceMaster HIM
inner join tbl_HourlyInvoiceHoursMaster HIHM on HIM.InvoiceId = HIHM.InvoiceId
inner join tbl_HourlyInvoiceHoursLine HIHL on HIHM.InvoiceHoursId = HIHL.InvoiceHoursId
inner join tbl_TechTolocation ttl on HIM.TechCode = ttl.TechCode
where
ttl.Location_Id = '008'
and
HIHM.Date >= '11/18/2009'
and
HIHM.Date <= '11/22/2009'
order by HIM.techcode,HIHM.Date
