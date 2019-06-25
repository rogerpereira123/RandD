


declare @TechCode varchar(10) = '%'
declare @TechName varchar(500) = ''
declare @PayrollStartDate date = '09/25/2013'
declare @PayrollEndDate date = dateadd(day, 13, @PayrollStartDate)
declare @PayrollRunDate date= dateadd(day , 21 , @PayrollStartDate)
declare @QuarterStartDate date = '04/01/2013'
declare @QuarterEndDate date = '06/30/2013'
declare @Week1StartDate date = @PayrollStartDate
declare @Week1EndDate date = dateadd(day , 6 , @Week1StartDate)

declare @Week2StartDate date = dateadd(day , 7 , @Week1StartDate)
declare @Week2EndDate date = dateadd(day , 6 , @Week2StartDate)

declare @TC12StartDateWeek1 date = dateadd(day, -27 , dateadd(day , -1 ,@Week1StartDate))
declare @Tc12EndDateWeek1 date = dateadd(day , -1 ,@Week1StartDate)
declare @TC12StartDateWeek2 date = dateadd(day, -27 , dateadd(day , -1 ,@Week2StartDate))
declare @Tc12EndDateWeek2 date = dateadd(day , -1 ,@Week2StartDate)
declare @PerPointRateWeek1 float = 0
declare @PerPointRateWeek2 float = 0
declare @ROuteDate varchar(10)
declare @HireDate varchar(10)

 
declare @Techs table (TechCode  varchar(20) , TechName varchar(500) , RouteDate varchar(10) , HireDate varchar(10))


insert into @Techs 
select distinct him.TechCode , tde.Firstname + ',' + tde.Lastname , isnull(convert(varchar(10),tde.OnFieldStartDate,101),'') , isnull(convert(varchar(10),tde.HireDate,101),'')  from tbl_HourlyInvoiceMaster him
inner join tbl_User u on him.TechCode = u.UserId
 inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID   where (WeekBeginningDate = @PayrollStartDate or WeekEndingDate = @PayrollEndDate)
 and u.UserLevel = 3 and u.UserId like @TechCode 
 --and (DATEDIFF(day, tde.OnFieldStartDate , @PayrollStartDate) >= 180 or isnull(tde.OnFieldStartDate,'') = '')


declare @Output table
(
TechCode varchar(20),
TechName varchar(500),
HireDate varchar(10),
RouteDate varchar(10),
Tier int,
YearlyRaise decimal(18,2), 
TC12Week1 decimal(18,2),
TC12Week2 decimal(18,2),
TC30 decimal(18,2),
PPH decimal(18,2),
CSAT decimal(18,2),
PerPointRateWeek1 decimal(18,2),
PerPointRateWeek2 decimal(18,2),
Week1Hours decimal(18,2),
Week1Points int,
Week2Hours decimal(18,2),
Week2Points int,
BasePayWeek1 decimal(18,2),
AdditionsWeek1 decimal(18,2),
OvertimeWeek1 decimal(18,2),
BasePayWeek2 decimal(18,2),
AdditionsWeek2 decimal(18,2),
OvertimeWeek2 decimal(18,2),
GrandTotal decimal(18,2)

)


declare @Week1Hours table (
InvoiceHoursId varchar(50),
InvoiceId varchar(50),
Date date,
SrNo bigint,
StartTime time,
EndTime time,
TimeDescriptionId int,
TimeDescription varchar(50),
OtherDescription varchar(200)
)
declare @Week2Hours table (
InvoiceHoursId varchar(50),
InvoiceId varchar(50),
Date date,
SrNo bigint,
StartTime time,
EndTime time,
TimeDescriptionId int,
TimeDescription varchar(50),
OtherDescription varchar(200)
)


while(exists(select * from @Techs))
begin

select top 1 @TechCode = TechCode , @TechName = TechName, @ROuteDate = RouteDate, @HireDate = HireDate from @Techs




insert into @Week1Hours
exec usp_GetHourlyInvoiceHours @TechCode , @Week1StartDate,@Week1EndDate


insert into @Week2Hours
exec usp_GetHourlyInvoiceHours @TechCode , @Week2StartDate,@Week2EndDate

