select
tjsOrgTC.WONumber ,tjsOrgTC.WorkorderType,tjsOrgTC.TechCode , tjsNewTC.WONumber , u.SerialNo1,p.ProductName
from
tbl_Data_Job_Setup tjsNewTC
inner join tbl_Data_Job_Setup tjsOrgTC on tjsNewTC.CustomerID = tjsOrgTC.CustomerID
inner join tbl_Wo2InvTxn w2i on tjsOrgTC.WONumber = w2i.WoNumber
inner join tbl_InvTxnLine txnLine on txnLine.InvTxnId = w2i.InvTxnId
inner join tbl_Product p on txnLine.ProductId = p.ProductId
inner join tbl_ProductCategory pc on p.CategoryId = pc.CategoryId
inner join tbl_InvTxnOut2InUnit o2i on txnLine.InvTxnLineId = o2i.InvTxnLineOutId
inner join tbl_InvTxnUnit u on o2i.InvTxnUnitId = u.InvTxnUnitId
where
tjsOrgTC.WorkorderType in ('TC' , 'SC')
and
tjsOrgTC.WorkorderType in ('TC' , 'SC')
and
tjsOrgTC.CSGStatus in ('C' , 'D')
and
datediff(Day,tjsOrgTC.CSGLastChangedDate, tjsNewTC.saledate) <= 60
and 
datediff(Day,tjsOrgTC.CSGLastChangedDate, tjsNewTC.saledate) >= 0
and
pc.Description like 'REC%'
and
tjsOrgTC.CSGLastChangedDate >= '09/01/2010'
and
tjsOrgTC.CSGLastChangedDate <= '09/23/2010'