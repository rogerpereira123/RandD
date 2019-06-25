declare @EmployeeNumber bigint = 7368
declare @Date date = '02/19/2014'
declare @StartTime varchar(5) ='08:00' 
declare @EndTime varchar(5) = '14:13' 
declare @UpdateIfExists bit = 0

declare @InvoiceId varchar(50) = (select TraineeInvoiceId from tbl_HourlyTraineeInvoiceMaster where EmployeeNumber = @EmployeeNumber and @Date >= WeekBeginningDate and @Date <= WeekEndingDate)

if(@InvoiceId is null or @InvoiceId = '')
begin
	select 'Invoice id is null / blank'
	return
end
if(exists(select * from tbl_HourlyInvoiceHoursMaster where Date = @Date and InvoiceId = @InvoiceId))
begin
 if(@UpdateIfExists = 0)
 begin
		select 'Hours for this date are already present'
		select hihm.Date, hihl.StartTime , hihl.EndTime from tbl_HourlyInvoiceHoursMaster hihm inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
		where hihm.Date = @Date and InvoiceId = @InvoiceId
		return 
 end
 else 
 begin
	if((select count(hihm.InvoiceId) from tbl_HourlyInvoiceHoursMaster hihm inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
		where hihm.Date = @Date and InvoiceId = @InvoiceId) > 1)
		begin
			select 'Multiple times found for the same day'
		end
	else
	begin
		update hihl set StartTime = @StartTime , EndTime = @EndTime from tbl_HourlyInvoiceHoursMaster hihm inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
		where hihm.Date = @Date and InvoiceId = @InvoiceId
		
		select 'Times updates successfully'
		return
		
	end
 end
end


declare @InvoiceHoursId varchar(50)
exec usp_insHourlyInvoiceHoursMaster  @InvoiceId,@Date , @InvoiceHoursId out  
exec usp_insHourlyInvoiceHoursLine 0 , @InvoiceHoursId , @StartTime , @EndTime , 0 , 'Added Manually On Laura Request'


update tbl_OutTechClockIn set InvoiceHoursId = @InvoiceHoursId where TechCode = '7'+ rtrim(ltrim(str(@EmployeeNumber))) and converT(date, ClockIn) = @Date and InvoiceHoursId = ''




