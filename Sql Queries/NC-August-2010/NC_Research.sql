--OOM
select
dish.work_order_number , dish.account_create_date, dish.create_date , dish.tech_number,dish.opportunity,dish.completed,tjs.TechCode as NorthwareTech,tjs.CSGStatus as NorthwareCSGStatus,tjs.SaleDate as NorthwareCreateDate
from dish inner join tbl_Data_Job_Setup tjs on dish.work_order_number = tjs.WONumber
inner join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
where
dish.opportunity = 1

--Multiple Opps On sameAccount
select
--d1.work_order_number,d1.create_date,d1.tech_number,d1.status,d1.opportunity,d2.work_order_number,d2.create_date,d2.tech_number,d2.status,d2.opportunity
distinct d1.account_number
from 
dish d1 inner join dish d2 on d1.account_number = d2.account_number
where
d1.opportunity = 1 
and 
d2.opportunity = 1
and
d1.work_order_number <> d2.work_order_number

select
dish.work_order_number,dish.status , dish.account_create_date, dish.create_date , dish.tech_number,dish.opportunity,dish.completed,tjs.TechCode as NorthwareTech,tjs.CSGStatus as NorthwareCSGStatus,tjs.SaleDate as NorthwareCreateDate,
tjs.CSGLastChangedDate as NorthwareClosedDate

from
dish 
inner join tbl_Data_Job_Setup tjs on dish.work_order_number = tjs.WONumber
where 
opportunity = 1 and completed = 0
and
tjs.CSGStatus = 'C'
and
datediff( day, tjs.SaleDate , tjs.CSGLastChangedDate)  <= 30

select 
dish.* from dish 
left join tbl_ZIPtoSupervisor zts on dish.zip_code = zts.ZipCode
where
zts.ZipCode is null
and
dish.opportunity = 1