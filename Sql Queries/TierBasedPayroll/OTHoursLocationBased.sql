select 
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
pm.PayrollStartDate = '04/09/2014'
and pem.PayrollElementDescription = 'Hours'
and u.Active = 1
group by tts.WarehouseName 
order by tts.WarehouseName


