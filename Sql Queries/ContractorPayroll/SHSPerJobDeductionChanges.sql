/*
delete from tbl_Payroll_ContractorPayrollDeductionLine
dbcc checkident(tbl_Payroll_ContractorPayrollDeductionLine , reseed , 0)

delete from tbl_Payroll_ContractorPayrollDeduction
dbcc checkident(tbl_Payroll_ContractorPayrollDeduction , reseed , 0)


delete from tbl_Payroll_ContractorWorkStatistics
dbcc checkident(tbl_Payroll_ContractorWorkStatistics , reseed , 0)

delete from tbl_Payroll_ContractorTierToTierDeciders
dbcc checkident(tbl_Payroll_ContractorTierToTierDeciders , reseed , 0)


delete from tbl_Payroll_ContractorTechToTier
dbcc checkident(tbl_Payroll_ContractorTechToTier , reseed , 0)
*/
select * from tbl_Payroll_ContractorTierMaster
select * from tbl_Payroll_ContractorDeductionRates
select * from tbl_Payroll_ContractorWorkTypeMaster


select * from tbl_Payroll_ContractorTechToTier
select * from tbl_Payroll_ContractorTierToTierDeciders

select * from tbl_Payroll_ContractorWorkStatistics

select * from tbl_Payroll_ContractorPayrollDeduction
select * from tbl_Payroll_ContractorPayrollDeductionLine order by DeductionId
