declare @Warehouse varchar(50) = 'CINCINNATI'

select tjs.WONumber from tbl_Data_Job_Setup
tjs inner join tbl_TechToPayrollClass ttp on tjs.TechCode = ttp.TechCode
inner join tbl_InvParticipant2User ip2u on ip2u.UserId = tjs.TechCode
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
inner join tbl_User u on ip2u.UserId  = u.UserId
 where
CSGLastChangedDate>='10/12/2011'
and 
CSGLastChangedDate <='10/25/2011'
and
CSGStatus = 'C'
and
ttp.StartDate = '10/12/2011' 
and
ttp.EndDate = '10/25/2011'
and
ttp.InvoiceClassId not in ('CD' , 'CT' ,  'ME' , 'M2' , 'M3' , 'M4', 'M5')
and
w.WarehouseName = @Warehouse
and
u.UserLevel not in (2,5) and dbo.IsBucketNumber(tjs.TechCode) = 0


select tjs.WONumber from InternalWorkOrder
tjs inner join tbl_TechToPayrollClass ttp on tjs.TechCode = ttp.TechCode
inner join tbl_InvParticipant2User ip2u on ip2u.UserId = tjs.TechCode
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
inner join tbl_User u on ip2u.UserId  = u.UserId
where
LastupdatedDt>='10/12/2011'
and 
LastupdatedDt <='10/25/2011'
and
Status = 'C'
and
ttp.StartDate = '10/12/2011' 
and
ttp.EndDate = '10/25/2011'
and
ttp.InvoiceClassId not in ('CD' , 'CT' ,  'ME' , 'M2' , 'M3' , 'M4', 'M5')
and
w.WarehouseName = @Warehouse
and
u.UserLevel not in (2,5) and dbo.IsBucketNumber(tjs.TechCode) = 0





