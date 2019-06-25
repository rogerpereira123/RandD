Select tbl_InvTxnUnit.* from tbl_InvTxnUnit inner join (
select invtxnlineinid from tbl_invtxnout2inunit where invtxnlineoutid like 'E2124001%')
as out2in on tbl_InvTxnUnit.invtxnlineid=out2in.invtxnlineinid
