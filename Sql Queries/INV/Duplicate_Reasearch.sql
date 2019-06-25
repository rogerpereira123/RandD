select t.*,  tl.*, o2i.*,o2iu.*, u.* from 
tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnOut2In o2i on tl.InvTxnLineId = o2i.InvTxnLineOutId
inner join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = tl.InvTxnLineId and o2iu.InvTxnLineInId = o2i.InvTxnLineInId
left join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
where
u.SerialNo1 ='AM152006540'

order by t.CreatedDate



select t.*, tl.*,o2i.*,o2iu.*, u.* from 
tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnIn2Out o2i on tl.InvTxnLineId = o2i.InvTxnLineInId
inner join tbl_InvTxnIn2OutUnit o2iu on o2iu.InvTxnLineInId = tl.InvTxnLineId and o2iu.InvTxnLineOutId = o2i.InvTxnLineoutId and o2iu.InvTxnOldLineId = o2i.InvTxnOldLineId
inner join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
where
u.SerialNo1 ='AM152006540'

order by t.CreatedDate



/*
 
--select * from tbl_InvTxnIn2OutUnit where InvTxnLineInId ='M8316ZGCL11' and InvTxnOldLineId = 'I8315ZW6L02' and InvTxnOldUnitId = 'I8315ZW6U03'  --remove
delete from  tbl_InvTxnIn2OutUnit where InvTxnLineInId ='M8316ZGCL11' and InvTxnOldLineId = 'I8315ZW6L02' and InvTxnOldUnitId = 'M8818ZQDU49'
--select * from tbl_InvTxnIn2Out where InvTxnLineInId ='M8316ZGCL11'  and  InvTxnLineOutId = 'K8316ZGCL11' and InvTxnOldLineId = 'I8315ZW6L02' --remove
--delete from tbl_InvTxnIn2Out where InvTxnLineInId ='M8316ZGCL11' and InvTxnOldLineID = '2'
update tbl_InvTxnIn2Out set Quantity = 2 where  InvTxnLineInId ='M8316ZGCL11'  and  InvTxnLineOutId = 'K8316ZGCL11' and InvTxnOldLineId = 'I8315ZW6L02'
--select * from tbl_InvTxnLine where InvTxnLineId = 'M8316ZGCL11' --set quantity 2
update tbl_InvTxnLine set Quantity = 6 where InvTxnLineId = 'M8316ZGCL11'



delete from tbl_InvTxnUnit where InvTxnUnitId = 'M8316ZGCU32' --remove

--select * from tbl_InvTxnOut2InUnit where InvTxnUnitId = 'I8315ZW6U03' and InvTxnLineInId = 'I8315ZW6L02' -- remove
delete tbl_InvTxnOut2InUnit  where InvTxnUnitId = 'I8315ZW6U03' and InvTxnLineInId = 'I8315ZW6L02'
--select * from tbl_InvTxnOut2In where InvTxnLineOutId = 'K8316ZGCL11' and InvTxnLineInId ='I8315ZW6L02' -- set quantity 1
update tbl_InvTxnOut2In set Quantity = 2 where InvTxnLineOutId = 'K8316ZGCL11' and InvTxnLineInId ='I8315ZW6L02'
delete tbl_InvTxnOut2In where InvTxnLineOutId = 'E8315ZW3L02' and InvTxnLineInId ='2'
--select * from tbl_InvTxnLine where InvTxnLineId = 'K8316ZGCL11' -- set quantity 3
update tbl_InvTxnLine set Quantity = 6 where InvTxnLineId = 'K8316ZGCL11'


delete from tbl_InvTxnUnit where InvTxnUnitId = 'I8315ZW6U03' --remove



select u.* from tbl_InvTxnUnit
u left join tbl_InvTxnOut2InUnit o2iu on u.InvTxnUnitId = o2iu.InvTxnUnitId
left join tbl_InvTxnIn2OutUnit i2ou on u.InvTxnUnitId = i2ou.InvTxnUnitId
left join tbl_InvTxnIn2OutUnit i2ouold on i2ouold.InvTxnOldUnitId = u.InvTxnUnitId where SerialNo1 = 'CLEAN26189'
and o2iu.InvTxnLineOutId is null
and i2ou.InvTxnLineInId is null
and i2ouold.InvTxnOldUnitId is null

*/