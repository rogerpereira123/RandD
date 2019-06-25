declare @date varchar(10)
set @date = convert(varchar(10),getdate() - 30 ,101)
select @date
Execute usp_ImportRAsReceivers @date
Execute usp_ImportRasNonReceivers @date