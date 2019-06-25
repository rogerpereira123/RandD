declare @TechCode varchar(20) = '6830'
declare @PayDate date = '06/22/2012'
declare @PayrollStartDate date
set @PayrollStartDate = DATEADD(DAY , -30 , @PayDate )
declare @PayrollEndDate date
set @PayrollEndDate = DATEADD(day, 13 , @PayrollStartDate)

declare @SixtyFivePercentOfLabor float = 0
declare @InternalWorkOrderCount float = 0
select 
 @SixtyFivePercentOfLabor = (sum(dp.PaymentAmount) * 0.65)
from tbl_DishPayment dp 
inner join (
select 
distinct IL.WONumber
from 
tbl_InvoiceMaster IM
 inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
where
IM.TechCode = @TechCode
and IL.PayDate = @PayDate
and ILTS.InvoiceServiceCode <> 'NP') I on dp.WONumber = I.WONumber
where dp.TaskType = 'L' and dp.TaskDescription <> '%connectivity%' and dp.TaskDescription not in ('TV Tilt Mount 32in - 46in' , 'TV Full Motion Mount less than 32in' , 'Screen Cleaner Kit - 2.3oz')

select 
count(distinct IL.WONumber) as NumberOfJobs
from 
tbl_InvoiceMaster IM
 inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
where
IM.TechCode = @TechCode
and IL.PayDate = @PayDate
and ILTS.InvoiceServiceCode <> 'NP'

select
 @InternalWorkOrderCount =  count(distinct iwo.WONumber )
from 
tbl_InvoiceMaster IM
 inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
inner join InternalWorkOrder iwo on IL.WONumber = iwo.WONumber
where
IM.TechCode = @TechCode
and IL.PayDate= @PayDate
and ILTS.InvoiceServiceCode <> 'NP'


set @SixtyFivePercentOfLabor = @SixtyFivePercentOfLabor + (@InternalWorkOrderCount * 65)

declare @GrandTotal float = 0
select @GrandTotal =  GrandTotal from tbl_ContractorPayrollDetails where TechCode = @TechCode and PayrollStartDate = @PayrollStartDate

declare @TotalAdditions float = 0
declare @TotalDeductions float = 0

select @TotalAdditions = isnull(SUM(a.Amount) , 0)
from tbl_InvoiceMaster im
inner join tbl_InvoiceAdditionalCharges a on im.InvoiceId = a.InvoiceId
inner join tbl_InvoicePayrollCodes ipc on a.InvoicePayrollCode = ipc.PayrollCode
where (im.WeekBeginningDate = @PayrollStartDate or im.WeekEndingDate = @PayrollEndDate) and im.TechCode = @TechCode and ipc.PayrollCodeType = 'EARNING'

select @TotalDeductions = isnull(SUM(a.Amount) , 0)
from tbl_InvoiceMaster im
inner join tbl_InvoiceAdditionalCharges a on im.InvoiceId = a.InvoiceId
inner join tbl_InvoicePayrollCodes ipc on a.InvoicePayrollCode = ipc.PayrollCode
where (im.WeekBeginningDate = @PayrollStartDate or im.WeekEndingDate = @PayrollEndDate) and im.TechCode = @TechCode and ipc.PayrollCodeType = 'DEDUCTION'


declare @CurrentPay float = 0
select @CurrentPay = @GrandTotal - @TotalAdditions + @TotalDeductions 

select @CurrentPay as CurrentPay

select @SixtyFivePercentOfLabor as SixtyFivePercentOfLabor

select @CurrentPay * 0.92 as NinetyTwoPercentOfCurrentPay 


select 
count(distinct IL.WONumber) as NoPayJobsCount
from 
tbl_InvoiceMaster IM
 inner join tbl_InvoiceLine IL on IM.InvoiceId = IL.InvoiceId
inner join tbl_InvoiceLineToServiceCode ILTS on IL.InvoiceLineId = ILTS.InvoiceLineId
where
IM.TechCode = @TechCode
and (IM.WeekBeginningDate = @PayrollStartDate or IM.WeekEndingDate = @PayrollEndDate)
and ILTS.InvoiceServiceCode = 'NP'