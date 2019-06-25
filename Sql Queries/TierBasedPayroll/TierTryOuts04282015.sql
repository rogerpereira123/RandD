declare @Tiers table (TechCode varchar(200) , PPH float, CSAT float, TC30 float, SHSPerJob float,TierIdentificationMethod varchar(4) , Comments varchar(2000), CurrentTier varchar(200) , NewTier varchar(200))
declare @PayWekkStartDate date= '04/22/2015'
insert into @Tiers
select
tts.TechCode , eptd.TierDeciderValue as PPH,0,0,0, ept.TierIdentificationMethod,ept.Comments, tm.TierName as CurrentTier, '' as NewTier
from tbl_Payroll_EmployeeToPayrollTierDeciders eptd 
inner join tbl_Payroll_EmployeeToPayrollTier ept on eptd.EmployeeToPayrollTierId = ept.EmployeeToPayrollTierId
inner join tbl_Payroll_TierMaster tm on ept.TierId = tm.TierId
inner join tbl_Payroll_TierDeciders td on eptd.TierDeciderId = td.TierDeciderId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
inner join TTSView tts on ept.EmployeeId = tts.EmployeeID
where pwm.PayWeekStartDate = @PayWekkStartDate
and td.TierDeciderName = 'PPH'
and tts.Active = 1 and tts.UserLevel = 3 and tm.TierId > 1
and tts.TechCode <> '0025'

update t 
set 
t.TC30 = eptd.TierDeciderValue
from @Tiers t 
inner join TTSView tts on t.TechCode = tts.TechCode 
inner join tbl_Payroll_EmployeeToPayrollTier ept on ept.EmployeeId = tts.EmployeeID
inner join tbl_Payroll_EmployeeToPayrollTierDeciders eptd on ept.EmployeeToPayrollTierId = eptd.EmployeeToPayrollTierId
inner join tbl_Payroll_TierDeciders td on eptd.TierDeciderId = td.TierDeciderId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
where pwm.PayWeekStartDate = @PayWekkStartDate
and td.TierDeciderName = 'TC30'
and tts.Active = 1 and tts.UserLevel = 3 
and tts.TechCode <> '0025'

update t 
set 
t.CSAT = eptd.TierDeciderValue
from @Tiers t 
inner join TTSView tts on t.TechCode = tts.TechCode 
inner join tbl_Payroll_EmployeeToPayrollTier ept on ept.EmployeeId = tts.EmployeeID
inner join tbl_Payroll_EmployeeToPayrollTierDeciders eptd on ept.EmployeeToPayrollTierId = eptd.EmployeeToPayrollTierId
inner join tbl_Payroll_TierDeciders td on eptd.TierDeciderId = td.TierDeciderId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
where pwm.PayWeekStartDate = @PayWekkStartDate
and td.TierDeciderName = 'CSAT'
and tts.Active = 1 and tts.UserLevel = 3 
and tts.TechCode <> '0025'


update t 
set 
t.SHSPerJob = eptd.TierDeciderValue
from @Tiers t 
inner join TTSView tts on t.TechCode = tts.TechCode 
inner join tbl_Payroll_EmployeeToPayrollTier ept on ept.EmployeeId = tts.EmployeeID
inner join tbl_Payroll_EmployeeToPayrollTierDeciders eptd on ept.EmployeeToPayrollTierId = eptd.EmployeeToPayrollTierId
inner join tbl_Payroll_TierDeciders td on eptd.TierDeciderId = td.TierDeciderId
inner join tbl_Payroll_PayWeeksMaster pwm on ept.PayWeekId = pwm.PayWeekId
where pwm.PayWeekStartDate = @PayWekkStartDate
and td.TierDeciderName = 'AVG_SHS_PER_JOB'
and tts.Active = 1 and tts.UserLevel = 3 
and tts.TechCode <> '0025'

update @Tiers 
set NewTier = 
case when CurrentTier = 'Minimum Wage' then CurrentTier
	 when PPH >= 5 and CurrentTier = 'Tier 1' then CurrentTier
	 when TierIdentificationMethod = '1111' then CurrentTier
	 when PPH >= 8 then 'Tier 6'	
	 when PPH >= 7.50 then 'Tier 5'
	 when PPH >= 7 then 'Tier 4'
	 when PPH >= 6.50 then 'Tier 3'
	 when PPH >= 6 then 'Tier 2'
	 else 'Tier 1' end


select currentWay.CurrentTier as Tier , currentWay.NumberOfTechs as NumberOfTechsExisting , newWay.NumberOfTechs as NumberOfTechsNewCalculation 
from 
(select CurrentTier , COUNT(*) NumberOfTechs from @Tiers group by CurrentTier) currentWay
inner join (select NewTier , COUNT(*) NumberOfTechs from @Tiers group by NewTier) newWay on currentWay.CurrentTier = newWay.NewTier

select
TechCode ,TC30 , CSAT , SHSPerJob,  PPH , 
case when TierIdentificationMethod = '1111' then 'Set Manually' else '' end as TierIdentification , Comments, CurrentTier , NewTier
 from @Tiers



