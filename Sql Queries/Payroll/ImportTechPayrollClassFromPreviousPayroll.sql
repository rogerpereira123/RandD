declare @startDate datetime
set @startDate = getdate()
use northware
insert into tbl_TechToPayrollClass
select 
TechCode,
convert(datetime, convert(varchar(10) , @startDate , 101) ,101),
convert(datetime, convert(varchar(10),dateadd(day,13, @startDate) ,101) ,101),
InvoiceClassID
from tbl_TechToPayrollClass
where
StartDate  = convert(datetime, convert(varchar(10) , dateadd(day,-14,@startDate) , 101) ,101)
and
EndDate = convert(datetime, convert(varchar(10) , dateadd(day,-1, @startDate) , 101) ,101)
and
TechCode not in (select TechCode from tbl_TechToPayrollClass where StartDate =convert(datetime, convert(varchar(10) , @startDate , 101) ,101) )




