select * from tbl_InvTxnUnit where SerialNo1 like 'DPPTC29222%'

select * from tbl_invtxnunit where serialno1 like '%DPPTC29222%'

select serialno1,len(serialno1) from tbl_invtxnunit where serialno1 like '%WAEEAMG3MW6A%'

declare @NewLine char(2) 
set @NewLine=char(13)+char(10)
update tbl_InvTxnUnit 
     set SerialNo1 =Replace(SerialNo1 , @NewLine,'')
WHERE SerialNo1 like '%' +@NewLine +'%'

declare @NewLine char(2) 
set @NewLine=char(13)+char(10)

select * from tbl_InvTxnUnit where serialno1 like '%' + @NewLine+ '%'

