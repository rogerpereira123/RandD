 
Begin 

SELECT distinct 
   ITl.ProductId,P.ProductName,ITU.serialno1,ITU.Serialno2
   into #Unit28	
   FROM tbl_InvTxn IT  
   INNER JOIN tbl_InvTxnLine ITL ON IT.InvTxnId = ITL.InvTxnId                   

   INNER JOIN tbl_InvTxnUnit ITU ON ITL.invtxnlineid=ITU.invtxnlineid
   INNER JOIN tbl_Product P ON P.ProductId=ITL.ProductId  
   left join tbl_invtxnin2outunit in2outu on itu.invtxnlineid=in2outu.invtxnlineinid
   and itu.invtxnunitid=in2outu.invtxnunitid 

   where it.doctype=28 	and in2outu.invtxnlineinid is null
   and in2outu.invtxnunitid is null --and serialno1='RBEVAS07307L'

 select  #Unit28.* from #Unit28

left join (

   SELECT distinct  ITU.serialno1 as InstalledSerialNumber
   FROM tbl_InvTxn IT  
   INNER JOIN tbl_InvTxnLine ITL ON IT.InvTxnId = ITL.InvTxnId                   
   INNER JOIN tbl_InvTxnOut2InUnit ITU2I ON ITL.InvTxnLineId=ITU2I.InvTxnLineOutId  
   INNER JOIN tbl_InvTxnUnit ITU ON ITU2I.InvTxnUnitId=ITU.InvTxnUnitId
   WHERE DocType = 34 --and ltrim(rtrim(serialno1)) like 'RBEVAS07307L%'
	)as Unit34
on ltrim(rtrim(#Unit28.serialno1))=ltrim(rtrim(Unit34.InstalledSerialNumber))

where Unit34.InstalledSerialNumber is null

drop table #Unit28


end
