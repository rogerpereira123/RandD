select IT.invtxnId,itu.SerialNo1,IT.Doctype  

from  tbl_InvTxn IT inner join tbl_InvTxnline ITL on IT.invtxnid=ITL.invtxnid   

inner join tbl_InvTxnOut2Inunit ITO2U on ITO2U.invtxnlineOutid=ITL.invtxnlineid

left join tbl_InvtxnUnit itu on itu.InvTxnUnitId = ITO2U.InvTxnUnitId

where IT.DocType = 39 and itu.SerialNo1 = 'DPP2A81993'


select * from tbl_InvTxnUnit where SerialNo1= 'RBEGJT17336E'
select * from tbl_InvTxnUnit where SerialNo2= 'R0062764861'
select * from tbl_InvTxnUnit where SerialNo2= 'S001921573877'

select * from tbl_data_job_setup where WONumber = '45719000006009001'