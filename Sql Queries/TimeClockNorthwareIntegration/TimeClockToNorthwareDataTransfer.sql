--Step 1 No Of Days to go back to get the changed  /entered times from timeclock
declare @NoOfDaysToGoBack int
set @NoOfDaysToGoBack = 3
--Step 1 Complete

--Step 2 Find out the current payweek Start Date and End Date
declare @PayrollWeekStartDate datetime
set @PayrollWeekStartDate = convert(varchar(10), getdate(), 101)
while not datename (dw, @PayrollWeekStartDate) = 'Wednesday'
begin
set @PayrollWeekStartDate = @PayrollWeekStartDate - 1
end
declare @PayrollWeekEndDate datetime
set @PayrollWeekEndDate = convert(varchar(10), getdate(), 101)
while not datename (dw, @PayrollWeekEndDate) = 'Tuesday'
begin
set @PayrollWeekEndDate = @PayrollWeekEndDate + 1
end

declare @PreviousPayrollWeekStartDate datetime
set @PreviousPayrollWeekStartDate = @PayrollWeekStartDate - 7
declare @PreviousPayrollWeekEnddate datetime
set @PreviousPayrollWeekEndDate = @PayrollWeekEndDate - 7

--Step 2 Complete

--step 3 Import timeclock data into a temporary table
declare @TimeClockHours table
(
SrNo int identity,
RecordId bigint,
TechCode varchar(4),
Date datetime,
StartTime varchar(5),
EndTime varchar(5),
Description varchar(100) 
)
declare @CurrentUTCDatetime datetime
set @CurrentUTCDatetime = convert(varchar(10),getutcdate() ,101)
insert into @TimeClockHours
select 
--Record Id
timeclock.RecordId,
--Tech Code
substring(convert(varchar(10) , timeclock.employeeid) , 2 , LEN(convert(varchar(10) , timeclock.employeeid))) as TechCode,  
--Date
CONVERT(varchar(10) , timeclock.TimeIn , 101),
--Start Time
convert(varchar(5) ,timeclock.TimeIn, 8),
--End Time
convert(varchar(5) ,timeclock.TimeOut, 8),
--Description,
'Added By TimeClock on ' + convert(varchar(50) , GETDATE(), 100)
from 
[milohsrv03\sqlexpress].[timeclockplus].[dbo].[employeehours] timeclock
where
timeclock.employeeid > 90000
and
timeclock.employeeid < 100000
and
timeclock.utcdatemodified >  @CurrentUTCDatetime - @NoOfDaysToGoBack
and
timeclock.utcdatemodified <= @CurrentUTCDatetime
and
timeclock.timeout is not null
and
timeclock.timein is not null
order by TechCode
--Step 3 Complete