declare @Week1TotalHours decimal(18,4) = 
(select isnull(sum(DATEDIFF(minute , StartTime, EndTime) / 60.0) , 0) from @Week1Hours )
declare @Week2TotalHours decimal(18,4) = 
(select isnull(sum(DATEDIFF(minute , StartTime, EndTime) / 60.0) ,0) from @Week2Hours )

declare @TC12Week1 decimal(18,4) = 0
declare @TC12Week2 decimal(18,4) = 0
declare @TC30 decimal(18,4) = 0
declare @PPH decimal(18,4) = 0 
declare @CSAT decimal(18,4) = 0
declare @PointsWeek1 int=0
declare @PointsWeek2 int= 0

select @PointsWeek1 = TotalPoints from dbo.udf_GetPointsPerHourTable( @Week1StartDate , @Week1EndDate , @techCode )
select @PointsWeek2 = TotalPoints from dbo.udf_GetPointsPerHourTable( @Week2StartDate , @Week2EndDate , @techCode )

/****Addition Deduction Points*****/
select 
@PointsWeek1 = @PointsWeek1 +  isnull(a.Value , 0)
from tbl_HourlyInvoiceMaster him 
inner join tbl_InvoiceToPayrollParametersAdditionsDeductions a on him.InvoiceId = a.InvoiceId
where
him.TechCode = @TechCode
and him.WeekBeginningDate = @Week1StartDate
and a.Type = 'POINTS' 
and a.Value > 0 

select 
@PointsWeek2 = @PointsWeek2 +  isnull(a.Value , 0)
from tbl_HourlyInvoiceMaster him 
inner join tbl_InvoiceToPayrollParametersAdditionsDeductions a on him.InvoiceId = a.InvoiceId
where
him.TechCode = @TechCode
and him.WeekBeginningDate = @Week2StartDate
and a.Type = 'POINTS'
and a.Value > 0

if(@PointsWeek1 < 0) set @PointsWeek1 = 0
if(@PointsWeek2 < 0) set @PointsWeek2 = 0


--TC30 Including Internal
exec usp_GetTCJobs_LastEventBased_Output_Numbers 30 , @QuarterStartDate , @QuarterEndDate , @techCode , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0 ,0 , @TC30 out

--TC12 NOT Including internal
exec usp_GetTCJobs_LastEventBased_Output_Numbers 12 , @TC12StartDateWeek1 , @Tc12EndDateWeek1 , @techCode , 1 , 0 , 0 , 0 , @TC12Week1 out , 0 , 0 , 0, 0 ,0 , 0 
exec usp_GetTCJobs_LastEventBased_Output_Numbers 12 , @TC12StartDateWeek2 , @Tc12EndDateWeek2 , @techCode , 1 , 0 , 0 , 0 , @TC12Week2 out , 0 , 0 , 0, 0 ,0 , 0 


select @PPH = PPH from dbo.udf_GetPointsPerHourTable( @QuarterStartDate , @QuarterEndDate , @techCode )



select @CSAT =  dbo.udf_GetCSATScoreScalar(@QuarterStartDate , @QuarterEndDate , @techCode)


/*****************************/

declare @Tier int

if(@TC30 <= 6)
begin
	if(@CSAT >= 9.70)
	begin
			if(@PPH >= 7.50) set @Tier = 6
			else if(@PPH >= 7) set @Tier = 5
			else if(@PPH >= 6.5) set @Tier = 4
			else if(@PPH >= 6) set @Tier = 3
			else if(@PPH >= 5.5) set @Tier =2
			else set @Tier = 1
	end
	else
	begin
		set @Tier = 1
	end
end
else
begin
	set @Tier = 1
end

if(@ROuteDate <> '')
begin
	if(CONVERT(date, @RouteDate) >= @QuarterStartDate)
	begin
		set @Tier = 0 --Probationary Period Tier
	end
end

if(@Tier = 0)
begin 
	set @PerPointRateWeek1 = 3.00
	set @PerPointRateWeek2 = 3.00
end
if(@Tier = 1)
begin 
	set @PerPointRateWeek1 = 1.67
	set @PerPointRateWeek2 = 1.67
end
if(@Tier = 2 )
begin
	 set @PerPointRateWeek1 = 2.00
	 set @PerPointRateWeek2 = 2.00
