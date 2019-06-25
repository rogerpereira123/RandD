/*select
case 
when month(csglastchangeddate) = 1 then 'Jan'
when month(csglastchangeddate) = 2 then 'Feb'
when month(csglastchangeddate) = 3 then 'March'
when month(csglastchangeddate) = 4 then 'April'
when month(csglastchangeddate) = 5 then 'May'
when month(csglastchangeddate) = 6 then 'June'
when month(csglastchangeddate) = 7 then 'July'
when month(csglastchangeddate) = 8 then 'Aug'
when month(csglastchangeddate) = 9 then 'Sept'
when month(csglastchangeddate) = 10 then 'Oct'
when month(csglastchangeddate) = 11 then 'Nov'
when month(csglastchangeddate) = 12 then 'Dec'
end, 
WorkOrderType,
Count(jobId)
from 
tbl_data_job_setup 
where
csgLastchangedDate >= '01/01/2008'
and
csglastchangeddate <= '12/31/2008'
and
csgstatus in ('C' , 'D')
group by
month(csglastchangeddate),
workordertype
order by month(csglastchangeddate)*/

/*select
case 
when month(lastupdateddt) = 1 then 'Jan'
when month(lastupdateddt) = 2 then 'Feb'
when month(lastupdateddt) = 3 then 'March'
when month(lastupdateddt) = 4 then 'April'
when month(lastupdateddt) = 5 then 'May'
when month(lastupdateddt) = 6 then 'June'
when month(lastupdateddt) = 7 then 'July'
when month(lastupdateddt) = 8 then 'Aug'
when month(lastupdateddt) = 9 then 'Sept'
when month(lastupdateddt) = 10 then 'Oct'
when month(lastupdateddt) = 11 then 'Nov'
when month(lastupdateddt) = 12 then 'Dec'
end, 
WorkOrderType,
Count(wonumber)
from 
internalworkorder 
where
LastUpdatedDt >= '01/01/2008'
and
lastupdateddt <= '12/31/2008'
and
status in ('C')
group by
month(lastupdateddt),
workordertype
order by month(lastupdateddt)*/



select 
case 
when month(csglastchangeddate) = 1 then 'Jan'
when month(csglastchangeddate) = 2 then 'Feb'
when month(csglastchangeddate) = 3 then 'March'
when month(csglastchangeddate) = 4 then 'April'
when month(csglastchangeddate) = 5 then 'May'
when month(csglastchangeddate) = 6 then 'June'
when month(csglastchangeddate) = 7 then 'July'
when month(csglastchangeddate) = 8 then 'Aug'
when month(csglastchangeddate) = 9 then 'Sept'
when month(csglastchangeddate) = 10 then 'Oct'
when month(csglastchangeddate) = 11 then 'Nov'
when month(csglastchangeddate) = 12 then 'Dec'
end, 
tp.ProductName,
sum(line.quantity)

from 
tbl_Wo2InvTxn wotxn
inner join tbl_InvTxn txn on wotxn.InvTxnId = txn.InvTxnId
inner join tbl_InvTxnLine line on txn.InvTxnId = line.InvTxnId
inner join tbl_data_job_setup tjs on wotxn.wonumber = tjs.wonumber
inner join tbl_Product tp on line.ProductId = tp.ProductId
where
line.ProductId in (select distinct ProductId from tbl_Product where CategoryId = 4)
and
csgLastchangedDate >= '01/01/2008'
and
csglastchangeddate <= '12/31/2008'
group by
month(tjs.csglastchangeddate)
,tp.ProductName
order by month(tjs.csglastchangeddate)