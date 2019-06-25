
/*select
w.WarehouseName , 
sum(tpd.Week1Jobs + tpd.Week2Jobs) /26  as [Avg. Jobs Per Payroll] ,
round(sum(tpd.Week1Overtime + tpd.Week2OverTime ) / 26.0 , 2) as [Avg. OT Per Payroll],
count(tpd.TechCode) /26 as [Avg. Techs Per Payroll],
sum(case when ttp.InvoiceClassId like '%S' then 1 else 0 end) / 26  as [Avg. 4 day Schedule Techs],
sum(case when ttp.InvoiceClassId like '%H%' or ttp.InvoiceClassId like '%SC%' then 1 else 0 end) / 26  as [Avg. Flat Hourly Rate Techs],
 round((sum(tpd.GrandTotal) / 26.0) / (sum(tpd.Week1Jobs + tpd.Week2Jobs) /26.0) , 2) as [Avg. $/Job Per Payroll]
from tbl_TechPayrollDetails tpd
inner join tbl_InvParticipant2User ip2u on tpd.TechCode = ip2u.UserId
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
inner join tbl_TechToPayrollClass ttp on tpd.TechCode = ttp.TechCode and tpd.PayrollStartDate = ttp.StartDate and tpd.PayrollEndDate = ttp.EndDate
where
tpd.PayrollStartDate >= '01/01/2011'
and 
tpd.PayrollStartDate <= '12/31/2011'
group by w.WarehouseName
order by [Avg. OT Per Payroll] desc



select
w.WarehouseName , 
sum(tpd.Week1Jobs + tpd.Week2Jobs) /26  as [Avg. Jobs Per Payroll] ,
round(sum(tpd.Week1Overtime + tpd.Week2OverTime ) / 26.0 , 2) as [Avg. OT Per Payroll],
count(tpd.TechCode) /26 as [Avg. Techs Per Payroll],
sum(case when ttp.InvoiceClassId like '%S' then 1 else 0 end) / 26  as [Avg. 4 day Schedule Techs],
sum(case when ttp.InvoiceClassId like '%H%' or ttp.InvoiceClassId like '%SC%' then 1 else 0 end) / 26  as [Avg. Flat Hourly Rate Techs],
 round((sum(tpd.GrandTotal) / 26.0) / (sum(tpd.Week1Jobs + tpd.Week2Jobs) /26.0) , 2) as [Avg. $/Job Per Payroll]
from tbl_TechPayrollDetails tpd
inner join tbl_InvParticipant2User ip2u on tpd.TechCode = ip2u.UserId
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
inner join tbl_TechToPayrollClass ttp on tpd.TechCode = ttp.TechCode and tpd.PayrollStartDate = ttp.StartDate and tpd.PayrollEndDate = ttp.EndDate
where
tpd.PayrollStartDate >= '01/01/2012'
and 
tpd.PayrollStartDate <= '12/31/2012'
group by w.WarehouseName
order by [Avg. OT Per Payroll] desc*/

declare @NumberOfPayrolls int = 3

select
w.WarehouseName , 
sum(tpd.Week1Jobs + tpd.Week2Jobs) /@NumberOfPayrolls  as [Avg. Jobs Per Payroll] ,
SUM(tpd.Week1Points + tpd.Week2Points) / @NumberOfPayrolls as [Avg. Points Per Payroll],
 round((sum((case when tpd.Week1Hours - 40 < 0 then 0 else tpd.Week1Hours - 40 end) + (case when tpd.Week2Hours - 40 < 0 then 0 else tpd.Week2Hours - 40 end))) / @NumberOfPayrolls,2) as [Avg. OT Hours Per Payroll],
round(((sum((case when tpd.Week1Hours - 40 < 0 then 0 else tpd.Week1Hours - 40 end) + (case when tpd.Week2Hours - 40 < 0 then 0 else tpd.Week2Hours - 40 end))) / @NumberOfPayrolls) / (count(tpd.TechCode) /@NumberOfPayrolls) , 2) as [Avg. OT. Hrs. Per Tech Per Payroll],
round(sum(tpd.Week1Overtime + tpd.Week2OverTime ) / @NumberOfPayrolls , 2) as [Avg. OT Per Payroll],
count(tpd.TechCode) /@NumberOfPayrolls as [Avg. Techs Per Payroll],
sum(case when ttp.InvoiceClassId like '%S' then 1 else 0 end) / @NumberOfPayrolls  as [Avg. 4 day Schedule Techs],
case when sum(case when ttp.InvoiceClassId like '%S' then 1 else 0 end) / @NumberOfPayrolls = 0 then 0 else
 
 ((sum(case when ttp.InvoiceClassId like '%S' then (tpd.Week1Hours + tpd.Week2Hours) else 0 end) / @NumberOfPayrolls) / (sum(case when ttp.InvoiceClassId like '%S' then 1 else 0 end) / @NumberOfPayrolls) ) / 8 end  as [Avg. Hrs Per Day 4 day Schedule Techs],
 
 
 
 
sum(case when ttp.InvoiceClassId like '%H%' or ttp.InvoiceClassId like '%SC%' then 1 else 0 end) / @NumberOfPayrolls  as [Avg. Flat Hourly Rate Techs],
 round((sum(tpd.GrandTotal) / @NumberOfPayrolls) / (sum(tpd.Week1Jobs + tpd.Week2Jobs) /@NumberOfPayrolls) , 2) as [Avg. $/Job Per Payroll]
from tbl_TechPayrollDetails tpd
inner join tbl_InvParticipant2User ip2u on tpd.TechCode = ip2u.UserId
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
inner join tbl_TechToPayrollClass ttp on tpd.TechCode = ttp.TechCode and tpd.PayrollStartDate = ttp.StartDate and tpd.PayrollEndDate = ttp.EndDate
where
tpd.PayrollStartDate >= '01/02/2013'
and 
tpd.PayrollStartDate <= '02/12/2013'
group by w.WarehouseName
order by [Avg. OT Per Payroll] desc



