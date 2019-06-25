	
Declare @Serialno1 as varchar(50)

begin
set @serialno1='RBEGDT00994H'


             select 
	     case 	
             when a.doctype=21 then 'From Vendor' 
             when a.doctype=22 then 'Return From Tech' 
             when a.doctype=24 then 'Warehouse Receive from Warehouse' 
             when a.doctype=25 then 'Tech Receive From Warehouse' 
             when a.doctype=26 then 'Tech Receive From Tech' 
             when a.doctype=27  then 'Tech Reissue' 
             when a.doctype=28 then 'Southware to Northware Receive' 
	     end as TransactionType,d.serialno1,

a.docno,a.docdate,dbo.usp_getConsigneeName(a.consignee) as ToParty,
		dbo.usp_getConsigneeName(a.Consigner) as FromParty,a.createddate, a.createdby,		
	    a.invtxnid,b.invtxnlineid,
	  
             case  
             when a.doctype=21 then 'A' 
             when a.doctype=22 then 'D' 
             when a.doctype=24 then 'C' 
             when a.doctype=25 then 'B' 
             when a.doctype=26 then 'E' 
             when a.doctype=27  then 'F' 
             when a.doctype=28 then 'A' 
             else 'X' end as TxnOrder
             from tbl_invtxn a inner join tbl_invtxnline b 
             on a.invtxnid=b.invtxnid inner join tbl_invtxnunit d on b.invtxnlineid=d.invtxnlineid 
             left join tbl_invtxnin2outunit e on d.invtxnunitid = e.invtxnunitid 
		where d.serialno1=@Serialno1 and a.Doctype not in (25 , 26)

             union 
             select

             case 
             when a.doctype=31 then 'Warehouse to Tech Transfer' 
             when a.doctype=32 then 'Warehouse to Warehouse Material Transfer' 
             when a.doctype=34 then 'Closed -Installed at Customer Place' 
             when  a.doctype=35 then 'Return From Tech to Warehouse' 
             when  a.doctype=36 then 'Tech to Tech Transfer' 
             when a.doctype=37 then 'Warehouse to Tech Reissue' 
	     end as TransactionType,d.serialno1,

		a.docno,a.docdate,dbo.usp_getConsigneeName(a.consignee) as FromParty,
		dbo.usp_getConsigneeName(a.Consigner) as ToParty,a.createddate, a.createdby,		
	   a.invtxnid,b.invtxnlineid,
	     case 
		when a.doctype=31 then 'B' 
		when a.doctype=32 then 'C' 
		when a.doctype=34 then 'G' 
		when  a.doctype=35 then 'D' 
		when  a.doctype=36 then 'E' 
		when a.doctype=37 then 'F' 
             else 'Y' end as TxnOrder
             from tbl_invtxn a inner join tbl_invtxnline b on a.invtxnid=b.invtxnid 
             inner join tbl_invtxnout2inunit c on b.invtxnlineid=c.invtxnlineoutid  
             inner join tbl_invtxnunit d on c.invtxnunitid=d.invtxnunitid 
            where d.serialno1=@Serialno1 and a.Doctype not in (25 , 26)

            order by a.createddate, txnorder
end





