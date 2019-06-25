declare @startDate date = '01/06/2015'
declare @endDate date = '01/06/2015'
declare @d table (
TechCode varchar(200),
TechName varchar(200),
Supervisor varchar(200),
SupervisorName varchar(200),
ClockOut datetime,
Latitude varchar(50),
Longitude varchar(50),
ExpectedLatitude varchar(50),
ExpectedLongitude varchar(50),
DistanceVariation float,
Comments varchar(2000),
Jobs int,
Points int,
Hours float,
PPH float,
Tier varchar(100)
)
insert into @d
select 
tts.TechCode,
tts.TechName,
tts.Supervisor,
tts.SupervisorName,
co.ClockOut,
co.Latitude,
co.Longitude,
co.ExpectedLatitude,
co.ExpectedLongitude,
co.DistanceVariation,
co.Comments,
0,
0,
0,
0,
'Tier 0'
from tbl_OutTechClockOut co 
inner join TTSView tts on co.TechCode = tts.TechCode
where
convert(date,co.ClockOut) between @startDate and @endDate
and 
(co.ClockedOutAt in ('Other' , 'Unknown') or 
 co.DistanceVariation > 1609)
 and tts.UserLevel <> 6
 
 update 
 d
 set
 d.PPH = round(pph.PPH,2),
 d.Jobs= pph.TotalJobs,
 d.Points = pph.TotalPoints,
 d.Hours = round(pph.TotalHours , 2)
 from @d d 
 cross apply udf_GetPointsPerHourTable(@startDate , @endDate , d.TechCode , 0) pph  
 
 update 
 d
 set d.Tier = tm.TierName
 from @d d 
 inner join tbl_Payroll_PayWeeksMaster pwm on convert(date, d.ClockOut) between pwm.PayWeekStartDate and pwm.PayWeekEndDate
 inner join tbl_Payroll_EmployeeToPayrollTier ept on pwm.PayWeekId = ept.PayWeekId
 inner join tbl_Payroll_TierMaster tm on ept.TierId = tm.TierId
 inner join TTSView tts on ept.EmployeeId = tts.EmployeeID
 where
 tts.TechCode = d.TechCode
 
 
 delete from @d where PPH = 0
 
 select * from @d where PPH < 5 and Tier <> 'Tier 0' and Tier not like 'RH%'
 
 