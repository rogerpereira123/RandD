declare @PayrollStartDate date = '04/09/2014'
declare @PayrollEndDate date = dateadd(day , 13, @PayrollStartDate)

declare @TechCount table
(
	WarehouseName varchar(50),
	TotalTechs int,
	
	RedHatTrainers int,
	Tier0_Techs int
	
)

insert into @TechCount

select
WarehouseName , count(distinct him.TechCode) as NumberOfTechs , 0 , 0 
from tbl_HourlyInvoiceMaster him 
inner join TTSView tts on him.TechCode = tts.TechCode
where
(him.WeekBeginningDate = @PayrollStartDate
or
him.WeekEndingDate = @PayrollEndDate)
and tts.UserLevel in (3, 7)
group by tts.WarehouseName




update tc
set
tc.RedHatTrainers = tier.NumberOfTechs
from @TechCount tc
inner join 
(
select
 tts.WarehouseName , COUNT(distinct him.TechCode) as NumberOfTechs
from tbl_HourlyInvoiceMaster him 
inner join TTSView tts on him.TechCode = tts.TechCode
inner join tbl_User u on tts.TechCode = u.UserId
inner join tbl_Payroll_EmployeeToPayrollTier ept on ept.EmployeeId = u.EmployeeID
inner join tbl_Payroll_TierMaster tm on ept.TierId = tm.TierId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollMaster pm on pwm.PayrollId = pm.PayrollId
where 
(pwm.PayWeekStartDate = @PayrollStartDate or pwm.PayWeekEndDate = @PayrollEndDate)
and
 (him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
 and tm.TierName like 'RH%'
group by tts.WarehouseName ) as tier
on tc.WarehouseName = tier.WarehouseName

update tc
set
tc.Tier0_Techs = tier.NumberOfTechs
from @TechCount tc
inner join 
(
select
 tts.WarehouseName , COUNT(distinct him.TechCode) as NumberOfTechs
from tbl_HourlyInvoiceMaster him 
inner join TTSView tts on him.TechCode = tts.TechCode
inner join tbl_User u on tts.TechCode = u.UserId
inner join tbl_Payroll_EmployeeToPayrollTier ept on ept.EmployeeId = u.EmployeeID
inner join tbl_Payroll_TierMaster tm on ept.TierId = tm.TierId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollMaster pm on pwm.PayrollId = pm.PayrollId
where 
(@PayrollStartDate = pwm.PayWeekStartDate or pwm.PayWeekEndDate =@PayrollEndDate)
and
 (him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
 and tm.TierName = 'Tier 0'
group by tts.WarehouseName) as tier
on tc.WarehouseName = tier.WarehouseName


select tc.* , hh.TotalHours , hh.OTHours, j.TotalJobs, p.TotalPoints, tp.TotalPayroll , lr.LaborRevenue
from @TechCount tc 
inner join (select 
tts.WarehouseName,
sum(epe.PayrollElementValue) as TotalHours,
sum(case when epe.PayrollElementValue > 40 then epe.PayrollElementValue - 40 else 0 end) as OTHours
from tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements epe on epe.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollElementsMaster pem on epe.PayrollElementId = pem.PayrollElementId
inner join tbl_User u on epe.EmployeeId = u.EmployeeID
inner join TTSView tts on u.UserId = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and pem.PayrollElementDescription = 'Hours'
and u.Active = 1
group by tts.WarehouseName 
) hh on tc.WarehouseName = hh.WarehouseName 

inner join (select 
tts.WarehouseName,
sum(epe.PayrollElementValue) as TotalJobs
from tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements epe on epe.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollElementsMaster pem on epe.PayrollElementId = pem.PayrollElementId
inner join tbl_User u on epe.EmployeeId = u.EmployeeID
inner join TTSView tts on u.UserId = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and pem.PayrollElementDescription = 'Jobs'
and u.Active = 1
group by tts.WarehouseName 
) j on tc.WarehouseName = j.WarehouseName 

inner join (select 
tts.WarehouseName,
sum(epe.PayrollElementValue) as TotalPoints
from tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements epe on epe.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollElementsMaster pem on epe.PayrollElementId = pem.PayrollElementId
inner join tbl_User u on epe.EmployeeId = u.EmployeeID
inner join TTSView tts on u.UserId = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and pem.PayrollElementDescription = 'Points'
and u.Active = 1
group by tts.WarehouseName 
) p on tc.WarehouseName = p.WarehouseName 

inner join (select 
tts.WarehouseName,
sum(case when dbo.udf_Payroll_IsFirstWeekOfPayPeriod(pwm.PayWeekStartDate) = 1 then epe.PayrollElementValue else 0 end) as TotalPayroll
from tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements epe on epe.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollElementsMaster pem on epe.PayrollElementId = pem.PayrollElementId
inner join tbl_User u on epe.EmployeeId = u.EmployeeID
inner join TTSView tts on u.UserId = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and pem.PayrollElementDescription = 'Grand Total'
and u.Active = 1
group by tts.WarehouseName 
) tp on tc.WarehouseName = tp.WarehouseName 

inner join (
select tts.WarehouseName ,sum(dp.PaymentAmount) as LaborRevenue
		from 
		tbl_HourlyInvoiceMaster him 
		inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
		inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber
		inner join tbl_DishPayment dp on tjs.WONumber = dp.WONumber
		inner join TTSView tts on him.TechCode = tts.TechCode
		where
		(him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
		and dp.TaskType = 'L'
		group by tts.WarehouseName) lr on tc.WarehouseName = lr.WarehouseName


order by tc.WarehouseName