select
distinct tjs.WONumber, tjsFollow.WONumber 
from 
tbl_Data_Job_Setup tjs
inner join tbl_Data_Job_Setup tjsFollow on tjs.CustomerID = tjsFollow.CustomerID
where
tjsFollow.servicecodes like '%2~%'
and
tjsFollow.WorkorderType in ( 'CH')
and
tjsFollow.SaleDate > tjs.CSGLastChangedDate
and
tjsFollow.WONumber <> tjs.WONumber
and
tjs.WorkorderType in ('NC' , 'RC', 'RS')
and
tjs.CSGLastChangedDate >= '10/01/2010'
and
tjs.CSGLastChangedDate <= '10/31/2010'
and
tjs.CSGStatus in ('C' , 'D')
and
tjsFollow.CSGStatus in ('C' , 'D')
and tjsFollow.WorkUnits =12
 

select
distinct r.WONumber,  sum(r.PaymentAmount)
from 
tbl_Data_Job_Setup tjs
inner join tbl_Data_Job_Setup tjsFollow on tjs.CustomerID = tjsFollow.CustomerID
inner  join  tbl_DishPayment r on tjsFollow.WONumber = r.WONumber
where
tjsFollow.servicecodes like '%2~%'
and
tjsFollow.WorkorderType in ('CH', 'TC' , 'SC')
and
tjsFollow.SaleDate > tjs.CSGLastChangedDate
and
tjsFollow.WONumber <> tjs.WONumber
/*and
tjs.WorkorderType in ('NC' , 'RC', 'RS')*/
and
r.TaskType = 'L'
and
tjs.CSGLastChangedDate >= '08/01/2010'
and
tjs.CSGLastChangedDate <= '08/31/2010'
and
tjs.CSGStatus in ('C' , 'D')


group by r.WONumber, r.TaskType


