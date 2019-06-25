--insert into tbl_daily_opportunities 
--select tjs.Scheduleddate,tjs.JobId,tjs.TechCode
update
tbl_data_job_setup
set 
WorkOrderType = 'NC'
where 
(ServiceCodes like '%78%' or ServiceCodes like '%?7%' or ServiceCodes like '%?R%')
and
WorkOrderType = 'CH'
