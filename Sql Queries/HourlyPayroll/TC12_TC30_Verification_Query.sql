declare @TechCode varchar(4)
set @TechCode = '3791'

select  
--@ExternalTC12Count = isnull(count(tc.WoNumber) , 0)
pr.WoNumber as PreviousWO , pr.CSGLastChangedDate as PrviousWOClosedDate, tc.WoNumber as TC_WO, tc.CSGStatus as TC_Status , tc.TechCode as TC_Tech , tc.SaleDate as TC_CreatedDate
from 
tbl_data_job_setup tc
inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId 
where 
pr.CSGLastChangedDate >= '12/24/2008'
and
pr.CSGLastChangedDate <= '12/30/2008'
and
(tc.WorkorderType = 'TC' or tc.WorkorderType = 'SC')
and
pr.CSGStatus = 'C'
and
tc.wonumber <> pr.wonumber
and
datediff(Day,pr.CSGLastChangedDate, tc.saledate) <= 30
and 
datediff(Day,pr.CSGLastChangedDate, tc.saledate) >= 0
and
pr.TechCode= @TechCode

union

select 
--@InternalTC12Count = isnull(count(tc.WoNumber) , 0)
pr.WoNumber as PreviousWO , pr.CSgLastChangedDate as PrviousWOClosedDate, tc.WoNumber as TC_WO, tc.Status as TC_Status , tc.TechCode as TC_Tech,tc.CreatedDt as TC_CreatedDate


from 
internalworkorder tc
inner join tbl_data_job_setup pr on tc.Customerid = pr.CustomerId
where 
pr.CSGLastChangedDate >= '12/24/2008'
and
pr.CSGLastChangedDate <= '12/30/2008'
and
(tc.WorkorderType = 'IC' or tc.WorkorderType = 'TC' or tc.WorkorderType = 'SC')
and
pr.CSGStatus = 'C'
and
tc.status not in ('D' , 'X')
and
datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) <= 30
and 
datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) >= 0
and
pr.TechCode= @TechCode