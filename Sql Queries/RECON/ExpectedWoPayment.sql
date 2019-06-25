declare @serviceCode varchar(200)

select @serviceCode = serviceCodes from tbl_Data_job_setup where WONumber  = '44105310205328001'

select servicecode,ReconTypeId,StockNo, EquipmentReimAmount from tbl_ReconServiceCodeGrid
where 
@ServiceCode like '%'+ServiceCode+'%'

select servicecode,ReconTypeId,TaskNumber, LaborReimAmount from tbl_ServiceCodetoTaskPayment
where 
@ServiceCode like '%'+ServiceCode+'%'


