drop table #dishdata
drop table #ddData
drop table #upgrade

select dish.zip_code as zipcode, count(dish.tc_work_order_number) as 'TotalTC12WorkOrders'
into #dishData
from dishtest.dbo.tbl_tc_12 dish
where 
dish.has_tc12 = 1 
and
dish.last_changed_date >= '10/01/2006'
and
dish.last_changed_date <= '03/25/2007'
group by dish.zip_code 

select dish.zip_code as zipcode,count(dish.work_order_number ) as TC12Count
into #Upgrade
from dishtest.dbo.tbl_tc_12 dish,Northware.dbo.tbl_data_job_setup tjs
where 
dish.has_tc12 = 1 
and
dish.last_changed_date >= '10/01/2006'
and
dish.last_changed_date <= '03/25/2007'
and
dish.work_order_number = tjs.wonumber
and
( tjs.servicecodes like '%*G%'
or
tjs.servicecodes like '%$.%'
or
tjs.servicecodes like '%$.%'
or
tjs.servicecodes like '%D!%'
or
tjs.servicecodes like '%D(%'
or
tjs.servicecodes like '%}O%'
or
tjs.servicecodes like '%}P%'
or
tjs.servicecodes like '%}Q%'
or
tjs.servicecodes like '%}R%'
or
tjs.servicecodes like '%J}%'
or
tjs.servicecodes like '%I?%'
or
tjs.servicecodes like '%X!%'
or
tjs.servicecodes like '%X$%'
or
tjs.servicecodes like '%X+%')
group by dish.zip_code

select dd.customerzip as zipcode, count(dd.wonumber) as 'CompletedWorkOrders'
into #ddData
from Northware.dbo.tbl_data_job_setup dd
where 
dd.csgstatus = 'C'
and
dd.csglastchangeddate >= '10/01/2006'
and
dd.csglastchangeddate <= '03/25/2007'
group by CustomerZip 

select dd.zipcode as 'Zip Code' , dd.CompletedWorkOrders as 'NC Completed' , isnull(dish.TotalTC12WorkOrders,0) as 'TC 12 Count' , isnull(up.TC12Count,0) as 'TC 12 Count on Upgrades',
 str(round(((isnull(dish.TotalTC12WorkOrders,0) / (dd.CompletedWorkOrders*1.0)) * 100),2) , 5,2) as  'TC 12 %'
from 
#ddData as dd 
left join #dishData as dish on dd.zipcode = dish.zipcode
left join #upgrade as up on dd.zipcode = up.zipcode
order by [TC 12 %] desc
