select
t.DocNo , t.DocDate , w.WarehouseName as Consigner , tts.TechCode as Consignee , tl.ProductId , p.ProductName , tl.Quantity 
from tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId 
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join TTSView tts on t.consignee = tts.TechInvParticipantId
inner join tbl_Warehouse w on t.consigner = w.InvParticipantId
where 
t.DocType = 31
and tts.TechCode= 'william.hawkins1'
and p.CategoryId = 28
and t.DocDate between '07/01/2014' and '05/13/2015'

select
t.DocNo , t.DocDate , w.WarehouseName as Consigner , tts.TechCode as Consignee , tl.ProductId , p.ProductName , tl.Quantity 
from tbl_InvTxn t
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId 
inner join tbl_Product p on tl.ProductId = p.ProductId
inner join TTSView tts on t.consignee = tts.TechInvParticipantId
inner join tbl_Warehouse w on t.consigner = w.InvParticipantId
where 
t.DocType = 31
and tts.TechCode= 'Jon.Abramczyk'
and p.CategoryId = 28
and t.DocDate between '07/01/2014' and '05/13/2015'
