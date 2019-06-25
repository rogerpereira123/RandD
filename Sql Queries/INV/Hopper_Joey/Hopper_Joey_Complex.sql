declare @StartDate date = '03/15/2012'
declare @EndDate date = '04/05/2012'

declare @Hopper table (
WO varchar(20),
WorkOrderType varchar(2),
Hopper int,
TimeSpent float,
LaborPaid float,
ClosedDate date,
Points int
)
declare @Joey table (
WO varchar(20),
WorkOrderType varchar(2),
Joey int,
TimeSpent float,
LaborPaid float,
ClosedDate date,
Points int
)
insert into @Hopper 
select
tjs.wonumber,tjs.WorkorderType , Quantity ,'' , 0, CSGLastChangedDate,  tjs.WorkUnits

from
tbl_Wo2InvTxn w
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine l on t.InvTxnId = l.InvTxnId
inner join tbl_Data_Job_Setup tjs on w.WoNumber = tjs.WONumber

where l.ProductId in ( '185647' ) 
and tjs.CSGLastChangedDate >= @StartDate and tjs.CSGLastChangedDate <= @EndDate



insert into @Joey 
select
tjs.wonumber,tjs.WorkorderType , Quantity , '',0, CSGLastChangedDate,tjs.WorkUnits

from
tbl_Wo2InvTxn w
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine l on t.InvTxnId = l.InvTxnId
inner join tbl_Data_Job_Setup tjs on w.WoNumber = tjs.WONumber

where l.ProductId in (  '187894') 
and tjs.CSGLastChangedDate >= @StartDate and tjs.CSGLastChangedDate <= @EndDate

declare @Result table (
WorkOrderType varchar(2),
Hopper int,
Joey int,
TimeSpent float,
LaborPaid float,
Points int

)

update @Hopper 
set TimeSpent =  DATEDIFF(minute, convert(datetime,rtrim(ltrim(SUBSTRING( w.JobStartEndTime , 0 , charindex(' - ',w.JobStartEndTime , 0))))) ,
CONVERT(datetime,rtrim(LTRIM(SUBSTRING( w.JobStartEndTime , charindex(' - ',w.JobStartEndTime , 0)+ 2 , LEN(w.JobStartEndTime)))) )) / 60.0
from tbl_Mobility_WorkOrderImport w
where
w.WONumber =  WO
and w.JobStatus = 'completed' 

update @Hopper 
set LaborPaid = d.PaymentAmount
from (select WONumber, sum(PaymentAmount) as PaymentAmount from tbl_DishPayment where TaskType = 'L' group by WONumber) d
where WO = d.WONumber




insert into @Result
select 
h.WorkOrderType, h.Hopper, ISNULL(j.joey , 0) , h.TimeSpent , h.LaborPaid , h.Points
from 
@Hopper h 
left join @Joey j on h.WO= j.WO


select 
h.WorkOrderType, rtrim(ltrim(str(h.Hopper))) + ' Hopper ' +  rtrim(ltrim(str(ISNULL(h.joey , 0)))) + ' Joeys' as Configuration  , COUNT(h.WorkOrderType) as WorkOrderClosed, round(SUM(h.TimeSpent),2) as TotalHoursSpent,
round(SUM(h.TimeSpent) / COUNT(h.WorkOrderType),2) as AverageTimePerWorkOrder , sum(h.LaborPaid) as TotalLaborPaid, round(sum(h.LaborPaid) / COUNT(h.WorkOrderType),2) as AverageOfPayment, round(sum(h.LaborPaid) / case when SUM(h.TimeSpent) = 0 then 1 else SUM(h.TimeSpent) end , 2) as AverageOfPayPerHour
, sum(h.Points) as Points
from 
@Result h
group by h.WorkOrderType, rtrim(ltrim(str(h.Hopper))) + ' Hopper ' +  rtrim(ltrim(str(ISNULL(h.joey , 0)))) + ' Joeys' 
order by h.WorkOrderType 


select 
h.WO, h.WorkOrderType, h.Hopper, ISNULL(j.joey , 0) as Joey , round(h.TimeSpent,2) as HoursSpent , h.LaborPaid ,  round(h.LaborPaid / (case when  h.TimeSpent = 0 then 1 else h.TimeSpent end), 2) as PayPerHour, h.Points
from 
@Hopper h 
left join @Joey j on h.WO= j.WO

