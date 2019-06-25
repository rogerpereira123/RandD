--select * from tbl_InvTxnDocTypeMaster
select
tts.TechCode, t.DocNo , tl.InvTxnLineId , tl.ProductId , p.ProductName , tl.Quantity , p.SellPrice  
from 
tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join TTSView tts on t.Consignee = tts.TechInvParticipantId
where 
tts.Active = 1
and dbo.udf_IsContractor(tts.TechCode , 0) <> ''
and t.DocDate between '07/02/2014' and '07/15/2014'
and p.CategoryId = 28
and t.DocType = 31
and tts.TechCode = '5202'
order by tts.TechCode , t.DocDate

--select * from tbl_InvTxnLineToConsigneeCharges