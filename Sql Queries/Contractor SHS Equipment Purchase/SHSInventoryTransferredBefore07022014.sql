
select
tts.TechCode , tts.TechName ,p.ProductId, p.ProductName,  t.DocDate as ReceivedDate, u.SerialNo1 as Serial
from
tbl_InvTxn t 
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join tbl_InvTxnUnit u on tl.InvTxnLineId = u.InvTxnLineId
left join tbl_InvTxnOut2InUnit o2iu on u.InvTxnUnitId = o2iu.InvTxnUnitId
inner join TTSView tts on t.Consignee = tts.TechInvParticipantId
where 
o2iu.InvTxnLineOutId is null
and p.CategoryId = 28
and dbo.udf_IsContractor(tts.techcode , 0) <> ''
and t.DocDate < '07/02/2014'


union

select
tts.TechCode , tts.TechName ,p.ProductId, p.ProductName,  tIn.DocDate as ReceivedDate, u.SerialNo1 as Serial
from
tbl_InvTxn t 
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join tbl_InvTxnUnit u on tl.InvTxnLineId = u.InvTxnLineId
left join tbl_InvTxnOut2InUnit o2iu on u.InvTxnUnitId = o2iu.InvTxnUnitId
inner join TTSView tts on t.Consignee = tts.TechInvParticipantId
inner join tbl_InvTxnUnit uIn on u.SerialNo1 = uin.SerialNo1
inner join tbl_InvTxnIn2OutUnit i2ou on uIn.InvTxnUnitId = i2ou.InvTxnUnitId
inner join tbl_InvTxnLine lineIn on i2ou.InvTxnLineInId = lineIn.InvTxnLineId
inner join tbl_InvTxn tIn on lineIn.InvTxnId = tin.InvTxnId
inner join TTSView ttsIn on ttsIn.VendorId in (select VendorId from tbl_Data_Employees where TechNumber = tts.TechCode)
inner join tbl_InvTxnUnit uOut on uin.SerialNo1 = uOut.SerialNo1
inner join tbl_InvTxnOut2InUnit o2iuOut on uOut.InvTxnUnitId = o2iuOut.InvTxnUnitId
inner join tbl_InvTxnLine tlOut on o2iuOut.InvTxnLineOutId = tlOut.InvTxnLineId
inner join tbl_InvTxn tOut on tlOut.InvTxnId = tOut.InvTxnId
inner join TTSView ttsOut on ttsOut.VendorId in (select VendorId from tbl_Data_Employees where TechNumber = tts.TechCode)
where 
o2iu.InvTxnLineOutId is null
and p.CategoryId = 28
and dbo.udf_IsContractor(tts.techcode , 0) <> ''
and t.DocDate >= '07/02/2014'
and tIn.DocType = 25
and tIn.DocDate < '07/02/2014'
and tin.Consignee = ttsIn.TechInvParticipantId
and tout.DocType = 36
and tOut.DocDate >= '07/02/2014'
and tOut.Consigner = ttsOut.TechInvParticipantId

order by TechCode , ProductId asc