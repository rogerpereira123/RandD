drop table #dishdata


select dish.tc_work_order_number as 'TC12WorkOrder'
into #dishData
from dishtest.dbo.tbl_tc_12 dish
where 
dish.has_tc12 = 1 
and
dish.last_changed_date >= '10/01/2006'
and
dish.last_changed_date <= '03/25/2007'



select dd.Reason1 as 'Reason' , count(dish.TC12WorkOrder) as 'Total TC 12 Count' 

from Northware.dbo.tbl_data_job_setup dd, #dishData dish
where 
dd.wonumber = dish.tc12workorder
group by dd.Reason1 

