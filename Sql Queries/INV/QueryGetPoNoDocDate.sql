Declare @serialno1 as varchar(50)

begin
set @serialno1='WBEGDRG768YA'


select description as CategoryName, PONo, convert(varchar(10),tbl_po.PODate,101) as PODate,DocNo, convert(varchar(10),tbl_invtxn.DocDate,101) as DateReceived,
ProductName,serialno1 as SerialNumber
from tbl_po
inner join tbl_poline on tbl_po.POId=tbl_poline.POId
inner join tbl_InvTxnLinePOLine on tbl_poline.Polineid=tbl_InvTxnLinePOLine.Polineid
inner join tbl_invtxnline on tbl_InvTxnLinePOLine.invtxnlineid=tbl_invtxnline.invtxnlineid
inner join tbl_invtxnunit on tbl_invtxnline.invtxnlineid=tbl_invtxnunit.invtxnlineid
inner join tbl_invtxn on tbl_invtxnline.invtxnid=tbl_invtxn.invtxnid
inner join tbl_product on tbl_poline.productId=tbl_product.productId
inner join tbl_productcategory on tbl_product.categoryId=tbl_productcategory.categoryId

where DocType =21 and serialno1=@serialno1

end