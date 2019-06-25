delete eptd from tbl_Payroll_EmployeeToPayrollTierDeciders eptd
inner join tbl_Payroll_EmployeeToPayrollTier ept on eptd.EmployeeToPayrollTierId = ept.EmployeeToPayrollTierId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollMaster pm on pwm.PayrollId = pm.PayrollId
where pm.PayrollStartDate >= '04/23/2014'

--select max(EmployeeToPayrollTierDeciderId)  from tbl_Payroll_EmployeeToPayrollTierDeciders

DBCC CHECKIDENT (tbl_Payroll_EmployeeToPayrollTierDeciders, reseed, 15510)




delete ept from  tbl_Payroll_EmployeeToPayrollTier ept
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
inner join tbl_Payroll_PayrollMaster pm on pwm.PayrollId = pm.PayrollId
where pm.PayrollStartDate >= '04/23/2014'

--select max(EmployeeToPayrollTierId)  from tbl_Payroll_EmployeeToPayrollTier

DBCC CHECKIDENT (tbl_Payroll_EmployeeToPayrollTier, reseed, 5150)


delete pwm from tbl_Payroll_PayWeeksMaster pwm 
inner join tbl_Payroll_PayrollMaster pm on pwm.PayrollId = pm.PayrollId
where pm.PayrollStartDate >= '04/23/2014'

--select max(PayWeekId)  from tbl_Payroll_PayWeeksMaster


DBCC CHECKIDENT (tbl_Payroll_PayWeeksMaster, reseed, 26)



delete from tbl_Payroll_PayrollMaster where PayrollStartDate >= '04/23/2014'

--select max(PayrollId)  from tbl_Payroll_PayWeeksMaster


DBCC CHECKIDENT (tbl_Payroll_PayrollMaster, reseed, 13)

