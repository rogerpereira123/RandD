declare @ProductId varchar(100) = '143397'
declare @Transactions table (WONumber varchar(20) , InvTxnId varchar(100))
insert into @Transactions
select distinct   w.WoNumber, t.InvTxnId from tbl_InvTxn t 
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId 
inner join tbl_Wo2InvTxn w on t.InvTxnId = w.InvTxnId
where 
t.DocDate >= '06/01/2012'
and
tl.ProductId = '143397'
and
t.DocType = 34
and 
w.WoNumber 
in (select distinct WoNumber from tbl_Mobility_EquipmentUtilized where Model = 'Component' and InsertDate > '06/01/2012')


select * from @Transactions
declare @InvTxnId varchar(100)
while(Exists(select * from @Transactions))
begin
	set @InvTxnId = (select top 1 InvTxnId from @Transactions)
	delete tbl_InvTxnOut2InUnit 
	from tbl_InvTxnLine tl where tl.InvTxnId = @InvTxnId and tl.ProductId = @ProductId
	and InvTxnLineOutId = tl.InvTxnLineId
	
	delete tbl_InvTxnOut2In 
	from tbl_InvTxnLine tl where tl.InvTxnId = @InvTxnId and tl.ProductId = @ProductId
	and InvTxnLineOutId = tl.InvTxnLineId
	
	delete tbl_InvTxnLine where InvTxnId = @InvTxnId and ProductId = @ProductId
	
	delete from @Transactions where InvTxnId = @InvTxnId
end


