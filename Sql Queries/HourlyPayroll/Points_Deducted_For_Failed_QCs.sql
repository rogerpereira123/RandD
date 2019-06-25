select  
w.WarehouseName,
im.TechCode,
SUM(value) as [Total Points Deducted For QC],
count(distinct p.ActivityRelatedWorkOrder) as [QCs Failed],
tpd.Week1Points + tpd.Week2Points as [Total Points Completed By Tech]
from 
tbl_InvoiceToPayrollParametersAdditionsDeductions p 
inner join tbl_HourlyInvoiceMaster im on p.InvoiceId = im.InvoiceId 
inner join tbl_InvParticipant2User ip2u on im.TechCode = ip2u.UserId
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
inner join tbl_TechPayrollDetails tpd on im.TechCode = tpd.TechCode
where 
(im.WeekBeginningDate = '03/27/2013' or im.WeekBeginningDate = '04/03/2013')
and
p.Description like 'QC Item Failed%' and tpd.PayrollStartDate = '03/27/2013'
group by w.WarehouseName , im.TechCode, tpd.Week1Points + tpd.Week2Points
order by w.WarehouseName , im.TechCode 


select Week1Points + Week2Points from tbl_TechPayrollDetails where TechCode = '9239' and PayrollStartDate = '03/27/2013'