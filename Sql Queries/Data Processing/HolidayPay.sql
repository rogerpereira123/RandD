declare @HolidayDate date = '09/02/2013'
declare @PerJobAmount float = 10.0

declare @Jobs table ( TechCode varchar(20) , TechName varchar(200) , TotalJobs int)
insert into @Jobs
exec usp_getTechCompletedJobsReportForPayroll @HolidayDate , @HolidayDate



insert into tbl_HourlyInvoiceAdditionalCharges
select
him.InvoiceId , pc.PayrollCode , TotalJobs * @PerJobAmount , 'HOLIDAY PAY FOR JOBS COMPLETED ON 09/02/2013 (Labor Day). JOBS COMPLETED = ' + rtrim(ltrim(str(j.TotalJobs))) , 0
from
@Jobs j 
inner join tbl_HourlyInvoiceMaster him on j.TechCode = him.TechCode,
tbl_InvoicePayrollCodes pc
where
him.WeekBeginningDate = dbo.udf_getLastWednesdayDate(@HolidayDate)
and pc.PayrollCodeDesc = 'Holiday Pay'
