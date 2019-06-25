declare @connectivity table
(
CustomerId bigint,
WoNumber varchar(20),
WOType varchar(2),
TechCode varchar(10),
ClosedDate datetime,
Connectedwith varchar(100)
)
insert into @connectivity
select 
distinct tjs.CustomerID , d.WONumber,tjs.WorkorderType, tjs.TechCode ,  tjs.CSGLastChangedDate as ClosedDate, d.ConnectionMethod as Connectedwith
from tbl_DishConnectivity
d inner join tbl_Data_Job_Setup tjs on d.WONumber = tjs.WONumber
left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
where
d.IsConnected = 1
and
oom.TechCode is null


declare @duplicate table
(
CustomerId bigint,
WoNumber varchar(20),
WOType varchar(2),
TechCode varchar(10),
ClosedDate datetime,
Connectedwith varchar(100)
)

insert into @duplicate
select * from @connectivity where CustomerId in (
select CustomerId from 
@connectivity 
group by CustomerId having COUNT(customerid) > 1)
and WoNumber not in (
select WoNumber from 
@connectivity 
group by WoNumber having COUNT(WoNumber) > 1)

select
tdc.ACCOUNTNO,tdc.NAME , tdc.PHONE , d.WoNumber , d.WOType , d.ClosedDate , d.TechCode , d.Connectedwith, (0 * 1.00) as AmountPaidByDish
into #t
from
@duplicate d inner join
tbl_Data_Customers tdc on d.CustomerId = tdc.CUSTOMERID
order by ACCOUNTNO

update #t
set AmountPaidByDish = AmountPaidByDish +  d.PaymentAmount
from tbl_DishPayment d 
where
#t.WoNumber = d.WONumber
and
d.TaskDescription like '%connect%'

select * from #t 
drop table #t