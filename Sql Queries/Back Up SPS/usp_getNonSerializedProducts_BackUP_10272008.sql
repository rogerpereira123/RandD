set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[usp_getNonSerializedProducts]               
@vchar_ProductId varchar(50) ,                  
@bigint_InvParticipantId bigint    
/******************************************************************************************************                          
 Purpose:                             
 Created By: Prakash                     
 Created Date: 21-Jun-2007                          
 Last Modified By: Kiran                            
 Last Modified Date: 23 Jul 2008                           
 Change History:   For Tech Audit NonSerialized Product                        
 Table Used:                         
******************************************************************************************************/  
as                  
Begin                  
if(@vchar_ProductId is not null)  
begin                  
Select IL.InvTxnId,IL.InvTxnLineId,IT.DocNo,IT.DocDate,IL.ProductId,        
(IU.Quantity-sum(isnull(ITO2I.Quantity,0))) as Quantity              
,IU.InvTxnUnitId               
from tbl_InvtxnUnit IU        
left join tbl_InvTxnOut2InUnit ITO2I on IU.InvTxnUnitId=ITO2I.InvTxnUnitId           
 inner join tbl_InvTxnLine IL on  IU.InvTxnLineId =IL.InvTxnLineId                  
inner join tbl_Product P on P.ProductId = IL.ProductId          
inner join tbl_InvTxn IT on IL.InvTxnId= IT.InvTxnId        
where              
P.IsSerialized = 0 and IT.Consignee = @bigint_InvParticipantId                  
and IL.ProductId =  @vchar_ProductId             
Group By IL.InvTxnId,IL.InvTxnLineId,IT.DocNo,IT.DocDate,IL.ProductId,IU.Quantity,IU.InvTxnUnitId             
having (IU.Quantity-sum(isnull(ITO2I.Quantity,0))) > 0            
order by DocDate, IU.InvTxnUnitId asc                   
end  
else  
begin  
Select IL.InvTxnId,IL.InvTxnLineId,IT.DocNo,IT.DocDate,IL.ProductId,        
(IU.Quantity-sum(isnull(ITO2I.Quantity,0))) as Quantity              
,IU.InvTxnUnitId               
from tbl_InvtxnUnit IU        
left join tbl_InvTxnOut2InUnit ITO2I on IU.InvTxnUnitId=ITO2I.InvTxnUnitId           
 inner join tbl_InvTxnLine IL on  IU.InvTxnLineId =IL.InvTxnLineId                  
inner join tbl_Product P on P.ProductId = IL.ProductId          
inner join tbl_InvTxn IT on IL.InvTxnId= IT.InvTxnId        
where          
P.IsSerialized = 0 and IT.Consignee = @bigint_InvParticipantId   
Group By IL.InvTxnId,IL.InvTxnLineId,IT.DocNo,IT.DocDate,IL.ProductId,IU.Quantity,IU.InvTxnUnitId             
having (IU.Quantity-sum(isnull(ITO2I.Quantity,0))) > 0            
order by DocDate, IU.InvTxnUnitId asc      
end                  
End          
  
  
  


