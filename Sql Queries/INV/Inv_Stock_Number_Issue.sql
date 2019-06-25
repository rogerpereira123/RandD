select * from tbl_InvTxnIn2OutUnit where InvTxnUnitId = 'I8928Z3IU07'
--update tbl_InvTxnIn2OutUnit set InvTxnOldLineId = 'D87294DLL08' where InvTxnUnitId = 'I8928Z3IU07'
select * from tbl_InvTxnIn2Out where InvTxnLineInId = 'I8928Z3IL05' and InvTxnLineoutId = 'E8928Z3EL05'
update tbl_InvTxnIn2Out set Quantity = 3 where InvTxnLineInId = 'I8928Z3IL05' and InvTxnLineoutId = 'E8928Z3EL05' and InvTxnOldLineId  = 'D89244MYL03'
insert into tbl_InvTxnIn2Out values ('I8928Z3IL05 ' ,'E8928Z3EL05' , 'D87294DLL08'  ,1)




select * from tbl_InvTxnOut2InUnit where InvTxnUnitId = 'D87294DLU85'
--update tbl_InvTxnOut2InUnit set InvTxnLineInId = 'D87294DLL08' where InvTxnUnitId = 'D87294DLU85'
select * from tbl_InvTxnOut2In where InvTxnLineOutId = 'E8928Z3EL05' and InvTxnLineInId = 'D89244MYL03'
insert into  tbl_InvTxnOut2In values('E8928Z3EL05' , 'D87294DLL08' , 1)
update tbl_InvTxnOut2In set Quantity = 3 where  InvTxnLineOutId = 'E8928Z3EL05' and InvTxnLineInId = 'D89244MYL03'

