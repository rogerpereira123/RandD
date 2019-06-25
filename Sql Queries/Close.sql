create Procedure usp_CloseWorkOrderWithEquipment
@WONumber varchar(20),
@ProductId varchar(50),
@SerialNumber varchar(50),
@IsRAed bit,
@UserId varchar(50)
as
begin
	declare @IsAutoSerialized bit = 0
	declare @InvTxnId varchar(50) = ''
	declare @InvTxnLineId varchar(50) = ''
		
	if(exists(select * from tbl_InvProductToPrefix where ProductId = @ProductId and IsActive = 1)) set @IsAutoSerialized = 1
	
	select	@InvTxnId = InvTxnId from tbl_Wo2InvTxn where WoNumber = @WONumber
	 
	if(@InvtxnId <> '')
	begin
		select @InvTxnLineId = MAX(InvTxnLineId) from tbl_InvTxnLine where InvTxnId = @InvTxnId
		
		set @InvTxnLineId = (select SUBSTRING(@InvTxnLineId , 1 , len(@InvTxnLineId)- 2) +
		case when LEN(SUBSTRING(@InvTxnLineId , len(@InvTxnLineId)- 1 ,len(@InvTxnLineId)) + 1) = 1 then  '0' + ltrim(str(SUBSTRING(@InvTxnLineId , len(@InvTxnLineId)- 1 ,len(@InvTxnLineId)) + 1))
		else ltrim(str(SUBSTRING(@InvTxnLineId , len(@InvTxnLineId)- 1 ,len(@InvTxnLineId)) + 1 )) end)
		
		exec usp_GetSerialNumbersFromQuantity 
		
			
		
	end
	
end