declare @ExitedEmployees table (SrNo int identity, EmployeeNumber int, ExitDate date, LastPayDate1 date, LastPay1 float, LastPayDate2 date, LastPay2 float, LastPayDate3 date, LastPay3 float)
insert into @ExitedEmployees 
select [Emp #], Exited,null, 0 ,null, 0 ,null, 0 from Churn2013 where Exited is not null

declare @NewPayrollEffectivePayDate date = '02/28/2014'
declare @i int = 1
declare @EmpNo int
declare @ExDate date
declare @LastPayDate1 date
declare @LastPayDate2 date
declare @LastPayDate3 date
declare @EmpId bigint
declare @TechCode varchar(50)
declare @Pays table (PayDate date, Amount float)

while(@i <= (select COUNT(*) from @ExitedEmployees))
begin
	select @EmpId = tde.EmployeeId , @TechCode = tde.TechNumber, @EmpNo = ee.EmployeeNumber, @ExDate = ExitDate from @ExitedEmployees ee inner join tbl_data_employees tde on ee.EMployeeNumber= tde.EmployeeNumber 
	where SrNo = @i
	
	--insert last 3 old pays
	insert into @Pays
	select top 3 DATEADD(day, 17 , PayrollEndDate) , GrandTotal from tbl_TechPayrollDetails where TechCode = @TechCode and GrandTotal > 100 order by PayrollStartDate desc
	
	--insert last 3 new pays
	insert into @Pays
	select distinct top 3  pm.CheckDate, etpe.PayrollElementValue from 
	tbl_Payroll_PayrollMaster pm 
	inner join tbl_Payroll_PayWeeksMaster pwm on pm.PayrollId = pwm.PayrollId
	inner join tbl_Payroll_EmployeeToPayrollElements etpe on pwm.PayWeekId = etpe.PayWeekId
	inner join tbl_Payroll_PayrollElementsMaster pem on etpe.PayrollElementId= pem.PayrollElementId
	where
	etpe.EmployeeId = @EmpId
	and pem.PayrollElementDescription = 'Grand Total'
	and etpe.PayrollElementValue > 100
	
	--insert last 3 trinaee pays
	insert into @Pays
	select top 3 DATEADD(day, 17 , PayrollEndDate) , GrandTotal from tbl_TraineePayrollDetails where EmployeeNumber = @EmpNo  order by PayrollStartDate desc
	
	--select * from @Pays order by PayDate desc
	
	update ee
	set
	ee.LastPayDate1 = p.PayDate,
	ee.LastPay1 = p.Amount
	from @ExitedEmployees ee,
	(select top 3 ROW_Number() over(order by PayDate desc) as SrNo, PayDate, Amount from @Pays order by PayDate desc) as P
	where
	p.SrNo = 1 and ee.EmployeeNumber = @EmpNo
	
	update ee
	set
	ee.LastPayDate2 = p.PayDate,
	ee.LastPay2 = p.Amount
	from @ExitedEmployees ee,
	(select top 3 ROW_Number() over(order by PayDate desc) as SrNo, PayDate, Amount from @Pays order by PayDate desc) as P
	where
	p.SrNo = 2 and ee.EmployeeNumber = @EmpNo
	
	update ee
	set
	ee.LastPayDate3 = p.PayDate,
	ee.LastPay3 = p.Amount
	from @ExitedEmployees ee,
	(select top 3 ROW_Number() over(order by PayDate desc) as SrNo, PayDate, Amount from @Pays order by PayDate desc) as P
	where
	p.SrNo = 3 and ee.EmployeeNumber = @EmpNo
	
	
	delete from @Pays
	set @i = @i + 1;
end

select c.[Emp #], c.[Tech #], c.[Emp Name], c.[Route Date], ee.ExitDate , ee.LastPayDate1, round(ee.LastPay1,2,2) as LastPay1 , ee.LastPayDate2 , round(ee.LastPay2,2,2) as LastPay2 , ee.LastPayDate3 , 
round(ee.LastPay3,2,2) as LastPay3 from @ExitedEmployees ee 
inner join Churn2013 c on ee.EmployeeNumber = c.[Emp #] order by ExitDate asc