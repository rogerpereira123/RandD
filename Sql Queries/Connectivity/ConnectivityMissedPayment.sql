declare @ConnectivityStartDate date = '06/08/2011'
declare @ConnectivityEndDate date
declare @PayrollWeekStartDate date
declare @PayrollWeekEndDate date
declare @Connected table
( Tech varchar(10),PayrollWeekStartDate date, WO varchar(20) , ConnectionMethod varchar(20) , HoursReported float)

while (@ConnectivityStartDate <= CONVERT(date, '09/07/2011'))
begin


set @ConnectivityEndDate = DATEADD(day , 6 , @ConnectivityStartDate)
set @PayrollWeekStartDate = DATEADD(day , 28 , @ConnectivityStartDate)
set @PayrollWeekEndDate = DATEADD(day , 34 , @ConnectivityStartDate)

insert into @Connected
select
 distinct tjs.TechCode, @PayrollWeekStartDate , tjs.WONumber , 'IP' as ConnectionMethod, 0
from 
tbl_DishPayment dp
inner join tbl_Data_Job_Setup tjs on dp.WONumber = tjs.WONumber
left join tbl_HourlyWOConnectivityPay p on dp.WONumber = p.WONumber
left join tbl_DishConnectivity d on dp.WONumber = d.WONumber
where
tjs.CSGLastChangedDate >=@ConnectivityStartDate
and
tjs.CSGLastChangedDate <=@ConnectivityEndDate
and
dp.TaskDescription like '%connectivity%'
and
dp.TaskType = 'E'
and
dp.PaymentAmount >0 
and
p.WONumber is null
and d.WONumber is null 
and
tjs.TechCode not in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT', 'ME' , 'M2' , 'M3' , 'M4', 'M5'))
and tjs.TechCode not in (select UserId from tbl_User  where UserLevel in (2, 5) )
and TaskDescription  in ('Connectivity Wireless' , 'Connectivity SlingLink' , 'Connectivity Ethernet')
order by tjs.TechCode asc

insert into @Connected
select
 distinct tjs.TechCode, @PayrollWeekStartDate , tjs.WONumber , 'phone' as ConnectionMethod , 0
from 
tbl_DishPayment dp
inner join tbl_Data_Job_Setup tjs on dp.WONumber = tjs.WONumber
left join tbl_HourlyWOConnectivityPay p on dp.WONumber = p.WONumber
left join tbl_DishConnectivity d on dp.WONumber = d.WONumber
left join @Connected c on dp.WONumber = c.WO
where
tjs.CSGLastChangedDate >=@ConnectivityStartDate
and
tjs.CSGLastChangedDate <=@ConnectivityEndDate
and
dp.TaskDescription like '%connectivity%'
and
dp.TaskType = 'E'
and
dp.PaymentAmount >0 
and
p.WONumber is null
and d.WONumber is null  and c.WO is null
and
tjs.TechCode not in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT', 'ME' , 'M2' , 'M3' , 'M4', 'M5'))
and tjs.TechCode not in (select UserId from tbl_User  where UserLevel in (2, 5) )
and TaskDescription not  in ('Connectivity Wireless' , 'Connectivity SlingLink' , 'Connectivity Ethernet')
order by tjs.TechCode asc


update @Connected
set HoursReported = tpd.Week1Hours
from 
tbl_TechPayrollDetails tpd 
where
Tech = tpd.TechCode
and
tpd.PayrollStartDate = PayrollWeekStartDate
update @Connected
set HoursReported = tpd.Week2Hours
from 
tbl_TechPayrollDetails tpd 
where
Tech = tpd.TechCode
and
tpd.PayrollEndDate = dateadd(day,6,PayrollWeekStartDate)


set @ConnectivityStartDate = DATEADD(day,1 , @ConnectivityEndDate)
	
end

delete @Connected from
tbl_data_job_setup tjs inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join InternalWorkOrder iwo on tdc.CUSTOMERID = iwo.CustomerID
inner join tbl_WOConnectivity wc on iwo.WONumber = wc.WONumber
where WO = tjs.WONumber
and
iwo.LastupdatedDt > tjs.CSGLastChangedDate
and
iwo.WorkorderType = 'HO'
and iwo.Status ='C' and wc.Equipment <> ''



select * into #Connected from @Connected



select 
PayrollWeekStartDate, Tech , (SUM(case when ConnectionMethod = 'IP' then 1 else 0 end) * 5 + SUM(case when ConnectionMethod = 'phone' then 1 else 0 end) * 2.5) as TotalConnectivityPay,
(((case when HoursReported = 0 then  (((SUM(case when ConnectionMethod = 'IP' then 1 else 0 end) * 5 + SUM(case when ConnectionMethod = 'phone' then 1 else 0 end) * 2.5))) else 
(((SUM(case when ConnectionMethod = 'IP' then 1 else 0 end) * 5 + SUM(case when ConnectionMethod = 'phone' then 1 else 0 end) * 2.5))) / HoursReported end) / 2.0) * case when (HoursReported - 40)  < 0 then 0 else (HoursReported - 40) end) as Overtime
into #ConnectivityPay
from 
@Connected
group by PayrollWeekStartDate , Tech,HoursReported



select  
Tech ,round(SUM(TotalCOnnectivityPay + Overtime),2) as PaymentAmount
from
#ConnectivityPay
group by Tech

insert into tbl_HourlyWOConnectivityPay 
select WO, ConnectionMethod,'11' , '11/11/2011' from #Connected


select * from #ConnectivityPay order by Tech, PayrollWeekStartDate



/*drop table #ConnectivityPay
drop table #Connected








select
 tjs.TechCode , tjs.WONumber , dp.TaskDescription
from 
tbl_DishPayment dp
inner join tbl_Data_Job_Setup tjs on dp.WONumber = tjs.WONumber
left join tbl_HourlyWOConnectivityPay p on dp.WONumber = p.WONumber
left join tbl_DishConnectivity d on dp.WONumber = d.WONumber
where
tjs.CSGLastChangedDate >='06/08/2011'
and
tjs.CSGLastChangedDate <='06/14/2011'
and
dp.TaskDescription like '%connectivity%'
and
dp.TaskType = 'E'
and
dp.PaymentAmount >0 
and
p.WONumber is null
and d.WONumber is null 
and
tjs.TechCode not in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT', 'ME' , 'M2' , 'M3' , 'M4', 'M5'))
and tjs.TechCode not in (select UserId from tbl_User  where UserLevel in (2, 5) )
order by tjs.TechCode asc
*/



