set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
go

ALTER PROCEDURE [dbo].[usp_StockBalance_ByWarehouse]        
 @bigint_WarehousePartId bigint,          
 @vchar_ProductName varchar(255)     
      
AS          
if(@vchar_ProductName is null)          
begin          
set @vchar_ProductName='%'          
end          
else          
begin          
set @vchar_ProductName='%'+@vchar_ProductName+'%'          
end          
          
BEGIN    
          
 SELECT P.ProductID,          
  P.ProductName,          
  PC.description as CatagoryName,          
  U.description as UOM,P.CostPrice,        
  SUM(Quantity * (CASE WHEN DocType >=20 AND DocType < 30  THEN 1 ELSE -1 END)) BalQty,  
  P.IsSerialized           
 FROM tbl_InvTxn IT INNER JOIN tbl_InvTxnLine ITL ON IT.InvTxnId = ITL.InvTxnId          
 INNER JOIN tbl_Product P ON P.ProductId=ITL.ProductId          
 INNER JOIN tbl_productCategory PC on PC.CategoryId= P.CategoryId           
 INNER JOIN tbl_UOM U on U.UOMId= P.UOMId                          
       
 WHERE ((DocType >=20 AND DocType < 30 AND Consignee = @bigint_WarehousePartId)          
 OR (DocType >=30 AND DocType < 40 AND Consigner = @bigint_WarehousePartId))          
 AND P.ProductName LIKE @vchar_ProductName          
 GROUP BY P.ProductID,P.ProductName,PC.description,U.description,P.CostPrice,P.IsSerialized  
 Having  SUM(Quantity * (CASE WHEN DocType >=20 AND DocType < 30 THEN 1 ELSE -1 END)) <>0    
         
END  
  


