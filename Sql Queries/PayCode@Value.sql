declare @i int
set @i = 1
while (@i <= 29)
begin
insert into tbl_InvoicePayrollcodeToValue 
values ('MECON', @i , null)

/*update tbl_InvoicePayrollcodeToValue 
set 
value = i1.value
from tbl_InvoicePayrollcodeToValue i1 
where 
InvoiceTypeId = '2C'
and
InvoicePayrollId = @i
and
i1.InvoiceTypeId = '1C'
and
i1.InvoicePayrollId = @i*/


set @i = @i + 1
end

