declare @startDate date ='07/01/2013'
declare @endDate date = '07/31/2013'
declare @TechCode varchar(2000) = '6704'
declare @SHS table
(
TechCode varchar(20),
TotalJobsCompleted int,
SHSJobsOnWhichLaborPaid int,
TotalLaborAmount float
)
insert into @SHS 
select
TechCode,COUNT(*) , 0 , 0 from tbl_Data_Job_Setup 
where TechCode = @TechCode
and CSGStatus = 'C' and CSGLastChangedDate between @startDate and @endDate
group by TechCode

update shs
set SHSJobsOnWhichLaborPaid = payment.TotalJobs,
TotalLaborAmount = payment.LaborPaid
from @SHS as shs 

inner join
(select tjs.TechCode, count(distinct dp.WONumber) TotalJobs , sum(dp.PaymentAmount) as LaborPaid from tbl_DishPayment dp 
inner join SHS s on dp.TaskDescription = s.Description
left join (
select distinct WONumber from tbl_DishPayment dishInner
inner join SHS sInner on dishInner.TaskDescription = sInner.Description 
where dishInner.ClosedDate between @startDate and @endDate and dishInner.TaskType = 'L'
group by dishInner.WONumber ,dishInner.TaskDescription  having sum(dishInner.PaymentAmount) = 0
) as chargebacks on dp.WONumber = chargebacks.WONumber
inner join tbl_Data_Job_Setup tjs on dp.WONumber = tjs.WONumber
where dp.ClosedDate between @startDate and @endDate and dp.TaskType = 'L' 
and chargebacks.WONumber is null
group by tjs.TechCode) as payment on shs.TechCode = payment.TechCode 


select * from @SHS