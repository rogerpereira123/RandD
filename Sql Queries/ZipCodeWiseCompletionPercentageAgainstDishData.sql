select zip_code, sum(opportunity) as Opportunity, sum(completed) as Completed, case when sum(completed) = 0 then '0'  else str(round( ((isnull(sum(completed),0)*1.0/ sum(opportunity)) * 100.0),2),5, 2) + '%' end as percentage
from tbl_30_day dish
where
dish.mgmt_area = '8E'
and
create_date >= '01/01/2007'
and
create_date <= '02/02/2007'
group by 
zip_code



