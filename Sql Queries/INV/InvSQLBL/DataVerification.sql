select t.*,  tl.*, o2i.*,o2iu.*, u.* from 
tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnOut2In o2i on tl.InvTxnLineId = o2i.InvTxnLineOutId
inner join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = tl.InvTxnLineId and o2iu.InvTxnLineInId = o2i.InvTxnLineInId
left join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
where
t.InvTxnId ='F8710001'
order by t.CreatedDate

select * from tbl_InvTxnTransfer where InvTxnId = 'F8710001'

select t.*,  tl.*, o2i.*,o2iu.*, u.* from 
tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnOut2In o2i on tl.InvTxnLineId = o2i.InvTxnLineOutId
inner join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = tl.InvTxnLineId and o2iu.InvTxnLineInId = o2i.InvTxnLineInId
left join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
where
t.InvTxnId ='F8710002'
order by t.CreatedDate
select * from tbl_InvTxnTransfer where InvTxnId = 'F8710002'

------*****************************------------------




select t.*, tl.*,o2i.*,o2iu.*, u.* from 
tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnIn2Out o2i on tl.InvTxnLineId = o2i.InvTxnLineInId
inner join tbl_InvTxnIn2OutUnit o2iu on o2iu.InvTxnLineInId = tl.InvTxnLineId and o2iu.InvTxnLineOutId = o2i.InvTxnLineoutId and o2iu.InvTxnOldLineId = o2i.InvTxnOldLineId
inner join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
where
t.DocNo = 'MTNI-1407100002'
order by t.CreatedDate
select * from tbl_InvTxnTransfer where InvTxnId = 'D8710002'

select t.*, tl.*,o2i.*,o2iu.*, u.* from 
tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnIn2Out o2i on tl.InvTxnLineId = o2i.InvTxnLineInId
inner join tbl_InvTxnIn2OutUnit o2iu on o2iu.InvTxnLineInId = tl.InvTxnLineId and o2iu.InvTxnLineOutId = o2i.InvTxnLineoutId and o2iu.InvTxnOldLineId = o2i.InvTxnOldLineId
inner join tbl_InvTxnUnit u on o2iu.InvTxnUnitId = u.InvTxnUnitId
where
t.DocNo = 'MTNI-1407100001'
order by t.CreatedDate

select * from tbl_InvTxnTransfer where InvTxnId = 'D8710001'