end
if(@Tier = 3) 
begin
	set @PerPointRateWeek1 = 2.17
	set @PerPointRateWeek2 = 2.17
end
if(@Tier = 4) 
begin
	set @PerPointRateWeek1 = 2.34
	set @PerPointRateWeek2 = 2.34
end
if(@Tier = 5) 
begin
	set @PerPointRateWeek1 = 2.67
	set @PerPointRateWeek2 = 2.67
end
if(@Tier = 6) 
begin
	set @PerPointRateWeek1 = 3.00
	set @PerPointRateWeek2 = 3.00
end

declare @yearlyraise decimal(18,4) = 0
set @yearlyraise = (select dbo.udf_getPerPointRaiseOnEmployeeAge(@TechCode , 0.05 , @PayrollRunDate)) 
set @PerPointRateWeek1 = @PerPointRateWeek1 +  @yearlyraise
set @PerPointRateWeek2 = @PerPointRateWeek2 +  @yearlyraise

if(@Tier >= 2)
begin
	if(@TC12Week1 <= 4)
		set @PerPointRateWeek1 = @PerPointRateWeek1 + 0.25
	if(@TC12Week2 <= 4)
		set @PerPointRateWeek2 = @PerPointRateWeek2 + 0.25
end


/*****************************/

declare @Week1Additions decimal(18,4) = (
select 
isnull(sum(apc.Amount) , 0)
from tbl_HourlyInvoiceMaster m 
inner join tbl_HourlyInvoiceAdditionalCharges apc on m.InvoiceId = apc.InvoiceId
inner join tbl_InvoicePayrollCodes pc on apc.InvoicePayrollCode = pc.PayrollCode
where 
pc.PayrollCodeType = 'EARNING'
and m.TechCode = @TechCode and m.WeekBeginningDate = @Week1StartDate)

declare @Week2Additions decimal(18,4) = (
select 
isnull(sum(apc.Amount) , 0)
from tbl_HourlyInvoiceMaster m 
inner join tbl_HourlyInvoiceAdditionalCharges apc on m.InvoiceId = apc.InvoiceId
inner join tbl_InvoicePayrollCodes pc on apc.InvoicePayrollCode = pc.PayrollCode
where 
pc.PayrollCodeType = 'EARNING'
and m.TechCode = @TechCode and m.WeekBeginningDate = @Week2StartDate)


declare @BasePayWeek1 decimal(18,4) = 0
declare @OvertimeWeek1 decimal(18,4) = 0

declare @BasePayWeek2 decimal(18,4) = 0
declare @OvertimeWeek2 decimal(18,4) = 0

select @BasePayWeek1 = BasePay , @OvertimeWeek1 = Overtime from dbo.udf_getBasePayOvertimeForWeekPointsMethod(@PointsWeek1 ,  @Week1TotalHours, @PerPointRateWeek1 , @Week1Additions)
select @BasePayWeek2 = BasePay , @OvertimeWeek2 = Overtime from dbo.udf_getBasePayOvertimeForWeekPointsMethod(@PointsWeek2 ,	@Week2TotalHours , @PerPointRateWeek2 , @Week2Additions)

insert into @Output
select @TechCode ,@TechName,@HireDate, @ROuteDate,  @Tier, @yearlyraise, @TC12Week1 , @TC12Week2, @TC30 , round(@PPH,2) , round(@CSAT,2) , round(@PerPointRateWeek1,2) , round(@PerPointRateWeek2,2),
round(@Week1TotalHours,2), round(@PointsWeek1,2) , round(@Week2TotalHours,2) , @PointsWeek2, 
round(@BasePayWeek1,2)  , @Week1Additions , round(@OvertimeWeek1,2) ,  round(@BasePayWeek2,2) , @Week2Additions,round(@OvertimeWeek2,2) , round((@BasePayWeek1  + @OvertimeWeek1 + @BasePayWeek2  + @OvertimeWeek2) , 2)


delete from @Week1Hours
delete from @Week2Hours
delete from @Techs where TechCode = @TechCode


end
select o.*,tpd.GrandTotal as CurrentPayrollTotal  from @Output o 
left join tbl_TechPayrollDetails tpd on o.TechCode = tpd.TechCode where tpd.PayrollStartDate = @PayrollStartDate order by o.GrandTotal desc, Tier desc


