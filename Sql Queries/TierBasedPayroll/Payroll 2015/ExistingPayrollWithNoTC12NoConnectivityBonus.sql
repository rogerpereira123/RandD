declare @PayrollStartDate date = '04/22/2015'
declare @PayrollWeek2StartDate date = dateadd(day , 7 , @PayrollStartDate)
declare @PayrollEndDate date = dateadd(day , 13 , @PayrollstartDate)
declare @PayrollRunDate date = dateadd(day , 21 , @PayrollStartDate)
declare @PerPointRate float = 1.83
declare @T table (
TechCode varchar(200),
CurrentTier varchar(200),
CurrentTierComments varchar(2000),
CurrentRateType varchar(200),
CurrentRate float,
PPH float,
TC30 float,
CSAT float,
SHSPerWO float,
YearlyRaise float,
AdditionsWeek1 float,
AdditionsWeek2 float,
SHSIncentivesWeek1 float,
SHSIncentivesWeek2 float,
TC12IncentivesWeek1 float,
TC12IncentivesWeek2 float,
ConnectivityIncentivesWeek1 float,
ConnectivityIncentivesWeek2 float,
NewRatePerPointWeek1 float,
NewRatePerPointWeek2 float,
Week1Hours float,
WeeK1Points int,
Week2Hours float,
WeeK2Points int,
CurrentWeek1BasePay float,
CurrentWeek1Overtime float,
CurrentWeek2BasePay float,
CurrentWeek2Overtime float, 
NewWeek1BasePay float,
NewWeek1Overtime float,
NewWeek2BasePay float,
NewWeek2Overtime float)


insert into @T
select 
tts.TechCode , tm.TierName,
case when ept.TierIdentificationMethod = '1111' then 'Manually Set. ' + ept.Comments else '' end,rt.RateType, ept.Rate
 ,0,0 ,0,0,0,0 , 0 , 0 ,0, 0 ,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0
from 
tbl_Payroll_PayWeeksMaster pwm
inner join tbl_Payroll_EmployeeToPayrollTier ept on pwm.PayWeekId = ept.PayWeekId
inner join tbl_Payroll_TierMaster tm on ept.TierId = tm.TierId
inner join TTSView tts on ept.EmployeeId = tts.EmployeeID
inner join tbl_Payroll_RateTypes rt on ept.RateTypeId = rt.RateTypeId
where pwm.PayWeekStartDate = @PayrollStartDate
and tts.UserLevel = 3 and tts.Active = 1 and tts.TechCode <> '0025'

update @T
set 
NewRatePerPointWeek1 = CurrentRate,
NewRatePerPointWeek2 = CurrentRate


update t
set t.PPH = epd.TierDeciderValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollTier ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_EmployeeToPayrollTierDeciders epd on epd.EmployeeToPayrollTierId = ept.EmployeeToPayrollTierId
inner join tbl_Payroll_TierDeciders td on epd.TierDeciderId = td.TierDeciderId
where tts.Active = 1 and td.TierDeciderName = 'PPH' 

update t
set t.TC30 = epd.TierDeciderValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollTier ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_EmployeeToPayrollTierDeciders epd on epd.EmployeeToPayrollTierId = ept.EmployeeToPayrollTierId
inner join tbl_Payroll_TierDeciders td on epd.TierDeciderId = td.TierDeciderId
where tts.Active = 1 and td.TierDeciderName = 'TC30' 

update t
set t.CSAT = epd.TierDeciderValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollTier ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_EmployeeToPayrollTierDeciders epd on epd.EmployeeToPayrollTierId = ept.EmployeeToPayrollTierId
inner join tbl_Payroll_TierDeciders td on epd.TierDeciderId = td.TierDeciderId
where tts.Active = 1 and td.TierDeciderName = 'CSAT' 

update t
set t.SHSPerWO = epd.TierDeciderValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollTier ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_EmployeeToPayrollTierDeciders epd on epd.EmployeeToPayrollTierId = ept.EmployeeToPayrollTierId
inner join tbl_Payroll_TierDeciders td on epd.TierDeciderId = td.TierDeciderId
where tts.Active = 1 and td.TierDeciderName = 'AVG_SHS_PER_JOB' 

update t
set t.Week1Hours = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Hours'

update t
set t.Week2Hours = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollWeek2StartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Hours'

update t
set t.WeeK1Points = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Points'

update t
set t.WeeK2Points = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollWeek2StartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Points'


update t
set t.CurrentWeek1BasePay = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Base Pay'

update t
set t.CurrentWeek2BasePay = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollWeek2StartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Base Pay'

update t
set t.CurrentWeek1Overtime = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Overtime Pay'

update t
set t.CurrentWeek2Overtime = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollWeek2StartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Overtime Pay'


update t
set t.SHSIncentivesWeek1 = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'SHS Component'

update t
set t.SHSIncentivesWeek2 = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollWeek2StartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'SHS Component'


