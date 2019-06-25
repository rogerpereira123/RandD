select * from tbl_user where userid = '3444'

select T.*, L.* , U.* from tbl_InvTxn T inner join tbl_InvTxnline L on T.InvTxnId = L.InvTxnId
inner join tbl_InvTxnUnit U on L.InvtxnLineId = U.InvTxnLineID
where U.SerialNo1 = 'FLATA03764'
order by createddate


select * from tbl_InvTxnLine where InvTxnLineId in ('Q2501005L01')
select * from tbl_InvTxn where InvTxnId = 'Q2501005'
select * from tbl_InvTxnLine where InvTxnId = 'Q2501005'


select * from tbl_InvTxnUnit where SerialNo1 = 'FLATA03764'
update tbl_InvTxn set Consignee = 204557 where InvTxnId = 'I230400L'

select * from tbl_User where InvParticipantId = 4297636
select * from tbl_InvParticipant where InvParticipantId =55237

select* from tbl_Warehouse 

select * from tbl_InvTxnOut2InUnit where InvTxnUnitId in ('I250205CU01','I250205CU03','Q2501005U01')
select * from tbl_InvTxnIn2OutUnit where InvTxnUnitId in ('I250205CU01','I250205CU03','Q2501005U01')


delete from tbl_InvTxnIn2OutUnit where InvTxnUnitId = 'A2305007U78'
delete from tbl_InvTxnOut2inUnit where InvTxnUnitId = 'D2124004U180'

E212803DL02	D2124004L10	D2124004U180	1
select dbo.IsSerialNumberClosed('WAEDAMACV86J')

select * from tbl_Wo2InvTxn where WoNumber = '45822148100021005'