select
intech.PayrollStartDate , intech.PayrollEndDate , 'Digital Dish' as Location, intech.NumberofTechs as InTechCount , intech.TotalJobs as InTechTotalJobs, intech.TotalPoints as InTechTotalPoints, intech.TotalHours as InTechTotalHours , intech.PPH as InTechPPH,
otech.NumberofTechs as OutTechCount,otech.TotalJobs as OutTechTotalJobs, otech.TotalPoints as OutTechTotalPoints, otech.TotalHours as OutTechTotalHours , otech.PPH as OutTechPPH
from 
(select
tpd.PayrollStartDate , tpd.PayrollEndDate,
COUNT(distinct tpd.TechCode) as NumberOfTechs,
SUM(isnull(tpd.Week1Jobs,0) + isnull(tpd.Week2Jobs, 0)) as TotalJobs,
SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) as TotalPoints, 
sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) as TotalHours,
round(case when sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) = 0 then 0 else (SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) /  sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0))) end , 2) as PPH

from
tbl_TechPayrollDetails tpd
inner join tbl_TechToPayrollClass tpc on tpd.TechCode = tpc.TechCode and tpd.PayrollStartDate = tpc.StartDate
inner join tbl_User u on tpd.TechCode = u.UserId
inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID
where
tpc.InvoiceClassId not like '%O%' and tpc.StartDate >= '07/31/2013'
and
DATEDIFF(day , case when tde.OnFieldStartDate is null or tde.OnFieldStartDate = '' then '01/01/2012' else tde.OnFieldStartDate end , '07/31/2013') >= 180
group by tpd.PayrollStartDate , tpd.PayrollEndDate) as intech
inner join 
(
select
tpd.PayrollStartDate , tpd.PayrollEndDate,
COUNT(distinct tpd.TechCode) as NumberOfTechs,
SUM(isnull(tpd.Week1Jobs,0) + isnull(tpd.Week2Jobs, 0)) as TotalJobs,
SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) as TotalPoints, 
sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) as TotalHours,
round(case when sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) = 0 then 0 else (SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) /  sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0))) end , 2) as PPH

from
tbl_TechPayrollDetails tpd
inner join tbl_TechToPayrollClass tpc on tpd.TechCode = tpc.TechCode and tpd.PayrollStartDate = tpc.StartDate
inner join tbl_User u on tpd.TechCode = u.UserId
inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID
where
tpc.InvoiceClassId like '%O%' and tpc.StartDate >= '07/31/2013'
and
DATEDIFF(day , case when tde.OnFieldStartDate is null or tde.OnFieldStartDate = '' then '01/01/2012' else tde.OnFieldStartDate end , '07/31/2013') >= 180
group by tpd.PayrollStartDate , tpd.PayrollEndDate) otech on intech.PayrollStartDate = otech.PayrollStartDate



union


select
intech.PayrollStartDate , intech.PayrollEndDate , intech.Location as Location, intech.NumberofTechs as InTechCount , intech.TotalJobs as InTechTotalJobs, intech.TotalPoints as InTechTotalPoints, intech.TotalHours as InTechTotalHours , intech.PPH as InTechPPH,
otech.NumberofTechs as OutTechCount,otech.TotalJobs as OutTechTotalJobs, otech.TotalPoints as OutTechTotalPoints, otech.TotalHours as OutTechTotalHours , otech.PPH as OutTechPPH
from 
(select
tpd.PayrollStartDate , tpd.PayrollEndDate, w.WarehouseName as Location,
COUNT(distinct tpd.TechCode) as NumberOfTechs,
SUM(isnull(tpd.Week1Jobs,0) + isnull(tpd.Week2Jobs, 0)) as TotalJobs,
SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) as TotalPoints, 
sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) as TotalHours,
round(case when sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) = 0 then 0 else (SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) /  sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0))) end , 2) as PPH

from
tbl_TechPayrollDetails tpd
inner join tbl_TechToPayrollClass tpc on tpd.TechCode = tpc.TechCode and tpd.PayrollStartDate = tpc.StartDate
inner join IP2UView v on tpd.TechCode = v.UserId
inner join tbl_Warehouse w on v.InvParticipantId = w.InvParticipantId
inner join tbl_User u on tpd.TechCode = u.UserId
inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID
where
tpc.InvoiceClassId not like '%O%' and tpc.StartDate >= '07/31/2013'
and
DATEDIFF(day , case when tde.OnFieldStartDate is null or tde.OnFieldStartDate = '' then '01/01/2012' else tde.OnFieldStartDate end , '07/31/2013') >= 180
group by tpd.PayrollStartDate , tpd.PayrollEndDate , w.WarehouseName) as intech
inner join 
(
select
tpd.PayrollStartDate , tpd.PayrollEndDate, w.WarehouseName as Location,
COUNT(distinct tpd.TechCode) as NumberOfTechs,
SUM(isnull(tpd.Week1Jobs,0) + isnull(tpd.Week2Jobs, 0)) as TotalJobs,
SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) as TotalPoints, 
sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) as TotalHours,
round(case when sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0)) = 0 then 0 else (SUM(isnull(tpd.Week1Points,0) + isnull(tpd.Week2Points, 0)) /  sum(isnull(tpd.Week1Hours, 0) + isnull(tpd.Week2Hours,0))) end , 2) as PPH

from
tbl_TechPayrollDetails tpd
inner join tbl_TechToPayrollClass tpc on tpd.TechCode = tpc.TechCode and tpd.PayrollStartDate = tpc.StartDate
inner join IP2UView v on tpd.TechCode = v.UserId
inner join tbl_Warehouse w on v.InvParticipantId = w.InvParticipantId
inner join tbl_User u on tpd.TechCode = u.UserId
inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID
where
tpc.InvoiceClassId like '%O%' and tpc.StartDate >= '07/31/2013'
and
DATEDIFF(day , case when tde.OnFieldStartDate is null or tde.OnFieldStartDate = '' then '01/01/2012' else tde.OnFieldStartDate end , '07/31/2013') >= 180
group by tpd.PayrollStartDate , tpd.PayrollEndDate , w.WarehouseName) otech on intech.PayrollStartDate = otech.PayrollStartDate and intech.Location = otech.Location


