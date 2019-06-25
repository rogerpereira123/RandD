update tbl_InvoiceServiceCodeMaster set 
InvoiceServiceCodeDesc = 'Install' where InvoiceServiceCode = 'IN'

insert into tbl_InvoiceClassMaster values('M8' , 'Multi Employee Contractor')

insert into tbl_InvoiceServiceCodeMaster 
values ('IN1' , 'Install for SHS >= $10/job' , '000')
insert into tbl_InvoiceServiceCodeMaster 
values ('IN2' , 'Install for SHS >= $9/job' , '000')
insert into tbl_InvoiceServiceCodeMaster 
values ('IN3' , 'Install for SHS >= $8/job' , '000')
insert into tbl_InvoiceServiceCodeMaster 
values ('IN4' , 'Install for SHS >= $7/job' , '000')
insert into tbl_InvoiceServiceCodeMaster 
values ('IN5' , 'Install for SHS < $7/job' , '000')



insert into tbl_InvoiceServiceCodeMatrix values ('M8' , 'IN1' , 125)
insert into tbl_InvoiceServiceCodeMatrix values ('M8' , 'IN2' , 120)
insert into tbl_InvoiceServiceCodeMatrix values ('M8' , 'IN3' , 115)
insert into tbl_InvoiceServiceCodeMatrix values ('M8' , 'IN4' , 110)
insert into tbl_InvoiceServiceCodeMatrix values ('M8' , 'IN5' , 105)
insert into tbl_InvoiceServiceCodeMatrix 
select 'M8' , InvoiceServiceCode , value from tbl_InvoiceServiceCodeMatrix where InvoiceServiceCode <> 'IN' and InvoiceClassId = 'M7'

select * from tbl_TechToPayrollClass where StartDate >= '12/31/2014' and InvoiceClassId = 'M8'
--update tbl_TechToPayrollClass set InvoiceclassId = 'M8' where StartDate >= '12/31/2014' and InvoiceClassId = 'M7'