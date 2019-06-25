select dish_type as Equipment , count(tc_work_order_number) as 'Total TC12 Count'  from tbl_tc_12 
where 
has_tc12 = 1
and
last_changed_date >= '10/01/2006'
and
last_changed_date <= '03/25/2007'
group by dish_type
order by [Total TC12 Count] desc