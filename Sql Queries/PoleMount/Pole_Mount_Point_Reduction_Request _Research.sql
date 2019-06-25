select
pm.CustomerID, tjsoriginal.WONumber as OrgWONumber, tjsoriginal.SaleDate as OriginalCreateDate, tjsoriginal.WorkorderType as OrgWOType, tjsOriginal.WorkUnits as OrgPoints,  tjsOriginal.CSGLastChangedDate as OrgClosedDate,
pm.WONumber as PoleMountWO, pm.SaleDate as PoleMountCreateDate, DATEDIFF(day , tjsOriginal.CSGLastChangedDate , pm.SaleDate) as NumberOfDays
into #T
from tbl_Data_Job_Setup pm
inner join tbl_Data_Job_Setup tjsOriginal on pm.CustomerID = tjsOriginal.CustomerID
where
pm.servicecodes like '%2~%'
and pm.WONumber <> tjsOriginal.WONumber
and DATEDIFF(day , tjsOriginal.CSGLastChangedDate , pm.SaleDate) >= 0
and tjsOriginal.CSGStatus = 'C'
and pm.SaleDate between '03/01/2014' and '03/26/2014'
and tjsOriginal.WorkUnits > 0
order by pm.CustomerID asc , DATEDIFF(day , tjsOriginal.CSGLastChangedDate , pm.SaleDate) 


select
t1.*
from #T as t1 
inner join (select tinner.CustomerId, min(tinner.NumberOfDays) as NumberOfDays from #T  tinner group by  tinner.CustomerId) g on 
t1.CUstomerId = g.CustomerId and t1.NumberOfdays = g.NumberOfDays

drop table #T