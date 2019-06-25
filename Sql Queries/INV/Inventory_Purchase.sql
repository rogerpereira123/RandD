select po.poNo,v.VendorName, po.createddate, tp.ProductName, pc.Description as Category ,poline.Quantity , poline.Rate  , (poline.Quantity * poline.Rate) as 'Total Amount'
from 
tbl_PO po 
inner join tbl_POLine poline on po.Poid = poline.poid
inner join tbl_vendor v on po.vendorid = v.vendorid
inner join tbl_product tp on poline.productid = tp.productid
inner join tbl_productcategory pc on tp.CategoryId = pc.CategoryId
where 
/*po.vendorid = 'ECH001'
and*/
po.CreatedDate >= '01/01/2008'
and
po.CreatedDate <= '01/31/2008'
and
pc.Categoryid in (1 , 3)
order by 
category,
po.createddate


--select * from tbl_Vendor where VendorName like '%Echo%'
--select * from tbl_ProductCategory


