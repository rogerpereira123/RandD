
declare @PayrollStartDate date = '02/12/2014'
declare @PayrollEndDate date = dateadd(day, 13, @PayrollStartDate)


declare @Output table
(
Location varchar(100),
TechCode varchar(20),
TechName varchar(200),
Tier varchar(200),
Pay decimal(18,2),
Additions decimal(18,2),
TotalJobsCompleted int,
TCSCHWJobsCompleted int,
TotalLaborPaidNonTCSCJobs decimal(18,2),
TC60Count int
)

insert into @Output
select
distinct 
'',
TechCode ,
tts.TechName as Name,
'',
epe.PayrollElementValue ,
0,
0,
0,
0,
0
from tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements epe on epe.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollElementsMaster pem on epe.PayrollElementId = pem.PayrollElementId
inner join tbl_User u on epe.EmployeeId = u.EmployeeID
inner join TTSView tts on u.UserId = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and pem.PayrollElementDescription = 'Grand Total'
and u.Active = 1 and dbo.udf_Payroll_IsFirstWeekOfPayPeriod(@PayrollStartDate) = 1

update ot
set Tier = tm.TierName
from @Output ot
inner join TTSView tts on ot.TechCode = tts.TechCode
inner join tbl_Data_Employees tde on tts.TechCode = tde.TechNumber
inner join tbl_Payroll_EmployeeToPayrollTier ept on tde.EmployeeID = ept.EmployeeId
inner join tbl_Payroll_TierMaster tm on ept.TierId = tm.TierId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollMaster pm on pwm.PayrollId = pm.PayrollId
where pm.PayrollStartDate = @PayrollStartDate and dbo.udf_Payroll_IsFirstWeekOfPayPeriod(pwm.PayWeekStartDate) = 1

update ot
set ot.TotalJobsCompleted = j.TotalJobs
from 
@Output ot inner join (
select tts.TechCode , sum(epe.PayrollElementValue) as TotalJobs
from tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements epe on epe.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollElementsMaster pem on epe.PayrollElementId = pem.PayrollElementId
inner join tbl_User u on epe.EmployeeId = u.EmployeeID
inner join TTSView tts on u.UserId = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and pem.PayrollElementDescription = 'Jobs'
and u.Active = 1 group by tts.TechCode) as j on ot.TechCode = j.TechCode



update ot
set ot.Additions = jc.AMount
from
(select o.TechCode , sum(a.Amount) as Amount
from @Output as o
inner join tbl_HourlyInvoiceMaster him on o.TechCode = him.TechCode
inner join tbl_HourlyInvoiceAdditionalCharges a on him.InvoiceId = a.InvoiceId
inner join tbl_InvoicePayrollCodes apc on a.InvoicePayrollCode = apc.PayrollCode
where
(him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
and apc.PayrollCodeType = 'EARNING'

group by o.TechCode
) jc inner join @Output ot on  jc.TechCode = ot.TechCode 


update ot
set ot.TCSCHWJobsCompleted = jc.JobsCount
from
(select o.TechCode , COUNT(tjs.WONumber) as JobsCount
from @Output as o
inner join tbl_HourlyInvoiceMaster him on o.TechCode = him.TechCode
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber
where
(him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
and tjs.WorkorderType in ('TC' , 'SC') 
group by o.TechCode
) jc inner join @Output ot on  jc.TechCode = ot.TechCode


update ot
set ot.TCSCHWJobsCompleted = ot.TCSCHWJobsCompleted+  jc.JobsCount
from
(select o.TechCode , COUNT(tjs.WONumber) as JobsCount
from @Output as o
inner join tbl_HourlyInvoiceMaster him on o.TechCode = him.TechCode
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join InternalWorkOrder tjs on hil.WONumber = tjs.WONumber
where
(him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
and tjs.WorkorderType in ('HW') 
group by o.TechCode
) jc inner join @Output ot on  jc.TechCode = ot.TechCode



update ot
set ot.TotalLaborPaidNonTCSCJobs = jc.Amount
from
(select o.TechCode ,sum(dp.PaymentAmount) as Amount
from @Output as o
inner join tbl_HourlyInvoiceMaster him on o.TechCode = him.TechCode
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join tbl_Data_Job_Setup tjs on hil.WONumber = tjs.WONumber
inner join tbl_DishPayment dp on tjs.WONumber = dp.WONumber
where
(him.WeekBeginningDate = @PayrollStartDate or him.WeekEndingDate = @PayrollEndDate)
and tjs.WorkorderType not in ('TC' , 'SC') and dp.TaskType = 'L'
group by o.TechCode
) jc inner join @Output ot on  jc.TechCode = ot.TechCode

declare @index table (TechCode varchar(20))

insert into @index
select distinct TechCode from @Output

declare @t varchar(20) = ''
while (exists(select * from @index))
begin
	
	select top 1 @t = TechCode from @index
	
	declare @ECHWTC60 int = 0
	
	exec usp_GetTCJobs_LastEventBased_Output_Numbers 60 , @payrollStartDate , @payrollendDate , @t , 1 , 0 , 0 , 0 , 0 ,0 , 0, 0 ,@ECHWTC60 out ,0 , 0 
	
	update @Output 
	set TC60Count = @ECHWTC60
	where 
	TechCode = @t
	
	delete @index where TechCode = @t
	
end


update o
set o.Location = w.WarehouseName 
from @Output o
inner join IP2UView v on o.TechCode = v.UserId
inner join tbl_Warehouse w on v.InvParticipantId = w.InvParticipantId


select * from @Output





