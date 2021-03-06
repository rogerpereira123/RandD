USE [Northware]
GO
/****** Object:  StoredProcedure [dbo].[usp_EConnectServiceAutodownloader]    Script Date: 12/28/2012 12:06:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[usp_EConnectServiceAutodownloader]
as
begin
Begin Tran AutoDownload
begin try

update
tbl_EConnectServiceAutodownload
set SCHEDULED_DATE = REPLACE(SCHEDULED_DATE , 'FIRST JOB' , 'AM')
where
SCHEDULED_DATE like '%FIRST%'

-------------------------------------------------Step 1 : Update Temp Table----------------------------------------------------------------------------
UPDATE    tbl_EConnectServiceAutodownload
SET            customerid
=  tbl_data_Customers.customerID
FROM         tbl_EConnectServiceAutodownload, 
tbl_data_Customers
WHERE    tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER
=  tbl_data_Customers.accountno
and
tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER not like '99999%'
and
tbl_Data_Customers.ACCOUNTNO not like '9999%'



---This is done to handle the scenario
--Unmasked Customer In Northware - Masked New Job Downloaded
---SUb Scenarios --> Unmasked Customer In Northware - Unmasked Work Order Gets Downloaded
UPDATE    tbl_Data_Job_Setup
SET            customerid
=  tbl_data_Customers.customerID
FROM         tbl_EConnectServiceAutodownload, 
tbl_data_Customers
WHERE    tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER
=  tbl_data_Customers.accountno 
and
tbl_Data_Job_Setup.WONumber = tbl_EConnectServiceAutodownload.WORK_ORDER_NUMBER
and
tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER not like '99999%'
and
tbl_Data_Customers.ACCOUNTNO not like '9999%'

--Changes After Masking In effect ....
update download 
	set CustomerId  = tjs.CustomerID,
	JobId = tjs.JobID
	from tbl_EConnectServiceAutodownload as download 
	inner join tbl_Data_Job_Setup tjs on download.WORK_ORDER_NUMBER = tjs.WONumber
	inner join tbl_Data_Customers tdc on tdc.CUSTOMERID = tjs.CustomerID
	where (download.CSG_ACCT_NUMBER like '9999%' or tdc.ACCOUNTNO like '9999%') and download.CustomerId is null

-------------------------------------------------Step 1 : Update Temp Table----------------------------------------------------------------------------

-------------------------------------------------Step 2 : Update tmp_job Jobid----------------------------------------------------------------------------
--Updating WO type='CH' to 'SC' where WO category =2 and according to service code
update tbl_EConnectServiceAutodownload set WORK_ORDER_TYPE='SC' where WORK_ORDER_TYPE='CH' --and Category=2 
and (SERVICE_CODES like '%{W%' or SERVICE_CODES like '%}A%'  or SERVICE_CODES like '%M$%' or SERVICE_CODES like '%OL%' 
--per Evelyn on 08172010
or SERVICE_CODES like '%;$%')
--Victor did it 07/26/2010
--Updating WO type='CH' to 'NC' where WO category =2 and according to service code
--Changing again on 09/27/2011 after talking to payment support with Tammy
update tbl_EConnectServiceAutodownload set WORK_ORDER_TYPE='NC' where WORK_ORDER_TYPE='CH' and 
SERVICE_CODES like '%~G%' and  SERVICE_CODES like '%P2%'


UPDATE    tbl_EConnectServiceAutodownload
SET            jobid
= tbl_data_job_setup.jobid--, jobstatus= tbl_data_job_setup.jobstatus
FROM         tbl_EConnectServiceAutodownload, 
tbl_data_job_setup
WHERE     tbl_EConnectServiceAutodownload.WORK_ORDER_NUMBER
= tbl_data_job_setup.wonumber 
-------------------------------------------------Step 2 : Update tmp_job Jobid----------------------------------------------------------------------------

-------------------------------------------------Step 3 : Insert or Update Customer records----------------------------------------------------------------------------
exec sp_InsertUpdate_CustomerImported_new_WebService
-------------------------------------------------Step 3 : Insert or Update Customer records----------------------------------------------------------------------------

-------------------------------------------------Step 4 : Update customers States----------------------------------------------------------------------------
UPDATE  [tbl_data_customers]
SET [tbl_data_customers].state = [tbl_zipMAbranch].st
FROM [tbl_zipMAbranch] INNER JOIN [tbl_data_customers] ON [tbl_data_customers].zipcode =
[tbl_zipMAbranch].zipcode where tbl_data_customers.state is null
-------------------------------------------------Step 4 : Update customers States----------------------------------------------------------------------------



-------------------------------------------------Step 6 : Insert Update Imported jobs into tbl_data_jobs_setup----------------------------------------------------------------------------
exec sp_insertUpdate_jobsimported_new_WebService
-------------------------------------------------Step 6 : Insert Update Imported jobs into tbl_data_jobs_setup----------------------------------------------------------------------------

-------------------------------------------------Step 7 : Update branches----------------------------------------------------------------------------
exec update_ImportedJobs_Branch_MGTAReas_WebService
exec update_ImportedJobs_Branch_HEadquarters_WebService
-------------------------------------------------Step 7 : Update branches----------------------------------------------------------------------------

-------------------------------------------------Step 8 : Update Branch IDs----------------------------------------------------------------------------
exec update_branchid_importjobs_WebService
-------------------------------------------------Step 8 : Update Branch IDs----------------------------------------------------------------------------
end try
begin catch
	rollback tran AutoDownload
	declare @Subject varchar(500) = 'usp_EConnectServiceAutodownloader failed'
	declare @Body varchar(2000) = ''
	select @Body = ERROR_MESSAGE() 
	
	exec msdb.dbo.sp_send_dbmail @profile_name = 'DB_Mail',
		@recipients = '3304738594@vtext.com;roger@safe7.com',
		@body = @Body,
		@subject = @Subject;
		
	
	select 1
	return
	
end catch;

commit tran AutoDownload
end