declare @result table
(
TechCode varchar(20),
TechName varchar(200),
Supservisor varchar(50),
AvgHorlyRate_Last_6_Payrolls decimal(18,2),
AvgHorlyRate_Last_12_Payrolls decimal(18,2),
AvgHorlyRate_Last_26_Payrolls decimal(18,2)
)
/*********Last 26 Payrolls************/
insert into @result
select 
tpd.TechCode, tts.TechName , tts.Supervisor,0,0,
case when SUM(Week1Hours + Week2Hours ) = 0 then 0 else
round(sum(GrandTotal) / 
sum((Week1Hours + ((case when Week1Hours > 40 then (Week1Hours - 40) else 0 end) * 0.5) + Week2Hours + ( (case when Week2Hours > 40 then (Week2Hours - 40) else 0 end) * 0.5))),2) end as EffectiveHourlyRate

from 
tbl_TechPayrollDetails tpd 
inner join TTSView tts on tpd.TechCode = tts.TechCode
where  
tts.UserLevel = 3
and
tts.Active = 1
and
PayrollStartDate in (select distinct top 26 PayrollStartDate from tbl_TechPayrollDetails order by PayrollStartDate desc )
group by tpd.TechCode , tts.TechName , tts.Supervisor having COUNT(tpd.TechCode) >= 3
order by EffectiveHourlyRate desc


/*********Last 12 Payrolls************/
update r
set AvgHorlyRate_Last_12_Payrolls = data.EffectiveHourlyRate
from 
@result as r,
(select 
tpd.TechCode, tts.TechName , tts.Supervisor,
case when SUM(Week1Hours + Week2Hours ) = 0 then 0 else
round(sum(GrandTotal) / 
sum((Week1Hours + ((case when Week1Hours > 40 then (Week1Hours - 40) else 0 end) * 0.5) + Week2Hours + ( (case when Week2Hours > 40 then (Week2Hours - 40) else 0 end) * 0.5))),2) end as EffectiveHourlyRate
from 
tbl_TechPayrollDetails tpd 
inner join TTSView tts on tpd.TechCode = tts.TechCode
where 
tts.UserLevel = 3
and
tts.Active = 1
and 
PayrollStartDate in (select distinct top 12 PayrollStartDate from tbl_TechPayrollDetails order by PayrollStartDate desc )
group by tpd.TechCode , tts.TechName , tts.Supervisor having COUNT(tpd.TechCode) >= 3) as data
where data.TechCode = r.TechCode



insert into @result
select 
tpd.TechCode, tts.TechName , tts.Supervisor,0,
case when SUM(Week1Hours + Week2Hours ) = 0 then 0 else
round(sum(GrandTotal) / 
sum((Week1Hours + ((case when Week1Hours > 40 then (Week1Hours - 40) else 0 end) * 0.5) + Week2Hours + ( (case when Week2Hours > 40 then (Week2Hours - 40) else 0 end) * 0.5))),2) end as EffectiveHourlyRate,0
from 
tbl_TechPayrollDetails tpd 
inner join TTSView tts on tpd.TechCode = tts.TechCode
left join @result r on tpd.TechCode = r.TechCode
where  
tts.UserLevel = 3
and
tts.Active = 1
and
PayrollStartDate in (select distinct top 12 PayrollStartDate from tbl_TechPayrollDetails order by PayrollStartDate desc )
and r.TechCode is null
group by tpd.TechCode , tts.TechName , tts.Supervisor having COUNT(tpd.TechCode) >= 3
order by EffectiveHourlyRate desc



/*********Last 6 Payrolls************/
update r
set AvgHorlyRate_Last_6_Payrolls = data.EffectiveHourlyRate
from 
@result as r,
(select 
tpd.TechCode, tts.TechName , tts.Supervisor,
case when SUM(Week1Hours + Week2Hours ) = 0 then 0 else
round(sum(GrandTotal) / 
sum((Week1Hours + ((case when Week1Hours > 40 then (Week1Hours - 40) else 0 end) * 0.5) + Week2Hours + ( (case when Week2Hours > 40 then (Week2Hours - 40) else 0 end) * 0.5))),2) end as EffectiveHourlyRate
from 
tbl_TechPayrollDetails tpd 
inner join TTSView tts on tpd.TechCode = tts.TechCode
where  
tts.UserLevel = 3
and
tts.Active = 1
and
PayrollStartDate in (select distinct top 6 PayrollStartDate from tbl_TechPayrollDetails order by PayrollStartDate desc )
group by tpd.TechCode , tts.TechName , tts.Supervisor having COUNT(tpd.TechCode) >= 3) as data
where data.TechCode = r.TechCode



insert into @result
select 
tpd.TechCode, tts.TechName , tts.Supervisor,
case when SUM(Week1Hours + Week2Hours ) = 0 then 0 else
round(sum(GrandTotal) / 
sum((Week1Hours + ((case when Week1Hours > 40 then (Week1Hours - 40) else 0 end) * 0.5) + Week2Hours + ( (case when Week2Hours > 40 then (Week2Hours - 40) else 0 end) * 0.5))),2) end as EffectiveHourlyRate,
0 ,0
from 
tbl_TechPayrollDetails tpd 
inner join TTSView tts on tpd.TechCode = tts.TechCode
left join @result r on tpd.TechCode = r.TechCode
where  
tts.UserLevel = 3
and
tts.Active = 1
and
PayrollStartDate in (select distinct top 6 PayrollStartDate from tbl_TechPayrollDetails order by PayrollStartDate desc )
and r.TechCode is null
group by tpd.TechCode , tts.TechName , tts.Supervisor having COUNT(tpd.TechCode) >= 3
order by EffectiveHourlyRate desc


select * from @result 