
--Wh TO Tech Tx
select txn.CreatedBy, w.WarehouseName, tech.UserId ,tts.TechName, txn.CreatedDate, unit.SerialNo1,tts.Supervisor
from tbl_InvTxn txn inner join tbl_User u on txn.CreatedBy = u.UserId
inner join tbl_data_employees emp on u.EmployeeId = emp.EmployeeId
inner join tbl_warehouse w on txn.consigner = w.InvParticipantId
inner join tbl_user tech on txn.Consignee = tech.InvParticipantId
inner join tbl_TechToSupervisor tts on tech.UserId = tts.TechCode
inner join tbl_InvTxnLine line on txn.InvTxnId = line.InvTxnId
inner join tbl_InvTxnOut2InUnit o2i on line.InvTxnLineId = o2i.InvTxnLineOutId
inner join tbl_InvTxnUnit unit on o2i.InvTxnUnitId = unit.InvTxnUnitId
where
txn.DocType = 31
and
emp.DepartmentId = 6
and
convert(datetime,txn.DocDate,101) >= convert(datetime , '12/30/2009' ,101)
and
convert(datetime,txn.DocDate,101) <= convert(datetime , '01/05/2010' ,101)
order by tts.Supervisor,txn.CreatedDate

--Tech To Tech TX
select txn.CreatedBy, consigner.UserId as 'FromTech', tech.UserId  as 'ToTech', txn.CreatedDate, unit.SerialNo1,tts.Supervisor
from 
tbl_InvTxn txn inner join tbl_User u on txn.CreatedBy = u.UserId
inner join tbl_data_employees emp on u.EmployeeId = emp.EmployeeId
inner join tbl_user consigner on txn.consigner = consigner.InvParticipantId
inner join tbl_user tech on txn.Consignee = tech.InvParticipantId
inner join tbl_TechToSupervisor tts on tech.UserId = tts.TechCode
inner join tbl_InvTxnLine line on txn.InvTxnId = line.InvTxnId
inner join tbl_InvTxnOut2InUnit o2i on line.InvTxnLineId = o2i.InvTxnLineOutId
inner join tbl_InvTxnUnit unit on o2i.InvTxnUnitId = unit.InvTxnUnitId
where
txn.DocType = 36
and
emp.DepartmentId = 6
and
convert(datetime,txn.DocDate,101) >= convert(datetime , '12/30/2009' ,101)
and
convert(datetime,txn.DocDate,101) <= convert(datetime , '01/05/2010' ,101)

order by tts.Supervisor,txn.CreatedDate, txn.CreatedBy



--select * from tbl_InvTxn txn where convert(varchar(10) , txn.CreatedDate , 101) = '07/01/2008' and DocType = 36