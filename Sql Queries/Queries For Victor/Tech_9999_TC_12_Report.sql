declare @startDate date = '06/01/2012'
declare @endDate date = '06/21/2012'
declare @techCode varchar(4) = '9999'
declare @IsTc12Or30 int = 12
	

		select  
		tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TCTechCode, tc.CSGStatus as TCStatus , tc.SaleDate as TCCreatedDate, tc.CSGLastChangedDate as TCCompletedDate, 
		pr.WONumber as OrgJob, pr.WorkorderType as OrgWorkOrderType,pr.TechCode as OrgTechCode,tts.TechName as OrgTechName,  pr.CSGStatus as OrgStatus, pr.SaleDate as OrgCreatedDate , pr.CSGLastChangedDate as OrgCompletedDate,tts.Supervisor, 0 as LaborPayment
		into #temp 
		from 
		tbl_data_job_setup tc
		inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId 
		inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId
		inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode
		where 
		pr.CSGLastChangedDate >= @startDate
		and
		pr.CSGLastChangedDate <= @endDate
		and
		tc.WorkorderType in ('TC' ,'SC')
		and
		pr.CSGStatus = 'C'
		and
		tc.wonumber <> pr.wonumber
		and
		datediff(Day,pr.CSGLastChangedDate, tc.saledate) <= @IsTc12Or30
		and 
		datediff(Day,pr.CSGLastChangedDate, tc.saledate) >= 0
		/*and
		convert(bigint, substring(pr.WoNumber , len(pr.WONumber) - 5 , len(pr.WoNumber))) < convert(bigint, substring(tc.WoNumber , len(tc.WONumber) - 5 , len(tc.WoNumber)))*/
		and
		CONVERT(bigint, pr.WONumber) < CONVERT(bigint, tc.WoNumber)
		and pr.TechCode = @techCode
		order by tdc.CUSTOMERID
		
		
update #temp
set LaborPayment = LaborPayment + dp.PaymentAmount
from tbl_DishPayment dp where dp.WONumber = OrgJob and dp.TaskType = 'L'

select * from #temp
drop table #temp
		


