

select ITU.SerialNo1 as SrNo, P.ProductName , P.ProductId , TUSER.UserId , tts.TechName , ttl.Location_Id , tl.Location from 
		tbl_InvTxn IT
	INNER JOIN tbl_InvTxnLine ITL ON IT.InvTxnId = ITL.InvTxnId    
   	INNER JOIN tbl_InvTxnUnit ITU ON ITL.InvTxnLineId=ITU.InvTxnLineId    
   	INNER JOIN tbl_Product P ON P.ProductId=ITL.ProductId 
	INNER JOIN tbl_User TUSER ON IT.Consignee = TUSER.InvParticipantId   
    inner join tbl_TechToLocation ttl on TUSER.UserId = ttl.TechCode
	inner join tbl_Location tl on ttl.Location_id = tl.Location_Id
	inner join tbl_TechToSupervisor tts on TUSER.Userid = tts.TechCode
   	WHERE 
	P.ProductId in ('143091' , '147388' , '145822' , '114680' , '138493' , '134941' , '139927')	
   	AND ITU.InvTxnUnitId not in(Select distinct InvTxnUnitId from tbl_InvTxnOut2InUnit) 
order by UserId, ProductName