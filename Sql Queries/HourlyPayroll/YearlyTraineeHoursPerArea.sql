select
ISNULL(w.WarehouseName, ' N/A') as Location , COUNT(distinct ht.EmployeeNumber) as Trainees , isnull(round(sum((DATEDIFF(minute,  convert(time , hihl.starttime) , CONVERT(time, hihl.EndTime)) / 60.0)),2) , 0) as Hours
from tbl_HourlyInvoiceHoursMaster hihm
inner join tbl_HourlyInvoiceHoursLine hihl on hihm.InvoiceHoursId = hihl.InvoiceHoursId
inner join tbl_HourlyTraineeInvoiceMaster ht on ht.TraineeInvoiceId = hihm.InvoiceId
inner join tbl_Data_Employees emp on ht.EmployeeNumber = emp.EmployeeNumber
left join tbl_User u on emp.EmployeeID = u.EmployeeID and u.UserLevel = 3
left join tbl_InvParticipant2User ip2u on u.UserId = ip2u.UserId
left join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId

where
hihm.Date between '01/01/2013' and '12/31/2013'

group by ISNULL(w.WarehouseName, ' N/A')
 