--Step 4 Add Hours/ Jobs to invoices
declare @InvoiceId1 varchar(50)
declare @SrNo int
declare @RecordId bigint
declare @TechCode1 varchar(10)
declare @Date1 datetime
declare @StartTime varchar(5)
declare @EndTime varchar(5)
declare @Description varchar(100) 
declare @InvoiceStatus varchar(20)
declare @CreateDate1 varchar(10)
declare @InvoiceHoursId1 varchar(50)
while exists(select * from @TimeClockHours)
begin
select top 1 @SrNo =  SrNo,@RecordId = RecordId, @TechCode1 = TechCode , @Date1 = DATE, @StartTime = StartTime , @EndTime = EndTime , @Description = Description from @TimeClockHours
	if(not(@Date1 >= @PreviousPayrollWeekStartDate and @Date1 <= @PreviousPayrollWeekEnddate) and exists(select * from tbl_HourlyInvoiceMaster where WeekBeginningDate = @PayrollWeekStartDate and WeekEndingDate = @PayrollWeekEndDate and TechCode = @TechCode1))
	begin
		set @InvoiceId1 = (select InvoiceId from tbl_HourlyInvoiceMaster where WeekBeginningDate = @PayrollWeekStartDate and WeekEndingDate = @PayrollWeekEndDate and TechCode = @TechCode1)
	end
	else if(@Date1 >= @PreviousPayrollWeekStartDate and @Date1 <= @PreviousPayrollWeekEnddate)
	begin
		if(exists(select * from tbl_HourlyInvoiceMaster where WeekBeginningDate = @PreviousPayrollWeekStartDate and WeekEndingDate = @PreviousPayrollWeekEnddate and TechCode = @TechCode1))
		begin
			set @InvoiceId1 = (select InvoiceId from tbl_HourlyInvoiceMaster where WeekBeginningDate = @PreviousPayrollWeekStartDate and WeekEndingDate = @PreviousPayrollWeekEnddate and TechCode = @TechCode1)
		end
		else
		begin
			set @CreateDate1 = CONVERT(varchar(10) , getdate() , 101)
			select @InvoiceId1 = dbo.usp_getHourlyInvoiceId(@TechCode1 , @CreateDate1)
			set @InvoiceStatus = '0111'
			exec dbo.usp_insHourlyInvoice @InvoiceId = @InvoiceId1 , @TechCode = @TechCode1, @CreateDate = @CreateDate1, @WeekBeginningDate = @PreviousPayrollWeekStartDate , @WeekEndingDate = @PreviousPayrollWeekEnddate , @InvoiceClassId = '', @LastUser = 'TimeClock' ,@LastModifiedDate = @CreateDate1,@InvoiceStatusId = @InvoiceStatus , @InvoiceClosedDate =null
		end
	end
	else
	begin
		set @CreateDate1 = CONVERT(varchar(10) , getdate() , 101)
		select @InvoiceId1 = dbo.usp_getHourlyInvoiceId(@TechCode1 , @CreateDate1)
		set @InvoiceStatus = '0111'
		exec dbo.usp_insHourlyInvoice  @InvoiceId = @InvoiceId1 , @TechCode = @TechCode1, @CreateDate = @CreateDate1, @WeekBeginningDate = @PayrollWeekStartDate , @WeekEndingDate = @PayrollWeekEndDate , @InvoiceClassId = '', @LastUser = 'TimeClock' ,@LastModifiedDate = @CreateDate1,@InvoiceStatusId = @InvoiceStatus , @InvoiceClosedDate = null
	end
	--Update Completed jobs in invoice for today
	insert into tbl_HourlyInvoiceLine
	select tjs.WONumber , @InvoiceId1 , '00' , '00', null , null , null
	from tbl_data_job_setup tjs
	left join tbl_HourlyInvoiceline hil on tjs.wonumber = hil.wonumber
	where
	tjs.CSGLastChangedDate =@Date1
	and
	tjs.CSGStatus = 'C'
	and
	tjs.TechCode = @TechCode1
	and
	hil.WONumber is null
	
	insert into tbl_HourlyInvoiceLine
	select tjs.WONumber , @InvoiceId1 , '00' , '00', null , null , null
	from InternalWorkOrder tjs
	left join tbl_HourlyInvoiceline hil on tjs.wonumber = hil.wonumber
	where
	tjs.LastupdatedDt = @Date1
	and
	tjs.Status = 'C'
	and
	tjs.TechCode = @TechCode1
	and
	hil.WONumber is null
	
		
	--Update Hours
		
	exec dbo.usp_insHourlyInvoiceHoursMaster @InvoiceId = @InvoiceId1, @Date = @Date1 , @InvoiceHoursId = @InvoiceHoursId1 out
		
	if(not exists(select * from tbl_HourlyInvoiceHoursLine where TimeDescriptionId = @RecordId))
	begin
		insert into tbl_HourlyInvoiceHoursLine values(@InvoiceHoursId1 , @StartTime , @EndTime , @RecordId , @Description)
	end
	else
	begin
		update tbl_HourlyInvoiceHoursLine set StartTime = @StartTime , EndTime = @EndTime , OtherDescription = @Description, InvoiceHoursId = @InvoiceHoursId1
		where
		TimeDescriptionId = @RecordId
	end
	delete from @TimeClockHours where SrNo = @SrNo
end
--Step 4 Complete


