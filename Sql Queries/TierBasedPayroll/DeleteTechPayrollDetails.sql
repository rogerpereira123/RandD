declare @PayrollStartDate date = '05/07/2014'
declare @TechCode varchar(50) = '010440164'
/*select rd.* from 
tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollRuntimeDeciders rd on pwm.PayWeekId = rd.PayWeekId
inner join tbl_Data_Employees tde on rd.EmployeeId = tde.EmployeeId
inner join TTSView tts on tde.TechNumber = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and
tts.TechCode = @TechCode

select e.* from 
tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements e on pwm.PayWeekId = e.PayWeekId
inner join tbl_Data_Employees tde on e.EmployeeId = tde.EmployeeId
inner join TTSView tts on tde.TechNumber = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and
tts.TechCode = @TechCode*/

delete rd from 
tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollRuntimeDeciders rd on pwm.PayWeekId = rd.PayWeekId
inner join tbl_Data_Employees tde on rd.EmployeeId = tde.EmployeeId
inner join TTSView tts on tde.TechNumber = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and
tts.TechCode = @TechCode

delete e from 
tbl_Payroll_PayrollMaster pm 
inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
inner join tbl_Payroll_EmployeeToPayrollElements e on pwm.PayWeekId = e.PayWeekId
inner join tbl_Data_Employees tde on e.EmployeeId = tde.EmployeeId
inner join TTSView tts on tde.TechNumber = tts.TechCode
where
pm.PayrollStartDate = @PayrollStartDate
and
tts.TechCode = @TechCode