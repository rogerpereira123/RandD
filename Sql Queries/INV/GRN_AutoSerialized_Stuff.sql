

select * from tbl_InvTxnUnit where SerialNo1 = 'GRNO-1004160002'

select * from tbl_InvTxn where InvTxnId = 'D5412005'
select * from tbl_InvTxnLine where InvTxnLineId = 'D5412005L10'
select * from tbl_InvTxnIn2Out where InvTxnLineInId = 'D5412005L10' and InvTxnOldLineId = 'A4416002L04'
select * from tbl_InvTxnIn2OutUnit where InvTxnUnitId = 'D5412005U203'
select * from tbl_InvTxnUnit where InvTxnUnitId = 'D5412005U203'

/*select * from tbl_InvTxnLine where InvTxnLineId = 'M5C020R0L11'
update tbl_InvTxnLine set Quantity = 23 where  InvTxnLineId = 'D5412005L10'
delete from tbl_InvTxnIn2Out where InvTxnLineInId = 'D5412005L10' and InvTxnOldLineId = 'A4416002L04'
delete from tbl_InvTxnIn2OutUnit where InvTxnUnitId = 'D5412005U203'
delete from tbl_InvTxnUnit where InvTxnUnitId = 'D5412005U203'*/

select * from tbl_InvTxn where InvTxnId = 'E5A254BW'
select * from tbl_InvTxnLine where InvTxnLineId = 'F5411007L10'
select * from tbl_InvTxnOut2In where InvTxnLineOutId = 'F5411007L10' and InvTxnLineInId = 'A4416002L04'
select * from tbl_InvTxnOut2InUnit where InvTxnUnitId = 'A4416002U04'
select * from tbl_InvTxnUnit where InvTxnUnitId = 'A4416002U04'

/*select * from tbl_InvTxnLine where InvTxnLineId = 'F5525004L12'
update tbl_InvTxnLine set Quantity = 23 where  InvTxnLineId = 'F5411007L10'
delete from tbl_InvTxnOut2In where InvTxnLineOutId = 'F5411007L10' and InvTxnLineInId = 'A4416002L04'
delete from tbl_InvTxnOut2InUnit where InvTxnUnitId = 'A4416002U04'
delete from tbl_InvTxnUnit where InvTxnUnitId = 'A4416002U04'*/