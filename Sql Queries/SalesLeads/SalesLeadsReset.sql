select * from tbl_SalesLeads_Customers
select * from tbl_SalesLeads_LeadsMaster
select * from tbl_SalesLeads_LeadsNotes

/*
truncate table tbl_SalesLeads_LeadsNotes

delete from tbl_SalesLeads_LeadsMaster
dbcc checkident(tbl_SalesLeads_LeadsMaster , reseed , 0)

delete from tbl_SalesLeads_Customers
dbcc checkident(tbl_SalesLeads_Customers , reseed , 0)


*/

update tbl_SalesLeads_LeadsMaster set ModifiedBy = '1378' 