insert into tbl_WarehouseToMinOpenDocDate
select
 w.InvParticipantId, min(d.DocDate)
  from tbl_invtxnunit a left join tbl_invtxnout2inunit b                            
   on a.invtxnunitid=b.invtxnunitid -- and a.invtxnlineid=b.invtxnlineinid                                   
   inner join tbl_invtxnline c on a.invtxnlineid =  c.invtxnlineid                            
   inner join tbl_invtxn d on c.invtxnid = d.invtxnid                            
   inner join tbl_product e on c.productid = e.productid      
   inner join tbl_Warehouse w on w.InvParticipantId = d.Consignee                      
 where 
 e.isserialized = 1 
 and b.InvTxnUnitId is null
and w.IsActive = 1
group by w.InvParticipantId