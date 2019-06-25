declare @startDate datetime = '07/01/2012'                                           
 declare @endDate datetime = '12/31/2012'                                             
 

select
datename(month,txn.DocDate)as 'Mobnth', sum(line.Quantity) as Quantity , Sum (line.QUantity * poline.rate) as TotalPrice
from
tbl_InvTxn txn
inner join tbl_InvTxnLine line on txn.InvTxnId = line.InvTxnId
inner join tbl_InvTxnLinePOLine lineToPO on line.InvTxnLineId = lineToPo.InvTxnLineId
inner join tbl_POLine poline on lineToPO.POLineId = poline.POLineId
inner join tbl_PO po on po.POId = poline.POId
inner join tbl_Vendor v on po.VendorId = v.VendorId
inner join tbl_Product p on line.ProductId = p.ProductId
where
v.VendorName like '%Echosphere%'
and
txn.DocDate >= @startDate
and
txn.DocDate <= @endDate
and txn.Consignee = 2
group by
datename(month,txn.DocDate),datepart(month, txn.DocdatE) 
order by datepart(month, txn.DocdatE) asc