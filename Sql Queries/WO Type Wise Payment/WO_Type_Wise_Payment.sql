select
sum(isnull(dp.PaymentAmount , 0)) 
from 
tbl_DishPayment dp
inner join tbl_Data_Job_Setup tjs on tjs.WONumber = dp.WONumber
where
dp.ClosedDate >= '08/01/2010'
and
dp.ClosedDate <='08/31/2010'
and
dp.TaskType = 'L'
and
tjs.WorkorderType in ('CH')



select
count(tjs.wonumber)
from 
tbl_Data_Job_Setup tjs
where
tjs.CSGLastChangedDate >= '08/01/2010'
and
tjs.CSGLastChangedDate <='08/31/2010'
and
tjs.CSGStatus in ('C' , 'D')
and
tjs.TechCode not like 'ret%'
and
tjs.WorkorderType in ('TC' , 'SC')
and
tjs.WONumber not in (select WONumber from tbl_DishPayment where PaymentAmount > 0 and TaskType = 'L')
