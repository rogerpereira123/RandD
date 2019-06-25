--Dish Movers
select  count(*)
from tbl_data_job_setup tjs
where
(tjs.servicecodes like '%}J%' 
  or tjs.servicecodes like '%}K%' 
  or tjs.servicecodes like '%}L%'
  or tjs.servicecodes like '%}M%')
and
tjs.ServiceCodes like '%P2%'
and
tjs.CSGLastChangedDate >= '01/01/2008'
and
tjs.CSGLastChangedDate <= '04/30/2008'
and
tjs.CSGStatus in ('C' ,'D')

--Multi Task Upgrades  5852
select  count(*)
from tbl_data_job_setup tjs
where
tjs.servicecodes like '%8-%'
and
tjs.ServiceCodes like '%P2%'
and
tjs.WorkOrderType = 'CH'
and
tjs.CSGLastChangedDate >= '01/01/2008'
and
tjs.CSGLastChangedDate <= '04/30/2008'
and
tjs.CSGStatus in ('C' ,'D')

--Regular Upgrades 18353
select  count(*)
from tbl_data_job_setup tjs
where
/*tjs.servicecodes not like '%8-%'
and*/
tjs.ServiceCodes like '%P2%'
and
tjs.WorkOrderType = 'CH'
and
tjs.CSGLastChangedDate >= '01/01/2008'
and
tjs.CSGLastChangedDate <= '04/30/2008'
and
tjs.CSGStatus in ('C' ,'D')