update t
set t.TC12IncentivesWeek1 = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'TC 12 Component'

update t
set t.TC12IncentivesWeek2 = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollWeek2StartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'TC 12 Component'

update t
set t.ConnectivityIncentivesWeek1 = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollStartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Connectivity Component'

update t
set t.ConnectivityIncentivesWeek2 = ept.PayrollElementValue
from @T t 
inner join TTSView tts on t.TechCode = tts.TechCode
inner join tbl_Payroll_EmployeeToPayrollElements ept on tts.EmployeeID = ept.EmployeeId 
inner join tbl_Payroll_PayWeeksMaster pwm on pwm.PayWeekId = ept.PayWeekId and pwm.PayWeekStartDate = @PayrollWeek2StartDate
inner join tbl_Payroll_PayrollElementsMaster pem on pem.PayrollElementId = ept.PayrollElementId
where tts.Active = 1 and pem.PayrollElementDescription = 'Connectivity Component'



update @T
set NewRatePerPointWeek1 = NewRatePerPointWeek1 + dbo.udf_getPerPointRaiseOnEmployeeAge(TechCode , 0.05 , @PayrollRunDate) ,
YearlyRaise = dbo.udf_getPerPointRaiseOnEmployeeAge(TechCode , 0.05 , @PayrollRunDate)

update @T
set NewRatePerPointWeek2 = NewRatePerPointWeek2 + dbo.udf_getPerPointRaiseOnEmployeeAge(TechCode , 0.05 , @PayrollRunDate) ,
YearlyRaise = dbo.udf_getPerPointRaiseOnEmployeeAge(TechCode , 0.05 , @PayrollRunDate)

update @T
set NewRatePerPointWeek1 = NewRatePerPointWeek1 + case when WeeK1Points = 0 then 0 else Round((SHSIncentivesWeek1 / WeeK1Points) , 2) end

update @T
set NewRatePerPointWeek2 = NewRatePerPointWeek2 + case when WeeK2Points = 0 then 0 else Round((SHSIncentivesWeek2 / WeeK2Points) , 2) end

update t
set t.NewRatePerPointWeek1 = round(t.NewRatePerPointWeek1 + ((ad.Amount * 1.0) / t.WeeK1Points),2),
t.AdditionsWeek1 = ad.Amount
from @T t 
inner join 
(select m.TechCode , sum(i.Amount) as Amount
from tbl_HourlyInvoiceMaster m 
inner join tbl_HourlyInvoiceAdditionalCharges i on i.InvoiceId = m.InvoiceId
inner join tbl_InvoicePayrollCodes ipc on ipc.PayrollCode = i.InvoicePayrollCode
where m.WeekBeginningDate  = @PayrollStartDate
and ipc.PayrollCodeType = 'Earning'
group by m.TechCode) ad on t.TechCode = ad.TechCode

update t
set t.NewRatePerPointWeek2 = round(t.NewRatePerPointWeek2 + ((ad.Amount * 1.0) / t.WeeK2Points) , 2),
t.AdditionsWeek2 = ad.Amount
from @T t 
inner join 
(select m.TechCode , sum(i.Amount) as Amount
from tbl_HourlyInvoiceMaster m 
inner join tbl_HourlyInvoiceAdditionalCharges i on i.InvoiceId = m.InvoiceId
inner join tbl_InvoicePayrollCodes ipc on ipc.PayrollCode = i.InvoicePayrollCode
where m.WeekBeginningDate  = @PayrollWeek2StartDate
and ipc.PayrollCodeType = 'Earning'
group by m.TechCode) ad on t.TechCode = ad.TechCode


update @T
set
NewWeek1BasePay =  
round(case when Week1Hours > 40 then
		((WeeK1Points / Week1Hours) * 40) * NewRatePerPointWeek1 
	  when Week1Hours <= 40 and Week1Hours >0 then
		((WeeK1Points / Week1Hours) * Week1Hours) * NewRatePerPointWeek1 
  end , 2)  ,
  
  NewWeek1Overtime =  
round(case when Week1Hours > 40 then
		((WeeK1Points / Week1Hours) * (Week1Hours - 40)) * NewRatePerPointWeek1 * 1.5
	  when Week1Hours <= 40 then 0		
  end , 2)
  ,
  NewWeek2BasePay =  
round(case when Week2Hours > 40 then
		((WeeK2Points / Week2Hours) * 40) * NewRatePerPointWeek2 
	  when Week2Hours <= 40  and Week2Hours >0 then
		((WeeK2Points / Week2Hours) * Week2Hours) * NewRatePerPointWeek2 
  end,2),
  NewWeek2Overtime =  
round(case when Week2Hours > 40 then
		((WeeK2Points / Week2Hours) * (Week2Hours - 40)) * NewRatePerPointWeek2 * 1.5
	  when Week2Hours <= 40 then 0		
  end,2)
  
  


select * from @T