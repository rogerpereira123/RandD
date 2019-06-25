select
tjs1.WONumber as OrgWO,tjs1.WorkorderType as OrgWOType,tjs1.CSGLastChangedDate as OrgWOCompDate, tjs2.WONumber as TCWO ,tjs2.WorkorderType as TCWoType, tjs2.SaleDate as TCWOCreateDate,datediff(DAY ,tjs1.CSGLastChangedDate , tjs2.SaleDate) as DateDiffCount
--distinct tjs2.WONumber
into #first
from
tbl_Data_Job_Setup tjs1 
inner join tbl_Data_Job_Setup tjs2 on tjs1.CustomerID = tjs2.CustomerID

where
tjs1.WONumber <> tjs2.WONumber
and
tjs1.CSGStatus in ('C' , 'D')
and
tjs2.WorkorderType in ('TC' , 'SC')
and
tjs2.CSGStatus in ('C' , 'D')
and
datediff(DAY ,tjs1.CSGLastChangedDate , tjs2.SaleDate) <= 90
and
datediff(DAY ,tjs1.CSGLastChangedDate , tjs2.SaleDate) > 0
and
tjs1.CSGLastChangedDate >= '03/01/2010'

/*and
tjs1.WONumber = '32778361900015082'*/
order by tjs1.WONumber

select * from #first

delete from #first
from  
(select orgwo as orgwot ,  MIN(datediffcount) as mindatediffcount from #first 
group by orgwo) as t where orgwo = t.orgwot and 
datediffcount = t.mindatediffcount

