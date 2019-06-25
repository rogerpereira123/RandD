select dl.*, im.* from tbl_Payroll_ContractorTechToTier ct 
inner join tbl_Payroll_ContractorTierToTierDeciders ctd on ct.ContractorTechToTierId = ctd.ContractorTechToTierId
inner join tbl_Payroll_ContractorPayrollDeduction d on ct.ContractorTechToTierId = d.ContractorTechToTierId
inner join tbl_Payroll_ContractorPayrollDeductionLine dl on d.DeductionId = dl.DeductionId
left join tbl_InvoiceMaster im on dl.InvoiceId  = im.InvoiceId
where ct.StartDate = '05/01/2015'
